import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class JobRequirementCreate(BaseModel):
    requirement_type: str
    requirement_name: str
    importance: int = Field(default=1, ge=1, le=5)


class JobRequirementResponse(BaseModel):
    id: uuid.UUID
    job_id: uuid.UUID
    requirement_type: str
    requirement_name: str
    importance: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)