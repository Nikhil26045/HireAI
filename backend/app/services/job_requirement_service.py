import uuid

from sqlalchemy.orm import Session

from app.models.job_requirement import JobRequirement


def create_job_requirement(
    db: Session,
    job_id: uuid.UUID,
    requirement_type: str,
    requirement_name: str,
    importance: int,
) -> JobRequirement:
    requirement = JobRequirement(
        job_id=job_id,
        requirement_type=requirement_type,
        requirement_name=requirement_name,
        importance=importance,
    )

    db.add(requirement)
    db.commit()
    db.refresh(requirement)

    return requirement


def get_job_requirement_by_id(
    db: Session,
    requirement_id: uuid.UUID,
) -> JobRequirement | None:
    return (
        db.query(JobRequirement)
        .filter(JobRequirement.id == requirement_id)
        .first()
    )


def get_requirements_by_job(
    db: Session,
    job_id: uuid.UUID,
) -> list[JobRequirement]:
    return (
        db.query(JobRequirement)
        .filter(JobRequirement.job_id == job_id)
        .order_by(JobRequirement.created_at.asc())
        .all()
    )


def update_job_requirement(
    db: Session,
    requirement: JobRequirement,
    update_data: dict,
) -> JobRequirement:
    for field, value in update_data.items():
        setattr(requirement, field, value)

    db.commit()
    db.refresh(requirement)

    return requirement


def delete_job_requirement(
    db: Session,
    requirement: JobRequirement,
) -> None:
    db.delete(requirement)
    db.commit()