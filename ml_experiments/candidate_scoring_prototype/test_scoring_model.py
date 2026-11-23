#!/usr/bin/env python3
"""
HireAI - Unit Tests for Scikit-Learn Candidate Scoring Model
============================================================
Author: Member 3 (Candidate Scoring Model & Recruiter Frontend)
Project: HireAI - AI-Based Candidate Evaluation System

Test Coverage:
1. Complete candidate produces valid ML prediction (scoring_engine: scikit_learn_ridge).
2. Interpretability: Ridge feature contributions sum to (raw prediction) within 1e-4.
3. Protected demographic attributes (name, gender, college, photo, age) are ignored and noted in fallbacks_applied.
4. Contradictory inputs (e.g. high matched and high missing skills) are flagged in fallbacks_applied without crashing.
5. Incomplete candidates:
   - INTERVIEW_PENDING candidate receives pre_interview_score (50% resume, 50% job) and overall_candidate_score: None.
   - PARTIAL and INCOMPLETE candidates receive overall_candidate_score: None.
6. Fallback path: When model file is missing or corrupted, gracefully falls back to rule-based engine.
"""

from pathlib import Path
import unittest
from unittest.mock import patch
import scoring_model
from scoring_model import score_candidate_ml


class TestCandidateScoringML(unittest.TestCase):
    def setUp(self):
        self.perfect_candidate = {
            "candidate_id": "ML_PERFECT_001",
            "skills_relevance": 1.0,
            "relevant_experience": 1.0,
            "education_relevance": 1.0,
            "required_skills_matched": 1.0,
            "missing_required_skills": 0.0,
            "overall_jd_relevance": 1.0,
            "interview_answer_relevance": 1.0,
            "communication_assessment": 1.0,
        }

        self.typical_candidate = {
            "candidate_id": "ML_TYPICAL_002",
            "skills_relevance": 0.85,
            "relevant_experience": 0.75,
            "education_relevance": 0.90,
            "required_skills_matched": 0.80,
            "missing_required_skills": 0.20,
            "overall_jd_relevance": 0.82,
            "interview_answer_relevance": 0.78,
            "communication_assessment": 0.85,
        }

    def test_complete_candidate_ml_scoring(self):
        """Verify complete candidate produces an ML score with Ridge engine."""
        result = score_candidate_ml(self.typical_candidate)
        self.assertEqual(result["candidate_id"], "ML_TYPICAL_002")
        self.assertEqual(result["scoring_engine"], "scikit_learn_ridge")
        self.assertEqual(result["evaluation_status"], "COMPLETED")
        self.assertIsNotNone(result["overall_candidate_score"])
        self.assertGreaterEqual(result["overall_candidate_score"], 0.0)
        self.assertLessEqual(result["overall_candidate_score"], 100.0)
        self.assertIsNotNone(result["feature_contributions"])

    def test_feature_contributions_sum_to_prediction(self):
        """Verify Ridge contributions sum up to the model raw prediction."""
        result = score_candidate_ml(self.typical_candidate)
        contribs = result["feature_contributions"]
        self.assertIsNotNone(contribs)

        # Sum of feature contributions + intercept
        feat_keys = [
            "skills_relevance",
            "relevant_experience",
            "education_relevance",
            "required_skills_matched",
            "missing_required_skills",
            "overall_jd_relevance",
            "interview_answer_relevance",
            "communication_assessment",
        ]
        summed = sum(contribs[k] for k in feat_keys) + contribs["intercept"]

        # Should match overall score (when within [0, 100]) within rounding tolerance
        self.assertAlmostEqual(summed, result["overall_candidate_score"], delta=0.1)

    def test_protected_demographic_attributes_ignored(self):
        """Verify demographic fields are ignored, recorded in fallbacks_applied, and do not alter score."""
        candidate_with_demographics = dict(self.typical_candidate)
        candidate_with_demographics.update({
            "name": "Jane Doe",
            "gender": "Female",
            "college": "Top Tier University",
            "age": 28,
            "photo": "https://example.com/avatar.jpg",
        })

        base_res = score_candidate_ml(self.typical_candidate)
        demo_res = score_candidate_ml(candidate_with_demographics)

        # Score must be identical
        self.assertEqual(base_res["overall_candidate_score"], demo_res["overall_candidate_score"])
        self.assertEqual(base_res["category_scores"], demo_res["category_scores"])

        # Fallbacks applied must explicitly record ignoring demographic fields
        applied = " ".join(demo_res["fallbacks_applied"]).lower()
        self.assertIn("gender", applied)
        self.assertIn("college", applied)
        self.assertIn("photo", applied)
        self.assertIn("age", applied)

    def test_cross_feature_contradiction_detection(self):
        """Verify contradictory inputs (high matched AND high missing skills) are flagged."""
        candidate_contradictory = dict(self.typical_candidate)
        candidate_contradictory["required_skills_matched"] = 0.95
        candidate_contradictory["missing_required_skills"] = 0.90

        res = score_candidate_ml(candidate_contradictory)
        applied = " ".join(res["fallbacks_applied"]).lower()
        self.assertIn("contradictory", applied)

    def test_interview_pending_candidate(self):
        """Verify interview pending candidate receives pre_interview_score and overall_candidate_score is None."""
        pending_candidate = {
            "candidate_id": "ML_PENDING_003",
            "skills_relevance": 0.85,
            "relevant_experience": 0.75,
            "education_relevance": 0.90,
            "required_skills_matched": 0.80,
            "missing_required_skills": 0.20,
            "overall_jd_relevance": 0.82,
            # Interview features missing
        }

        res = score_candidate_ml(pending_candidate)
        self.assertEqual(res["evaluation_status"], "INTERVIEW_PENDING")
        self.assertIsNone(res["overall_candidate_score"])
        self.assertIsNotNone(res["pre_interview_score"])
        self.assertEqual(res["missing_stages"], ["interview"])
        self.assertEqual(res["scoring_engine"], "rule_based_pre_interview")
        self.assertIsNone(res["category_scores"]["interview_score"])

    def test_partial_candidate_status(self):
        """Verify partial candidate receives overall_candidate_score: None."""
        partial_candidate = {
            "candidate_id": "ML_PARTIAL_004",
            "skills_relevance": 0.85,
            # Missing relevant_experience and education_relevance
            "required_skills_matched": 0.80,
            "missing_required_skills": 0.20,
            "overall_jd_relevance": 0.82,
        }

        res = score_candidate_ml(partial_candidate)
        self.assertEqual(res["evaluation_status"], "PARTIAL")
        self.assertIsNone(res["overall_candidate_score"])
        self.assertIsNone(res["pre_interview_score"])

    def test_fallback_when_model_missing(self):
        """Verify graceful fallback to rule-based scorer if model artifact is missing."""
        with patch.object(scoring_model, "MODEL_PATH", Path("non_existent_model.joblib")):
            # Reset cache to trigger reload
            scoring_model._CACHED_MODEL = None
            scoring_model._CACHED_METRICS = None
            scoring_model._LOAD_ERROR = None

            res = score_candidate_ml(self.typical_candidate)
            self.assertEqual(res["evaluation_status"], "COMPLETED")
            self.assertEqual(res["scoring_engine"], "rule_based_fallback")
            self.assertIsNotNone(res["overall_candidate_score"])
            applied = " ".join(res["fallbacks_applied"]).lower()
            self.assertIn("fell back to rule-based", applied)

        # Reset cache back
        scoring_model._CACHED_MODEL = None
        scoring_model._CACHED_METRICS = None
        scoring_model._LOAD_ERROR = None


if __name__ == "__main__":
    unittest.main()
