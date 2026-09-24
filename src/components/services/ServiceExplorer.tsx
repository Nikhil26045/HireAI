"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  FileSearch,
  Video,
  CheckCircle,
  BarChart3,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Brain,
  TrendingUp,
} from "lucide-react";
import InViewport from "../home/InViewport";

/* =========================================================
   SERVICE DATA
========================================================= */

const services = [
  {
    id: 1,
    title: "Resume Intelligence",
    description:
      "Deep parsing and contextual understanding of candidate experiences to find the perfect match.",
    image: "/services-resume.avif",
    icon: FileSearch,
    iconColor: "text-accent-600",
    badge: "RESUME ANALYSIS",
  },
  {
    id: 2,
    title: "Interview Intelligence",
    description:
      "Automated transcripts, sentiment analysis, and highlight generation from video calls.",
    image: "/services-interview.avif",
    icon: Video,
    iconColor: "text-indigo-600",
    badge: "INTERVIEW AI",
  },
  {
    id: 3,
    title: "Candidate Assessment",
    description:
      "Objective scoring rubrics and skill validation modules to ensure technical competence.",
    customUI: "assessment",
    icon: CheckCircle,
    iconColor: "text-emerald-600",
    badge: "SKILL VALIDATION",
  },
  {
    id: 4,
    title: "Recruiter Dashboard",
    description:
      "Unified view of your candidate pipeline, advanced analytics, and actionable alerts.",
    image: "/services-recruiter.avif",
    icon: BarChart3,
    iconColor: "text-violet-600",
    badge: "RECRUITER INSIGHTS",
  },
  {
    id: 5,
    title: "Candidate Experience",
    description:
      "Branded portal for clear updates, automated scheduling, and seamless onboarding.",
    image: "/services-candidate.avif",
    icon: User,
    iconColor: "text-amber-500",
    badge: "CANDIDATE JOURNEY",
  },
  {
    id: 6,
    title: "AI Insights & Feedback",
    description:
      "Generative summaries and bias-flagging features for fairer, data-driven decisions.",
    customUI: "insights",
    icon: Sparkles,
    iconColor: "text-accent-600",
    badge: "AI INSIGHTS",
  },
];

/* =========================================================
   ASSESSMENT VISUAL
========================================================= */

function AssessmentVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70 p-5">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-200/30 blur-2xl" />

      <div className="relative mx-auto mt-2 w-full max-w-[300px] rounded-2xl border border-emerald-100 bg-white/95 p-4 shadow-[0_14px_40px_rgba(16,185,129,0.12)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">
              Candidate Score
            </p>

            <p className="mt-1 text-lg font-bold text-navy-900">
              Assessment
            </p>
          </div>

          <div className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-600">
            92/100
          </div>
        </div>

        <div className="space-y-3.5">
          <AssessmentBar
            label="Technical"
            value="92%"
            width="92%"
            color="bg-emerald-500"
          />

          <AssessmentBar
            label="Communication"
            value="85%"
            width="85%"
            color="bg-accent-500"
          />

          <AssessmentBar
            label="Culture Fit"
            value="78%"
            width="78%"
            color="bg-indigo-500"
          />
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-3">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />

          <span className="text-[10px] font-semibold text-neutral-500">
            Skills validated against role criteria
          </span>
        </div>
      </div>
    </div>
  );
}

function AssessmentBar({
  label,
  value,
  width,
  color,
}: {
  label: string;
  value: string;
  width: string;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          {label}
        </span>

        <span className="text-[10px] font-bold text-neutral-700">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`assessment-bar h-full rounded-full ${color}`}
          style={{ width }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   AI INSIGHTS VISUAL
========================================================= */

function InsightsVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100/70 p-5">
      <div className="absolute -left-8 -top-10 h-32 w-32 rounded-full bg-accent-200/30 blur-3xl" />

      <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative mx-auto mt-2 w-full max-w-[300px] rounded-2xl border border-blue-100 bg-white/95 p-4 shadow-[0_14px_40px_rgba(37,99,235,0.12)]">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
            <Brain className="h-4 w-4" />
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-400">
              AI Analysis
            </p>

            <p className="text-sm font-bold text-navy-900">
              Hiring Insights
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="h-2 rounded-full bg-neutral-100">
            <div className="insight-bar h-full w-[88%] rounded-full bg-accent-500" />
          </div>

          <div className="h-2 rounded-full bg-neutral-100">
            <div className="insight-bar h-full w-[72%] rounded-full bg-indigo-400" />
          </div>

          <div className="h-2 rounded-full bg-neutral-100">
            <div className="insight-bar h-full w-[57%] rounded-full bg-violet-400" />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-accent-600">
            Insight
          </span>

          <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-indigo-600">
            Bias Check
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-3">
          <TrendingUp className="h-4 w-4 text-accent-600" />

          <span className="text-[10px] font-semibold text-neutral-500">
            Structured feedback generated
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export function ServiceExplorer() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateControls = useCallback(() => {
    const element = scrollRef.current;

    if (!element) return;

    const maxScroll = element.scrollWidth - element.clientWidth;

    setCanLeft(element.scrollLeft > 5);
    setCanRight(element.scrollLeft < maxScroll - 5);
  }, []);

  useEffect(() => {
    updateControls();

    const element = scrollRef.current;

    if (!element) return;

    element.addEventListener("scroll", updateControls, {
      passive: true,
    });

    window.addEventListener("resize", updateControls);

    return () => {
      element.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, [updateControls]);

  const moveCarousel = (direction: "left" | "right") => {
    const element = scrollRef.current;

    if (!element) return;

    const cardWidth =
      window.innerWidth >= 1024
        ? 406
        : window.innerWidth >= 640
          ? 376
          : Math.min(window.innerWidth * 0.9, 360);

    element.scrollBy({
      left: direction === "right" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="explore"
      className="relative overflow-hidden bg-white py-12 sm:py-14 lg:py-16"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-180px] top-[-140px] h-[400px] w-[400px] rounded-full bg-blue-100/35 blur-[110px]" />

        <div className="absolute right-[-160px] top-[100px] h-[380px] w-[380px] rounded-full bg-indigo-100/30 blur-[110px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
      </div>

      {/* =====================================================
          CENTERED HEADER
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-6xl px-5 text-center sm:px-8">
        <InViewport threshold={0.15} dataAttr="hf-reveal">
          <div className="hf-reveal is-visible">
            {/* Label */}

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-700 shadow-[0_4px_18px_rgba(37,99,235,0.08)]">
              <Sparkles className="h-3.5 w-3.5 text-accent-600" />
              Capabilities
            </div>

            {/* Heading */}

            <h2 className="mx-auto max-w-4xl text-3xl font-bold leading-[1.08] tracking-tight text-navy-900 sm:text-4xl lg:text-[3.1rem]">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-accent-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                evaluate candidates.
              </span>
            </h2>

            {/* Description */}

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              A comprehensive suite of tools to bring clarity, speed, and
              fairness to your hiring process — powered by AI.
            </p>
          </div>
        </InViewport>
      </div>

      {/* =====================================================
          CAROUSEL AREA
      ===================================================== */}

      <div className="relative z-10 mt-9 sm:mt-10">
        {/* LEFT ARROW */}

        <button
          type="button"
          aria-label="Previous services"
          onClick={() => moveCarousel("left")}
          disabled={!canLeft}
          className="group absolute left-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-blue-100 bg-white/95 text-navy-900 shadow-[0_8px_28px_rgba(15,35,75,0.13)] backdrop-blur-md transition-all duration-300 hover:-translate-x-1 hover:border-accent-300 hover:bg-accent-50 hover:text-accent-600 disabled:pointer-events-none disabled:opacity-30 lg:flex"
        >
          <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        </button>

        {/* RIGHT ARROW */}

        <button
          type="button"
          aria-label="Next services"
          onClick={() => moveCarousel("right")}
          disabled={!canRight}
          className="group absolute right-2 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-accent-200 bg-accent-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.24)] transition-all duration-300 hover:translate-x-1 hover:bg-accent-700 hover:shadow-[0_14px_34px_rgba(37,99,235,0.3)] disabled:pointer-events-none disabled:opacity-30 lg:flex"
        >
          <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>

        {/* MOBILE ARROWS */}

        <div className="mb-4 flex justify-end gap-2 px-5 lg:hidden">
          <button
            type="button"
            aria-label="Previous services"
            onClick={() => moveCarousel("left")}
            disabled={!canLeft}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-navy-900 shadow-sm transition-all hover:bg-blue-50 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            aria-label="Next services"
            onClick={() => moveCarousel("right")}
            disabled={!canRight}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.2)] transition-all hover:bg-accent-700 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* CARDS */}

        <div
          ref={scrollRef}
          className="service-carousel hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-1 sm:gap-6 sm:px-8 lg:px-16"
        >
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <article
                key={service.id}
                className="service-card group relative flex min-w-0 flex-[0_0_330px] snap-start flex-col overflow-hidden rounded-[22px] border border-blue-100/80 bg-white shadow-[0_10px_35px_rgba(15,35,75,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_22px_50px_rgba(15,35,75,0.15)] sm:flex-[0_0_350px] lg:flex-[0_0_380px]"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* =================================================
                    VISUAL
                ================================================= */}

                <div className="relative h-[215px] w-full shrink-0 overflow-hidden bg-neutral-100">
                  {service.image ? (
                    <>
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 350px, 380px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/20 via-transparent to-transparent" />
                    </>
                  ) : service.customUI === "assessment" ? (
                    <AssessmentVisual />
                  ) : (
                    <InsightsVisual />
                  )}

                  {/* =================================================
                      UNIQUE SERVICE BADGE
                  ================================================= */}

                  <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/85 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-navy-900 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:bg-white">
                    {service.badge}
                  </div>
                </div>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="flex flex-1 flex-col px-5 pb-6 pt-5 sm:px-6">
                  {/* ICON */}

                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50/70 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:bg-white">
                    <Icon
                      className={`h-5 w-5 ${service.iconColor} transition-transform duration-300 group-hover:scale-110`}
                    />
                  </div>

                  {/* TITLE */}

                  <h3 className="text-xl font-bold tracking-tight text-navy-900 transition-colors duration-300 group-hover:text-accent-700">
                    {service.title}
                  </h3>

                  {/* DESCRIPTION */}

                  <p className="mt-2.5 text-[15px] leading-6 text-neutral-500">
                    {service.description}
                  </p>
                </div>

                {/* HOVER ACCENT */}

                <div className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-accent-500 via-blue-500 to-indigo-500 transition-transform duration-500 group-hover:scale-x-100" />
              </article>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          LOCAL STYLES
      ===================================================== */}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }

            .hide-scrollbar::-webkit-scrollbar {
              display: none;
              width: 0;
              height: 0;
            }

            .service-card {
              opacity: 0;
              transform: translateY(24px);
              animation: serviceCardReveal 650ms cubic-bezier(.2,.8,.2,1) forwards;
            }

            .assessment-bar {
              transform-origin: left center;
              animation: assessmentGrow 1000ms cubic-bezier(.2,.8,.2,1) both;
            }

            .insight-bar {
              transform-origin: left center;
              animation: insightGrow 1000ms cubic-bezier(.2,.8,.2,1) both;
            }

            @keyframes serviceCardReveal {
              from {
                opacity: 0;
                transform: translateY(24px);
              }

              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes assessmentGrow {
              from {
                transform: scaleX(0);
              }

              to {
                transform: scaleX(1);
              }
            }

            @keyframes insightGrow {
              from {
                transform: scaleX(0);
              }

              to {
                transform: scaleX(1);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .service-card,
              .assessment-bar,
              .insight-bar {
                animation: none !important;
                opacity: 1 !important;
                transform: none !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}