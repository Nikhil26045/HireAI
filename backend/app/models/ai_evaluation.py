import uuid

from sqlalchemy import DateTime, Float, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class AIEvaluation(Base):
    __tablename__ = "ai_evaluations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    response_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "interview_responses.id",
            ondelete="CASCADE",
        ),
        unique=True,
        nullable=False,
    )

    relevance_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    technical_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    completeness_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    communication_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    semantic_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    overall_response_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    feedback: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    model_name: Mapped[str | None] = mapped_column(
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

    response = relationship(
        "InterviewResponse",
        back_populates="ai_evaluation",
    )