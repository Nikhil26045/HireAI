"use client";

import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import AnimatedBar from "@/components/home/AnimatedBar";
import AnimatedScoreRing from "@/components/home/AnimatedScoreRing";
import ScrollReveal from "@/components/home/ScrollReveal";

const signals = [
  { label: "Technical Skills", value: 92, color: "bg-accent-500" },
  { label: "Communication", value: 84, color: "bg-indigo-400" },
  { label: "Problem Solving", value: 89, color: "bg-success-500" },
  { label: "Role Alignment", value: 91, color: "bg-warning-500" },
];

const evidence = [
  ["01", "Skills Match", "Strong overlap with the role's technical requirements."],
  ["02", "Experience Relevance", "Recent project work maps to the team's priorities."],
  ["03", "Interview Response", "Explains trade-offs clearly in a structured response."],
  ["04", "Communication", "Gives concise context and asks useful follow-up questions."],
];

const before = ["Resume overload", "Manual shortlisting", "Scattered interview notes", "Inconsistent evaluation"];
const after = ["Structured candidate information", "AI-assisted analysis", "Explainable insights", "Recruiter review"];

function ArrowLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-sm font-semibold text-accent-600 transition-colors hover:text-accent-700">
      {children}
      <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">-&gt;</span>
    </Link>
  );
}

export default function WhyHireAIPage() {
  return (
    <div className="whyhireai-page overflow-hidden">
      <section className="relative bg-accent-50/60 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]" data-dot-pattern style={{ color: "#2563EB" }} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-10 2xl:max-w-[1360px]">
          <ScrollReveal className="max-w-xl" variant="stagger">
            <Badge variant="primary" className="mb-5">WHY HIREAI</Badge>
            <h1 className="text-[2.7rem] font-extrabold leading-[1.03] tracking-tight text-navy-900 sm:text-[3.7rem] lg:text-[4.35rem]">Hiring needs more than a resume.</h1>
            <p className="mt-5 max-w-lg text-[1.08rem] leading-[1.7] text-neutral-600">Resumes show experience. Interviews reveal how candidates communicate, reason and solve problems. HireAI brings these signals together into an explainable candidate evaluation.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/register"><Button size="lg" className="px-7">Get Started</Button></Link>
              <Link href="#evaluation"><Button variant="outline" size="lg" className="px-7">See How It Works</Button></Link>
            </div>
            <p className="mt-5 text-xs font-medium text-neutral-500">AI-assisted insights for recruiters. Human judgment stays in control.</p>
          </ScrollReveal>

          <ScrollReveal className="relative" delay={120}>
            <div className="relative mx-auto max-w-[650px]">
              <div className="hf-card-float overflow-hidden rounded-[1.75rem] border border-white/90 bg-white shadow-navy ring-1 ring-navy-900/5">
                <Image src="/whyhireai-hero.avif" alt="Recruiter reviewing a HireAI candidate profile" width={900} height={700} priority className="h-[390px] w-full object-cover sm:h-[500px]" sizes="(max-width: 1024px) 100vw, 650px" />
              </div>
              <div className="hf-card-float absolute -bottom-9 left-4 right-4 rounded-2xl border border-neutral-200/80 bg-white/95 p-4 shadow-elevated backdrop-blur sm:left-8 sm:right-8 sm:p-5">
                <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.13em] text-neutral-400"><span>Candidate capability profile</span><span className="text-success-600">Analysis ready</span></div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold text-navy-800 sm:gap-4 sm:text-xs">
                  {["Resume", "Interview", "AI analysis", "Profile"].map((item, index) => <div key={item} className="relative"><div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${index === 3 ? "bg-navy-800 text-white" : "bg-accent-50 text-accent-600"}`}>{index === 3 ? "✓" : index + 1}</div>{item}{index < 3 && <span className="absolute -right-2 top-4 hidden text-accent-300 sm:block">+</span>}</div>)}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10 2xl:max-w-[1360px]">
          <ScrollReveal className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-neutral-100 shadow-elevated ring-1 ring-navy-900/5">
              <Image src="/whyhireai-interview.avif" alt="Candidate taking part in a structured interview" width={800} height={650} className="h-[390px] w-full object-cover sm:h-[500px]" sizes="(max-width: 1024px) 100vw, 600px" />
              <div className="absolute bottom-5 left-5 flex flex-wrap gap-2 sm:bottom-7 sm:left-7"><span className="border-l-2 border-accent-400 bg-navy-900/95 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-white shadow-card">EXPERIENCE</span><span className="border-l-2 border-white bg-white/95 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-navy-800 shadow-card">COMMUNICATION</span><span className="border-l-2 border-accent-300 bg-accent-500/95 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-white shadow-card">PROBLEM SOLVING</span></div>
            </div>
          </ScrollReveal>
          <ScrollReveal className="order-1 lg:order-2" delay={100}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">The problem with one-dimensional screening</p>
            <h2 className="mt-4 max-w-lg text-[2.3rem] font-bold leading-[1.1] tracking-tight text-navy-900 sm:text-[3rem]">A resume is only one signal.</h2>
            <p className="mt-5 max-w-xl text-base leading-[1.75] text-neutral-600">A polished resume can show where someone has been, but not always how they think when the work gets ambiguous. Interviews add texture: the reasoning, communication and problem-solving behind the experience.</p>
            <div className="mt-8 border-l-2 border-accent-500 pl-5"><p className="text-lg font-semibold leading-[1.45] text-navy-800">HireAI combines the written record with structured responses, so recruiters can compare a fuller picture of capability.</p></div>
            <div className="mt-7"><ArrowLink href="#evaluation">See the signals come together</ArrowLink></div>
          </ScrollReveal>
        </div>
      </section>

      <section id="evaluation" className="relative bg-neutral-50 py-20 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-accent-100/35 to-transparent" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 2xl:max-w-[1360px]">
          <ScrollReveal className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">Multi-signal evaluation</p><h2 className="mt-4 text-[2.3rem] font-bold leading-[1.1] tracking-tight text-navy-900 sm:text-[3rem]">One candidate. Multiple signals.</h2><p className="mt-4 text-base leading-[1.7] text-neutral-600">The interface keeps the inputs visible, the analysis understandable, and the recruiter in the review loop.</p></ScrollReveal>
          <ScrollReveal className="mt-12 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]" delay={120}>
            <div className="group flex flex-col justify-between border border-neutral-200 bg-white p-7 shadow-elevated transition-transform duration-300 hover:-translate-y-1 sm:p-9"><div><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-neutral-400">Candidate 048</p><h3 className="mt-2 text-xl font-bold text-navy-900">Overall Match</h3></div><Badge variant="success">Demo view</Badge></div><div className="mt-8 flex justify-center"><AnimatedScoreRing score={87} size={184} strokeWidth={12} /></div></div><div className="mt-8 border-t border-neutral-200 pt-4 text-sm leading-relaxed text-neutral-500">A combined view of role-relevant evidence, ready for recruiter review.</div></div>
            <div className="border border-neutral-200 bg-white p-7 shadow-elevated transition-shadow duration-300 hover:shadow-navy sm:p-9"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-5"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-neutral-400">Signal breakdown</p><h3 className="mt-1 text-xl font-bold text-navy-900">What contributes to the profile</h3></div><span className="text-xs text-neutral-400">Illustrative values</span></div><div className="mt-8 space-y-7">{signals.map((signal) => <div key={signal.label} className="group/signal"><div className="mb-2 flex justify-between text-sm"><span className="font-medium text-navy-800 transition-colors group-hover/signal:text-accent-600">{signal.label}</span><span className="font-bold tabular-nums text-navy-900">{signal.value}%</span></div><AnimatedBar value={signal.value} fillClassName={signal.color} className="h-2 bg-neutral-100 transition-all duration-300 group-hover/signal:h-2.5" /></div>)}</div><div className="mt-9 flex flex-wrap items-center gap-2 border-t border-neutral-200 pt-5 text-xs font-semibold text-neutral-500"><span className="rounded bg-accent-50 px-2 py-1 text-accent-700">Resume</span><span className="text-accent-300">+</span><span className="rounded bg-indigo-50 px-2 py-1 text-indigo-700">Interview response</span><span className="text-accent-300">+</span><span className="rounded bg-success-50 px-2 py-1 text-success-700">AI analysis</span><span className="text-accent-300">=</span><span className="rounded bg-navy-900 px-2 py-1 text-white shadow-sm">Capability profile</span></div></div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10 2xl:max-w-[1360px]">
          <ScrollReveal><div className="relative overflow-visible"><div className="overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-neutral-100 shadow-elevated ring-1 ring-navy-900/5"><Image src="/whyhireai-recruiter.webp" alt="Recruiter using HireAI to review candidate insights" width={800} height={700} className="h-[420px] w-full object-cover sm:h-[550px]" sizes="(max-width: 1024px) 100vw, 600px" /></div><div className="hf-card-float absolute bottom-5 left-5 bg-white/95 px-4 py-3 shadow-elevated backdrop-blur sm:-right-5 sm:bottom-8 sm:left-auto"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">Review mode</p><p className="mt-1 text-sm font-semibold text-navy-900">Recruiter decision required</p></div></div></ScrollReveal>
          <ScrollReveal delay={100}><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">Human + AI</p><h2 className="mt-4 text-[2.3rem] font-bold leading-[1.1] tracking-tight text-navy-900 sm:text-[3rem]">AI analyzes the signals. Humans make the decision.</h2><p className="mt-5 text-base leading-[1.75] text-neutral-600">HireAI assists recruiters by organizing relevant evidence and surfacing patterns. It does not automatically hire or reject candidates.</p><div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-neutral-200 py-6">{signals.map((signal) => <div key={signal.label} className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-accent-500" /><span className="text-sm font-medium text-navy-800">{signal.label}</span></div>)}</div><div className="mt-7 flex items-start gap-3"><span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-50 text-sm text-success-700">✓</span><p className="text-sm leading-[1.6] text-neutral-600"><strong className="text-navy-800">Recruiter review:</strong> context stays with the person who understands the role, team and candidate.</p></div></ScrollReveal>
        </div>
      </section>

      <section className="bg-navy-900 py-20 text-white sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 2xl:max-w-[1360px]"><div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24"><ScrollReveal><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-400">Explainability by design</p><h2 className="mt-4 max-w-lg text-[2.3rem] font-bold leading-[1.1] tracking-tight sm:text-[3rem]">Every score should have context.</h2><p className="mt-5 max-w-md text-base leading-[1.75] text-neutral-300">A number is a starting point. HireAI connects each signal to concise evidence recruiters can inspect and discuss.</p><p className="mt-8 max-w-sm border-l-2 border-accent-500 pl-5 text-lg font-semibold leading-[1.5] text-white">AI analyzes the signals. Recruiters decide what matters.</p></ScrollReveal><ScrollReveal delay={100}><div className="border border-neutral-700/80 bg-navy-800/70 p-5 shadow-navy sm:p-8">{evidence.map(([number, title, description], index) => <div key={number} className={`group flex gap-5 py-5 transition-colors duration-300 hover:bg-white/[0.04] ${index !== evidence.length - 1 ? "border-b border-neutral-700/70" : ""}`}><span className="border-l-2 border-transparent pl-3 pt-1 text-xs font-bold text-accent-400 transition-colors duration-300 group-hover:border-accent-400">{number}</span><div><h3 className="text-base font-semibold text-white">{title}</h3><p className="mt-1 text-sm leading-[1.6] text-neutral-300">{description}</p></div><span className="ml-auto mt-1 text-accent-400 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">↗</span></div>)}</div></ScrollReveal></div></div>
      </section>

      <section className="bg-accent-50/60 py-20 sm:py-24 lg:py-28"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 2xl:max-w-[1360px]"><ScrollReveal><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">Workflow transformation</p><h2 className="mt-4 max-w-2xl text-[2.3rem] font-bold leading-[1.1] tracking-tight text-navy-900 sm:text-[3rem]">Less screening noise. More hiring clarity.</h2></ScrollReveal><ScrollReveal className="mt-12 grid items-stretch gap-5 lg:grid-cols-[0.82fr_1.18fr]" delay={100}><div className="relative overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-white shadow-elevated"><Image src="/whyhireai-workflow.avif" alt="Structured HireAI workflow for candidate evaluation" width={900} height={600} className="h-full min-h-[380px] w-full object-cover" sizes="(max-width: 1024px) 100vw, 520px" /><div className="absolute inset-x-5 bottom-5 flex justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-white sm:inset-x-7"><span className="bg-navy-900/90 px-2 py-1.5 shadow-sm">Information overload</span><span className="bg-accent-600/90 px-2 py-1.5 shadow-sm">Hiring clarity</span></div></div><div className="grid gap-5 sm:grid-cols-2 lg:relative lg:pl-4"><div className="border border-neutral-200 bg-white p-7 shadow-card sm:p-8"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Before</p><h3 className="mt-2 text-xl font-bold text-navy-900">The noise adds up.</h3><ul className="mt-6 space-y-4">{before.map((item) => <li key={item} className="flex gap-3 text-sm text-neutral-600"><span className="text-neutral-400">×</span>{item}</li>)}</ul></div><div className="border border-accent-200 bg-white p-7 shadow-elevated sm:p-8 sm:translate-y-5"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-600">After</p><h3 className="mt-2 text-xl font-bold text-navy-900">The signal stands out.</h3><ul className="mt-6 space-y-4">{after.map((item) => <li key={item} className="flex gap-3 text-sm text-navy-800"><span className="text-success-600">✓</span>{item}</li>)}</ul></div></div></ScrollReveal></div></section>

      <section className="relative overflow-hidden bg-navy-900 py-20 text-white sm:py-24 lg:py-28"><div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-accent-600/15 to-transparent" /><div className="pointer-events-none absolute bottom-0 left-0 h-px w-2/3 bg-gradient-to-r from-accent-500/60 to-transparent" /><div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:px-10 2xl:max-w-[1360px]"><ScrollReveal><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-400">A clearer way forward</p><h2 className="mt-4 max-w-2xl text-[2.7rem] font-bold leading-[1.05] tracking-tight sm:text-[3.7rem]">See candidates beyond the resume.</h2><p className="mt-5 max-w-xl text-base leading-[1.75] text-neutral-300">Give your hiring team clearer signals, structured insights, and an evaluation process designed to keep humans in control.</p></ScrollReveal><ScrollReveal className="flex shrink-0 flex-wrap gap-3" delay={100}><Link href="/register"><Button variant="secondary" size="lg" className="bg-white px-7 text-navy-900 shadow-elevated hover:bg-accent-50">Get Started</Button></Link><Link href="#evaluation"><Button variant="primary" size="lg" className="border border-neutral-600 bg-transparent px-7 text-white shadow-none hover:border-neutral-400 hover:bg-white/10">Explore How It Works</Button></Link></ScrollReveal></div></section>
    </div>
  );
}