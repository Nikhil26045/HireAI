import uuid

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    question_set_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "interview_question_sets.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    question_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    question_type: Mapped[str] = mapped_column(
        String(50),
        default="technical",
        nullable=False,
    )

    expected_topics: Mapped[list | None] = mapped_column(
        JSONB,
        nullable=True,
    )

    max_score: Mapped[int] = mapped_column(
        Integer,
        default=10,
        nullable=False,
    )

    sequence_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    question_set = relationship(
        "InterviewQuestionSet",
        back_populates="questions",
    )

    responses = relationship(
        "InterviewResponse",
        back_populates="question",
    )