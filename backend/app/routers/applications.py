import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.db.database import get_db
# from app.models.application import ApplicationStatus
from app.models.job import Job, JobStatus
from app.models.resume import Resume
from app.models.user import User
from app.routers.auth import (
    require_candidate,
    require_recruiter,
)
from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationStatusUpdate,
)
from app.services.application_service import (
    create_application,
    get_application_by_candidate,
    get_application_by_id,
    get_applications_by_job,
    get_existing_application,
    update_application_status,
)


router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


# ============================================================
# Candidate: Apply for a Job
# ============================================================

@router.post(
    "",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def apply_for_job(
    request: ApplicationCreate,
    current_user: User = Depends(require_candidate),
    db: Session = Depends(get_db),
):
    candidate = current_user.candidate

    if candidate is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Candidate profile not found",
        )

    job = (
        db.query(Job)
        .filter(Job.id == request.job_id)
        .first()
    )

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    if job.status != JobStatus.OPEN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Applications are closed for this job",
        )

    existing_application = get_existing_application(
        db=db,
        job_id=job.id,
        candidate_id=candidate.id,
    )

    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already applied for this job",
        )

    # Validate the resume if the candidate attached one
    if request.resume_id is not None:
        resume = (
            db.query(Resume)
            .filter(
                Resume.id == request.resume_id,
                Resume.candidate_id == candidate.id,
            )
            .first()
        )

        if resume is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found for this candidate",
            )

    return create_application(
        db=db,
        job_id=job.id,
        candidate_id=candidate.id,
        resume_id=request.resume_id,
    )


# ============================================================
# Candidate: View Own Applications
# ============================================================

@router.get(
    "/me",
    response_model=list[ApplicationResponse],
)
def get_my_applications(
    current_user: User = Depends(require_candidate),
    db: Session = Depends(get_db),
):
    candidate = current_user.candidate

    if candidate is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Candidate profile not found",
        )

    return get_application_by_candidate(
        db=db,
        candidate_id=candidate.id,
    )


# ============================================================
# Recruiter: View Applications for Their Job
# ============================================================

@router.get(
    "/job/{job_id}",
    response_model=list[ApplicationResponse],
)
def get_job_applications(
    job_id: uuid.UUID,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    recruiter = current_user.recruiter

    if recruiter is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recruiter profile not found",
        )

    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    if job.recruiter_id != recruiter.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this job",
        )

    return get_applications_by_job(
        db=db,
        job_id=job.id,
    )


# ============================================================
# Recruiter: Update Application Status
# ============================================================

@router.patch(
    "/{application_id}/status",
    response_model=ApplicationResponse,
)
def change_application_status(
    application_id: uuid.UUID,
    request: ApplicationStatusUpdate,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    recruiter = current_user.recruiter

    if recruiter is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recruiter profile not found",
        )

    application = get_application_by_id(
        db=db,
        application_id=application_id,
    )

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    job = (
        db.query(Job)
        .filter(Job.id == application.job_id)
        .first()
    )

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated job not found",
        )

    if job.recruiter_id != recruiter.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this job",
        )

    return update_application_status(
        db=db,
        application=application,
        status=request.status,
    )


# ============================================================
# Candidate: View One Own Application
# ============================================================

@router.get(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def get_my_application(
    application_id: uuid.UUID,
    current_user: User = Depends(require_candidate),
    db: Session = Depends(get_db),
):
    candidate = current_user.candidate

    if candidate is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Candidate profile not found",
        )

    application = get_application_by_id(
        db=db,
        application_id=application_id,
    )

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    if application.candidate_id != candidate.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access this application",
        )

    return application