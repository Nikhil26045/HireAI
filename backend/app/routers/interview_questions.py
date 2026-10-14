from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.routers.auth import (
    get_current_user,
    require_recruiter,
)
from app.models.user import User
from app.schemas.interview_question import (
    InterviewQuestionCreate,
    InterviewQuestionUpdate,
    InterviewQuestionResponse,
    InterviewQuestionSetCreate,
    InterviewQuestionSetUpdate,
    InterviewQuestionSetResponse,
)
from app.services import interview_question_service as service


router = APIRouter(
    tags=["Interview Questions"],
)


# ============================================================
# QUESTION SET ENDPOINTS
# ============================================================

@router.post(
    "/interview-question-sets",
    response_model=InterviewQuestionSetResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_question_set(
    data: InterviewQuestionSetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    recruiter_id = current_user.recruiter.id

    job = service.get_recruiter_job(
        db=db,
        job_id=data.job_id,
        recruiter_id=recruiter_id,
    )

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or you do not own this job",
        )

    return service.create_question_set(
        db=db,
        job_id=data.job_id,
        recruiter_id=recruiter_id,
        name=data.name,
        description=data.description,
    )


@router.get(
    "/interview-question-sets",
    response_model=list[InterviewQuestionSetResponse],
)
def list_my_question_sets(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    return service.get_question_sets_by_recruiter(
        db=db,
        recruiter_id=current_user.recruiter.id,
    )


@router.get(
    "/interview-question-sets/job/{job_id}",
    response_model=list[InterviewQuestionSetResponse],
)
def list_question_sets_by_job(
    job_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    recruiter_id = current_user.recruiter.id

    job = service.get_recruiter_job(
        db=db,
        job_id=job_id,
        recruiter_id=recruiter_id,
    )

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or you do not own this job",
        )

    return service.get_question_sets_by_job(
        db=db,
        job_id=job_id,
    )


@router.get(
    "/interview-question-sets/{question_set_id}",
    response_model=InterviewQuestionSetResponse,
)
def get_question_set(
    question_set_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    question_set = service.get_recruiter_question_set(
        db=db,
        question_set_id=question_set_id,
        recruiter_id=current_user.recruiter.id,
    )

    if question_set is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview question set not found",
        )

    # Fetch with questions loaded in sequence order.
    return service.get_question_set_by_id(
        db=db,
        question_set_id=question_set_id,
    )


@router.patch(
    "/interview-question-sets/{question_set_id}",
    response_model=InterviewQuestionSetResponse,
)
def update_question_set(
    question_set_id: UUID,
    data: InterviewQuestionSetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    question_set = service.get_recruiter_question_set(
        db=db,
        question_set_id=question_set_id,
        recruiter_id=current_user.recruiter.id,
    )

    if question_set is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview question set not found",
        )

    updates = data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update",
        )

    service.update_question_set(
        db=db,
        question_set=question_set,
        **updates,
    )

    return service.get_question_set_by_id(
        db=db,
        question_set_id=question_set_id,
    )


@router.delete(
    "/interview-question-sets/{question_set_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_question_set(
    question_set_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    question_set = service.get_recruiter_question_set(
        db=db,
        question_set_id=question_set_id,
        recruiter_id=current_user.recruiter.id,
    )

    if question_set is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview question set not found",
        )

    service.delete_question_set(
        db=db,
        question_set=question_set,
    )


# ============================================================
# INDIVIDUAL QUESTION ENDPOINTS
# ============================================================

@router.post(
    "/interview-question-sets/{question_set_id}/questions",
    response_model=InterviewQuestionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_question(
    question_set_id: UUID,
    data: InterviewQuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    question_set = service.get_recruiter_question_set(
        db=db,
        question_set_id=question_set_id,
        recruiter_id=current_user.recruiter.id,
    )

    if question_set is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview question set not found",
        )

    existing_questions = service.get_questions_by_set(
        db=db,
        question_set_id=question_set_id,
    )

    if any(
        question.sequence_number == data.sequence_number
        for question in existing_questions
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A question with this sequence number already exists",
        )

    return service.create_question(
        db=db,
        question_set_id=question_set_id,
        question_text=data.question_text,
        question_type=data.question_type,
        expected_topics=data.expected_topics,
        max_score=data.max_score,
        sequence_number=data.sequence_number,
    )


@router.get(
    "/interview-question-sets/{question_set_id}/questions",
    response_model=list[InterviewQuestionResponse],
)
def list_questions(
    question_set_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    question_set = service.get_recruiter_question_set(
        db=db,
        question_set_id=question_set_id,
        recruiter_id=current_user.recruiter.id,
    )

    if question_set is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview question set not found",
        )

    return service.get_questions_by_set(
        db=db,
        question_set_id=question_set_id,
    )


@router.patch(
    "/interview-questions/{question_id}",
    response_model=InterviewQuestionResponse,
)
def update_question(
    question_id: UUID,
    data: InterviewQuestionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    question = service.get_question_by_id(
        db=db,
        question_id=question_id,
    )

    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview question not found",
        )

    question_set = service.get_recruiter_question_set(
        db=db,
        question_set_id=question.question_set_id,
        recruiter_id=current_user.recruiter.id,
    )

    if question_set is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview question not found",
        )

    updates = data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update",
        )

    new_sequence = updates.get("sequence_number")

    if new_sequence is not None:
        existing_questions = service.get_questions_by_set(
            db=db,
            question_set_id=question.question_set_id,
        )

        if any(
            existing.id != question.id
            and existing.sequence_number == new_sequence
            for existing in existing_questions
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A question with this sequence number already exists",
            )

    return service.update_question(
        db=db,
        question=question,
        updates=updates,
    )


@router.delete(
    "/interview-questions/{question_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_question(
    question_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    question = service.get_question_by_id(
        db=db,
        question_id=question_id,
    )

    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview question not found",
        )

    question_set = service.get_recruiter_question_set(
        db=db,
        question_set_id=question.question_set_id,
        recruiter_id=current_user.recruiter.id,
    )

    if question_set is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview question not found",
        )

    service.delete_question(
        db=db,
        question=question,
    )