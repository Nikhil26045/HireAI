import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.interview_response import (
    ResponseMediaType,
)
from app.models.interview_session import InterviewStatus


class InterviewQuestionSetCreate(BaseModel):
    job_id: uuid.UUID
    name: str
    description: str | None = None


class InterviewQuestionSetResponse(BaseModel):
    id: uuid.UUID
    job_id: uuid.UUID
    recruiter_id: uuid.UUID
    name: str
    description: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InterviewQuestionCreate(BaseModel):
    question_text: str
    question_type: str = "technical"
    expected_topics: list[str] | None = None
    max_score: int = Field(default=10, ge=1)
    sequence_number: int = Field(ge=1)


class InterviewQuestionResponse(BaseModel):
    id: uuid.UUID
    question_set_id: uuid.UUID
    question_text: str
    question_type: str
    expected_topics: list[str] | None
    max_score: int
    sequence_number: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InterviewSessionCreate(BaseModel):
    application_id: uuid.UUID
    question_set_id: uuid.UUID


class InterviewSessionStatusUpdate(BaseModel):
    status: InterviewStatus


class InterviewSessionResponse(BaseModel):
    id: uuid.UUID
    application_id: uuid.UUID
    question_set_id: uuid.UUID
    status: InterviewStatus
    started_at: datetime | None
    completed_at: datetime | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InterviewResponseResponse(BaseModel):
    id: uuid.UUID
    interview_session_id: uuid.UUID
    question_id: uuid.UUID
    media_url: str
    media_type: ResponseMediaType
    file_size: int | None
    duration_seconds: int | None
    response_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)