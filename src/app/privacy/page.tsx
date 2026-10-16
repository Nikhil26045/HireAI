import { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Cpu,
  Share2,
  Trash2,
  UserCheck,
  Baby,
  Mail,
  ArrowLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | HireAI",
  description:
    "Learn how HireAI collects, handles, and protects candidate resumes, interview responses, and profile information with privacy-conscious AI workflows.",
};

export default function PrivacyPolicyPage() {
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
            <Shield className="h-3.5 w-3.5" />
            <span>PRIVACY POLICY</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            Your privacy and trust are paramount. This policy describes how HireAI collects, processes, and protects your information when you register, upload resumes, or conduct evaluations.
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
            <strong>Draft Notice:</strong> This privacy policy is an initial project template. Specific data retention windows, third-party sub-processors, and data protection officer (DPO) designations must be confirmed by the platform owner prior to formal production deployment.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[1000px] px-5 sm:px-8 lg:px-10">
          <div className="space-y-12 text-sm leading-relaxed text-neutral-700 sm:text-base sm:leading-relaxed">

            {/* 1. Information We Collect */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <Database className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  1. Information We Collect
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>
                  We collect information to provide, maintain, and enhance candidate assessments, interview simulations, and recruiter review workflows. This collection happens directly through your explicit submissions and through technical session logs.
                </p>
              </div>
            </div>

            {/* 2. Account and Profile Information */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  2. Account and Profile Information
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>When you register as a candidate or company recruiter, we collect:</p>
                <ul className="list-inside list-disc space-y-1.5 pl-2">
                  <li><strong>Candidate details:</strong> Full name, email address, password hash, target job roles, years of experience, and optional phone or portfolio details.</li>
                  <li><strong>Company details:</strong> Work email, representative name, company name, industry, and team size.</li>
                  <li><strong>Technical session telemetry:</strong> IP address, device type, browser metadata, and log timestamps used for account security and platform operations.</li>
                </ul>
              </div>
            </div>

            {/* 3. Resumes, Responses & Assessment Data */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <Eye className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  3. Resumes, Interview Responses, and Assessment Data
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>To enable the core features of HireAI, we process user-submitted materials including:</p>
                <ul className="list-inside list-disc space-y-1.5 pl-2">
                  <li><strong>Resumes & CVs:</strong> Work history, education, certifications, and technical skills extracted from uploaded documents (e.g. PDF/DOCX).</li>
                  <li><strong>Interview Submissions:</strong> Text responses, question answers, and audio or video streams submitted during structured evaluations or practice mock interviews.</li>
                  <li><strong>Derived Insights:</strong> Competency ratings, sentiment/speech-to-text transcripts, and structured assessment summaries generated by our analysis pipelines.</li>
                </ul>
              </div>
            </div>

            {/* 4. How Information Is Used */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  4. How Information Is Used
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>We use the data collected strictly for legitimate purposes, including:</p>
                <ul className="list-inside list-disc space-y-1.5 pl-2">
                  <li>Authenticating user access and securing platform accounts.</li>
                  <li>Analyzing resumes against defined role rubrics to provide constructive feedback.</li>
                  <li>Presenting performance breakdowns and evaluation dashboards to candidates and authorized recruiting teams.</li>
                  <li>Detecting abuse, preventing duplicate submissions, and ensuring platform integrity.</li>
                  <li>Communicating critical account notifications and service updates.</li>
                </ul>
              </div>
            </div>

            {/* 5. AI Processing & Automated Evaluation */}
            <div className="scroll-mt-24 rounded-2xl border border-accent-200/80 bg-accent-50/30 p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <Cpu className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  5. AI Processing and Automated Evaluation
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-700">
                <p>
                  HireAI incorporates automated algorithms and large language model APIs to assist both candidates and hiring managers:
                </p>
                <ul className="list-inside list-disc space-y-2 pl-2 text-neutral-600">
                  <li>
                    <strong>Assistive Evaluation:</strong> Automated evaluations, rubric scoring, and resume feedback are generated algorithmically to highlight strengths and areas for development.
                  </li>
                  <li>
                    <strong>Human-in-the-Loop:</strong> AI assessments are designed to assist human recruiters rather than replace them. Final hiring decisions rest exclusively with human hiring authorities.
                  </li>
                  <li>
                    <strong>No External Model Training:</strong> Personal candidate data and proprietary resume texts are not sold or used to train third-party foundation models without explicit organizational consent.
                  </li>
                </ul>
              </div>
            </div>

            {/* 6. Data Sharing & Service Providers */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <Share2 className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  6. Data Sharing and Service Providers
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>
                  We do not sell, rent, or trade your personal data. We only share information with:
                </p>
                <ul className="list-inside list-disc space-y-1.5 pl-2">
                  <li><strong>Participating Employers:</strong> When a candidate participates in an employer-sponsored evaluation, their assessment outcomes are visible to authorized recruiters from that company.</li>
                  <li><strong>Infrastructure Providers:</strong> Trusted cloud hosting, database, and speech/AI API service providers acting under confidentiality commitments.</li>
                  <li><strong>Legal Compliance:</strong> When required by lawful court order, subpoena, or applicable regulatory mandate.</li>
                </ul>
                <p className="text-xs text-neutral-500">
                  <em>[Note: A full list of third-party sub-processors and cloud hosting providers is subject to confirmation prior to production launch.]</em>
                </p>
              </div>
            </div>

            {/* 7. Data Retention & Deletion */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <Trash2 className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  7. Data Retention and Deletion
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>
                  We retain candidate profile data, resumes, and assessment results for as long as your account remains active or as needed to deliver candidate evaluation services.
                </p>
                <p>
                  Users may request account deletion or the purging of specific resume documents at any time. Upon verified request, data will be purged from our primary database systems, subject to legal or audit compliance windows.
                </p>
                <p className="text-xs text-neutral-500">
                  <em>[Note: The exact retention duration for candidate assessment archives and video logs must be confirmed by the platform owner.]</em>
                </p>
              </div>
            </div>

            {/* 8. Security */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <Lock className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  8. Security Measures
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>
                  We apply industry-standard technical and organizational safeguards designed to protect personal data, including password hashing, encrypted transit protocols (HTTPS/TLS), and scoped database access policies.
                </p>
                <p>
                  However, please note that no method of transmission over the Internet or electronic storage method is 100% immune from security threats. We encourage users to maintain unique, secure passwords.
                </p>
              </div>
            </div>

            {/* 9. User Privacy Rights */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  9. User Privacy Rights
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>
                  Depending on your jurisdiction, you may have specific statutory privacy rights regarding your personal information, including:
                </p>
                <ul className="list-inside list-disc space-y-1.5 pl-2">
                  <li>The right to access a copy of the personal information we hold about you.</li>
                  <li>The right to rectify inaccurate or out-of-date profile and resume details.</li>
                  <li>The right to request deletion of your account and personal history (&ldquo;right to be forgotten&rdquo;).</li>
                  <li>The right to withdraw consent for optional evaluative processing.</li>
                </ul>
                <p className="mt-2">
                  To exercise these rights, please contact our administrative team via our contact channels.
                </p>
              </div>
            </div>

            {/* 10. Children's Privacy */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <Baby className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  10. Children&rsquo;s Privacy
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>
                  HireAI is an employment evaluation platform built for working professionals and prospective job candidates. It is not intended for use by children or individuals under the age of 18 (or the applicable age of majority in your jurisdiction). We do not knowingly collect personal information from minors.
                </p>
              </div>
            </div>

            {/* 11. Policy Updates & Contact Information */}
            <div className="scroll-mt-24 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                  11. Policy Updates and Contact Information
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-neutral-600">
                <p>
                  We may revise this Privacy Policy periodically to reflect updates to our evaluative technologies, service changes, or applicable regulations. When revisions occur, the effective date at the top of this document will be updated.
                </p>
                <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs sm:text-sm">
                  <p className="font-semibold text-navy-900">Privacy Inquiries & Data Requests:</p>
                  <p className="mt-1">
                    If you have questions regarding this Privacy Policy or your data, reach out through our{" "}
                    <Link href="/contact" className="font-medium text-accent-600 underline hover:text-accent-700">
                      Contact Page
                    </Link>{" "}
                    or email{" "}
                    <span className="font-mono text-neutral-800">
                      hello@hireai.com
                    </span>{" "}
                    <em>[Note: Privacy contact mailbox and Data Protection Officer information to be confirmed by the platform owner]</em>.
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
                  href="/terms"
                  className="text-accent-600 underline-offset-2 hover:text-accent-700 hover:underline"
                >
                  Terms of Service
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

