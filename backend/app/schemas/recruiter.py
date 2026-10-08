import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RecruiterCreate(BaseModel):
    company_name: str
    company_description: str | None = None
    designation: str | None = None
    phone: str | None = None
    profile_image_url: str | None = None


class RecruiterUpdate(BaseModel):
    company_name: str | None = None
    company_description: str | None = None
    designation: str | None = None
    phone: str | None = None
    profile_image_url: str | None = None


class RecruiterResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    company_name: str
    company_description: str | None
    designation: str | None
    phone: str | None
    profile_image_url: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)