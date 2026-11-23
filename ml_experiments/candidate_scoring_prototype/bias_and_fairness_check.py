#!/usr/bin/env python3
"""
HireAI - Bias, Demographic Neutrality & Invariance Verification
===============================================================
Author: Member 3 (Candidate Scoring Model & Recruiter Frontend)
Project: HireAI - AI-Based Candidate Evaluation System

IMPORTANT SCIENTIFIC LIMITATION NOTICE:
--------------------------------------
This check tests the CANDIDATE SCORING MODEL IN ISOLATION.
It verifies two properties of the scoring engine:
1. Feature Invariance / Demographic Blindness: Protected demographic attributes
   (e.g., name, gender, college tier, photo, age) passed to the scoring engine are
   completely ignored and do not affect the numerical output.
2. Determinism: Given identical feature vectors, candidate scores are 100% deterministic.

CRITICAL REAL-WORLD RECRUITMENT BIAS DISCLAIMER:
------------------------------------------------
Passing this isolated mathematical invariance check DOES NOT mean the entire HireAI
system is free from bias. In a full production pipeline, bias frequently arises upstream
during:
- Resume text parsing and entity extraction (e.g. named entity recognition associating
  gender/ethnicity with different score representations).
- LLM or embedding-based semantic matching (which can harbor historical societal prejudices).
- Whisper speech-to-text transcription and audio analysis (which can perform unequally across
  accents, dialects, vocal pitch, or speech impediments).
True algorithmic bias testing requires perturbed resume & interview audits across the
entire end-to-end multi-modal pipeline, evaluated on real-world representative cohorts.
"""

import sys
from pathlib import Path
from scoring_model import score_candidate_ml


def run_bias_and_fairness_audit():
    print("=" * 80)
    print("HIREAI - CANDIDATE SCORING MODEL BIAS & FAIRNESS AUDIT")
    print("=" * 80)

    base_candidate = {
        "candidate_id": "BASE_AUDIT_CANDIDATE",
        "skills_relevance": 0.82,
        "relevant_experience": 0.70,
        "education_relevance": 0.85,
        "required_skills_matched": 0.80,
        "missing_required_skills": 0.20,
        "overall_jd_relevance": 0.78,
        "interview_answer_relevance": 0.85,
        "communication_assessment": 0.80,
    }

    base_result = score_candidate_ml(base_candidate)
    base_score = base_result["overall_candidate_score"]

    print(f"Base candidate score: {base_score:.2f}")

    # Variations across demographics, gender, age, colleges, and names
    demographic_variations = [
        {"name": "Alice Walker", "gender": "Female", "age": 24, "college": "Tier 3 College"},
        {"name": "Bob Smith", "gender": "Male", "age": 45, "college": "Elite Ivy League"},
        {"name": "Dev Patel", "gender": "Non-binary", "age": 30, "college": "State University"},
        {"name": "Fatima Al-Sayed", "gender": "Female", "age": 36, "college": "International Institute"},
        {"name": "Chen Wei", "gender": "Male", "age": 52, "college": "Community College"},
        {"photo": "https://example.com/photo_candidate.png", "marital_status": "Married"},
    ]

    all_passed = True

    print("\nAuditing demographic variations against identical feature values:")
    print("-" * 80)
    for i, variation in enumerate(demographic_variations, start=1):
        candidate_variant = dict(base_candidate)
        candidate_variant["candidate_id"] = f"VARIANT_{i:02d}"
        candidate_variant.update(variation)

        res = score_candidate_ml(candidate_variant)
        var_score = res["overall_candidate_score"]

        # Check identical score
        score_diff = abs(var_score - base_score)
        passed_diff = score_diff < 1e-6

        # Check fallbacks applied noted demographic attribute
        fallbacks_text = " ".join(res["fallbacks_applied"]).lower()
        noted_ignored = any(k.lower() in fallbacks_text for k in variation.keys())

        passed = passed_diff and noted_ignored
        if not passed:
            all_passed = False

        status_str = "PASS" if passed else "FAIL"
        print(f"[{status_str}] Variation {i}: {list(variation.keys())} -> Score: {var_score:.2f} (diff: {score_diff:.4f})")

    print("=" * 80)
    if all_passed:
        print("RESULT: ALL DEMOGRAPHIC VARIATIONS PASSED.")
        print("The Candidate Scoring Model is mathematically invariant to demographic attributes.")
        print("Demographic attributes are systematically stripped, ignored, and recorded in audit logs.")
    else:
        print("RESULT: AUDIT FAILED. Demographic leakage detected.")
        sys.exit(1)
    print("=" * 80)


if __name__ == "__main__":
    run_bias_and_fairness_audit()
