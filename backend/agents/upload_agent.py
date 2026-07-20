from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pydantic import BaseModel, Field
from typing import List, Optional
from dotenv import load_dotenv
import pdfplumber
import docx
import os
from supabase import create_client

load_dotenv()

# ─── Supabase client ──────────────────────────────────────────────────────────
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

# ─── Router ───────────────────────────────────────────────────────────────────
router = APIRouter()

# ─── Output schema ────────────────────────────────────────────────────────────
class Subtopic(BaseModel):
    name: str = Field(description="Name of the subtopic")

class Topic(BaseModel):
    name: str = Field(description="Name of the main topic")
    subtopics: List[Subtopic] = Field(description="List of subtopics under this topic")
    examWeightPercent: float = Field(description="Estimated exam weightage percentage")

class TopicMap(BaseModel):
    topics: List[Topic] = Field(description="List of all topics extracted from the document")

# ─── Text extractors ──────────────────────────────────────────────────────────
def extract_text_from_pdf(file_bytes: bytes) -> str:
    import io
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def extract_text_from_docx(file_bytes: bytes) -> str:
    import io
    doc = docx.Document(io.BytesIO(file_bytes))
    return "\n".join([para.text for para in doc.paragraphs])

# ─── LangChain setup ──────────────────────────────────────────────────────────
parser = PydanticOutputParser(pydantic_object=TopicMap)

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an expert academic analyst.
Extract all topics and subtopics from the provided study material.
For each topic estimate the exam weightage percentage (all must add up to 100).
Return only valid JSON — no markdown, no explanation.
{format_instructions}"""),
    ("human", "Here is the study material:\n\n{text}")
])

llm = ChatOpenAI(
    model="gpt-4o",
    temperature=0,
    api_key=os.getenv("OPENAI_API_KEY")
)

embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    api_key=os.getenv("OPENAI_API_KEY")
)

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    length_function=len
)

chain = prompt | llm | parser

# ─── RAG pipeline ─────────────────────────────────────────────────────────────
async def store_embeddings(
    text: str,
    subject_id: str,
    user_id: str
):
    # Split into chunks
    chunks = text_splitter.split_text(text)

    # Generate embeddings for all chunks
    embedded_chunks = embeddings.embed_documents(chunks)

    # Store each chunk + embedding in Supabase
    rows = []
    for i, (chunk, embedding) in enumerate(zip(chunks, embedded_chunks)):
        rows.append({
            "subject_id": subject_id,
            "user_id": user_id,
            "content": chunk,
            "embedding": embedding,
            "metadata": {"chunk_index": i, "total_chunks": len(chunks)}
        })

    # Batch insert
    supabase.table("document_chunks").insert(rows).execute()
    return len(chunks)

# ─── Route ────────────────────────────────────────────────────────────────────
@router.post("/extract")
async def extract_topics(
    file: UploadFile = File(...),
    subject_id: Optional[str] = Form(None),
    user_id: Optional[str] = Form(None)
):
    # Read file
    file_bytes = await file.read()
    filename = file.filename.lower()

    # Extract text based on file type
    if filename.endswith(".pdf"):
        text = extract_text_from_pdf(file_bytes)
    elif filename.endswith(".docx"):
        text = extract_text_from_docx(file_bytes)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Upload PDF or DOCX.")

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file.")

    # Run topic extraction through LangChain
    try:
        topic_map = chain.invoke({
            "text": text[:8000],
            "format_instructions": parser.get_format_instructions()
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI extraction failed: {str(e)}")

    # Store topics + embeddings if subject_id and user_id provided
    if subject_id and user_id:
        # Store topics in DB
        for topic in topic_map.topics:
            result = supabase.table("topics").insert({
                "subject_id": subject_id,
                "name": topic.name,
                "weight": topic.examWeightPercent,
                "parent_id": None
            }).execute()

            parent_id = result.data[0]["id"]

            for subtopic in topic.subtopics:
                supabase.table("topics").insert({
                    "subject_id": subject_id,
                    "name": subtopic.name,
                    "weight": 0,
                    "parent_id": parent_id
                }).execute()

        # RAG pipeline — chunk + embed + store
        try:
            total_chunks = await store_embeddings(text, subject_id, user_id)
            return {
                "topic_map": topic_map,
                "rag": {
                    "status": "success",
                    "chunks_stored": total_chunks
                }
            }
        except Exception as e:
            # Don't fail the whole request if embedding fails
            return {
                "topic_map": topic_map,
                "rag": {
                    "status": "failed",
                    "error": str(e)
                }
            }

    return {"topic_map": topic_map, "rag": {"status": "skipped"}}