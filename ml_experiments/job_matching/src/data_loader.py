import os
import json
import urllib.request
from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
OUTPUTS_DIR = BASE_DIR / "outputs"

HF_BASE_URL = "https://huggingface.co/datasets/michaelozon/candidate-matching-synthetic/resolve/main"

FILES = {
    "jobs": "jobs/train-00000-of-00001.parquet",
    "resumes": "resumes/train-00000-of-00001.parquet",
    "matches": "matches/train-00000-of-00001.parquet"
}

def download_file(rel_path: str, dest_path: Path):
    if dest_path.exists():
        print(f"File already exists: {dest_path}")
        return
    url = f"{HF_BASE_URL}/{rel_path}"
    print(f"Downloading {url} to {dest_path}...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as response, open(dest_path, "wb") as out_file:
        out_file.write(response.read())
    print(f"Downloaded: {dest_path} ({dest_path.stat().st_size / (1024*1024):.2f} MB)")

def prepare_pilot_data():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Download full parquets into local cache
    for name, rel_path in FILES.items():
        dest = DATA_DIR / f"{name}_raw.parquet"
        download_file(rel_path, dest)
        
    print("Reading full raw tables...")
    df_jobs = pd.read_parquet(DATA_DIR / "jobs_raw.parquet")
    df_resumes = pd.read_parquet(DATA_DIR / "resumes_raw.parquet")
    df_matches = pd.read_parquet(DATA_DIR / "matches_raw.parquet")
    
    print(f"Raw jobs count: {len(df_jobs)}")
    print(f"Raw resumes count: {len(df_resumes)}")
    print(f"Raw matches count: {len(df_matches)}")
    
    # Expand matches into (job_id, resume_id) pairs
    match_pairs = []
    for _, row in df_matches.iterrows():
        jid = row["job_id"]
        for rid in row["relevant_resume_ids"]:
            match_pairs.append({"job_id": jid, "resume_id": rid, "is_match": 1})
    df_pairs = pd.DataFrame(match_pairs)
    print(f"Total positive match pairs: {len(df_pairs)}")
    
    # Audit log
    audit_data = {
        "dataset_source": "michaelozon/candidate-matching-synthetic",
        "license": "MIT",
        "raw_counts": {
            "jobs": len(df_jobs),
            "resumes": len(df_resumes),
            "match_records": len(df_matches),
            "total_positive_pairs": len(df_pairs)
        },
        "sample_job_columns": list(df_jobs.columns),
        "sample_resume_columns": list(df_resumes.columns)
    }
    with open(OUTPUTS_DIR / "dataset_audit.json", "w", encoding="utf-8") as f:
        json.dump(audit_data, f, indent=2)
        
    print("Audit written to outputs/dataset_audit.json")
    return df_jobs, df_resumes, df_pairs

if __name__ == "__main__":
    prepare_pilot_data()

