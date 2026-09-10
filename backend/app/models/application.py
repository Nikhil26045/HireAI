import enum
import uuid

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class ApplicationStatus(str, enum.Enum):
    APPLIED = "applied"
    RESUME_PROCESSING = "resume_processing"
    INTERVIEW_PENDING = "interview_pending"
    INTERVIEW_COMPLETED = "interview_completed"
    UNDER_REVIEW = "under_review"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"


class Application(Base):
    __tablename__ = "applications"

    __table_args__ = (
        UniqueConstraint(
            "job_id",
            "candidate_id",
            name="uq_application_job_candidate",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    resume_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resumes.id", ondelete="SET NULL"),
        nullable=True,
    )

    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus, name="application_status"),
        default=ApplicationStatus.APPLIED,
        nullable=False,
    )

    applied_at: Mapped[DateTime] = mapped_column(
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

    job = relationship(
        "Job",
        back_populates="applications",
    )

    candidate = relationship(
        "Candidate",
        back_populates="applications",
    )

    resume = relationship(
        "Resume",
        foreign_keys=[resume_id],
    )

    interview_sessions = relationship(
        "InterviewSession",
        back_populates="application",
        cascade="all, delete-orphan",
    )

    candidate_score = relationship(
        "CandidateScore",
        back_populates="application",
        uselist=False,
        cascade="all, delete-orphan",
    )