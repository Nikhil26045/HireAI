
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.ai_evaluation import AIEvaluation
from app.models.application import Application
from app.models.interview_response import InterviewResponse
from app.models.interview_session import InterviewSession
from app.models.job import Job
from app.models.user import User
from app.routers.auth import require_recruiter
from app.schemas.ai_evaluation import (
    AIEvaluationResponse,
    InterviewEvaluationSummary,
)
from app.services.ai_evaluation_service import (
    evaluate_response,
    get_response_for_evaluation,
)

router = APIRouter(tags=["AI Evaluations"])


def get_recruiter_id(user: User):
    recruiter = getattr(user, "recruiter", None)

    if recruiter is None:
        raise HTTPException(
            status_code=403,
            detail="Recruiter profile not found.",
        )

    return recruiter.id


def verify_response_ownership(
    db: Session,
    response_id: UUID,
    recruiter_id,
):
    response = (
        db.query(InterviewResponse)
        .join(
            InterviewSession,
            InterviewResponse.interview_session_id == InterviewSession.id,
        )
        .join(
            Application,
            InterviewSession.application_id == Application.id,
        )
        .join(Job, Application.job_id == Job.id)
        .filter(
            InterviewResponse.id == response_id,
            Job.recruiter_id == recruiter_id,
        )
        .first()
    )

    if response is None:
        raise HTTPException(
            status_code=404,
            detail="Interview response not found.",
        )

    return response


@router.post(
    "/interview-responses/{response_id}/evaluate",
    response_model=AIEvaluationResponse,
)
def evaluate_interview_response(
    response_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    recruiter_id = get_recruiter_id(current_user)

    verify_response_ownership(
        db,
        response_id,
        recruiter_id,
    )

    response = get_response_for_evaluation(db, response_id)

    try:
        return evaluate_response(db, response)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc


@router.get(
    "/interview-responses/{response_id}/evaluation",
    response_model=AIEvaluationResponse,
)
def get_response_evaluation(
    response_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    recruiter_id = get_recruiter_id(current_user)

    verify_response_ownership(
        db,
        response_id,
        recruiter_id,
    )

    evaluation = (
        db.query(AIEvaluation)
        .filter(AIEvaluation.response_id == response_id)
        .first()
    )

    if evaluation is None:
        raise HTTPException(
            status_code=404,
            detail="Evaluation has not been generated yet.",
        )

    return evaluation


@router.get(
    "/recruiter/applications/{application_id}/evaluations",
    response_model=InterviewEvaluationSummary,
)
def get_application_evaluations(
    application_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    recruiter_id = get_recruiter_id(current_user)

    application = (
        db.query(Application)
        .join(Job, Application.job_id == Job.id)
        .filter(
            Application.id == application_id,
            Job.recruiter_id == recruiter_id,
        )
        .first()
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    evaluations = (
        db.query(AIEvaluation)
        .join(
            InterviewResponse,
            AIEvaluation.response_id == InterviewResponse.id,
        )
        .join(
            InterviewSession,
            InterviewResponse.interview_session_id == InterviewSession.id,
        )
        .filter(InterviewSession.application_id == application_id)
        .order_by(AIEvaluation.created_at.asc())
        .all()
    )

    candidate_score = application.candidate_score

    return InterviewEvaluationSummary(
        application_id=application.id,
        interview_score=(
            candidate_score.interview_score
            if candidate_score is not None
            else None
        ),
        evaluated_responses=len(evaluations),
        evaluations=evaluations,
    )
