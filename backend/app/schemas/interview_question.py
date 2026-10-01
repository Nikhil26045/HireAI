from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# -------------------------
# Interview Question Schemas
# -------------------------

class InterviewQuestionCreate(BaseModel):
    question_text: str = Field(min_length=1)
    question_type: str = Field(default="technical", max_length=50)
    expected_topics: list[str] | None = None
    max_score: int = Field(default=10, gt=0)
    sequence_number: int = Field(ge=1)


class InterviewQuestionUpdate(BaseModel):
    question_text: str | None = Field(default=None, min_length=1)
    question_type: str | None = Field(default=None, max_length=50)
    expected_topics: list[str] | None = None
    max_score: int | None = Field(default=None, gt=0)
    sequence_number: int | None = Field(default=None, ge=1)


class InterviewQuestionResponse(BaseModel):
    id: UUID
    question_set_id: UUID
    question_text: str
    question_type: str
    expected_topics: list[str] | None
    max_score: int
    sequence_number: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -------------------------
# Interview Question Set Schemas
# -------------------------

class InterviewQuestionSetCreate(BaseModel):
    job_id: UUID
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None


class InterviewQuestionSetUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None


class InterviewQuestionSetResponse(BaseModel):
    id: UUID
    job_id: UUID
    recruiter_id: UUID
    name: str
    description: str | None
    created_at: datetime
    updated_at: datetime
    questions: list[InterviewQuestionResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)