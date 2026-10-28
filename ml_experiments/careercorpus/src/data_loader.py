import os
import re
import json
from pathlib import Path
import pandas as pd
import numpy as np

# Path to the unmodified original Excel dataset
ORIGINAL_DATASET_PATH = Path(__file__).resolve().parents[3] / "ML-dataset" / "CareerCorpus" / "CareerCorpus.xlsx"
def load_and_audit_dataset(output_dir: Path):
    """
    Loads CareerCorpus from the original Excel file, recalculates verified statistics,
    standardizes text representations, audits duplicate records, and saves a transformation log.
    Does not touch or modify the original Excel file.
    """
    if not ORIGINAL_DATASET_PATH.exists():
        raise FileNotFoundError(f"Original dataset not found at: {ORIGINAL_DATASET_PATH}")
    
    # Read using openpyxl engine
    df_raw = pd.read_excel(ORIGINAL_DATASET_PATH, engine="openpyxl")
    
    total_raw_rows = len(df_raw)
    
    # Verify expected columns
    expected_cols = [
        "ID", "Domain", "Education", "Skills and Achievements",
        "Experience", "Job_type", "Annotator-1", "Annotator-2"
    ]
    for col in expected_cols:
        if col not in df_raw.columns:
            raise ValueError(f"Missing expected column '{col}' in CareerCorpus dataset.")
            
    # Calculate exact uncleaned ground truth stats
    a1_vals = df_raw["Annotator-1"].astype(float).values
    a2_vals = df_raw["Annotator-2"].astype(float).values
    abs_diffs = np.abs(a1_vals - a2_vals)
    
    ground_truth_stats = {
        "total_records": int(total_raw_rows),
        "annotator_1": {
            "mean": float(np.round(np.mean(a1_vals), 5)),
            "std": float(np.round(np.std(a1_vals), 5)),
            "min": float(np.min(a1_vals)),
            "max": float(np.max(a1_vals))
        },
        "annotator_2": {
            "mean": float(np.round(np.mean(a2_vals), 5)),
            "std": float(np.round(np.std(a2_vals), 5)),
            "min": float(np.min(a2_vals)),
            "max": float(np.max(a2_vals))
        },
        "mean_absolute_difference": float(np.round(np.mean(abs_diffs), 5))
    }
    
    # Transformation and cleaning steps
    df_clean = df_raw.copy()
    
    # Standardize string fields
    for col in ["Domain", "Job_type"]:
        df_clean[col] = df_clean[col].astype(str).str.strip()
        
    # Standardize Job_type casing: "Entry-level" and "Entry-Level" -> "Entry-Level"
    job_type_counts_before = df_clean["Job_type"].value_counts().to_dict()
    df_clean["Job_type"] = df_clean["Job_type"].replace({"Entry-level": "Entry-Level"})
    job_type_counts_after = df_clean["Job_type"].value_counts().to_dict()
    
    # Standardize text columns
    text_cols = ["Education", "Skills and Achievements", "Experience"]
    for col in text_cols:
        df_clean[col] = df_clean[col].fillna("").astype(str)
        # Normalize excessive whitespace and special unicode characters
        df_clean[col] = df_clean[col].apply(lambda x: re.sub(r"\s+", " ", x.strip()))
        
    # ID audit and preservation
    df_clean["ID"] = df_clean["ID"].astype(str).str.strip()
    id_counts = df_clean["ID"].value_counts()
    repeated_ids = id_counts[id_counts > 1].to_dict()
    
    dup_details = []
    if "35421497" in repeated_ids:
        rows_35421497 = df_clean[df_clean["ID"] == "35421497"]
        for idx, row in rows_35421497.iterrows():
            dup_details.append({
                "row_index": int(idx),
                "id": str(row["ID"]),
                "domain": str(row["Domain"]),
                "job_type": str(row["Job_type"]),
                "annotator_1": float(row["Annotator-1"]),
                "annotator_2": float(row["Annotator-2"]),
                "skills_snippet": str(row["Skills and Achievements"])[:60],
                "experience_snippet": str(row["Experience"])[:60]
            })
            
    # Calculate primary experimental target: Consensus Average
    df_clean["target"] = (df_clean["Annotator-1"] + df_clean["Annotator-2"]) / 2.0
    
    # Construct composite text representations
    # 1. Resume text only
    df_clean["resume_text_only"] = (
        "Skills: " + df_clean["Skills and Achievements"] + " " +
        "Experience: " + df_clean["Experience"] + " " +
        "Education: " + df_clean["Education"]
    )
    
    # 2. Resume text plus domain and job_type
    df_clean["resume_text_with_metadata"] = (
        "Domain: " + df_clean["Domain"] + " " +
        "Seniority: " + df_clean["Job_type"] + " " +
        "Skills: " + df_clean["Skills and Achievements"] + " " +
        "Experience: " + df_clean["Experience"] + " " +
        "Education: " + df_clean["Education"]
    )
    
    transformation_log = {
        "source_dataset": str(ORIGINAL_DATASET_PATH),
        "total_records_read": total_raw_rows,
        "ground_truth_reconciliation": ground_truth_stats,
        "job_type_normalization": {
            "before": job_type_counts_before,
            "after": job_type_counts_after
        },
        "repeated_ids_identified": repeated_ids,
        "duplicate_preservation_details": dup_details,
        "target_definition": {
            "formula": "(Annotator-1 + Annotator-2) / 2.0",
            "interpretation": "Continuous consensus relevance rating within candidate occupational domain",
            "mean": float(np.round(df_clean["target"].mean(), 5)),
            "std": float(np.round(df_clean["target"].std(), 5)),
            "min": float(df_clean["target"].min()),
            "max": float(df_clean["target"].max())
        }
    }
    
    output_dir.mkdir(parents=True, exist_ok=True)
    log_path = output_dir / "transformation_log.json"
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump(transformation_log, f, indent=2)
        
    print(f"Data audit complete. Log saved to {log_path}")
    return df_clean, transformation_log

if __name__ == "__main__":
    out_dir = Path(__file__).resolve().parent.parent / "outputs"
    load_and_audit_dataset(out_dir)

