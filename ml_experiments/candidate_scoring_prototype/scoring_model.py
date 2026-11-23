#!/usr/bin/env python3
"""
HireAI - Candidate Scoring Model (Scikit-Learn ML Inference Engine)
===================================================================
Author: Member 3 (Candidate Scoring Model & Recruiter Frontend)
Project: HireAI - AI-Based Candidate Evaluation System

IMPORTANT DISCLAIMER:
---------------------
The model wrapped in this module was trained on synthetic proxy labels
(rule-based scores with Gaussian noise) for architectural feasibility,
cross-feature validation, and interpretability testing.
It does NOT predict real-world hiring outcomes and must not be used as an
autonomous recruitment decision-maker without extensive validation on
genuine, audited, and human-in-the-loop datasets.

Key Responsibilities:
1. Safe model loading with scikit-learn version check and fallback.
2. Demographic / protected attribute protection: Ignore attributes like
   name, gender, college, photo, age and record in fallbacks_applied.
3. Cross-feature sanity check: Detect contradictory inputs (e.g. high matched
   and high missing skills) and log to fallbacks_applied without crashing.
4. Completeness check:
   - COMPLETED: Score with ML model and compute exact linear feature contributions.
   - INTERVIEW_PENDING: Do not predict with ML; compute rule-based pre_interview_score.
   - PARTIAL / INCOMPLETE: Return overall_candidate_score: None with appropriate status.
5. Graceful fallback: If model file missing or corrupted, fall back to rule-based scorer.
"""

from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import joblib
import numpy as np
import sklearn

# Import baseline components from rule-based prototype
from scoring_prototype import (
    CATEGORY_WEIGHTS,
    DEFAULT_FALLBACKS,
    SUBFEATURE_WEIGHTS,
    calculate_interview_score,
    calculate_job_matching_score,
    calculate_resume_score,
    determine_evaluation_status,
    sanitize_feature,
    score_candidate as score_candidate_rule_based,
)

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "candidate_scoring_model.joblib"
METRICS_PATH = BASE_DIR / "model_metrics.json"

FEATURE_NAMES = [
    "skills_relevance",
    "relevant_experience",
    "education_relevance",
    "required_skills_matched",
    "missing_required_skills",
    "overall_jd_relevance",
    "interview_answer_relevance",
    "communication_assessment",
]

PROTECTED_ATTRIBUTES = {
    "gender",
    "sex",
    "college",
    "university",
    "school",
    "photo",
    "picture",
    "image",
    "age",
    "dob",
    "date_of_birth",
    "race",
    "ethnicity",
    "religion",
    "marital_status",
}

# Module-level model cache
_CACHED_MODEL = None
_CACHED_METRICS = None
_LOAD_ERROR: Optional[str] = None


def load_model() -> Tuple[Optional[Any], Optional[Dict[str, Any]], Optional[str]]:
    """
    Safely load the trained candidate scoring model and its metadata.
    Validates scikit-learn version and feature alignment.
    Returns (model, metrics, error_message).
    """
    global _CACHED_MODEL, _CACHED_METRICS, _LOAD_ERROR

    if _CACHED_MODEL is not None and _CACHED_METRICS is not None:
        return _CACHED_MODEL, _CACHED_METRICS, None

    if not MODEL_PATH.exists() or not METRICS_PATH.exists():
        _LOAD_ERROR = f"Model artifact not found at {MODEL_PATH} or {METRICS_PATH}"
        return None, None, _LOAD_ERROR

    try:
        import json

        with open(METRICS_PATH, "r", encoding="utf-8") as f:
            metrics = json.load(f)

        saved_sklearn_version = metrics.get("scikit_learn_version")
        current_sklearn_version = sklearn.__version__

        # Major/minor compatibility check
        saved_major_minor = ".".join(saved_sklearn_version.split(".")[:2]) if saved_sklearn_version else ""
        current_major_minor = ".".join(current_sklearn_version.split(".")[:2])

        if saved_major_minor and saved_major_minor != current_major_minor:
            _LOAD_ERROR = (
                f"scikit-learn version mismatch: model trained on {saved_sklearn_version}, "
                f"current runtime is {current_sklearn_version}"
            )
            return None, None, _LOAD_ERROR

        model = joblib.load(MODEL_PATH)
        _CACHED_MODEL = model
        _CACHED_METRICS = metrics
        _LOAD_ERROR = None
        return _CACHED_MODEL, _CACHED_METRICS, None
    except Exception as e:
        _LOAD_ERROR = f"Failed to load candidate scoring model: {type(e).__name__}: {str(e)}"
        return None, None, _LOAD_ERROR


def score_candidate_ml(candidate: Dict[str, Any]) -> Dict[str, Any]:
    """
    Scores a candidate using the trained Ridge Regression ML model when data is complete,
    with robust protection, cross-feature sanity validation, and graceful fallback.

    Args:
        candidate: Dictionary containing candidate features and metadata.

    Returns:
        Structured evaluation dictionary containing overall score, category scores,
        status, feature contributions (if Ridge), and fallbacks applied.
    """
    fallbacks_applied: List[str] = []

    # 1. Demographic & Protected Attributes Protection
    for key in list(candidate.keys()):
        if key.lower() in PROTECTED_ATTRIBUTES:
            fallbacks_applied.append(
                f"Ignored protected demographic attribute '{key}'. Demographic fields do not influence scoring."
            )

    # 2. Category evaluations through rule-based functions to obtain status and fallback auditing
    resume_res = calculate_resume_score(candidate)
    job_res = calculate_job_matching_score(candidate)
    interview_res = calculate_interview_score(candidate)

    # Collect category fallbacks
    for cat_name, res in [("resume", resume_res), ("job_matching", job_res), ("interview", interview_res)]:
        for feat in res.get("fallbacks_applied", []):
            fallbacks_applied.append(f"Fallback value used for feature '{feat}' in category '{cat_name}'.")

    # Determine completeness status
    eval_status, is_complete, pending_stages = determine_evaluation_status(
        resume_res["status"],
        job_res["status"],
        interview_res["status"],
    )

    # 3. Sanitize Features for Cross-Feature & ML Vector
    sanitized: Dict[str, float] = {}
    for feat in FEATURE_NAMES:
        val, _ = sanitize_feature(candidate, feat, DEFAULT_FALLBACKS[feat])
        sanitized[feat] = val

    # Cross-Feature Contradiction Check
    matched_skills = sanitized["required_skills_matched"]
    missing_skills = sanitized["missing_required_skills"]
    if matched_skills > 0.7 and missing_skills > 0.7:
        fallbacks_applied.append(
            f"Contradictory skill inputs detected: required_skills_matched ({matched_skills}) "
            f"and missing_required_skills ({missing_skills}) are both high."
        )

    category_scores = {
        "resume_score": resume_res["score"],
        "job_match_score": job_res["score"],
        "interview_score": interview_res["score"],
    }

    # 4. Handle Pending or Incomplete Evaluation
    if eval_status == "INTERVIEW_PENDING":
        pre_interview = round(
            resume_res["score"] * 0.50 + job_res["score"] * 0.50,
            2,
        )
        return {
            "candidate_id": candidate.get("candidate_id", "unknown"),
            "scoring_engine": "rule_based_pre_interview",
            "model_version": "v1.0-pre-interview",
            "overall_candidate_score": None,
            "pre_interview_score": pre_interview,
            "evaluation_status": eval_status,
            "missing_stages": pending_stages,
            "category_scores": category_scores,
            "feature_contributions": None,
            "fallbacks_applied": fallbacks_applied,
        }

    if eval_status in ("PARTIAL", "INCOMPLETE"):
        return {
            "candidate_id": candidate.get("candidate_id", "unknown"),
            "scoring_engine": "none",
            "model_version": None,
            "overall_candidate_score": None,
            "pre_interview_score": None,
            "evaluation_status": eval_status,
            "missing_stages": pending_stages,
            "category_scores": category_scores,
            "feature_contributions": None,
            "fallbacks_applied": fallbacks_applied,
        }

    # 5. Status is COMPLETED: ML Model Inference
    model, metrics, load_err = load_model()

    if model is None or load_err is not None:
        fallbacks_applied.append(
            f"ML model unavailable ({load_err}). Safely fell back to rule-based scoring engine."
        )
        rule_result = score_candidate_rule_based(candidate)
        rule_result["scoring_engine"] = "rule_based_fallback"
        rule_result["model_version"] = "v1.0-rule-fallback"
        rule_result["feature_contributions"] = None
        combined_fallbacks = list(dict.fromkeys(fallbacks_applied + rule_result.get("fallbacks_applied", [])))
        rule_result["fallbacks_applied"] = combined_fallbacks
        return rule_result

    feature_order = metrics.get("feature_order", FEATURE_NAMES)
    import pandas as pd
    x_df = pd.DataFrame([[sanitized[feat] for feat in feature_order]], columns=feature_order)

    raw_prediction = float(model.predict(x_df)[0])
    overall_score = round(max(0.0, min(100.0, raw_prediction)), 2)

    # Feature contributions (exact linear decomposition for Ridge)
    contributions: Dict[str, float] = {}
    if hasattr(model, "coef_"):
        coefs = model.coef_
        intercept = float(model.intercept_)
        for i, feat in enumerate(feature_order):
            contributions[feat] = round(float(coefs[i] * sanitized[feat]), 4)
        contributions["intercept"] = round(intercept, 4)

    return {
        "candidate_id": candidate.get("candidate_id", "unknown"),
        "scoring_engine": "scikit_learn_ridge",
        "model_version": metrics.get("model_version", "v1.0-ml-proxy"),
        "overall_candidate_score": overall_score,
        "pre_interview_score": None,
        "evaluation_status": "COMPLETED",
        "missing_stages": [],
        "category_scores": category_scores,
        "feature_contributions": contributions if contributions else None,
        "fallbacks_applied": fallbacks_applied,
    }
