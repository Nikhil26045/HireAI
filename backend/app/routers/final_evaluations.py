
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.ai_evaluation import AIEvaluation
from app.models.application import Application
from app.models.interview_response import InterviewResponse
from app.models.interview_session import InterviewSession
from app.models.job import Job
from app.models.user import User
from app.routers.auth import require_recruiter
from app.schemas.final_evaluation import (
    CandidateScoreSummary,
    FinalEvaluationSummary,
    SessionEvaluationResult,
)
from app.services.final_evaluation_service import (
    evaluate_session_responses,
    get_component_weights,
    recompute_application_score,
)

router = APIRouter(tags=["Final Candidate Evaluation"])


def get_recruiter_profile_id(user: User):
    recruiter = getattr(user, "recruiter", None)

    if recruiter is None:
        raise HTTPException(
            status_code=403,
            detail="Recruiter profile not found.",
        )

    return recruiter.id


def verify_session_ownership(
    db: Session,
    session_id: UUID,
    recruiter_id,
):
    session = (
        db.query(InterviewSession)
        .join(
            Application,
            InterviewSession.application_id == Application.id,
        )
        .join(Job, Application.job_id == Job.id)
        .filter(
            InterviewSession.id == session_id,
            Job.recruiter_id == recruiter_id,
        )
        .first()
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found.",
        )

    return session


def verify_application_ownership(
    db: Session,
    application_id: UUID,
    recruiter_id,
):
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

    return application


@router.post(
    "/interviews/{session_id}/evaluate-all",
    response_model=SessionEvaluationResult,
)
def evaluate_all_session_responses(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    recruiter_id = get_recruiter_profile_id(current_user)

    session = verify_session_ownership(
        db,
        session_id,
        recruiter_id,
    )

    try:
        result = evaluate_session_responses(db, session.id)

        score = recompute_application_score(
            db,
            session.application_id,
        )

        # Return only the per-session evaluation outcome.
        # The application summary endpoint returns final scores.
        return result

    except ValueError as exc:
        db.rollback()
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc


@router.get(
    "/recruiter/applications/{application_id}/evaluation-summary",
    response_model=FinalEvaluationSummary,
)
def get_final_evaluation_summary(
    application_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    recruiter_id = get_recruiter_profile_id(current_user)

    application = verify_application_ownership(
        db,
        application_id,
        recruiter_id,
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
        .filter(
            InterviewSession.application_id == application_id
        )
        .order_by(AIEvaluation.created_at.asc())
        .all()
    )

    score = application.candidate_score

    return FinalEvaluationSummary(
        candidate_score=(
            CandidateScoreSummary.model_validate(score)
            if score is not None
            else None
        ),
        evaluated_responses=len(evaluations),
        evaluations=[
            {
                "response_id": str(item.response_id),
                "relevance_score": item.relevance_score,
                "technical_score": item.technical_score,
                "completeness_score": item.completeness_score,
                "communication_score": item.communication_score,
                "semantic_score": item.semantic_score,
                "overall_response_score": item.overall_response_score,
                "feedback": item.feedback,
                "model_name": item.model_name,
                "model_version": item.model_version,
            }
            for item in evaluations
        ],
        component_weights=get_component_weights(),
    )
