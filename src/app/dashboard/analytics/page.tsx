"use client";

import { useState } from "react";
import RecruiterLayout from "@/components/layouts/RecruiterLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Progress from "@/components/ui/Progress";
import {
  CheckCircle2,
  AlertCircle,
  Info
} from "lucide-react";
import {
  INITIAL_CANDIDATES,
  INITIAL_EVALUATIONS
} from "@/lib/recruiterData";

export default function AnalyticsPage() {
  // Candidate evaluations map
  const evaluationsList = Object.values(INITIAL_EVALUATIONS);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string>(evaluationsList[0].id);

  const currentReport = INITIAL_EVALUATIONS[selectedEvaluationId] || evaluationsList[0];
  const candidate = INITIAL_CANDIDATES.find((c) => c.id === currentReport.candidateId);

  return (
    <RecruiterLayout>
      <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* =====================================================
            1. PAGE HEADER
        ====================================================== */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-600">
                Evaluation Intelligence
              </span>
              <span className="text-neutral-300">&bull;</span>
              <span className="text-xs font-semibold text-neutral-500">
                {evaluationsList.length} Synthesized Reports
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
              Candidate Evaluation Reports
            </h1>
            <p className="mt-1 text-sm text-neutral-500 md:text-base">
              Detailed AI evaluation breakdowns, question scoring rubrics, and hiring recommendations.
            </p>
          </div>
        </div>

        {/* Notice on Frontend Simulation & Boundaries */}
        <div className="rounded-xl border border-accent-100 bg-accent-50/50 p-4 text-xs text-neutral-600 flex items-start gap-3">
          <Info size={16} className="text-accent-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-navy-900">
              Evaluation Scoring Policy & Boundary Note
            </p>
            <p className="text-neutral-500">
              Evaluation reports are generated only for candidates who have completed an interview session. Marks and question feedback represent frontend mock evaluation models structured for seamless future FastAPI synthesis.
            </p>
          </div>
        </div>

        {/* =====================================================
            2. TWO-COLUMN LAYOUT: Candidate Selector & Full Report
        ====================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── Left Column: Candidate Reports Selector (4 cols) ── */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Completed Candidate Evaluations
            </h2>

            {evaluationsList.map((evalItem) => {
              const cand = INITIAL_CANDIDATES.find((c) => c.id === evalItem.candidateId);
              const isSelected = evalItem.id === selectedEvaluationId;

              return (
                <div
                  key={evalItem.id}
                  onClick={() => setSelectedEvaluationId(evalItem.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-accent-500 bg-accent-50/40 shadow-sm ring-1 ring-accent-500/30"
                      : "border-neutral-200 bg-white hover:border-accent-200 hover:shadow-card"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-navy-900">
                        {cand?.name || "Evaluated Candidate"}
                      </h3>
                      <p className="text-xs text-neutral-500">{cand?.position}</p>
                    </div>

                    <span
                      className={`font-bold text-xs px-2 py-0.5 rounded ${
                        evalItem.overallScore >= 85
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {evalItem.overallScore}%
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
                    <span>{evalItem.evaluationDate}</span>
                    <Badge variant="success" className="text-[10px]">
                      {evalItem.recommendation}
                    </Badge>
                  </div>
                </div>
              );
            })}

            {/* Pending evaluations notice card */}
            <Card className="p-4 border-dashed border-amber-200 bg-amber-50/30 text-xs text-amber-800 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertCircle size={14} className="text-amber-600" />
                1 Candidate Awaiting Evaluation
              </div>
              <p className="text-neutral-500 text-[11px]">
                Emily Rodriguez completed her interview on Oct 8, 2026. Evaluation report will appear here once processed.
              </p>
            </Card>
          </div>

          {/* ── Right Column: Selected Candidate Evaluation Report (8 cols) ── */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Hero Card */}
            <Card className="p-6 border-neutral-200 shadow-sm bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="primary" className="text-[11px] font-semibold">
                      AI Evaluation Report
                    </Badge>
                    <Badge variant="success" className="text-[11px] font-semibold">
                      {currentReport.recommendation}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-navy-900">
                    {candidate?.name || "Evaluated Candidate"}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Position: <span className="text-neutral-700 font-medium">{candidate?.position}</span> &bull; Evaluated on {currentReport.evaluationDate}
                  </p>
                </div>

                {/* Score Dial */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-accent-50 border border-accent-200 flex flex-col items-center justify-center text-accent-700 shadow-sm">
                    <span className="text-xl font-extrabold">{currentReport.overallScore}</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Evaluation Dimensions */}
              <div className="pt-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Evaluation Dimensions & Sub-Scores
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentReport.categoryBreakdown.map((cat, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50 space-y-2"
                    >
                      <div className="flex justify-between text-xs font-semibold text-navy-900">
                        <span>{cat.category}</span>
                        <span className="text-accent-600">{cat.score} / 100</span>
                      </div>
                      <Progress value={cat.score} max={100} size="sm" variant="default" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Question-Wise Performance Breakdown */}
            <Card className="p-6 border-neutral-200 shadow-sm bg-white space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Question-Wise Scoring & AI Feedback
              </h3>

              <div className="space-y-3">
                {currentReport.questionFeedback.map((q) => (
                  <div
                    key={q.questionNumber}
                    className="rounded-xl border border-neutral-200 p-4 bg-neutral-50/40 text-xs space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="font-semibold text-navy-900">
                        Question {q.questionNumber}: {q.question}
                      </span>
                      <span className="text-accent-700 bg-accent-50 px-2 py-0.5 rounded border border-accent-200 font-bold shrink-0">
                        {q.marksObtained} / {q.maxMarks} marks
                      </span>
                    </div>
                    <p className="text-neutral-600 text-xs leading-relaxed">
                      {q.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 space-y-3">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  Key Strengths
                </h4>
                <ul className="space-y-2 text-xs text-neutral-700">
                  {currentReport.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">&bull;</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 space-y-3">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle size={15} className="text-amber-600" />
                  Areas for Growth
                </h4>
                <ul className="space-y-2 text-xs text-neutral-700">
                  {currentReport.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">&bull;</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Executive Summary */}
            <Card className="p-6 border-neutral-200 shadow-sm bg-white space-y-2">
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                Recruiter Executive Summary
              </h4>
              <p className="text-xs leading-relaxed text-neutral-600">
                {currentReport.summary}
              </p>
            </Card>
          </div>

        </div>

      </div>
    </RecruiterLayout>
  );
}
