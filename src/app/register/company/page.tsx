"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  BriefcaseBusiness,
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
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  industry: string;
  companySize: string;
  hiringRole: string;
  hiringNeeds: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface FormErrors {
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  industry?: string;
  companySize?: string;
  hiringRole?: string;
  hiringNeeds?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
}

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════ */

const industryOptions = [
  { label: "Select industry", value: "" },
  { label: "Information Technology", value: "it" },
  { label: "Software / SaaS", value: "software" },
  { label: "Finance", value: "finance" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Education", value: "education" },
  { label: "E-commerce", value: "ecommerce" },
  { label: "Telecommunications", value: "telecom" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Consulting", value: "consulting" },
  { label: "Other", value: "other" },
];

const companySizeOptions = [
  { label: "Select company size", value: "" },
  { label: "1–10 employees", value: "1-10" },
  { label: "11–50 employees", value: "11-50" },
  { label: "51–200 employees", value: "51-200" },
  { label: "201–500 employees", value: "201-500" },
  { label: "501–1000 employees", value: "501-1000" },
  { label: "1000+ employees", value: "1000+" },
];

/* ═══════════════════════════════════════════════════════════
   VALIDATION
   ═══════════════════════════════════════════════════════════ */

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.companyName.trim()) {
    errors.companyName = "Company name is required.";
  }

  if (!data.companyEmail.trim()) {
    errors.companyEmail = "Company email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.companyEmail.trim())) {
    errors.companyEmail = "Please enter a valid email address.";
  }

  if (!data.companyPhone.trim()) {
    errors.companyPhone = "Company phone is required.";
  }

  if (!data.industry) {
    errors.industry = "Please select an industry.";
  }

  if (!data.companySize) {
    errors.companySize = "Please select a company size.";
  }

  if (!data.hiringRole.trim()) {
    errors.hiringRole = "Primary hiring role is required.";
  }

  if (!data.hiringNeeds.trim()) {
    errors.hiringNeeds = "Please let us know what you are hiring for.";
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

export default function CompanyRegisterPage() {
  /* ── State ── */
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    industry: "",
    companySize: "",
    hiringRole: "",
    hiringNeeds: "",
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
                <BriefcaseBusiness className="mr-1.5 h-3 w-3" />
                FOR COMPANIES
              </Badge>
            </ScrollReveal>

            <ScrollReveal variant="reveal" delay={80}>
              <h1 className="text-[2rem] font-extrabold leading-[1.08] tracking-[-0.04em] text-navy-900 sm:text-[2.6rem] lg:text-[3.1rem]">
                Create your{" "}
                <span className="bg-gradient-to-r from-accent-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  Company Account
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="reveal" delay={160}>
              <p className="mx-auto mt-3 max-w-xl text-[1rem] leading-7 text-neutral-600 sm:text-[1.08rem]">
                Build your hiring workspace and find the right candidates with HireAI.
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
                  {/* ─────────── COMPANY INFORMATION ─────────── */}
                  <fieldset>
                    <legend className="mb-4 flex w-full items-center gap-3">
                      <span className="shrink-0 text-[13px] font-bold uppercase tracking-[0.14em] text-accent-600">
                        Company Information
                      </span>
                      <span className="h-px flex-1 bg-neutral-100" />
                    </legend>

                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                      {/* Company Name */}
                      <Input
                        label="Company Name"
                        name="companyName"
                        placeholder="Enter your company name"
                        required
                        value={formData.companyName}
                        onChange={(e) =>
                          updateField("companyName", e.target.value)
                        }
                        error={errors.companyName}
                      />

                      {/* Company Email */}
                      <Input
                        label="Company Email"
                        name="companyEmail"
                        type="email"
                        placeholder="company@example.com"
                        required
                        value={formData.companyEmail}
                        onChange={(e) =>
                          updateField("companyEmail", e.target.value)
                        }
                        error={errors.companyEmail}
                      />
                    </div>

                    <div className="mt-4 grid gap-4 sm:mt-5 sm:grid-cols-2 sm:gap-5">
                      {/* Company Phone */}
                      <Input
                        label="Company Phone"
                        name="companyPhone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        required
                        value={formData.companyPhone}
                        onChange={(e) =>
                          updateField("companyPhone", e.target.value)
                        }
                        error={errors.companyPhone}
                      />

                      {/* Industry */}
                      <div className="w-full">
                        <label
                          htmlFor="industry"
                          className="mb-1.5 block text-sm font-medium text-neutral-700"
                        >
                          Industry
                        </label>

                        <div className="relative">
                          <select
                            id="industry"
                            name="industry"
                            required
                            value={formData.industry}
                            onChange={(e) =>
                              updateField("industry", e.target.value)
                            }
                            className={`${selectBase} ${
                              errors.industry
                                ? "border-error-500 focus:border-error-500 focus:ring-error-500"
                                : "border-neutral-300"
                            } ${
                              !formData.industry ? "text-neutral-400" : ""
                            }`}
                            aria-invalid={
                              errors.industry ? "true" : undefined
                            }
                            aria-describedby={
                              errors.industry
                                ? "industry-error"
                                : undefined
                            }
                          >
                            {industryOptions.map((opt) => (
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

                        {errors.industry && (
                          <p
                            id="industry-error"
                            className="mt-1.5 text-sm text-error-600"
                          >
                            {errors.industry}
                          </p>
                        )}
                      </div>
                    </div>
                  </fieldset>

                  {/* Separator */}
                  <hr className="my-6 border-neutral-100 sm:my-7" />

                  {/* ─────────── HIRING INFORMATION ─────────── */}
                  <fieldset>
                    <legend className="mb-4 flex w-full items-center gap-3">
                      <span className="shrink-0 text-[13px] font-bold uppercase tracking-[0.14em] text-accent-600">
                        Hiring Information
                      </span>
                      <span className="h-px flex-1 bg-neutral-100" />
                    </legend>

                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                      {/* Company Size */}
                      <div className="w-full">
                        <label
                          htmlFor="companySize"
                          className="mb-1.5 block text-sm font-medium text-neutral-700"
                        >
                          Company Size
                        </label>

                        <div className="relative">
                          <select
                            id="companySize"
                            name="companySize"
                            required
                            value={formData.companySize}
                            onChange={(e) =>
                              updateField("companySize", e.target.value)
                            }
                            className={`${selectBase} ${
                              errors.companySize
                                ? "border-error-500 focus:border-error-500 focus:ring-error-500"
                                : "border-neutral-300"
                            } ${
                              !formData.companySize ? "text-neutral-400" : ""
                            }`}
                            aria-invalid={
                              errors.companySize ? "true" : undefined
                            }
                            aria-describedby={
                              errors.companySize
                                ? "companySize-error"
                                : undefined
                            }
                          >
                            {companySizeOptions.map((opt) => (
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

                        {errors.companySize && (
                          <p
                            id="companySize-error"
                            className="mt-1.5 text-sm text-error-600"
                          >
                            {errors.companySize}
                          </p>
                        )}
                      </div>

                      {/* Primary Hiring Role */}
                      <Input
                        label="Primary Hiring Role"
                        name="hiringRole"
                        placeholder="e.g. HR Manager / Recruiter"
                        required
                        value={formData.hiringRole}
                        onChange={(e) =>
                          updateField("hiringRole", e.target.value)
                        }
                        error={errors.hiringRole}
                      />
                    </div>

                    <div className="mt-4 sm:mt-5">
                      {/* Hiring Needs */}
                      <Input
                        label="What are you hiring for?"
                        name="hiringNeeds"
                        placeholder="e.g. Software Developers, Data Analysts"
                        required
                        value={formData.hiringNeeds}
                        onChange={(e) =>
                          updateField("hiringNeeds", e.target.value)
                        }
                        error={errors.hiringNeeds}
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
                          <BriefcaseBusiness className="h-4 w-4" />
                        )
                      }
                    >
                      {isLoading
                        ? "Creating Account…"
                        : "Create Company Account"}
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
