"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, ArrowLeft, CheckCircle2, Send } from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";
import Badge from "@/components/ui/Badge";
import ScrollReveal from "@/components/home/ScrollReveal";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

interface FormData {
  email: string;
}

interface FormErrors {
  email?: string;
}

/* ═══════════════════════════════════════════════════════════
   VALIDATION
   ═══════════════════════════════════════════════════════════ */

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  return errors;
}

/* ═══════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  /* ── State ── */
  const [formData, setFormData] = useState<FormData>({
    email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /* ── Handlers ── */
  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));

    // Clear error for the field being edited
    if (submitted) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as keyof FormErrors];
        return next;
      });
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    // Simulate loading — no API call
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  }

  return (
    <PublicLayout>
      <section className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-white via-accent-50/25 to-indigo-50/30 py-10 sm:py-12 lg:py-14">
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

        <div className="relative mx-auto w-full max-w-[1250px] px-5 sm:px-8 lg:px-10">
          {/* ═══════════════════════════════════════════
              HERO HEADER
          ═══════════════════════════════════════════ */}
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10 lg:mb-11">
            <ScrollReveal variant="reveal" delay={0}>
              <Badge variant="primary" className="mb-3">
                <KeyRound className="mr-1.5 h-3 w-3" />
                PASSWORD RESET
              </Badge>
            </ScrollReveal>

            <ScrollReveal variant="reveal" delay={80}>
              <h1 className="text-[2.2rem] font-extrabold leading-[1.06] tracking-[-0.04em] text-navy-900 sm:text-[2.8rem] lg:text-[3.4rem]">
                Reset your{" "}
                <span className="bg-gradient-to-r from-accent-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  password
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="reveal" delay={160}>
              <p className="mx-auto mt-3 max-w-xl text-[1rem] leading-7 text-neutral-600 sm:text-[1.08rem]">
                Enter your email address and we&apos;ll help you get back into
                your HireAI account.
              </p>
            </ScrollReveal>
          </div>

          {/* ═══════════════════════════════════════════
              FORGOT PASSWORD CARD
          ═══════════════════════════════════════════ */}
          <ScrollReveal variant="reveal" delay={240}>
            <div className="mx-auto w-full max-w-[500px]">
              {/* ── Back link ── */}
              {!isSuccess && (
                <Link
                  href="/login"
                  className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors duration-150 hover:text-accent-600"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Login
                </Link>
              )}

              {/* ── Card ── */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8 lg:p-10">
                {!isSuccess ? (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-4 sm:space-y-5">
                      {/* Email Address */}
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        error={errors.email}
                        hint="We'll use this email to send password reset instructions."
                      />
                    </div>

                    {/* ─────────── CTA BUTTON ─────────── */}
                    <div className="mt-7">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        isLoading={isLoading}
                        disabled={isLoading}
                        leftIcon={
                          isLoading ? undefined : <Send className="h-4 w-4" />
                        }
                      >
                        {isLoading ? "Sending…" : "Send Reset Link"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  /* ─────────── SUCCESS STATE ─────────── */
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-50 text-success-600">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <h2 className="mb-2 text-xl font-bold text-navy-900">
                      Check your email
                    </h2>
                    <p className="mb-8 text-[0.95rem] leading-relaxed text-neutral-600">
                      If an account exists with this email address, you&apos;ll
                      receive instructions to reset your password.
                    </p>
                    <Button
                      type="button"
                      onClick={() => router.push("/login")}
                      variant="primary"
                      size="lg"
                      className="w-full"
                      leftIcon={<ArrowLeft className="h-4 w-4" />}
                    >
                      Back to Login
                    </Button>
                  </div>
                )}
              </div>

              {/* ── Login prompt ── */}
              {!isSuccess && (
                <p className="mt-6 text-center text-sm text-neutral-500">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-accent-600 underline-offset-2 transition-colors duration-150 hover:text-accent-700 hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  );
}
