"use client";

import AnimatedScoreRing from "./AnimatedScoreRing";
import InViewport from "./InViewport";

const scores = [
  { label: "Technical", value: 91 },
  { label: "Communication", value: 84 },
  { label: "Problem Solving", value: 88 },
  { label: "Behavioral", value: 85 },
];

const reasons = [
  {
    title: "Beyond the Resume",
    description: "Evaluate more than experience and keywords.",
  },
  {
    title: "Multiple Signals",
    description: "Combine resume and structured interview information.",
  },
  {
    title: "Explainable Insights",
    description: "Make evaluation results easier to understand.",
  },
  {
    title: "Human-Centered AI",
    description: "Support recruiter evaluation without replacing human judgment.",
  },
];

export default function ExplainableWhySection() {
  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left: Explainable AI */}
          <InViewport threshold={0.2} dataAttr="exw-in-view" className="exw-left">
            <div>
              <h2 className="text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-navy-900 sm:text-[2.25rem]">
                Don&apos;t Just Get a Score.
                <br />
                <span className="text-accent-600">Understand It.</span>
              </h2>
              <p className="mt-3 text-[1.05rem] leading-[1.6] text-neutral-500">
                HireAI presents evaluation signals in a way recruiters can review and understand rather than hiding everything behind a single number.
              </p>

              <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
                <div className="mb-4 flex items-center justify-center">
                  <AnimatedScoreRing score={87} size={120} strokeWidth={9} />
                </div>
                <InViewport threshold={0.2} dataAttr="exw-bars-in-view">
                  <div className="space-y-2.5">
                    {scores.map((score, i) => (
                      <div
                        key={score.label}
                        className="exw-bar flex items-center gap-3"
                        style={{ transitionDelay: `${0.3 + i * 0.08}s` }}
                      >
                        <span className="w-24 text-[13px] text-neutral-500">{score.label}</span>
                        <div className="flex-1">
                          <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
                            <div
                              className="exw-bar-fill h-full rounded-full bg-accent-500"
                              style={{ transitionDelay: `${0.4 + i * 0.08}s` }}
                            />
                          </div>
                        </div>
                        <span className="w-7 text-right text-[13px] font-semibold text-navy-900 tabular-nums">{score.value}</span>
                      </div>
                    ))}
                  </div>
                </InViewport>
              </div>
            </div>
          </InViewport>

          {/* Right: Why HireAI */}
          <InViewport threshold={0.2} dataAttr="exw-in-view" className="exw-right">
            <div>
              <h3 className="mb-4 text-[1.5rem] font-bold leading-[1.15] text-navy-900">Why HireAI?</h3>
              <InViewport threshold={0.2} dataAttr="exw-reasons-in-view">
                <div className="space-y-2.5">
                  {reasons.map((reason, i) => (
                    <div
                      key={reason.title}
                      className="exw-reason group flex gap-3 rounded-xl border border-neutral-200/80 bg-white p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-elevated"
                      style={{ transitionDelay: `${i * 0.1}s` }}
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent-100 transition-colors group-hover:bg-accent-200">
                        <svg className="h-4 w-4 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-semibold text-navy-900">{reason.title}</h4>
                        <p className="mt-0.5 text-[13px] text-neutral-500">{reason.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </InViewport>
              <div className="mt-4 rounded-lg border border-accent-200 bg-accent-50 p-3 text-[12px] text-accent-700">
                AI-generated insights are designed to support recruiter evaluation, not replace human judgment.
              </div>
            </div>
          </InViewport>
        </div>
      </div>
    </section>
  );
}
