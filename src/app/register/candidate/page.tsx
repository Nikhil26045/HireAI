"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  UserRound,
} from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";
import Badge from "@/components/ui/Badge";
import ScrollReveal from "@/components/home/ScrollReveal";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  currentRole: string;
  experience: string;
  skills: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  currentRole?: string;
  experience?: string;
  skills?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
}

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════ */

const experienceOptions = [
  { label: "Select experience level", value: "" },
  { label: "Fresher", value: "fresher" },
  { label: "0–1 years", value: "0-1" },
  { label: "1–3 years", value: "1-3" },
  { label: "3–5 years", value: "3-5" },
  { label: "5+ years", value: "5+" },
];

/* ═══════════════════════════════════════════════════════════
   VALIDATION
   ═══════════════════════════════════════════════════════════ */

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!data.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required.";
  }

  if (!data.currentRole.trim()) {
    errors.currentRole = "Current role is required.";
  }

  if (!data.experience) {
    errors.experience = "Please select your experience level.";
  }

  if (!data.skills.trim()) {
    errors.skills = "Please enter at least one skill.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!data.agreeTerms) {
    errors.agreeTerms =
      "You must agree to the Terms of Service and Privacy Policy.";
  }

  return errors;
}

/* ═══════════════════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function CandidateRegisterPage() {
  /* ── State ── */
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    currentRole: "",
    experience: "",
    skills: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ── Handlers ── */
  function updateField<K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }));

    // Clear error for the field being edited
    if (submitted) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
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
    }, 1500);
  }

  /* ── Shared select styling ── */
  const selectBase =
    "w-full rounded-md border bg-white px-3 py-2 text-sm text-neutral-900 transition-colors duration-150 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500 appearance-none";

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-accent-50/25 to-indigo-50/30 py-9 sm:py-11 lg:py-12">
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
          <div className="mx-auto mb-6 max-w-3xl text-center sm:mb-7 lg:mb-8">
            <ScrollReveal variant="reveal" delay={0}>
              <Badge variant="primary" className="mb-3">
                <UserRound className="mr-1.5 h-3 w-3" />
                FOR CANDIDATES
              </Badge>
            </ScrollReveal>

            <ScrollReveal variant="reveal" delay={80}>
              <h1 className="text-[2rem] font-extrabold leading-[1.08] tracking-[-0.04em] text-navy-900 sm:text-[2.6rem] lg:text-[3.1rem]">
                Create your{" "}
                <span className="bg-gradient-to-r from-accent-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  Candidate Account
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="reveal" delay={160}>
              <p className="mx-auto mt-3 max-w-xl text-[1rem] leading-7 text-neutral-600 sm:text-[1.08rem]">
                Build your profile and take the first step toward finding
                opportunities with HireAI.
              </p>
            </ScrollReveal>
          </div>

          {/* ═══════════════════════════════════════════
              REGISTRATION FORM CARD
          ═══════════════════════════════════════════ */}
          <ScrollReveal variant="reveal" delay={220}>
            <div className="mx-auto max-w-[680px]">
              {/* ── Back link ── */}
              <Link
                href="/register"
                className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors duration-150 hover:text-accent-600"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to account type
              </Link>

              {/* ── Card ── */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8 lg:p-10">
                <form onSubmit={handleSubmit} noValidate>
                  {/* ─────────── PERSONAL INFORMATION ─────────── */}
                  <fieldset>
                    <legend className="mb-4 flex w-full items-center gap-3">
                      <span className="shrink-0 text-[13px] font-bold uppercase tracking-[0.14em] text-accent-600">
                        Personal Information
                      </span>
                      <span className="h-px flex-1 bg-neutral-100" />
                    </legend>

                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                      {/* Full Name */}
                      <Input
                        label="Full Name"
                        name="fullName"
                        placeholder="Enter your full name"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          updateField("fullName", e.target.value)
                        }
                        error={errors.fullName}
                      />

                      {/* Email Address */}
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          updateField("email", e.target.value)
                        }
                        error={errors.email}
                      />
                    </div>

                    <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5">
                      {/* Phone Number */}
                      <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          updateField("phone", e.target.value)
                        }
                        error={errors.phone}
                      />

                      {/* Current Role / Job Title */}
                      <Input
                        label="Current Role / Job Title"
                        name="currentRole"
                        placeholder="e.g. Software Developer"
                        required
                        value={formData.currentRole}
                        onChange={(e) =>
                          updateField("currentRole", e.target.value)
                        }
                        error={errors.currentRole}
                      />
                    </div>
                  </fieldset>

                  {/* Separator */}
                  <hr className="my-6 border-neutral-100 sm:my-7" />

                  {/* ─────────── PROFESSIONAL INFORMATION ─────────── */}
                  <fieldset>
                    <legend className="mb-4 flex w-full items-center gap-3">
                      <span className="shrink-0 text-[13px] font-bold uppercase tracking-[0.14em] text-accent-600">
                        Professional Information
                      </span>
                      <span className="h-px flex-1 bg-neutral-100" />
                    </legend>

                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                      {/* Years of Experience */}
                      <div className="w-full">
                        <label
                          htmlFor="experience"
                          className="mb-1.5 block text-sm font-medium text-neutral-700"
                        >
                          Years of Experience
                        </label>

                        <div className="relative">
                          <select
                            id="experience"
                            name="experience"
                            required
                            value={formData.experience}
                            onChange={(e) =>
                              updateField("experience", e.target.value)
                            }
                            className={`${selectBase} ${
                              errors.experience
                                ? "border-error-500 focus:border-error-500 focus:ring-error-500"
                                : "border-neutral-300"
                            } ${
                              !formData.experience ? "text-neutral-400" : ""
                            }`}
                            aria-invalid={
                              errors.experience ? "true" : undefined
                            }
                            aria-describedby={
                              errors.experience
                                ? "experience-error"
                                : undefined
                            }
                          >
                            {experienceOptions.map((opt) => (
                              <option
                                key={opt.value}
                                value={opt.value}
                                disabled={opt.value === ""}
                                hidden={opt.value === ""}
                              >
                                {opt.label}
                              </option>
                            ))}
                          </select>

                          {/* Chevron icon */}
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </span>
                        </div>

                        {errors.experience && (
                          <p
                            id="experience-error"
                            className="mt-1.5 text-sm text-error-600"
                          >
                            {errors.experience}
                          </p>
                        )}
                      </div>

                      {/* Skills */}
                      <Input
                        label="Skills"
                        name="skills"
                        placeholder="e.g. React, Java, SQL"
                        required
                        value={formData.skills}
                        onChange={(e) =>
                          updateField("skills", e.target.value)
                        }
                        error={errors.skills}
                      />
                    </div>
                  </fieldset>

                  {/* Separator */}
                  <hr className="my-6 border-neutral-100 sm:my-7" />

                  {/* ─────────── ACCOUNT SECURITY ─────────── */}
                  <fieldset>
                    <legend className="mb-4 flex w-full items-center gap-3">
                      <span className="shrink-0 text-[13px] font-bold uppercase tracking-[0.14em] text-accent-600">
                        Account Security
                      </span>
                      <span className="h-px flex-1 bg-neutral-100" />
                    </legend>

                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                      {/* Password */}
                      <Input
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        required
                        value={formData.password}
                        onChange={(e) =>
                          updateField("password", e.target.value)
                        }
                        error={errors.password}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((p) => !p)
                            }
                            className="cursor-pointer text-neutral-400 transition-colors hover:text-neutral-600"
                            aria-label={
                              showPassword
                                ? "Hide password"
                                : "Show password"
                            }
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        }
                      />

                      {/* Confirm Password */}
                      <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          updateField("confirmPassword", e.target.value)
                        }
                        error={errors.confirmPassword}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((p) => !p)
                            }
                            className="cursor-pointer text-neutral-400 transition-colors hover:text-neutral-600"
                            aria-label={
                              showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                            }
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        }
                      />
                    </div>

                    {/* Password hint */}
                    <p className="mt-2 text-[13px] text-neutral-400">
                      Use at least 8 characters with a mix of letters and
                      numbers.
                    </p>
                  </fieldset>

                  {/* Separator */}
                  <hr className="my-6 border-neutral-100 sm:my-7" />

                  {/* ─────────── TERMS ─────────── */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={(e) =>
                        updateField("agreeTerms", e.target.checked)
                      }
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-neutral-300 text-accent-600 accent-accent-600 focus:ring-accent-500"
                      aria-invalid={
                        errors.agreeTerms ? "true" : undefined
                      }
                      aria-describedby={
                        errors.agreeTerms ? "terms-error" : undefined
                      }
                    />

                    <label
                      htmlFor="agreeTerms"
                      className="cursor-pointer text-sm leading-5 text-neutral-600"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="font-medium text-accent-600 underline-offset-2 transition-colors hover:text-accent-700 hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="font-medium text-accent-600 underline-offset-2 transition-colors hover:text-accent-700 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </label>
                  </div>

                  {errors.agreeTerms && (
                    <p
                      id="terms-error"
                      className="mt-1.5 text-sm text-error-600"
                    >
                      {errors.agreeTerms}
                    </p>
                  )}

                  {/* ─────────── CTA BUTTON ─────────── */}
                  <div className="mt-7">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      isLoading={isLoading}
                      disabled={isLoading}
                      leftIcon={
                        isLoading ? undefined : (
                          <UserRound className="h-4 w-4" />
                        )
                      }
                    >
                      {isLoading
                        ? "Creating Account…"
                        : "Create Candidate Account"}
                    </Button>
                  </div>
                </form>
              </div>

              {/* ── Login prompt ── */}
              <p className="mt-5 text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-accent-600 underline-offset-2 transition-colors duration-150 hover:text-accent-700 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  );
}