import uuid

from sqlalchemy.orm import Session

from app.models.application import (
    Application,
    ApplicationStatus,
)


def get_application_by_id(
    db: Session,
    application_id: uuid.UUID,
) -> Application | None:
    return (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )


def get_application_by_candidate(
    db: Session,
    candidate_id: uuid.UUID,
) -> list[Application]:
    return (
        db.query(Application)
        .filter(Application.candidate_id == candidate_id)
        .order_by(Application.applied_at.desc())
        .all()
    )


def get_applications_by_job(
    db: Session,
    job_id: uuid.UUID,
) -> list[Application]:
    return (
        db.query(Application)
        .filter(Application.job_id == job_id)
        .order_by(Application.applied_at.desc())
        .all()
    )


def get_existing_application(
    db: Session,
    job_id: uuid.UUID,
    candidate_id: uuid.UUID,
) -> Application | None:
    return (
        db.query(Application)
        .filter(
            Application.job_id == job_id,
            Application.candidate_id == candidate_id,
        )
        .first()
    )


def create_application(
    db: Session,
    job_id: uuid.UUID,
    candidate_id: uuid.UUID,
    resume_id: uuid.UUID | None = None,
) -> Application:
    application = Application(
        job_id=job_id,
        candidate_id=candidate_id,
        resume_id=resume_id,
        status=ApplicationStatus.APPLIED,
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return application


def update_application_status(
    db: Session,
    application: Application,
    status: ApplicationStatus,
) -> Application:
    application.status = status

    db.commit()
    db.refresh(application)

    return application