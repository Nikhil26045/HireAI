"use client";

import Link from "next/link";
import InViewport from "../home/InViewport";

export default function AboutCTA() {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-12 sm:py-14 lg:py-16">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-accent-600/14 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 -bottom-32 h-[380px] w-[380px] rounded-full bg-accent-500/9 blur-3xl" />
      {/* Subtle animated blue radial behind content */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/8 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8 lg:px-10">
        <InViewport threshold={0.2} dataAttr="cta-in-view">
          <div>
            <div className="mb-4 flex justify-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-accent-300">
                Ready to act?
              </span>
            </div>
            <h2 className="cta-headline text-[2rem] font-bold leading-[1.1] tracking-tight text-white sm:text-[2.3rem] md:text-[2.5rem]">
              Ready to hire with more clarity?
            </h2>
            <p className="cta-paragraph mx-auto mt-3 max-w-2xl text-[1.1rem] leading-[1.65] text-neutral-300">
              Explore how HireAI can help transform candidate evaluation into a faster, clearer, and more informed process.
            </p>
            <div className="cta-buttons mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <span className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-[15px] font-semibold text-navy-900 shadow-navy transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated">
                  Explore HireAI
                </span>
              </Link>
              <Link href="/contact">
                <span className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-transparent px-6 py-3 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10">
                  Contact Us
                </span>
              </Link>
            </div>
          </div>
        </InViewport>
      </div>
    </section>
  );
}
