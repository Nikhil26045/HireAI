import uuid

from sqlalchemy.orm import Session, joinedload

from app.models.application import Application
from app.models.candidate_score import CandidateScore
from app.models.job import Job


def get_recruiter_job(
    db: Session,
    job_id: uuid.UUID,
    recruiter_id: uuid.UUID,
) -> Job | None:
    return (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.recruiter_id == recruiter_id,
        )
        .first()
    )


def get_job_applicants(
    db: Session,
    job_id: uuid.UUID,
) -> list[Application]:
    return (
        db.query(Application)
        .options(
            joinedload(Application.candidate),
            joinedload(Application.candidate_score)
            .joinedload(CandidateScore.breakdowns),
            joinedload(Application.resume),
        )
        .filter(Application.job_id == job_id)
        .order_by(Application.applied_at.desc())
        .all()
    )


def get_candidate_application(
    db: Session,
    application_id: uuid.UUID,
) -> Application | None:
    return (
        db.query(Application)
        .options(
            joinedload(Application.candidate),
            joinedload(Application.candidate_score)
            .joinedload(CandidateScore.breakdowns),
            joinedload(Application.resume),
        )
        .filter(Application.id == application_id)
        .first()
    )