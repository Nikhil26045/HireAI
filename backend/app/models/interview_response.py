import enum
import uuid

from sqlalchemy import (
    BigInteger,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class ResponseMediaType(str, enum.Enum):
    AUDIO = "audio"
    VIDEO = "video"


class ResponseStatus(str, enum.Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class InterviewResponse(Base):
    __tablename__ = "interview_responses"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    interview_session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "interview_sessions.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    question_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "interview_questions.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
    )

    media_url: Mapped[str] = mapped_column(
        String(2000),
        nullable=False,
    )

    media_type: Mapped[ResponseMediaType] = mapped_column(
        Enum(
            ResponseMediaType,
            name="response_media_type",
        ),
        nullable=False,
    )

    file_size: Mapped[int | None] = mapped_column(
        BigInteger,
        nullable=True,
    )

    duration_seconds: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    response_status: Mapped[ResponseStatus] = mapped_column(
        Enum(
            ResponseStatus,
            name="response_status",
        ),
        default=ResponseStatus.UPLOADED,
        nullable=False,
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    interview_session = relationship(
        "InterviewSession",
        back_populates="responses",
    )

    question = relationship(
        "InterviewQuestion",
        back_populates="responses",
    )

    transcription = relationship(
        "Transcription",
        back_populates="response",
        uselist=False,
        cascade="all, delete-orphan",
    )

    ai_evaluation = relationship(
        "AIEvaluation",
        back_populates="response",
        uselist=False,
        cascade="all, delete-orphan",
    )