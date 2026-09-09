"use client";

import InViewport from "../home/InViewport";
import useCountUp from "./useCountUp";

const metrics = [
  {
    target: 1,
    suffix: "",
    label: "Unified Evaluation",
    description: "All candidate signals consolidated into a single, coherent profile.",
    color: "navy",
    index: 0,
  },
  {
    target: 6,
    suffix: "+",
    label: "Core Evaluation Signals",
    description: "Technical, communication, experience, and role-alignment dimensions evaluated.",
    color: "blue",
    index: 1,
  },
  {
    target: 0,
    suffix: "",
    label: "Powered Intelligence",
    description: "Machine learning surfaces patterns humans review, not replace.",
    color: "accent",
    index: 2,
    isText: true,
  },
  {
    target: 24,
    suffix: "/7",
    label: "Digital Assistance",
    description: "HireAI is always available to support recruiter workflows.",
    color: "blue",
    index: 3,
  },
];

const icons = [
  <svg key="profile" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-3.65-3.65 9.337 9.337 0 00-.952-4.121c-.758 1.043-1.847 1.847-3.183 2.25M15 19.128V15m0 0a48.111 48.111 0 00-3.183-2.25M15 19.128v-4.5m0 4.5a48.111 48.111 0 013.183-2.25M15 19.128a48.111 48.111 0 01-3.183-2.25M9 15a48.111 48.111 0 013.183-2.25M9 15V9.75m0 4.5a48.111 48.111 0 00-3.183 2.25M9 15a48.111 48.111 0 01-3.183-2.25M9 15V9.75m0 4.5v4.5m0-4.5a48.111 48.111 0 013.183 2.25M9 15V9.75m0 4.5v4.5m4.5-4.5v4.5m0-4.5a48.111 48.111 0 00-3.183 2.25M15 9.75V15m0 0v4.5m0-4.5a48.111 48.111 0 00-3.183-2.25M15 9.75V15m0 0v4.5" />
  </svg>,
  <svg key="chart" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 15.375v-2.25zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-8.25zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>,
  <svg key="spark" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>,
  <svg key="clock" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
];

export default function MetricsSection() {
  const [countA] = useCountUp(100, 1600, 0.4);
  const [countB] = useCountUp(6, 1600, 0.4);
  const [countC] = useCountUp(24, 1600, 0.4);

  const counters = [countA, countB, undefined, countC];

  return (
    <section className="relative bg-white py-10 sm:py-12 lg:py-14">
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]" data-dot-pattern style={{ color: "#5F718F" }} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 2xl:max-w-[1360px]">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 flex justify-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
              By the Numbers
            </span>
          </div>
          <h2 className="text-[2rem] font-bold leading-[1.15] tracking-tight text-navy-900 sm:text-[2.25rem] md:text-[2.4rem]">
            HireAI by the Numbers
          </h2>
          <p className="mt-3 text-[1.05rem] leading-[1.65] text-neutral-500">
            Product capabilities that power every evaluation.
          </p>
        </div>

        <InViewport threshold={0.15} dataAttr="counter-in-view">
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, i) => (
              <div
                key={metric.label}
                className="counter-card counter-card-blue group flex flex-col items-center rounded-2xl border border-neutral-200/80 bg-white/90 p-6 text-center shadow-card transition-all duration-250 hover:-translate-y-1 hover:border-accent-300 hover:shadow-elevated"
                style={{
                  animationDelay: `${i * 0.12}s`,
                  backgroundImage:
                    metric.color === "blue"
                      ? "linear-gradient(135deg, rgba(228, 234, 245, 0.3) 0%, rgba(245, 248, 252, 0.6) 100%)"
                      : metric.color === "accent"
                        ? "linear-gradient(135deg, rgba(232, 240, 251, 0.4) 0%, rgba(245, 248, 252, 0.6) 100%)"
                        : "linear-gradient(135deg, rgba(245, 248, 252, 0.3) 0%, rgba(241, 245, 250, 0.5) 100%)",
                }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-accent-400/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100 text-accent-600 transition-colors duration-250 group-hover:bg-accent-200">
                  {icons[i]}
                </div>

                <div className="mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400">
                    {"0" + (i + 1)}
                  </span>
                </div>

                <div className="mb-3 text-[2.6rem] font-extrabold leading-none tabular-nums text-navy-900">
                  {metric.isText ? (
                    <span className="text-navy-900">AI</span>
                  ) : metric.index === 3 ? (
                    <span className="text-navy-900">
                      {counters[3] !== undefined ? counters[3] : 24}
                      <span className="text-accent-600">{metric.suffix}</span>
                    </span>
                  ) : metric.suffix === "%" ? (
                    <span className="text-navy-900">{counters[0] !== undefined ? counters[0] : 0}%</span>
                  ) : metric.suffix === "+" ? (
                    <span className="text-navy-900">{counters[1] !== undefined ? counters[1] : 0}+</span>
                  ) : (
                    <span className="text-navy-900">{metric.target}</span>
                  )}
                </div>

                <h3 className="mb-1 text-[1.05rem] font-semibold text-navy-900">{metric.label}</h3>
                <p className="text-[0.88rem] leading-[1.55] text-neutral-500">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </InViewport>
      </div>
    </section>
  );
}
