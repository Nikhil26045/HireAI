import os
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
from app.models.user import User
from app.models.interview_session import InterviewStatus
from app.models.interview_response import (
    ResponseMediaType,
)
from app.schemas.interview_response import (
    InterviewResponseResponse,
    InterviewResponseDetailResponse,
)
from app.routers.auth import (
    get_current_user,
    require_candidate,
    require_recruiter,
)
from app.services import interview_response_service as service


router = APIRouter(
    tags=["Interview Responses"],
)

STORAGE_DIR = (
    Path(__file__).resolve().parents[2]
    / "storage"
    / "interview_responses"
)

STORAGE_DIR.mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE = 100 * 1024 * 1024

ALLOWED_AUDIO_TYPES = {
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
    "audio/mp4": ".m4a",
    "audio/webm": ".webm",
    "audio/ogg": ".ogg",
}

ALLOWED_VIDEO_TYPES = {
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov",
}


def get_user_role(user: User) -> str:
    return getattr(user.role, "value", user.role)


def get_candidate_profile_id(user: User):
    if not user.candidate:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Candidate profile not found.",
        )

    return user.candidate.id


def get_recruiter_profile_id(user: User):
    if not user.recruiter:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Recruiter profile not found.",
        )

    return user.recruiter.id


def validate_media_type(content_type: str):
    if content_type in ALLOWED_AUDIO_TYPES:
        return ResponseMediaType.AUDIO, ALLOWED_AUDIO_TYPES[content_type]

    if content_type in ALLOWED_VIDEO_TYPES:
        return ResponseMediaType.VIDEO, ALLOWED_VIDEO_TYPES[content_type]

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Unsupported file type.",
    )


async def save_upload_file(
    upload_file: UploadFile,
    destination: Path,
):
    size = 0

    try:
        with destination.open("wb") as output:
            while chunk := await upload_file.read(1024 * 1024):
                size += len(chunk)

                if size > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="File exceeds the 100 MB limit.",
                    )

                output.write(chunk)

    except Exception:
        destination.unlink(missing_ok=True)
        raise

    return size


@router.post(
    "/interviews/{session_id}/responses",
    response_model=InterviewResponseResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_interview_response(
    session_id: uuid.UUID,
    question_id: uuid.UUID,
    file: UploadFile = File(...),
    duration_seconds: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate),
):
    candidate_id = get_candidate_profile_id(current_user)

    session = service.get_session_for_candidate(
        db,
        session_id,
        candidate_id,
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found.",
        )

    if session.status != InterviewStatus.IN_PROGRESS:
        raise HTTPException(
            status_code=400,
            detail="The interview is not in progress.",
        )

    question = service.get_question_in_session(
        db,
        question_id,
        session_id,
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question does not belong to this interview.",
        )

    existing = service.get_existing_response(
        db,
        session_id,
        question_id,
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="A response already exists for this question.",
        )

    if duration_seconds is not None and duration_seconds < 0:
        raise HTTPException(
            status_code=400,
            detail="Duration cannot be negative.",
        )

    media_type, extension = validate_media_type(
        file.content_type or ""
    )

    filename = f"{uuid.uuid4()}{extension}"
    destination = STORAGE_DIR / filename

    file_size = await save_upload_file(file, destination)

    try:
        response = service.create_response(
            db=db,
            session_id=session_id,
            question_id=question_id,
            media_url=f"/storage/interview_responses/{filename}",
            media_type=media_type,
            file_size=file_size,
            duration_seconds=duration_seconds,
        )
    except Exception:
        destination.unlink(missing_ok=True)
        raise

    return response


@router.get(
    "/interviews/{session_id}/responses",
    response_model=list[InterviewResponseDetailResponse],
)
def list_interview_responses(
    session_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    role = get_user_role(current_user)

    if role == "CANDIDATE":
        candidate_id = get_candidate_profile_id(current_user)

        session = service.get_session_for_candidate(
            db,
            session_id,
            candidate_id,
        )

    elif role == "RECRUITER":
        recruiter_id = get_recruiter_profile_id(current_user)

        session = service.get_session_for_recruiter(
            db,
            session_id,
            recruiter_id,
        )

    else:
        raise HTTPException(status_code=403, detail="Access denied.")

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found.",
        )

    responses = service.get_responses_by_session(
        db,
        session_id,
    )

    return [
        InterviewResponseDetailResponse(
            **InterviewResponseResponse.model_validate(
                response
            ).model_dump(),
            question_text=response.question.question_text,
        )
        for response in responses
    ]


@router.get(
    "/interview-responses/{response_id}",
    response_model=InterviewResponseDetailResponse,
)
def get_interview_response(
    response_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    response = service.get_response_by_id(db, response_id)

    if not response:
        raise HTTPException(
            status_code=404,
            detail="Interview response not found.",
        )

    role = get_user_role(current_user)

    if role == "CANDIDATE":
        candidate_id = get_candidate_profile_id(current_user)

        session = service.get_session_for_candidate(
            db,
            response.interview_session_id,
            candidate_id,
        )

    elif role == "RECRUITER":
        recruiter_id = get_recruiter_profile_id(current_user)

        session = service.get_session_for_recruiter(
            db,
            response.interview_session_id,
            recruiter_id,
        )

    else:
        raise HTTPException(status_code=403, detail="Access denied.")

    if not session:
        raise HTTPException(
            status_code=403,
            detail="You cannot access this response.",
        )

    return InterviewResponseDetailResponse(
        **InterviewResponseResponse.model_validate(
            response
        ).model_dump(),
        question_text=response.question.question_text,
    )


@router.get(
    "/interview-responses/{response_id}/download",
)
def download_interview_response(
    response_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    response = service.get_response_by_id(db, response_id)

    if not response:
        raise HTTPException(
            status_code=404,
            detail="Interview response not found.",
        )

    role = get_user_role(current_user)

    if role == "CANDIDATE":
        profile_id = get_candidate_profile_id(current_user)

        session = service.get_session_for_candidate(
            db,
            response.interview_session_id,
            profile_id,
        )

    elif role == "RECRUITER":
        profile_id = get_recruiter_profile_id(current_user)

        session = service.get_session_for_recruiter(
            db,
            response.interview_session_id,
            profile_id,
        )

    else:
        raise HTTPException(status_code=403, detail="Access denied.")

    if not session:
        raise HTTPException(
            status_code=403,
            detail="You cannot access this response.",
        )

    filename = Path(response.media_url).name
    file_path = STORAGE_DIR / filename

    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Stored media file not found.",
        )

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream",
    )


@router.delete(
    "/interview-responses/{response_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_interview_response(
    response_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate),
):
    candidate_id = get_candidate_profile_id(current_user)

    response = service.get_response_by_id(db, response_id)

    if not response:
        raise HTTPException(
            status_code=404,
            detail="Interview response not found.",
        )

    session = service.get_session_for_candidate(
        db,
        response.interview_session_id,
        candidate_id,
    )

    if not session:
        raise HTTPException(
            status_code=403,
            detail="You cannot delete this response.",
        )

    if session.status != InterviewStatus.IN_PROGRESS:
        raise HTTPException(
            status_code=400,
            detail="Responses can only be deleted during an active interview.",
        )

    file_path = STORAGE_DIR / Path(response.media_url).name

    service.delete_response(db, response)

    file_path.unlink(missing_ok=True)

    return None