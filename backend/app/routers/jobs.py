import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.job import Job
from app.models.user import User
from app.routers.auth import require_recruiter
from app.schemas.job import JobCreate, JobResponse, JobUpdate
from app.services.job_service import (
    create_job,
    delete_job,
    get_job_by_id,
    get_jobs,
    update_job,
)


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)


@router.post(
    "",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_job_endpoint(
    request: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    """
    Create a new job as a recruiter.
    """

    if not current_user.recruiter:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recruiter profile not found",
        )

    return create_job(
        db=db,
        recruiter_id=current_user.recruiter.id,
        title=request.title,
        description=request.description,
        location=request.location,
        employment_type=request.employment_type,
        experience_min=request.experience_min,
        experience_max=request.experience_max,
        education_requirement=request.education_requirement,
    )


@router.get(
    "",
    response_model=list[JobResponse],
)
def list_jobs(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    List available jobs.
    """

    return get_jobs(
        db=db,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/{job_id}",
    response_model=JobResponse,
)
def get_job(
    job_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    """
    Retrieve a single job.
    """

    job = get_job_by_id(
        db=db,
        job_id=job_id,
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    return job


@router.patch(
    "/{job_id}",
    response_model=JobResponse,
)
def update_job_endpoint(
    job_id: uuid.UUID,
    request: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    """
    Update a job belonging to the current recruiter.
    """

    if not current_user.recruiter:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recruiter profile not found",
        )

    job = get_job_by_id(
        db=db,
        job_id=job_id,
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    if job.recruiter_id != current_user.recruiter.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only modify your own jobs",
        )

    update_data = request.model_dump(exclude_unset=True)

    return update_job(
        db=db,
        job=job,
        update_data=update_data,
    )


@router.delete(
    "/{job_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_job_endpoint(
    job_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    """
    Delete a job belonging to the current recruiter.
    """

    if not current_user.recruiter:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recruiter profile not found",
        )

    job = get_job_by_id(
        db=db,
        job_id=job_id,
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    if job.recruiter_id != current_user.recruiter.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own jobs",
        )

    delete_job(
        db=db,
        job=job,
    )

    return None