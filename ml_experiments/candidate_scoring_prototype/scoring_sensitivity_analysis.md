# Candidate Scoring Model – Sensitivity Analysis Report

**Project Title:** HireAI — AI-Based Candidate Evaluation System  
**Assigned Responsibility:** Member 3 – Candidate Scoring Model  
**Artifact Scope:** Sensitivity Analysis and Perturbation Study of the Preliminary Candidate Scoring Prototype  
**Status:** Standalone Analysis of Rule-Based Prototype (**Strictly Isolated**; Illustrative Heuristic Weights)

---

## 1. Executive Summary & Objective

The objective of this sensitivity analysis is to evaluate the deterministic response of the **HireAI Candidate Scoring Model Prototype** when input features are systematically perturbed. Specifically, we examine the gradient and magnitude of change in both **category-wise scores** ($0–100$) and the **overall candidate score** ($0–100$) when exactly one feature is varied while holding all other candidate features strictly constant.

### Prototype Architecture Recap

The prototype computes scores using a two-tier linear formulation:
- **Resume Score ($35\%$ overall weight):** $S_{\text{resume}} = 100 \times (0.45 \cdot f_{\text{skills}} + 0.40 \cdot f_{\text{exp}} + 0.15 \cdot f_{\text{edu}})$
- **Job Matching Score ($35\%$ overall weight):** $S_{\text{job}} = 100 \times (0.40 \cdot f_{\text{req}} + 0.20 \cdot (1 - f_{\text{missing}}) + 0.40 \cdot f_{\text{jd\_rel}})$
- **Interview Score ($30\%$ overall weight):** $S_{\text{interview}} = 100 \times (0.65 \cdot f_{\text{ans\_rel}} + 0.35 \cdot f_{\text{comm}})$
- **Overall Score:** $S_{\text{overall}} = 0.35 \cdot S_{\text{resume}} + 0.35 \cdot S_{\text{job}} + 0.30 \cdot S_{\text{interview}}$

Because the prototype uses an additive linear aggregation function, the theoretical marginal sensitivity of any feature $x_i$ on the overall score is given by:
$$\frac{\partial S_{\text{overall}}}{\partial x_i} = 100 \times W_{\text{category}} \times w_{\text{feature}}$$

---

## 2. Baseline Candidate Specification

To perform realistic perturbations, we adopt **Synthetic Candidate Beta (`SYNTH-CAND-002`)** from `sample_candidates.json` as the baseline. Candidate Beta represents a moderate, balanced applicant profile with room for both upward and downward perturbation across all dimensions.

### Baseline Candidate Profile (`SYNTH-CAND-002`)
- `skills_relevance`: $0.70$
- `relevant_experience`: $0.60$
- `education_relevance`: $0.75$
- `required_skills_matched`: $0.65$
- `missing_required_skills`: $0.35$ (Derived retention: $1.0 - 0.35 = 0.65$)
- `overall_jd_relevance`: $0.68$
- `interview_answer_relevance`: $0.78$
- `communication_assessment`: $0.82$

### Baseline Computed Scores
- **Resume Score:** $66.75$ / $100$
- **Job Matching Score:** $66.20$ / $100$
- **Interview Score:** $79.40$ / $100$
- **Overall Candidate Score:** **$70.36$** / $100$

---

## 3. Sensitivity Experiments and Perturbation Results

In each experiment below, exactly one feature was modified from its baseline value, executed through `score_candidate()`, and compared directly against the baseline.

### 3.1 Experiment 1: Perturbing Skills Relevance (`skills_relevance`)

Category: **Resume** ($W = 0.35$) | Sub-weight: $0.45$ | Baseline Value: $0.70$

| Scenario | Feature Value ($\Delta$) | Resume Score | $\Delta$ Resume | Overall Score | $\Delta$ Overall | Theoretical $\Delta$ Overall |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Decrease (-0.30)** | $0.40$ ($-0.30$) | $53.25$ | $-13.50$ | $65.63$ | $-4.73$ | $-4.725$ |
| **Baseline** | **$0.70$ ($0.00$)** | **$66.75$** | **$0.00$** | **$70.36$** | **$0.00$** | **$0.00$** |
| **Increase (+0.25)** | $0.95$ ($+0.25$) | $78.00$ | $+11.25$ | $74.30$ | $+3.94$ | $+3.9375$ |

**Explanation:**  
- A $\pm 0.10$ change in `skills_relevance` shifts the Resume score by $\pm 4.50$ points and the Overall score by $\pm 1.575$ points ($100 \times 0.35 \times 0.45 = 15.75$ points per unit change).
- Increasing `skills_relevance` to $0.95$ lifts the candidate from $70.36$ to $74.30$. Conversely, dropping to $0.40$ pulls the candidate down to $65.63$.

---

### 3.2 Experiment 2: Perturbing Relevant Experience (`relevant_experience`)

Category: **Resume** ($W = 0.35$) | Sub-weight: $0.40$ | Baseline Value: $0.60$

| Scenario | Feature Value ($\Delta$) | Resume Score | $\Delta$ Resume | Overall Score | $\Delta$ Overall | Theoretical $\Delta$ Overall |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Decrease (-0.40)** | $0.20$ ($-0.40$) | $50.75$ | $-16.00$ | $64.76$ | $-5.60$ | $-5.60$ |
| **Baseline** | **$0.60$ ($0.00$)** | **$66.75$** | **$0.00$** | **$70.36$** | **$0.00$** | **$0.00$** |
| **Increase (+0.35)** | $0.95$ ($+0.35$) | $80.75$ | $+14.00$ | $75.26$ | $+4.90$ | $+4.90$ |

**Explanation:**  
- A unit change in `relevant_experience` translates to a $14.00$ point shift in the overall score ($100 \times 0.35 \times 0.40 = 14.00$).
- A significant deficit in experience (dropping from $0.60$ to $0.20$) reduces the resume score by $16.00$ points and overall score by $5.60$ points, demonstrating that experience carries substantial weight in candidate filtering.

---

### 3.3 Experiment 3: Perturbing Required Skills Matched (`required_skills_matched`)

Category: **Job Matching** ($W = 0.35$) | Sub-weight: $0.40$ | Baseline Value: $0.65$

| Scenario | Feature Value ($\Delta$) | Job Matching Score | $\Delta$ Job Score | Overall Score | $\Delta$ Overall | Theoretical $\Delta$ Overall |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Decrease (-0.35)** | $0.30$ ($-0.35$) | $52.20$ | $-14.00$ | $65.46$ | $-4.90$ | $-4.90$ |
| **Baseline** | **$0.65$ ($0.00$)** | **$66.20$** | **$0.00$** | **$70.36$** | **$0.00$** | **$0.00$** |
| **Increase (+0.30)** | $0.95$ ($+0.30$) | $78.20$ | $+12.00$ | $74.56$ | $+4.20$ | $+4.20$ |

**Explanation:**  
- With an effective overall weight of $14.00\%$ ($0.35 \times 0.40$), `required_skills_matched` has an identical sensitivity factor to `relevant_experience`.
- A candidate who matches $95\%$ of required skills sees their Job Matching score climb to $78.20$ and Overall score increase by $+4.20$ points.

---

### 3.4 Experiment 4: Perturbing Job Description Relevance (`overall_jd_relevance`)

Category: **Job Matching** ($W = 0.35$) | Sub-weight: $0.40$ | Baseline Value: $0.68$

| Scenario | Feature Value ($\Delta$) | Job Matching Score | $\Delta$ Job Score | Overall Score | $\Delta$ Overall | Theoretical $\Delta$ Overall |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Decrease (-0.38)** | $0.30$ ($-0.38$) | $51.00$ | $-15.20$ | $65.04$ | $-5.32$ | $-5.32$ |
| **Baseline** | **$0.68$ ($0.00$)** | **$66.20$** | **$0.00$** | **$70.36$** | **$0.00$** | **$0.00$** |
| **Increase (+0.27)** | $0.95$ ($+0.27$) | $77.00$ | $+10.80$ | $74.14$ | $+3.78$ | $+3.78$ |

**Explanation:**  
- `overall_jd_relevance` (representing dense semantic similarity between resume and job description) shifts the Job Matching score by $4.00$ points for every $0.10$ change and the Overall score by $1.40$ points.
- Dropping semantic relevance to $0.30$ decreases the overall score by $5.32$ points.

---

### 3.5 Experiment 5: Perturbing Interview Answer Relevance (`interview_answer_relevance`)

Category: **Interview** ($W = 0.30$) | Sub-weight: $0.65$ | Baseline Value: $0.78$

| Scenario | Feature Value ($\Delta$) | Interview Score | $\Delta$ Interview | Overall Score | $\Delta$ Overall | Theoretical $\Delta$ Overall |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Decrease (-0.38)** | $0.40$ ($-0.38$) | $54.70$ | $-24.70$ | $62.95$ | $-7.41$ | $-7.41$ |
| **Baseline** | **$0.78$ ($0.00$)** | **$79.40$** | **$0.00$** | **$70.36$** | **$0.00$** | **$0.00$** |
| **Increase (+0.20)** | $0.98$ ($+0.20$) | $92.40$ | $+13.00$ | $74.26$ | $+3.90$ | $+3.90$ |

**Explanation:**  
- `interview_answer_relevance` has the highest individual sub-weight ($0.65$) within its category, resulting in an effective overall weight of $19.50\%$ ($100 \times 0.30 \times 0.65 = 19.50$).
- Consequently, it is the **most sensitive single feature** in the entire prototype.
- When an applicant performs poorly in the interview (dropping answer relevance to $0.40$), the overall candidate score drops sharply by $-7.41$ points (from $70.36$ to $62.95$).

---

### 3.6 Experiment 6: Perturbing Communication Assessment (`communication_assessment`)

Category: **Interview** ($W = 0.30$) | Sub-weight: $0.35$ | Baseline Value: $0.82$

| Scenario | Feature Value ($\Delta$) | Interview Score | $\Delta$ Interview | Overall Score | $\Delta$ Overall | Theoretical $\Delta$ Overall |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Decrease (-0.42)** | $0.40$ ($-0.42$) | $64.70$ | $-14.70$ | $65.95$ | $-4.41$ | $-4.41$ |
| **Baseline** | **$0.82$ ($0.00$)** | **$79.40$** | **$0.00$** | **$70.36$** | **$0.00$** | **$0.00$** |
| **Increase (+0.16)** | $0.98$ ($+0.16$) | $85.00$ | $+5.60$ | $72.04$ | $+1.68$ | $+1.68$ |

**Explanation:**  
- `communication_assessment` carries an effective overall weight of $10.50\%$ ($100 \times 0.30 \times 0.35 = 10.50$).
- Perturbing communication from $0.82$ down to $0.40$ reduces the interview score by $14.70$ points and overall score by $4.41$ points.

---

## 4. Comprehensive Sensitivity Summary & Ranking

The table below ranks all features by their **effective sensitivity gradient** on the overall candidate score:

| Rank | Feature Name | Category | Category Weight | Sub-Weight | Effective Overall Weight | Score Impact per $\Delta = 0.10$ |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| **1** | `interview_answer_relevance` | Interview | $30\%$ | $0.65$ | **$19.50\%$** | $\pm 1.95$ pts |
| **2** | `skills_relevance` | Resume | $35\%$ | $0.45$ | **$15.75\%$** | $\pm 1.575$ pts |
| **3** | `relevant_experience` | Resume | $35\%$ | $0.40$ | **$14.00\%$** | $\pm 1.40$ pts |
| **4** | `required_skills_matched` | Job Matching | $35\%$ | $0.40$ | **$14.00\%$** | $\pm 1.40$ pts |
| **5** | `overall_jd_relevance` | Job Matching | $35\%$ | $0.40$ | **$14.00\%$** | $\pm 1.40$ pts |
| **6** | `communication_assessment` | Interview | $30\%$ | $0.35$ | **$10.50\%$** | $\pm 1.05$ pts |
| **7** | `missing_required_skills` (Inverted) | Job Matching | $35\%$ | $0.20$ | **$7.00\%$** | $\mp 0.70$ pts |
| **8** | `education_relevance` | Resume | $35\%$ | $0.15$ | **$5.25\%$** | $\pm 0.525$ pts |
| **Total** | | | | | **$100.00\%$** | |

### Key Observations:
1. **Interview Dominance via Answer Relevance:** Although the interview category as a whole is assigned $30\%$ of the overall weight (lower than Resume or Job Matching at $35\%$), `interview_answer_relevance` is the single most influential feature in the entire system ($19.50\%$ effective weight) due to its high intra-category concentration ($0.65$).
2. **Balanced Core Triad:** `skills_relevance` ($15.75\%$), `relevant_experience` ($14.00\%$), and `required_skills_matched` ($14.00\%$) form a balanced core evaluating candidate competence and fit.
3. **Education Buffer:** `education_relevance` has the lowest effective weight ($5.25\%$). This prevents candidates from being unduly eliminated solely due to non-traditional academic backgrounds, which aligns with modern technical recruitment practices.
4. **Strict Linearity and Predictability:** Because the prototype functions as a linear combination, there are no unexpected non-linear cliffs, saturation regions, or threshold discontinuities within the valid $[0.0, 1.0]$ range.

---

## 5. Automated Functional Testing Summary

To ensure robustness, repeatability, and safety across boundary and edge conditions, the automated test suite in `test_scoring_prototype.py` was executed independently using Python's built-in `unittest` runner:

```bash
python -m unittest -v test_scoring_prototype
```

### Test Suite Results:
- **Total Tests Executed:** 17
- **Passed:** 17
- **Failed:** 0
- **Errors:** 0
- **Status:** **100% PASS**

### Test Coverage Breakdown (17 Test Cases):
1. **Normal Input Processing:**
   - `test_normal_input_produces_all_scores_and_breakdown`: Validates that valid candidate data produces complete output schema (overall score, category scores, feature breakdowns, and empty fallback lists).
2. **Score Range Boundaries:**
   - `test_all_scores_within_0_to_100_range`: Verifies that category scores and overall scores remain strictly within $[0.0, 100.0]$.
3. **Overall Score Calculation & Weight Normalization:**
   - `test_overall_score_calculation_weights`: Confirms that the overall score equals $0.35 \cdot S_{\text{resume}} + 0.35 \cdot S_{\text{job}} + 0.30 \cdot S_{\text{interview}}$.
   - `test_category_weights_sum_to_one`: Asserts that `CATEGORY_WEIGHTS` sum to $1.0$.
   - `test_subfeature_weights_sum_to_one`: Asserts that each sub-feature category weight dictionary sums to $1.0$.
4. **Category-Wise Mathematical Verification:**
   - `test_resume_score_calculation`: Evaluates $100 \times (0.45 \cdot \text{skills} + 0.40 \cdot \text{exp} + 0.15 \cdot \text{edu})$.
   - `test_job_matching_score_calculation`: Evaluates $100 \times (0.40 \cdot \text{req} + 0.20 \cdot (1 - \text{missing}) + 0.40 \cdot \text{jd\_rel})$.
   - `test_interview_score_calculation`: Evaluates $100 \times (0.65 \cdot \text{ans\_rel} + 0.35 \cdot \text{comm})$.
5. **Missing Values & Fallbacks:**
   - `test_missing_features_use_defaults`: Verifies `None` inputs adopt defined fallback values and are recorded in `fallbacks_applied`.
   - `test_completely_empty_candidate`: Verifies that a candidate with no feature fields provided generates deterministic fallback scores without runtime exceptions.
6. **Boundary Values:**
   - `test_minimum_boundary_values`: Evaluates minimum possible inputs (all $0.0$, missing required skills $= 1.0$) yielding clean $0.0$ scores.
   - `test_maximum_boundary_values`: Evaluates maximum possible inputs (all $1.0$, missing required skills $= 0.0$) yielding clean $100.0$ scores.
7. **Invalid & Malformed Values:**
   - `test_negative_values_clamped_to_min`: Validates clamping for negative values ($< 0.0 \rightarrow 0.0$).
   - `test_exceeded_values_clamped_to_max`: Validates clamping for excessive values ($> 1.0 \rightarrow 1.0$).
   - `test_non_numeric_and_malformed_types`: Tests handling of invalid strings, nested lists, and dicts.
   - `test_numeric_strings_converted_properly`: Tests automatic string-to-float conversion (e.g., `"0.85"` $\rightarrow 0.85$).
   - `test_nan_and_infinity_handling`: Tests `float('nan')`, `float('inf')`, and `float('-inf')` triggering fallback logic.

---

## 6. Limitations & Future Model Calibration

1. **Lack of Interaction Effects:** In practical recruitment, hard prerequisite constraints exist (e.g., if a candidate has zero required skills, high communication should not rescue their candidacy). The linear additive formulation cannot model boolean or non-linear gating.
2. **Heuristic Weights vs. Learned Parameters:** The current weights reflect engineering design assumptions. Once validated candidate outcome data becomes available, these weights should be replaced with learned parameters from a calibrated scikit-learn model (such as Ridge Regression or an interpretable Generalized Additive Model).
