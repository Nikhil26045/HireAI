"use client";

import InViewport from "../home/InViewport";

const points = [
  {
    number: "01",
    title: "Faster Candidate Evaluation",
    description: "Surface the signals that matter so recruiters can move through candidates quickly.",
    icon: (
      <svg className="h-4 w-4 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Clearer Hiring Signals",
    description: "Turn messy candidate information into structured, explainable evaluation summaries.",
    icon: (
      <svg className="h-4 w-4 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6a2 2 0 012-2h1a1 1 0 010 2V6a2 2 0 100 4H5a1 1 0 010-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 6V4a2 2 0 114 0v2m-4 12V8a2 2 0 012-2h4a2 2 0 012 2v8m-8 4h8" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Human-in-the-Loop Decisions",
    description: "Keep recruiters in control — HireAI informs, you decide.",
    icon: (
      <svg className="h-4 w-4 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v5.25m0 7.5V9.75m0 0l3 3m-3-3l-3 3M12 4.5V3m6 15h2.25a.75.75 0 010 1.5H5.75a.75.75 0 010-1.5H8.25" />
      </svg>
    ),
  },
];

export default function PurposeSection() {
  return (
    <section className="relative bg-accent-50/40 py-6 sm:py-8 lg:py-10 overflow-hidden">
      {/* Subtle background decoration — single soft orb + grid */}
      <div className="pointer-events-none absolute -right-32 -top-16 h-[300px] w-[300px] rounded-full bg-white/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]" data-dot-pattern style={{ color: "#5F718F" }} />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-[240px] w-[240px] rounded-full bg-navy-900/[0.02]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 2xl:max-w-[1360px]">
        <InViewport threshold={0.1} dataAttr="purpose-in-view">
          {/* Framed content container — large rounded card */}
          <div className="purpose-frame relative mx-auto max-w-6xl rounded-[2.25rem] border border-neutral-200/60 bg-white/90 shadow-card py-10 sm:rounded-[2.5rem] sm:py-12">
            {/* Soft inner glow */}
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-accent-100/40 via-transparent to-transparent blur-3xl" />

            <div className="grid grid-cols-1 items-center gap-10 px-8 sm:px-10 lg:grid-cols-2 lg:gap-12 lg:px-14">
              {/* LEFT: editorial statement */}
              <div className="purpose-editorial">
                {/* Eyebrow */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-1.5 w-1.5 items-center justify-center rounded-full bg-accent-600" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-700">
                    OUR PURPOSE
                  </span>
                </div>

                <h2 className="text-[1.9rem] font-extrabold leading-[1.18] tracking-tight text-navy-900 sm:text-[2.1rem] md:text-[2.3rem] lg:text-[2.4rem]">
                  Technology should help people make better{" "}
                  <span className="text-accent-700">hiring decisions</span> — not make the{" "}
                  <span className="text-accent-700">decision</span> for them.
                </h2>

                <p className="mt-4 max-w-md text-[1.05rem] leading-[1.65] text-neutral-500">
                  HireAI is designed to reduce the complexity of candidate evaluation while keeping recruiters in control of the decisions that matter.
                </p>

                {/* AI-assisted / Human-led product badge */}
                <div className="purpose-badge mt-5 inline-flex items-center gap-1.5 rounded-full border border-neutral-200/70 bg-white/90 px-3.5 py-1.5 text-[13px] font-medium text-navy-800 shadow-sm">
                  <span className="flex h-3 w-3 items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-accent-600" />
                  </span>
                  AI-assisted
                  <span className="mx-1 h-3 w-px bg-neutral-300" />
                  <span className="font-semibold text-accent-700">Human-led</span>
                </div>
              </div>

              {/* RIGHT: three premium feature cards + vertical connector */}
              <div className="relative">
                {/* Growing vertical connecting line */}
                <div
                  className="purpose-connector pointer-events-none absolute top-0 bottom-0 left-[1.6rem] w-px bg-neutral-200"
                  data-line
                />
                {/* Connector nodes */}
                <div className="pointer-events-none absolute top-[1.75rem] left-[1.35rem] hidden h-2.5 w-2.5 rounded-full bg-accent-300 sm:block" />
                <div className="pointer-events-none absolute top-1/2 left-[1.35rem] hidden h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-accent-300 sm:block" />
                <div className="pointer-events-none absolute bottom-[1.75rem] left-[1.35rem] hidden h-2.5 w-2.5 rounded-full bg-accent-300 sm:block" />

                <div className="space-y-3.5 pt-2">
                  {points.map((point, i) => (
                    <div
                      key={point.title}
                      className="purpose-item group relative flex items-center gap-4 rounded-[1.375rem] border border-neutral-200/60 bg-white p-4.5 pl-14 shadow-card transition-all duration-250 hover:-translate-y-1 hover:border-accent-300 hover:shadow-elevated"
                      style={{ animationDelay: `${0.4 + i * 0.12}s` }}
                    >
                      {/* Number badge with gradient */}
                      <div className="purpose-badge-number absolute left-0 top-1/2 flex h-9 w-9 -translate-x-[0.6rem] -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-accent-500 to-accent-600 text-[11px] font-bold text-white shadow-sm">
                        {point.number}
                      </div>

                      {/* Tiny icon */}
                      <div className="flex-shrink-0">{point.icon}</div>

                      <div className="flex-1">
                        <h3 className="text-[1.05rem] font-semibold text-navy-900">{point.title}</h3>
                        <p className="mt-0.5 text-[0.92rem] leading-[1.55] text-neutral-500">
                          {point.description}
                        </p>
                      </div>

                      <span
                        className="flex-shrink-0 text-xl text-neutral-300 transition-all duration-250 group-hover:text-accent-500 group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </InViewport>
      </div>
    </section>
  );
}
