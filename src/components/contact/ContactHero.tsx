"use client";

import Badge from "@/components/ui/Badge";
import ScrollReveal from "@/components/home/ScrollReveal";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden border-b border-accent-100/70 bg-gradient-to-br from-white via-accent-50/35 to-indigo-50/45 py-12 sm:py-14 lg:py-16">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-accent-100/35 blur-[90px]" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-indigo-100/40 blur-[100px]" />
        <div className="absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-blue-100/25 blur-[80px]" />
      </div>

      {/* Subtle dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        data-dot-pattern
        style={{ color: "#2563EB" }}
      />

      <div className="relative mx-auto max-w-[1250px] px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* ─────────────────────────────
              LEFT — HERO CONTENT
          ───────────────────────────── */}
          <div className="max-w-2xl">
            <ScrollReveal variant="reveal" delay={0}>
              <Badge variant="primary" className="mb-4">
                GET IN TOUCH
              </Badge>
            </ScrollReveal>

            <ScrollReveal variant="reveal" delay={80}>
              <h1 className="text-[2.45rem] font-extrabold leading-[1.03] tracking-[-0.045em] text-navy-900 sm:text-[3.15rem] lg:text-[4rem]">
                Let&rsquo;s build better{" "}
                <span className="bg-gradient-to-r from-accent-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  hiring experiences.
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="reveal" delay={160}>
              <p className="mt-5 max-w-xl text-[1rem] leading-7 text-neutral-600 sm:text-[1.08rem]">
                Have a question, want to explore HireAI, or simply want to
                talk? Connect with us and let&rsquo;s make hiring more
                structured, intelligent, and human.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="reveal" delay={240}>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-accent-100 bg-white/80 px-3.5 py-2 shadow-card backdrop-blur-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-semibold text-neutral-600">
                    We&rsquo;re here to help
                  </span>
                </div>

                <div className="rounded-full border border-accent-100/80 bg-accent-50/70 px-3.5 py-2 text-[11px] font-semibold text-accent-700">
                  Recruiters · Teams · Candidates
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ─────────────────────────────
              RIGHT — ABSTRACT CONNECTION VISUAL
          ───────────────────────────── */}
          <ScrollReveal variant="reveal" delay={180}>
            <div className="relative mx-auto w-full max-w-[520px]">
              <div className="relative h-[285px] overflow-hidden rounded-[2rem] border border-white/80 bg-white/65 p-5 shadow-[0_25px_70px_rgba(6,20,47,0.12)] backdrop-blur-md sm:h-[320px] sm:p-7">
                {/* Inner atmospheric gradients */}
                <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent-100/60 blur-[70px]" />
                <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-indigo-100/70 blur-[70px]" />

                {/* Top label */}
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-600">
                      Connected intelligence
                    </p>
                    <p className="mt-1 text-sm font-semibold text-navy-900">
                      Every conversation starts somewhere.
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-100 bg-white/90 text-accent-600 shadow-card">
                    <span className="text-xs font-extrabold">AI</span>
                  </div>
                </div>

                {/* Connection visual */}
                <div className="absolute inset-x-8 bottom-7 top-[92px]">
                  {/* Connection lines */}
                  <div className="absolute left-[23%] top-[30%] h-px w-[54%] rotate-[-8deg] bg-gradient-to-r from-transparent via-accent-300 to-transparent" />
                  <div className="absolute left-[23%] top-[52%] h-px w-[54%] rotate-[7deg] bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
                  <div className="absolute left-[35%] top-[15%] h-[75%] w-px rotate-[22deg] bg-gradient-to-b from-transparent via-accent-200 to-transparent" />
                  <div className="absolute left-[63%] top-[15%] h-[75%] w-px rotate-[-18deg] bg-gradient-to-b from-transparent via-indigo-200 to-transparent" />

                  {/* Central intelligence core */}
                  <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute -inset-4 animate-pulse rounded-full bg-accent-200/30 blur-xl" />

                    <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-accent-200 bg-gradient-to-br from-white via-accent-50 to-indigo-50 shadow-[0_12px_35px_rgba(37,99,235,0.18)] transition-transform duration-500 hover:scale-105">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-[11px] font-extrabold tracking-wide text-white shadow-lg">
                        AI
                      </div>
                    </div>
                  </div>

                  {/* Floating signal nodes */}
                  <SignalNode
                    className="left-[7%] top-[21%]"
                    label="Resume"
                    delay="0s"
                  />

                  <SignalNode
                    className="right-[5%] top-[18%]"
                    label="Interview"
                    delay="1.2s"
                  />

                  <SignalNode
                    className="bottom-[10%] left-[10%]"
                    label="Skills"
                    delay="2.2s"
                  />

                  <SignalNode
                    className="bottom-[8%] right-[7%]"
                    label="People"
                    delay="0.7s"
                  />
                </div>

                {/* Bottom status */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl border border-white/80 bg-white/75 px-3.5 py-2.5 shadow-card backdrop-blur-md sm:left-7 sm:right-7">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.55)]" />
                    <span className="text-[10px] font-semibold text-neutral-600">
                      Ready to connect
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent-600">
                    HireAI
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Local animation styles */}
      <style jsx>{`
        @keyframes contact-node-float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        .contact-node-float {
          animation: contact-node-float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

function SignalNode({
  className,
  label,
  delay,
}: {
  className: string;
  label: string;
  delay: string;
}) {
  return (
    <div
      className={`absolute z-10 contact-node-float ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-2 rounded-full border border-white/90 bg-white/90 px-2.5 py-1.5 shadow-card backdrop-blur-sm">
        <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-accent-50">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
          <span className="absolute inset-0 animate-ping rounded-full bg-accent-300/30" />
        </span>

        <span className="text-[10px] font-bold text-navy-900">
          {label}
        </span>
      </div>
    </div>
  );
}