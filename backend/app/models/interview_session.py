import enum
import uuid

from sqlalchemy import DateTime, Enum, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class InterviewStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    EXPIRED = "expired"


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    application_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("applications.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    question_set_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "interview_question_sets.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
    )

    status: Mapped[InterviewStatus] = mapped_column(
        Enum(InterviewStatus, name="interview_status"),
        default=InterviewStatus.SCHEDULED,
        nullable=False,
    )

    started_at: Mapped[DateTime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    completed_at: Mapped[DateTime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    application = relationship(
        "Application",
        back_populates="interview_sessions",
    )

    question_set = relationship(
        "InterviewQuestionSet",
    )

    responses = relationship(
        "InterviewResponse",
        back_populates="interview_session",
        cascade="all, delete-orphan",
    )