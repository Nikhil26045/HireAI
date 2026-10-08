from uuid import UUID

from sqlalchemy.orm import Session, joinedload, selectinload

from app.models.application import Application
from app.models.interview_session import (
    InterviewSession,
    InterviewStatus,
)
from app.models.interview_question_set import InterviewQuestionSet
from app.models.interview_question import InterviewQuestion
from app.models.job import Job


# ============================================================
# INTERVIEW SESSION QUERIES
# ============================================================

def get_session_by_id(
    db: Session,
    session_id: UUID,
) -> InterviewSession | None:
    return (
        db.query(InterviewSession)
        .options(
            joinedload(InterviewSession.application)
            .joinedload(Application.candidate),
            joinedload(InterviewSession.question_set)
            .selectinload(InterviewQuestionSet.questions),
            selectinload(InterviewSession.responses),
        )
        .filter(InterviewSession.id == session_id)
        .first()
    )


def get_sessions_by_candidate(
    db: Session,
    candidate_id: UUID,
) -> list[InterviewSession]:
    return (
        db.query(InterviewSession)
        .join(
            Application,
            InterviewSession.application_id == Application.id,
        )
        .filter(Application.candidate_id == candidate_id)
        .options(
            joinedload(InterviewSession.question_set)
            .selectinload(InterviewQuestionSet.questions),
            selectinload(InterviewSession.responses),
        )
        .order_by(InterviewSession.created_at.desc())
        .all()
    )


def get_sessions_by_recruiter(
    db: Session,
    recruiter_id: UUID,
) -> list[InterviewSession]:
    return (
        db.query(InterviewSession)
        .join(
            Application,
            InterviewSession.application_id == Application.id,
        )
        .join(
            Job,
            Application.job_id == Job.id,
        )
        .filter(Job.recruiter_id == recruiter_id)
        .options(
            joinedload(InterviewSession.application)
            .joinedload(Application.candidate),
            joinedload(InterviewSession.question_set)
            .selectinload(InterviewQuestionSet.questions),
        )
        .order_by(InterviewSession.created_at.desc())
        .all()
    )


# ============================================================
# OWNERSHIP AND VALIDATION
# ============================================================

def get_recruiter_application(
    db: Session,
    application_id: UUID,
    recruiter_id: UUID,
) -> Application | None:
    return (
        db.query(Application)
        .join(Job, Application.job_id == Job.id)
        .filter(
            Application.id == application_id,
            Job.recruiter_id == recruiter_id,
        )
        .first()
    )


def get_recruiter_question_set(
    db: Session,
    question_set_id: UUID,
    recruiter_id: UUID,
) -> InterviewQuestionSet | None:
    return (
        db.query(InterviewQuestionSet)
        .filter(
            InterviewQuestionSet.id == question_set_id,
            InterviewQuestionSet.recruiter_id == recruiter_id,
        )
        .first()
    )


def get_candidate_session(
    db: Session,
    session_id: UUID,
    candidate_id: UUID,
) -> InterviewSession | None:
    return (
        db.query(InterviewSession)
        .join(
            Application,
            InterviewSession.application_id == Application.id,
        )
        .filter(
            InterviewSession.id == session_id,
            Application.candidate_id == candidate_id,
        )
        .first()
    )


def get_recruiter_session(
    db: Session,
    session_id: UUID,
    recruiter_id: UUID,
) -> InterviewSession | None:
    return (
        db.query(InterviewSession)
        .join(
            Application,
            InterviewSession.application_id == Application.id,
        )
        .join(
            Job,
            Application.job_id == Job.id,
        )
        .filter(
            InterviewSession.id == session_id,
            Job.recruiter_id == recruiter_id,
        )
        .first()
    )


# ============================================================
# CREATE INTERVIEW SESSION
# ============================================================

def create_interview_session(
    db: Session,
    application_id: UUID,
    question_set_id: UUID,
) -> InterviewSession:
    session = InterviewSession(
        application_id=application_id,
        question_set_id=question_set_id,
        status=InterviewStatus.SCHEDULED,
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


# ============================================================
# START INTERVIEW
# ============================================================

def start_interview(
    db: Session,
    session: InterviewSession,
) -> InterviewSession:
    from datetime import datetime, timezone

    session.status = InterviewStatus.IN_PROGRESS
    session.started_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(session)

    return session


# ============================================================
# COMPLETE INTERVIEW
# ============================================================

def complete_interview(
    db: Session,
    session: InterviewSession,
) -> InterviewSession:
    from datetime import datetime, timezone

    session.status = InterviewStatus.COMPLETED
    session.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(session)

    return session


# ============================================================
# CANCEL INTERVIEW
# ============================================================

def cancel_interview(
    db: Session,
    session: InterviewSession,
) -> InterviewSession:
    session.status = InterviewStatus.CANCELLED

    db.commit()
    db.refresh(session)

    return session