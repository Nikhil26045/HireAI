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
        """Verify missing (None) features fall back to defaults, record audit log, and set category score to None."""
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

        # Candidate is incomplete, overall score must be None
        self.assertIsNone(result["overall_candidate_score"])
        self.assertFalse(result["is_complete"])

        # Check resume fallbacks and status
        self.assertEqual(result["breakdown"]["resume"]["status"], "PARTIAL")
        self.assertIsNone(result["category_scores"]["resume_score"])
        self.assertIn("relevant_experience", result["breakdown"]["resume"]["fallbacks_applied"])
        self.assertIn("education_relevance", result["breakdown"]["resume"]["fallbacks_applied"])
        self.assertEqual(result["breakdown"]["resume"]["features"]["relevant_experience"], DEFAULT_FALLBACKS["relevant_experience"])
        self.assertEqual(result["breakdown"]["resume"]["features"]["education_relevance"], DEFAULT_FALLBACKS["education_relevance"])

        # Check job matching fallbacks and status
        self.assertEqual(result["breakdown"]["job_matching"]["status"], "PARTIAL")
        self.assertIsNone(result["category_scores"]["job_matching_score"])
        self.assertIn("required_skills_matched", result["breakdown"]["job_matching"]["fallbacks_applied"])
        self.assertIn("missing_required_skills", result["breakdown"]["job_matching"]["fallbacks_applied"])

        # Check interview fallbacks and status
        self.assertEqual(result["breakdown"]["interview"]["status"], "NOT_EVALUATED")
        self.assertIsNone(result["category_scores"]["interview_score"])
        self.assertIn("interview_answer_relevance", result["breakdown"]["interview"]["fallbacks_applied"])
        self.assertIn("communication_assessment", result["breakdown"]["interview"]["fallbacks_applied"])

    def test_completely_empty_candidate(self):
        """Verify candidate with zero features provided is marked INCOMPLETE with None scores."""
        empty_candidate = {"candidate_id": "TEST-EMPTY"}
        result = score_candidate(empty_candidate)
        self.assertIsNone(result["overall_candidate_score"])
        self.assertIsNone(result["pre_interview_score"])
        self.assertFalse(result["is_complete"])
        self.assertEqual(result["evaluation_status"], "INCOMPLETE")
        self.assertEqual(result["pending_stages"], ["resume", "job_matching", "interview"])
        
        # Category scores should be None because none are EVALUATED
        self.assertIsNone(result["category_scores"]["resume_score"])
        self.assertIsNone(result["category_scores"]["job_matching_score"])
        self.assertIsNone(result["category_scores"]["interview_score"])
        
        # Raw fallback scores remain available for audit/debugging
        self.assertEqual(result["breakdown"]["resume"]["raw_fallback_score"], 7.50)
        self.assertEqual(result["breakdown"]["job_matching"]["raw_fallback_score"], 0.0)
        self.assertEqual(result["breakdown"]["interview"]["raw_fallback_score"], 17.50)

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
        """Verify non-numeric strings, lists, dicts fall back gracefully."""
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

    def test_boolean_inputs_trigger_fallback(self):
        """Verify boolean inputs (True and False) are rejected and fall back gracefully."""
        cand_bools = {
            "skills_relevance": True,        # Must NOT evaluate to 1.0; should fall back to 0.0
            "relevant_experience": False,    # Must NOT be treated as valid 0.0; should trigger fallback to 0.0
            "education_relevance": True,     # Must NOT evaluate to 1.0; should fall back to 0.5
        }
        v1, f1 = sanitize_feature(cand_bools, "skills_relevance", DEFAULT_FALLBACKS["skills_relevance"])
        self.assertEqual(v1, 0.0)
        self.assertTrue(f1)

        v2, f2 = sanitize_feature(cand_bools, "relevant_experience", DEFAULT_FALLBACKS["relevant_experience"])
        self.assertEqual(v2, 0.0)
        self.assertTrue(f2)

        v3, f3 = sanitize_feature(cand_bools, "education_relevance", DEFAULT_FALLBACKS["education_relevance"])
        self.assertEqual(v3, 0.5)
        self.assertTrue(f3)

    def test_boolean_in_candidate_scoring_tracks_fallbacks(self):
        """Verify candidate with boolean features tracks fallback audit and produces expected scores."""
        cand_with_bool = {
            "candidate_id": "TEST-CAND-BOOL",
            "skills_relevance": True,        # Fallback to 0.0
            "relevant_experience": 0.80,     # Valid float
            "education_relevance": False,    # Fallback to 0.5
            "required_skills_matched": True, # Fallback to 0.0
            "missing_required_skills": 0.20, # Valid float
            "overall_jd_relevance": 0.70,    # Valid float
            "interview_answer_relevance": 0.90,
            "communication_assessment": True,# Fallback to 0.5
        }
        res = score_candidate(cand_with_bool)

        # Verify fallback tracking lists contain boolean fields
        self.assertIn("skills_relevance", res["breakdown"]["resume"]["fallbacks_applied"])
        self.assertIn("education_relevance", res["breakdown"]["resume"]["fallbacks_applied"])
        self.assertNotIn("relevant_experience", res["breakdown"]["resume"]["fallbacks_applied"])

        self.assertIn("required_skills_matched", res["breakdown"]["job_matching"]["fallbacks_applied"])
        self.assertNotIn("missing_required_skills", res["breakdown"]["job_matching"]["fallbacks_applied"])

        self.assertIn("communication_assessment", res["breakdown"]["interview"]["fallbacks_applied"])
        self.assertNotIn("interview_answer_relevance", res["breakdown"]["interview"]["fallbacks_applied"])

        # Resume score is None because category is PARTIAL (skills and edu had boolean fallbacks)
        self.assertIsNone(res["category_scores"]["resume_score"])
        # Raw fallback score is 39.50
        self.assertEqual(res["breakdown"]["resume"]["raw_fallback_score"], 39.50)

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


    # ----------------------------------------------------------------------
    # 8. Evaluation Completeness and Scoring Status Tests
    # ----------------------------------------------------------------------
    def test_all_three_categories_fully_evaluated(self):
        """Verify candidate with all features present has COMPLETED status, is_complete True, and valid overall score."""
        res = score_candidate(self.valid_candidate)
        self.assertEqual(res["evaluation_status"], "COMPLETED")
        self.assertTrue(res["is_complete"])
        self.assertEqual(res["pending_stages"], [])
        self.assertIsNotNone(res["overall_candidate_score"])
        self.assertIsNone(res["pre_interview_score"])
        self.assertEqual(res["breakdown"]["resume"]["status"], "EVALUATED")
        self.assertEqual(res["breakdown"]["job_matching"]["status"], "EVALUATED")
        self.assertEqual(res["breakdown"]["interview"]["status"], "EVALUATED")

    def test_resume_and_job_matching_evaluated_interview_missing(self):
        """Verify candidate with resume & job evaluated but interview missing has INTERVIEW_PENDING status and pre_interview_score."""
        cand = dict(self.valid_candidate)
        cand.pop("interview_answer_relevance")
        cand.pop("communication_assessment")

        res = score_candidate(cand)
        self.assertEqual(res["evaluation_status"], "INTERVIEW_PENDING")
        self.assertFalse(res["is_complete"])
        self.assertEqual(res["pending_stages"], ["interview"])
        self.assertIsNone(res["overall_candidate_score"])
        self.assertIsNotNone(res["pre_interview_score"])
        # Expected pre-interview score = (77.50 * 0.5) + (81.00 * 0.5) = 38.75 + 40.50 = 79.25
        self.assertEqual(res["pre_interview_score"], 79.25)
        self.assertEqual(res["category_scores"]["resume_score"], 77.50)
        self.assertEqual(res["category_scores"]["job_matching_score"], 81.00)
        self.assertIsNone(res["category_scores"]["interview_score"])
        self.assertEqual(res["breakdown"]["interview"]["status"], "NOT_EVALUATED")

    def test_interview_with_only_answer_relevance_available(self):
        """Verify candidate with only interview answer relevance has PARTIAL interview status and overall_score None."""
        cand = dict(self.valid_candidate)
        cand["communication_assessment"] = None

        res = score_candidate(cand)
        self.assertEqual(res["evaluation_status"], "PARTIAL")
        self.assertFalse(res["is_complete"])
        self.assertEqual(res["pending_stages"], ["interview"])
        self.assertIsNone(res["overall_candidate_score"])
        self.assertIsNotNone(res["pre_interview_score"])  # Resume and Job are EVALUATED
        self.assertEqual(res["breakdown"]["interview"]["status"], "PARTIAL")
        self.assertIsNone(res["category_scores"]["interview_score"])

    def test_interview_with_only_communication_assessment_available(self):
        """Verify candidate with only communication assessment has PARTIAL interview status and overall_score None."""
        cand = dict(self.valid_candidate)
        cand["interview_answer_relevance"] = None

        res = score_candidate(cand)
        self.assertEqual(res["evaluation_status"], "PARTIAL")
        self.assertFalse(res["is_complete"])
        self.assertEqual(res["pending_stages"], ["interview"])
        self.assertIsNone(res["overall_candidate_score"])
        self.assertIsNotNone(res["pre_interview_score"])  # Resume and Job are EVALUATED
        self.assertEqual(res["breakdown"]["interview"]["status"], "PARTIAL")
        self.assertIsNone(res["category_scores"]["interview_score"])

    def test_resume_partially_evaluated(self):
        """Verify candidate with resume partially evaluated receives PARTIAL status and no pre_interview_score."""
        cand = dict(self.valid_candidate)
        cand["relevant_experience"] = None

        res = score_candidate(cand)
        self.assertEqual(res["evaluation_status"], "PARTIAL")
        self.assertFalse(res["is_complete"])
        self.assertIn("resume", res["pending_stages"])
        self.assertIsNone(res["overall_candidate_score"])
        self.assertIsNone(res["pre_interview_score"])
        self.assertEqual(res["breakdown"]["resume"]["status"], "PARTIAL")
        self.assertIsNone(res["category_scores"]["resume_score"])

    def test_job_matching_partially_evaluated(self):
        """Verify candidate with job matching partially evaluated receives PARTIAL status and no pre_interview_score."""
        cand = dict(self.valid_candidate)
        cand["overall_jd_relevance"] = None

        res = score_candidate(cand)
        self.assertEqual(res["evaluation_status"], "PARTIAL")
        self.assertFalse(res["is_complete"])
        self.assertIn("job_matching", res["pending_stages"])
        self.assertIsNone(res["overall_candidate_score"])
        self.assertIsNone(res["pre_interview_score"])
        self.assertEqual(res["breakdown"]["job_matching"]["status"], "PARTIAL")
        self.assertIsNone(res["category_scores"]["job_matching_score"])

    def test_resume_or_job_matching_completely_missing(self):
        """Verify candidate with resume completely missing receives INCOMPLETE status."""
        cand = dict(self.valid_candidate)
        cand["skills_relevance"] = None
        cand["relevant_experience"] = None
        cand["education_relevance"] = None

        res = score_candidate(cand)
        self.assertEqual(res["evaluation_status"], "INCOMPLETE")
        self.assertFalse(res["is_complete"])
        self.assertIn("resume", res["pending_stages"])
        self.assertIsNone(res["overall_candidate_score"])
        self.assertIsNone(res["pre_interview_score"])
        self.assertEqual(res["breakdown"]["resume"]["status"], "NOT_EVALUATED")

    def test_valid_numerical_zero_counts_as_evaluated_data(self):
        """Verify a genuine numerical zero (0.0) is counted as evaluated data, not missing/fallback."""
        cand = dict(self.valid_candidate)
        cand["skills_relevance"] = 0.0
        cand["interview_answer_relevance"] = 0.0

        res = score_candidate(cand)
        self.assertEqual(res["evaluation_status"], "COMPLETED")
        self.assertTrue(res["is_complete"])
        self.assertNotIn("skills_relevance", res["breakdown"]["resume"]["fallbacks_applied"])
        self.assertNotIn("interview_answer_relevance", res["breakdown"]["interview"]["fallbacks_applied"])
        self.assertIsNotNone(res["overall_candidate_score"])

    def test_boolean_inputs_do_not_count_as_evaluated_data(self):
        """Verify boolean inputs (True/False) do not count as valid evaluated data and trigger PARTIAL/fallback."""
        cand = dict(self.valid_candidate)
        cand["interview_answer_relevance"] = True  # Boolean should be rejected as invalid

        res = score_candidate(cand)
        self.assertEqual(res["evaluation_status"], "PARTIAL")
        self.assertFalse(res["is_complete"])
        self.assertIn("interview_answer_relevance", res["breakdown"]["interview"]["fallbacks_applied"])
        self.assertEqual(res["breakdown"]["interview"]["status"], "PARTIAL")
        self.assertIsNone(res["category_scores"]["interview_score"])

    def test_missing_and_invalid_inputs_not_confused_with_genuine_zero(self):
        """Verify None, NaN, inf are treated as fallbacks while genuine 0.0 is treated as valid."""
        cand_zero = {"skills_relevance": 0.0}
        cand_none = {"skills_relevance": None}
        cand_nan = {"skills_relevance": float("nan")}

        val_z, fb_z = sanitize_feature(cand_zero, "skills_relevance", 0.0)
        val_n, fb_n = sanitize_feature(cand_none, "skills_relevance", 0.0)
        val_nan, fb_nan = sanitize_feature(cand_nan, "skills_relevance", 0.0)

        self.assertEqual(val_z, 0.0)
        self.assertFalse(fb_z)  # Genuine zero: NO fallback applied

        self.assertEqual(val_n, 0.0)
        self.assertTrue(fb_n)   # None: fallback applied

        self.assertEqual(val_nan, 0.0)
        self.assertTrue(fb_nan) # NaN: fallback applied

    def test_pre_interview_score_formula_and_normalization(self):
        """Verify pre_interview_score formula: 50% Resume + 50% Job Matching."""
        cand = {
            "candidate_id": "TEST-PRE-INT",
            "skills_relevance": 1.0,
            "relevant_experience": 1.0,
            "education_relevance": 1.0,
            "required_skills_matched": 0.8,
            "missing_required_skills": 0.2,
            "overall_jd_relevance": 0.8,
            # Interview completely missing
        }
        res = score_candidate(cand)
        self.assertEqual(res["evaluation_status"], "INTERVIEW_PENDING")
        self.assertEqual(res["category_scores"]["resume_score"], 100.0)
        self.assertEqual(res["category_scores"]["job_matching_score"], 80.0)
        # Expected pre-interview score: 0.5*100.0 + 0.5*80.0 = 90.00
        self.assertEqual(res["pre_interview_score"], 90.00)
        self.assertIsNone(res["overall_candidate_score"])

    def test_complete_candidates_retain_existing_overall_scores(self):
        """Verify complete candidate produces exact score matching existing formula."""
        res = score_candidate(self.valid_candidate)
        # Resume: 77.50, Job: 81.00, Interview: 83.50
        # 0.35*77.50 + 0.35*81.00 + 0.30*83.50 = 27.125 + 28.35 + 25.05 = 80.525 -> 80.53 (or 80.52 depending on round)
        expected = round(77.50 * 0.35 + 81.00 * 0.35 + 83.50 * 0.30, 2)
        self.assertEqual(res["overall_candidate_score"], expected)


if __name__ == "__main__":
    unittest.main()
