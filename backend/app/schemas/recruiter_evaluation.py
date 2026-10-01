import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.application import ApplicationStatus


class ScoreBreakdownResponse(BaseModel):
    id: uuid.UUID
    category: str
    score: float
    weight: float | None
    explanation: str | None

    model_config = ConfigDict(from_attributes=True)


class CandidateScoreResponse(BaseModel):
    id: uuid.UUID
    resume_score: float | None
    interview_score: float | None
    job_relevance_score: float | None
    overall_score: float | None
    scoring_model: str | None
    model_version: str | None
    breakdowns: list[ScoreBreakdownResponse] = []

    model_config = ConfigDict(from_attributes=True)


class RecruiterApplicantResponse(BaseModel):
    application_id: uuid.UUID
    candidate_id: uuid.UUID
    candidate_name: str
    candidate_email: str
    resume_id: uuid.UUID | None
    resume_file_name: str | None
    application_status: ApplicationStatus
    applied_at: datetime
    candidate_score: CandidateScoreResponse | None

    
class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus