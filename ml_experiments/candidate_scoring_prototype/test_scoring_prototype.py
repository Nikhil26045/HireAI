"""
Unit tests for Candidate Scoring Model Prototype.
Tests cover:
1. Normal input processing
2. Score range boundaries [0, 100]
3. Overall score calculation and weighting
4. Category-wise calculations (Resume, Job Matching, Interview)
5. Missing values and fallback handling
6. Boundary values (min 0.0, max 1.0)
7. Invalid values (negative, > 1.0, non-numeric types, NaN, inf)
"""

import math
import unittest
from typing import Dict, Any

from scoring_prototype import (
    CATEGORY_WEIGHTS,
    SUBFEATURE_WEIGHTS,
    DEFAULT_FALLBACKS,
    sanitize_feature,
    calculate_resume_score,
    calculate_job_matching_score,
    calculate_interview_score,
    score_candidate,
)


class TestCandidateScoringPrototype(unittest.TestCase):
    def setUp(self):
        # Baseline normal valid candidate
        self.valid_candidate = {
            "candidate_id": "TEST-CAND-001",
            "name": "Test Candidate Alpha",
            "skills_relevance": 0.80,
            "relevant_experience": 0.70,
            "education_relevance": 0.90,
            "required_skills_matched": 0.85,
            "missing_required_skills": 0.15,
            "overall_jd_relevance": 0.75,
            "interview_answer_relevance": 0.80,
            "communication_assessment": 0.90,
        }

    # ----------------------------------------------------------------------
    # 1. Normal Input Tests
    # ----------------------------------------------------------------------
    def test_normal_input_produces_all_scores_and_breakdown(self):
        """Verify valid candidate produces category and overall scores with correct keys."""
        result = score_candidate(self.valid_candidate)
        self.assertEqual(result["candidate_id"], "TEST-CAND-001")
        self.assertIn("overall_candidate_score", result)
        self.assertIn("category_scores", result)
        self.assertIn("resume_score", result["category_scores"])
        self.assertIn("job_matching_score", result["category_scores"])
        self.assertIn("interview_score", result["category_scores"])
        self.assertIn("breakdown", result)
        self.assertEqual(len(result["breakdown"]["resume"]["fallbacks_applied"]), 0)
        self.assertEqual(len(result["breakdown"]["job_matching"]["fallbacks_applied"]), 0)
        self.assertEqual(len(result["breakdown"]["interview"]["fallbacks_applied"]), 0)

    # ----------------------------------------------------------------------
    # 2. Score Range Tests
    # ----------------------------------------------------------------------
    def test_all_scores_within_0_to_100_range(self):
        """Verify that category scores and overall score stay strictly in [0, 100]."""
        result = score_candidate(self.valid_candidate)
        self.assertGreaterEqual(result["overall_candidate_score"], 0.0)
        self.assertLessEqual(result["overall_candidate_score"], 100.0)
        for cat_name, cat_score in result["category_scores"].items():
            self.assertGreaterEqual(cat_score, 0.0, f"{cat_name} is below 0.0")
            self.assertLessEqual(cat_score, 100.0, f"{cat_name} is above 100.0")

    # ----------------------------------------------------------------------
    # 3. Overall Score Calculation and Weighting Tests
    # ----------------------------------------------------------------------
    def test_overall_score_calculation_weights(self):
        """Verify that overall score equals weighted sum of category scores."""
        result = score_candidate(self.valid_candidate)
        res_score = result["category_scores"]["resume_score"]
        job_score = result["category_scores"]["job_matching_score"]
        int_score = result["category_scores"]["interview_score"]

        expected_overall = round(
            res_score * CATEGORY_WEIGHTS["resume"]
            + job_score * CATEGORY_WEIGHTS["job_matching"]
            + int_score * CATEGORY_WEIGHTS["interview"],
            2,
        )
        self.assertEqual(result["overall_candidate_score"], expected_overall)

    def test_category_weights_sum_to_one(self):
        """Verify that configured category weights sum to 1.0."""
        total_weight = sum(CATEGORY_WEIGHTS.values())
        self.assertAlmostEqual(total_weight, 1.0, places=5)

    def test_subfeature_weights_sum_to_one(self):
        """Verify subfeature weights in each category sum to 1.0."""
        for cat, subweights in SUBFEATURE_WEIGHTS.items():
            total = sum(subweights.values())
            self.assertAlmostEqual(total, 1.0, places=5, msg=f"Subweights for {cat} do not sum to 1.0")

    # ----------------------------------------------------------------------
    # 4. Category-Wise Calculations Tests
    # ----------------------------------------------------------------------
    def test_resume_score_calculation(self):
        """Verify resume score formula matches: 100 * (0.45*skills + 0.40*exp + 0.15*edu)."""
        # skills=0.80, exp=0.70, edu=0.90 -> 0.45*0.80 + 0.40*0.70 + 0.15*0.90 = 0.36 + 0.28 + 0.135 = 0.775 -> 77.50
        res = calculate_resume_score(self.valid_candidate)
        self.assertEqual(res["score"], 77.50)

    def test_job_matching_score_calculation(self):
        """Verify job matching score formula: 100 * (0.40*req + 0.20*(1-missing) + 0.40*jd_rel)."""
        # req=0.85, missing=0.15 -> retention=0.85, jd_rel=0.75
        # 0.40*0.85 + 0.20*0.85 + 0.40*0.75 = 0.34 + 0.17 + 0.30 = 0.81 -> 81.00
        res = calculate_job_matching_score(self.valid_candidate)
        self.assertEqual(res["score"], 81.00)
        self.assertEqual(res["features"]["skill_retention_score"], 0.85)

    def test_interview_score_calculation(self):
        """Verify interview score formula: 100 * (0.65*ans_rel + 0.35*comm)."""
        # ans_rel=0.80, comm=0.90 -> 0.65*0.80 + 0.35*0.90 = 0.52 + 0.315 = 0.835 -> 83.50
        res = calculate_interview_score(self.valid_candidate)
        self.assertEqual(res["score"], 83.50)

    # ----------------------------------------------------------------------
    # 5. Missing Values & Fallback Tests
    # ----------------------------------------------------------------------
    def test_missing_features_use_defaults(self):
        """Verify missing (None) features fall back to defaults and record audit log."""
        candidate_with_missing = {
            "candidate_id": "TEST-CAND-MISSING",
            "name": "Candidate with Missing Values",
            "skills_relevance": 0.80,
            "relevant_experience": None,  # Should fallback to 0.0
            "education_relevance": None,  # Should fallback to 0.5
            "required_skills_matched": None,  # Should fallback to 0.0
            "missing_required_skills": None,  # Should fallback to 1.0 (retention 0.0)
            "overall_jd_relevance": 0.70,
            "interview_answer_relevance": None,  # Should fallback to 0.0
            "communication_assessment": None,  # Should fallback to 0.5
        }
        result = score_candidate(candidate_with_missing)

        # Check resume fallbacks
        self.assertIn("relevant_experience", result["breakdown"]["resume"]["fallbacks_applied"])
        self.assertIn("education_relevance", result["breakdown"]["resume"]["fallbacks_applied"])
        self.assertEqual(result["breakdown"]["resume"]["features"]["relevant_experience"], DEFAULT_FALLBACKS["relevant_experience"])
        self.assertEqual(result["breakdown"]["resume"]["features"]["education_relevance"], DEFAULT_FALLBACKS["education_relevance"])

        # Check job matching fallbacks
        self.assertIn("required_skills_matched", result["breakdown"]["job_matching"]["fallbacks_applied"])
        self.assertIn("missing_required_skills", result["breakdown"]["job_matching"]["fallbacks_applied"])

        # Check interview fallbacks
        self.assertIn("interview_answer_relevance", result["breakdown"]["interview"]["fallbacks_applied"])
        self.assertIn("communication_assessment", result["breakdown"]["interview"]["fallbacks_applied"])

    def test_completely_empty_candidate(self):
        """Verify candidate with zero features provided does not crash and gets deterministic default score."""
        empty_candidate = {"candidate_id": "TEST-EMPTY"}
        result = score_candidate(empty_candidate)
        self.assertIsInstance(result["overall_candidate_score"], float)
        # Resume: 0.45*0.0 + 0.40*0.0 + 0.15*0.5 = 0.075 -> 7.50
        self.assertEqual(result["category_scores"]["resume_score"], 7.50)
        # Job: 0.40*0.0 + 0.20*(1-1.0=0.0) + 0.40*0.0 = 0.0 -> 0.0
        self.assertEqual(result["category_scores"]["job_matching_score"], 0.0)
        # Interview: 0.65*0.0 + 0.35*0.5 = 0.175 -> 17.50
        self.assertEqual(result["category_scores"]["interview_score"], 17.50)
        # Overall: 0.35*7.50 + 0.35*0.0 + 0.30*17.50 = 2.625 + 5.25 = 7.875 -> 7.88
        self.assertEqual(result["overall_candidate_score"], 7.88)

    # ----------------------------------------------------------------------
    # 6. Boundary Values Tests
    # ----------------------------------------------------------------------
    def test_minimum_boundary_values(self):
        """Verify candidate with all minimum allowed values produces valid low boundary score."""
        min_candidate = {
            "candidate_id": "TEST-MIN",
            "skills_relevance": 0.0,
            "relevant_experience": 0.0,
            "education_relevance": 0.0,
            "required_skills_matched": 0.0,
            "missing_required_skills": 1.0,  # Max missing = worst case (retention 0.0)
            "overall_jd_relevance": 0.0,
            "interview_answer_relevance": 0.0,
            "communication_assessment": 0.0,
        }
        result = score_candidate(min_candidate)
        self.assertEqual(result["category_scores"]["resume_score"], 0.0)
        self.assertEqual(result["category_scores"]["job_matching_score"], 0.0)
        self.assertEqual(result["category_scores"]["interview_score"], 0.0)
        self.assertEqual(result["overall_candidate_score"], 0.0)

    def test_maximum_boundary_values(self):
        """Verify candidate with all maximum allowed values produces valid top score (100.0)."""
        max_candidate = {
            "candidate_id": "TEST-MAX",
            "skills_relevance": 1.0,
            "relevant_experience": 1.0,
            "education_relevance": 1.0,
            "required_skills_matched": 1.0,
            "missing_required_skills": 0.0,  # Zero missing = best case (retention 1.0)
            "overall_jd_relevance": 1.0,
            "interview_answer_relevance": 1.0,
            "communication_assessment": 1.0,
        }
        result = score_candidate(max_candidate)
        self.assertEqual(result["category_scores"]["resume_score"], 100.0)
        self.assertEqual(result["category_scores"]["job_matching_score"], 100.0)
        self.assertEqual(result["category_scores"]["interview_score"], 100.0)
        self.assertEqual(result["overall_candidate_score"], 100.0)

    # ----------------------------------------------------------------------
    # 7. Invalid Values Tests
    # ----------------------------------------------------------------------
    def test_negative_values_clamped_to_min(self):
        """Verify negative values are clamped to 0.0 and flagged as fallbacks/clamps."""
        candidate_neg = {
            "candidate_id": "TEST-NEG",
            "skills_relevance": -0.5,
            "relevant_experience": 0.5,
            "education_relevance": 0.5,
        }
        val, clamped = sanitize_feature(candidate_neg, "skills_relevance", 0.0)
        self.assertEqual(val, 0.0)
        self.assertTrue(clamped)

    def test_exceeded_values_clamped_to_max(self):
        """Verify values above 1.0 are clamped to 1.0 and flagged as fallbacks/clamps."""
        candidate_high = {
            "candidate_id": "TEST-HIGH",
            "skills_relevance": 2.5,
        }
        val, clamped = sanitize_feature(candidate_high, "skills_relevance", 0.0)
        self.assertEqual(val, 1.0)
        self.assertTrue(clamped)

    def test_non_numeric_and_malformed_types(self):
        """Verify non-numeric strings, booleans, lists fall back gracefully."""
        cand_bad_types = {
            "skills_relevance": "invalid_string",
            "relevant_experience": ["not", "a", "number"],
            "education_relevance": {"bad": "dict"},
        }
        v1, f1 = sanitize_feature(cand_bad_types, "skills_relevance", 0.0)
        self.assertEqual(v1, 0.0)
        self.assertTrue(f1)

        v2, f2 = sanitize_feature(cand_bad_types, "relevant_experience", 0.0)
        self.assertEqual(v2, 0.0)
        self.assertTrue(f2)

        v3, f3 = sanitize_feature(cand_bad_types, "education_relevance", 0.5)
        self.assertEqual(v3, 0.5)
        self.assertTrue(f3)

    def test_numeric_strings_converted_properly(self):
        """Verify numeric strings like '0.85' are converted to floats without fallback."""
        cand_str_num = {"skills_relevance": "0.85"}
        val, fallback = sanitize_feature(cand_str_num, "skills_relevance", 0.0)
        self.assertEqual(val, 0.85)
        self.assertFalse(fallback)

    def test_nan_and_infinity_handling(self):
        """Verify NaN and Infinity values trigger fallback."""
        cand_nan_inf = {
            "skills_relevance": float("nan"),
            "relevant_experience": float("inf"),
            "education_relevance": float("-inf"),
        }
        v1, f1 = sanitize_feature(cand_nan_inf, "skills_relevance", 0.0)
        self.assertEqual(v1, 0.0)
        self.assertTrue(f1)

        v2, f2 = sanitize_feature(cand_nan_inf, "relevant_experience", 0.0)
        self.assertEqual(v2, 0.0)
        self.assertTrue(f2)

        v3, f3 = sanitize_feature(cand_nan_inf, "education_relevance", 0.5)
        self.assertEqual(v3, 0.5)
        self.assertTrue(f3)


if __name__ == "__main__":
    unittest.main()
