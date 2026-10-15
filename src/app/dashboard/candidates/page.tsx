"use client";

import { useState, useMemo } from "react";
import RecruiterLayout from "@/components/layouts/RecruiterLayout";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Progress from "@/components/ui/Progress";
import {
  Search,
  FileText,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  X
} from "lucide-react";
import {
  INITIAL_CANDIDATES,
  INITIAL_EVALUATIONS,
  type Candidate,
  type EvaluationReport,
  type InterviewStatus
} from "@/lib/recruiterData";

export default function CandidatesPage() {
  const [candidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [positionFilter, setPositionFilter] = useState<string>("ALL");

  // Selection states
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationReport | null>(null);

  // Unique positions for filtering
  const positions = useMemo(() => {
    return Array.from(new Set(candidates.map((c) => c.position)));
  }, [candidates]);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" || candidate.interviewStatus === statusFilter;

      const matchesPosition =
        positionFilter === "ALL" || candidate.position === positionFilter;

      return matchesSearch && matchesStatus && matchesPosition;
    });
  }, [candidates, searchQuery, statusFilter, positionFilter]);

  function getStatusBadge(status: InterviewStatus) {
    switch (status) {
      case "Scheduled":
        return <Badge variant="primary">Scheduled</Badge>;
      case "In Progress":
        return <Badge variant="warning">In Progress</Badge>;
      case "Completed":
        return <Badge variant="success">Completed</Badge>;
      case "Pending Evaluation":
        return <Badge variant="warning">Pending Evaluation</Badge>;
      case "Cancelled":
        return <Badge variant="error">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
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
                Candidate Directory
              </span>
              <span className="text-neutral-300">&bull;</span>
              <span className="text-xs font-semibold text-neutral-500">
                {candidates.length} Registered Candidates
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
              Candidates & Interview History
            </h1>
            <p className="mt-1 text-sm text-neutral-500 md:text-base">
              Monitor candidate interview progress, inspect resume skills, and access AI evaluation breakdowns.
            </p>
          </div>
        </div>

        {/* =====================================================
            2. SEARCH & FILTER BAR
        ====================================================== */}
        <Card className="p-4 border-neutral-200 shadow-sm bg-white">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 items-center">
            {/* Search Input */}
            <div className="sm:col-span-6">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by candidate name, email, or skill (e.g. React, Python)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-accent-500 focus:bg-white focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-sm text-neutral-800 focus:border-accent-500 focus:outline-none"
              >
                <option value="ALL">All Interview Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Pending Evaluation">Pending Evaluation</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Position Filter */}
            <div className="sm:col-span-3">
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 px-3 text-sm text-neutral-800 focus:border-accent-500 focus:outline-none"
              >
                <option value="ALL">All Positions</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* =====================================================
            3. CANDIDATES RESPONSIVE TABLE
        ====================================================== */}
        <Card className="overflow-hidden border-neutral-200 p-0 shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="px-5 py-4">Candidate</th>
                  <th className="px-4 py-4">Position</th>
                  <th className="px-4 py-4">Resume</th>
                  <th className="px-4 py-4">Key Skills</th>
                  <th className="px-4 py-4">Interview Date</th>
                  <th className="px-4 py-4">Interview Status</th>
                  <th className="px-4 py-4">AI Score</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-400">
                      No candidates matched your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-neutral-50/70 transition-colors">
                      {/* Name & Email */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-navy-900">{candidate.name}</div>
                        <div className="text-xs text-neutral-400">{candidate.email}</div>
                      </td>

                      {/* Position */}
                      <td className="px-4 py-4 text-xs font-medium text-neutral-700">
                        {candidate.position}
                      </td>

                      {/* Resume Availability */}
                      <td className="px-4 py-4">
                        {candidate.hasResume ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <FileText size={12} />
                            PDF
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400 italic">None</span>
                        )}
                      </td>

                      {/* Skills */}
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {candidate.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-medium text-neutral-600"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="text-[10px] text-neutral-400">
                              +{candidate.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Interview Date */}
                      <td className="px-4 py-4 text-xs text-neutral-600 whitespace-nowrap">
                        <div className="font-medium text-navy-900">{candidate.interviewDate}</div>
                        <div className="text-[11px] text-neutral-400">{candidate.interviewTime}</div>
                      </td>

                      {/* Interview Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(candidate.interviewStatus)}
                      </td>

                      {/* Evaluation Score */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {candidate.evaluationStatus === "Available" && typeof candidate.evaluationScore === "number" ? (
                          <span
                            className={`inline-flex items-center justify-center font-bold text-xs px-2.5 py-1 rounded-md ${
                              candidate.evaluationScore >= 85
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {candidate.evaluationScore} / 100
                          </span>
                        ) : candidate.evaluationStatus === "Pending" ? (
                          <Badge variant="warning" className="text-[10px]">
                            Pending
                          </Badge>
                        ) : (
                          <span className="text-xs text-neutral-400">Not Available</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={() => setSelectedCandidate(candidate)}
                          >
                            <Eye size={13} className="mr-1" />
                            Details
                          </Button>

                          {candidate.evaluationStatus === "Available" && candidate.evaluationId && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2.5 text-xs text-accent-700 border-accent-200 hover:bg-accent-50"
                              onClick={() => {
                                const report = INITIAL_EVALUATIONS[candidate.evaluationId!];
                                if (report) setSelectedEvaluation(report);
                              }}
                            >
                              <Sparkles size={13} className="mr-1 text-accent-600" />
                              Report
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* =====================================================
            4. CANDIDATE DETAIL MODAL
        ====================================================== */}
        {selectedCandidate && (
          <Modal
            isOpen={!!selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
            title="Candidate Profile & Interview Record"
            description="Recruiter overview of profile details, attached resume, and interview status."
            size="lg"
          >
            <div className="space-y-6 pt-2">
              {/* Profile Card Header */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-navy-900">{selectedCandidate.name}</h3>
                  <p className="text-sm font-medium text-accent-700">{selectedCandidate.position}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-neutral-600">
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} className="text-neutral-400" />
                      {selectedCandidate.email}
                    </span>
                    {selectedCandidate.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} className="text-neutral-400" />
                        {selectedCandidate.phone}
                      </span>
                    )}
                    {selectedCandidate.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-neutral-400" />
                        {selectedCandidate.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs text-neutral-400 block mb-1">Interview Status</span>
                  {getStatusBadge(selectedCandidate.interviewStatus)}
                </div>
              </div>

              {/* Skills & Resume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-neutral-200 p-4 space-y-2 bg-white">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Relevant Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedCandidate.skills.map((skill, i) => (
                      <Badge key={i} variant="default" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-200 p-4 space-y-2 bg-white">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Resume Document
                  </h4>
                  {selectedCandidate.hasResume ? (
                    <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 p-2.5">
                      <div className="flex items-center gap-2 text-xs font-medium text-navy-900">
                        <FileText size={16} className="text-accent-600" />
                        <span className="truncate max-w-[160px]">
                          {selectedCandidate.resumeFileName || "Candidate_Resume.pdf"}
                        </span>
                      </div>
                      <Badge variant="success" className="text-[10px]">
                        Available
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 italic pt-1">
                      No resume uploaded for this candidate record.
                    </p>
                  )}
                </div>
              </div>

              {/* Interview & Evaluation Summary */}
              <div className="rounded-xl border border-neutral-200 p-4 space-y-3 bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Associated Interview Details
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Scheduled Date</span>
                    <span className="font-semibold text-navy-900">
                      {selectedCandidate.interviewDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Scheduled Time</span>
                    <span className="font-semibold text-navy-900">
                      {selectedCandidate.interviewTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Evaluation Status</span>
                    <span className="font-semibold text-navy-900">
                      {selectedCandidate.evaluationStatus}
                    </span>
                  </div>
                </div>

                {selectedCandidate.evaluationStatus === "Available" && selectedCandidate.evaluationId ? (
                  <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-neutral-500">Overall AI Match Score:</span>
                      <span className="ml-2 font-bold text-base text-navy-900">
                        {selectedCandidate.evaluationScore} / 100
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        const report = INITIAL_EVALUATIONS[selectedCandidate.evaluationId!];
                        if (report) {
                          setSelectedCandidate(null);
                          setSelectedEvaluation(report);
                        }
                      }}
                    >
                      <Sparkles size={14} className="mr-1.5" />
                      View Full Evaluation
                    </Button>
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-neutral-500 bg-neutral-50 p-2.5 rounded-lg">
                    {selectedCandidate.interviewStatus === "Scheduled"
                      ? "Interview is currently scheduled. Scores and analysis will appear once the candidate completes the session."
                      : selectedCandidate.interviewStatus === "Completed"
                      ? "Interview completed; AI evaluation synthesis is currently pending."
                      : "No evaluation available for this candidate."}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(null)}>
                  Close
                </Button>
              </div>
            </div>
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
