import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TranscriptionResponse(BaseModel):
    id: uuid.UUID
    response_id: uuid.UUID
    transcript_text: str
    language: str | None
    model_name: str | None
    model_version: str | None
    processing_time_seconds: float | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AIEvaluationResponse(BaseModel):
    id: uuid.UUID
    response_id: uuid.UUID
    relevance_score: float | None
    technical_score: float | None
    completeness_score: float | None
    communication_score: float | None
    semantic_score: float | None
    overall_response_score: float | None
    feedback: str | None
    model_name: str | None
    model_version: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ScoreBreakdownResponse(BaseModel):
    id: uuid.UUID
    candidate_score_id: uuid.UUID
    category: str
    score: float
    weight: float | None
    explanation: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CandidateScoreResponse(BaseModel):
    id: uuid.UUID
    application_id: uuid.UUID
    resume_score: float | None
    interview_score: float | None
    job_relevance_score: float | None
    overall_score: float | None
    scoring_model: str | None
    model_version: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)