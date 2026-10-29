"""
HireAI Job-Matching Unified Deterministic Evaluation Protocol.

This module provides standard IR metrics and a strictly deterministic data split protocol:
- Test jobs: 50 jobs sampled deterministically using sorted job IDs and seed 42.
- Relevant candidates: Exactly union of candidates confirmed relevant to test jobs (1,385 resumes).
- Distractor candidates: Remaining candidates sorted by ID before seeded sampling (615 resumes).
- Total candidate pool: Exactly 2,000 resumes, sorted by ID for complete indexing consistency.
"""

import re
from pathlib import Path
from typing import Dict, List, Set, Tuple, Any
import numpy as np
import pandas as pd

def tokenize(text: str) -> List[str]:
    """Tokenize narrative text for lexical retrieval and overlap checks."""
    return re.findall(r"[a-zA-Z0-9+#.-]+", text.lower())

def build_resume_narrative(row: pd.Series) -> str:
    """Build narrative resume text (role, summary, experience bullets, education)."""
    bullets = " ".join(row["experience_bullets"]) if hasattr(row["experience_bullets"], "__iter__") and not isinstance(row["experience_bullets"], str) else str(row["experience_bullets"])
    return f"{row['role']}. {row['summary']} {bullets} Education: {row['education']}."

def build_job_narrative(row: pd.Series) -> str:
    """Build narrative job description (title, industry, description, responsibilities, requirements)."""
    resp = " ".join(row["responsibilities"]) if hasattr(row["responsibilities"], "__iter__") and not isinstance(row["responsibilities"], str) else str(row["responsibilities"])
    reqs = " ".join(row["requirements"]) if hasattr(row["requirements"], "__iter__") and not isinstance(row["requirements"], str) else str(row["requirements"])
    return f"{row['job_title']} in {row['industry']}. {row['description']} Responsibilities: {resp} Requirements: {reqs}"

def compute_ranking_metrics(ranks_list: List[str], relevant_set: Set[str], k_vals: List[int] = [5, 10]) -> Dict[str, float]:
    """
    Compute standard Information Retrieval evaluation metrics:
    - Recall@K: hits / total_rel_in_pool (proportion of all relevant items found in top K)
    - MRR: 1 / rank of first relevant item
    - NDCG@10: DCG@10 / IDCG@10 with binary relevance and log2 discount
    """
    total_rel_in_pool = len(relevant_set)
    if total_rel_in_pool == 0:
        return {}

    metrics = {}
    for k in k_vals:
        top_k = ranks_list[:k]
        hits = len(set(top_k) & relevant_set)
        metrics[f"recall@{k}"] = hits / total_rel_in_pool
        metrics[f"hits@{k}"] = hits

    # MRR (Mean Reciprocal Rank)
    mrr = 0.0
    for rank_idx, cand_id in enumerate(ranks_list, start=1):
        if cand_id in relevant_set:
            mrr = 1.0 / rank_idx
            break
    metrics["mrr"] = mrr

    # NDCG@10 (Normalized Discounted Cumulative Gain at rank 10)
    dcg = 0.0
    for rank_idx, cand_id in enumerate(ranks_list[:10], start=1):
        rel = 1 if cand_id in relevant_set else 0
        dcg += (2**rel - 1) / np.log2(rank_idx + 1)
        
    idcg = sum((2**1 - 1) / np.log2(i + 1) for i in range(1, min(10, total_rel_in_pool) + 1))
    metrics["ndcg@10"] = dcg / idcg if idcg > 0 else 0.0

    return metrics

def build_deterministic_evaluation_set(
    data_dir: Path,
    target_pool_size: int = 2000,
    num_test_jobs: int = 50,
    seed: int = 42
) -> Dict[str, Any]:
    """
    Constructs a 100% deterministic test set and candidate pool:
    1. Loads jobs, resumes, and matches parquets.
    2. Sorts unique job IDs alphabetically before seeded permutation.
    3. Gathers 100% of resumes matched to the selected test jobs (1,385 resumes).
    4. Sorts remaining candidate IDs alphabetically before seeded sampling.
    5. Collects exactly target_pool_size candidates (sorted for deterministic indexing).
    """
    df_jobs = pd.read_parquet(data_dir / "jobs_raw.parquet")
    df_resumes = pd.read_parquet(data_dir / "resumes_raw.parquet")
    df_matches = pd.read_parquet(data_dir / "matches_raw.parquet")

    # Add narrative texts
    df_resumes["narrative_text"] = df_resumes.apply(build_resume_narrative, axis=1)
    df_jobs["narrative_text"] = df_jobs.apply(build_job_narrative, axis=1)

    # Match lookup
    match_lookup: Dict[str, Set[str]] = {}
    for _, row in df_matches.iterrows():
        match_lookup[row["job_id"]] = set(row["relevant_resume_ids"])

    # Deterministic test job selection
    sorted_unique_jobs = sorted(list(df_jobs["job_id"].unique()))
    rng_jobs = np.random.RandomState(seed)
    shuffled_jobs = rng_jobs.permutation(sorted_unique_jobs)
    selected_test_jobs = sorted(list(shuffled_jobs[:num_test_jobs]))

    # Collect all relevant candidates for test jobs
    test_matched_resumes: Set[str] = set()
    total_relevant_pairings = 0
    for jid in selected_test_jobs:
        rels = match_lookup.get(jid, set())
        test_matched_resumes.update(rels)
        total_relevant_pairings += len(rels)

    unique_relevant_count = len(test_matched_resumes)

    # Deterministic candidate pool selection
    all_resumes_set = set(df_resumes["resume_id"].unique())
    remaining_resumes_sorted = sorted(list(all_resumes_set - test_matched_resumes))

    additional_needed = max(0, target_pool_size - unique_relevant_count)
    rng_cands = np.random.RandomState(seed)
    shuffled_distractors = rng_cands.permutation(remaining_resumes_sorted)
    selected_distractors = list(shuffled_distractors[:additional_needed])

    # Pool is union of all confirmed relevant resumes + deterministic distractors
    full_pool_ids = sorted(list(test_matched_resumes) + selected_distractors)

    # Subsets of dataframes
    test_jobs_df = df_jobs[df_jobs["job_id"].isin(selected_test_jobs)].sort_values("job_id").reset_index(drop=True)
    test_resumes_df = df_resumes[df_resumes["resume_id"].isin(full_pool_ids)].sort_values("resume_id").reset_index(drop=True)

    return {
        "df_jobs": df_jobs,
        "df_resumes": df_resumes,
        "df_matches": df_matches,
        "test_jobs_df": test_jobs_df,
        "test_resumes_df": test_resumes_df,
        "match_lookup": match_lookup,
        "selected_test_job_ids": selected_test_jobs,
        "full_candidate_pool_ids": full_pool_ids,
        "relevant_resumes_count": unique_relevant_count,
        "relevant_pairings_count": total_relevant_pairings,
        "distractors_count": len(selected_distractors),
        "total_pool_size": len(full_pool_ids)
    }

