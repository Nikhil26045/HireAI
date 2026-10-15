from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class TranscriptionResponse(BaseModel):
    id: UUID
    response_id: UUID
    transcript_text: str
    language: str | None
    model_name: str | None
    model_version: str | None
    processing_time_seconds: float | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TranscriptionJobResponse(BaseModel):
    response_id: UUID
    response_status: str
    message: str