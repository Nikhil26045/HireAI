import os
import json
from pathlib import Path
import pandas as pd
import numpy as np

from sklearn.model_selection import GroupShuffleSplit, GroupKFold
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import Ridge
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score

from data_loader import load_and_audit_dataset

def run_experiment():
    base_dir = Path(__file__).resolve().parent.parent
    outputs_dir = base_dir / "outputs"
    outputs_dir.mkdir(parents=True, exist_ok=True)
    
    print("=" * 60)
    print("STEP 1: Loading & Auditing CareerCorpus Dataset")
    print("=" * 60)
    df, transform_log = load_and_audit_dataset(outputs_dir)
    print(f"Total rows: {len(df)}")
    print(f"Annotator-1 Mean: {transform_log['ground_truth_reconciliation']['annotator_1']['mean']}")
    print(f"Annotator-2 Mean: {transform_log['ground_truth_reconciliation']['annotator_2']['mean']}")
    print(f"Mean Abs Diff: {transform_log['ground_truth_reconciliation']['mean_absolute_difference']}")
    
    # -------------------------------------------------------------
    # STEP 2: Grouped Holdout Split (20% Test)
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print("STEP 2: Creating Grouped Holdout Split (Grouped by ID)")
    print("=" * 60)
    # GroupShuffleSplit ensures records sharing an ID (e.g. 35421497)
    # strictly stay together in either train or test.
    gss = GroupShuffleSplit(n_splits=1, test_size=0.20, random_state=42)
    train_idx, test_idx = next(gss.split(df, groups=df["ID"]))
    
    train_df = df.iloc[train_idx].copy().reset_index(drop=True)
    test_df = df.iloc[test_idx].copy().reset_index(drop=True)
    
    # Verify group separation
    train_ids = set(train_df["ID"])
    test_ids = set(test_df["ID"])
    overlap = train_ids & test_ids
    print(f"Train records: {len(train_df)} ({len(train_ids)} unique IDs)")
    print(f"Test records:  {len(test_df)} ({len(test_ids)} unique IDs)")
    print(f"ID overlap between Train & Test: {overlap} (Must be empty)")
    assert len(overlap) == 0, "Data leakage detected: ID found in both train and test!"
    
    # Check domain distribution across splits
    train_domain_counts = train_df["Domain"].value_counts().to_dict()
    test_domain_counts = test_df["Domain"].value_counts().to_dict()
    print("\nDomain counts in Train split:", train_domain_counts)
    print("Domain counts in Test split: ", test_domain_counts)
    print("Note: Split is grouped by candidate ID to strictly prevent leakage.")
    
    split_info = {
        "train_records": len(train_df),
        "test_records": len(test_df),
        "train_unique_ids": len(train_ids),
        "test_unique_ids": len(test_ids),
        "train_domain_counts": train_domain_counts,
        "test_domain_counts": test_domain_counts,
        "duplicate_id_placement": {
            "35421497": "Train" if "35421497" in train_ids else "Test"
        }
    }
    
    # -------------------------------------------------------------
    # STEP 3: Model Evaluation Helper (GroupKFold CV + Test Eval)
    # -------------------------------------------------------------
    def evaluate_feature_pipeline(feature_col_name: str, pipeline_label: str):
        print(f"\n--- Evaluating Pipeline: {pipeline_label} ---")
        
        # 5-Fold GroupKFold Cross-Validation on TRAINING set ONLY
        gkf = GroupKFold(n_splits=5)
        
        cv_dummy_mae, cv_dummy_rmse, cv_dummy_r2 = [], [], []
        cv_ridge_mae, cv_ridge_rmse, cv_ridge_r2 = [], [], []
        
        for fold, (fold_train_idx, fold_val_idx) in enumerate(gkf.split(train_df, groups=train_df["ID"])):
            fold_train = train_df.iloc[fold_train_idx]
            fold_val = train_df.iloc[fold_val_idx]
            
            # FIT vectorizer strictly on training fold only
            vec = TfidfVectorizer(max_features=1000, ngram_range=(1, 2), stop_words="english")
            X_tr = vec.fit_transform(fold_train[feature_col_name])
            X_va = vec.transform(fold_val[feature_col_name])
            
            y_tr = fold_train["target"].values
            y_val = fold_val["target"].values
            
            # Dummy Regressor (predicts train mean)
            dummy = DummyRegressor(strategy="mean")
            dummy.fit(X_tr, y_tr)
            y_pred_dummy = dummy.predict(X_va)
            
            cv_dummy_mae.append(mean_absolute_error(y_val, y_pred_dummy))
            cv_dummy_rmse.append(root_mean_squared_error(y_val, y_pred_dummy))
            cv_dummy_r2.append(r2_score(y_val, y_pred_dummy))
            
            # Ridge Regressor
            ridge = Ridge(alpha=1.0, random_state=42)
            ridge.fit(X_tr, y_tr)
            y_pred_ridge = ridge.predict(X_va)
            
            cv_ridge_mae.append(mean_absolute_error(y_val, y_pred_ridge))
            cv_ridge_rmse.append(root_mean_squared_error(y_val, y_pred_ridge))
            cv_ridge_r2.append(r2_score(y_val, y_pred_ridge))
            
        cv_summary = {
            "dummy_regressor": {
                "mean_cv_mae": float(np.round(np.mean(cv_dummy_mae), 5)),
                "std_cv_mae": float(np.round(np.std(cv_dummy_mae), 5)),
                "mean_cv_rmse": float(np.round(np.mean(cv_dummy_rmse), 5)),
                "std_cv_rmse": float(np.round(np.std(cv_dummy_rmse), 5)),
                "mean_cv_r2": float(np.round(np.mean(cv_dummy_r2), 5))
            },
            "ridge_regressor": {
                "mean_cv_mae": float(np.round(np.mean(cv_ridge_mae), 5)),
                "std_cv_mae": float(np.round(np.std(cv_ridge_mae), 5)),
                "mean_cv_rmse": float(np.round(np.mean(cv_ridge_rmse), 5)),
                "std_cv_rmse": float(np.round(np.std(cv_ridge_rmse), 5)),
                "mean_cv_r2": float(np.round(np.mean(cv_ridge_r2), 5))
            }
        }
        
        # FINAL FIT on entire Train set -> Predict on Test set
        full_vec = TfidfVectorizer(max_features=1000, ngram_range=(1, 2), stop_words="english")
        X_train_full = full_vec.fit_transform(train_df[feature_col_name])
        X_test_full = full_vec.transform(test_df[feature_col_name])
        
        y_train_full = train_df["target"].values
        y_test_actual = test_df["target"].values
        
        # Dummy
        final_dummy = DummyRegressor(strategy="mean")
        final_dummy.fit(X_train_full, y_train_full)
        test_pred_dummy = final_dummy.predict(X_test_full)
        
        dummy_test_mae = float(np.round(mean_absolute_error(y_test_actual, test_pred_dummy), 5))
        dummy_test_rmse = float(np.round(root_mean_squared_error(y_test_actual, test_pred_dummy), 5))
        dummy_test_r2 = float(np.round(r2_score(y_test_actual, test_pred_dummy), 5))
        
        # Ridge
        final_ridge = Ridge(alpha=1.0, random_state=42)
        final_ridge.fit(X_train_full, y_train_full)
        test_pred_ridge = final_ridge.predict(X_test_full)
        
        ridge_test_mae = float(np.round(mean_absolute_error(y_test_actual, test_pred_ridge), 5))
        ridge_test_rmse = float(np.round(root_mean_squared_error(y_test_actual, test_pred_ridge), 5))
        ridge_test_r2 = float(np.round(r2_score(y_test_actual, test_pred_ridge), 5))
        
        test_summary = {
            "dummy_regressor": {
                "test_mae": dummy_test_mae,
                "test_rmse": dummy_test_rmse,
                "test_r2": dummy_test_r2
            },
            "ridge_regressor": {
                "test_mae": ridge_test_mae,
                "test_rmse": ridge_test_rmse,
                "test_r2": ridge_test_r2
            }
        }
        
        return cv_summary, test_summary, test_pred_dummy, test_pred_ridge
        
    # Evaluate Pipeline A: Resume text only
    cv_a, test_a, pred_dummy_a, pred_ridge_a = evaluate_feature_pipeline(
        feature_col_name="resume_text_only",
        pipeline_label="Pipeline A: Resume Text Only (Skills + Experience + Education)"
    )
    
    # Evaluate Pipeline B: Resume text + Domain + Job_type
    cv_b, test_b, pred_dummy_b, pred_ridge_b = evaluate_feature_pipeline(
        feature_col_name="resume_text_with_metadata",
        pipeline_label="Pipeline B: Resume Text + Domain + Job_type Metadata"
    )
    
    # Save test predictions table
    test_results_df = pd.DataFrame({
        "ID": test_df["ID"],
        "Domain": test_df["Domain"],
        "Job_type": test_df["Job_type"],
        "Annotator_1": test_df["Annotator-1"],
        "Annotator_2": test_df["Annotator-2"],
        "Actual_Target": np.round(test_df["target"], 4),
        "Dummy_Prediction": np.round(pred_dummy_a, 4),
        "Ridge_TextOnly_Pred": np.round(pred_ridge_a, 4),
        "Ridge_TextPlusMeta_Pred": np.round(pred_ridge_b, 4),
        "AbsError_Dummy": np.round(np.abs(test_df["target"] - pred_dummy_a), 4),
        "AbsError_Ridge_TextOnly": np.round(np.abs(test_df["target"] - pred_ridge_a), 4),
        "AbsError_Ridge_TextPlusMeta": np.round(np.abs(test_df["target"] - pred_ridge_b), 4),
    })
    
    pred_path = outputs_dir / "test_predictions.csv"
    test_results_df.to_csv(pred_path, index=False)
    print(f"\nHeld-out predictions saved to {pred_path}")
    
    # Export full metrics JSON
    metrics_export = {
        "split_information": split_info,
        "pipeline_a_resume_text_only": {
            "cross_validation_5fold": cv_a,
            "held_out_test_evaluation": test_a
        },
        "pipeline_b_resume_text_plus_metadata": {
            "cross_validation_5fold": cv_b,
            "held_out_test_evaluation": test_b
        }
    }
    
    metrics_path = outputs_dir / "experiment_metrics.json"
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_export, f, indent=2)
    print(f"Metrics export saved to {metrics_path}")

if __name__ == "__main__":
    run_experiment()

