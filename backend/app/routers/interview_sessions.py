from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.db.database import get_db
from app.models.user import User
from app.models.interview_session import InterviewStatus
from app.models.application import Application
from app.models.job import Job
from app.models.interview_question_set import InterviewQuestionSet

from app.routers.auth import require_recruiter, require_candidate
from app.routers.auth import get_current_user

from app.schemas.interview_session import (
    InterviewSessionCreate,
    InterviewSessionResponse,
    InterviewSessionDetailResponse,
    CandidateInterviewResponse,
)

from app.services import interview_session_service as service


router = APIRouter(
    prefix="/interviews",
    tags=["Interview Sessions"],
)


# ============================================================
# CREATE INTERVIEW
# ============================================================

@router.post(
    "",
    response_model=InterviewSessionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_interview(
    data: InterviewSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recruiter_id = current_user.recruiter.id

    application = service.get_recruiter_application(
        db=db,
        application_id=data.application_id,
        recruiter_id=recruiter_id,
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found or not owned by you",
        )

    question_set = service.get_recruiter_question_set(
        db=db,
        question_set_id=data.question_set_id,
        recruiter_id=recruiter_id,
    )

    if question_set is None:
        raise HTTPException(
            status_code=404,
            detail="Question set not found",
        )

    if question_set.job_id != application.job_id:
        raise HTTPException(
            status_code=400,
            detail="Question set does not belong to the application's job",
        )

    if not question_set.questions:
        raise HTTPException(
            status_code=400,
            detail="Cannot create an interview with an empty question set",
        )

    return service.create_interview_session(
        db=db,
        application_id=data.application_id,
        question_set_id=data.question_set_id,
    )


# ============================================================
# LIST CANDIDATE INTERVIEWS
# ============================================================

@router.get(
    "/me",
    response_model=list[CandidateInterviewResponse],
)
def get_my_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate),
):
    candidate_id = current_user.candidate.id

    sessions = service.get_sessions_by_candidate(
        db=db,
        candidate_id=candidate_id,
    )

    result = []

    for session in sessions:
        result.append(
            CandidateInterviewResponse(
                id=session.id,
                application_id=session.application_id,
                question_set_id=session.question_set_id,
                status=session.status,
                started_at=session.started_at,
                completed_at=session.completed_at,
                created_at=session.created_at,
                job_title=session.application.job.title,
                recruiter_name=None,
                question_count=len(session.question_set.questions),
            )
        )

    return result


# ============================================================
# LIST RECRUITER INTERVIEWS
# ============================================================

@router.get(
    "/recruiter",
    response_model=list[InterviewSessionResponse],
)
def get_recruiter_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    return service.get_sessions_by_recruiter(
        db=db,
        recruiter_id=current_user.recruiter.id,
    )


# ============================================================
# GET INTERVIEW DETAILS
# ============================================================

@router.get(
    "/{session_id}",
    response_model=InterviewSessionDetailResponse,
)
def get_interview_details(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    role = getattr(current_user.role, "value", current_user.role)
    if role == "recruiter":
        session = service.get_recruiter_session(
            db=db,
            session_id=session_id,
            recruiter_id=current_user.recruiter.id,
        )
    elif role == "candidate":
        session = service.get_candidate_session(
            db=db,
            session_id=session_id,
            candidate_id=current_user.candidate.id,
        )
    else:
        raise HTTPException(
            status_code=403,
            detail="Access denied",
        )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found",
        )

    return InterviewSessionDetailResponse(
        id=session.id,
        application_id=session.application_id,
        question_set_id=session.question_set_id,
        status=session.status,
        started_at=session.started_at,
        completed_at=session.completed_at,
        created_at=session.created_at,
        questions=session.question_set.questions,
    )


# ============================================================
# START INTERVIEW
# ============================================================

@router.post(
    "/{session_id}/start",
    response_model=InterviewSessionResponse,
)
def start_interview(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate),
):
    session = service.get_candidate_session(
        db=db,
        session_id=session_id,
        candidate_id=current_user.candidate.id,
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found",
        )

    if session.status != InterviewStatus.SCHEDULED:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot start an interview with status '{session.status.value}'",
        )

    return service.start_interview(
        db=db,
        session=session,
    )


# ============================================================
# COMPLETE INTERVIEW
# ============================================================

@router.post(
    "/{session_id}/complete",
    response_model=InterviewSessionResponse,
)
def complete_interview(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate),
):
    session = service.get_candidate_session(
        db=db,
        session_id=session_id,
        candidate_id=current_user.candidate.id,
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found",
        )

    if session.status != InterviewStatus.IN_PROGRESS:
        raise HTTPException(
            status_code=400,
            detail="Only an in-progress interview can be completed",
        )

    return service.complete_interview(
        db=db,
        session=session,
    )


# ============================================================
# CANCEL INTERVIEW
# ============================================================

@router.patch(
    "/{session_id}/cancel",
    response_model=InterviewSessionResponse,
)
def cancel_interview(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    session = service.get_recruiter_session(
        db=db,
        session_id=session_id,
        recruiter_id=current_user.recruiter.id,
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found",
        )

    if session.status in (
        InterviewStatus.COMPLETED,
        InterviewStatus.CANCELLED,
        InterviewStatus.EXPIRED,
    ):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot cancel an interview with status '{session.status.value}'",
        )

    return service.cancel_interview(
        db=db,
        session=session,
    )