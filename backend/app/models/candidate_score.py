import uuid

from sqlalchemy import DateTime, Float, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class CandidateScore(Base):
    __tablename__ = "candidate_scores"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("applications.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    resume_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    interview_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    job_relevance_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    overall_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    scoring_model: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    model_version: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
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

    application = relationship(
        "Application",
        back_populates="candidate_score",
    )

    breakdowns = relationship(
        "ScoreBreakdown",
        back_populates="candidate_score",
        cascade="all, delete-orphan",
    )