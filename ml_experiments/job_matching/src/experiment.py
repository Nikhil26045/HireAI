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

def run_experiment():
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    
    print("=" * 60)
    print("STEP 1: Loading Data and Preparing Narrative Text")
    print("=" * 60)
    df_jobs = pd.read_parquet(DATA_DIR / "jobs_raw.parquet")
    df_resumes = pd.read_parquet(DATA_DIR / "resumes_raw.parquet")
    df_matches = pd.read_parquet(DATA_DIR / "matches_raw.parquet")
    
    # Narrative text representations (strictly NO structured skill lists in text)
    # Resume narrative: summary + experience bullets + education
    def build_resume_narrative(row):
        bullets = " ".join(row["experience_bullets"]) if hasattr(row["experience_bullets"], "__iter__") else str(row["experience_bullets"])
        return f"{row['role']}. {row['summary']} {bullets} Education: {row['education']}."
        
    # Job narrative: title + description + responsibilities + requirements
    def build_job_narrative(row):
        resp = " ".join(row["responsibilities"]) if hasattr(row["responsibilities"], "__iter__") else str(row["responsibilities"])
        reqs = " ".join(row["requirements"]) if hasattr(row["requirements"], "__iter__") else str(row["requirements"])
        return f"{row['job_title']} in {row['industry']}. {row['description']} Responsibilities: {resp} Requirements: {reqs}"
        
    df_resumes["narrative_text"] = df_resumes.apply(build_resume_narrative, axis=1)
    df_jobs["narrative_text"] = df_jobs.apply(build_job_narrative, axis=1)
    
    # Ground-truth match lookup: job_id -> set of matching resume_ids
    match_lookup = {}
    for _, row in df_matches.iterrows():
        match_lookup[row["job_id"]] = set(row["relevant_resume_ids"])
        
    # -------------------------------------------------------------
    # STEP 2: Zero-Leakage Disjoint Split
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print("STEP 2: Constructing Zero-Leakage Disjoint Train / Test Partition")
    print("=" * 60)
    # We select 50 Test Jobs.
    # To prevent any candidate from leaking, we find all candidates matched with test jobs,
    # and designate them to the test candidate pool.
    # All other candidates and jobs remain in the training/selection domain.
    np.random.seed(42)
    shuffled_job_ids = np.random.permutation(df_jobs["job_id"].unique())
    test_job_ids = set(shuffled_job_ids[:50])
    train_job_ids = set(shuffled_job_ids[50:])
    
    # Test candidate pool construction:
    # 1. Gather all candidates confirmed relevant for any of the 50 test jobs.
    test_matched_resumes = set()
    for jid in test_job_ids:
        test_matched_resumes.update(match_lookup.get(jid, set()))
        
    num_test_matched = len(test_matched_resumes)
    print(f"Total test jobs: {len(test_job_ids)}")
    print(f"Candidates confirmed relevant to test jobs: {num_test_matched}")
    
    # 2. To test retrieval at scale, we set a target candidate pool size (e.g. 2,000 candidates).
    # Because the relevant candidates alone total 1,385 (> 1,000), the pool must exceed 1,000
    # to retain 100% of relevant resumes.
    TARGET_POOL_SIZE = 2000
    all_resumes = set(df_resumes["resume_id"].unique())
    remaining_resumes = list(all_resumes - test_matched_resumes)
    np.random.shuffle(remaining_resumes)
    
    additional_needed = max(0, TARGET_POOL_SIZE - num_test_matched)
    test_candidate_pool_ids = list(test_matched_resumes) + remaining_resumes[:additional_needed]
    test_candidate_pool_set = set(test_candidate_pool_ids)
    
    # Filter test resumes and test jobs
    test_resumes_df = df_resumes[df_resumes["resume_id"].isin(test_candidate_pool_set)].reset_index(drop=True)
    test_jobs_df = df_jobs[df_jobs["job_id"].isin(test_job_ids)].reset_index(drop=True)
    
    print(f"Constructed test candidate pool size: {len(test_resumes_df)} (Retains 100% of the {num_test_matched} relevant candidates + {additional_needed} distractors)")
    print(f"Test job queries count: {len(test_jobs_df)}")
    
    # Verify disjointness
    assert len(test_job_ids & train_job_ids) == 0, "Leakage: job in both train and test!"
    
    # -------------------------------------------------------------
    # STEP 3: Model 1 - Keyword / Skill Overlap Baseline (HireAI Rule Proxy)
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print("STEP 3: Running Baseline 1 - Keyword / Skill Overlap")
    print("=" * 60)
    # Checks overlap between extracted words of job must_have_skills and candidate narrative text
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
        
    candidate_tokens = [set(tokenize(t)) for t in test_resumes_df["narrative_text"]]
    
    # -------------------------------------------------------------
    # STEP 4: Model 2 - BM25 Lexical Retrieval on Narrative Text
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print("STEP 4: Running Baseline 2 - BM25 Lexical Retrieval on Narrative Text")
    print("=" * 60)
    candidate_corpus = [tokenize(t) for t in test_resumes_df["narrative_text"]]
    bm25 = BM25Okapi(candidate_corpus)
    
    # -------------------------------------------------------------
    # STEP 5: Model 3 - Dense Semantic Retrieval (all-MiniLM-L6-v2)
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print("STEP 5: Running Baseline 3 - Dense Bi-Encoder (all-MiniLM-L6-v2)")
    print("=" * 60)
    print("Loading all-MiniLM-L6-v2 model onto CPU...")
    bi_encoder = SentenceTransformer("all-MiniLM-L6-v2", device="cpu")
    
    print("Encoding 1,000 candidate narrative texts...")
    candidate_embeddings = bi_encoder.encode(
        test_resumes_df["narrative_text"].tolist(),
        batch_size=64,
        show_progress_bar=False,
        normalize_embeddings=True
    )
    
    print("Encoding 50 job narrative texts...")
    job_embeddings = bi_encoder.encode(
        test_jobs_df["narrative_text"].tolist(),
        batch_size=32,
        show_progress_bar=False,
        normalize_embeddings=True
    )
    
    # -------------------------------------------------------------
    # STEP 6: Evaluation Metrics Calculation (Recall@K, MRR, NDCG@10)
    # -------------------------------------------------------------
    print("\n" + "=" * 60)
    print("STEP 6: Calculating Information Retrieval Metrics")
    print("=" * 60)
    
    def compute_ranking_metrics(ranks_list, relevant_set, k_vals=[5, 10]):
        metrics = {}
        total_rel_in_pool = len(relevant_set)
        if total_rel_in_pool == 0:
            return None
            
        for k in k_vals:
            top_k = ranks_list[:k]
            hits = len(set(top_k) & relevant_set)
            # Standard Recall@K: proportion of all known relevant candidates in pool retrieved in top K
            metrics[f"recall@{k}"] = hits / total_rel_in_pool if total_rel_in_pool > 0 else 0.0
            metrics[f"hits@{k}"] = hits
            
        # MRR: position of first relevant candidate
        mrr = 0.0
        for rank_idx, cand_id in enumerate(ranks_list, start=1):
            if cand_id in relevant_set:
                mrr = 1.0 / rank_idx
                break
        metrics["mrr"] = mrr
        
        # NDCG@10: binary relevance
        dcg = 0.0
        for rank_idx, cand_id in enumerate(ranks_list[:10], start=1):
            rel = 1 if cand_id in relevant_set else 0
            dcg += (2**rel - 1) / np.log2(rank_idx + 1)
        idcg = sum((2**1 - 1) / np.log2(i + 1) for i in range(1, min(10, total_rel_in_pool) + 1))
        metrics["ndcg@10"] = dcg / idcg if idcg > 0 else 0.0
        
        return metrics

    candidate_ids = test_resumes_df["resume_id"].values
    
    results_keyword = []
    results_bm25 = []
    results_semantic = []
    
    for i, job_row in test_jobs_df.iterrows():
        jid = job_row["job_id"]
        true_rel = match_lookup.get(jid, set()) & test_candidate_pool_set
        if not true_rel:
            continue
            
        # 1. Keyword Overlap
        scores_kw = [score_keyword_overlap(job_row, cand_tokens) for cand_tokens in candidate_tokens]
        # Sort indices descending
        rank_kw_indices = np.argsort(scores_kw)[::-1]
        ranks_kw = candidate_ids[rank_kw_indices].tolist()
        m_kw = compute_ranking_metrics(ranks_kw, true_rel)
        if m_kw: results_keyword.append(m_kw)
        
        # 2. BM25
        query_tokens = tokenize(job_row["narrative_text"])
        scores_bm25 = bm25.get_scores(query_tokens)
        rank_bm25_indices = np.argsort(scores_bm25)[::-1]
        ranks_bm25 = candidate_ids[rank_bm25_indices].tolist()
        m_bm25 = compute_ranking_metrics(ranks_bm25, true_rel)
        if m_bm25: results_bm25.append(m_bm25)
        
        # 3. Dense Bi-Encoder Cosine
        job_vec = job_embeddings[i]
        scores_dense = np.dot(candidate_embeddings, job_vec)
        rank_dense_indices = np.argsort(scores_dense)[::-1]
        ranks_dense = candidate_ids[rank_dense_indices].tolist()
        m_dense = compute_ranking_metrics(ranks_dense, true_rel)
        if m_dense: results_semantic.append(m_dense)
        
    def aggregate_metrics(res_list):
        df_m = pd.DataFrame(res_list)
        return {
            "mean_recall@5": float(np.round(df_m["recall@5"].mean(), 4)),
            "mean_recall@10": float(np.round(df_m["recall@10"].mean(), 4)),
            "mean_mrr": float(np.round(df_m["mrr"].mean(), 4)),
            "mean_ndcg@10": float(np.round(df_m["ndcg@10"].mean(), 4))
        }
        
    summary = {
        "evaluation_setup": {
            "test_jobs_count": len(test_jobs_df),
            "test_candidate_pool_size": len(test_resumes_df),
            "input_mode": "Strictly narrative text (resumes: summary + bullets; jobs: title + desc + responsibilities + reqs)",
            "leakage_controls": "Disjoint test jobs partition with isolated candidate pool"
        },
        "methods_comparison": {
            "keyword_skill_overlap": aggregate_metrics(results_keyword),
            "bm25_lexical_retrieval": aggregate_metrics(results_bm25),
            "all_minilm_l6_v2_semantic": aggregate_metrics(results_semantic)
        }
    }
    
    summary_path = OUTPUTS_DIR / "pilot_comparison_metrics.json"
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
        
    print("\n" + "=" * 60)
    print("FINAL PILOT COMPARISON RESULTS")
    print("=" * 60)
    for model_name, metrics in summary["methods_comparison"].items():
        print(f"\n{model_name.upper()}:")
        for k, v in metrics.items():
            print(f"  {k}: {v}")
            
    print(f"\nSaved full results to {summary_path}")

if __name__ == "__main__":
    run_experiment()

