import os
import json
import re
from pathlib import Path
import numpy as np
import pandas as pd
from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
OUTPUTS_DIR = BASE_DIR / "outputs"

def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z0-9+#.-]+", text.lower())

def run_hybrid_experiment():
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    
    print("=" * 60)
    print("STEP 1: Loading Data and Preparing Narrative Text")
    print("=" * 60)
    df_jobs = pd.read_parquet(DATA_DIR / "jobs_raw.parquet")
    df_resumes = pd.read_parquet(DATA_DIR / "resumes_raw.parquet")
    df_matches = pd.read_parquet(DATA_DIR / "matches_raw.parquet")
    
    # Build narrative text representations
    def build_resume_narrative(row):
        bullets = " ".join(row["experience_bullets"]) if hasattr(row["experience_bullets"], "__iter__") else str(row["experience_bullets"])
        return f"{row['role']}. {row['summary']} {bullets} Education: {row['education']}."
        
    def build_job_narrative(row):
        resp = " ".join(row["responsibilities"]) if hasattr(row["responsibilities"], "__iter__") else str(row["responsibilities"])
        reqs = " ".join(row["requirements"]) if hasattr(row["requirements"], "__iter__") else str(row["requirements"])
        return f"{row['job_title']} in {row['industry']}. {row['description']} Responsibilities: {resp} Requirements: {reqs}"
        
    df_resumes["narrative_text"] = df_resumes.apply(build_resume_narrative, axis=1)
    df_jobs["narrative_text"] = df_jobs.apply(build_job_narrative, axis=1)
    
    match_lookup = {}
    for _, row in df_matches.iterrows():
        match_lookup[row["job_id"]] = set(row["relevant_resume_ids"])
        
    # -------------------------------------------------------------
    # STEP 2: Reusing the Exact Same 50 Test Jobs and 2,000 Candidate Pool
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print("STEP 2: Reconstructing Exact Test Set and 2,000 Candidate Pool (Seed 42)")
    print("=" * 60)
    np.random.seed(42)
    shuffled_job_ids = np.random.permutation(df_jobs["job_id"].unique())
    test_job_ids = set(shuffled_job_ids[:50])
    
    test_matched_resumes = set()
    for jid in test_job_ids:
        test_matched_resumes.update(match_lookup.get(jid, set()))
        
    num_test_matched = len(test_matched_resumes)
    
    TARGET_POOL_SIZE = 2000
    all_resumes = set(df_resumes["resume_id"].unique())
    remaining_resumes = list(all_resumes - test_matched_resumes)
    np.random.shuffle(remaining_resumes)
    
    additional_needed = max(0, TARGET_POOL_SIZE - num_test_matched)
    test_candidate_pool_ids = list(test_matched_resumes) + remaining_resumes[:additional_needed]
    test_candidate_pool_set = set(test_candidate_pool_ids)
    
    test_resumes_df = df_resumes[df_resumes["resume_id"].isin(test_candidate_pool_set)].reset_index(drop=True)
    test_jobs_df = df_jobs[df_jobs["job_id"].isin(test_job_ids)].reset_index(drop=True)
    
    print(f"Test candidate pool size: {len(test_resumes_df)} (100% of all {num_test_matched} relevant resumes present)")
    print(f"Test job queries count: {len(test_jobs_df)}")
    
    candidate_ids = test_resumes_df["resume_id"].values
    
    # -------------------------------------------------------------
    # STEP 3: Setup BM25 and Dense Bi-Encoder
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print("STEP 3: Preparing BM25 and all-MiniLM-L6-v2")
    print("=" * 60)
    candidate_corpus = [tokenize(t) for t in test_resumes_df["narrative_text"]]
    bm25 = BM25Okapi(candidate_corpus)
    
    print("Loading all-MiniLM-L6-v2 model onto CPU...")
    bi_encoder = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")
    
    print("Encoding candidate pool...")
    candidate_embeddings = bi_encoder.encode(
        test_resumes_df["narrative_text"].tolist(),
        batch_size=64,
        show_progress_bar=False,
        normalize_embeddings=True
    )
    
    print("Encoding test job queries...")
    job_embeddings = bi_encoder.encode(
        test_jobs_df["narrative_text"].tolist(),
        batch_size=32,
        show_progress_bar=False,
        normalize_embeddings=True
    )
    
    # -------------------------------------------------------------
    # STEP 4: IR Metric Calculation Function
    # -------------------------------------------------------------
    def compute_ranking_metrics(ranks_list, relevant_set, k_vals=[5, 10]):
        metrics = {}
        total_rel_in_pool = len(relevant_set)
        if total_rel_in_pool == 0:
            return None
            
        for k in k_vals:
            top_k = ranks_list[:k]
            hits = len(set(top_k) & relevant_set)
            metrics[f"recall@{k}"] = hits / total_rel_in_pool if total_rel_in_pool > 0 else 0.0
            metrics[f"hits@{k}"] = hits
            
        # MRR
        mrr = 0.0
        for rank_idx, cand_id in enumerate(ranks_list, start=1):
            if cand_id in relevant_set:
                mrr = 1.0 / rank_idx
                break
        metrics["mrr"] = mrr
        
        # NDCG@10
        dcg = 0.0
        for rank_idx, cand_id in enumerate(ranks_list[:10], start=1):
            rel = 1 if cand_id in relevant_set else 0
            dcg += (2**rel - 1) / np.log2(rank_idx + 1)
        idcg = sum((2**1 - 1) / np.log2(i + 1) for i in range(1, min(10, total_rel_in_pool) + 1))
        metrics["ndcg@10"] = dcg / idcg if idcg > 0 else 0.0
        
        return metrics

    # -------------------------------------------------------------
    # STEP 5: Evaluate Retrieval & Hybrid Combination
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print("STEP 5: Evaluating BM25, Dense, RRF Hybrid, and Linear Hybrid")
    print("=" * 60)
    
    results_bm25 = []
    results_dense = []
    results_rrf = []
    results_linear = []
    
    # RRF constant k_rrf = 60 (standard standard default from Cormack et al. 2009)
    K_RRF = 60
    
    for i, job_row in test_jobs_df.iterrows():
        jid = job_row["job_id"]
        true_rel = match_lookup.get(jid, set()) & test_candidate_pool_set
        if not true_rel:
            continue
            
        # 1. BM25 scores
        query_tokens = tokenize(job_row["narrative_text"])
        scores_bm25 = bm25.get_scores(query_tokens)
        rank_bm25_indices = np.argsort(scores_bm25)[::-1]
        ranks_bm25 = candidate_ids[rank_bm25_indices].tolist()
        m_bm25 = compute_ranking_metrics(ranks_bm25, true_rel)
        if m_bm25: results_bm25.append(m_bm25)
        
        # 2. Dense Cosine scores
        job_vec = job_embeddings[i]
        scores_dense = np.dot(candidate_embeddings, job_vec)
        rank_dense_indices = np.argsort(scores_dense)[::-1]
        ranks_dense = candidate_ids[rank_dense_indices].tolist()
        m_dense = compute_ranking_metrics(ranks_dense, true_rel)
        if m_dense: results_dense.append(m_dense)
        
        # 3. Reciprocal Rank Fusion (RRF)
        # RRF_score(d) = 1 / (K_RRF + rank_bm25(d)) + 1 / (K_RRF + rank_dense(d))
        bm25_rank_dict = {cand_id: rank for rank, cand_id in enumerate(ranks_bm25, start=1)}
        dense_rank_dict = {cand_id: rank for rank, cand_id in enumerate(ranks_dense, start=1)}
        
        rrf_scores = np.zeros(len(candidate_ids))
        for idx, cand_id in enumerate(candidate_ids):
            r_b = bm25_rank_dict[cand_id]
            r_d = dense_rank_dict[cand_id]
            rrf_scores[idx] = (1.0 / (K_RRF + r_b)) + (1.0 / (K_RRF + r_d))
            
        rank_rrf_indices = np.argsort(rrf_scores)[::-1]
        ranks_rrf = candidate_ids[rank_rrf_indices].tolist()
        m_rrf = compute_ranking_metrics(ranks_rrf, true_rel)
        if m_rrf: results_rrf.append(m_rrf)
        
        # 4. Linear Combination (Standard Min-Max Normalization, Equal Untuned Weights 0.5 / 0.5)
        # We do NOT tune weights on the test set. Predefined balanced weight: 0.5 * norm(BM25) + 0.5 * norm(Dense)
        bm25_min, bm25_max = np.min(scores_bm25), np.max(scores_bm25)
        bm25_norm = (scores_bm25 - bm25_min) / (bm25_max - bm25_min) if (bm25_max - bm25_min) > 0 else np.zeros_like(scores_bm25)
        
        dense_min, dense_max = np.min(scores_dense), np.max(scores_dense)
        dense_norm = (scores_dense - dense_min) / (dense_max - dense_min) if (dense_max - dense_min) > 0 else np.zeros_like(scores_dense)
        
        linear_scores = 0.5 * bm25_norm + 0.5 * dense_norm
        rank_linear_indices = np.argsort(linear_scores)[::-1]
        ranks_linear = candidate_ids[rank_linear_indices].tolist()
        m_linear = compute_ranking_metrics(ranks_linear, true_rel)
        if m_linear: results_linear.append(m_linear)
        
    def aggregate_metrics(res_list):
        df_m = pd.DataFrame(res_list)
        return {
            "mean_recall@5": float(np.round(df_m["recall@5"].mean(), 4)),
            "mean_recall@10": float(np.round(df_m["recall@10"].mean(), 4)),
            "mean_mrr": float(np.round(df_m["mrr"].mean(), 4)),
            "mean_ndcg@10": float(np.round(df_m["ndcg@10"].mean(), 4))
        }
        
    hybrid_summary = {
        "evaluation_setup": {
            "test_jobs_count": len(test_jobs_df),
            "test_candidate_pool_size": len(test_resumes_df),
            "input_mode": "Strictly narrative text",
            "leakage_controls": "Same 50 test jobs and 2,000 candidate pool (seed 42); zero weight tuning on test set",
            "rrf_constant": K_RRF,
            "linear_weights": "Predefined untuned 0.5 * MinMax(BM25) + 0.5 * MinMax(Dense)"
        },
        "methods_comparison": {
            "bm25_lexical_retrieval": aggregate_metrics(results_bm25),
            "all_minilm_l6_v2_semantic": aggregate_metrics(results_dense),
            "rrf_hybrid": aggregate_metrics(results_rrf),
            "linear_minmax_hybrid": aggregate_metrics(results_linear)
        }
    }
    
    output_file = OUTPUTS_DIR / "hybrid_comparison_metrics.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(hybrid_summary, f, indent=2)
        
    print("\n" + "=" * 60)
    print("HYBRID EXPERIMENT EVALUATION RESULTS")
    print("=" * 60)
    for model_name, metrics in hybrid_summary["methods_comparison"].items():
        print(f"\n{model_name.upper()}:")
        for k, v in metrics.items():
            print(f"  {k}: {v}")
            
    print(f"\nSaved hybrid results to {output_file}")

if __name__ == "__main__":
    run_hybrid_experiment()

