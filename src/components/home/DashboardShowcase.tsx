"use client";

import Badge from "@/components/ui/Badge";
import Progress from "@/components/ui/Progress";
import AnimatedScoreRing from "./AnimatedScoreRing";
import InViewport from "./InViewport";

const candidates = [
  { name: "Alex Morgan", role: "Software Engineer", score: 87, technical: 91, status: "Completed" },
  { name: "Priya Sharma", role: "Product Manager", score: 82, technical: 78, status: "Completed" },
  { name: "Daniel Wilson", role: "Data Analyst", score: 79, technical: 85, status: "In Progress" },
];

const selectedCandidate = {
  name: "Alex Morgan",
  role: "Software Engineer",
  score: 87,
  scores: [
    { label: "Technical", value: 91 },
    { label: "Communication", value: 84 },
    { label: "Problem Solving", value: 88 },
    { label: "Behavioral", value: 85 },
  ],
  insights: [
    { type: "positive", text: "Strong technical fundamentals" },
    { type: "positive", text: "Clear response structure" },
    { type: "positive", text: "Good practical reasoning" },
    { type: "neutral", text: "Needs deeper explanation in behavioral responses" },
  ],
};

export default function DashboardShowcase() {
  return (
    <section className="relative overflow-hidden bg-accent-50/60 py-14 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-[400px] w-[400px] rounded-full bg-white/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-navy-900 sm:text-[2.25rem]">
            See the Candidate{" "}
            <span className="text-accent-600">Beyond the Resume</span>.
          </h2>
          <p className="mt-3 text-[1.05rem] leading-[1.6] text-neutral-500">
            Bring resume information, interview analysis and capability insights together in one recruiter-friendly workspace.
          </p>
        </div>

        <InViewport threshold={0.15} dataAttr="db-in-view">
          <div className="db-root relative mt-10">
            {/* Ambient glow behind dashboard */}
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-accent-100/40 via-transparent to-accent-50/20 blur-2xl" />

            <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-navy">
              {/* Dashboard header */}
              <div className="db-header flex flex-col gap-3 border-b border-neutral-200/80 bg-navy-900 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="hidden h-7 w-7 items-center justify-center rounded-md bg-accent-500 sm:flex">
                    <span className="text-[12px] font-bold text-white">H</span>
                  </div>
                  <h3 className="text-[14px] font-semibold text-white">Candidate Evaluation Dashboard</h3>
                </div>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    className="w-full rounded-lg border border-navy-700 bg-navy-800 py-2 pl-9 pr-3 text-[13px] text-white placeholder:text-neutral-500 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 sm:w-56"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Candidate list */}
                <div className="lg:col-span-2">
                  <div className="hidden border-b border-neutral-100 px-5 py-3 sm:grid sm:grid-cols-12 sm:gap-4 sm:px-6">
                    <span className="col-span-5 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">Candidate</span>
                    <span className="col-span-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">Role</span>
                    <span className="col-span-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">Score</span>
                    <span className="col-span-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">Status</span>
                  </div>

                  <div className="divide-y divide-neutral-100">
                    {candidates.map((candidate, i) => (
                      <div
                        key={candidate.name}
                        className={`db-row flex flex-col gap-2 px-5 py-3.5 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 sm:px-6 hover:bg-neutral-50/60 ${
                          candidate.name === selectedCandidate.name ? "bg-accent-50/50" : ""
                        }`}
                        style={{ transitionDelay: `${0.2 + i * 0.1}s` }}
                      >
                        <div className="col-span-5 flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-[11px] font-bold text-accent-600">
                            {candidate.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="text-[13px] font-medium text-navy-900">{candidate.name}</span>
                        </div>
                        <span className="col-span-2 text-[13px] text-neutral-500">{candidate.role}</span>
                        <div className="col-span-2 flex items-center gap-2">
                          <span className="text-[13px] font-bold text-navy-900 tabular-nums">{candidate.score}</span>
                          <div className="hidden w-14 md:block">
                            <Progress value={candidate.score} size="sm" />
                          </div>
                        </div>
                        <div className="col-span-3">
                          <Badge variant={candidate.status === "Completed" ? "success" : "warning"} size="sm">
                            {candidate.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected candidate panel */}
                <div className="db-panel border-t border-neutral-200/80 p-5 lg:border-l lg:border-t-0 lg:p-6">
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 text-[12px] font-bold text-accent-600">
                      AM
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-navy-900">{selectedCandidate.name}</p>
                      <p className="text-[11px] text-neutral-400">{selectedCandidate.role}</p>
                    </div>
                  </div>

                  <div className="mb-5 flex justify-center">
                    <AnimatedScoreRing score={selectedCandidate.score} size={100} strokeWidth={8} />
                  </div>

                  <div className="space-y-2.5">
                    {selectedCandidate.scores.map((score, i) => (
                      <div
                        key={score.label}
                        className="db-score-bar flex items-center gap-2"
                        style={{ transitionDelay: `${0.6 + i * 0.08}s` }}
                      >
                        <span className="w-20 text-[11px] text-neutral-500">{score.label}</span>
                        <div className="flex-1">
                          <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
                            <div
                              className="db-score-bar-fill h-full rounded-full bg-accent-500"
                              style={{
                                width: `${score.value}%`,
                                transitionDelay: `${0.7 + i * 0.1}s`,
                                transformOrigin: "left center",
                                animationDelay: `${0.7 + i * 0.1}s`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="w-6 text-right text-[11px] font-semibold text-navy-900 tabular-nums">{score.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-xl border border-neutral-100 bg-neutral-50/80 p-3.5">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">AI Evaluation Insights</p>
                    <ul className="space-y-1.5">
                      {selectedCandidate.insights.map((insight, i) => (
                        <li
                          key={i}
                          className="db-insight flex items-start gap-1.5 text-[12px] text-navy-800"
                          style={{ transitionDelay: `${0.9 + i * 0.1}s` }}
                        >
                          {insight.type === "positive" ? (
                            <svg className="mt-0.5 h-3 w-3 flex-shrink-0 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : (
                            <svg className="mt-0.5 h-3 w-3 flex-shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                          )}
                          {insight.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 text-center text-[11px] text-neutral-400">
              Demonstration data — candidate names, roles and scores are illustrative examples.
            </p>
          </div>
        </InViewport>
      </div>
    </section>
  );
}
