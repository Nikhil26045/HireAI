import os
import json
import re
from pathlib import Path
import numpy as np
import pandas as pd
from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer, CrossEncoder

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
OUTPUTS_DIR = BASE_DIR / "outputs"

def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z0-9+#.-]+", text.lower())

def run_cross_encoder_experiment():
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    
    print("=" * 60)
    print("STEP 1: Loading Data and Preparing Narrative Text")
    print("=" * 60)
    df_jobs = pd.read_parquet(DATA_DIR / "jobs_raw.parquet")
    df_resumes = pd.read_parquet(DATA_DIR / "resumes_raw.parquet")
    df_matches = pd.read_parquet(DATA_DIR / "matches_raw.parquet")
    
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
    # STEP 2: Reconstruct Exact Same 50 Test Jobs & 2,000 Pool
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print("STEP 2: Reconstructing Exact Test Set & 2,000 Candidate Pool (Seed 42)")
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
    
    print(f"Test candidate pool size: {len(test_resumes_df)} (100% of {num_test_matched} relevant resumes present)")
    print(f"Test job queries count: {len(test_jobs_df)}")
    
    candidate_ids = test_resumes_df["resume_id"].values
    resume_text_map = dict(zip(test_resumes_df["resume_id"], test_resumes_df["narrative_text"]))
    
    # -------------------------------------------------------------
    # STEP 3: Stage 1 First-Stage Retrieval (Linear Min-Max Hybrid)
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print("STEP 3: Running Stage 1 First-Stage Retrieval (Linear Min-Max Hybrid)")
    print("=" * 60)
    candidate_corpus = [tokenize(t) for t in test_resumes_df["narrative_text"]]
    bm25 = BM25Okapi(candidate_corpus)
    
    print("Loading all-MiniLM-L6-v2 for Stage 1 dense retrieval...")
    bi_encoder = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")
    
    candidate_embeddings = bi_encoder.encode(
        test_resumes_df["narrative_text"].tolist(),
        batch_size=64,
        show_progress_bar=False,
        normalize_embeddings=True
    )
    
    job_embeddings = bi_encoder.encode(
        test_jobs_df["narrative_text"].tolist(),
        batch_size=32,
        show_progress_bar=False,
        normalize_embeddings=True
    )
    
    # -------------------------------------------------------------
    # STEP 4: Load Cross-Encoder Model for Stage 2 Re-Ranking
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print("STEP 4: Loading Cross-Encoder: cross-encoder/ms-marco-MiniLM-L-6-v2")
    print("=" * 60)
    cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2", device="cpu")
    
    # -------------------------------------------------------------
    # STEP 5: Metric Helper
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
            
        mrr = 0.0
        for rank_idx, cand_id in enumerate(ranks_list, start=1):
            if cand_id in relevant_set:
                mrr = 1.0 / rank_idx
                break
        metrics["mrr"] = mrr
        
        dcg = 0.0
        for rank_idx, cand_id in enumerate(ranks_list[:10], start=1):
            rel = 1 if cand_id in relevant_set else 0
            dcg += (2**rel - 1) / np.log2(rank_idx + 1)
        idcg = sum((2**1 - 1) / np.log2(i + 1) for i in range(1, min(10, total_rel_in_pool) + 1))
        metrics["ndcg@10"] = dcg / idcg if idcg > 0 else 0.0
        
        return metrics

    # -------------------------------------------------------------
    # STEP 6: Execute Re-Ranking & Per-Query Comparison
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print("STEP 6: Re-Ranking Top 25 Shortlists with Cross-Encoder")
    print("=" * 60)
    
    SHORTLIST_SIZE = 25
    
    stage1_hybrid_metrics = []
    stage2_rerank_metrics = []
    
    shortlist_coverage_stats = []
    per_query_analysis = []
    
    for i, job_row in test_jobs_df.iterrows():
        jid = job_row["job_id"]
        job_text = job_row["narrative_text"]
        true_rel = match_lookup.get(jid, set()) & test_candidate_pool_set
        total_rel = len(true_rel)
        if total_rel == 0:
            continue
            
        # 1. Stage 1 Scores (Linear Min-Max Hybrid)
        query_tokens = tokenize(job_text)
        scores_bm25 = bm25.get_scores(query_tokens)
        bm25_min, bm25_max = np.min(scores_bm25), np.max(scores_bm25)
        bm25_norm = (scores_bm25 - bm25_min) / (bm25_max - bm25_min) if (bm25_max - bm25_min) > 0 else np.zeros_like(scores_bm25)
        
        scores_dense = np.dot(candidate_embeddings, job_embeddings[i])
        dense_min, dense_max = np.min(scores_dense), np.max(scores_dense)
        dense_norm = (scores_dense - dense_min) / (dense_max - dense_min) if (dense_max - dense_min) > 0 else np.zeros_like(scores_dense)
        
        stage1_scores = 0.5 * bm25_norm + 0.5 * dense_norm
        stage1_sorted_indices = np.argsort(stage1_scores)[::-1]
        stage1_ranks = candidate_ids[stage1_sorted_indices].tolist()
        
        m_stage1 = compute_ranking_metrics(stage1_ranks, true_rel)
        stage1_hybrid_metrics.append(m_stage1)
        
        # 2. Extract Top-25 Shortlist
        shortlist_candidates = stage1_ranks[:SHORTLIST_SIZE]
        remaining_candidates = stage1_ranks[SHORTLIST_SIZE:]
        
        # Check shortlist recall ceiling
        shortlist_hits = len(set(shortlist_candidates) & true_rel)
        shortlist_recall = shortlist_hits / total_rel if total_rel > 0 else 0.0
        shortlist_coverage_stats.append({
            "job_id": jid,
            "total_relevant": total_rel,
            "shortlist_hits": shortlist_hits,
            "shortlist_recall@25": shortlist_recall,
            "excluded_relevant": total_rel - shortlist_hits
        })
        
        # 3. Cross-Encoder Re-Ranking of Shortlist
        # Pair format: [[job_text, resume_text], ...]
        ce_pairs = [[job_text, resume_text_map[cid]] for cid in shortlist_candidates]
        ce_scores = cross_encoder.predict(ce_pairs, show_progress_bar=False)
        
        ce_sorted_sub_indices = np.argsort(ce_scores)[::-1]
        reranked_shortlist = [shortlist_candidates[idx] for idx in ce_sorted_sub_indices]
        
        # Recombine: Re-ranked top 25 + unranked tail (26 to 2,000)
        final_ranks = reranked_shortlist + remaining_candidates
        
        m_stage2 = compute_ranking_metrics(final_ranks, true_rel)
        stage2_rerank_metrics.append(m_stage2)
        
        # Per-query comparison
        mrr_diff = m_stage2["mrr"] - m_stage1["mrr"]
        ndcg_diff = m_stage2["ndcg@10"] - m_stage1["ndcg@10"]
        per_query_analysis.append({
            "job_id": jid,
            "job_title": job_row["job_title"],
            "industry": job_row["industry"],
            "stage1_mrr": round(m_stage1["mrr"], 4),
            "stage2_mrr": round(m_stage2["mrr"], 4),
            "mrr_delta": round(mrr_diff, 4),
            "stage1_ndcg@10": round(m_stage1["ndcg@10"], 4),
            "stage2_ndcg@10": round(m_stage2["ndcg@10"], 4),
            "ndcg_delta": round(ndcg_diff, 4),
            "status": "IMPROVED" if mrr_diff > 0.0001 else ("DEGRADED" if mrr_diff < -0.0001 else "UNCHANGED")
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
    mean_shortlist_recall = float(np.round(df_cov["shortlist_recall@25"].mean(), 4))
    total_excluded = int(df_cov["excluded_relevant"].sum())
    total_relevant_all = int(df_cov["total_relevant"].sum())
    
    # Count per-query categories
    improved_count = sum(1 for q in per_query_analysis if q["status"] == "IMPROVED")
    degraded_count = sum(1 for q in per_query_analysis if q["status"] == "DEGRADED")
    unchanged_count = sum(1 for q in per_query_analysis if q["status"] == "UNCHANGED")
    
    results_payload = {
        "experimental_configuration": {
            "cross_encoder_model": "cross-encoder/ms-marco-MiniLM-L-6-v2",
            "first_stage_retriever": "Linear Min-Max Hybrid (0.5 BM25 + 0.5 all-MiniLM-L6-v2)",
            "shortlist_size": SHORTLIST_SIZE,
            "test_jobs_count": len(test_jobs_df),
            "candidate_pool_size": len(test_resumes_df),
            "random_seed": 42
        },
        "shortlist_quality_ceiling": {
            "mean_shortlist_recall@25": mean_shortlist_recall,
            "total_relevant_candidates_across_test_jobs": total_relevant_all,
            "relevant_candidates_captured_in_shortlists": int(df_cov["shortlist_hits"].sum()),
            "relevant_candidates_excluded_before_reranking": total_excluded,
            "percentage_excluded": float(np.round((total_excluded / total_relevant_all) * 100, 2))
        },
        "aggregate_comparison": {
            "stage1_linear_hybrid": aggregate_metrics(stage1_hybrid_metrics),
            "stage2_cross_encoder_reranked": aggregate_metrics(stage2_rerank_metrics)
        },
        "query_level_distribution": {
            "total_queries": len(per_query_analysis),
            "improved_mrr_queries": improved_count,
            "degraded_mrr_queries": degraded_count,
            "unchanged_mrr_queries": unchanged_count
        },
        "per_query_breakdown": per_query_analysis
    }
    
    output_path = OUTPUTS_DIR / "cross_encoder_comparison_metrics.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results_payload, f, indent=2)
        
    print("\n" + "=" * 60)
    print("CROSS-ENCODER EXPERIMENT COMPLETED")
    print("=" * 60)
    print(f"Shortlist Size: Top {SHORTLIST_SIZE}")
    print(f"Mean Shortlist Recall@25: {mean_shortlist_recall}")
    print(f"Total Relevant Excluded Before Re-ranking: {total_excluded} of {total_relevant_all} ({results_payload['shortlist_quality_ceiling']['percentage_excluded']}%)")
    print(f"\nStage 1 Hybrid (No Re-ranking): {results_payload['aggregate_comparison']['stage1_linear_hybrid']}")
    print(f"Stage 2 Cross-Encoder Re-ranked: {results_payload['aggregate_comparison']['stage2_cross_encoder_reranked']}")
    print(f"\nQuery-level outcomes (MRR): {improved_count} Improved, {degraded_count} Degraded, {unchanged_count} Unchanged")
    print(f"Saved results to: {output_path}")

if __name__ == "__main__":
    run_cross_encoder_experiment()

