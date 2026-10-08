"use client";

import CandidateLayout from "@/components/layouts/CandidateLayout";
import Button from "@/components/ui/Button";
import Link from "next/link";
import {
  FileText,
  UploadCloud,
  Calendar,
  Clock,
  CheckCircle2,
  Mic,
  BrainCircuit,
  ChevronRight,
  Building2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export default function CandidatePage() {
  return (
    <CandidateLayout>
      <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <section>
          <div className="mb-7">
            <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-accent-600">
              Candidate Dashboard
            </span>

            <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
                  Welcome back, Alex 👋
                </h1>

                <p className="mt-2 max-w-2xl text-base text-neutral-500 md:text-lg">
                  Track your profile, interviews, results, and preparation
                  progress.
                </p>
              </div>

              <Link href="/candidate/profile">
                <Button variant="outline" size="sm">
                  View Profile
                  <ArrowUpRight size={16} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {/* Profile Completion */}
            <div className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-card">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-500">
                  Profile Completion
                </p>

                <div className="rounded-lg bg-accent-50 px-2 py-1 text-xs font-semibold text-accent-600">
                  75%
                </div>
              </div>

              <p className="text-2xl font-bold text-navy-900">75%</p>
            </div>

            {/* Scheduled Interviews */}
            <div className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-card">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-500">
                  Scheduled Interviews
                </p>

                <div className="rounded-lg bg-accent-50 p-2 text-accent-600">
                  <Mic size={16} />
                </div>
              </div>

              <p className="text-2xl font-bold text-navy-900">1</p>
            </div>

            {/* Interviews Attempted */}
            <div className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-card">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-500">
                  Interviews Attempted
                </p>

                <div className="rounded-lg bg-success-50 p-2 text-success-600">
                  <CheckCircle2 size={16} />
                </div>
              </div>

              <p className="text-2xl font-bold text-navy-900">1</p>
            </div>

            {/* Average Score */}
            <div className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-card">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-500">
                  Average Score
                </p>

                <div className="rounded-lg bg-accent-50 px-2 py-1 text-xs font-semibold text-accent-600">
                  Strong
                </div>
              </div>

              <p className="text-2xl font-bold text-navy-900">88%</p>
            </div>
          </div>
        </section>

        {/* =====================================================
            PROFILE + RESUME
        ====================================================== */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Profile */}
          <div className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:border-accent-200 hover:shadow-card md:p-8">
            <div>
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-navy-900">
                    Profile Completion
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    Complete your profile to keep your candidate information
                    up to date.
                  </p>
                </div>

                <div className="rounded-xl bg-accent-50 p-2.5 text-accent-600">
                  <Sparkles size={20} />
                </div>
              </div>

              <div className="mb-8 flex items-center gap-6">
                <div className="relative h-24 w-24 flex-shrink-0">
                  <svg
                    className="h-full w-full -rotate-90 drop-shadow-sm"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-neutral-100"
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset="62.8"
                      strokeLinecap="round"
                      className="text-accent-500 transition-all duration-1000 ease-out"
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-navy-900">
                      75%
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-navy-900">
                    Almost there!
                  </h3>

                  <p className="mt-1 max-w-xs text-sm leading-relaxed text-neutral-500">
                    Add your latest work experience to complete your profile.
                  </p>
                </div>
              </div>
            </div>

            <Link href="/candidate/profile" className="block">
              <Button
                variant="outline"
                className="w-full justify-center transition-all group-hover:border-accent-300 group-hover:bg-accent-50/40"
              >
                Complete Profile
              </Button>
            </Link>
          </div>

          {/* Resume */}
          <div className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:border-accent-200 hover:shadow-card md:p-8">
            <div>
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-navy-900">
                    Resume Management
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    Keep your latest resume ready for AI evaluation.
                  </p>
                </div>

                <div className="rounded-xl bg-accent-50 p-2.5 text-accent-600">
                  <FileText size={20} />
                </div>
              </div>

              <div className="mb-8 rounded-xl border border-neutral-100 bg-surface-secondary p-5 transition-colors group-hover:bg-accent-50/40">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-accent-500 shadow-sm">
                    <FileText size={24} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy-900">
                      alex_chen_resume.pdf
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Updated Oct 1, 2026
                    </p>
                  </div>

                  <Link href="/candidate/resume">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="border border-neutral-200 bg-white text-accent-600 shadow-sm hover:text-accent-700"
                    >
                      <UploadCloud size={18} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/candidate/resume" className="block">
              <Button
                variant="outline"
                className="w-full justify-center transition-all group-hover:border-accent-300 group-hover:bg-accent-50/40"
              >
                Manage Resume
              </Button>
            </Link>
          </div>
        </section>

        {/* =====================================================
            SCHEDULED INTERVIEWS + ATTEMPTED INTERVIEWS
        ====================================================== */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Scheduled Interviews */}
          <div>
            <div className="mb-5 flex items-center justify-between px-1">
              <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900">
                <span className="rounded-lg bg-accent-50 p-2 text-accent-600">
                  <Calendar size={18} />
                </span>
                Scheduled Interviews
              </h2>

              <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">
                AI Interview
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                    <Mic size={23} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-navy-900">
                        AI Candidate Evaluation
                      </h3>

                      <span className="rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-semibold text-accent-600">
                        Scheduled
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-sm font-medium text-neutral-600">
                      <Building2 size={15} />
                      <span>TechNova Solutions</span>
                    </div>

                    <p className="mt-2 text-sm text-neutral-500">
                      AI Interview
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-600">
                        <Calendar size={14} />
                        Oct 12, 2026
                      </span>

                      <span className="flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-600">
                        <Clock size={14} />
                        10:30 AM
                      </span>
                    </div>

                    <div className="mt-5">
                      <Link href="/candidate/interview">
                        <Button size="sm">
                          View Interview
                          <ArrowUpRight size={15} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attempted Interviews */}
          <div>
            <div className="mb-5 flex items-center justify-between px-1">
              <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900">
                <span className="rounded-lg bg-success-50 p-2 text-success-600">
                  <CheckCircle2 size={18} />
                </span>
                Attempted Interviews
              </h2>

              <Link
                href="/candidate/results"
                className="text-sm font-semibold text-accent-600 hover:text-accent-700"
              >
                View All
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <Link
                href="/candidate/results"
                className="group block p-6 transition-colors hover:bg-neutral-50/80"
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-success-50 text-success-600 transition-transform group-hover:scale-105">
                    <CheckCircle2 size={24} strokeWidth={1.5} />
                  </div>

                  {/* Interview Details */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold leading-snug text-navy-900 transition-colors group-hover:text-accent-600">
                      AI Candidate Evaluation
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
                      <Building2 size={14} className="flex-shrink-0" />
                      <span>TechNova Solutions</span>
                    </div>

                    <p className="mt-1 text-sm font-medium text-neutral-500">
                      Attempted Oct 05, 2026
                    </p>
                  </div>

                  {/* Score + Arrow */}
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-black leading-none text-navy-900">
                        88%
                      </div>

                      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-success-600">
                        Strong
                      </div>

                      <div className="text-[10px] font-bold uppercase tracking-wider text-success-600">
                        Performance
                      </div>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-colors group-hover:bg-accent-50 group-hover:text-accent-600">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            MOCK INTERVIEW
        ====================================================== */}
        <section className="relative overflow-hidden rounded-3xl bg-navy-900 shadow-navy">
          {/* Ambient decoration */}
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/4 -translate-y-1/4 rounded-full bg-accent-500/20 blur-[90px]" />

          <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/4 translate-y-1/3 rounded-full bg-blue-400/10 blur-[80px]" />

          {/* Dot pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative flex flex-col gap-8 p-7 md:flex-row md:items-center md:p-10">
            {/* Icon */}
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white shadow-glow backdrop-blur-md">
              <BrainCircuit size={31} strokeWidth={1.5} />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-accent-300/20 bg-accent-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-200">
                  AI Practice
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white md:text-3xl">
                AI Mock Interview
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-100 md:text-base">
                Practice realistic interview conversations with HireAI&apos;s
                AI interviewer and improve your confidence before the real
                interview.
              </p>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0">
              <Link href="/candidate/mock-interview">
                <Button
                  size="lg"
                  className="!border-0 !bg-white !text-navy-900 shadow-lg transition-all hover:!bg-accent-50 hover:!text-navy-900 hover:shadow-xl md:w-auto"
                >
                  Start Mock Interview
                  <Mic size={17} />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </CandidateLayout>
  );
}