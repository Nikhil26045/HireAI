"use client";

import Link from "next/link";
import InViewport from "./InViewport";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-14 sm:py-16 lg:py-20">
      {/* Subtle navy glow */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-accent-600/12 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 -bottom-32 h-[400px] w-[400px] rounded-full bg-accent-500/10 blur-3xl" />
      {/* Center ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/10 blur-3xl hf-glow-drift" />
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <InViewport threshold={0.2} dataAttr="cta-in-view">
        <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-8 lg:px-10">
          <h2 className="cta-headline text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-[2.25rem]">
            Ready to Evaluate Candidates with More Context?
          </h2>
          <p className="cta-paragraph mx-auto mt-3 max-w-2xl text-[1.05rem] leading-[1.6] text-neutral-300">
            Bring resume intelligence, interview analysis and explainable AI insights into one recruitment workflow.
          </p>
          <div className="cta-buttons mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-[15px] font-semibold text-navy-900 shadow-navy transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-100 active:translate-y-0"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-transparent px-5 py-2.5 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0"
            >
              Explore HireAI
            </Link>
          </div>
        </div>
      </InViewport>
    </section>
  );
}
