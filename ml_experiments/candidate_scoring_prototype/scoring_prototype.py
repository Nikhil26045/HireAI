#!/usr/bin/env python3
"""
HireAI - Candidate Scoring Model Preliminary Prototype
======================================================
Author: Member 3 (Candidate Scoring Model)
Project: HireAI - AI-Based Candidate Evaluation System

IMPORTANT DISCLAIMER:
---------------------
This script is a standalone rule-based preliminary scoring prototype designed
for initial design validation and architecture demonstration.
- It is NOT a trained machine learning model.
- The weights used here are illustrative engineering heuristics and have NOT
  been fitted or validated on real candidate hiring outcomes.
- No ground-truth accuracy, precision, recall, MAE, or RMSE should be inferred.
- This module is completely isolated and does not connect to the live backend,
  FastAPI server, or database.
"""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple


# Preliminary illustrative category weights (Must sum to 1.0)
CATEGORY_WEIGHTS = {
    "resume": 0.35,
    "job_matching": 0.35,
    "interview": 0.30,
}

# Sub-feature weights within each category (Each subcategory sums to 1.0)
SUBFEATURE_WEIGHTS = {
    "resume": {
        "skills_relevance": 0.45,
        "relevant_experience": 0.40,
        "education_relevance": 0.15,
    },
    "job_matching": {
        "required_skills_matched": 0.40,
        "skill_retention_score": 0.20,  # derived as (1.0 - missing_required_skills)
        "overall_jd_relevance": 0.40,
    },
    "interview": {
        "interview_answer_relevance": 0.65,
        "communication_assessment": 0.35,
    },
}

# Default fallback values for missing, None, or out-of-range features
DEFAULT_FALLBACKS = {
    "skills_relevance": 0.0,
    "relevant_experience": 0.0,
    "education_relevance": 0.5,
    "required_skills_matched": 0.0,
    "missing_required_skills": 1.0,
    "overall_jd_relevance": 0.0,
    "interview_answer_relevance": 0.0,
    "communication_assessment": 0.5,
}


def sanitize_feature(
    candidate: Dict[str, Any],
    feature_name: str,
    default_val: float,
    min_val: float = 0.0,
    max_val: float = 1.0,
) -> Tuple[float, bool]:
    """
    Safely retrieves and validates a feature value from candidate data.
    Clamps value to [min_val, max_val] and replaces missing/invalid types with default_val.

    Returns:
        Tuple[float, bool]: (sanitized_value, was_fallback_used)
    """
    val = candidate.get(feature_name)
    if val is None:
        return default_val, True

    # Reject boolean values explicitly since bool is a subclass of int in Python
    # (e.g. float(True) == 1.0, float(False) == 0.0)
    if isinstance(val, bool):
        return default_val, True

    try:
        val_float = float(val)
        # Check for NaN / Infinity
        if val_float != val_float or val_float in (float("inf"), float("-inf")):
            return default_val, True
        
        # Clamp between min_val and max_val
        clamped = max(min_val, min(max_val, val_float))
        was_clamped_or_fallback = clamped != val_float
        return clamped, was_clamped_or_fallback
    except (ValueError, TypeError):
        return default_val, True


def determine_category_status(
    features_present: int,
    total_features: int,
) -> str:
    """
    Determines category evaluation status based on valid features present.
    - EVALUATED: All required features contain valid evaluation data.
    - PARTIAL: Some required features contain valid data (between 1 and total - 1).
    - NOT_EVALUATED: Zero required features contain valid data.
    """
    if features_present == total_features:
        return "EVALUATED"
    elif features_present > 0:
        return "PARTIAL"
    else:
        return "NOT_EVALUATED"


def calculate_resume_score(candidate: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes normalized resume score (0 to 100) and feature audit details.
    When category is not fully evaluated, score is None.
    """
    weights = SUBFEATURE_WEIGHTS["resume"]

    skills_rel, f1 = sanitize_feature(
        candidate, "skills_relevance", DEFAULT_FALLBACKS["skills_relevance"]
    )
    exp_rel, f2 = sanitize_feature(
        candidate, "relevant_experience", DEFAULT_FALLBACKS["relevant_experience"]
    )
    edu_rel, f3 = sanitize_feature(
        candidate, "education_relevance", DEFAULT_FALLBACKS["education_relevance"]
    )

    fallbacks = [k for k, used in [
        ("skills_relevance", f1),
        ("relevant_experience", f2),
        ("education_relevance", f3),
    ] if used]

    valid_count = 3 - len(fallbacks)
    status = determine_category_status(valid_count, 3)

    raw_score = (
        skills_rel * weights["skills_relevance"]
        + exp_rel * weights["relevant_experience"]
        + edu_rel * weights["education_relevance"]
    )
    score_100 = round(raw_score * 100.0, 2)

    return {
        "status": status,
        "score": score_100 if status == "EVALUATED" else None,
        "raw_fallback_score": score_100,
        "features": {
            "skills_relevance": skills_rel,
            "relevant_experience": exp_rel,
            "education_relevance": edu_rel,
        },
        "fallbacks_applied": fallbacks,
    }


def calculate_job_matching_score(candidate: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes normalized job matching score (0 to 100) and feature audit details.
    When category is not fully evaluated, score is None.
    """
    weights = SUBFEATURE_WEIGHTS["job_matching"]

    req_matched, f1 = sanitize_feature(
        candidate, "required_skills_matched", DEFAULT_FALLBACKS["required_skills_matched"]
    )
    missing_req, f2 = sanitize_feature(
        candidate, "missing_required_skills", DEFAULT_FALLBACKS["missing_required_skills"]
    )
    jd_rel, f3 = sanitize_feature(
        candidate, "overall_jd_relevance", DEFAULT_FALLBACKS["overall_jd_relevance"]
    )

    fallbacks = [k for k, used in [
        ("required_skills_matched", f1),
        ("missing_required_skills", f2),
        ("overall_jd_relevance", f3),
    ] if used]

    valid_count = 3 - len(fallbacks)
    status = determine_category_status(valid_count, 3)

    # Invert missing_required_skills so that higher is better
    skill_retention = 1.0 - missing_req

    raw_score = (
        req_matched * weights["required_skills_matched"]
        + skill_retention * weights["skill_retention_score"]
        + jd_rel * weights["overall_jd_relevance"]
    )
    score_100 = round(raw_score * 100.0, 2)

    return {
        "status": status,
        "score": score_100 if status == "EVALUATED" else None,
        "raw_fallback_score": score_100,
        "features": {
            "required_skills_matched": req_matched,
            "missing_required_skills": missing_req,
            "skill_retention_score": round(skill_retention, 4),
            "overall_jd_relevance": jd_rel,
        },
        "fallbacks_applied": fallbacks,
    }


def calculate_interview_score(candidate: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes normalized interview score (0 to 100) and feature audit details.
    When category is not fully evaluated, score is None.
    """
    weights = SUBFEATURE_WEIGHTS["interview"]

    ans_rel, f1 = sanitize_feature(
        candidate, "interview_answer_relevance", DEFAULT_FALLBACKS["interview_answer_relevance"]
    )
    comm_assess, f2 = sanitize_feature(
        candidate, "communication_assessment", DEFAULT_FALLBACKS["communication_assessment"]
    )

    fallbacks = [k for k, used in [
        ("interview_answer_relevance", f1),
        ("communication_assessment", f2),
    ] if used]

    valid_count = 2 - len(fallbacks)
    status = determine_category_status(valid_count, 2)

    raw_score = (
        ans_rel * weights["interview_answer_relevance"]
        + comm_assess * weights["communication_assessment"]
    )
    score_100 = round(raw_score * 100.0, 2)

    return {
        "status": status,
        "score": score_100 if status == "EVALUATED" else None,
        "raw_fallback_score": score_100,
        "features": {
            "interview_answer_relevance": ans_rel,
            "communication_assessment": comm_assess,
        },
        "fallbacks_applied": fallbacks,
    }


def determine_evaluation_status(
    resume_status: str,
    job_status: str,
    interview_status: str,
) -> Tuple[str, bool, List[str]]:
    """
    Determines overall candidate evaluation completeness status:
    - COMPLETED: Resume, Job Matching, and Interview are all EVALUATED.
    - INTERVIEW_PENDING: Resume and Job Matching are EVALUATED, but Interview is NOT_EVALUATED.
    - PARTIAL: Any category is PARTIAL (unless Resume or Job Matching is NOT_EVALUATED).
    - INCOMPLETE: Resume or Job Matching is NOT_EVALUATED.

    Returns:
        Tuple[str, bool, List[str]]: (evaluation_status, is_complete, pending_stages)
    """
    pending_stages = []
    if resume_status != "EVALUATED":
        pending_stages.append("resume")
    if job_status != "EVALUATED":
        pending_stages.append("job_matching")
    if interview_status != "EVALUATED":
        pending_stages.append("interview")

    is_complete = (len(pending_stages) == 0)

    # Condition 1: All EVALUATED -> COMPLETED
    if is_complete:
        return "COMPLETED", True, []

    # Condition 4: Resume or Job Matching is NOT_EVALUATED -> INCOMPLETE
    # (Takes priority if multiple conditions apply)
    if resume_status == "NOT_EVALUATED" or job_status == "NOT_EVALUATED":
        return "INCOMPLETE", False, pending_stages

    # Condition 2: Resume and Job Matching EVALUATED, Interview NOT_EVALUATED -> INTERVIEW_PENDING
    if resume_status == "EVALUATED" and job_status == "EVALUATED" and interview_status == "NOT_EVALUATED":
        return "INTERVIEW_PENDING", False, pending_stages

    # Condition 3: Any category is PARTIAL -> PARTIAL
    if "PARTIAL" in (resume_status, job_status, interview_status):
        return "PARTIAL", False, pending_stages

    return "INCOMPLETE", False, pending_stages


def score_candidate(candidate: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates a candidate across all 3 categories and produces evaluation status,
    category breakdowns, overall score (if complete), and pre_interview_score (if interview pending).
    """
    candidate_id = candidate.get("candidate_id", "UNKNOWN_CANDIDATE")
    name = candidate.get("name", "Unnamed Candidate")

    resume_res = calculate_resume_score(candidate)
    job_res = calculate_job_matching_score(candidate)
    interview_res = calculate_interview_score(candidate)

    eval_status, is_complete, pending_stages = determine_evaluation_status(
        resume_res["status"],
        job_res["status"],
        interview_res["status"],
    )

    # Overall candidate score is calculated only when evaluation is COMPLETED
    if is_complete:
        overall_score = (
            resume_res["score"] * CATEGORY_WEIGHTS["resume"]
            + job_res["score"] * CATEGORY_WEIGHTS["job_matching"]
            + interview_res["score"] * CATEGORY_WEIGHTS["interview"]
        )
        overall_score = round(max(0.0, min(100.0, overall_score)), 2)
    else:
        overall_score = None

    # Pre-interview score is calculated when Resume and Job Matching are both EVALUATED
    # but Interview is not fully evaluated
    if resume_res["status"] == "EVALUATED" and job_res["status"] == "EVALUATED" and not is_complete:
        pre_interview_score = round(
            resume_res["score"] * 0.50 + job_res["score"] * 0.50,
            2,
        )
    else:
        pre_interview_score = None

    return {
        "candidate_id": candidate_id,
        "name": name,
        "data_status": "SYNTHETIC_DATA_PROTOTYPE",
        "evaluation_status": eval_status,
        "is_complete": is_complete,
        "pending_stages": pending_stages,
        "overall_candidate_score": overall_score,
        "pre_interview_score": pre_interview_score,
        "category_scores": {
            "resume_score": resume_res["score"],
            "job_matching_score": job_res["score"],
            "interview_score": interview_res["score"],
        },
        "category_weights": CATEGORY_WEIGHTS,
        "breakdown": {
            "resume": resume_res,
            "job_matching": job_res,
            "interview": interview_res,
        },
    }


def run_prototype_pipeline(
    sample_file_path: Optional[Path] = None,
    output_file_path: Optional[Path] = None,
) -> List[Dict[str, Any]]:
    """
    Loads sample candidate synthetic data, scores each candidate,
    and saves results to JSON.
    """
    current_dir = Path(__file__).resolve().parent

    if sample_file_path is None:
        sample_file_path = current_dir / "sample_candidates.json"
    if output_file_path is None:
        output_file_path = current_dir / "scoring_results.json"

    with open(sample_file_path, "r", encoding="utf-8") as f:
        candidates = json.load(f)

    results = []
    print("=" * 70)
    print("HIREAI - CANDIDATE SCORING MODEL PROTOTYPE EXECUTION")
    print("Note: Preliminary illustrative weights; not a trained ML model.")
    print("=" * 70)

    for cand in candidates:
        scored = score_candidate(cand)
        results.append(scored)

        print(f"\nCandidate ID: {scored['candidate_id']} ({scored['name']})")
        print(f"  - Status:             {scored['evaluation_status']} (Complete: {scored['is_complete']})")
        if scored['pending_stages']:
            print(f"  - Pending Stages:     {', '.join(scored['pending_stages'])}")

        resume_disp = f"{scored['category_scores']['resume_score']:.2f} / 100" if scored['category_scores']['resume_score'] is not None else "Pending / Incomplete"
        job_disp = f"{scored['category_scores']['job_matching_score']:.2f} / 100" if scored['category_scores']['job_matching_score'] is not None else "Pending / Incomplete"
        int_disp = f"{scored['category_scores']['interview_score']:.2f} / 100" if scored['category_scores']['interview_score'] is not None else "Pending / Incomplete"

        print(f"  - Resume Score:       {resume_disp} (Weight: {CATEGORY_WEIGHTS['resume']*100:.0f}%)")
        print(f"  - Job Matching Score: {job_disp} (Weight: {CATEGORY_WEIGHTS['job_matching']*100:.0f}%)")
        print(f"  - Interview Score:    {int_disp} (Weight: {CATEGORY_WEIGHTS['interview']*100:.0f}%)")
        
        if scored['pre_interview_score'] is not None:
            print(f"  - Pre-Interview Score:{scored['pre_interview_score']:.2f} / 100 (50% Resume / 50% Job Matching)")

        overall_disp = f"{scored['overall_candidate_score']:.2f} / 100" if scored['overall_candidate_score'] is not None else "None (Evaluation Incomplete)"
        print(f"  >> OVERALL SCORE:     {overall_disp}")

        # Report fallbacks if any
        all_fallbacks = []
        for cat in ["resume", "job_matching", "interview"]:
            for fld in scored["breakdown"][cat]["fallbacks_applied"]:
                all_fallbacks.append(f"{cat}.{fld}")
        if all_fallbacks:
            print(f"  [Notice] Fallbacks/defaults applied for: {', '.join(all_fallbacks)}")

    with open(output_file_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print("\n" + "=" * 70)
    print(f"Scoring results successfully generated and saved to:")
    print(f"{output_file_path}")
    print("=" * 70)

    return results


if __name__ == "__main__":
    run_prototype_pipeline()

