"use client";

import React from "react";
import Image from "next/image";
import {
  FileText,
  Mic,
  Target,
  Zap,
  ShieldCheck,
  UserCircle,
  Briefcase,
  BarChart,
} from "lucide-react";
import InViewport from "../home/InViewport";

export function ProductVisualization() {
  return (
    <section className="relative overflow-hidden bg-white text-navy-900 py-8 sm:py-10 lg:py-12">
      {/* =========================================================
          SOFT BACKGROUND
      ========================================================= */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[25%] h-[420px] w-[420px] rounded-full bg-accent-50/50 blur-[120px]" />

        <div className="absolute right-[-8%] top-[20%] h-[450px] w-[450px] rounded-full bg-indigo-50/60 blur-[120px]" />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <div className="relative z-10 mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">

          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}
          <div className="relative z-20">
            <InViewport threshold={0.1} dataAttr="hf-reveal">
              <div className="hf-reveal is-visible">

                {/* Eyebrow */}
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-100 bg-white px-4 py-2 shadow-card">
                  <span className="h-2 w-2 rounded-full bg-accent-500" />

                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-700">
                    Candidate Intelligence
                  </span>
                </div>

                {/* Heading */}
                <h2 className="max-w-[620px] text-[2.8rem] font-bold leading-[1.02] tracking-[-0.045em] text-navy-900 sm:text-[3.5rem] lg:text-[4rem]">
                  One Candidate.
                  <br />

                  <span className="bg-gradient-to-r from-accent-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Multiple
                    <br />
                    Capabilities.
                  </span>
                </h2>

                {/* Main paragraph */}
                <p className="mt-6 max-w-[590px] text-[1rem] leading-7 text-neutral-600 sm:text-[1.08rem] sm:leading-8">
                  HireAI brings resume intelligence, interview analysis, skill
                  assessment, and AI-generated insights together into one
                  unified candidate profile. Instead of switching between
                  disconnected tools, recruiters get a clearer view of
                  experience, capability, communication, and hiring signals in
                  one place.
                </p>

                {/* =================================================
                    SIMPLE CAPABILITY LIST
                ================================================= */}
                <div className="mt-7 grid max-w-[600px] grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">

                  {/* Resume */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                      <FileText className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-[13px] font-bold text-navy-900">
                        Resume Intelligence
                      </p>

                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        Experience & evidence
                      </p>
                    </div>
                  </div>

                  {/* Interview */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Mic className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-[13px] font-bold text-navy-900">
                        Interview Analysis
                      </p>

                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        Structured signals
                      </p>
                    </div>
                  </div>

                  {/* Assessment */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Target className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-[13px] font-bold text-navy-900">
                        Skill Assessment
                      </p>

                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        Role-based evaluation
                      </p>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Zap className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-[13px] font-bold text-navy-900">
                        AI Insights
                      </p>

                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        Actionable patterns
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </InViewport>
          </div>

          {/* =====================================================
              RIGHT VISUALIZATION
          ===================================================== */}
          <div className="relative h-[530px] w-full sm:h-[570px] lg:h-[590px]">

            {/* ===================================================
                MAIN CANDIDATE INTERFACE
            =================================================== */}
            <InViewport threshold={0.1} dataAttr="hf-reveal">
              <div
                className="hf-reveal is-visible absolute left-[5%] top-[6%] z-10 w-[76%] sm:left-[6%] sm:w-[74%]"
              >
                <div className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_25px_70px_rgba(6,20,47,0.14)]">

                  {/* Profile Header */}
                  <div className="border-b border-neutral-100 bg-gradient-to-b from-accent-50/60 to-white p-5 sm:p-6">

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent-100 bg-accent-50 text-sm font-bold text-accent-700">
                          JS
                        </div>

                        <div>
                          <h3 className="text-[15px] font-bold text-navy-900">
                            Jordan Smith
                          </h3>

                          <p className="text-[12px] text-neutral-500">
                            Senior Product Designer
                          </p>
                        </div>

                      </div>

                      <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Evaluated
                      </div>

                    </div>

                    <div className="mt-4 flex gap-5 text-[11px] text-neutral-500">

                      <div className="flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-neutral-400" />
                        7 Yrs Exp
                      </div>

                      <div className="flex items-center gap-1.5">
                        <UserCircle className="h-4 w-4 text-neutral-400" />
                        San Francisco
                      </div>

                    </div>

                  </div>

                  {/* Main Content */}
                  <div className="bg-neutral-50/80 p-4 sm:p-5">

                    {/* Capability Score */}
                    <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-card">

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <Target className="h-4 w-4 text-accent-500" />

                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            Capability Score
                          </span>

                        </div>

                        <span className="font-mono text-[13px] font-bold text-accent-600">
                          94/100
                        </span>

                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100">

                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent-500 to-indigo-500"
                          style={{ width: "94%" }}
                        />

                      </div>

                      <p className="mt-2 text-right text-[10px] text-neutral-400">
                        Top 5% of applicants
                      </p>

                    </div>

                    {/* Resume Image */}
                    <div className="relative mt-4 h-[200px] overflow-hidden rounded-2xl border border-neutral-200 bg-white sm:h-[215px]">

                      <Image
                        src="/services-resume.avif"
                        alt="Candidate resume evidence"
                        fill
                        sizes="(max-width: 640px) 75vw, 520px"
                        className="object-cover object-top opacity-75 transition-transform duration-700 hover:scale-[1.03]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />

                      {/* Evidence banner */}
                      <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/70 bg-white/95 p-3 shadow-card backdrop-blur-md">

                        <div className="flex items-start gap-2.5">

                          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                          <p className="text-[10px] leading-[1.45] text-neutral-700 sm:text-[11px]">
                            Strong portfolio showing complex enterprise SaaS
                            redesigns with measurable impact.
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-neutral-100 bg-white px-5 py-3">

                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                      AI Evaluation
                    </span>

                    <div className="flex items-center gap-2 text-[10px] font-semibold text-emerald-600">

                      <span className="h-2 w-2 rounded-full bg-emerald-400" />

                      Complete

                    </div>

                  </div>

                </div>
              </div>
            </InViewport>

            {/* ===================================================
                VERIFIED SKILLS — TOP RIGHT
            =================================================== */}
            <InViewport threshold={0.1} dataAttr="hf-reveal">
              <div
                className="hf-reveal is-visible absolute right-[1%] top-[0%] z-30 hidden w-[215px] rounded-2xl border border-neutral-200 bg-white/95 p-4 shadow-[0_18px_45px_rgba(6,20,47,0.13)] backdrop-blur-xl md:block"
                style={{ transitionDelay: "0.2s" }}
              >

                <div className="mb-3 flex items-center gap-2.5">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <BarChart className="h-4 w-4" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-navy-900">
                    Verified Skills
                  </span>

                </div>

                <div className="flex flex-wrap gap-2">

                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[10px] font-medium text-neutral-600">
                    UX Research
                  </span>

                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[10px] font-medium text-neutral-600">
                    Prototyping
                  </span>

                  <span className="flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-medium text-indigo-700">
                    Design Systems
                    <ShieldCheck className="h-3 w-3" />
                  </span>

                </div>

              </div>
            </InViewport>

            {/* ===================================================
                INTERVIEW NOTE — RIGHT CENTER
            =================================================== */}
            <InViewport threshold={0.1} dataAttr="hf-reveal">
              <div
                className="hf-reveal is-visible absolute right-[-1%] top-[38%] z-40 hidden w-[220px] rounded-2xl border border-neutral-200 bg-white/95 p-4 shadow-[0_18px_45px_rgba(6,20,47,0.13)] backdrop-blur-xl md:block"
                style={{ transitionDelay: "0.3s" }}
              >

                <div className="mb-3 flex items-center gap-2.5">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Mic className="h-4 w-4" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-navy-900">
                    Interview Note
                  </span>

                </div>

                <div className="relative rounded-xl bg-neutral-50 p-3.5">

                  <div className="absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-emerald-400" />

                  <p className="pl-3 text-[10px] italic leading-relaxed text-neutral-600">
                    "Candidate demonstrated strong architectural knowledge when
                    discussing scalable systems."
                  </p>

                </div>

              </div>
            </InViewport>

            {/* ===================================================
                AI INSIGHT — BOTTOM RIGHT
            =================================================== */}
            <InViewport threshold={0.1} dataAttr="hf-reveal">
              <div
                className="hf-reveal is-visible absolute bottom-[2%] right-[3%] z-40 hidden w-[225px] rounded-2xl border border-accent-100 bg-white/95 p-4 shadow-[0_18px_50px_rgba(37,99,235,0.14)] backdrop-blur-xl md:block"
                style={{ transitionDelay: "0.4s" }}
              >

                <div className="mb-3 flex items-center gap-2.5">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                    <Zap className="h-4 w-4" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-navy-900">
                    AI Insight
                  </span>

                </div>

                <p className="text-[10px] leading-relaxed text-neutral-600">
                  Highly articulate communication style. Past experience
                  directly aligns with the current Q3 roadmap requirements.
                </p>

                <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-emerald-600">

                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  Insight generated

                </div>

              </div>
            </InViewport>

            {/* ===================================================
                SOFT VISUAL GLOW
            =================================================== */}
            <div className="pointer-events-none absolute right-[8%] top-[25%] h-[350px] w-[350px] rounded-full bg-accent-100/20 blur-[100px]" />

          </div>
        </div>
      </div>
    </section>
  );
}