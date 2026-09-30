import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CandidateCreate(BaseModel):
    first_name: str
    last_name: str
    phone: str | None = None
    location: str | None = None
    profile_image_url: str | None = None


class CandidateUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    location: str | None = None
    profile_image_url: str | None = None


class CandidateResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    first_name: str
    last_name: str
    phone: str | None
    location: str | None
    profile_image_url: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)