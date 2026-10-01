import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.application import ApplicationStatus
from app.routers.auth import require_recruiter
from app.schemas.recruiter_evaluation import (
    ApplicationStatusUpdate,
    RecruiterApplicantResponse,
)
from app.services.recruiter_evaluation_service import (
    get_candidate_application,
    get_job_applicants,
    get_recruiter_job,
)


router = APIRouter(
    prefix="/recruiter",
    tags=["Recruiter Evaluation"],
)


@router.get(
    "/jobs/{job_id}/applicants",
    response_model=list[RecruiterApplicantResponse],
)
def list_job_applicants(
    job_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(require_recruiter),
):
    job = get_recruiter_job(
        db=db,
        job_id=job_id,
        recruiter_id=current_user.recruiter.id,
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    applications = get_job_applicants(
        db=db,
        job_id=job_id,
    )

    return [
        RecruiterApplicantResponse(
            application_id=application.id,
            candidate_id=application.candidate_id,
            candidate_name=(
                f"{application.candidate.first_name} "
                f"{application.candidate.last_name}"
            ),
            candidate_email=application.candidate.user.email,
            resume_id=application.resume_id,
            resume_file_name=(
                application.resume.file_name
                if application.resume
                else None
            ),
            application_status=application.status,
            applied_at=application.applied_at,
            candidate_score=application.candidate_score,
        )
        for application in applications
    ]


@router.get(
    "/applications/{application_id}",
    response_model=RecruiterApplicantResponse,
)
def get_applicant_evaluation(
    application_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(require_recruiter),
):
    application = get_candidate_application(
        db=db,
        application_id=application_id,
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    job = get_recruiter_job(
        db=db,
        job_id=application.job_id,
        recruiter_id=current_user.recruiter.id,
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this application",
        )

    return RecruiterApplicantResponse(
        application_id=application.id,
        candidate_id=application.candidate_id,
        candidate_name=(
            f"{application.candidate.first_name} "
            f"{application.candidate.last_name}"
        ),
        candidate_email=application.candidate.user.email,
        resume_id=application.resume_id,
        resume_file_name=(
            application.resume.file_name
            if application.resume
            else None
        ),
        application_status=application.status,
        applied_at=application.applied_at,
        candidate_score=application.candidate_score,
    )


@router.patch(
    "/applications/{application_id}/status",
    response_model=RecruiterApplicantResponse,
)
def update_applicant_status(
    application_id: uuid.UUID,
    data: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_recruiter),
):
    application = get_candidate_application(
        db=db,
        application_id=application_id,
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    job = get_recruiter_job(
        db=db,
        job_id=application.job_id,
        recruiter_id=current_user.recruiter.id,
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this application",
        )

    application.status = data.status

    db.commit()
    db.refresh(application)

    return RecruiterApplicantResponse(
        application_id=application.id,
        candidate_id=application.candidate_id,
        candidate_name=(
            f"{application.candidate.first_name} "
            f"{application.candidate.last_name}"
        ),
        candidate_email=application.candidate.user.email,
        resume_id=application.resume_id,
        resume_file_name=(
            application.resume.file_name
            if application.resume
            else None
        ),
        application_status=application.status,
        applied_at=application.applied_at,
        candidate_score=application.candidate_score,
    )