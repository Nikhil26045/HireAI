import uuid
from pathlib import Path

from sqlalchemy.orm import Session

from app.models.resume import Resume


def create_resume_record(
    db: Session,
    candidate_id: uuid.UUID,
    file_name: str,
    file_url: str,
    file_type: str,
) -> Resume:
    resume = Resume(
        candidate_id=candidate_id,
        file_name=file_name,
        file_url=file_url,
        file_type=file_type,
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume


def get_resume_by_id(
    db: Session,
    resume_id: uuid.UUID,
) -> Resume | None:
    return (
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .first()
    )


def get_resumes_by_candidate(
    db: Session,
    candidate_id: uuid.UUID,
) -> list[Resume]:
    return (
        db.query(Resume)
        .filter(Resume.candidate_id == candidate_id)
        .order_by(Resume.uploaded_at.desc())
        .all()
    )


def delete_resume_record(
    db: Session,
    resume: Resume,
) -> None:
    db.delete(resume)
    db.commit()