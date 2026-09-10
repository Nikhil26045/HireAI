import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.resume import ResumeProcessingStatus


class ResumeResponse(BaseModel):
    id: uuid.UUID
    candidate_id: uuid.UUID
    file_name: str
    file_url: str
    file_type: str
    file_size: int | None
    storage_provider: str
    processing_status: ResumeProcessingStatus
    uploaded_at: datetime
    processed_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class ParsedResumeResponse(BaseModel):
    id: uuid.UUID
    resume_id: uuid.UUID
    full_name: str | None
    email: str | None
    phone: str | None
    summary: str | None
    total_experience_years: int | None
    parsed_data: dict | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)