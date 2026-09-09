"use client";

import Image from "next/image";
import Badge from "@/components/ui/Badge";
import AnimatedScoreRing from "../home/AnimatedScoreRing";
import InViewport from "../home/InViewport";

const signals = [
  { label: "Technical Skills", value: 92 },
  { label: "Communication", value: 84 },
  { label: "Experience", value: 86 },
  { label: "Role Alignment", value: 89 },
];

const explainers = [
  {
    number: "01",
    title: "Skills Match",
    description: "Compares candidate skills with the requirements of the role.",
  },
  {
    number: "02",
    title: "Experience Relevance",
    description: "Identifies experience that aligns with the position.",
  },
  {
    number: "03",
    title: "Communication",
    description: "Highlights communication strengths and areas for improvement.",
  },
];

export default function ExplainableAISection() {
  return (
    <section className="relative bg-navy-900 py-10 sm:py-12 lg:py-14 overflow-hidden">
      <div className="pointer-events-none absolute -left-32 -top-32 h-[440px] w-[440px] rounded-full bg-accent-600/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-[400px] w-[400px] rounded-full bg-accent-500/8 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 2xl:max-w-[1360px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 items-start">
          {/* Left: content */}
          <InViewport threshold={0.2} dataAttr="exw-in-view">
            <div>
              <h2 className="text-[2rem] font-bold leading-[1.15] tracking-tight text-white sm:text-[2.25rem] md:text-[2.4rem]">
                Don&apos;t just get a score.
                <br />
                <span className="text-accent-400">Understand the signal behind it.</span>
              </h2>
              <p className="mt-3 text-[1.1rem] leading-[1.65] text-neutral-300">
                HireAI is designed to make candidate evaluation easier to understand by showing the factors behind an overall evaluation.
              </p>

              {/* Evaluation visualization panel (larger) */}
              <div className="mt-6 rounded-2xl border border-neutral-700/60 bg-neutral-800/50 p-5 shadow-card">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[1.1rem] font-semibold text-white">Overall Match</h3>
                  <Badge variant="success" className="text-[11px] font-bold">
                    87%
                  </Badge>
                </div>

                <div className="mb-5 flex items-center justify-center">
                  <AnimatedScoreRing score={87} size={120} strokeWidth={10} className="text-white" />
                </div>

                <div className="space-y-3">
                  {signals.map((signal, i) => (
                    <div
                      key={signal.label}
                      className="exw-bar flex items-center gap-3"
                      style={{
                        animationDelay: `${0.3 + i * 0.1}s`,
                        "--bar-pct": `${signal.value}%`,
                      } as React.CSSProperties}
                    >
                      <span className="w-28 text-[13px] text-neutral-300">{signal.label}</span>
                      <div className="flex-1">
                        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-600">
                          <div
                            className="exw-bar-fill h-full rounded-full bg-accent-500"
                            style={{ transitionDelay: `${0.4 + i * 0.1}s` }}
                          />
                        </div>
                      </div>
                      <span className="w-9 text-right text-[13px] font-semibold text-white tabular-nums">{signal.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-neutral-700/40 bg-neutral-800/30 p-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                  Why this score?
                </p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-1.5 text-[12px] text-neutral-300">
                    <svg className="h-3.5 w-3.5 flex-shrink-0 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Strong technical alignment (92%)
                  </li>
                  <li className="flex items-center gap-1.5 text-[12px] text-neutral-300">
                    <svg className="h-3.5 w-3.5 flex-shrink-0 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    High role compatibility (89%)
                  </li>
                  <li className="flex items-center gap-1.5 text-[12px] text-neutral-300">
                    <svg className="h-3.5 w-3.5 flex-shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    Communication could be stronger (84%)
                  </li>
                </ul>
              </div>
            </div>
          </InViewport>

          {/* Right: image + compact insights */}
          <InViewport threshold={0.12} dataAttr="exw-img-in-view">
            <div className="flex flex-col gap-4">
              <div className="relative" style={{ animationDelay: "0.3s" }}>
                <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-accent-500/20 via-accent-500/8 to-transparent blur-2xl" />
                <div className="overflow-hidden rounded-[1.5rem] border border-neutral-700/40 bg-neutral-800/50 shadow-navy lg:h-[420px]">
                  <Image
                    src="/explainable_ai.webp"
                    alt="Explainable AI evaluation interface"
                    width={560}
                    height={420}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 1024px) 100vw, 540px"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-700/60 bg-neutral-800/50 p-5 shadow-card">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                  How HireAI Explains the Signal
                </p>
                <div className="space-y-3">
                  {explainers.map((item) => (
                    <div key={item.number} className="flex items-start gap-3">
                      <span className="mt-0.5 text-[11px] font-semibold text-accent-500">{item.number}</span>
                      <div className="flex-1">
                        <div className="h-px w-full bg-gradient-to-r from-accent-500/40 via-accent-500/20 to-transparent" />
                        <div className="mt-1">
                          <div className="text-[13px] font-semibold text-white">{item.title}</div>
                          <p className="mt-0.5 text-[12px] leading-[1.55] text-neutral-300">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 h-px w-full bg-neutral-700/60" />

                <p className="mt-3 text-[12px] font-medium italic text-neutral-300">
                  AI analyzes the signals. Recruiters make the decision.
                </p>
              </div>
            </div>
          </InViewport>
        </div>
      </div>
    </section>
  );
}
