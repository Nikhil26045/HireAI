import uuid
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.resume import Resume
from app.models.user import User
from app.routers.auth import require_candidate
from app.schemas.resume import ResumeResponse
from app.services.resume_service import (
    create_resume_record,
    delete_resume_record,
    get_resume_by_id,
    get_resumes_by_candidate,
)


router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"],
)


BASE_STORAGE_PATH = Path("storage/resumes")

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
}

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


# ============================================================
# Candidate: Upload Resume
# ============================================================

@router.post(
    "",
    response_model=ResumeResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(require_candidate),
    db: Session = Depends(get_db),
):
    candidate = current_user.candidate

    if candidate is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Candidate profile not found",
        )

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File name is missing",
        )

    original_file_name = file.filename
    file_extension = Path(original_file_name).suffix.lower()

    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF, DOC, and DOCX files are allowed",
        )

    file_content = await file.read()

    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size must not exceed 5 MB",
        )

    BASE_STORAGE_PATH.mkdir(
        parents=True,
        exist_ok=True,
    )

    stored_file_name = (
        f"{uuid.uuid4()}{file_extension}"
    )

    stored_file_url = (
        BASE_STORAGE_PATH / stored_file_name
    )

    stored_file_url.write_bytes(file_content)

    resume = create_resume_record(
        db=db,
        candidate_id=candidate.id,
        file_name=original_file_name,
        file_url=str(stored_file_url),
        file_type=file.content_type or file_extension,
    )

    return resume


# ============================================================
# Candidate: View Own Resumes
# ============================================================

@router.get(
    "/me",
    response_model=list[ResumeResponse],
)
def get_my_resumes(
    current_user: User = Depends(require_candidate),
    db: Session = Depends(get_db),
):
    candidate = current_user.candidate

    if candidate is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Candidate profile not found",
        )

    return get_resumes_by_candidate(
        db=db,
        candidate_id=candidate.id,
    )


# ============================================================
# Candidate: Download/View Own Resume
# ============================================================

@router.get(
    "/{resume_id}/download",
)
def download_my_resume(
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

    resume = get_resume_by_id(
        db=db,
        resume_id=resume_id,
    )

    if resume is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    if resume.candidate_id != candidate.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access this resume",
        )

    file_url = Path(resume.file_url)

    if not file_url.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume file is missing from storage",
        )

    return FileResponse(
        path=file_url,
        filename=resume.file_name,
        media_type=resume.file_type,
    )


# ============================================================
# Candidate: Delete Own Resume
# ============================================================

@router.delete(
    "/{resume_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_my_resume(
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

    resume = get_resume_by_id(
        db=db,
        resume_id=resume_id,
    )

    if resume is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found",
        )

    if resume.candidate_id != candidate.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot delete this resume",
        )

    file_url = Path(resume.file_url)

    if file_url.exists():
        file_url.unlink()

    delete_resume_record(
        db=db,
        resume=resume,
    )

    return None