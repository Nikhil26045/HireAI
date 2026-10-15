"use client";

import { useState, useMemo } from "react";
import RecruiterLayout from "@/components/layouts/RecruiterLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Progress from "@/components/ui/Progress";
import {
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from "lucide-react";
import {
  INITIAL_INTERVIEWS,
  INITIAL_EVALUATIONS,
  type Interview,
  type InterviewStatus,
  type EvaluationReport
} from "@/lib/recruiterData";

export default function AssessmentsPage() {
  const [interviews, setInterviews] = useState<Interview[]>(INITIAL_INTERVIEWS);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationReport | null>(null);

  // Create Interview Form State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateEmail, setNewCandidateEmail] = useState("");
  const [newPosition, setNewPosition] = useState("Senior Full Stack Engineer");
  const [newDate, setNewDate] = useState("2026-10-20");
  const [newTime, setNewTime] = useState("14:00");
  const [newDuration, setNewDuration] = useState("30 mins");
  const [newFocus, setNewFocus] = useState("Technical Problem Solving");

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      const matchesSearch =
        interview.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interview.position.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "Pending Evaluation"
          ? interview.status === "Completed" && interview.evaluationStatus === "Pending"
          : interview.status === statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [interviews, searchQuery, statusFilter]);

  function getStatusBadge(status: InterviewStatus, evaluationStatus: string) {
    if (status === "Completed" && evaluationStatus === "Pending") {
      return <Badge variant="warning">Pending Evaluation</Badge>;
    }
    switch (status) {
      case "Scheduled":
        return <Badge variant="primary">Scheduled</Badge>;
      case "In Progress":
        return <Badge variant="warning">In Progress</Badge>;
      case "Completed":
        return <Badge variant="success">Completed</Badge>;
      case "Cancelled":
        return <Badge variant="error">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  }

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
      duration: newDuration,
      type: newFocus,
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
            1. PAGE HEADER
        ====================================================== */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-600">
                Interview Sessions
              </span>
              <span className="text-neutral-300">&bull;</span>
              <span className="text-xs font-semibold text-neutral-500">
                {interviews.length} Total Sessions
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
              Interview Management
            </h1>
            <p className="mt-1 text-sm text-neutral-500 md:text-base">
              Track scheduled candidate sessions, monitor completion, and trigger evaluation reviews.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="shadow-sm"
          >
            <Plus size={16} />
            Create & Schedule Interview
          </Button>
        </div>

        {/* =====================================================
            2. FILTER TABS & SEARCH
        ====================================================== */}
        <Card className="p-4 border-neutral-200 shadow-sm bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Status Filter Badges/Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All", value: "ALL" },
                { label: "Scheduled", value: "Scheduled" },
                { label: "Completed", value: "Completed" },
                { label: "Pending Evaluation", value: "Pending Evaluation" },
                { label: "Cancelled", value: "Cancelled" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    statusFilter === tab.value
                      ? "bg-navy-900 text-white shadow-sm"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative sm:w-72">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search candidate or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-1.5 pl-9 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-accent-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </Card>

        {/* =====================================================
            3. INTERVIEW CARDS / GRID
        ====================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInterviews.length === 0 ? (
            <div className="col-span-full py-16 text-center text-neutral-400">
              No interview records match the selected filter.
            </div>
          ) : (
            filteredInterviews.map((interview) => (
              <Card
                key={interview.id}
                className="p-5 border-neutral-200 shadow-sm transition-all hover:border-accent-200 hover:shadow-card bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-accent-700 uppercase tracking-wider">
                      {interview.type}
                    </span>
                    {getStatusBadge(interview.status, interview.evaluationStatus)}
                  </div>

                  <h3 className="text-base font-bold text-navy-900">{interview.title}</h3>
                  <p className="text-xs font-medium text-neutral-500 mt-0.5">
                    Position: {interview.position}
                  </p>

                  <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Candidate:</span>
                      <span className="font-semibold text-navy-900">{interview.candidateName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Date & Time:</span>
                      <span className="font-medium text-neutral-700">
                        {interview.scheduledDate} &bull; {interview.scheduledTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Duration:</span>
                      <span className="font-medium text-neutral-700">{interview.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Evaluation Section */}
                <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between">
                  {interview.status === "Scheduled" ? (
                    <span className="text-[11px] text-neutral-400 italic">
                      Scheduled &bull; Score unavailable
                    </span>
                  ) : interview.status === "Completed" && interview.score ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-neutral-500">AI Score:</span>
                      <span className="font-bold text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {interview.score} / 100
                      </span>
                    </div>
                  ) : interview.status === "Completed" && !interview.score ? (
                    <span className="text-[11px] text-amber-600 font-medium">
                      Evaluation Pending
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-400">Cancelled Session</span>
                  )}

                  {interview.evaluationStatus === "Available" && interview.evaluationId && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2.5 text-accent-700 border-accent-200 hover:bg-accent-50"
                      onClick={() => {
                        const report = INITIAL_EVALUATIONS[interview.evaluationId!];
                        if (report) setSelectedEvaluation(report);
                      }}
                    >
                      <Sparkles size={12} className="mr-1 text-accent-600" />
                      View Report
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* =====================================================
            4. CREATE / SCHEDULE INTERVIEW MODAL
        ====================================================== */}
        {isCreateModalOpen && (
          <Modal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            title="Create & Schedule Interview"
            description="Add an AI-evaluated interview session for a candidate (Frontend simulation)."
            size="md"
          >
            <form onSubmit={handleCreateInterview} className="space-y-4 pt-2">
              <Input
                label="Interview Title"
                placeholder="e.g. AI Architecture Evaluation"
                value={newTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Candidate Name"
                  placeholder="e.g. Jordan Bell"
                  value={newCandidateName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCandidateName(e.target.value)}
                  required
                />
                <Input
                  label="Candidate Email"
                  type="email"
                  placeholder="e.g. jordan@example.com"
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

              <div className="grid grid-cols-3 gap-3">
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
                <Input
                  label="Duration"
                  value={newDuration}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDuration(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Evaluation Focus / Type"
                value={newFocus}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFocus(e.target.value)}
                placeholder="e.g. System Design & Coding"
                required
              />

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

        {/* =====================================================
            5. EVALUATION REPORT MODAL
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

                <div className="h-14 w-14 rounded-2xl bg-white border border-accent-200 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-lg font-extrabold text-navy-900">
                    {selectedEvaluation.overallScore}%
                  </span>
                  <span className="text-[9px] uppercase font-bold text-accent-600 tracking-wider">
                    Match
                  </span>
                </div>
              </div>

              {/* Dimensions */}
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

              {/* Question Feedback */}
              {selectedEvaluation.questionFeedback && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Question-Wise Breakdown
                  </h4>
                  <div className="space-y-2.5">
                    {selectedEvaluation.questionFeedback.map((q) => (
                      <div
                        key={q.questionNumber}
                        className="rounded-xl border border-neutral-200 p-3.5 bg-white text-xs space-y-1.5"
                      >
                        <div className="flex justify-between items-center font-semibold text-navy-900">
                          <span>Q{q.questionNumber}: {q.question}</span>
                          <span className="text-accent-700 bg-accent-50 px-2 py-0.5 rounded border border-accent-200">
                            {q.marksObtained} / {q.maxMarks} marks
                          </span>
                        </div>
                        <p className="text-neutral-600 text-[11px] leading-relaxed">
                          {q.feedback}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

      </div>
    </RecruiterLayout>
  );
}
