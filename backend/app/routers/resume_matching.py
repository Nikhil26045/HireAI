import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.job import Job
from app.models.resume import Resume
from app.routers.auth import require_candidate
from app.services.resume_matching_service import match_resume_to_job
from app.models.application import Application
from app.services.resume_matching_service import (
    match_resume_to_job,
    save_matching_result,
)


router = APIRouter(
    prefix="/matching",
    tags=["Resume Matching"],
)


@router.post(
    "/resume/{resume_id}/job/{job_id}",
    status_code=status.HTTP_200_OK,
)
def match_resume_with_job(
    resume_id: uuid.UUID,
    job_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(require_candidate),
):
    # Verify that the resume exists and belongs to the candidate.
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.candidate_id == current_user.candidate.id,
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    application = (
        db.query(Application)
        .filter(
            Application.job_id == job_id,
            Application.candidate_id == current_user.candidate.id,
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You have not applied for this job",
        )

    # Verify that the job exists.
    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    try:
        result = match_resume_to_job(
            db=db,
            resume_id=resume_id,
            job_id=job_id,
        )

        candidate_score = save_matching_result(
            db=db,
            application=application,
            matching_result=result,
        )

        result["candidate_score_id"] = str(candidate_score.id)

        return result

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
