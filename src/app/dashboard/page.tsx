"use client";

import { useState } from "react";
import Link from "next/link";
import RecruiterLayout from "@/components/layouts/RecruiterLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Progress from "@/components/ui/Progress";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Eye,
  AlertCircle,
  Briefcase,
  ChevronRight,
  Sparkles,
  Info
} from "lucide-react";
import {
  INITIAL_CANDIDATES,
  INITIAL_INTERVIEWS,
  INITIAL_EVALUATIONS,
  type Candidate,
  type Interview,
  type EvaluationReport
} from "@/lib/recruiterData";

export default function DashboardPage() {
  const [candidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [interviews, setInterviews] = useState<Interview[]>(INITIAL_INTERVIEWS);
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationReport | null>(null);

  // New Interview Modal state (local frontend-only)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateEmail, setNewCandidateEmail] = useState("");
  const [newPosition, setNewPosition] = useState("Full Stack Engineer");
  const [newDate, setNewDate] = useState("2026-10-18");
  const [newTime, setNewTime] = useState("10:00");

  // Summary Metrics calculations
  const totalCandidates = candidates.length;
  const scheduledInterviews = interviews.filter((i) => i.status === "Scheduled").length;
  const completedInterviews = interviews.filter((i) => i.status === "Completed").length;
  const pendingEvaluations = candidates.filter(
    (c) => c.interviewStatus === "Completed" && c.evaluationStatus === "Pending"
  ).length;

  // Average score calculated ONLY from completed evaluations that have actual scores
  const scoredEvaluations = candidates.filter(
    (c) => typeof c.evaluationScore === "number" && c.evaluationScore !== null
  );
  const averageScore = scoredEvaluations.length
    ? Math.round(
        scoredEvaluations.reduce((acc, curr) => acc + (curr.evaluationScore ?? 0), 0) /
          scoredEvaluations.length
      )
    : 0;

  // Filtered lists
  const upcomingInterviews = interviews
    .filter((i) => i.status === "Scheduled")
    .slice(0, 3);

  const recentEvaluatedCandidates = candidates.filter((c) => c.interviewStatus === "Completed");

  function handleCreateInterview(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newCandidateName.trim() || !newCandidateEmail.trim()) return;

    const newInterview: Interview = {
      id: `int-${Date.now()}`,
      title: newTitle.trim(),
      candidateId: `cand-${Date.now()}`,
      candidateName: newCandidateName.trim(),
      candidateEmail: newCandidateEmail.trim(),
      position: newPosition,
      scheduledDate: newDate,
      scheduledTime: newTime,
      duration: "30 mins",
      type: "Technical & Problem Solving",
      status: "Scheduled",
      evaluationStatus: "Not Available",
      score: null,
    };

    setInterviews((prev) => [newInterview, ...prev]);
    setIsCreateModalOpen(false);
    setNewTitle("");
    setNewCandidateName("");
    setNewCandidateEmail("");
  }

  return (
    <RecruiterLayout>
      <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* =====================================================
            1. PAGE HEADER & QUICK ACTIONS
        ====================================================== */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-600">
                Recruiter Workspace
              </span>
              <span className="text-neutral-300">&bull;</span>
              <span className="text-xs font-semibold text-neutral-500">TechNova Solutions</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
              Interview Evaluation Dashboard
            </h1>
            <p className="mt-1 text-sm text-neutral-500 md:text-base">
              Manage candidate interviews, monitor assessment status, and review AI-evaluated candidate reports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/candidates">
              <Button variant="outline" size="sm">
                <Users size={16} />
                All Candidates
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="shadow-sm"
            >
              <Plus size={16} />
              Schedule Interview
            </Button>
          </div>
        </div>

        {/* =====================================================
            2. SUMMARY METRICS CARDS
        ====================================================== */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {/* Total Candidates */}
          <Card className="p-5 border-neutral-200 shadow-sm transition-all hover:border-accent-200 hover:shadow-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-neutral-500">Total Candidates</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <Users size={18} />
              </div>
            </div>
            <div className="text-2xl font-bold text-navy-900">{totalCandidates}</div>
            <p className="mt-1 text-xs text-neutral-400">In current pipeline</p>
          </Card>

          {/* Interviews Scheduled */}
          <Card className="p-5 border-neutral-200 shadow-sm transition-all hover:border-accent-200 hover:shadow-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-neutral-500">Interviews Scheduled</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Calendar size={18} />
              </div>
            </div>
            <div className="text-2xl font-bold text-navy-900">{scheduledInterviews}</div>
            <p className="mt-1 text-xs text-neutral-400">Upcoming sessions</p>
          </Card>

          {/* Interviews Completed */}
          <Card className="p-5 border-neutral-200 shadow-sm transition-all hover:border-accent-200 hover:shadow-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-neutral-500">Interviews Completed</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="text-2xl font-bold text-navy-900">{completedInterviews}</div>
            <p className="mt-1 text-xs text-neutral-400">Candidates appeared</p>
          </Card>

          {/* Evaluations Pending */}
          <Card className="p-5 border-neutral-200 shadow-sm transition-all hover:border-accent-200 hover:shadow-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-neutral-500">Evaluations Pending</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock size={18} />
              </div>
            </div>
            <div className="text-2xl font-bold text-navy-900">{pendingEvaluations}</div>
            <p className="mt-1 text-xs text-amber-600 font-medium">Awaiting evaluation</p>
          </Card>

          {/* Average Evaluation Score */}
          <Card className="p-5 border-neutral-200 shadow-sm transition-all hover:border-accent-200 hover:shadow-card col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-neutral-500">Avg. Score</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-navy-900">{averageScore}</span>
              <span className="text-xs font-semibold text-neutral-400">/ 100</span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">From {scoredEvaluations.length} evaluated</p>
          </Card>
        </div>

        {/* Notice on Frontend Simulation & Boundaries */}
        <div className="rounded-xl border border-accent-100 bg-accent-50/50 p-4 text-xs text-neutral-600 flex items-start gap-3">
          <Info size={16} className="text-accent-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-navy-900">Frontend Mock Simulation Mode</p>
            <p className="text-neutral-500">
              This dashboard reflects candidate interviews and evaluations using mock state. Scores are only displayed for candidates who have completed an interview and have an available evaluation report.
            </p>
          </div>
        </div>

        {/* =====================================================
            3. TWO-COLUMN WORKFLOW SECTION
            Left: Recent Candidates & Interview Evaluations (Primary)
            Right: Upcoming Scheduled Interviews (Sidebar)
        ====================================================== */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* ── Left Column: Candidate Evaluations Table (2 cols) ── */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy-900">
                  Recent Candidates & Interview Evaluations
                </h2>
                <p className="text-xs text-neutral-500">
                  Candidates who have appeared for AI interviews and their evaluation statuses.
                </p>
              </div>
              <Link
                href="/dashboard/candidates"
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent-600 hover:text-accent-700"
              >
                View all candidates
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <Card className="overflow-hidden border-neutral-200 p-0 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    <tr>
                      <th className="px-5 py-3.5">Candidate</th>
                      <th className="px-4 py-3.5">Position</th>
                      <th className="px-4 py-3.5">Interview Status</th>
                      <th className="px-4 py-3.5">AI Score</th>
                      <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 bg-white">
                    {recentEvaluatedCandidates.map((candidate) => (
                      <tr key={candidate.id} className="hover:bg-neutral-50/60 transition-colors">
                        {/* Candidate Name & Email */}
                        <td className="px-5 py-4">
                          <div className="font-semibold text-navy-900">{candidate.name}</div>
                          <div className="text-xs text-neutral-400">{candidate.email}</div>
                        </td>

                        {/* Position */}
                        <td className="px-4 py-4 text-xs font-medium text-neutral-600">
                          {candidate.position}
                        </td>

                        {/* Interview Status Badge */}
                        <td className="px-4 py-4">
                          <Badge variant="success" className="text-[11px] font-semibold">
                            {candidate.interviewStatus}
                          </Badge>
                        </td>

                        {/* AI Score / Evaluation Status */}
                        <td className="px-4 py-4">
                          {candidate.evaluationStatus === "Available" && typeof candidate.evaluationScore === "number" ? (
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center justify-center font-bold text-xs px-2.5 py-1 rounded-md ${
                                  candidate.evaluationScore >= 85
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-blue-50 text-blue-700 border border-blue-200"
                                }`}
                              >
                                {candidate.evaluationScore} / 100
                              </span>
                            </div>
                          ) : candidate.evaluationStatus === "Pending" ? (
                            <Badge variant="warning" className="text-[11px] font-semibold">
                              Pending Evaluation
                            </Badge>
                          ) : (
                            <span className="text-xs text-neutral-400 font-medium">
                              Not Available
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          {candidate.evaluationStatus === "Available" && candidate.evaluationId ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-8 px-2.5 text-accent-700 border-accent-200 hover:bg-accent-50"
                              onClick={() => {
                                const report = INITIAL_EVALUATIONS[candidate.evaluationId!];
                                if (report) setSelectedEvaluation(report);
                              }}
                            >
                              <Sparkles size={13} className="mr-1 text-accent-600" />
                              View Report
                            </Button>
                          ) : (
                            <Link href="/dashboard/candidates">
                              <Button variant="ghost" size="sm" className="text-xs h-8 px-2.5">
                                <Eye size={13} className="mr-1" />
                                Details
                              </Button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* ── Right Column: Upcoming Interviews (1 col) ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy-900">Upcoming Interviews</h2>
                <p className="text-xs text-neutral-500">Scheduled candidate sessions.</p>
              </div>
              <Link
                href="/dashboard/assessments"
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent-600 hover:text-accent-700"
              >
                All
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingInterviews.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 border-neutral-200 shadow-sm transition-all hover:border-accent-200 hover:shadow-card bg-white"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm text-navy-900">{item.candidateName}</h3>
                      <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                        <Briefcase size={12} className="text-neutral-400" />
                        {item.position}
                      </p>
                    </div>
                    <Badge variant="primary" className="text-[10px] font-semibold">
                      Scheduled
                    </Badge>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                    <span className="flex items-center gap-1 font-medium text-neutral-700">
                      <Calendar size={13} className="text-accent-600" />
                      {item.scheduledDate}
                    </span>
                    <span className="flex items-center gap-1 text-neutral-500">
                      <Clock size={13} />
                      {item.scheduledTime}
                    </span>
                  </div>

                  {/* Explicit no-score indicator for scheduled candidates */}
                  <div className="mt-2 text-[11px] text-neutral-400 bg-neutral-50 rounded-md px-2.5 py-1 flex items-center justify-between">
                    <span>Evaluation status:</span>
                    <span className="font-medium text-neutral-500">Not attempted yet</span>
                  </div>
                </Card>
              ))}

              <Link href="/dashboard/assessments" className="block">
                <Button variant="outline" size="sm" className="w-full text-xs py-2 text-neutral-600">
                  <Calendar size={14} className="mr-1.5" />
                  Manage All Interviews
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* =====================================================
            4. EVALUATION REPORT MODAL
        ====================================================== */}
        {selectedEvaluation && (
          <Modal
            isOpen={!!selectedEvaluation}
            onClose={() => setSelectedEvaluation(null)}
            title="Candidate Evaluation Report"
            description="Comprehensive breakdown of candidate performance and AI analysis."
            size="lg"
          >
            <div className="space-y-6 pt-2">
              {/* Header Banner */}
              <div className="rounded-xl border border-accent-200 bg-accent-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="success" className="font-semibold text-xs">
                      {selectedEvaluation.recommendation}
                    </Badge>
                    <span className="text-xs text-neutral-400 font-medium">
                      Evaluated on {selectedEvaluation.evaluationDate}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-navy-900">
                    Overall Score: {selectedEvaluation.overallScore} / {selectedEvaluation.maxScore}
                  </h3>
                  <p className="text-xs text-accent-700 font-medium mt-0.5">
                    Frontend simulation report (clearly distinguished from production AI service)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-14 w-14 rounded-2xl bg-white border border-accent-200 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-lg font-extrabold text-navy-900">
                      {selectedEvaluation.overallScore}%
                    </span>
                    <span className="text-[9px] uppercase font-bold text-accent-600 tracking-wider">
                      Match
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                  Evaluation Dimensions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {selectedEvaluation.categoryBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-neutral-200 p-3.5 bg-neutral-50/50 space-y-2"
                    >
                      <div className="flex justify-between text-xs font-semibold text-navy-900">
                        <span>{item.category}</span>
                        <span className="text-accent-600">{item.score} / 100</span>
                      </div>
                      <Progress value={item.score} max={100} size="sm" variant="default" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" /> Key Strengths
                  </h5>
                  <ul className="space-y-1.5 text-xs text-neutral-700">
                    {selectedEvaluation.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">&bull;</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 space-y-2">
                  <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-amber-600" /> Areas for Growth
                  </h5>
                  <ul className="space-y-1.5 text-xs text-neutral-700">
                    {selectedEvaluation.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">&bull;</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-neutral-200 p-4 bg-white space-y-1.5">
                <h5 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                  Executive Summary
                </h5>
                <p className="text-xs leading-relaxed text-neutral-600">
                  {selectedEvaluation.summary}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" size="sm" onClick={() => setSelectedEvaluation(null)}>
                  Close Report
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* =====================================================
            5. CREATE / SCHEDULE INTERVIEW MODAL
        ====================================================== */}
        {isCreateModalOpen && (
          <Modal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            title="Schedule Candidate Interview"
            description="Create an AI-evaluated interview session for a candidate (Local frontend mock)."
            size="md"
          >
            <form onSubmit={handleCreateInterview} className="space-y-4 pt-2">
              <Input
                label="Interview Title"
                placeholder="e.g. AI Technical Assessment"
                value={newTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Candidate Name"
                  placeholder="e.g. Marcus Ray"
                  value={newCandidateName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCandidateName(e.target.value)}
                  required
                />
                <Input
                  label="Candidate Email"
                  type="email"
                  placeholder="e.g. marcus@example.com"
                  value={newCandidateEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCandidateEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  Target Position
                </label>
                <select
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-accent-500 focus:outline-none"
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                >
                  <option value="Senior Full Stack Engineer">Senior Full Stack Engineer</option>
                  <option value="AI / ML Engineer">AI / ML Engineer</option>
                  <option value="Backend Systems Architect">Backend Systems Architect</option>
                  <option value="Frontend UI/UX Developer">Frontend UI/UX Developer</option>
                  <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date"
                  type="date"
                  value={newDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDate(e.target.value)}
                  required
                />
                <Input
                  label="Time"
                  type="time"
                  value={newTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTime(e.target.value)}
                  required
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Confirm & Schedule
                </Button>
              </div>
            </form>
          </Modal>
        )}

      </div>
    </RecruiterLayout>
  );
}
