import enum
import uuid

from sqlalchemy import BigInteger, DateTime, Enum, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class ResumeProcessingStatus(str, enum.Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    file_name: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    file_url: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    file_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    file_size: Mapped[int | None] = mapped_column(
        BigInteger,
        nullable=True,
    )

    storage_provider: Mapped[str] = mapped_column(
        String(50),
        default="local",
        nullable=False,
    )

    processing_status: Mapped[ResumeProcessingStatus] = mapped_column(
        Enum(
            ResumeProcessingStatus,
            name="resume_processing_status",
        ),
        default=ResumeProcessingStatus.UPLOADED,
        nullable=False,
    )

    uploaded_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    processed_at: Mapped[DateTime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    candidate = relationship(
        "Candidate",
        back_populates="resumes",
    )

    parsed_resume = relationship(
        "ParsedResume",
        back_populates="resume",
        uselist=False,
        cascade="all, delete-orphan",
    )