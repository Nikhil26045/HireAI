import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.job import JobStatus


class JobCreate(BaseModel):
    title: str
    description: str
    location: str | None = None
    employment_type: str | None = None
    experience_min: int | None = None
    experience_max: int | None = None
    education_requirement: str | None = None


class JobUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    location: str | None = None
    employment_type: str | None = None
    experience_min: int | None = None
    experience_max: int | None = None
    education_requirement: str | None = None
    status: JobStatus | None = None


class JobResponse(BaseModel):
    id: uuid.UUID
    recruiter_id: uuid.UUID
    title: str
    description: str
    location: str | None
    employment_type: str | None
    experience_min: int | None
    experience_max: int | None
    education_requirement: str | None
    status: JobStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)