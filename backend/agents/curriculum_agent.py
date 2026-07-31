from fastapi import APIRouter, HTTPException
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date
from dotenv import load_dotenv
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

# ─── Input schemas ────────────────────────────────────────────────────────────
class SubtopicInput(BaseModel):
    name: str

class TopicInput(BaseModel):
    name: str
    subtopics: List[SubtopicInput]
    examWeightPercent: float

class CurriculumRequest(BaseModel):
    subject_id: str
    user_id: str
    exam_date: date
    topics: List[TopicInput]
    daily_study_hours: Optional[float] = Field(default=3.0)

# ─── Output schemas ───────────────────────────────────────────────────────────
class StudySession(BaseModel):
    topic_name: str = Field(description="Main topic name for this session")
    subtopics: List[str] = Field(description="Subtopics to cover in this session")
    duration_minutes: int = Field(description="Estimated duration in minutes")
    session_goal: str = Field(description="What the student should achieve by end of session")
    is_revision: bool = Field(description="True if this is a revision session")

class DayPlan(BaseModel):
    day_number: int = Field(description="Day number starting from 1")
    date: str = Field(description="Calendar date as YYYY-MM-DD")
    sessions: List[StudySession] = Field(description="Study sessions for this day")
    milestone: Optional[str] = Field(default=None, description="Milestone achieved on this day if any, e.g. 'Unit 1 complete'")
    is_revision_day: bool = Field(description="True if this day is primarily for revision")

class StudyPlan(BaseModel):
    total_days: int = Field(description="Total number of study days in the plan")
    recommended_order: List[str] = Field(description="Recommended topic order based on dependency and exam weight")
    summary: str = Field(description="Brief summary of the overall study strategy")
    plan: List[DayPlan] = Field(description="Full day-by-day study plan")

# ─── LangChain setup ──────────────────────────────────────────────────────────
parser = PydanticOutputParser(pydantic_object=StudyPlan)

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an expert academic curriculum planner.

Given a list of topics with exam weightage and the number of days until the exam, produce a structured day-by-day study plan.

Follow these rules strictly:
1. Order topics by dependency — foundational topics come before advanced ones.
2. Allocate more days to higher-weightage topics proportionally.
3. Reserve the last 20% of days (minimum 2 days) purely for revision.
4. Insert a short revision session every 4-5 days to reinforce earlier material.
5. Each session must have a clear, actionable goal the student can verify.
6. Total daily session duration must not exceed the daily study hours limit (converted to minutes).
7. If fewer than 5 days remain, focus only on highest-weight topics.
8. Return only valid JSON matching the schema exactly. No markdown, no explanation.

{format_instructions}"""),
    ("human", """Create a study plan for the following:

Topics:
{topics}

Days until exam: {days_until_exam}
Daily study hours available: {daily_hours}
Plan start date: {start_date}
Exam date: {exam_date}
""")
])

llm = ChatOpenAI(
    model="gpt-4o",
    temperature=0,
    api_key=os.getenv("OPENAI_API_KEY")
)

chain = prompt | llm | parser

# ─── Helpers ──────────────────────────────────────────────────────────────────
def format_topics(topics: List[TopicInput]) -> str:
    lines = []
    for topic in topics:
        lines.append(f"- {topic.name} ({topic.examWeightPercent}% exam weight)")
        for sub in topic.subtopics:
            lines.append(f"    • {sub.name}")
    return "\n".join(lines)


def save_plan_to_db(plan: StudyPlan, request: CurriculumRequest) -> str:
    # Upsert the top-level plan — one active plan per subject per user
    plan_result = supabase.table("study_plans").upsert({
        "subject_id": request.subject_id,
        "user_id": request.user_id,
        "exam_date": request.exam_date.isoformat(),
        "total_days": plan.total_days,
        "recommended_order": plan.recommended_order,
        "summary": plan.summary,
        "status": "active"
    }, on_conflict="subject_id,user_id").execute()

    plan_id = plan_result.data[0]["id"]

    # Clear any previously generated days for this plan
    supabase.table("day_plans").delete().eq("study_plan_id", plan_id).execute()

    # Insert all days in one batch
    day_rows = [
        {
            "study_plan_id": plan_id,
            "day_number": day.day_number,
            "date": day.date,
            "milestone": day.milestone,
            "is_revision_day": day.is_revision_day
        }
        for day in plan.plan
    ]
    day_result = supabase.table("day_plans").insert(day_rows).execute()

    # Build a lookup from day_number -> inserted day id
    day_id_map = {row["day_number"]: row["id"] for row in day_result.data}

    # Insert all sessions in one batch
    session_rows = []
    for day in plan.plan:
        day_id = day_id_map[day.day_number]
        for session in day.sessions:
            session_rows.append({
                "day_plan_id": day_id,
                "topic_name": session.topic_name,
                "subtopics": session.subtopics,
                "duration_minutes": session.duration_minutes,
                "session_goal": session.session_goal,
                "is_revision": session.is_revision,
                "completed": False
            })

    if session_rows:
        supabase.table("study_sessions").insert(session_rows).execute()

    return plan_id

# ─── Routes ───────────────────────────────────────────────────────────────────
@router.post("/generate")
async def generate_plan(request: CurriculumRequest):
    today = date.today()
    days_until_exam = (request.exam_date - today).days

    if days_until_exam <= 0:
        raise HTTPException(status_code=400, detail="Exam date must be in the future.")

    # Run through LangChain
    try:
        study_plan = chain.invoke({
            "topics": format_topics(request.topics),
            "days_until_exam": days_until_exam,
            "daily_hours": request.daily_study_hours,
            "start_date": today.isoformat(),
            "exam_date": request.exam_date.isoformat(),
            "format_instructions": parser.get_format_instructions()
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Plan generation failed: {str(e)}")

    # Save to Supabase
    try:
        plan_id = save_plan_to_db(study_plan, request)
    except Exception as e:
        # Return the plan even if DB write fails so the frontend isn't blocked
        return {
            "plan_id": None,
            "study_plan": study_plan,
            "db_error": str(e)
        }

    return {
        "plan_id": plan_id,
        "study_plan": study_plan
    }


@router.get("/plan/{subject_id}/{user_id}")
async def get_plan(subject_id: str, user_id: str):
    result = (
        supabase.table("study_plans")
        .select("*, day_plans(*, study_sessions(*))")
        .eq("subject_id", subject_id)
        .eq("user_id", user_id)
        .eq("status", "active")
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="No active plan found for this subject.")

    return result.data


@router.patch("/plan/reorder")
async def reorder_day(plan_id: str, day_id: str, new_day_number: int, user_id: str):
    # Verify the plan belongs to this user
    plan = (
        supabase.table("study_plans")
        .select("id")
        .eq("id", plan_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not plan.data:
        raise HTTPException(status_code=403, detail="Plan not found or access denied.")

    # Get current day number of the day being moved
    moving = (
        supabase.table("day_plans")
        .select("day_number")
        .eq("id", day_id)
        .single()
        .execute()
    )
    if not moving.data:
        raise HTTPException(status_code=404, detail="Day not found.")

    old_day_number = moving.data["day_number"]

    if old_day_number == new_day_number:
        return {"message": "No change needed."}

    # Shift neighbouring days to make room, then place the moved day
    supabase.rpc("shift_day_numbers", {
        "p_plan_id": plan_id,
        "p_old": old_day_number,
        "p_new": new_day_number
    }).execute()

    supabase.table("day_plans").update({"day_number": new_day_number}).eq("id", day_id).execute()

    return {"message": "Day reordered.", "day_id": day_id, "new_day_number": new_day_number}