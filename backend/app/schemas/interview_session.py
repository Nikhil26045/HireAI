from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.interview_session import InterviewStatus
from app.schemas.interview_question import InterviewQuestionResponse


# ============================================================
# CREATE INTERVIEW
# ============================================================

class InterviewSessionCreate(BaseModel):
    application_id: UUID
    question_set_id: UUID


# ============================================================
# INTERVIEW RESPONSE
# ============================================================

class InterviewSessionResponse(BaseModel):
    id: UUID
    application_id: UUID
    question_set_id: UUID
    status: InterviewStatus
    started_at: datetime | None
    completed_at: datetime | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# INTERVIEW QUESTION SET DETAILS
# ============================================================

class InterviewSessionDetailResponse(InterviewSessionResponse):
    questions: list[InterviewQuestionResponse] = Field(
        default_factory=list
    )


# ============================================================
# CANDIDATE INTERVIEW RESPONSE
# ============================================================

class CandidateInterviewResponse(InterviewSessionResponse):
    job_title: str
    recruiter_name: str | None = None
    question_count: int = 0