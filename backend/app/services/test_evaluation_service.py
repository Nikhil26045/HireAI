
import os
from statistics import mean
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.ai_evaluation import AIEvaluation
from app.models.application import Application
from app.models.candidate_score import CandidateScore
from app.models.interview_response import (
    InterviewResponse,
    ResponseStatus,
)
from app.models.interview_session import InterviewSession
from app.models.score_breakdown import ScoreBreakdown
from app.models.transcription import Transcription
from app.services.ai_evaluation_service import (
    evaluate_response,
    get_response_for_evaluation,
)


SCORING_MODEL = "hireai_weighted_candidate_score"
SCORING_VERSION = "1.0"


def read_weight(name: str, default: float) -> float:
    value = float(os.getenv(name, str(default)))
    if value < 0:
        raise ValueError(f"{name} must not be negative.")
    return value


def get_component_weights() -> dict[str, float]:
    weights = {
        "resume_score": read_weight("HIREAI_RESUME_WEIGHT", 0.35),
        "interview_score": read_weight("HIREAI_INTERVIEW_WEIGHT", 0.50),
        "job_relevance_score": read_weight(
            "HIREAI_JOB_RELEVANCE_WEIGHT", 0.15
        ),
    }

    if sum(weights.values()) <= 0:
        raise ValueError("At least one scoring weight must be positive.")

    return weights


def calculate_weighted_score(
    components: dict[str, float | None],
    weights: dict[str, float],
) -> float | None:
    """Normalize weights across components that have valid scores."""
    available = []

    for name, score in components.items():
        weight = weights.get(name, 0.0)

        if score is None or weight <= 0:
            continue

        if not 0 <= score <= 100:
            raise ValueError(
                f"{name} must be between 0 and 100."
            )

        available.append((float(score), weight))

    total_weight = sum(weight for _, weight in available)

    if total_weight == 0:
        return None

    return round(
        sum(score * weight for score, weight in available)
        / total_weight,
        2,
    )


def evaluate_session_responses(
    db: Session,
    session_id: UUID,
) -> dict:
    """
    Evaluate eligible responses in one interview session.

    Responses without completed transcription are reported as skipped.
    Previously evaluated responses are reused.
    """
    session = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id)
        .first()
    )

    if session is None:
        raise ValueError("Interview session not found.")

    responses = (
        db.query(InterviewResponse)
        .filter(
            InterviewResponse.interview_session_id == session_id
        )
        .order_by(InterviewResponse.created_at.asc())
        .all()
    )

    evaluated = []
    skipped = []
    failed = []

    for response in responses:
        transcription = (
            db.query(Transcription)
            .filter(Transcription.response_id == response.id)
            .first()
        )

        if response.response_status != ResponseStatus.COMPLETED:
            skipped.append({
                "response_id": str(response.id),
                "reason": (
                    f"Response status is "
                    f"{response.response_status.value}."
                ),
            })
            continue

        if transcription is None or not transcription.transcript_text.strip():
            skipped.append({
                "response_id": str(response.id),
                "reason": "A non-empty transcription is unavailable.",
            })
            continue

        try:
            # Reuse existing evaluations to make repeated requests safe.
            existing = (
                db.query(AIEvaluation)
                .filter(AIEvaluation.response_id == response.id)
                .first()
            )

            if existing is None:
                loaded_response = get_response_for_evaluation(
                    db,
                    response.id,
                )
                evaluation = evaluate_response(db, loaded_response)
            else:
                evaluation = existing

            evaluated.append({
                "response_id": str(response.id),
                "evaluation_id": str(evaluation.id),
                "overall_response_score": (
                    evaluation.overall_response_score
                ),
            })

        except ValueError as exc:
            db.rollback()
            skipped.append({
                "response_id": str(response.id),
                "reason": str(exc),
            })

        except Exception:
            db.rollback()
            failed.append({
                "response_id": str(response.id),
                "reason": "Unexpected evaluation error.",
            })

    return {
        "session_id": str(session_id),
        "application_id": str(session.application_id),
        "evaluated": evaluated,
        "skipped": skipped,
        "failed": failed,
    }


def recompute_application_score(
    db: Session,
    application_id: UUID,
) -> CandidateScore:
    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if application is None:
        raise ValueError("Application not found.")

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
            InterviewSession.application_id == application_id,
            AIEvaluation.overall_response_score.isnot(None),
        )
        .all()
    )

    response_scores = [
        evaluation.overall_response_score
        for evaluation in evaluations
        if evaluation.overall_response_score is not None
    ]

    score = (
        db.query(CandidateScore)
        .filter(CandidateScore.application_id == application_id)
        .first()
    )

    if score is None:
        score = CandidateScore(application_id=application_id)
        db.add(score)
        db.flush()

    # Recalculate the interview component from all available evaluations.
    score.interview_score = (
        round(mean(response_scores), 2)
        if response_scores
        else None
    )

    components = {
        "resume_score": score.resume_score,
        "interview_score": score.interview_score,
        "job_relevance_score": score.job_relevance_score,
    }

    weights = get_component_weights()

    score.overall_score = calculate_weighted_score(
        components,
        weights,
    )

    score.scoring_model = SCORING_MODEL
    score.model_version = SCORING_VERSION

    # Update only final-score component breakdowns.
    descriptions = {
        "resume_score": "Existing resume evaluation component.",
        "interview_score": (
            "Arithmetic mean of available evaluated interview responses."
        ),
        "job_relevance_score": (
            "Existing resume-to-job relevance component."
        ),
    }

    for name, value in components.items():
        category = f"overall_{name}"
        existing = (
            db.query(ScoreBreakdown)
            .filter(
                ScoreBreakdown.candidate_score_id == score.id,
                ScoreBreakdown.category == category,
            )
            .first()
        )

        if value is None or weights[name] <= 0:
            if existing is not None:
                db.delete(existing)
            continue

        if existing is None:
            existing = ScoreBreakdown(
                candidate_score_id=score.id,
                category=category,
                score=value,
                weight=weights[name],
                explanation=descriptions[name],
            )
            db.add(existing)
        else:
            existing.score = value
            existing.weight = weights[name]
            existing.explanation = descriptions[name]

    db.commit()
    db.refresh(score)

    return score
