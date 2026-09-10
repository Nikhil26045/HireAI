import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.application import ApplicationStatus


class ApplicationCreate(BaseModel):
    job_id: uuid.UUID
    resume_id: uuid.UUID | None = None


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationResponse(BaseModel):
    id: uuid.UUID
    job_id: uuid.UUID
    candidate_id: uuid.UUID
    resume_id: uuid.UUID | None
    status: ApplicationStatus
    applied_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)