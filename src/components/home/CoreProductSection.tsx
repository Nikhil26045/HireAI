"use client";

import InViewport from "./InViewport";
import ProgressiveLine from "./ProgressiveLine";

const dimensions = ["Skills", "Communication", "Problem Solving", "Behavioral"];

const flowSteps = [
  { label: "Resume", subtitle: "Structured data" },
  { label: "Interview", subtitle: "Response signals" },
  { label: "AI Analysis", subtitle: "Multi-dimensional" },
  { label: "Capability Profile", subtitle: "Structured output" },
  { label: "Recruiter Insights", subtitle: "Decision support" },
];

export default function CoreProductSection() {
  return (
    <section className="relative overflow-hidden bg-accent-50/60 py-14 sm:py-16 lg:py-20">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent" />
      <div className="pointer-events-none absolute -right-32 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-white/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-navy-900 sm:text-[2.25rem]">
            One Candidate.
            <br />
            <span className="text-accent-600">More Than One Signal.</span>
          </h2>
          <p className="mt-3 text-[1.05rem] leading-[1.6] text-neutral-500">
            HireAI combines information from resumes and structured interviews to create a broader, explainable view of candidate capability.
          </p>
        </div>

        <InViewport threshold={0.2} className="mt-10 block" as="div" dataAttr="cp-in-view">
          <div className="cp-root">
            {/* Desktop flow */}
            <div className="hidden md:block">
              <div className="relative mx-auto max-w-4xl">
                <ProgressiveLine className="absolute left-[10%] right-[10%] top-[28px]" delay={300} />                <div className="relative flex items-start justify-between">
                  {flowSteps.map((step, index) => {
                    const isAI = index === 2;
                    return (
                      <div
                        key={step.label}
                        className="flex w-[20%] flex-col items-center cp-step"
                        data-step-index={index}
                        style={{ animationDelay: `${index * 0.12}s` }}
                      >
                        <div
                          className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 ${
                            isAI
                              ? "border-accent-500 bg-accent-600 text-white shadow-glow hf-ai-pulse"
                              : "border-accent-200 bg-white text-accent-600 shadow-card hover:border-accent-400 hover:shadow-elevated"
                          }`}
                        >
                          {isAI && (
                            <div className="absolute inset-0 rounded-2xl bg-accent-500/20" />
                          )}
                          {index === 0 && (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                          )}
                          {index === 1 && (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                            </svg>
                          )}
                          {index === 2 && (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                            </svg>
                          )}
                          {index === 3 && (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                          )}
                          {index === 4 && (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                            </svg>
                          )}
                        </div>
                        <p className={`mt-3 text-[13px] font-semibold ${isAI ? "text-accent-700" : "text-navy-800"}`}>
                          {step.label}
                        </p>
                        <p className="mt-0.5 text-[11px] text-neutral-400">{step.subtitle}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile flow */}
            <div className="md:hidden">
              <div className="mx-auto max-w-xs space-y-4">
                {flowSteps.map((step, index) => {
                  const isAI = index === 2;
                  return (
                    <div
                      key={step.label}
                      className="relative flex items-center gap-4 cp-step-mobile"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {index < flowSteps.length - 1 && (
                        <div className="absolute left-5 top-11 h-5 w-px bg-accent-200" />
                      )}
                      <div
                        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border ${
                          isAI
                            ? "border-accent-500 bg-accent-600 text-white shadow-glow"
                            : "border-accent-200 bg-white text-accent-600 shadow-card"
                        }`}
                      >
                        <span className="text-[12px] font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className={`text-[13px] font-semibold ${isAI ? "text-accent-700" : "text-navy-800"}`}>
                          {step.label}
                        </p>
                        <p className="text-[11px] text-neutral-400">{step.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dimension labels - output of capability profile */}
            <div className="mt-8 flex flex-col items-center cp-dims">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400">
                Capability outputs
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {dimensions.map((dim) => (
                  <span
                    key={dim}
                    className="rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-[12px] font-medium text-navy-700 shadow-card transition-all duration-200 hover:border-accent-300 hover:shadow-elevated"
                  >
                    {dim}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </InViewport>
      </div>
    </section>
  );
}
