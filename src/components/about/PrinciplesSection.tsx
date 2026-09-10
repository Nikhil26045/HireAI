"use client";

import Image from "next/image";
import InViewport from "../home/InViewport";

const principles = [
  {
    number: "01",
    title: "Relevance Over Volume",
    description: "Focus on the signals that matter for the role.",
  },
  {
    number: "02",
    title: "Transparency Over Black Boxes",
    description: "AI-assisted decisions should be understandable.",
  },
  {
    number: "03",
    title: "AI + Human Judgment",
    description: "Technology should empower recruiters, not replace them.",
  },
  {
    number: "04",
    title: "Fairness by Design",
    description: "Build evaluation processes that encourage consistency and reduce unnecessary bias.",
  },
  {
    number: "05",
    title: "Better Decisions, Faster",
    description: "Reduce repetitive work so recruiters can focus on meaningful decisions.",
  },
];

export default function PrinciplesSection() {
  return (
    <section className="relative bg-white pt-6 sm:pt-8 lg:pt-10 pb-10 sm:pb-12 lg:pb-14 overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-accent-100/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-[380px] w-[380px] rounded-full bg-accent-50/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]" data-dot-pattern style={{ color: "#5F718F" }} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 2xl:max-w-[1360px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.46fr_0.54fr] lg:gap-16 items-start">
          {/* LEFT — Image */}
          <InViewport threshold={0.1} dataAttr="princ-img-in-view" className="principle-image-col">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <div className="relative overflow-hidden rounded-[1.5rem] border border-neutral-200/60 bg-white shadow-card lg:aspect-[1/1]">
                  <Image
                    src="/evaluation.webp"
                    alt="HireAI candidate evaluation interface"
                    width={560}
                    height={560}
                    className="h-auto w-full object-cover lg:h-full lg:w-full"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>

                <div className="hidden sm:flex absolute -top-3 -right-3 items-center gap-2 rounded-full border border-neutral-200/80 bg-white/95 px-3 py-1.5 text-[11px] font-medium text-navy-800 shadow-card">
                  <span className="flex h-3 w-3 items-center justify-center rounded-full bg-accent-500/15">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-600" />
                  </span>
                  AI-assisted
                </div>

                <div className="hidden lg:flex absolute -right-3 top-1/2 h-16 w-1 -translate-y-1/2 flex-col items-center justify-center gap-1">
                  <div className="h-1 w-1 rounded-full bg-accent-400" />
                  <div className="h-1 w-1 rounded-full bg-accent-300" />
                  <div className="h-1 w-1 rounded-full bg-accent-200" />
                </div>
              </div>
          </InViewport>

          {/* RIGHT — Content */}
          <InViewport threshold={0.1} dataAttr="princ-in-view" className="principle-content-col">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/70 bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-700">
                  <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-accent-600" />
                  WHAT WE BELIEVE
                </span>
              </div>
              <h2 className="text-[2rem] font-bold leading-[1.12] tracking-tight text-navy-900 sm:text-[2.2rem] lg:text-[2.4rem]">
                Technology should make{" "}
                <span className="bg-gradient-to-r from-accent-600 via-accent-500 to-accent-700 bg-clip-text text-transparent">
                  hiring clearer
                </span>
                , not colder.
              </h2>
              <p className="mt-2.5 text-[1.05rem] leading-[1.65] text-neutral-500">
                At HireAI, AI is designed to support better judgment — not replace it.
              </p>

              <div className="relative mt-5">
                <div className="absolute left-[0.35rem] top-1 bottom-1 w-px bg-gradient-to-b from-accent-200/60 via-accent-300/40 to-accent-200/60 hidden sm:block" />

                <div className="space-y-0">
                  {principles.map((principle, i) => (
                    <div
                      key={principle.number}
                      className="principle-item group relative py-2 sm:py-2.5"
                    >
                      {i !== principles.length - 1 && (
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-200/70 transition-all duration-300 group-hover:bg-accent-200/80 group-hover:h-[2px]" />
                      )}
                      <div className="flex items-start gap-3 sm:gap-4">
                        <span className="principle-num relative z-10 mt-0.5 text-[12px] font-semibold text-neutral-400 transition-colors duration-300 group-hover:text-accent-600">
                          {principle.number}
                        </span>
                        <div className="flex-1">
                          <h3 className="text-[1rem] font-semibold text-navy-900 transition-transform duration-300 group-hover:translate-x-0.5">
                            {principle.title}
                          </h3>
                          <p className="mt-0.5 text-[0.88rem] leading-[1.55] text-neutral-500 transition-colors duration-300 group-hover:text-neutral-600">
                            {principle.description}
                          </p>
                        </div>
                        <div className="principle-arrow flex-shrink-0 pt-0.5 text-neutral-300 transition-all duration-300 group-hover:text-accent-500 group-hover:translate-x-1">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </InViewport>
        </div>
      </div>
    </section>
  );
}
