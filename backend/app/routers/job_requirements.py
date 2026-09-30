import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.job_requirement import JobRequirement
from app.routers.auth import get_current_user, require_recruiter
from app.schemas.job_requirement import (
    JobRequirementCreate,
    JobRequirementResponse,
    JobRequirementUpdate,
)
from app.services.job_requirement_service import (
    create_job_requirement,
    delete_job_requirement,
    get_job_requirement_by_id,
    get_requirements_by_job,
    update_job_requirement,
)


router = APIRouter(
    prefix="/job-requirements",
    tags=["Job Requirements"],
)


@router.post(
    "",
    response_model=JobRequirementResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_requirement(
    data: JobRequirementCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_recruiter),
):
    job = data.job_id

    # Verify that the job exists and belongs to this recruiter.
    from app.models.job import Job

    recruiter_job = (
        db.query(Job)
        .filter(
            Job.id == job,
            Job.recruiter_id == current_user.recruiter.id,
        )
        .first()
    )

    if not recruiter_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or does not belong to you",
        )

    return create_job_requirement(
        db=db,
        job_id=data.job_id,
        requirement_type=data.requirement_type,
        requirement_name=data.requirement_name,
        importance=data.importance,
    )


@router.get(
    "/job/{job_id}",
    response_model=list[JobRequirementResponse],
)
def get_job_requirements(
    job_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    requirements = get_requirements_by_job(
        db=db,
        job_id=job_id,
    )

    return requirements


@router.get(
    "/{requirement_id}",
    response_model=JobRequirementResponse,
)
def get_requirement(
    requirement_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    requirement = get_job_requirement_by_id(
        db=db,
        requirement_id=requirement_id,
    )

    if not requirement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job requirement not found",
        )

    return requirement


@router.patch(
    "/{requirement_id}",
    response_model=JobRequirementResponse,
)
def update_requirement(
    requirement_id: uuid.UUID,
    data: JobRequirementUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_recruiter),
):
    requirement = get_job_requirement_by_id(
        db=db,
        requirement_id=requirement_id,
    )

    if not requirement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job requirement not found",
        )

    # Make sure the requirement belongs to one of this recruiter's jobs.
    from app.models.job import Job

    job = (
        db.query(Job)
        .filter(
            Job.id == requirement.job_id,
            Job.recruiter_id == current_user.recruiter.id,
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to modify this requirement",
        )

    update_data = data.model_dump(exclude_unset=True)

    return update_job_requirement(
        db=db,
        requirement=requirement,
        update_data=update_data,
    )


@router.delete(
    "/{requirement_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_requirement(
    requirement_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(require_recruiter),
):
    requirement = get_job_requirement_by_id(
        db=db,
        requirement_id=requirement_id,
    )

    if not requirement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job requirement not found",
        )

    from app.models.job import Job

    job = (
        db.query(Job)
        .filter(
            Job.id == requirement.job_id,
            Job.recruiter_id == current_user.recruiter.id,
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this requirement",
        )

    delete_job_requirement(
        db=db,
        requirement=requirement,
    )

    return None