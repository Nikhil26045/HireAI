from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class InterviewResponseResponse(BaseModel):
    id: UUID
    interview_session_id: UUID
    question_id: UUID
    media_url: str
    media_type: str
    file_size: int | None
    duration_seconds: int | None
    response_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InterviewResponseDetailResponse(
    InterviewResponseResponse
):
    question_text: str | None = None