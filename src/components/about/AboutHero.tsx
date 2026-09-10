"use client";

import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-6 sm:pt-8 lg:pt-8">
      {/* Ambient background orbs — sit entirely behind content (no upward bleed) */}
      <div className="pointer-events-none absolute -right-36 -top-6 h-[300px] w-[300px] rounded-full bg-accent-100/30 blur-3xl hf-glow-drift" />
      <div className="pointer-events-none absolute -left-16 -bottom-4 h-[260px] w-[260px] rounded-full bg-navy-900/[0.02] blur-3xl" />

      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        data-dot-pattern
        style={{ color: "#5F718F" }}
      />

      <div className="relative mx-auto max-w-7xl px-5 pt-0 sm:px-8 sm:pt-0 lg:px-10 lg:pt-0 2xl:max-w-[1360px]">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left content */}
          <div className="hf-stagger is-visible">
            <Badge variant="primary" className="mb-4">
              ABOUT HIREAI
            </Badge>

            <h1 className="text-[2.5rem] font-extrabold leading-[1.06] tracking-tight text-navy-900 sm:text-[3rem] md:text-[3.4rem] lg:text-[3.8rem]">
              Hiring should be smarter, fairer, and{" "}
              <span className="bg-gradient-to-r from-accent-600 via-accent-500 to-neutral-500 bg-clip-text text-transparent">
                human
              </span>
              .
            </h1>

            <p className="mt-4 max-w-lg text-[1.1rem] leading-[1.65] text-neutral-500">
              HireAI brings AI-powered candidate evaluation into the hiring process, helping recruiters understand talent faster, make better-informed decisions, and keep human judgment at the center.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg" className="bg-navy-800 px-7 hover:bg-navy-700 hover:shadow-navy">
                  Explore HireAI
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-neutral-300 px-7 text-navy-800 hover:border-accent-300 hover:bg-neutral-50">
                  Contact Us
                </Button>
              </Link>
            </div>

            {/* Capability strip */}
            <div className="mt-7 flex flex-wrap items-center gap-2.5 text-[13px] text-neutral-400">
              <span className="font-medium text-navy-800">Resume Analysis</span>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <span className="font-medium text-navy-800">Interview Insights</span>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <span className="font-medium text-navy-800">Explainable Scoring</span>
            </div>
          </div>

          {/* Right product visualization */}
          <div className="relative">
            {/* Background glow */}
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-accent-100/35 via-accent-50/15 to-transparent blur-2xl" />

            {/* Image container — relative parent so badges attach to the IMAGE, not the section */}
            <div className="relative mx-auto max-w-md">
              <div className="hf-card-float overflow-hidden rounded-[1.75rem] border border-neutral-200/60 bg-white shadow-elevated">
                <Image
                  src="/hero.webp"
                  alt="HireAI candidate evaluation dashboard"
                  width={720}
                  height={560}
                  priority
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 540px"
                />
              </div>

              {/* Floating UI badge — AI Evaluation (TOP-LEFT of image) */}
              <div className="pointer-events-none absolute left-2 top-3 hidden sm:block" style={{ animationDelay: "0.4s" }}>
                <div className="hf-badge-float inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/95 px-2.5 py-1.5 text-[11px] font-medium text-navy-800 shadow-card">
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent-500/15">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-600" />
                  </span>
                  AI Evaluation
                </div>
              </div>

              {/* Floating UI badge — Candidate Insights (BOTTOM-RIGHT of image) */}
              <div className="pointer-events-none absolute bottom-3 right-2 hidden sm:block" style={{ animationDelay: "1s" }}>
                <div className="hf-badge-float inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/95 px-2.5 py-1.5 text-[11px] font-medium text-navy-800 shadow-card">
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent-500/15">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-600" />
                  </span>
                  Candidate Insights
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
