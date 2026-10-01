import re
import uuid

from sqlalchemy.orm import Session
from app.models.application import Application
from app.models.candidate_score import CandidateScore
from app.models.score_breakdown import ScoreBreakdown
from app.models.job_requirement import JobRequirement
from app.models.resume import Resume
from app.services.resume_parser_service import get_parsed_resume


def normalize_text(value: str | None) -> str:
    if not value:
        return ""

    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9+#.\- ]+", " ", value)
    value = re.sub(r"\s+", " ", value)

    return value


def requirement_matches_resume(
    requirement: JobRequirement,
    parsed_data: dict,
    raw_text: str = "",
) -> bool:
    requirement_name = normalize_text(
        requirement.requirement_name
    )

    if not requirement_name:
        return False

    requirement_type = normalize_text(
        requirement.requirement_type
    )

    # Skill matching
    if requirement_type == "skill":
        skills = parsed_data.get("skills", [])

        normalized_skills = [
            normalize_text(skill)
            for skill in skills
        ]

        return requirement_name in normalized_skills

    # Education matching
    if requirement_type == "education":
        education = parsed_data.get("education", [])

        education_text = normalize_text(
            " ".join(str(item) for item in education)
        )

        return requirement_name in education_text

    # Experience matching
    if requirement_type == "experience":
        experience_years = parsed_data.get(
            "total_experience_years"
        )

        numbers = re.findall(
            r"\d+",
            requirement_name,
        )

        if experience_years is None or not numbers:
            return False

        required_years = int(numbers[0])

        return experience_years >= required_years

    # Other requirement types
    searchable_text = normalize_text(
        " ".join(
            [
                str(parsed_data.get("summary", "")),
                str(parsed_data.get("projects", "")),
                str(parsed_data.get("certifications", "")),
                str(parsed_data.get("experience", "")),
                raw_text,
            ]
        )
    )

    return requirement_name in searchable_text


def calculate_match_score(
    requirements: list[JobRequirement],
    parsed_data: dict,
    raw_text: str = "",
) -> dict:
    total_weight = 0
    matched_weight = 0

    matched_requirements = []
    unmatched_requirements = []

    for requirement in requirements:
        importance = requirement.importance

        total_weight += importance

        matched = requirement_matches_resume(
            requirement=requirement,
            parsed_data=parsed_data,
            raw_text=raw_text,
        )

        requirement_result = {
            "requirement_id": str(requirement.id),
            "requirement_type": requirement.requirement_type,
            "requirement_name": requirement.requirement_name,
            "importance": importance,
        }

        if matched:
            matched_weight += importance
            matched_requirements.append(requirement_result)
        else:
            unmatched_requirements.append(requirement_result)

    score = (
        round((matched_weight / total_weight) * 100, 2)
        if total_weight > 0
        else 0.0
    )

    return {
        "score": score,
        "total_weight": total_weight,
        "matched_weight": matched_weight,
        "matched_requirements": matched_requirements,
        "unmatched_requirements": unmatched_requirements,
    }


def match_resume_to_job(
    db: Session,
    resume_id: uuid.UUID,
    job_id: uuid.UUID,
) -> dict:
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .first()
    )

    if not resume:
        raise ValueError("Resume not found")

    parsed_resume = get_parsed_resume(
        db=db,
        resume_id=resume_id,
    )

    if not parsed_resume:
        raise ValueError(
            "Resume has not been processed yet"
        )

    requirements = (
        db.query(JobRequirement)
        .filter(JobRequirement.job_id == job_id)
        .order_by(JobRequirement.created_at.asc())
        .all()
    )

    if not requirements:
        raise ValueError(
            "No requirements found for this job"
        )

    parsed_data = parsed_resume.parsed_data or {}

    result = calculate_match_score(
        requirements=requirements,
        parsed_data=parsed_data,
        raw_text=parsed_resume.raw_text or "",
    )

    return {
        "resume_id": str(resume_id),
        "job_id": str(job_id),
        **result,
    }

def save_matching_result(
    db: Session,
    application: Application,
    matching_result: dict,
) -> CandidateScore:
    """
    Save or update the resume matching result
    for an application.
    """

    candidate_score = (
        db.query(CandidateScore)
        .filter(
            CandidateScore.application_id == application.id
        )
        .first()
    )

    if candidate_score is None:
        candidate_score = CandidateScore(
            application_id=application.id,
        )
        db.add(candidate_score)
        db.flush()

    score = matching_result["score"]

    candidate_score.resume_score = score
    candidate_score.job_relevance_score = score
    candidate_score.scoring_model = "rule_based_resume_matching"
    candidate_score.model_version = "1.0"

    # Replace old breakdowns with the latest results.
    candidate_score.breakdowns.clear()

    matched = matching_result["matched_requirements"]
    unmatched = matching_result["unmatched_requirements"]

    total_weight = matching_result["total_weight"]

    for requirement in matched + unmatched:
        is_matched = requirement in matched

        weight = requirement["importance"]

        requirement_score = 100.0 if is_matched else 0.0

        explanation = (
            "Requirement matched in the parsed resume."
            if is_matched
            else "Requirement not found in the parsed resume."
        )

        breakdown = ScoreBreakdown(
            category=requirement["requirement_type"],
            score=requirement_score,
            weight=(
                (weight / total_weight) * 100
                if total_weight > 0
                else 0.0
            ),
            explanation=(
                f"{requirement['requirement_name']}: "
                f"{explanation}"
            ),
        )

        candidate_score.breakdowns.append(breakdown)

    db.commit()
    db.refresh(candidate_score)

    return candidate_score