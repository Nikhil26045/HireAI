
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class EvaluatedResponseItem(BaseModel):
    response_id: UUID
    evaluation_id: UUID
    overall_response_score: float | None


class SkippedResponseItem(BaseModel):
    response_id: UUID
    reason: str


class FailedResponseItem(BaseModel):
    response_id: UUID
    reason: str


class SessionEvaluationResult(BaseModel):
    session_id: UUID
    application_id: UUID
    evaluated: list[EvaluatedResponseItem]
    skipped: list[SkippedResponseItem]
    failed: list[FailedResponseItem]


class CandidateScoreSummary(BaseModel):
    application_id: UUID
    resume_score: float | None
    interview_score: float | None
    job_relevance_score: float | None
    overall_score: float | None
    scoring_model: str | None
    model_version: str | None

    model_config = ConfigDict(from_attributes=True)


class FinalEvaluationSummary(BaseModel):
    candidate_score: CandidateScoreSummary | None
    evaluated_responses: int
    evaluations: list[dict]
    component_weights: dict[str, float]
