
import re
from collections import Counter
from statistics import mean

from sqlalchemy.orm import Session, joinedload

from app.models.ai_evaluation import AIEvaluation
from app.models.application import Application
from app.models.candidate_score import CandidateScore
from app.models.interview_response import (
    InterviewResponse,
    ResponseStatus,
)
from app.models.interview_session import InterviewSession
from app.models.job import Job
from app.models.score_breakdown import ScoreBreakdown
from app.models.transcription import Transcription


MODEL_NAME = "hireai_rule_based_evaluator"
MODEL_VERSION = "1.0"

STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "is", "are", "was",
    "were", "be", "been", "being", "to", "of", "in", "on",
    "for", "with", "by", "as", "at", "it", "this", "that",
    "what", "why", "how", "when", "where", "which", "who",
    "you", "your", "we", "they", "their", "can", "could",
    "would", "should", "do", "does", "did", "have", "has",
    "had", "from", "about", "into", "using", "use",
}


def tokenize(text: str) -> list[str]:
    """Normalize text and return useful word tokens."""
    tokens = re.findall(r"[a-zA-Z][a-zA-Z0-9+#.-]*", text.lower())
    return [
        token for token in tokens
        if token not in STOPWORDS and len(token) > 1
    ]


def normalize_expected_topics(value) -> list[str]:
    """Support expected_topics stored as a list of strings or objects."""
    if not value:
        return []

    topics = []

    for item in value:
        if isinstance(item, str):
            topic = item.strip()
        elif isinstance(item, dict):
            topic = str(
                item.get("topic")
                or item.get("name")
                or item.get("keyword")
                or ""
            ).strip()
        else:
            continue

        if topic:
            topics.append(topic)

    return topics


def calculate_evaluation(
    question_text: str,
    answer_text: str,
    expected_topics: list[str] | None,
) -> dict:
    """
    Return transparent heuristic scores on a 0-100 scale.

    These are lexical/structural heuristics, not an assessment
    of factual correctness or a true semantic model.
    """
    answer = answer_text.strip()
    answer_tokens = tokenize(answer)
    answer_terms = set(answer_tokens)
    question_terms = set(tokenize(question_text))
    topics = normalize_expected_topics(expected_topics)

    # Relevance proxy: overlap between informative question terms
    # and answer terms.
    if question_terms:
        overlap = len(question_terms & answer_terms)
        relevance = min(100.0, 100.0 * overlap / len(question_terms))
    else:
        relevance = 0.0

    # Technical coverage proxy: expected topic keyword coverage.
    if topics:
        topic_scores = []

        for topic in topics:
            topic_terms = set(tokenize(topic))
            if not topic_terms:
                continue

            coverage = len(topic_terms & answer_terms) / len(topic_terms)
            topic_scores.append(coverage * 100.0)

        technical = mean(topic_scores) if topic_scores else 0.0
    else:
        # Without expected topics, technical correctness cannot be
        # assessed reliably. Keep this score explicitly unavailable.
        technical = None

    # Completeness proxy based on answer length and topic coverage.
    word_count = len(answer_tokens)

    if word_count == 0:
        completeness = 0.0
    else:
        length_score = min(100.0, word_count / 60.0 * 100.0)

        if topics and technical is not None:
            completeness = 0.60 * technical + 0.40 * length_score
        else:
            completeness = length_score

    # Basic structural proxy only; this does not assess spoken delivery,
    # pronunciation, grammar or confidence.
    sentences = [
        sentence.strip()
        for sentence in re.split(r"[.!?]+", answer)
        if sentence.strip()
    ]

    if word_count == 0:
        communication = 0.0
    else:
        sentence_score = min(100.0, len(sentences) * 20.0)
        structure_score = 100.0 if 5 <= word_count <= 250 else 60.0
        communication = 0.60 * sentence_score + 0.40 * structure_score

    # Do not silently treat missing technical data as a zero.
    weighted_scores = [(relevance, 0.25),
                       (completeness, 0.20),
                       (communication, 0.10)]

    if technical is not None:
        weighted_scores.append((technical, 0.45))

    weight_total = sum(weight for _, weight in weighted_scores)
    overall = sum(
        score * weight for score, weight in weighted_scores
    ) / weight_total

    if not topics:
        feedback = (
            "No expected topics were configured for this question. "
            "The technical score is unavailable; the overall score "
            "uses relevance, answer length and basic structure only. "
            "These heuristic scores do not establish factual accuracy."
        )
    else:
        matched_topics = [
            topic for topic in topics
            if set(tokenize(topic)) & answer_terms
        ]
        missing_topics = [
            topic for topic in topics
            if topic not in matched_topics
        ]

        feedback_parts = [
            f"Expected topics mentioned: {len(matched_topics)} of {len(topics)}."
        ]

        if matched_topics:
            feedback_parts.append(
                "Detected topics: " + ", ".join(matched_topics) + "."
            )

        if missing_topics:
            feedback_parts.append(
                "Topics not detected: " + ", ".join(missing_topics) + "."
            )

        feedback_parts.append(
            "Scores are based on keyword coverage and simple structural "
            "heuristics; manually review technical correctness."
        )

        feedback = " ".join(feedback_parts)

    return {
        "relevance_score": round(relevance, 2),
        "technical_score": (
            round(technical, 2) if technical is not None else None
        ),
        "completeness_score": round(completeness, 2),
        "communication_score": round(communication, 2),
        # No embedding model is used, so semantic_score stays NULL.
        "semantic_score": None,
        "overall_response_score": round(overall, 2),
        "feedback": feedback,
    }


def get_response_for_evaluation(
    db: Session,
    response_id,
):
    return (
        db.query(InterviewResponse)
        .options(
            joinedload(InterviewResponse.question),
            joinedload(InterviewResponse.transcription),
            joinedload(InterviewResponse.interview_session)
            .joinedload(InterviewSession.application),
        )
        .filter(InterviewResponse.id == response_id)
        .first()
    )


def evaluate_response(
    db: Session,
    response: InterviewResponse,
) -> AIEvaluation:
    if response.response_status != ResponseStatus.COMPLETED:
        raise ValueError(
            "The response must be completed before evaluation."
        )

    transcription = (
        response.transcription
        or db.query(Transcription)
        .filter(Transcription.response_id == response.id)
        .first()
    )

    if transcription is None or not transcription.transcript_text.strip():
        raise ValueError(
            "A non-empty transcription is required for evaluation."
        )

    question = response.question
    if question is None:
        raise ValueError("The interview question was not found.")

    scores = calculate_evaluation(
        question_text=question.question_text,
        answer_text=transcription.transcript_text,
        expected_topics=question.expected_topics,
    )

    evaluation = (
        db.query(AIEvaluation)
        .filter(AIEvaluation.response_id == response.id)
        .first()
    )

    if evaluation is None:
        evaluation = AIEvaluation(response_id=response.id)
        db.add(evaluation)

    for field, value in scores.items():
        setattr(evaluation, field, value)

    evaluation.model_name = MODEL_NAME
    evaluation.model_version = MODEL_VERSION

    db.flush()

    application_id = response.interview_session.application_id

    candidate_score = (
        db.query(CandidateScore)
        .filter(CandidateScore.application_id == application_id)
        .first()
    )

    if candidate_score is None:
        candidate_score = CandidateScore(
            application_id=application_id,
            scoring_model=MODEL_NAME,
            model_version=MODEL_VERSION,
        )
        db.add(candidate_score)
        db.flush()

    # Recompute the mean of all evaluated responses for this application.
    evaluated_scores = (
        db.query(AIEvaluation.overall_response_score)
        .join(
            InterviewResponse,
            AIEvaluation.response_id == InterviewResponse.id,
        )
        .join(
            InterviewSession,
            InterviewResponse.interview_session_id == InterviewSession.id,
        )
        .filter(
            InterviewSession.application_id == application_id,
            AIEvaluation.overall_response_score.isnot(None),
        )
        .all()
    )

    values = [row[0] for row in evaluated_scores if row[0] is not None]

    candidate_score.interview_score = (
        round(mean(values), 2) if values else None
    )
    candidate_score.scoring_model = MODEL_NAME
    candidate_score.model_version = MODEL_VERSION

    breakdowns = {
        "interview_relevance": (
            scores["relevance_score"],
            "Keyword overlap between the question and transcript.",
        ),
        "interview_technical_coverage": (
            scores["technical_score"],
            "Expected-topic keyword coverage; not factual verification.",
        ),
        "interview_completeness": (
            scores["completeness_score"],
            "Answer-length and topic-coverage heuristic.",
        ),
        "interview_communication_structure": (
            scores["communication_score"],
            "Basic text-structure heuristic, not spoken delivery quality.",
        ),
    }

    for category, (score, explanation) in breakdowns.items():
        existing = (
            db.query(ScoreBreakdown)
            .filter(
                ScoreBreakdown.candidate_score_id == candidate_score.id,
                ScoreBreakdown.category == category,
            )
            .first()
        )

        if score is None:
            if existing is not None:
                db.delete(existing)
            continue

        if existing is None:
            existing = ScoreBreakdown(
                candidate_score_id=candidate_score.id,
                category=category,
                score=score,
                weight=None,
                explanation=explanation,
            )
            db.add(existing)
        else:
            existing.score = score
            existing.explanation = explanation
            existing.weight = None

    db.commit()
    db.refresh(evaluation)

    return evaluation
