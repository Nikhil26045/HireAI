"use client";

import Link from "next/link";
import {
  UserRound,
  BriefcaseBusiness,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { ComponentType } from "react";
import PublicLayout from "@/components/layouts/PublicLayout";
import Badge from "@/components/ui/Badge";
import ScrollReveal from "@/components/home/ScrollReveal";

/* ═══════════════════════════════════════════════════════════
   ACCOUNT-TYPE DATA
   ═══════════════════════════════════════════════════════════ */

const accountTypes = [
  {
    id: "candidate",
    href: "/register/candidate",
    icon: UserRound,
    eyebrow: "For Candidates",
    title: "Create a Candidate Account",
    description:
      "Build your profile, showcase your skills, and discover opportunities that match you.",
    benefits: [
      "Build your professional profile",
      "Apply for opportunities",
      "Complete AI-powered assessments",
    ],
    cta: "Continue as Candidate",
    iconBg: "bg-accent-50",
    iconColor: "text-accent-600",
    eyebrowColor: "text-accent-600",
    checkBg: "bg-accent-50",
    checkColor: "text-accent-600",
    accentBorder: "group-hover:border-accent-200",
    cardBg: "bg-gradient-to-br from-accent-50/30 via-white to-white",
    ctaBg:
      "bg-navy-800 text-white hover:bg-navy-700 active:bg-navy-900 shadow-sm hover:shadow-navy",
  },
  {
    id: "company",
    href: "/register/company",
    icon: BriefcaseBusiness,
    eyebrow: "For Companies",
    title: "Create a Company Account",
    description:
      "Build your hiring workspace and evaluate candidates with AI-powered recruitment tools.",
    benefits: [
      "Create and manage job openings",
      "Evaluate candidate profiles",
      "Track your hiring pipeline",
    ],
    cta: "Continue as Company",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    eyebrowColor: "text-indigo-600",
    checkBg: "bg-indigo-50",
    checkColor: "text-indigo-600",
    accentBorder: "group-hover:border-indigo-200",
    cardBg: "bg-gradient-to-br from-indigo-50/30 via-white to-white",
    ctaBg:
      "bg-navy-800 text-white hover:bg-navy-700 active:bg-navy-900 shadow-sm hover:shadow-navy",
  },
] as const;

/* ═══════════════════════════════════════════════════════════
   REGISTER PAGE
   ═══════════════════════════════════════════════════════════ */

export default function RegisterPage() {
  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-accent-50/25 to-indigo-50/30 py-10 sm:py-12 lg:py-14">
        {/* ── Background atmosphere ── */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-accent-100/30 blur-[100px]" />
          <div className="absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-indigo-100/35 blur-[110px]" />
          <div className="absolute left-1/2 top-0 h-48 w-80 -translate-x-1/2 rounded-full bg-blue-100/20 blur-[90px]" />
        </div>

        {/* ── Subtle dot pattern ── */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          data-dot-pattern
          style={{ color: "#2563EB" }}
        />

        <div className="relative mx-auto max-w-[1250px] px-5 sm:px-8 lg:px-10">
          {/* ═══════════════════════════════════════════
              HERO HEADER
          ═══════════════════════════════════════════ */}
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10 lg:mb-11">
            <ScrollReveal variant="reveal" delay={0}>
              <Badge variant="primary" className="mb-3">
                <Sparkles className="mr-1.5 h-3 w-3" />
                CREATE YOUR ACCOUNT
              </Badge>
            </ScrollReveal>

            <ScrollReveal variant="reveal" delay={80}>
              <h1 className="text-[2.2rem] font-extrabold leading-[1.06] tracking-[-0.04em] text-navy-900 sm:text-[2.8rem] lg:text-[3.4rem]">
                Create your{" "}
                <span className="bg-gradient-to-r from-accent-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  HireAI account
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="reveal" delay={160}>
              <p className="mx-auto mt-3 max-w-xl text-[1rem] leading-7 text-neutral-600 sm:text-[1.08rem]">
                How will you use HireAI? Choose the account that best fits your
                needs.
              </p>
            </ScrollReveal>
          </div>

          {/* ═══════════════════════════════════════════
              ACCOUNT-TYPE CARDS
          ═══════════════════════════════════════════ */}
          <ScrollReveal variant="reveal" delay={240}>
            <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-2 lg:gap-7">
              {accountTypes.map((type) => (
                <AccountCard key={type.id} {...type} />
              ))}
            </div>
          </ScrollReveal>

          {/* ═══════════════════════════════════════════
              BOTTOM LOGIN PROMPT
          ═══════════════════════════════════════════ */}
          <ScrollReveal variant="reveal" delay={320}>
            <p className="mt-8 text-center text-sm text-neutral-500 sm:mt-9">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-accent-600 underline-offset-2 transition-colors duration-150 hover:text-accent-700 hover:underline"
              >
                Log in
              </Link>
            </p>
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  );
}

/* ═══════════════════════════════════════════════════════════
   ACCOUNT CARD COMPONENT
   ═══════════════════════════════════════════════════════════ */

interface AccountCardProps {
  href: string;
  icon: ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  description: string;
  benefits: readonly string[];
  cta: string;
  iconBg: string;
  iconColor: string;
  eyebrowColor: string;
  checkBg: string;
  checkColor: string;
  accentBorder: string;
  cardBg: string;
  ctaBg: string;
}

function AccountCard({
  href,
  icon: Icon,
  eyebrow,
  title,
  description,
  benefits,
  cta,
  iconBg,
  iconColor,
  eyebrowColor,
  checkBg,
  checkColor,
  accentBorder,
  cardBg,
  ctaBg,
}: AccountCardProps) {
  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 ${cardBg} p-6 shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated sm:p-8 ${accentBorder}`}
    >
      {/* Decorative top-left glow on hover */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-accent-100/0 blur-[60px] transition-all duration-500 group-hover:bg-accent-100/40" />

      {/* Icon + Eyebrow */}
      <div className="relative flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconColor} transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-card`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.18em] ${eyebrowColor}`}
          >
            {eyebrow}
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
            {title}
          </h2>
        </div>
      </div>

      {/* Description */}
      <p className="relative mt-4 max-w-md text-[0.94rem] leading-6 text-neutral-600">
        {description}
      </p>

      {/* Benefits list */}
      <ul className="relative mt-5 space-y-3" role="list">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${checkBg} ${checkColor} transition-transform duration-300 group-hover:scale-110`}
            >
              <Check className="h-3.5 w-3.5" />
            </span>

            <span className="text-[0.85rem] font-medium text-navy-900">
              {benefit}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="relative mt-7">
        <Link
          href={href}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 ${ctaBg}`}
        >
          {cta}

          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}