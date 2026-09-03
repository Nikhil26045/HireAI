import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Progress from "@/components/ui/Progress";
import AnimatedScoreRing from "./AnimatedScoreRing";

const candidateScores = [
  { label: "Technical", value: 91 },
  { label: "Communication", value: 84 },
  { label: "Problem Solving", value: 88 },
  { label: "Behavioral", value: 85 },
];

const insights = [
  "Strong technical fundamentals",
  "Clear response structure",
  "Good practical reasoning",
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle background effects */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-accent-100/40 blur-3xl hf-glow-drift" />
      <div className="pointer-events-none absolute left-1/3 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-navy-900/[0.02] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-[400px] w-[400px] rounded-full bg-accent-50/60 blur-3xl hf-glow-drift" />

      <div className="relative mx-auto max-w-7xl px-5 pt-12 pb-14 sm:px-8 sm:pt-14 sm:pb-16 lg:px-10 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left content with staggered entrance */}
          <div className="hf-stagger is-visible">
            <Badge variant="primary" className="mb-4">
              AI-POWERED CANDIDATE EVALUATION
            </Badge>

            <h1 className="text-[2.75rem] font-bold leading-[1.06] tracking-[-0.02em] text-navy-900 sm:text-[3.5rem] lg:text-[3.75rem] xl:text-[4.25rem]">
              Hire{" "}
              <span className="bg-gradient-to-br from-accent-500 via-accent-600 to-accent-700 bg-clip-text text-transparent">
                Beyond the
                <br />
                Resume
              </span>
              .
              <br />
              <span className="text-navy-800">Understand the Candidate.</span>
            </h1>

            <p className="mt-4 max-w-lg text-[1.0625rem] leading-[1.65] text-neutral-500">
              HireAI combines resume insights, structured interviews, and AI-powered analysis to create a clearer, explainable view of candidate capability.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg" className="bg-navy-800 hover:bg-navy-700 shadow-navy transition-all duration-200 hover:-translate-y-0.5">
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="border-neutral-300 text-navy-800 hover:bg-neutral-50 transition-all duration-200 hover:-translate-y-0.5">
                  Explore HireAI
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5 text-[13px] text-neutral-400">
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
            <div className="absolute -inset-10 rounded-[2.5rem] bg-gradient-to-br from-accent-100/50 via-accent-50/30 to-transparent blur-2xl" />

            {/* Main dashboard card */}
            <div className="hf-card-float relative z-10 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-navy sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-navy-900">Candidate Evaluation</h3>
                <Badge variant="success">Complete</Badge>
              </div>

              <div className="mb-4 flex items-center gap-3 border-b border-neutral-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 text-[13px] font-bold text-accent-600">
                  AM
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-navy-900">Alex Morgan</p>
                  <p className="text-[12px] text-neutral-400">Software Engineer</p>
                </div>
              </div>

              <div className="mb-5 flex items-center justify-center">
                <AnimatedScoreRing score={87} size={140} strokeWidth={10} />
              </div>

              <div className="mb-4 space-y-2.5">
                {candidateScores.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="w-24 text-[13px] text-neutral-500">{item.label}</span>
                    <div className="flex-1">
                      <Progress value={item.value} size="sm" />
                    </div>
                    <span className="w-7 text-right text-[13px] font-semibold text-navy-900 tabular-nums">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-3.5">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">AI Evaluation Insights</p>
                <ul className="space-y-1.5">
                  {insights.map((insight, i) => (
                    <li
                      key={insight}
                      className="hf-insight flex items-start gap-2 text-[13px] text-navy-800"
                      style={{ animationDelay: `${0.4 + i * 0.12}s` }}
                    >
                      <svg className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Front floating card */}
            <div className="absolute -right-3 bottom-12 z-20 hidden rounded-xl border border-neutral-200/80 bg-white/95 p-3.5 shadow-elevated backdrop-blur-md sm:block hf-float-delayed">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 hf-icon-pulse">
                  <svg className="h-4 w-4 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-navy-900">AI Insights Ready</p>
                  <p className="text-[11px] text-neutral-400">Evaluation complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
