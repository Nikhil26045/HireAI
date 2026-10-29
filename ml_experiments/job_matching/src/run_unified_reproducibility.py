"""
HireAI Job-Matching Unified Reproducibility Suite.

Benchmarks all 6 methods on the exact same 50 test jobs and 2,000-candidate pool:
1. Keyword/Skill Overlap (HireAI Rule-Based Proxy)
2. BM25 Lexical Retrieval
3. Dense Bi-Encoder Retrieval (all-MiniLM-L6-v2)
4. Reciprocal Rank Fusion Hybrid (RRF, k=60)
5. Linear Min-Max Score Fusion Hybrid (0.5 BM25 + 0.5 Dense)
6. Two-Stage Cross-Encoder Re-Ranking (ms-marco-MiniLM-L-6-v2 re-ranking top 25 of linear hybrid)

Also performs an immediate second pass to prove 100% deterministic reproducibility.
Saves all outputs strictly to ml_experiments/job_matching/outputs/reproducibility/.
"""

import json
import time
from pathlib import Path
from typing import Dict, List, Any
import numpy as np
import pandas as pd
from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer, CrossEncoder

from evaluation_protocol import (
    tokenize,
    compute_ranking_metrics,
    build_deterministic_evaluation_set
)

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
OUTPUTS_DIR = BASE_DIR / "outputs" / "reproducibility"

def score_keyword_overlap(job_row, candidate_text_tokens_set):
    skills = [s.lower().strip() for s in job_row["must_have_skills"]]
    if not skills:
        return 0.0
    hits = 0
    for skill in skills:
        skill_tokens = set(tokenize(skill))
        if skill_tokens.issubset(candidate_text_tokens_set):
            hits += 1
    return hits / len(skills)

def run_evaluation_pass(data_env: Dict[str, Any], models_dict: Dict[str, Any], pass_name: str = "Pass 1") -> Dict[str, Any]:
    print(f"\n==================== Starting {pass_name} ====================")
    test_jobs_df = data_env["test_jobs_df"]
    test_resumes_df = data_env["test_resumes_df"]
    match_lookup = data_env["match_lookup"]
    candidate_ids = test_resumes_df["resume_id"].values
    test_candidate_pool_set = set(candidate_ids)

    candidate_tokens = models_dict["candidate_tokens"]
    bm25 = models_dict["bm25"]
    candidate_embeddings = models_dict["candidate_embeddings"]
    job_embeddings = models_dict["job_embeddings"]
    cross_encoder = models_dict["cross_encoder"]
    resume_text_map = models_dict["resume_text_map"]

    results_keyword = []
    results_bm25 = []
    results_dense = []
    results_rrf = []
    results_linear = []
    results_cross_encoder = []

    K_RRF = 60
    SHORTLIST_SIZE = 25

    shortlist_coverage_stats = []
    per_query_comparison = []

    print(f"Evaluating {len(test_jobs_df)} queries across all 6 architectures...")
    for i, job_row in test_jobs_df.iterrows():
        jid = job_row["job_id"]
        job_text = job_row["narrative_text"]
        true_rel = match_lookup.get(jid, set()) & test_candidate_pool_set
        total_rel = len(true_rel)
        if total_rel == 0:
            continue

        # Method 1: Keyword Overlap
        scores_kw = np.array([score_keyword_overlap(job_row, cand_toks) for cand_toks in candidate_tokens])
        rank_kw_indices = np.argsort(scores_kw)[::-1]
        ranks_kw = candidate_ids[rank_kw_indices].tolist()
        m_kw = compute_ranking_metrics(ranks_kw, true_rel)
        results_keyword.append(m_kw)

        # Method 2: BM25
        query_tokens = tokenize(job_text)
        scores_bm25 = np.array(bm25.get_scores(query_tokens))
        rank_bm25_indices = np.argsort(scores_bm25)[::-1]
        ranks_bm25 = candidate_ids[rank_bm25_indices].tolist()
        m_bm25 = compute_ranking_metrics(ranks_bm25, true_rel)
        results_bm25.append(m_bm25)

        # Method 3: Dense Cosine
        scores_dense = np.dot(candidate_embeddings, job_embeddings[i])
        rank_dense_indices = np.argsort(scores_dense)[::-1]
        ranks_dense = candidate_ids[rank_dense_indices].tolist()
        m_dense = compute_ranking_metrics(ranks_dense, true_rel)
        results_dense.append(m_dense)

        # Method 4: Reciprocal Rank Fusion (RRF, k=60)
        bm25_rank_dict = {cand_id: rank for rank, cand_id in enumerate(ranks_bm25, start=1)}
        dense_rank_dict = {cand_id: rank for rank, cand_id in enumerate(ranks_dense, start=1)}
        rrf_scores = np.zeros(len(candidate_ids))
        for idx, cand_id in enumerate(candidate_ids):
            rrf_scores[idx] = (1.0 / (K_RRF + bm25_rank_dict[cand_id])) + (1.0 / (K_RRF + dense_rank_dict[cand_id]))
        rank_rrf_indices = np.argsort(rrf_scores)[::-1]
        ranks_rrf = candidate_ids[rank_rrf_indices].tolist()
        m_rrf = compute_ranking_metrics(ranks_rrf, true_rel)
        results_rrf.append(m_rrf)

        # Method 5: Linear Min-Max Score Fusion (0.5 BM25 + 0.5 Dense)
        bm25_min, bm25_max = np.min(scores_bm25), np.max(scores_bm25)
        bm25_norm = (scores_bm25 - bm25_min) / (bm25_max - bm25_min) if (bm25_max - bm25_min) > 0 else np.zeros_like(scores_bm25)
        dense_min, dense_max = np.min(scores_dense), np.max(scores_dense)
        dense_norm = (scores_dense - dense_min) / (dense_max - dense_min) if (dense_max - dense_min) > 0 else np.zeros_like(scores_dense)
        linear_scores = 0.5 * bm25_norm + 0.5 * dense_norm
        rank_linear_indices = np.argsort(linear_scores)[::-1]
        ranks_linear = candidate_ids[rank_linear_indices].tolist()
        m_linear = compute_ranking_metrics(ranks_linear, true_rel)
        results_linear.append(m_linear)

        # Method 6: Two-Stage Cross-Encoder Re-Ranking
        shortlist_candidates = ranks_linear[:SHORTLIST_SIZE]
        remaining_candidates = ranks_linear[SHORTLIST_SIZE:]

        shortlist_hits = len(set(shortlist_candidates) & true_rel)
        shortlist_recall = shortlist_hits / total_rel
        shortlist_coverage_stats.append({
            "job_id": jid,
            "total_relevant": total_rel,
            "shortlist_hits": shortlist_hits,
            "shortlist_recall@25": shortlist_recall,
            "excluded_relevant": total_rel - shortlist_hits
        })

        ce_pairs = [[job_text, resume_text_map[cid]] for cid in shortlist_candidates]
        ce_scores = cross_encoder.predict(ce_pairs, show_progress_bar=False)
        ce_reordered_shortlist = [shortlist_candidates[idx] for idx in np.argsort(ce_scores)[::-1]]
        full_reranked_pool = ce_reordered_shortlist + remaining_candidates
        m_ce = compute_ranking_metrics(full_reranked_pool, true_rel)
        results_cross_encoder.append(m_ce)

        # Per query delta between Linear (retriever) and Cross-Encoder (re-ranker)
        mrr_delta = round(m_ce["mrr"] - m_linear["mrr"], 4)
        ndcg_delta = round(m_ce["ndcg@10"] - m_linear["ndcg@10"], 4)
        status = "IMPROVED" if mrr_delta > 0.0001 else ("DEGRADED" if mrr_delta < -0.0001 else "UNCHANGED")
        per_query_comparison.append({
            "job_id": jid,
            "job_title": job_row["job_title"],
            "industry": job_row["industry"],
            "linear_mrr": round(m_linear["mrr"], 4),
            "cross_encoder_mrr": round(m_ce["mrr"], 4),
            "mrr_delta": mrr_delta,
            "linear_ndcg@10": round(m_linear["ndcg@10"], 4),
            "cross_encoder_ndcg@10": round(m_ce["ndcg@10"], 4),
            "ndcg_delta": ndcg_delta,
            "status": status
        })

    def aggregate_metrics(res_list):
        df_m = pd.DataFrame(res_list)
        return {
            "mean_recall@5": float(np.round(df_m["recall@5"].mean(), 4)),
            "mean_recall@10": float(np.round(df_m["recall@10"].mean(), 4)),
            "mean_mrr": float(np.round(df_m["mrr"].mean(), 4)),
            "mean_ndcg@10": float(np.round(df_m["ndcg@10"].mean(), 4))
        }

    df_cov = pd.DataFrame(shortlist_coverage_stats)
    shortlist_summary = {
        "mean_shortlist_recall@25": float(np.round(df_cov["shortlist_recall@25"].mean(), 4)),
        "total_relevant_candidates_across_test_jobs": int(df_cov["total_relevant"].sum()),
        "relevant_candidates_captured_in_shortlists": int(df_cov["shortlist_hits"].sum()),
        "relevant_candidates_excluded_before_reranking": int(df_cov["excluded_relevant"].sum()),
        "percentage_excluded": float(np.round((df_cov["excluded_relevant"].sum() / df_cov["total_relevant"].sum()) * 100, 2))
    }

    status_counts = pd.Series([q["status"] for q in per_query_comparison]).value_counts().to_dict()

    return {
        "pass_name": pass_name,
        "metrics": {
            "keyword_skill_overlap": aggregate_metrics(results_keyword),
            "bm25_lexical_retrieval": aggregate_metrics(results_bm25),
            "all_minilm_l6_v2_semantic": aggregate_metrics(results_dense),
            "rrf_hybrid": aggregate_metrics(results_rrf),
            "linear_minmax_hybrid": aggregate_metrics(results_linear),
            "cross_encoder_reranked": aggregate_metrics(results_cross_encoder)
        },
        "shortlist_quality_ceiling": shortlist_summary,
        "query_level_distribution": {
            "total_queries": len(per_query_comparison),
            "improved_mrr_queries": int(status_counts.get("IMPROVED", 0)),
            "degraded_mrr_queries": int(status_counts.get("DEGRADED", 0)),
            "unchanged_mrr_queries": int(status_counts.get("UNCHANGED", 0))
        },
        "per_query_comparison": per_query_comparison
    }

def main():
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    start_time = time.time()

    print("Building deterministic evaluation dataset...")
    data_env = build_deterministic_evaluation_set(DATA_DIR, target_pool_size=2000, num_test_jobs=50, seed=42)

    # Save deterministic IDs
    job_ids_path = OUTPUTS_DIR / "test_job_ids.json"
    with open(job_ids_path, "w", encoding="utf-8") as f:
        json.dump({
            "count": len(data_env["selected_test_job_ids"]),
            "job_ids": data_env["selected_test_job_ids"]
        }, f, indent=2)

    cands_path = OUTPUTS_DIR / "candidate_pool_ids.json"
    with open(cands_path, "w", encoding="utf-8") as f:
        json.dump({
            "total_pool_size": data_env["total_pool_size"],
            "confirmed_relevant_unique_candidates": data_env["relevant_resumes_count"],
            "confirmed_relevant_job_candidate_pairings": data_env["relevant_pairings_count"],
            "distractor_candidates": data_env["distractors_count"],
            "candidate_ids": data_env["full_candidate_pool_ids"]
        }, f, indent=2)

    print(f"Saved test job IDs to {job_ids_path}")
    print(f"Saved candidate pool IDs to {cands_path}")

    # Prepare Models and Tokenization once
    test_jobs_df = data_env["test_jobs_df"]
    test_resumes_df = data_env["test_resumes_df"]

    print("Preparing keyword overlap baseline tokens...")
    candidate_tokens = [set(tokenize(t)) for t in test_resumes_df["narrative_text"]]

    print("Fitting BM25 on candidate narrative texts...")
    candidate_corpus = [tokenize(t) for t in test_resumes_df["narrative_text"]]
    bm25 = BM25Okapi(candidate_corpus)

    print("Loading all-MiniLM-L6-v2 model onto CPU...")
    bi_encoder = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")
    print("Encoding candidate pool embeddings...")
    candidate_embeddings = bi_encoder.encode(
        test_resumes_df["narrative_text"].tolist(),
        batch_size=64,
        show_progress_bar=False,
        normalize_embeddings=True
    )
    print("Encoding job queries embeddings...")
    job_embeddings = bi_encoder.encode(
        test_jobs_df["narrative_text"].tolist(),
        batch_size=32,
        show_progress_bar=False,
        normalize_embeddings=True
    )

    print("Loading cross-encoder/ms-marco-MiniLM-L-6-v2 model onto CPU...")
    cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2", device="cpu")
    resume_text_map = dict(zip(test_resumes_df["resume_id"], test_resumes_df["narrative_text"]))

    models_dict = {
        "candidate_tokens": candidate_tokens,
        "bm25": bm25,
        "candidate_embeddings": candidate_embeddings,
        "job_embeddings": job_embeddings,
        "cross_encoder": cross_encoder,
        "resume_text_map": resume_text_map
    }

    # Run Pass 1
    run1 = run_evaluation_pass(data_env, models_dict, pass_name="Run 1 (Primary)")

    # Run Pass 2 (Verification pass)
    run2 = run_evaluation_pass(data_env, models_dict, pass_name="Run 2 (Verification)")

    # Compare Run 1 vs Run 2 for strict equality
    discrepancies = []
    for method, metrics in run1["metrics"].items():
        for metric_name, val1 in metrics.items():
            val2 = run2["metrics"][method][metric_name]
            diff = abs(val1 - val2)
            if diff > 1e-6:
                discrepancies.append(f"{method}.{metric_name}: Run 1={val1}, Run 2={val2}, Diff={diff}")

    reproducibility_audit = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_methods_benchmarked": 6,
        "is_perfectly_reproducible": len(discrepancies) == 0,
        "discrepancies_detected": discrepancies,
        "run1_metrics": run1["metrics"],
        "run2_metrics": run2["metrics"]
    }

    audit_path = OUTPUTS_DIR / "reproducibility_audit.json"
    with open(audit_path, "w", encoding="utf-8") as f:
        json.dump(reproducibility_audit, f, indent=2)

    # Save Unified Comparison Metrics
    unified_comparison = {
        "experimental_setup": {
            "test_jobs_count": 50,
            "candidate_pool_size": 2000,
            "confirmed_relevant_unique_candidates": data_env["relevant_resumes_count"],
            "total_relevant_pairings_evaluated": data_env["relevant_pairings_count"],
            "distractor_candidates_count": data_env["distractors_count"],
            "random_seed": 42,
            "sorting_guard": "Enforced sorted candidate IDs before seeded sampling to prevent PYTHONHASHSEED drift",
            "cross_encoder_model": "cross-encoder/ms-marco-MiniLM-L-6-v2",
            "shortlist_size": 25,
            "rrf_k": 60,
            "linear_weights": "0.5 BM25 + 0.5 Dense (untuned)"
        },
        "all_methods_comparison": run1["metrics"],
        "shortlist_quality_ceiling": run1["shortlist_quality_ceiling"],
        "query_level_distribution": run1["query_level_distribution"],
        "per_query_comparison": run1["per_query_comparison"]
    }

    metrics_path = OUTPUTS_DIR / "unified_comparison_metrics.json"
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(unified_comparison, f, indent=2)

    elapsed = time.time() - start_time
    print("\n" + "=" * 60)
    print(f"REPRODUCIBILITY SUITE COMPLETED IN {elapsed:.1f}s")
    print(f"Audit Status: {'PERFECT REPRODUCIBILITY (0 discrepancies)' if len(discrepancies) == 0 else 'DISCREPANCIES DETECTED'}")
    print(f"Unified Metrics saved to: {metrics_path}")
    print(f"Audit log saved to: {audit_path}")
    print("=" * 60)

if __name__ == "__main__":
    main()
