import uuid

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class JobRequirement(Base):
    __tablename__ = "job_requirements"

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

    requirement_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    requirement_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    importance: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    job = relationship(
        "Job",
        back_populates="requirements",
    )