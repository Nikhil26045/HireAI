import uuid

from sqlalchemy.orm import Session

from app.models.job import Job, JobStatus


def create_job(
    db: Session,
    recruiter_id: uuid.UUID,
    title: str,
    description: str,
    location: str | None = None,
    employment_type: str | None = None,
    experience_min: int | None = None,
    experience_max: int | None = None,
    education_requirement: str | None = None,
) -> Job:
    """
    Create a new job belonging to a recruiter.
    """

    job = Job(
        recruiter_id=recruiter_id,
        title=title,
        description=description,
        location=location,
        employment_type=employment_type,
        experience_min=experience_min,
        experience_max=experience_max,
        education_requirement=education_requirement,
        status=JobStatus.OPEN,
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return job


def get_job_by_id(
    db: Session,
    job_id: uuid.UUID,
) -> Job | None:
    """
    Retrieve a job by its ID.
    """

    return (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )


def get_jobs(
    db: Session,
    skip: int = 0,
    limit: int = 100,
) -> list[Job]:
    """
    Retrieve a paginated list of jobs.
    """

    return (
        db.query(Job)
        .order_by(Job.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_jobs_by_recruiter(
    db: Session,
    recruiter_id: uuid.UUID,
) -> list[Job]:
    """
    Retrieve all jobs created by a specific recruiter.
    """

    return (
        db.query(Job)
        .filter(Job.recruiter_id == recruiter_id)
        .order_by(Job.created_at.desc())
        .all()
    )


def update_job(
    db: Session,
    job: Job,
    update_data: dict,
) -> Job:
    """
    Update an existing job.
    """

    for field, value in update_data.items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)

    return job


def delete_job(
    db: Session,
    job: Job,
) -> None:
    """
    Delete a job.
    """

    db.delete(job)
    db.commit()