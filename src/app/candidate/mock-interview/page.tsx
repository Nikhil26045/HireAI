"use client";

import { useState } from "react";
import CandidateLayout from "@/components/layouts/CandidateLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { BrainCircuit, Sparkles, CheckCircle2, AlertCircle, Video, PlayCircle, Settings2, ShieldCheck, UserCircle, Mic } from "lucide-react";

type InterviewFocus = "General Interview" | "Technical Interview" | "Behavioral Interview" | "HR Interview";
type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type NumQuestions = "5 Questions" | "10 Questions" | "15 Questions";

export default function MockInterviewPage() {
  const [focus, setFocus] = useState<InterviewFocus>("General Interview");
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [questions, setQuestions] = useState<NumQuestions>("10 Questions");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  // START STATE
  if (isStarted) {
    return (
      <CandidateLayout>
        <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mt-10">
            <Badge variant="primary" className="mb-4">
              <Sparkles size={14} className="mr-1.5" />
              MOCK INTERVIEW
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-navy-900 md:text-4xl mb-3">
              Your practice interview is ready.
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-600 mb-8">
              <span className="flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 font-medium">
                <Settings2 size={16} className="text-neutral-500" />
                {focus}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 font-medium">
                <ShieldCheck size={16} className="text-neutral-500" />
                {difficulty}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 font-medium">
                <BrainCircuit size={16} className="text-neutral-500" />
                {questions}
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card p-8 text-center max-w-2xl mx-auto">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-50 text-accent-600 mb-6">
              <Video size={36} strokeWidth={1.5} />
            </div>
            
            <h2 className="text-xl font-bold text-navy-900 mb-2">AI Interviewer</h2>
            <p className="text-neutral-500 mb-8">
              Your mock interview session will appear here.
            </p>

            <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-5 mb-8 text-left flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 leading-relaxed">
                <strong className="font-semibold block mb-1">Note:</strong>
                Camera, microphone, AI questioning, and response evaluation will be connected during backend integration.
              </p>
            </div>

            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setIsStarted(false)}
              className="text-neutral-600 border-neutral-300 hover:bg-neutral-50"
            >
              End Practice
            </Button>
          </div>
        </div>
      </CandidateLayout>
    );
  }

  // SETUP STATE
  return (
    <CandidateLayout>
      <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* PAGE HEADER */}
        <section>
          <div className="mb-7">
            <Badge variant="primary" className="mb-4">
              <BrainCircuit size={14} className="mr-1.5" />
              AI PRACTICE
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
              AI Mock Interview
            </h1>

            <p className="mt-3 max-w-2xl text-base text-neutral-500 md:text-lg">
              Practice your interview skills with an AI interviewer and build confidence before your next interview.
            </p>
          </div>
        </section>

        {/* HERO / INTRO CARD */}
        <section>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 text-white shadow-lg">
            <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-accent-500/20 blur-[60px]" />
            <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-1/4 translate-y-1/4 rounded-full bg-blue-400/20 blur-[50px]" />
            
            <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold mb-3 md:text-3xl text-white">
                  Practice. Improve. Get Interview-Ready.
                </h2>
                <p className="text-blue-100 text-sm md:text-base mb-6 leading-relaxed">
                  Simulate a realistic interview experience and practice answering questions with confidence.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-blue-50">
                    <CheckCircle2 size={18} className="text-accent-400 flex-shrink-0" />
                    AI-generated interview questions
                  </li>
                  <li className="flex items-center gap-3 text-sm text-blue-50">
                    <CheckCircle2 size={18} className="text-accent-400 flex-shrink-0" />
                    Practice at your own pace
                  </li>
                  <li className="flex items-center gap-3 text-sm text-blue-50">
                    <CheckCircle2 size={18} className="text-accent-400 flex-shrink-0" />
                    Review your performance
                  </li>
                </ul>
              </div>
              <div className="hidden md:flex h-32 w-32 items-center justify-center rounded-3xl bg-white/10 border border-white/20 backdrop-blur-sm">
                <Mic size={48} className="text-accent-300" strokeWidth={1} />
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
          
          {/* LEFT: MOCK INTERVIEW SETUP */}
          <section className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-navy-900 mb-6">Set Up Your Mock Interview</h2>
              
              <div className="space-y-8">
                {/* Focus */}
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-3">
                    Interview Focus
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(["General Interview", "Technical Interview", "Behavioral Interview", "HR Interview"] as InterviewFocus[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFocus(f)}
                        className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                          focus === f 
                            ? "border-accent-500 bg-accent-50 ring-1 ring-accent-500" 
                            : "border-neutral-200 bg-white hover:border-accent-200 hover:bg-neutral-50"
                        }`}
                      >
                        <span className={`font-medium ${focus === f ? "text-accent-900" : "text-neutral-700"}`}>
                          {f}
                        </span>
                        {focus === f && <CheckCircle2 size={18} className="text-accent-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-3">
                    Difficulty
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {(["Beginner", "Intermediate", "Advanced"] as Difficulty[]).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                          difficulty === d 
                            ? "border-accent-500 bg-accent-50 text-accent-700" 
                            : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Questions */}
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-3">
                    Number of Questions
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {(["5 Questions", "10 Questions", "15 Questions"] as NumQuestions[]).map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuestions(q)}
                        className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                          questions === q 
                            ? "border-accent-500 bg-accent-50 text-accent-700" 
                            : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT COL */}
          <div className="space-y-6">
            
            {/* PRACTICE TIPS */}
            <Card padding="lg" className="rounded-2xl border border-neutral-200 shadow-sm bg-white">
              <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
                <UserCircle size={20} className="text-accent-500" />
                Before You Start
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold text-accent-600">1</span>
                  </div>
                  <p className="text-sm text-neutral-600">Find a quiet place</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold text-accent-600">2</span>
                  </div>
                  <p className="text-sm text-neutral-600">Keep your resume nearby</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold text-accent-600">3</span>
                  </div>
                  <p className="text-sm text-neutral-600">Answer naturally and clearly</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold text-accent-600">4</span>
                  </div>
                  <p className="text-sm text-neutral-600">Treat it like a real interview</p>
                </li>
              </ul>
            </Card>

            {/* START MOCK INTERVIEW CTA */}
            <div className="rounded-2xl bg-accent-50 border border-accent-100 p-6 text-center">
              <h3 className="text-lg font-bold text-navy-900 mb-2">Ready to practice?</h3>
              <p className="text-sm text-neutral-600 mb-6">
                Start your mock interview and put your skills to the test.
              </p>
              <Button 
                size="lg" 
                className="w-full shadow-md"
                onClick={() => setIsModalOpen(true)}
              >
                <PlayCircle size={18} className="mr-2" />
                Start Mock Interview
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Start Mock Interview?"
        size="md"
      >
        <div className="mt-2 space-y-5">
          <p className="text-sm text-neutral-500">
            This is a practice interview. Your responses will be simulated for now.
          </p>
          
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-500">Focus</span>
              <span className="font-semibold text-navy-900">{focus}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-500">Difficulty</span>
              <span className="font-semibold text-navy-900">{difficulty}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-500">Questions</span>
              <span className="font-semibold text-navy-900">{questions}</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsModalOpen(false);
                setIsStarted(true);
              }}
            >
              Start Practice
            </Button>
          </div>
        </div>
      </Modal>

    </CandidateLayout>
  );
}

