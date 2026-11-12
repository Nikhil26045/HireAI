
"""
HireAI - Recruiter Analytics & Reporting API

Provides recruiter-specific analytics for:
- Recruitment overview and KPIs
- Job performance
- Application status distribution
- Interview statistics
- Candidate score analytics
- Top candidate rankings
- Recruitment trends
- Job-specific analytics
- Paginated application analytics
- CSV export

All endpoints are restricted to the authenticated recruiter.
"""

import csv
import io
import logging

from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)
from fastapi.responses import StreamingResponse

from sqlalchemy import (
    and_,
    case,
    cast,
    Date,
    desc,
    extract,
    func,
    or_,
)
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.models.application import (
    Application,
    ApplicationStatus,
)
from app.models.candidate_score import CandidateScore
from app.models.interview_session import (
    InterviewSession,
    InterviewStatus,
)
from app.models.job import Job, JobStatus
from app.models.user import User

from app.routers.auth import require_recruiter


router = APIRouter(
    prefix="/recruiter/analytics",
    tags=["Recruiter Analytics"],
)

logger = logging.getLogger(__name__)


# ============================================================
# CONSTANTS
# ============================================================

VALID_TREND_INTERVALS = {
    "day",
    "week",
    "month",
}

MAX_PAGE_SIZE = 100
DEFAULT_PAGE_SIZE = 20

SCORE_FIELDS = {
    "overall": CandidateScore.overall_score,
    "resume": CandidateScore.resume_score,
    "interview": CandidateScore.interview_score,
    "job_relevance": CandidateScore.job_relevance_score,
}


# ============================================================
# AUTHENTICATION AND COMMON HELPERS
# ============================================================

def get_recruiter_profile_id(user: User) -> UUID:
    """
    Get the recruiter profile ID from the authenticated user.

    The application uses separate User and Recruiter profiles.
    All analytics queries are scoped to the recruiter profile.
    """

    recruiter = getattr(user, "recruiter", None)

    if recruiter is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Recruiter profile not found.",
        )

    return recruiter.id


def get_recruiter_jobs_query(
    db: Session,
    recruiter_id: UUID,
):
    """
    Return a query containing only the recruiter's jobs.
    """

    return db.query(Job).filter(
        Job.recruiter_id == recruiter_id
    )


def get_recruiter_applications_query(
    db: Session,
    recruiter_id: UUID,
):
    """
    Return applications belonging to jobs owned by the recruiter.
    """

    return (
        db.query(Application)
        .join(Job, Application.job_id == Job.id)
        .filter(Job.recruiter_id == recruiter_id)
    )


def get_recruiter_interviews_query(
    db: Session,
    recruiter_id: UUID,
):
    """
    Return interview sessions belonging to the recruiter.
    """

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
    )


def apply_date_filters(
    query,
    column,
    start_date: Optional[datetime],
    end_date: Optional[datetime],
):
    """
    Apply optional date filters to a SQLAlchemy query.

    Dates are interpreted as timestamps. Naive timestamps are
    interpreted as UTC to keep filtering consistent.
    """

    if start_date is not None:
        if start_date.tzinfo is None:
            start_date = start_date.replace(tzinfo=timezone.utc)

        query = query.filter(column >= start_date)

    if end_date is not None:
        if end_date.tzinfo is None:
            end_date = end_date.replace(tzinfo=timezone.utc)

        query = query.filter(column <= end_date)

    return query


def validate_date_range(
    start_date: Optional[datetime],
    end_date: Optional[datetime],
):
    """
    Validate the requested date range.
    """

    if start_date and end_date and start_date > end_date:
        raise HTTPException(
            status_code=400,
            detail="start_date cannot be later than end_date.",
        )


def validate_pagination(
    page: int,
    page_size: int,
):
    """
    Validate pagination parameters.
    """

    if page < 1:
        raise HTTPException(
            status_code=400,
            detail="Page must be greater than zero.",
        )

    if page_size < 1 or page_size > MAX_PAGE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Page size must be between 1 and {MAX_PAGE_SIZE}.",
        )


def safe_percentage(
    numerator: int | float,
    denominator: int | float,
) -> float:
    """
    Calculate a percentage without division-by-zero errors.
    """

    if not denominator:
        return 0.0

    return round((numerator / denominator) * 100, 2)


def safe_average(value) -> Optional[float]:
    """
    Convert SQL aggregate results into rounded floats.
    """

    if value is None:
        return None

    return round(float(value), 2)


def serialize_enum(value) -> str:
    """
    Serialize SQLAlchemy enum values.
    """

    return value.value if hasattr(value, "value") else str(value)


def get_application_count(
    db: Session,
    recruiter_id: UUID,
) -> int:
    """
    Return the recruiter's total application count.
    """

    return (
        get_recruiter_applications_query(db, recruiter_id)
        .count()
    )


def verify_recruiter_job(
    db: Session,
    recruiter_id: UUID,
    job_id: UUID,
) -> Job:
    """
    Retrieve a job only if it belongs to the recruiter.
    """

    job = (
        get_recruiter_jobs_query(db, recruiter_id)
        .filter(Job.id == job_id)
        .first()
    )

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found.",
        )

    return job


def verify_recruiter_application(
    db: Session,
    recruiter_id: UUID,
    application_id: UUID,
) -> Application:
    """
    Retrieve an application only if its job belongs to the recruiter.
    """

    application = (
        get_recruiter_applications_query(db, recruiter_id)
        .filter(Application.id == application_id)
        .first()
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    return application


# ============================================================
# 1. RECRUITER DASHBOARD OVERVIEW
# ============================================================

@router.get("/overview")
def get_analytics_overview(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    """
    Return high-level recruitment KPIs.

    Includes:
    - Total jobs
    - Open jobs
    - Closed jobs
    - Total applications
    - Shortlisted candidates
    - Rejected applications
    - Completed interviews
    - In-progress interviews
    - Average candidate score
    """

    recruiter_id = get_recruiter_profile_id(current_user)

    validate_date_range(start_date, end_date)

    jobs_query = get_recruiter_jobs_query(
        db,
        recruiter_id,
    )

    applications_query = get_recruiter_applications_query(
        db,
        recruiter_id,
    )

    interviews_query = get_recruiter_interviews_query(
        db,
        recruiter_id,
    )

    if start_date or end_date:
        jobs_query = apply_date_filters(
            jobs_query,
            Job.created_at,
            start_date,
            end_date,
        )

        applications_query = apply_date_filters(
            applications_query,
            Application.applied_at,
            start_date,
            end_date,
        )

        interviews_query = apply_date_filters(
            interviews_query,
            InterviewSession.created_at,
            start_date,
            end_date,
        )

    total_jobs = jobs_query.count()

    open_jobs = jobs_query.filter(
        Job.status == JobStatus.OPEN
    ).count()

    closed_jobs = jobs_query.filter(
        Job.status == JobStatus.CLOSED
    ).count()

    total_applications = applications_query.count()

    shortlisted = applications_query.filter(
        Application.status == ApplicationStatus.SHORTLISTED
    ).count()

    rejected = applications_query.filter(
        Application.status == ApplicationStatus.REJECTED
    ).count()

    total_interviews = interviews_query.count()

    completed_interviews = interviews_query.filter(
        InterviewSession.status == InterviewStatus.COMPLETED
    ).count()

    in_progress_interviews = interviews_query.filter(
        InterviewSession.status == InterviewStatus.IN_PROGRESS
    ).count()

    average_score = (
        applications_query
        .join(
            CandidateScore,
            CandidateScore.application_id == Application.id,
        )
        .with_entities(
            func.avg(CandidateScore.overall_score)
        )
        .scalar()
    )

    return {
        "generated_at": datetime.now(timezone.utc),
        "jobs": {
            "total": total_jobs,
            "open": open_jobs,
            "closed": closed_jobs,
            "draft": jobs_query.filter(
                Job.status == JobStatus.DRAFT
            ).count(),
            "archived": jobs_query.filter(
                Job.status == JobStatus.ARCHIVED
            ).count(),
        },
        "applications": {
            "total": total_applications,
            "shortlisted": shortlisted,
            "rejected": rejected,
            "shortlist_rate": safe_percentage(
                shortlisted,
                total_applications,
            ),
            "rejection_rate": safe_percentage(
                rejected,
                total_applications,
            ),
        },
        "interviews": {
            "total": total_interviews,
            "completed": completed_interviews,
            "in_progress": in_progress_interviews,
            "completion_rate": safe_percentage(
                completed_interviews,
                total_interviews,
            ),
        },
        "scores": {
            "average_overall_score": safe_average(
                average_score
            ),
        },
    }


# ============================================================
# 2. APPLICATION STATUS DISTRIBUTION
# ============================================================

@router.get("/application-status")
def get_application_status_distribution(
    job_id: Optional[UUID] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    """
    Return the distribution of application statuses.

    Can optionally be filtered by a particular job.
    """

    recruiter_id = get_recruiter_profile_id(current_user)

    validate_date_range(start_date, end_date)

    query = get_recruiter_applications_query(
        db,
        recruiter_id,
    )

    query = apply_date_filters(
        query,
        Application.applied_at,
        start_date,
        end_date,
    )

    if job_id:
        verify_recruiter_job(
            db,
            recruiter_id,
            job_id,
        )

        query = query.filter(
            Application.job_id == job_id
        )

    results = (
        query.with_entities(
            Application.status,
            func.count(Application.id),
        )
        .group_by(Application.status)
        .all()
    )

    counts = {
        serialize_enum(status_value): count
        for status_value, count in results
    }

    total = sum(counts.values())

    distribution = []

    for application_status in ApplicationStatus:
        key = application_status.value
        count = counts.get(key, 0)

        distribution.append({
            "status": key,
            "count": count,
            "percentage": safe_percentage(
                count,
                total,
            ),
        })

    return {
        "total_applications": total,
        "distribution": distribution,
    }


# ============================================================
# 3. JOB PERFORMANCE ANALYTICS
# ============================================================

@router.get("/jobs")
def get_job_analytics(
    page: int = Query(1, ge=1),
    page_size: int = Query(
        DEFAULT_PAGE_SIZE,
        ge=1,
        le=MAX_PAGE_SIZE,
    ),
    job_status: Optional[JobStatus] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    """
    Return job-wise recruitment statistics.

    Includes:
    - Job title and status
    - Total applicants
    - Shortlisted applicants
    - Rejected applicants
    - Average overall score
    - Completed interviews
    """

    recruiter_id = get_recruiter_profile_id(current_user)

    validate_date_range(start_date, end_date)
    validate_pagination(page, page_size)

    query = get_recruiter_jobs_query(
        db,
        recruiter_id,
    )

    query = apply_date_filters(
        query,
        Job.created_at,
        start_date,
        end_date,
    )

    if job_status:
        query = query.filter(
            Job.status == job_status
        )

    total = query.count()

    jobs = (
        query
        .order_by(Job.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    job_results = []

    for job in jobs:
        applications = (
            db.query(Application)
            .filter(Application.job_id == job.id)
        )

        applicant_count = applications.count()

        shortlisted = applications.filter(
            Application.status == ApplicationStatus.SHORTLISTED
        ).count()

        rejected = applications.filter(
            Application.status == ApplicationStatus.REJECTED
        ).count()

        interview_stats = (
            db.query(
                func.count(InterviewSession.id),
                func.sum(
                    case(
                        (
                            InterviewSession.status
                            == InterviewStatus.COMPLETED,
                            1,
                        ),
                        else_=0,
                    )
                ),
            )
            .join(
                Application,
                InterviewSession.application_id == Application.id,
            )
            .filter(Application.job_id == job.id)
            .first()
        )

        average_score = (
            db.query(func.avg(CandidateScore.overall_score))
            .join(
                Application,
                CandidateScore.application_id == Application.id,
            )
            .filter(Application.job_id == job.id)
            .scalar()
        )

        job_results.append({
            "job_id": str(job.id),
            "title": job.title,
            "status": serialize_enum(job.status),
            "location": job.location,
            "employment_type": job.employment_type,
            "created_at": job.created_at,
            "applicants": {
                "total": applicant_count,
                "shortlisted": shortlisted,
                "rejected": rejected,
            },
            "interviews": {
                "total": interview_stats[0] or 0,
                "completed": interview_stats[1] or 0,
            },
            "average_overall_score": safe_average(
                average_score
            ),
        })

    return {
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": (
                (total + page_size - 1) // page_size
            ),
        },
        "jobs": job_results,
    }


# ============================================================
# 4. INTERVIEW ANALYTICS
# ============================================================

@router.get("/interviews")
def get_interview_analytics(
    job_id: Optional[UUID] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    """
    Return interview session statistics.

    Includes:
    - Scheduled interviews
    - In-progress interviews
    - Completed interviews
    - Cancelled interviews
    - Expired interviews
    - Average interview duration
    """

    recruiter_id = get_recruiter_profile_id(current_user)

    validate_date_range(start_date, end_date)

    query = get_recruiter_interviews_query(
        db,
        recruiter_id,
    )

    query = apply_date_filters(
        query,
        InterviewSession.created_at,
        start_date,
        end_date,
    )

    if job_id:
        verify_recruiter_job(
            db,
            recruiter_id,
            job_id,
        )

        query = (
            query
            .join(
                Application,
                InterviewSession.application_id == Application.id,
            )
            .filter(Application.job_id == job_id)
        )

    results = (
        query.with_entities(
            InterviewSession.status,
            func.count(InterviewSession.id),
        )
        .group_by(InterviewSession.status)
        .all()
    )

    counts = {
        serialize_enum(session_status): count
        for session_status, count in results
    }

    total = sum(counts.values())

    completed = counts.get(
        InterviewStatus.COMPLETED.value,
        0,
    )

    duration_expression = (
        extract(
            "epoch",
            InterviewSession.completed_at
            - InterviewSession.started_at,
        )
    )

    average_duration = (
        query.filter(
            InterviewSession.started_at.isnot(None),
            InterviewSession.completed_at.isnot(None),
            InterviewSession.completed_at
            >= InterviewSession.started_at,
        )
        .with_entities(
            func.avg(duration_expression)
        )
        .scalar()
    )

    distribution = []

    for interview_status in InterviewStatus:
        count = counts.get(interview_status.value, 0)

        distribution.append({
            "status": interview_status.value,
            "count": count,
            "percentage": safe_percentage(
                count,
                total,
            ),
        })

    return {
        "total_interviews": total,
        "completed_interviews": completed,
        "completion_rate": safe_percentage(
            completed,
            total,
        ),
        "average_duration_seconds": safe_average(
            average_duration
        ),
        "distribution": distribution,
    }


# ============================================================
# 5. CANDIDATE SCORE ANALYTICS
# ============================================================

@router.get("/scores")
def get_score_analytics(
    job_id: Optional[UUID] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    """
    Return aggregate candidate scoring statistics.

    Includes:
    - Average overall score
    - Average resume score
    - Average interview score
    - Average job relevance score
    - Highest and lowest overall scores
    - Number of evaluated applications
    """

    recruiter_id = get_recruiter_profile_id(current_user)

    validate_date_range(start_date, end_date)

    query = (
        db.query(CandidateScore)
        .join(
            Application,
            CandidateScore.application_id == Application.id,
        )
        .join(
            Job,
            Application.job_id == Job.id,
        )
        .filter(Job.recruiter_id == recruiter_id)
    )

    query = apply_date_filters(
        query,
        CandidateScore.created_at,
        start_date,
        end_date,
    )

    if job_id:
        verify_recruiter_job(
            db,
            recruiter_id,
            job_id,
        )

        query = query.filter(
            Application.job_id == job_id
        )

    aggregates = (
        query.with_entities(
            func.count(CandidateScore.id),
            func.avg(CandidateScore.overall_score),
            func.avg(CandidateScore.resume_score),
            func.avg(CandidateScore.interview_score),
            func.avg(CandidateScore.job_relevance_score),
            func.max(CandidateScore.overall_score),
            func.min(CandidateScore.overall_score),
        )
        .first()
    )

    return {
        "evaluated_applications": aggregates[0] or 0,
        "averages": {
            "overall": safe_average(aggregates[1]),
            "resume": safe_average(aggregates[2]),
            "interview": safe_average(aggregates[3]),
            "job_relevance": safe_average(aggregates[4]),
        },
        "overall_score_range": {
            "highest": safe_average(aggregates[5]),
            "lowest": safe_average(aggregates[6]),
        },
    }


# ============================================================
# 6. TOP CANDIDATE RANKINGS
# ============================================================

@router.get("/top-candidates")
def get_top_candidates(
    job_id: Optional[UUID] = Query(None),
    limit: int = Query(10, ge=1, le=50),
    minimum_score: float = Query(
        0,
        ge=0,
        le=100,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    """
    Return candidates ranked by their overall score.

    Candidates without an overall score are excluded.
    """

    recruiter_id = get_recruiter_profile_id(current_user)

    query = (
        db.query(
            Application.id.label("application_id"),
            Application.candidate_id,
            Application.job_id,
            Application.status,
            Application.applied_at,
            Job.title.label("job_title"),
            CandidateScore.resume_score,
            CandidateScore.interview_score,
            CandidateScore.job_relevance_score,
            CandidateScore.overall_score,
        )
        .join(
            Job,
            Application.job_id == Job.id,
        )
        .join(
            CandidateScore,
            CandidateScore.application_id == Application.id,
        )
        .filter(
            Job.recruiter_id == recruiter_id,
            CandidateScore.overall_score.isnot(None),
            CandidateScore.overall_score >= minimum_score,
        )
    )

    if job_id:
        verify_recruiter_job(
            db,
            recruiter_id,
            job_id,
        )

        query = query.filter(
            Application.job_id == job_id
        )

    candidates = (
        query
        .order_by(
            CandidateScore.overall_score.desc(),
            Application.applied_at.asc(),
        )
        .limit(limit)
        .all()
    )

    rankings = []

    for rank, candidate in enumerate(candidates, start=1):
        rankings.append({
            "rank": rank,
            "application_id": str(candidate.application_id),
            "candidate_id": str(candidate.candidate_id),
            "job_id": str(candidate.job_id),
            "job_title": candidate.job_title,
            "application_status": serialize_enum(
                candidate.status
            ),
            "applied_at": candidate.applied_at,
            "scores": {
                "resume": safe_average(candidate.resume_score),
                "interview": safe_average(candidate.interview_score),
                "job_relevance": safe_average(
                    candidate.job_relevance_score
                ),
                "overall": safe_average(
                    candidate.overall_score
                ),
            },
        })

    return {
        "total_returned": len(rankings),
        "rankings": rankings,
        "ranking_basis": "overall_score_descending",
    }


# ============================================================
# 7. RECRUITMENT TRENDS
# ============================================================

@router.get("/trends")
def get_recruitment_trends(
    interval: str = Query("month"),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    """
    Return application trends grouped by day, week or month.

    This endpoint can be used to generate recruitment charts.
    """

    recruiter_id = get_recruiter_profile_id(current_user)

    validate_date_range(start_date, end_date)

    if interval not in VALID_TREND_INTERVALS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid interval. Choose day, week or month."
            ),
        )

    period = func.date_trunc(
        interval,
        Application.applied_at,
    )

    query = (
        get_recruiter_applications_query(
            db,
            recruiter_id,
        )
    )

    query = apply_date_filters(
        query,
        Application.applied_at,
        start_date,
        end_date,
    )

    results = (
        query
        .with_entities(
            period.label("period"),
            func.count(Application.id).label("applications"),
        )
        .group_by(period)
        .order_by(period.asc())
        .all()
    )

    trends = []

    for result in results:
        trends.append({
            "period": result.period.isoformat(),
            "applications": result.applications,
        })

    return {
        "interval": interval,
        "total_periods": len(trends),
        "trends": trends,
    }


# ============================================================
# 8. INDIVIDUAL JOB ANALYTICS
# ============================================================

@router.get("/jobs/{job_id}")
def get_single_job_analytics(
    job_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    """
    Return detailed recruitment analytics for one job.
    """

    recruiter_id = get_recruiter_profile_id(current_user)

    job = verify_recruiter_job(
        db,
        recruiter_id,
        job_id,
    )

    applications = (
        db.query(Application)
        .filter(Application.job_id == job_id)
    )

    total_applications = applications.count()

    status_results = (
        applications
        .with_entities(
            Application.status,
            func.count(Application.id),
        )
        .group_by(Application.status)
        .all()
    )

    status_counts = {
        serialize_enum(key): value
        for key, value in status_results
    }

    score_results = (
        db.query(
            func.avg(CandidateScore.resume_score),
            func.avg(CandidateScore.interview_score),
            func.avg(CandidateScore.job_relevance_score),
            func.avg(CandidateScore.overall_score),
        )
        .join(
            Application,
            CandidateScore.application_id == Application.id,
        )
        .filter(Application.job_id == job_id)
        .first()
    )

    interview_results = (
        db.query(
            InterviewSession.status,
            func.count(InterviewSession.id),
        )
        .join(
            Application,
            InterviewSession.application_id == Application.id,
        )
        .filter(Application.job_id == job_id)
        .group_by(InterviewSession.status)
        .all()
    )

    interview_counts = {
        serialize_enum(key): value
        for key, value in interview_results
    }

    return {
        "job": {
            "id": str(job.id),
            "title": job.title,
            "status": serialize_enum(job.status),
            "location": job.location,
            "employment_type": job.employment_type,
            "created_at": job.created_at,
        },
        "applications": {
            "total": total_applications,
            "statuses": status_counts,
        },
        "interviews": {
            "total": sum(interview_counts.values()),
            "statuses": interview_counts,
        },
        "average_scores": {
            "resume": safe_average(score_results[0]),
            "interview": safe_average(score_results[1]),
            "job_relevance": safe_average(score_results[2]),
            "overall": safe_average(score_results[3]),
        },
    }


# ============================================================
# 9. PAGINATED APPLICATION ANALYTICS
# ============================================================

@router.get("/applications")
def get_application_analytics(
    page: int = Query(1, ge=1),
    page_size: int = Query(
        DEFAULT_PAGE_SIZE,
        ge=1,
        le=MAX_PAGE_SIZE,
    ),
    job_id: Optional[UUID] = Query(None),
    application_status: Optional[ApplicationStatus] = Query(None),
    minimum_score: Optional[float] = Query(
        None,
        ge=0,
        le=100,
    ),
    maximum_score: Optional[float] = Query(
        None,
        ge=0,
        le=100,
    ),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    """
    Return paginated application and scoring information.

    Supports filters for:
    - Job
    - Application status
    - Minimum overall score
    - Maximum overall score
    - Application date
    """

    recruiter_id = get_recruiter_profile_id(current_user)

    validate_date_range(start_date, end_date)
    validate_pagination(page, page_size)

    if (
        minimum_score is not None
        and maximum_score is not None
        and minimum_score > maximum_score
    ):
        raise HTTPException(
            status_code=400,
            detail="minimum_score cannot exceed maximum_score.",
        )

    query = (
        db.query(
            Application,
            Job.title.label("job_title"),
            CandidateScore,
        )
        .join(
            Job,
            Application.job_id == Job.id,
        )
        .outerjoin(
            CandidateScore,
            CandidateScore.application_id == Application.id,
        )
        .filter(
            Job.recruiter_id == recruiter_id
        )
    )

    query = apply_date_filters(
        query,
        Application.applied_at,
        start_date,
        end_date,
    )

    if job_id:
        verify_recruiter_job(
            db,
            recruiter_id,
            job_id,
        )

        query = query.filter(
            Application.job_id == job_id
        )

    if application_status:
        query = query.filter(
            Application.status == application_status
        )

    if minimum_score is not None:
        query = query.filter(
            CandidateScore.overall_score >= minimum_score
        )

    if maximum_score is not None:
        query = query.filter(
            CandidateScore.overall_score <= maximum_score
        )

    total = query.count()

    rows = (
        query
        .order_by(Application.applied_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    results = []

    for application, job_title, score in rows:
        results.append({
            "application_id": str(application.id),
            "candidate_id": str(application.candidate_id),
            "job_id": str(application.job_id),
            "job_title": job_title,
            "status": serialize_enum(application.status),
            "applied_at": application.applied_at,
            "scores": {
                "resume": (
                    safe_average(score.resume_score)
                    if score else None
                ),
                "interview": (
                    safe_average(score.interview_score)
                    if score else None
                ),
                "job_relevance": (
                    safe_average(score.job_relevance_score)
                    if score else None
                ),
                "overall": (
                    safe_average(score.overall_score)
                    if score else None
                ),
            },
        })

    return {
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": (
                (total + page_size - 1) // page_size
            ),
        },
        "applications": results,
    }


# ============================================================
# 10. CSV EXPORT
# ============================================================

@router.get("/export/applications")
def export_application_analytics(
    job_id: Optional[UUID] = Query(None),
    application_status: Optional[ApplicationStatus] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    """
    Export recruiter-owned application analytics as CSV.

    The export includes application identifiers, job details,
    status and available score components.
    """

    recruiter_id = get_recruiter_profile_id(current_user)

    validate_date_range(start_date, end_date)

    query = (
        db.query(
            Application,
            Job.title.label("job_title"),
            CandidateScore,
        )
        .join(
            Job,
            Application.job_id == Job.id,
        )
        .outerjoin(
            CandidateScore,
            CandidateScore.application_id == Application.id,
        )
        .filter(
            Job.recruiter_id == recruiter_id
        )
    )

    query = apply_date_filters(
        query,
        Application.applied_at,
        start_date,
        end_date,
    )

    if job_id:
        verify_recruiter_job(
            db,
            recruiter_id,
            job_id,
        )

        query = query.filter(
            Application.job_id == job_id
        )

    if application_status:
        query = query.filter(
            Application.status == application_status
        )

    rows = (
        query
        .order_by(Application.applied_at.desc())
        .all()
    )

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Application ID",
        "Candidate ID",
        "Job ID",
        "Job Title",
        "Application Status",
        "Applied At",
        "Resume Score",
        "Interview Score",
        "Job Relevance Score",
        "Overall Score",
    ])

    for application, job_title, score in rows:
        writer.writerow([
            str(application.id),
            str(application.candidate_id),
            str(application.job_id),
            job_title,
            serialize_enum(application.status),
            (
                application.applied_at.isoformat()
                if application.applied_at
                else ""
            ),
            score.resume_score if score else "",
            score.interview_score if score else "",
            score.job_relevance_score if score else "",
            score.overall_score if score else "",
        ])

    output.seek(0)

    filename = (
        f"hireai_applications_"
        f"{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.csv"
    )

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": (
                f'attachment; filename="{filename}"'
            )
        },
    )


# ============================================================
# 11. APPLICATION FUNNEL ANALYTICS
# ============================================================

@router.get("/application-funnel")
def get_application_funnel(
    job_id: Optional[UUID] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    """
    Return a recruitment funnel based on application statuses.

    These counts represent current application states, not
    unique historical transitions between stages.
    """

    recruiter_id = get_recruiter_profile_id(current_user)

    validate_date_range(start_date, end_date)

    query = get_recruiter_applications_query(
        db,
        recruiter_id,
    )

    query = apply_date_filters(
        query,
        Application.applied_at,
        start_date,
        end_date,
    )

    if job_id:
        verify_recruiter_job(
            db,
            recruiter_id,
            job_id,
        )

        query = query.filter(
            Application.job_id == job_id
        )

    stages = [
        ApplicationStatus.APPLIED,
        ApplicationStatus.RESUME_PROCESSING,
        ApplicationStatus.INTERVIEW_PENDING,
        ApplicationStatus.INTERVIEW_COMPLETED,
        ApplicationStatus.UNDER_REVIEW,
        ApplicationStatus.SHORTLISTED,
    ]

    funnel = []
    previous_count = None

    for stage in stages:
        count = query.filter(
            Application.status == stage
        ).count()

        funnel.append({
            "stage": stage.value,
            "count": count,
            "retention_from_previous": (
                safe_percentage(count, previous_count)
                if previous_count is not None
                else 100.0
            ),
        })

        previous_count = count

    return {
        "funnel": funnel,
        "note": (
            "The funnel reflects current application statuses. "
            "It does not reconstruct historical stage transitions."
        ),
    }


# ============================================================
# 12. RECRUITMENT HEALTH CHECK
# ============================================================

@router.get("/health")
def get_analytics_health(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_recruiter),
):
    """
    Return a lightweight health summary for the recruiter's data.

    This is an analytics endpoint, not an infrastructure health check.
    """

    recruiter_id = get_recruiter_profile_id(current_user)

    total_jobs = (
        get_recruiter_jobs_query(
            db,
            recruiter_id,
        ).count()
    )

    total_applications = (
        get_recruiter_applications_query(
            db,
            recruiter_id,
        ).count()
    )

    total_interviews = (
        get_recruiter_interviews_query(
            db,
            recruiter_id,
        ).count()
    )

    scored_applications = (
        db.query(CandidateScore)
        .join(
            Application,
            CandidateScore.application_id == Application.id,
        )
        .join(
            Job,
            Application.job_id == Job.id,
        )
        .filter(
            Job.recruiter_id == recruiter_id,
            CandidateScore.overall_score.isnot(None),
        )
        .count()
    )

    return {
        "status": "available",
        "data": {
            "jobs": total_jobs,
            "applications": total_applications,
            "interviews": total_interviews,
            "scored_applications": scored_applications,
        },
        "coverage": {
            "scored_applications": safe_percentage(
                scored_applications,
                total_applications,
            ),
        },
    }
