import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.resume import Resume
from app.models.user import User
from app.routers.auth import require_candidate
from app.schemas.resume import ParsedResumeResponse
from app.services.resume_parser_service import (
    get_parsed_resume,
    process_resume,
)


router = APIRouter(
    prefix="/resume-processing",
    tags=["Resume Processing"],
)


# ============================================================
# Candidate: Process Resume
# ============================================================

@router.post(
    "/{resume_id}",
    response_model=ParsedResumeResponse,
)
def process_my_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(require_candidate),
    db: Session = Depends(get_db),
):
    candidate = current_user.candidate

    if candidate is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Candidate profile not found",
        )

    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.candidate_id == candidate.id,
        )
        .first()
    )

    if resume is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    try:
        return process_resume(
            db=db,
            resume=resume,
        )

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Resume processing failed",
        )


# ============================================================
# Candidate: Get Parsed Resume
# ============================================================

@router.get(
    "/{resume_id}",
    response_model=ParsedResumeResponse,
)
def get_my_parsed_resume(
    resume_id: uuid.UUID,
    current_user: User = Depends(require_candidate),
    db: Session = Depends(get_db),
):
    candidate = current_user.candidate

    if candidate is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Candidate profile not found",
        )

    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.candidate_id == candidate.id,
        )
        .first()
    )

    if resume is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    parsed_resume = get_parsed_resume(
        db=db,
        resume_id=resume.id,
    )

    if parsed_resume is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume has not been processed yet",
        )

    return parsed_resume