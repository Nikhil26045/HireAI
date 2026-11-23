#!/usr/bin/env python3
"""
HireAI - Candidate Scoring Model Training & Evaluation
======================================================
Author: Member 3 (Candidate Scoring Model)
Project: HireAI - AI-Based Candidate Evaluation System

IMPORTANT DISCLAIMER:
---------------------
Target labels used during this training process are SYNTHETIC PROXY LABELS.
NO REAL HUMAN RECRUITMENT DECISION DATA IS USED.
Models trained here evaluate pipeline design, feature recovery, and architectural
feasibility. Metrics reported (R2, MAE, RMSE) reflect fitting against the synthetic
proxy generation process, NOT real-world predictive validity.
"""

import json
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
import sklearn
from sklearn.dummy import DummyRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, r2_score, root_mean_squared_error
from sklearn.model_selection import KFold, cross_validate, train_test_split


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

# Theoretical weights derived from rule-based formula:
# Points contributed per 1.0 of the feature (overall scale 0-100)
THEORETICAL_WEIGHTS = {
    "skills_relevance": 15.75,              # 0.35 * 0.45 * 100
    "relevant_experience": 14.00,           # 0.35 * 0.40 * 100
    "education_relevance": 5.25,            # 0.35 * 0.15 * 100
    "required_skills_matched": 14.00,       # 0.35 * 0.40 * 100
    "missing_required_skills": -7.00,       # 0.35 * 0.20 * (-1.0) * 100
    "overall_jd_relevance": 14.00,          # 0.35 * 0.40 * 100
    "interview_answer_relevance": 19.50,    # 0.30 * 0.65 * 100
    "communication_assessment": 10.50,      # 0.30 * 0.35 * 100
}
THEORETICAL_INTERCEPT = 7.00                # 0.35 * 0.20 * 1.0 * 100 (from retention = 1 - missing)


def train_and_evaluate():
    current_dir = Path(__file__).resolve().parent
    data_path = current_dir / "candidate_training_data.csv"
    model_output_path = current_dir / "candidate_scoring_model.joblib"
    metrics_output_path = current_dir / "model_metrics.json"

    print("=" * 80)
    print("HIREAI - CANDIDATE SCORING MODEL TRAINING & BENCHMARKING")
    print(f"Scikit-learn version: {sklearn.__version__}")
    print("=" * 80)

    if not data_path.exists():
        raise FileNotFoundError(f"Training data not found at {data_path}. Run generate_training_data.py first.")

    df = pd.read_csv(data_path)
    X = df[FEATURE_NAMES]
    y = df["overall_candidate_score_proxy"]

    # 80/20 Holdout Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )
    print(f"Dataset split: {len(X_train)} train rows, {len(X_test)} holdout test rows.\n")

    # Define Candidate Models
    models = {
        "Dummy (Mean Baseline)": DummyRegressor(strategy="mean"),
        "Ridge Regression": Ridge(alpha=1.0, random_state=42),
        "Gradient Boosting": GradientBoostingRegressor(
            n_estimators=100, max_depth=3, learning_rate=0.1, random_state=42
        ),
    }

    # 5-Fold Cross-Validation on Training Set
    cv = KFold(n_splits=5, shuffle=True, random_state=42)
    scoring = {
        "r2": "r2",
        "neg_mae": "neg_mean_absolute_error",
        "neg_rmse": "neg_root_mean_squared_error",
    }

    cv_results = {}
    test_results = {}

    for name, model in models.items():
        # 5-fold CV
        scores = cross_validate(model, X_train, y_train, cv=cv, scoring=scoring)
        cv_r2 = float(np.mean(scores["test_r2"]))
        cv_mae = float(-np.mean(scores["test_neg_mae"]))
        cv_rmse = float(-np.mean(scores["test_neg_rmse"]))
        cv_results[name] = {"r2": cv_r2, "mae": cv_mae, "rmse": cv_rmse}

        # Train on full train set & evaluate on holdout test set
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        test_r2 = float(r2_score(y_test, y_pred))
        test_mae = float(mean_absolute_error(y_test, y_pred))
        test_rmse = float(root_mean_squared_error(y_test, y_pred))
        test_results[name] = {"r2": test_r2, "mae": test_mae, "rmse": test_rmse}

    # -------------------------------------------------------------
    # 1. Print Performance Comparison Table
    # -------------------------------------------------------------
    print("=" * 80)
    print("MODEL PERFORMANCE COMPARISON (5-Fold CV vs. Holdout Test Set)")
    print("=" * 80)
    header = f"{'Model':<25} | {'CV R2':<8} {'CV MAE':<8} {'CV RMSE':<8} | {'Test R2':<8} {'Test MAE':<8} {'Test RMSE':<8}"
    print(header)
    print("-" * 80)
    for name in models:
        cv_m = cv_results[name]
        ts_m = test_results[name]
        row = f"{name:<25} | {cv_m['r2']:<8.4f} {cv_m['mae']:<8.3f} {cv_m['rmse']:<8.3f} | {ts_m['r2']:<8.4f} {ts_m['mae']:<8.3f} {ts_m['rmse']:<8.3f}"
        print(row)
    print("=" * 80)

    # -------------------------------------------------------------
    # 2. Inspect Ridge Coefficients vs. Theoretical Weights
    # -------------------------------------------------------------
    ridge_model = models["Ridge Regression"]
    learned_coefs = dict(zip(FEATURE_NAMES, ridge_model.coef_))
    learned_intercept = float(ridge_model.intercept_)

    print("\nRIDGE COEFFICIENTS vs. THEORETICAL RULE-BASED WEIGHTS:")
    print("=" * 80)
    print(f"{'Feature Name':<30} | {'Theoretical':<14} | {'Learned Coef':<14} | {'Difference':<12}")
    print("-" * 80)
    for feat in FEATURE_NAMES:
        th = THEORETICAL_WEIGHTS[feat]
        lc = learned_coefs[feat]
        diff = lc - th
        print(f"{feat:<30} | {th:<14.2f} | {lc:<14.4f} | {diff:<+12.4f}")
    print("-" * 80)
    int_diff = learned_intercept - THEORETICAL_INTERCEPT
    print(f"{'Intercept':<30} | {THEORETICAL_INTERCEPT:<14.2f} | {learned_intercept:<14.4f} | {int_diff:<+12.4f}")
    print("=" * 80)

    # -------------------------------------------------------------
    # 3. Model Selection Decision
    # -------------------------------------------------------------
    # Policy: Choose Ridge unless Gradient Boosting clearly wins on holdout test set (e.g. Test MAE > 1.0 point better)
    gb_mae = test_results["Gradient Boosting"]["mae"]
    ridge_mae = test_results["Ridge Regression"]["mae"]
    mae_diff = ridge_mae - gb_mae

    if mae_diff > 1.0:
        chosen_model_name = "Gradient Boosting"
        chosen_model = models["Gradient Boosting"]
        selection_reason = (
            f"Gradient Boosting chosen because it outperformed Ridge by {mae_diff:.3f} MAE points on holdout test set."
        )
    else:
        chosen_model_name = "Ridge Regression"
        chosen_model = ridge_model
        selection_reason = (
            f"Ridge chosen for superior interpretability and exact linear coefficient attribution. "
            f"Holdout MAE difference ({mae_diff:.3f} points) was below the threshold of 1.0 to justify a non-linear black box."
        )

    print(f"\nCHOSEN MODEL: {chosen_model_name}")
    print(f"REASON: {selection_reason}\n")

    # Save model artifact
    joblib.dump(chosen_model, model_output_path)
    print(f"Saved chosen model to: {model_output_path}")

    # Prepare metrics payload
    metrics_payload = {
        "model_version": "v1.0-ml-proxy",
        "scikit_learn_version": sklearn.__version__,
        "dataset_info": {
            "total_rows": len(df),
            "train_rows": len(X_train),
            "test_rows": len(X_test),
            "labels_type": "SYNTHETIC_PROXY_LABELS (rule-based + noise)",
        },
        "feature_order": FEATURE_NAMES,
        "chosen_model": chosen_model_name,
        "selection_reason": selection_reason,
        "model_performance": {
            "cross_validation_5fold": cv_results,
            "holdout_test_set": test_results,
        },
        "ridge_coefficients": {
            feat: round(float(learned_coefs[feat]), 6) for feat in FEATURE_NAMES
        },
        "ridge_intercept": round(learned_intercept, 6),
        "theoretical_weights": THEORETICAL_WEIGHTS,
        "theoretical_intercept": THEORETICAL_INTERCEPT,
    }

    with open(metrics_output_path, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)
    print(f"Saved model metrics to: {metrics_output_path}")
    print("=" * 80)


if __name__ == "__main__":
    train_and_evaluate()
