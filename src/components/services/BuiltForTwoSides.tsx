"use client";

import React from "react";
import Image from "next/image";
import {
  BriefcaseBusiness,
  UserRound,
  Check,
  Sparkles,
} from "lucide-react";
import InViewport from "../home/InViewport";

export function BuiltForTwoSides() {
  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-8 sm:pt-10 sm:pb-10 lg:pt-12 lg:pb-10">
      {/* Soft blue background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[18%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-accent-50/45 blur-[120px]" />

        <div className="absolute bottom-[-10%] left-[-8%] h-[300px] w-[300px] rounded-full bg-indigo-50/45 blur-[100px]" />

        <div className="absolute right-[-8%] top-[5%] h-[300px] w-[300px] rounded-full bg-blue-50/50 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1250px] px-5 sm:px-8 lg:px-10">
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <InViewport threshold={0.1} dataAttr="hf-reveal">
          <div className="hf-reveal is-visible mx-auto mb-7 max-w-3xl text-center sm:mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-100 bg-white/90 px-4 py-2 shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-elevated">
              <Sparkles className="h-3.5 w-3.5 text-accent-600" />

              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent-700">
                Built for Both Sides
              </span>
            </div>

            <h2 className="text-[2.2rem] font-bold tracking-[-0.04em] text-navy-900 sm:text-[3rem] lg:text-[3.4rem]">
              Better hiring for{" "}
              <span className="bg-gradient-to-r from-accent-600 to-indigo-600 bg-clip-text text-transparent">
                everyone involved.
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-[1rem] leading-7 text-neutral-600 sm:text-[1.05rem]">
              HireAI gives recruiters the intelligence they need to evaluate
              talent while giving candidates a clear and structured experience
              throughout the process.
            </p>
          </div>
        </InViewport>

        {/* =====================================================
            MAIN TWO-SIDED EXPERIENCE
        ===================================================== */}
        <InViewport threshold={0.1} dataAttr="hf-reveal">
          <div className="hf-reveal is-visible relative overflow-hidden rounded-[2rem] border border-accent-100/80 bg-gradient-to-br from-accent-50/40 via-white to-indigo-50/35 shadow-[0_25px_70px_rgba(6,20,47,0.10)] transition-all duration-500 hover:border-accent-200 hover:shadow-[0_30px_85px_rgba(37,99,235,0.14)]">

            {/* =================================================
                TOP VISUAL STRIP
            ================================================= */}
            <div className="relative h-[140px] overflow-hidden border-b border-accent-100 sm:h-[165px]">
              <Image
                src="/services-collaboration.avif"
                alt="Recruiters and candidates collaborating"
                fill
                sizes="100vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/45 to-navy-900/75" />

              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <div className="transition-transform duration-500 hover:-translate-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-200">
                    One platform
                  </p>

                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    One connected hiring experience
                  </h3>
                </div>
              </div>
            </div>

            {/* =================================================
                TWO SIDES
            ================================================= */}
            <div className="grid lg:grid-cols-2">

              {/* =================================================
                  RECRUITERS
              ================================================= */}
              <div className="group relative border-b border-accent-100 bg-gradient-to-br from-white via-white to-accent-50/35 p-7 transition-colors duration-500 sm:p-9 lg:border-b-0 lg:border-r lg:border-accent-100 lg:p-10">

                {/* Accent */}
                <div className="absolute left-0 top-8 h-16 w-1 rounded-r-full bg-accent-500 transition-all duration-500 group-hover:h-20" />

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-accent-100 group-hover:shadow-card">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-600">
                      For Recruiters
                    </p>

                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-navy-900">
                      Make every hiring decision clearer.
                    </h3>
                  </div>
                </div>

                <p className="mt-5 max-w-[480px] text-sm leading-6 text-neutral-600">
                  Bring candidate information, evaluations, interviews, and
                  AI-generated insights into one place so hiring teams can
                  spend less time sorting information and more time making
                  informed decisions.
                </p>

                {/* Recruiter capabilities */}
                <div className="mt-6 space-y-3">
                  <Capability
                    title="Centralized candidate review"
                    description="Everything important about a candidate in one profile."
                  />

                  <Capability
                    title="AI-assisted screening"
                    description="Surface relevant experience and hiring signals faster."
                  />

                  <Capability
                    title="Evaluation insights"
                    description="Understand strengths, gaps, and role alignment."
                  />

                  <Capability
                    title="Candidate comparison"
                    description="Review candidates using consistent evaluation signals."
                  />
                </div>
              </div>

              {/* =================================================
                  CANDIDATES
              ================================================= */}
              <div className="group relative bg-gradient-to-br from-accent-50/65 via-white to-indigo-50/60 p-7 transition-colors duration-500 sm:p-9 lg:p-10">

                {/* Accent */}
                <div className="absolute right-0 top-8 h-16 w-1 rounded-l-full bg-indigo-500 transition-all duration-500 group-hover:h-20" />

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-indigo-100 group-hover:shadow-card">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                      For Candidates
                    </p>

                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-navy-900">
                      Show what you can actually do.
                    </h3>
                  </div>
                </div>

                <p className="mt-5 max-w-[480px] text-sm leading-6 text-neutral-600">
                  A structured experience lets candidates present their
                  experience, skills, and interview responses clearly while
                  ensuring evaluation goes beyond a resume alone.
                </p>

                {/* Candidate capabilities */}
                <div className="mt-6 space-y-3">
                  <Capability
                    title="Clear resume submission"
                    description="Present experience and skills in a structured format."
                    candidate
                  />

                  <Capability
                    title="Structured interview experience"
                    description="Respond to relevant questions in a focused environment."
                    candidate
                  />

                  <Capability
                    title="Skill-based assessment"
                    description="Demonstrate capabilities beyond what a resume shows."
                    candidate
                  />

                  <Capability
                    title="Transparent evaluation"
                    description="Create a more consistent and meaningful hiring journey."
                    candidate
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                CENTER CONNECTION
            ================================================= */}
            <div className="pointer-events-none absolute left-1/2 top-[140px] z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:flex sm:top-[165px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-[5px] border-white bg-navy-900 text-[10px] font-bold text-white shadow-[0_8px_25px_rgba(6,20,47,0.22)]">
                AI
              </div>
            </div>
          </div>
        </InViewport>

        {/* =====================================================
            BOTTOM STATEMENT
        ===================================================== */}
        <InViewport threshold={0.1} dataAttr="hf-reveal">
          <div className="hf-reveal is-visible mt-4 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full border border-accent-100 bg-white/90 px-4 py-2.5 shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-elevated">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-[11px] font-semibold text-neutral-600 sm:text-[12px]">
                Better signals for recruiters. A clearer journey for candidates.
              </span>
            </div>
          </div>
        </InViewport>
      </div>
    </section>
  );
}

/* =============================================================
   CAPABILITY ITEM
============================================================= */

function Capability({
  title,
  description,
  candidate = false,
}: {
  title: string;
  description: string;
  candidate?: boolean;
}) {
  return (
    <div
      className={`group flex items-start gap-3 rounded-xl border border-neutral-200/80 bg-white/80 px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-accent-200 hover:bg-white hover:shadow-card ${
        candidate ? "hover:border-indigo-200" : ""
      }`}
    >
      <div
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${
          candidate
            ? "bg-indigo-50 text-indigo-600"
            : "bg-accent-50 text-accent-600"
        }`}
      >
        <Check className="h-3.5 w-3.5" />
      </div>

      <div>
        <p className="text-[12px] font-bold text-navy-900">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] leading-5 text-neutral-500">
          {description}
        </p>
      </div>
    </div>
  );
}