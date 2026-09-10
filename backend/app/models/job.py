import enum
import uuid

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class JobStatus(str, enum.Enum):
    DRAFT = "draft"
    OPEN = "open"
    CLOSED = "closed"
    ARCHIVED = "archived"


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    recruiter_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("recruiters.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    employment_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    experience_min: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    experience_max: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    education_requirement: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    status: Mapped[JobStatus] = mapped_column(
        Enum(JobStatus, name="job_status"),
        default=JobStatus.DRAFT,
        nullable=False,
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    recruiter = relationship(
        "Recruiter",
        back_populates="jobs",
    )

    requirements = relationship(
        "JobRequirement",
        back_populates="job",
        cascade="all, delete-orphan",
    )

    applications = relationship(
        "Application",
        back_populates="job",
        cascade="all, delete-orphan",
    )

    question_sets = relationship(
        "InterviewQuestionSet",
        back_populates="job",
        cascade="all, delete-orphan",
    )