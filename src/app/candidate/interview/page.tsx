"use client";

import { useState } from "react";
import Link from "next/link";
import CandidateLayout from "@/components/layouts/CandidateLayout";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import {
  ChevronLeft,
  Building,
  Calendar,
  Clock,
  Hourglass,
  BrainCircuit,
  FileText,
  Camera,
  Mic,
  Wifi,
  Sun,
  ArrowRight,
  Info,
  CheckCircle2,
  Video
} from "lucide-react";

export default function CandidateInterviewPage() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);

  // If the interview is "started", show the placeholder state
  if (isInterviewStarted) {
    return (
      <CandidateLayout>
        <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="h-24 w-24 rounded-[2rem] bg-accent-50 border border-accent-100 flex items-center justify-center text-accent-600 shadow-glow mb-6">
            <Video size={48} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-navy-900 tracking-tight mb-3">You&apos;re all set</h1>
          <p className="text-lg text-neutral-500 max-w-md mx-auto mb-8 font-medium">
            Interview interface ready. Your AI interview experience will appear here once the interview service is connected.
          </p>
          <Link href="/candidate">
            <Button variant="primary" size="lg" className="shadow-navy h-12 px-8">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* 1. BACK TO DASHBOARD */}
        <div className="mb-4">
          <Link href="/candidate" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-navy-600 transition-colors group">
            <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        {/* 2. INTERVIEW HEADER / HERO */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden relative transition-shadow hover:shadow-card">
          {/* subtle background pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          <div className="p-8 sm:p-10 relative z-10">
            <Badge variant="primary" className="mb-4 font-bold uppercase tracking-wider text-[11px] shadow-sm">AI Interview</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight mb-3">AI Candidate Evaluation</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-neutral-600 font-medium mb-6">
              <span className="flex items-center gap-2"><Building size={18} className="text-neutral-400" /> TechNova Solutions</span>
              <span className="hidden sm:block text-neutral-300">&bull;</span>
              <Badge variant="success" className="w-max font-semibold shadow-sm">Scheduled</Badge>
            </div>
            <p className="text-neutral-500 text-lg max-w-2xl leading-relaxed">
              Complete your AI-powered interview to showcase your skills and experience.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* 3. INTERVIEW DETAILS */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-card">
              <h2 className="text-xl font-bold text-navy-900 mb-6">Interview Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <p className="text-sm text-neutral-500 font-medium mb-1">Interview Type</p>
                  <p className="font-bold text-navy-900 flex items-center gap-2">
                    <BrainCircuit size={18} className="text-accent-500" /> AI Interview
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium mb-1">Company</p>
                  <p className="font-bold text-navy-900 flex items-center gap-2">
                    <Building size={18} className="text-neutral-400" /> TechNova Solutions
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium mb-1">Date</p>
                  <p className="font-bold text-navy-900 flex items-center gap-2">
                    <Calendar size={18} className="text-neutral-400" /> October 12, 2026
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium mb-1">Time</p>
                  <p className="font-bold text-navy-900 flex items-center gap-2">
                    <Clock size={18} className="text-neutral-400" /> 10:30 AM
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium mb-1">Duration</p>
                  <p className="font-bold text-navy-900 flex items-center gap-2">
                    <Hourglass size={18} className="text-neutral-400" /> ~20–30 minutes
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium mb-1">Status</p>
                  <div className="mt-1">
                    <Badge variant="success" className="font-semibold shadow-sm">Scheduled</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. WHAT TO EXPECT */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-card">
              <h2 className="text-xl font-bold text-navy-900 mb-8">What to Expect</h2>
              <div className="space-y-8 relative">
                
                {/* Connecting line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-px bg-neutral-100 hidden sm:block"></div>

                {[
                  { step: "01", title: "Interview Setup", desc: "Check your camera, microphone, and environment." },
                  { step: "02", title: "AI Interview", desc: "The AI interviewer will ask questions based on your profile and resume." },
                  { step: "03", title: "Your Responses", desc: "Answer each question clearly and naturally." },
                  { step: "04", title: "Evaluation", desc: "Your responses will be evaluated as part of the candidate assessment." }
                ].map((s, i) => (
                  <div key={i} className="flex gap-4 sm:gap-6 relative z-10">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent-50 text-accent-600 font-bold flex items-center justify-center border border-accent-100 shadow-sm">
                      {s.step}
                    </div>
                    <div className="pt-1.5">
                      <h3 className="font-bold text-navy-900 text-lg mb-1.5">{s.title}</h3>
                      <p className="text-neutral-500 text-sm font-medium leading-relaxed max-w-lg">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="space-y-6">
            
            {/* 5. RESUME USED FOR INTERVIEW */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 relative transition-shadow hover:shadow-card">
              <h2 className="text-lg font-bold text-navy-900 mb-4">Resume for this Interview</h2>
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 flex items-start gap-4 mb-5">
                <div className="text-accent-500 mt-1">
                  <FileText size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-bold text-navy-900 text-sm truncate max-w-[200px]" title="alex_chen_resume.pdf">alex_chen_resume.pdf</p>
                  <p className="text-xs font-medium text-neutral-500 mt-1">PDF Document &bull; 2.4 MB</p>
                  <Badge variant="primary" size="sm" className="mt-2 font-semibold">Ready for AI Evaluation</Badge>
                </div>
              </div>
              <p className="text-sm text-neutral-500 mb-5 leading-relaxed font-medium">
                Your resume may be used to personalize interview questions.
              </p>
              <Link href="/candidate/resume" className="block">
                <Button variant="outline" className="w-full justify-center shadow-sm hover:bg-neutral-50">View Resume</Button>
              </Link>
            </div>

            {/* 6. INTERVIEW REQUIREMENTS */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 transition-shadow hover:shadow-card">
              <h2 className="text-lg font-bold text-navy-900 mb-5">Before You Start</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-neutral-600 font-semibold">
                  <Wifi size={18} className="text-success-600 shrink-0" /> Stable internet connection
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-600 font-semibold">
                  <Camera size={18} className="text-success-600 shrink-0" /> Working camera
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-600 font-semibold">
                  <Mic size={18} className="text-success-600 shrink-0" /> Working microphone
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-600 font-semibold">
                  <Sun size={18} className="text-success-600 shrink-0" /> Quiet, well-lit environment
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-600 font-semibold">
                  <FileText size={18} className="text-success-600 shrink-0" /> Keep resume up to date
                </li>
              </ul>
            </div>

            {/* 7. IMPORTANT NOTE */}
            <div className="bg-warning-50 rounded-2xl border border-warning-200 p-5 flex items-start gap-3 shadow-sm">
              <Info size={20} className="text-warning-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-warning-800 text-sm mb-1.5">Before starting</h3>
                <p className="text-sm text-warning-700 leading-relaxed font-medium">
                  Make sure you are ready to complete the interview in one sitting. Once the interview begins, avoid refreshing or closing the page.
                </p>
              </div>
            </div>

            {/* 8. START INTERVIEW CTA */}
            <div className="pt-2">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full text-base font-bold shadow-navy flex items-center justify-center gap-2 h-14 transition-transform hover:-translate-y-1"
                onClick={() => setIsConfirmModalOpen(true)}
              >
                Start Interview <ArrowRight size={20} />
              </Button>
            </div>
            
          </div>
        </div>
        
        {/* 9. START INTERVIEW CONFIRMATION MODAL */}
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title="Ready to start?"
          description="You are about to begin your AI interview with TechNova Solutions."
          size="md"
        >
          <div className="mt-5 mb-7">
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm font-semibold text-neutral-700 bg-neutral-50 p-3 rounded-lg border border-neutral-100 shadow-sm">
                <CheckCircle2 size={20} className="text-success-500" /> Camera ready
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-neutral-700 bg-neutral-50 p-3 rounded-lg border border-neutral-100 shadow-sm">
                <CheckCircle2 size={20} className="text-success-500" /> Microphone ready
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-neutral-700 bg-neutral-50 p-3 rounded-lg border border-neutral-100 shadow-sm">
                <CheckCircle2 size={20} className="text-success-500" /> Quiet environment
              </li>
              <li className="flex items-center gap-3 text-sm font-semibold text-neutral-700 bg-neutral-50 p-3 rounded-lg border border-neutral-100 shadow-sm">
                <CheckCircle2 size={20} className="text-success-500" /> Stable internet connection
              </li>
            </ul>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-5 border-t border-neutral-100">
            <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>Go Back</Button>
            <Button variant="primary" className="shadow-navy" onClick={() => {
              setIsConfirmModalOpen(false);
              setIsInterviewStarted(true);
            }}>
              Start Interview
            </Button>
          </div>
        </Modal>

      </div>
    </CandidateLayout>
  );
}


