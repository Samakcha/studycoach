from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from agents.upload_agent import router as upload_router
import os

# Load environment variables
load_dotenv()

app = FastAPI(
    title="StudyCoach API",
    description="AI-powered study assistant backend",
    version="1.0.0"
)

# CORS — allows Next.js frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        os.getenv("FRONTEND_URL", ""),  # production Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check route
@app.get("/")
async def root():
    return {"status": "ok", "message": "StudyCoach API is running"}

app.include_router(upload_router, prefix="/agents/upload", tags=["Upload Agent"])