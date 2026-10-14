from uuid import UUID

from sqlalchemy.orm import Session, selectinload

from app.models.interview_question_set import InterviewQuestionSet
from app.models.interview_question import InterviewQuestion
from app.models.job import Job


# -------------------------
# Question Set Operations
# -------------------------

def create_question_set(
    db: Session,
    job_id: UUID,
    recruiter_id: UUID,
    name: str,
    description: str | None = None,
) -> InterviewQuestionSet:
    question_set = InterviewQuestionSet(
        job_id=job_id,
        recruiter_id=recruiter_id,
        name=name,
        description=description,
    )

    db.add(question_set)
    db.commit()
    db.refresh(question_set)

    return question_set


def get_question_set_by_id(
    db: Session,
    question_set_id: UUID,
) -> InterviewQuestionSet | None:
    return (
        db.query(InterviewQuestionSet)
        .options(selectinload(InterviewQuestionSet.questions))
        .filter(InterviewQuestionSet.id == question_set_id)
        .first()
    )


def get_question_sets_by_job(
    db: Session,
    job_id: UUID,
) -> list[InterviewQuestionSet]:
    return (
        db.query(InterviewQuestionSet)
        .options(selectinload(InterviewQuestionSet.questions))
        .filter(InterviewQuestionSet.job_id == job_id)
        .order_by(InterviewQuestionSet.created_at.desc())
        .all()
    )


def update_question_set(
    db: Session,
    question_set: InterviewQuestionSet,
    name: str | None = None,
    description: str | None = None,
) -> InterviewQuestionSet:
    if name is not None:
        question_set.name = name

    if description is not None:
        question_set.description = description

    db.commit()
    db.refresh(question_set)

    return question_set


def delete_question_set(
    db: Session,
    question_set: InterviewQuestionSet,
) -> None:
    db.delete(question_set)
    db.commit()


# -------------------------
# Individual Question Operations
# -------------------------

def create_question(
    db: Session,
    question_set_id: UUID,
    question_text: str,
    question_type: str,
    expected_topics: list | None,
    max_score: int,
    sequence_number: int,
) -> InterviewQuestion:
    question = InterviewQuestion(
        question_set_id=question_set_id,
        question_text=question_text,
        question_type=question_type,
        expected_topics=expected_topics,
        max_score=max_score,
        sequence_number=sequence_number,
    )

    db.add(question)
    db.commit()
    db.refresh(question)

    return question


def get_question_by_id(
    db: Session,
    question_id: UUID,
) -> InterviewQuestion | None:
    return (
        db.query(InterviewQuestion)
        .filter(InterviewQuestion.id == question_id)
        .first()
    )


def update_question(
    db: Session,
    question: InterviewQuestion,
    question_text: str | None = None,
    question_type: str | None = None,
    expected_topics: list | None = None,
    max_score: int | None = None,
    sequence_number: int | None = None,
) -> InterviewQuestion:
    if question_text is not None:
        question.question_text = question_text

    if question_type is not None:
        question.question_type = question_type

    if expected_topics is not None:
        question.expected_topics = expected_topics

    if max_score is not None:
        question.max_score = max_score

    if sequence_number is not None:
        question.sequence_number = sequence_number

    db.commit()
    db.refresh(question)

    return question


def delete_question(
    db: Session,
    question: InterviewQuestion,
) -> None:
    db.delete(question)
    db.commit()


# -------------------------
# Recruiter Ownership
# -------------------------

def get_recruiter_job(
    db: Session,
    job_id: UUID,
    recruiter_id: UUID,
) -> Job | None:
    return (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.recruiter_id == recruiter_id,
        )
        .first()
    )


def get_questions_by_set(
    db: Session,
    question_set_id: UUID,
) -> list[InterviewQuestion]:

    return (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.question_set_id == question_set_id
        )
        .order_by(
            InterviewQuestion.sequence_number.asc()
        )
        .all()
    )

def get_question_sets_by_recruiter(
    db: Session,
    recruiter_id: UUID,
) -> list[InterviewQuestionSet]:
    return (
        db.query(InterviewQuestionSet)
        .filter(
            InterviewQuestionSet.recruiter_id == recruiter_id
        )
        .order_by(
            InterviewQuestionSet.created_at.desc()
        )
        .all()
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