
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AIEvaluationResponse(BaseModel):
    id: UUID
    response_id: UUID

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


class InterviewEvaluationSummary(BaseModel):
    application_id: UUID
    interview_score: float | None
    evaluated_responses: int
    evaluations: list[AIEvaluationResponse]


class EvaluationErrorResponse(BaseModel):
    detail: str
