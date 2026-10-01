"use client";

import { useState, useRef } from "react";
import CandidateLayout from "@/components/layouts/CandidateLayout";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  UploadCloud,
  Eye,
  Download,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  BrainCircuit,
  FileSearch,
  FileQuestion,
  FileCheck2,
} from "lucide-react";

export default function ResumeManagementPage() {
  const [resumeData, setResumeData] = useState<{
    filename: string;
    type: string;
    size: string;
    date: string;
  } | null>({
    filename: "alex_chen_resume.pdf",
    type: "PDF Document",
    size: "2.4 MB",
    date: "October 1, 2026",
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  const handleDownload = () => {
    showSuccess("Resume download started.");
  };

  const handleRemove = () => {
    setResumeData(null);
    setIsRemoveOpen(false);
    showSuccess("Resume removed successfully.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      showError("Please upload a PDF file.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError("File size must be under 10 MB.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);

    setResumeData({
      filename: file.name,
      type: "PDF Document",
      size: `${sizeInMB} MB`,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    showSuccess("Resume uploaded successfully.");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <CandidateLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Toast Messages */}
        {successMsg && (
          <div className="fixed top-6 right-6 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-top-2 duration-300">
            <CheckCircle2 size={20} className="text-success-600" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="fixed top-6 right-6 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-top-2 duration-300">
            <AlertCircle size={20} className="text-error-600" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <Link
              href="/candidate"
              className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-navy-600 transition-colors mb-4 group"
            >
              <ChevronLeft
                size={16}
                className="mr-1 group-hover:-translate-x-1 transition-transform"
              />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-navy-900 tracking-tight flex flex-wrap items-center gap-3">
              Resume Management

              {resumeData && (
                <Badge
                  variant="success"
                  className="text-xs font-bold px-2.5 py-1 uppercase tracking-wider relative top-0.5 shadow-sm"
                >
                  <CheckCircle2 size={12} className="mr-1 inline-block" />
                  Resume Ready
                </Badge>
              )}
            </h1>

            <p className="mt-2 text-neutral-500 text-base">
              Manage the resume you use for AI-powered interviews and candidate
              evaluation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {/* CURRENT RESUME CARD / EMPTY STATE */}
            {resumeData ? (
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden transition-shadow hover:shadow-card">
                <div className="p-6 md:p-7">
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <div className="h-16 w-16 rounded-2xl bg-accent-50 border border-accent-100 flex items-center justify-center text-accent-600 flex-shrink-0 shadow-sm">
                      <FileText size={32} strokeWidth={1.5} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-1">
                        <h2 className="text-xl font-bold text-navy-900 truncate">
                          {resumeData.filename}
                        </h2>

                        <Badge variant="primary" className="w-max">
                          Ready for AI Evaluation
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mt-2">
                        <span className="font-medium text-neutral-700">
                          {resumeData.type}
                        </span>

                        <span className="w-1 h-1 rounded-full bg-neutral-300 hidden sm:block"></span>

                        <span>{resumeData.size}</span>

                        <span className="w-1 h-1 rounded-full bg-neutral-300 hidden sm:block"></span>

                        <span>Uploaded {resumeData.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-100 flex flex-wrap items-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setIsPreviewOpen(true)}
                    className="bg-white hover:bg-neutral-100 shadow-sm border border-neutral-200 flex-1 sm:flex-none"
                  >
                    <Eye size={18} className="mr-2" />
                    Preview
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={handleDownload}
                    className="bg-white hover:bg-neutral-100 shadow-sm border border-neutral-200 flex-1 sm:flex-none"
                  >
                    <Download size={18} className="mr-2" />
                    Download
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={triggerFileInput}
                    className="bg-white hover:bg-neutral-100 shadow-sm border border-neutral-200 flex-1 sm:flex-none"
                  >
                    <RefreshCw size={18} className="mr-2" />
                    Replace Resume
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setIsRemoveOpen(true)}
                    className="text-error-600 hover:bg-error-50 hover:text-error-700 sm:ml-auto px-3 flex-1 sm:flex-none justify-center"
                  >
                    <Trash2 size={18} />
                    <span className="ml-2 sm:sr-only md:not-sr-only">
                      Remove
                    </span>
                  </Button>
                </div>
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="bg-white rounded-2xl border border-dashed border-neutral-300 shadow-sm p-10 text-center flex flex-col items-center justify-center transition-all hover:border-accent-300 hover:bg-accent-50/10 min-h-[280px]">
                <div className="h-16 w-16 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 mb-4 shadow-sm">
                  <UploadCloud size={32} strokeWidth={1.5} />
                </div>

                <h2 className="text-xl font-bold text-navy-900 mb-2">
                  No resume uploaded
                </h2>

                <p className="text-neutral-500 max-w-sm mx-auto mb-6">
                  Upload your latest resume to prepare for AI-powered
                  interviews and evaluation.
                </p>

                <Button variant="primary" onClick={triggerFileInput}>
                  <UploadCloud size={18} className="mr-2" />
                  Upload Resume
                </Button>
              </div>
            )}

            {/* UPLOAD / REPLACE SECTION */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm px-6 py-5 sm:px-7 sm:py-6 transition-shadow hover:shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-navy-900 mb-1">
                    {resumeData ? "Replace your resume" : "Upload your resume"}
                  </h3>

                  <p className="text-sm text-neutral-500">
                    Upload a new PDF resume to keep your candidate profile up
                    to date.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Button
                    variant={resumeData ? "outline" : "primary"}
                    onClick={triggerFileInput}
                    className="w-full sm:w-auto shadow-sm"
                  >
                    <UploadCloud size={18} className="mr-2" />
                    {resumeData ? "Upload New Resume" : "Select PDF File"}
                  </Button>

                  <p className="text-xs text-neutral-400 font-medium whitespace-nowrap">
                    PDF only &bull; Maximum size 10 MB
                  </p>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
                aria-label="Upload resume"
              />
            </div>
          </div>

          {/* AI EVALUATION CARD */}
          <div className="space-y-5">
            <div className="bg-navy-800 rounded-2xl border border-navy-700 shadow-navy p-5 sm:p-6 relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-28 h-28 bg-accent-500 opacity-15 blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="bg-white/10 p-2 rounded-lg border border-white/10 text-accent-100">
                  <BrainCircuit size={19} />
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  Used for AI Interview Evaluation
                </h3>
              </div>

              <p className="text-sm text-accent-50/90 mb-5 leading-relaxed relative z-10 font-medium">
                Your resume helps HireAI generate interview questions based on
                your experience, skills, education, and projects.
              </p>

              <div className="space-y-3 relative z-10">
                <div className="flex items-start gap-3">
                  <div className="bg-white/10 rounded-full p-1 mt-0.5 text-accent-100 flex-shrink-0">
                    <FileSearch size={13} />
                  </div>

                  <span className="text-sm text-white font-medium">
                    Experience-based questions
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-white/10 rounded-full p-1 mt-0.5 text-accent-100 flex-shrink-0">
                    <FileQuestion size={13} />
                  </div>

                  <span className="text-sm text-white font-medium">
                    Skill-specific questions
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-white/10 rounded-full p-1 mt-0.5 text-accent-100 flex-shrink-0">
                    <FileCheck2 size={13} />
                  </div>

                  <span className="text-sm text-white font-medium">
                    Resume-aware AI evaluation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PREVIEW MODAL */}
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title="Resume Preview"
          size="xl"
        >
          <div className="mb-4">
            <p className="text-sm text-neutral-500 font-medium">
              Viewing: {resumeData?.filename}
            </p>
          </div>

          <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-6 sm:p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 shadow-sm border border-neutral-100 text-neutral-900">
              <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider border-b-2 border-neutral-900 pb-2 mb-2">
                Alex Chen
              </h1>

              <p className="text-neutral-500 mb-6 font-medium text-sm sm:text-base">
                Software Developer | alex.chen@example.com | +91 98765 43210
              </p>

              <div className="mb-6">
                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide border-b border-neutral-200 pb-1 mb-3 text-neutral-700">
                  Professional Summary
                </h2>

                <p className="text-sm text-neutral-600 leading-relaxed">
                  Passionate software developer with a strong foundation in
                  modern web technologies. Eager to contribute to innovative
                  projects and continuously learn new skills. Proven ability to
                  adapt to fast-paced environments and deliver high-quality
                  code.
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide border-b border-neutral-200 pb-1 mb-3 text-neutral-700">
                  Skills
                </h2>

                <p className="text-sm text-neutral-600 leading-relaxed">
                  <strong>Languages & Frameworks:</strong> Java, Python, React,
                  Next.js, SQL
                  <br />
                  <strong>Tools & Technologies:</strong> Git, REST APIs,
                  Docker, AWS
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide border-b border-neutral-200 pb-1 mb-3 text-neutral-700">
                  Experience
                </h2>

                <div className="mb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3 className="font-bold text-neutral-800">
                      Software Engineer Intern
                    </h3>

                    <span className="text-sm text-neutral-500 mt-1 sm:mt-0">
                      June 2025 – Aug 2025
                    </span>
                  </div>

                  <p className="text-sm font-medium italic text-neutral-600 mb-2">
                    TechNova Solutions
                  </p>

                  <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
                    <li>
                      Developed and maintained React components for the main
                      product dashboard.
                    </li>
                    <li>
                      Collaborated with backend engineers to integrate REST
                      APIs securely.
                    </li>
                    <li>
                      Improved frontend performance by optimizing state
                      management.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide border-b border-neutral-200 pb-1 mb-3 text-neutral-700">
                  Education
                </h2>

                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3 className="font-bold text-neutral-800">
                      B.Tech in Computer Science
                    </h3>

                    <span className="text-sm text-neutral-500 mt-1 sm:mt-0">
                      Expected 2027
                    </span>
                  </div>

                  <p className="text-sm text-neutral-600 italic">
                    SKIT Jaipur
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide border-b border-neutral-200 pb-1 mb-3 text-neutral-700">
                  Projects
                </h2>

                <div>
                  <h3 className="font-bold text-neutral-800 mb-1">
                    E-commerce Platform
                  </h3>

                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Built a full-stack e-commerce solution using Next.js and
                    Stripe for payments. Implemented user authentication and
                    dynamic shopping cart functionality.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => setIsPreviewOpen(false)}
              variant="primary"
            >
              Close Preview
            </Button>
          </div>
        </Modal>

        {/* REMOVE CONFIRMATION MODAL */}
        <Modal
          isOpen={isRemoveOpen}
          onClose={() => setIsRemoveOpen(false)}
          title="Remove resume?"
          description="Are you sure you want to remove your current resume? This will affect how the AI generates your interview questions."
          size="sm"
        >
          <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsRemoveOpen(false)}
            >
              Cancel
            </Button>

            <Button variant="danger" onClick={handleRemove}>
              Remove Resume
            </Button>
          </div>
        </Modal>
      </div>
    </CandidateLayout>
  );
}