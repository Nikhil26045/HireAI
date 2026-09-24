import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class JobRequirementCreate(BaseModel):
    job_id: uuid.UUID
    requirement_type: str
    requirement_name: str
    importance: int = Field(ge=1, le=5)


class JobRequirementUpdate(BaseModel):
    requirement_type: str | None = None
    requirement_name: str | None = None
    importance: int | None = Field(default=None, ge=1, le=5)


class JobRequirementResponse(BaseModel):
    id: uuid.UUID
    job_id: uuid.UUID
    requirement_type: str
    requirement_name: str
    importance: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)