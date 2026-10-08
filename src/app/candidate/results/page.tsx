"use client";

import { useState } from "react";
import CandidateLayout from "@/components/layouts/CandidateLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Progress from "@/components/ui/Progress";
import { TrendingUp, Award, Calendar, CheckCircle2, ChevronRight, Mic, Building2, Search, BarChart3 } from "lucide-react";

type CategoryBreakdown = {
  category: string;
  score: number;
};

type InterviewResult = {
  id: string;
  title: string;
  company: string;
  type: string;
  attemptedDate: string;
  score: number;
  status: string;
  breakdown: CategoryBreakdown[];
  strengths: string[];
  improvements: string[];
};

const mockInterviews: InterviewResult[] = [
  {
    id: "1",
    title: "AI Candidate Evaluation",
    company: "TechNova Solutions",
    type: "AI Interview",
    attemptedDate: "October 5, 2026",
    score: 88,
    status: "Strong Performance",
    breakdown: [
      { category: "Communication", score: 90 },
      { category: "Technical Knowledge", score: 86 },
      { category: "Problem Solving", score: 88 },
      { category: "Confidence", score: 89 },
    ],
    strengths: [
      "Clear communication",
      "Good technical understanding",
      "Structured responses",
    ],
    improvements: [
      "Provide more detailed examples",
      "Improve response depth on technical questions",
    ],
  },
  {
    id: "2",
    title: "Technical Candidate Evaluation",
    company: "Innovate Labs",
    type: "AI Interview",
    attemptedDate: "September 28, 2026",
    score: 82,
    status: "Good Performance",
    breakdown: [
      { category: "Communication", score: 85 },
      { category: "Technical Knowledge", score: 80 },
      { category: "Problem Solving", score: 82 },
      { category: "Confidence", score: 81 },
    ],
    strengths: [
      "Logical thought process",
      "Fast problem-solving",
    ],
    improvements: [
      "Work on verbal communication speed",
      "Be more structured",
    ],
  },
];

export default function CandidateResultsPage() {
  const [selectedInterview, setSelectedInterview] = useState<InterviewResult | null>(null);

  // Overall Stats Calculation
  const totalAttempted = mockInterviews.length;
  const averageScore = totalAttempted
    ? Math.round(mockInterviews.reduce((acc, curr) => acc + curr.score, 0) / totalAttempted)
    : 0;

  return (
    <CandidateLayout>
      <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* PAGE HEADER */}
        <section>
          <div className="mb-7">
            <Badge variant="primary" className="mb-4">
              <TrendingUp size={14} className="mr-1.5" />
              PERFORMANCE
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
              Interview Results
            </h1>

            <p className="mt-3 max-w-2xl text-base text-neutral-500 md:text-lg">
              Review your AI interview performance and track your progress.
            </p>
          </div>
        </section>

        {/* OVERVIEW / PERFORMANCE SUMMARY */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card padding="md" className="group hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-card transition-all">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500">Interviews Attempted</p>
              <div className="rounded-lg bg-accent-50 p-2 text-accent-600">
                <Mic size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold text-navy-900">{totalAttempted}</p>
          </Card>

          <Card padding="md" className="group hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-card transition-all">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500">Average Score</p>
              <div className="rounded-lg bg-success-50 p-2 text-success-600">
                <Award size={16} />
              </div>
            </div>
            <p className="text-2xl font-bold text-navy-900">{averageScore}%</p>
          </Card>

          <Card padding="md" className="group hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-card transition-all">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500">Strongest Area</p>
              <div className="rounded-lg bg-accent-50 p-2 text-accent-600">
                <BarChart3 size={16} />
              </div>
            </div>
            <p className="text-lg font-bold text-navy-900 truncate">Communication</p>
          </Card>

          <Card padding="md" className="group hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-card transition-all">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-500">Performance</p>
              <div className="rounded-lg bg-success-50 p-2 text-success-600">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <p className="text-lg font-bold text-navy-900 truncate">Strong</p>
          </Card>
        </section>

        {/* PERFORMANCE SUMMARY CARD */}
        <section>
          <Card padding="lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <h2 className="text-xl font-bold text-navy-900 mb-2">Your Performance</h2>
                <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                  Your recent interview performance shows strong communication and technical understanding. Keep refining your problem-solving speed for optimal results.
                </p>
                <div className="flex items-center gap-3">
                  <Badge variant="success" size="md">
                    Strong Performance
                  </Badge>
                  <span className="text-sm font-semibold text-navy-900">Overall Score: {averageScore}%</span>
                </div>
              </div>
              <div className="md:w-64 w-full flex-shrink-0 bg-neutral-50 p-5 rounded-xl border border-neutral-100 flex flex-col items-center justify-center">
                <div className="text-4xl font-black text-navy-900 mb-2">{averageScore}%</div>
                <Progress value={averageScore} max={100} size="md" variant="success" />
              </div>
            </div>
          </Card>
        </section>

        {/* ATTEMPTED INTERVIEWS */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-navy-900">Attempted Interviews</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Review interviews you have already completed.
            </p>
          </div>

          {mockInterviews.length === 0 ? (
            <Card padding="lg" className="text-center py-16 border-dashed border-2">
              <div className="mx-auto h-16 w-16 bg-neutral-50 flex items-center justify-center rounded-full text-neutral-400 mb-4">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">Your interview results will appear here.</h3>
              <p className="text-neutral-500 text-sm max-w-sm mx-auto">
                Complete a company interview to see your performance and feedback.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {mockInterviews.map((interview) => (
                <Card 
                  key={interview.id} 
                  padding="md" 
                  className="transition-all hover:border-accent-200 hover:shadow-card group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600 transition-transform group-hover:scale-105">
                        <CheckCircle2 size={24} strokeWidth={1.5} />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-base font-bold leading-snug text-navy-900 transition-colors group-hover:text-accent-600">
                            {interview.title}
                          </h3>
                          <Badge variant="info" size="sm">{interview.type}</Badge>
                        </div>
                        
                        <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
                          <Building2 size={14} className="flex-shrink-0" />
                          <span className="font-medium text-navy-900">{interview.company}</span>
                        </div>
                        
                        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-neutral-500">
                          <Calendar size={13} />
                          Attempted {interview.attemptedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                      <div className="text-left lg:text-right">
                        <div className="text-2xl font-black leading-none text-navy-900">
                          {interview.score}%
                        </div>
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-success-600">
                          {interview.status}
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedInterview(interview)}
                      >
                        View Results
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* RESULT DETAIL MODAL */}
      <Modal
        isOpen={!!selectedInterview}
        onClose={() => setSelectedInterview(null)}
        title="Interview Result"
        size="lg"
      >
        {selectedInterview && (
          <div className="mt-4 space-y-6">
            
            {/* Header info */}
            <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-navy-900">{selectedInterview.title}</h3>
                <p className="text-sm font-medium text-neutral-600 mt-1 flex items-center gap-1.5">
                  <Building2 size={14} />
                  {selectedInterview.company}
                </p>
              </div>
              <div className="text-left md:text-right">
                <div className="text-3xl font-black text-navy-900">{selectedInterview.score}%</div>
                <div className="text-xs font-bold uppercase text-success-600 mt-0.5">
                  {selectedInterview.status}
                </div>
              </div>
            </div>

            {/* Performance Breakdown */}
            <div>
              <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4">
                Performance Breakdown
              </h4>
              <div className="space-y-4">
                {selectedInterview.breakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-neutral-700">{item.category}</span>
                      <span className="text-sm font-semibold text-navy-900">{item.score}%</span>
                    </div>
                    <Progress value={item.score} max={100} size="sm" variant={item.score >= 85 ? "success" : "default"} />
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-neutral-100" />

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-success-500" />
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {selectedInterview.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                      <div className="mt-1 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-success-500" />
                      {str}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-warning-500 rotate-180" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {selectedInterview.improvements.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                      <div className="mt-1 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-warning-500" />
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedInterview(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </CandidateLayout>
  );
}

