import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Scale,
  Users,
  Bot,
  AlertTriangle,
  FileCheck2,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";

export const metadata: Metadata = {
  title: "Terms of Service | HireAI",
  description:
    "Review the Terms of Service for HireAI. Learn about candidate and recruiter responsibilities, platform usage, and our AI evaluation disclaimers.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "October 16, 2026";

  return (
    <PublicLayout>
      {/* Header / Hero */}
      <section className="relative overflow-hidden border-b border-accent-100/70 bg-gradient-to-br from-white via-accent-50/35 to-indigo-50/45 py-12 sm:py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-6 h-60 w-60 rounded-full bg-accent-100/40 blur-[85px]" />
          <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-indigo-100/40 blur-[90px]" />
        </div>

        <div className="relative mx-auto max-w-[1250px] px-5 sm:px-8 lg:px-10">
          {/* Breadcrumb / Home navigation */}
          <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-accent-600"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-neutral-400" />
            <span className="text-accent-600">Legal</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-accent-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-accent-700 shadow-card backdrop-blur-sm">
            <Scale className="h-3.5 w-3.5" />
            <span>TERMS OF SERVICE</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl lg:text-5xl">
            Terms of Service
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            Please read these terms carefully before accessing or using HireAI. They govern your rights and obligations when using our AI-assisted recruitment platform.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500">
            <span>
              <strong>Effective date:</strong> {lastUpdated}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>
              <strong>Status:</strong> Draft for review
            </span>
          </div>
        </div>
      </section>

      {/* Notice Banner */}
      <section className="border-b border-accent-100/60 bg-accent-50/50 py-3.5">
        <div className="mx-auto flex max-w-[1250px] items-start gap-3 px-5 sm:px-8 lg:px-10">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
          <p className="text-xs leading-relaxed text-neutral-600">
            <strong>Draft Notice:</strong> This document represents a preliminary policy draft for the HireAI application. Operating entity details, legal jurisdiction, and enterprise service commitments are subject to final confirmation by the platform administrator prior to commercial deployment.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[1000px] px-5 sm:px-8 lg:px-10">
          <div className="space-y-12 text-sm leading-relaxed text-neutral-700 sm:text-base sm:leading-relaxed">
            
            {/* 1. Acceptance of Terms */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  1. Acceptance of Terms
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>
                  By creating an account, registering as a candidate or company, or interacting with the HireAI platform (&ldquo;HireAI&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service.
                </p>
                <p>
                  If you are using HireAI on behalf of an employer, recruiting agency, or other enterprise entity, you confirm that you possess the authority to bind that organization to these terms. If you do not agree to all terms, you must discontinue using HireAI immediately.
                </p>
              </div>
            </div>

            {/* 2. Eligibility & Accounts */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <Users className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  2. Eligibility and User Accounts
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>
                  To register for an account on HireAI, you must be of legal age to form a binding contract in your jurisdiction. By registering, you agree to:
                </p>
                <ul className="list-inside list-disc space-y-1.5 pl-2">
                  <li>Provide accurate, current, and complete registration details.</li>
                  <li>Maintain the confidentiality of your login credentials and authentication tokens.</li>
                  <li>Notify HireAI promptly of any unauthorized access or security breach involving your account.</li>
                  <li>Accept responsibility for all activity that takes place under your registered account.</li>
                </ul>
                <p className="text-xs text-neutral-500">
                  <em>Note: Account verification protocols and multi-factor requirements are subject to administrative configuration.</em>
                </p>
              </div>
            </div>

            {/* 3. Candidate & Recruiter Responsibilities */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  3. Candidate and Recruiter Responsibilities
                </h2>
              </div>
              <div className="mt-4 space-y-4 text-neutral-600">
                <div>
                  <h3 className="font-semibold text-navy-800">A. Candidate Responsibilities</h3>
                  <p className="mt-1">
                    Candidates agree that all resumes, background experience, portfolio links, and responses submitted during structured or mock interviews represent their genuine qualifications and personal work. Submitting fabricated credentials, impersonating others, or relying on unauthorized external assistance during live evaluations is prohibited.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-navy-800">B. Recruiter and Company Responsibilities</h3>
                  <p className="mt-1">
                    Hiring teams and recruiters agree to utilize candidate evaluation summaries fairly and in strict compliance with applicable employment, anti-discrimination, and data protection legislation. Recruiters acknowledge that HireAI serves as an evaluative aid and does not make final employment selections on behalf of any employer.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Acceptable Use */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  4. Acceptable Use Policy
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>When using HireAI, you expressly agree not to:</p>
                <ul className="list-inside list-disc space-y-1.5 pl-2">
                  <li>Disrupt, compromise, reverse engineer, or probe the infrastructure, source code, or security controls of the service.</li>
                  <li>Automate scraping, data harvesting, or automated querying without prior written permission.</li>
                  <li>Upload malicious software, corrupted files, or data containing viruses or Trojan code.</li>
                  <li>Submit unlawful, defamatory, harassing, or infringing content.</li>
                  <li>Circumvent or manipulate AI evaluation metrics or scoring mechanisms.</li>
                </ul>
              </div>
            </div>

            {/* 5. AI Evaluation Disclaimer & Limitations */}
            <div className="scroll-mt-24 rounded-2xl border border-amber-200/90 bg-amber-50/30 p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Bot className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  5. AI-Assisted Candidate Evaluation and Its Limitations
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-700">
                <p className="font-medium text-amber-950">
                  Important Notice Regarding Automated Evaluation:
                </p>
                <p>
                  HireAI employs artificial intelligence and machine-learning models to analyze candidate resumes, parse structured technical answers, and formulate evaluative feedback. You explicitly acknowledge and agree that:
                </p>
                <ul className="list-inside list-disc space-y-2 pl-2 text-neutral-600">
                  <li>
                    <strong>Evaluative Aid Only:</strong> AI outputs, scores, and transcript interpretations are intended solely as analytical recommendations and assistive tools. They must never be treated as the sole basis or definitive determinant for hiring, termination, promotion, or rejection decisions.
                  </li>
                  <li>
                    <strong>Potential for Inaccuracy:</strong> Like all probabilistic models, AI systems may occasionally produce incorrect, incomplete, or biased interpretations (&ldquo;hallucinations&rdquo;). Recruiters must exercise independent professional human judgment before reaching hiring outcomes.
                  </li>
                  <li>
                    <strong>No Guarantee of Employment:</strong> Participation in HireAI mock sessions or candidate screenings does not guarantee job placement, interview progression, or employment offers.
                  </li>
                </ul>
              </div>
            </div>

            {/* 6. Intellectual Property */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <Scale className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  6. Intellectual Property
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>
                  All proprietary rights, software code, UI designs, brand marks, logos, graphics, and algorithmic methodologies comprising HireAI are the intellectual property of the project owners or their licensors.
                </p>
                <p>
                  You retain ownership of the original text, resumes, and personal materials you upload to HireAI. By submitting your content, you grant HireAI a limited, non-exclusive license to process, store, format, and evaluate that data strictly for providing and improving the recruitment features of the platform.
                </p>
              </div>
            </div>

            {/* 7. Service Availability & Modifications */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  7. Service Availability and Changes
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>
                  HireAI is continuously evolving. We reserve the right to modify, suspend, or discontinue any feature, evaluation module, or portion of the platform at any time without prior notice. We do not guarantee uninterrupted, bug-free, or zero-downtime operation of the platform.
                </p>
              </div>
            </div>

            {/* 8. Disclaimers & Limitation of Liability */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  8. Disclaimers and Limitation of Liability
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>
                  THE PLATFORM AND ALL AI EVALUATION FEATURES ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, OR NON-INFRINGEMENT.
                </p>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, HIREAI, ITS CONTRIBUTORS, AND OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, NOR FOR ANY LOSS OF PROFITS, DATA, USE, GOODWILL, OR EMPLOYMENT OPPORTUNITIES ARISING FROM YOUR USE OF OR INABILITY TO USE THE PLATFORM.
                </p>
              </div>
            </div>

            {/* 9. Termination & Contact Information */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  9. Termination and Inquiries
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>
                  We reserve the right to suspend or terminate accounts that breach these Terms of Service or engage in deceptive conduct. You may close your account at any time by contacting our support team.
                </p>
                <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs sm:text-sm">
                  <p className="font-semibold text-navy-900">Project Support & Legal Contact:</p>
                  <p className="mt-1">
                    For inquiries regarding these terms, visit our{" "}
                    <Link href="/contact" className="font-medium text-accent-600 underline hover:text-accent-700">
                      Contact Page
                    </Link>{" "}
                    or email{" "}
                    <span className="font-mono text-neutral-800">
                      hello@hireai.com
                    </span>{" "}
                    <em>[Note: Contact email and entity details to be confirmed by project owner prior to release]</em>.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-8 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Home Page
              </Link>

              <div className="flex items-center gap-4 text-xs font-medium text-neutral-500">
                <span>Also see:</span>
                <Link
                  href="/privacy"
                  className="text-accent-600 underline-offset-2 hover:text-accent-700 hover:underline"
                >
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link
                  href="/contact"
                  className="text-accent-600 underline-offset-2 hover:text-accent-700 hover:underline"
                >
                  Contact Us
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

