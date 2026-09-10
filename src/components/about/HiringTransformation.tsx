"use client";

import InViewport from "../home/InViewport";

const traditional = [
  {
    label: "Multiple Resumes",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V16.5m-13.5-8.25h13.5" />
      </svg>
    ),
  },
  {
    label: "Manual Screening",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    label: "Scattered Signals",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: "Uncertain Decisions",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
];

const hireai = [
  {
    label: "Candidate Data",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-3.65-3.65 9.337 9.337 0 00-.952-4.121c-.758 1.043-1.847 1.847-3.183 2.25M15 19.128V15m0 0a48.111 48.111 0 00-3.183-2.25M15 19.128v-4.5m0 4.5a48.111 48.111 0 013.183-2.25M15 19.128a48.111 48.111 0 01-3.183-2.25M9 15a48.111 48.111 0 013.183-2.25M9 15V9.75m0 4.5a48.111 48.111 0 00-3.183 2.25M9 15a48.111 48.111 0 01-3.183-2.25M9 15V9.75m0 4.5v4.5m0-4.5a48.111 48.111 0 013.183 2.25M9 15V9.75m0 4.5v4.5m4.5-4.5v4.5m0-4.5a48.111 48.111 0 00-3.183 2.25M15 9.75V15m0 0v4.5m0-4.5a48.111 48.111 0 00-3.183-2.25M15 9.75V15m0 0v4.5" />
      </svg>
    ),
  },
  {
    label: "AI Evaluation",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    label: "Explainable Signals",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 15.375v-2.25zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-8.25zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    label: "Better-Informed Decision",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function HiringTransformation() {
  return (
    <section className="relative bg-white/60 py-10 sm:py-12 lg:py-14 overflow-hidden">
      <div className="pointer-events-none absolute -left-28 -top-16 h-[260px] w-[260px] rounded-full bg-accent-100/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-16 h-[240px] w-[240px] rounded-full bg-navy-900/[0.012] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.02]" data-dot-pattern style={{ color: "#5F718F" }} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 2xl:max-w-[1360px]">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-2 flex justify-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400">
              The Transformation
            </span>
          </div>
          <h2 className="text-[2rem] font-bold leading-[1.15] tracking-tight text-navy-900 sm:text-[2.25rem] md:text-[2.4rem]">
            From Information Overload{" "}
            <span className="bg-gradient-to-r from-accent-600 via-accent-500 to-accent-700 bg-clip-text text-transparent">
              to Hiring Clarity
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[1.05rem] leading-[1.65] text-neutral-500">
            Transform fragmented hiring signals into structured, explainable decisions.
          </p>
        </div>

        <InViewport threshold={0.1} dataAttr="tran-in-view">
          <div className="mt-10 relative mx-auto grid grid-cols-1 gap-5 sm:mx-0 sm:max-w-5xl sm:grid-cols-[1fr_72px_1fr] lg:max-w-7xl lg:gap-10">
            {/* Traditional column */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-[0.85rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                  Traditional Hiring
                </h3>
              </div>
              {traditional.map((node, i) => (
                <div
                  key={node.label}
                  className="tran-node tran-node-trad group flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-elevated"
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 transition-colors duration-250 group-hover:bg-neutral-100 group-hover:text-neutral-500">
                    {node.icon}
                  </div>
                  <span className="text-[0.94rem] font-medium text-navy-800">{node.label}</span>
                </div>
              ))}
            </div>

            {/* Mobile transformation indicator */}
            <div className="flex sm:hidden items-center justify-center py-1">
              <div className="flex items-center gap-2 rounded-full border border-neutral-200/70 bg-white/90 px-3 py-1.5 text-[11px] shadow-card">
                <svg className="h-3 w-3 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
                <span className="font-medium text-neutral-400">Hiring Complexity</span>
                <svg className="h-3 w-3 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
                <span className="font-medium text-navy-900">HireAI</span>
                <svg className="h-3 w-3 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
                <span className="font-semibold text-accent-700">Hiring Clarity</span>
              </div>
            </div>

            {/* Animated transformation connector */}
            <div className="relative hidden sm:flex sm:flex-col items-center justify-center">
              <div className="absolute left-1/2 top-8 h-[calc(100%+1rem)] w-px -translate-x-1/2">
                <div className="h-full w-full bg-gradient-to-b from-accent-200/60 via-accent-300/40 to-accent-200/60" />
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent-300 shadow-[0_0_8px_rgba(37,99,235,0.25)]" />
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500 shadow-[0_0_20px_rgba(37,99,235,0.25)]">
                  <span className="text-[10px] font-bold text-white">AI</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-accent-300 shadow-[0_0_8px_rgba(37,99,235,0.25)]" />
              </div>
            </div>

            {/* HireAI column */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h3 className="text-[0.85rem] font-semibold uppercase tracking-[0.08em] text-accent-700">
                  HireAI
                </h3>
              </div>
              {hireai.map((node, i) => (
                <div
                  key={node.label}
                  className="tran-node tran-node-hireai group relative flex items-center gap-3 rounded-2xl border border-accent-200/60 bg-gradient-to-br from-accent-50/80 to-white p-4 shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-elevated"
                  style={{
                    animationDelay: `${0.25 + i * 0.08}s`,
                  }}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-accent-400/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-600 transition-colors duration-250 group-hover:bg-accent-200">
                    {node.icon}
                  </div>
                  <span className="text-[0.94rem] font-medium text-navy-900">{node.label}</span>
                </div>
              ))}
            </div>
          </div>
        </InViewport>
      </div>
    </section>
  );
}
