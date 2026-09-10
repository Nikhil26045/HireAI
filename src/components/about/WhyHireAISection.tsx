"use client";

import type { ReactNode } from "react";
import InViewport from "../home/InViewport";

const problems = [
  {
    number: "01",
    title: "Too Much Information",
    description: "Resumes, interviews, skills, experience, and candidate responses create a large amount of information to evaluate.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3l1.5-1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12V8a3 3 0 116 0v1.5" />
        <rect x="5" y="10" width="14" height="10" rx="1.5" />
      </svg>
    ),
    indicator: { label: "Data volume", width: "100%", color: "bg-accent-500" },
  },
  {
    number: "02",
    title: "Too Little Time",
    description: "Recruiters need to identify strong candidates quickly without spending hours manually comparing every detail.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
      </svg>
    ),
    indicator: { label: "Time pressure", width: "75%", color: "bg-accent-500" },
  },
  {
    number: "03",
    title: "Too Much Uncertainty",
    description: "A resume alone cannot always show how well a candidate matches the actual needs of a role.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.293 3.75L5.25 12l5.043 8.25h5.694L18.75 12l-5.043-8.25H10.293z" />
      </svg>
    ),
    indicator: { label: "Decision confidence", width: "45%", color: "bg-accent-500" },
  },
];

export default function WhyHireAISection() {
  return (
    <section className="relative overflow-hidden bg-white py-10 sm:py-12 lg:py-14 scroll-mt-[72px]">
      <div className="pointer-events-none absolute -left-28 -top-16 h-[280px] w-[280px] rounded-full bg-accent-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-16 h-[260px] w-[260px] rounded-full bg-navy-900/[0.015] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]" data-dot-pattern style={{ color: "#5F718F" }} />
      <div className="pointer-events-none absolute left-1/2 top-[55%] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-100/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 2xl:max-w-[1360px]">
        <InViewport threshold={0.1} dataAttr="wha-eyebrow-in-view" className="whya-eyebrow">
          <div className="text-center">
            <div className="mb-2 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/70 bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-700">
                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-accent-600" />
                WHY HIREAI EXISTS
              </span>
            </div>
            <h2 className="text-[1.9rem] font-bold leading-[1.18] tracking-tight text-navy-900 sm:text-[2.1rem] md:text-[2.3rem] lg:text-[2.4rem]">
              Why{" "}
              <span className="bg-gradient-to-r from-accent-600 via-accent-500 to-accent-700 bg-clip-text text-transparent">
                HireAI
              </span>{" "}
              Exists
            </h2>
            <p className="whya-desc mx-auto mt-2.5 max-w-lg text-[1.05rem] leading-[1.65] text-neutral-500">
              Modern hiring creates a simple problem: there is more candidate information than recruiters have time to process.
            </p>
          </div>
        </InViewport>

        <InViewport threshold={0.08} dataAttr="whya-in-view">
          <div className="mt-4 sm:mt-5">
            <div className="grid grid-cols-1 gap-4 sm:hidden">
              {problems.map((problem, i) => (
                <div
                  key={problem.number}
                  className="why-card relative flex flex-col rounded-[1.5rem] border border-neutral-200/60 bg-white p-5 shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-elevated"
                  style={{ animationDelay: `${0.1 + i * 0.15}s` }}
                >
                  <PurposeCard
                    number={problem.number}
                    title={problem.title}
                    description={problem.description}
                    icon={problem.icon}
                    indicator={problem.indicator}
                  />
                  {i < problems.length - 1 && (
                    <div className="absolute bottom-[-0.85rem] left-1/2 flex -translate-x-1/2 justify-center">
                      <span className="text-sm text-neutral-300">↓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="hidden sm:block">
              <div className="grid grid-cols-3 gap-4 lg:gap-5">
                {problems.map((problem, i) => (
                  <div
                    key={problem.number}
                    className="why-card group relative flex flex-col rounded-[1.5rem] border border-neutral-200/60 bg-white p-5 shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-elevated"
                    style={{ animationDelay: `${0.1 + i * 0.15}s` }}
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-[1.5rem] bg-gradient-to-r from-transparent via-accent-400/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <PurposeCard
                      number={problem.number}
                      title={problem.title}
                      description={problem.description}
                      icon={problem.icon}
                      indicator={problem.indicator}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <svg className="h-4 w-4 text-accent-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                <svg className="h-4 w-4 text-accent-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </div>
        </InViewport>

        <InViewport threshold={0.2} dataAttr="whya-clear-in-view">
          <div className="whya-clear mt-4 sm:mt-5 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-neutral-200/70 bg-white/90 px-4 py-2 text-[13px] shadow-card">
              <span className="flex h-2.5 w-2.5 items-center justify-center">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-600" />
              </span>
              <span className="font-medium text-neutral-400">Hiring Complexity</span>
              <svg className="h-3.5 w-3.5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
              <span className="font-medium text-navy-900">HireAI</span>
              <svg className="h-3.5 w-3.5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
              <span className="font-semibold text-accent-700">Hiring Clarity</span>
            </div>
          </div>
        </InViewport>
      </div>
    </section>
  );
}

function PurposeCard({
  number,
  title,
  description,
  icon,
  indicator,
}: {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
  indicator: { label: string; width: string; color: string };
}) {
  return (
    <>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-600 shadow-card transition-all duration-250">
          {icon}
        </div>
        <span className="text-[13px] font-bold text-accent-600">{number}</span>
      </div>

      <h3 className="mb-2 text-[1.1rem] font-bold text-navy-900">{title}</h3>

      <p className="mb-4 text-[0.93rem] leading-[1.55] text-neutral-500">
        {description}
      </p>

      <div className="mt-auto space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-neutral-500">
          <span>{indicator.label}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className={`h-full rounded-full ${indicator.color}`}
            style={{ width: indicator.width }}
          />
        </div>
      </div>
    </>
  );
}
