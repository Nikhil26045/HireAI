from uuid import UUID

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.application import Application
from app.models.interview_response import InterviewResponse
from app.models.interview_session import InterviewSession
from app.models.job import Job
from app.models.transcription import Transcription
from app.models.user import User
from app.routers.auth import get_current_user
from app.models.interview_response import (
    InterviewResponse,
    ResponseStatus,
)
from app.schemas.transcription import (
    TranscriptionJobResponse,
    TranscriptionResponse,
)
from app.services.transcription_service import process_transcription

router = APIRouter(tags=["Transcriptions"])


def get_role(user: User) -> str:
    role = getattr(user.role, "value", user.role)
    return str(role).upper()


def get_authorized_response(
    db: Session,
    response_id: UUID,
    user: User,
) -> InterviewResponse:
    """Return a response only if its candidate or recruiter owns access."""
    query = (
        db.query(InterviewResponse)
        .join(
            InterviewSession,
            InterviewResponse.interview_session_id == InterviewSession.id,
        )
        .join(
            Application,
            InterviewSession.application_id == Application.id,
        )
        .filter(InterviewResponse.id == response_id)
    )

    role = get_role(user)

    if role == "CANDIDATE":
        candidate = getattr(user, "candidate", None)

        if candidate is None:
            raise HTTPException(
                status_code=403,
                detail="Candidate profile not found.",
            )

        query = query.filter(
            Application.candidate_id == candidate.id
        )

    elif role == "RECRUITER":
        recruiter = getattr(user, "recruiter", None)

        if recruiter is None:
            raise HTTPException(
                status_code=403,
                detail="Recruiter profile not found.",
            )

        query = query.join(
            Job,
            Application.job_id == Job.id,
        ).filter(
            Job.recruiter_id == recruiter.id
        )

    else:
        raise HTTPException(
            status_code=403,
            detail="Access denied.",
        )

    response = query.first()

    if response is None:
        raise HTTPException(
            status_code=404,
            detail="Interview response not found.",
        )

    return response


@router.post(
    "/interview-responses/{response_id}/transcribe",
    response_model=TranscriptionJobResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
def start_transcription(
    response_id: UUID,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    response = get_authorized_response(db, response_id, current_user)

    if response.transcription is not None:
        return TranscriptionJobResponse(
            response_id=response.id,
            response_status=response.response_status.value,
            message="Transcription already exists.",
        )

    if response.response_status == ResponseStatus.PROCESSING:
        return TranscriptionJobResponse(
            response_id=response.id,
            response_status=response.response_status.value,
            message="Transcription is already processing.",
        )

    response.response_status = ResponseStatus.PROCESSING
    db.commit()

    background_tasks.add_task(
        process_transcription,
        response.id,
    )

    return TranscriptionJobResponse(
        response_id=response.id,
        response_status="processing",
        message="Transcription has been queued.",
    )


@router.get(
    "/interview-responses/{response_id}/transcription",
    response_model=TranscriptionResponse,
)
def get_transcription(
    response_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    response = get_authorized_response(db, response_id, current_user)

    transcription = (
        db.query(Transcription)
        .filter(Transcription.response_id == response.id)
        .first()
    )

    if transcription is None:
        if response.response_status.value == "failed":
            raise HTTPException(
                status_code=422,
                detail=(
                    "Transcription failed. You may retry "
                    "the transcription request."
                ),
            )

        raise HTTPException(
            status_code=404,
            detail=(
                "Transcription is not available yet. "
                f"Current status: {response.response_status.value}."
            ),
        )

    return transcription