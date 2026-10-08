from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select

from app.models.interview_session import InterviewSession
from app.models.interview_response import InterviewResponse
from app.models.interview_question import InterviewQuestion
from app.models.application import Application
from app.models.job import Job


def get_session_for_candidate(
    db: Session,
    session_id,
    candidate_id,
):
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


def get_session_for_recruiter(
    db: Session,
    session_id,
    recruiter_id,
):
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


def get_question_in_session(
    db: Session,
    question_id,
    session_id,
):
    return (
        db.query(InterviewQuestion)
        .join(
            InterviewSession,
            InterviewSession.question_set_id
            == InterviewQuestion.question_set_id,
        )
        .filter(
            InterviewQuestion.id == question_id,
            InterviewSession.id == session_id,
        )
        .first()
    )


def get_existing_response(
    db: Session,
    session_id,
    question_id,
):
    return (
        db.query(InterviewResponse)
        .filter(
            InterviewResponse.interview_session_id == session_id,
            InterviewResponse.question_id == question_id,
        )
        .first()
    )


def create_response(
    db: Session,
    session_id,
    question_id,
    media_url,
    media_type,
    file_size,
    duration_seconds,
):
    response = InterviewResponse(
        interview_session_id=session_id,
        question_id=question_id,
        media_url=media_url,
        media_type=media_type,
        file_size=file_size,
        duration_seconds=duration_seconds,
        response_status="UPLOADED",
    )

    db.add(response)
    db.commit()
    db.refresh(response)

    return response


def get_responses_by_session(
    db: Session,
    session_id,
):
    return (
        db.query(InterviewResponse)
        .options(
            joinedload(InterviewResponse.question),
        )
        .filter(
            InterviewResponse.interview_session_id == session_id
        )
        .order_by(InterviewResponse.created_at)
        .all()
    )


def get_response_by_id(
    db: Session,
    response_id,
):
    return (
        db.query(InterviewResponse)
        .options(
            joinedload(InterviewResponse.interview_session)
            .joinedload(InterviewSession.application)
            .joinedload(Application.candidate),
            joinedload(InterviewResponse.question),
        )
        .filter(InterviewResponse.id == response_id)
        .first()
    )


def delete_response(
    db: Session,
    response: InterviewResponse,
):
    db.delete(response)
    db.commit()