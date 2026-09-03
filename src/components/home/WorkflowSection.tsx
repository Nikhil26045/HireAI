"use client";

import InViewport from "./InViewport";
import ProgressiveLine from "./ProgressiveLine";

const steps = [
  {
    number: "01",
    title: "Upload Resume",
    description: "Candidate information and experience are collected.",
  },
  {
    number: "02",
    title: "Structured Interview",
    description: "Candidate responses provide additional evaluation signals.",
  },
  {
    number: "03",
    title: "AI Analysis",
    description: "NLP and speech-related analysis process the available information.",
  },
  {
    number: "04",
    title: "Capability Scoring",
    description: "Signals are combined into structured capability dimensions.",
  },
  {
    number: "05",
    title: "Recruiter Insights",
    description: "Recruiters receive understandable evaluation insights.",
  },
];

export default function WorkflowSection() {
  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-navy-900 sm:text-[2.25rem]">
            From Resume to{" "}
            <span className="text-accent-600">Candidate Insight</span>.
          </h2>
          <p className="mt-3 text-[1.05rem] leading-[1.6] text-neutral-500">
            A simple, structured evaluation workflow that turns raw information into clear insights.
          </p>
        </div>

        <div className="mt-12">
          {/* Desktop horizontal workflow */}
          <div className="hidden lg:block">
            <InViewport threshold={0.15} dataAttr="wf-in-view">
              <div className="relative flex items-start justify-between">
                <ProgressiveLine className="absolute left-[8%] right-[8%] top-7" delay={500} />
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className="group relative flex w-[18%] flex-col items-center text-center wf-step"
                    style={{ transitionDelay: `${index * 0.12}s` }}
                  >
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-200 bg-white text-[13px] font-bold text-accent-600 shadow-card transition-all duration-300 group-hover:border-accent-400 group-hover:shadow-elevated group-hover:-translate-y-0.5">
                      {step.number}
                    </div>
                    <h3 className="mt-4 text-[14px] font-semibold text-navy-900">{step.title}</h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-neutral-500">{step.description}</p>
                  </div>
                ))}
              </div>
            </InViewport>
          </div>

          {/* Tablet horizontal workflow */}
          <div className="mt-8 hidden sm:block lg:hidden">
            <InViewport threshold={0.15} dataAttr="wf-in-view">
              <div className="relative flex items-start justify-between gap-2">
                <ProgressiveLine className="absolute left-[8%] right-[8%] top-6" delay={500} />
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className="relative flex flex-1 flex-col items-center text-center wf-step"
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-accent-200 bg-white text-[11px] font-bold text-accent-600 shadow-card">
                      {step.number}
                    </div>
                    <h3 className="mt-3 text-[12px] font-semibold text-navy-900">{step.title}</h3>
                  </div>
                ))}
              </div>
            </InViewport>
          </div>

          {/* Mobile vertical workflow */}
          <div className="mt-6 space-y-2.5 sm:hidden">
            <InViewport threshold={0.15} dataAttr="wf-in-view">
              <div>
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className="relative flex gap-3 wf-step-mobile"
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    {index < steps.length - 1 && (
                      <div className="absolute left-5 top-10 h-full w-px bg-accent-200" />
                    )}
                    <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-accent-200 bg-white text-[12px] font-bold text-accent-600 shadow-card">
                      {step.number}
                    </div>
                    <div className="pt-1">
                      <h3 className="text-[13px] font-semibold text-navy-900">{step.title}</h3>
                      <p className="mt-0.5 text-[11px] text-neutral-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </InViewport>
          </div>
        </div>
      </div>
    </section>
  );
}
