"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import ScrollReveal from "@/components/home/ScrollReveal";

/* ─────────────────────────────────────────────
   PLACEHOLDER CONTACT DETAILS
   Replace these values with real information.
   ───────────────────────────────────────────── */
const CONTACT_EMAIL = "hello@hireai.com";
const CONTACT_PHONE = "+91 XXXXX XXXXX";
const CONTACT_LOCATION = "Jaipur, India";

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: CONTACT_PHONE,
    href: `tel:${CONTACT_PHONE.replace(/\s/g, "")}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: CONTACT_LOCATION,
    href: undefined,
  },
];

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend-only: no API call.
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section className="relative overflow-hidden border-b border-accent-100/70 bg-gradient-to-br from-accent-50/45 via-white to-indigo-50/40 py-10 sm:py-12 lg:py-14">
      {/* ─────────────────────────────────────
          BACKGROUND ATMOSPHERE
      ───────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-accent-100/35 blur-[100px]" />

        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-indigo-100/45 blur-[110px]" />

        <div className="absolute left-1/2 top-1/2 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50/50 blur-[100px]" />
      </div>

      {/* subtle dot texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        data-dot-pattern
        style={{ color: "#2563EB" }}
      />

      <div className="relative mx-auto max-w-[1250px] px-5 sm:px-8 lg:px-10">
        {/* ─────────────────────────────────────
            SECTION INTRO
        ───────────────────────────────────── */}
        <ScrollReveal variant="reveal" delay={0}>
          <div className="mb-7 flex items-end justify-between gap-6 sm:mb-8">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent-100 bg-white/80 px-3 py-1.5 shadow-card backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-accent-600" />

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-700">
                  Contact HireAI
                </span>
              </div>

              <h2 className="text-[2rem] font-bold tracking-[-0.04em] text-navy-900 sm:text-[2.5rem]">
                We&rsquo;re here to help.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600 sm:text-[0.95rem]">
                Have a question, want to explore HireAI, or want to discuss
                your hiring needs? Send us a message and let&rsquo;s start the
                conversation.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-accent-100 bg-white/75 px-3.5 py-2 text-[10px] font-semibold text-neutral-600 shadow-card backdrop-blur-sm sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Usually responds quickly
            </div>
          </div>
        </ScrollReveal>

        {/* ─────────────────────────────────────
            MAIN CONTACT COMPOSITION
        ───────────────────────────────────── */}
        <div className="grid items-stretch gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-7">
          {/* ─────────────────────────────
              LEFT — CONTACT PANEL
          ───────────────────────────── */}
          <ScrollReveal variant="reveal" delay={80}>
            <div className="group relative h-full min-h-[500px] overflow-hidden rounded-[1.75rem] border border-accent-200/70 bg-gradient-to-br from-navy-900 via-navy-800 to-[#102d62] p-7 text-white shadow-[0_25px_70px_rgba(6,20,47,0.16)] sm:p-8">
              {/* Decorative atmosphere */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-500/20 blur-[80px]" />

              <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-indigo-500/15 blur-[90px]" />

              {/* Fine grid */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                    backgroundSize: "34px 34px",
                  }}
                />
              </div>

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">
                      Let&rsquo;s connect
                    </p>

                    <h3 className="mt-2 max-w-sm text-[1.65rem] font-bold leading-tight tracking-[-0.03em] sm:text-[1.9rem]">
                      Start a conversation with HireAI.
                    </h3>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105">
                    <ArrowUpRight className="h-5 w-5 text-blue-200" />
                  </div>
                </div>

                <p className="mt-4 max-w-sm text-sm leading-6 text-blue-100/75">
                  Whether you&rsquo;re exploring AI-assisted hiring, have a
                  product question, or simply want to learn more, we&rsquo;re
                  ready to hear from you.
                </p>

                {/* Connection visual */}
                <div className="relative my-8 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-5">
                  {/* connection lines */}
                  <div className="absolute left-[22%] top-[45%] h-px w-[56%] bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

                  <div className="absolute left-1/2 top-[22%] h-[56%] w-px bg-gradient-to-b from-transparent via-blue-300/40 to-transparent" />

                  <div className="absolute left-[28%] top-[30%] h-px w-[44%] rotate-[18deg] bg-gradient-to-r from-transparent via-indigo-300/35 to-transparent" />

                  <div className="absolute left-[28%] top-[60%] h-px w-[44%] rotate-[-18deg] bg-gradient-to-r from-transparent via-indigo-300/35 to-transparent" />

                  {/* central core */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute -inset-5 animate-pulse rounded-full bg-accent-400/15 blur-xl" />

                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-300/30 bg-white/10 shadow-[0_10px_35px_rgba(37,99,235,0.25)] backdrop-blur-md">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[10px] font-extrabold text-navy-900">
                        AI
                      </div>
                    </div>
                  </div>

                  <MiniSignal
                    className="left-3 top-5"
                    label="Resume"
                    delay="0s"
                  />

                  <MiniSignal
                    className="right-3 top-5"
                    label="Interview"
                    delay="1s"
                  />

                  <MiniSignal
                    className="bottom-5 left-3"
                    label="Skills"
                    delay="1.8s"
                  />

                  <MiniSignal
                    className="bottom-5 right-3"
                    label="People"
                    delay="2.5s"
                  />
                </div>

                {/* Contact details */}
                <div className="space-y-2">
                  {contactItems.map((item) => {
                    const Icon = item.icon;

                    const Wrapper = item.href ? "a" : "div";

                    const wrapperProps = item.href
                      ? {
                          href: item.href,
                        }
                      : {};

                    return (
                      <Wrapper
                        key={item.label}
                        {...wrapperProps}
                        className="group/item flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-3.5 py-3 transition-all duration-300 hover:border-blue-300/30 hover:bg-white/[0.09]"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-blue-200 transition-transform duration-300 group-hover/item:-translate-y-0.5">
                          <Icon className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-200/65">
                            {item.label}
                          </p>

                          <p className="truncate text-[12px] font-semibold text-white">
                            {item.value}
                          </p>
                        </div>
                      </Wrapper>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ─────────────────────────────
              RIGHT — CONTACT FORM
          ───────────────────────────── */}
          <ScrollReveal variant="reveal" delay={160}>
            <div className="relative h-full rounded-[1.75rem] border border-accent-100 bg-white/90 p-6 shadow-[0_20px_60px_rgba(6,20,47,0.08)] backdrop-blur-sm sm:p-8">
              {/* small top accent */}
              <div className="absolute left-8 right-8 top-0 h-1 rounded-b-full bg-gradient-to-r from-accent-500 via-blue-500 to-indigo-500" />

              {submitted ? (
                /* ─────────────────────
                   SUCCESS STATE
                ───────────────────── */
                <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                  <div className="relative">
                    <div className="absolute -inset-5 rounded-full bg-emerald-100/50 blur-xl" />

                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-2xl font-bold tracking-tight text-navy-900">
                    Message sent!
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                    Thank you for reaching out. We&rsquo;ll get back to you
                    shortly.
                  </p>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-6 rounded-full border border-accent-100 bg-accent-50 px-5 py-2.5 text-[12px] font-semibold text-accent-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-200 hover:bg-accent-100"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Form heading */}
                  <div className="mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-600">
                      Send a message
                    </p>

                    <h3 className="mt-1.5 text-[1.55rem] font-bold tracking-[-0.03em] text-navy-900">
                      Tell us what&rsquo;s on your mind.
                    </h3>

                    <p className="mt-1.5 text-[13px] leading-5 text-neutral-500">
                      Fill out the form and we&rsquo;ll get back to you.
                    </p>
                  </div>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      id="contact-name"
                      name="name"
                      label="Full Name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                    />

                    <FormField
                      id="contact-email"
                      name="email"
                      label="Email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                    />
                  </div>

                  {/* Company + Subject */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      id="contact-company"
                      name="company"
                      label="Company"
                      type="text"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Acme Inc."
                    />

                    <FormField
                      id="contact-subject"
                      name="subject"
                      label="Subject"
                      type="text"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-1.5 block text-[12px] font-semibold text-navy-800"
                    >
                      Message
                    </label>

                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project or question..."
                      className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50/60 px-3.5 py-3 text-sm text-navy-900 outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-accent-400 focus:bg-white focus:ring-4 focus:ring-accent-500/10"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex items-center justify-between gap-4 pt-1">
                    <p className="hidden max-w-[230px] text-[10px] leading-4 text-neutral-400 sm:block">
                      Your message will be reviewed by the HireAI team.
                    </p>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-7 py-3 text-[14px] font-semibold text-white shadow-[0_10px_25px_rgba(6,20,47,0.16)] transition-all duration-300 hover:-translate-y-1 hover:bg-navy-800 hover:shadow-[0_15px_35px_rgba(6,20,47,0.2)] active:translate-y-0 sm:w-auto"
                    >
                      <Send className="h-4 w-4" />
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Local animation */}
      <style jsx>{`
        @keyframes contact-signal-float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        .contact-signal-float {
          animation: contact-signal-float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FORM FIELD
───────────────────────────────────────────── */
function FormField({
  id,
  name,
  label,
  type,
  required,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  name: string;
  label: string;
  type: string;
  required?: boolean;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[12px] font-semibold text-navy-800"
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 px-3.5 py-3 text-sm text-navy-900 outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-accent-400 focus:bg-white focus:ring-4 focus:ring-accent-500/10"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MINI SIGNAL
───────────────────────────────────────────── */
function MiniSignal({
  className,
  label,
  delay,
}: {
  className: string;
  label: string;
  delay: string;
}) {
  return (
    <div
      className={`absolute z-10 contact-signal-float ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1.5 backdrop-blur-md">
        <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-blue-300/10">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
        </span>

        <span className="text-[9px] font-bold text-blue-100">
          {label}
        </span>
      </div>
    </div>
  );
}