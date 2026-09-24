import Image from "next/image";
import Link from "next/link";
import { Sparkles, TrendingUp, BrainCircuit, CheckCircle2 } from "lucide-react";
import InViewport from "../home/InViewport";

export function ServicesHero() {
  return (
    <section className="relative min-h-[55vh] lg:min-h-[60vh] flex items-center overflow-hidden bg-neutral-50">
      {/* 1. Full Hero Background Image */}
      <div className="absolute inset-0 z-0 hf-image-zoom overflow-hidden">
        <Image
          src="/services-hero.avif"
          alt="Services Background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        
        {/* 2. Integrated Overlays */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent"></div>
        <div className="absolute inset-0 bg-accent-50/20 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-14 pb-8 sm:px-5 sm:pt-16 sm:pb-10 lg:px-6 lg:pt-16 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
          
          {/* Main Text Content */}
          <div className="lg:col-span-7 xl:col-span-6 relative z-20">
            <InViewport threshold={0.1} dataAttr="hf-reveal">
              <div className="hf-stagger is-visible">
                
                {/* Small integrated badge */}
                <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 backdrop-blur-md px-3.5 py-1.5 shadow-sm">
                  <Sparkles className="w-4 h-4 text-accent-600" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-navy-900">
                    Our Services
                  </span>
                </div>

                <h1 className="text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] font-bold text-navy-900 tracking-tight leading-[1.05] mb-3 drop-shadow-sm">
                  AI-powered capabilities <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-accent-600 to-indigo-600">
                    for smarter hiring.
                  </span>
                </h1>

                <p className="text-[1.125rem] text-neutral-700 max-w-lg mb-4 leading-[1.6] font-medium drop-shadow-sm">
                  From resume intelligence to interview evaluation and recruiter insights, HireAI brings the essential tools for a structured candidate evaluation experience.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link href="#explore" className="inline-flex items-center justify-center rounded-lg bg-accent-600 px-7 py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-700 hover:shadow-[0_10px_25px_rgba(37,99,235,0.35)] active:translate-y-0">
                    Explore Services
                  </Link>
                  <Link href="/register" className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white/80 backdrop-blur-md px-7 py-3 text-[15px] font-semibold text-navy-900 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-0">
                    Get Started
                  </Link>
                </div>
              </div>
            </InViewport>
          </div>

          {/* Floating UI Elements (Desktop Right Side) */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 relative h-[300px] pointer-events-none">
            
            {/* Ambient light behind the floating cards */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent-100/40 rounded-full blur-[80px] hf-glow-drift"></div>

            {/* Micro-Card 1: AI Evaluation Status */}
            <div 
              className="absolute top-0 right-[5%] w-60 bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-[0_15px_40px_rgba(0,10,40,0.08)] hf-float-delayed"
              style={{ animationDuration: '6s' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Evaluation Engine</p>
                  <p className="text-[13px] font-bold text-navy-900">Processing Data</p>
                </div>
              </div>
              <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-accent-500 w-[75%]" style={{ animation: 'hf-pulse 2s infinite alternate' }}></div>
              </div>
            </div>

            {/* Micro-Card 2: Top Candidate Score */}
            <div 
              className="absolute bottom-0 right-0 w-52 bg-white/90 backdrop-blur-xl border border-white rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,10,40,0.12)] hf-float-delayed"
              style={{ animationDelay: '1s', animationDuration: '7s' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-[11px] font-bold text-accent-700">92</div>
                  <span className="text-[13px] font-bold text-navy-900">Top Match</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-success-500" />
              </div>
              <p className="text-[11px] text-neutral-500 leading-tight">Candidate successfully matched against ideal profile.</p>
            </div>

            {/* Micro-Card 3: Impact Metric */}
            <div 
              className="absolute top-[40%] left-[-2%] w-48 bg-navy-900/90 backdrop-blur-xl border border-navy-700 rounded-2xl p-4 shadow-2xl hf-float-delayed text-white"
              style={{ animationDelay: '2s', animationDuration: '8s' }}
            >
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-1">Time to Hire</p>
              <div className="text-2xl font-bold mb-2">-40%</div>
              <div className="flex items-center gap-1.5 text-[11px] text-accent-400 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Accelerated by AI</span>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Inline styles for custom animations strictly related to this hero */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes hero-bg-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
        .hf-image-zoom > img {
          animation: hero-bg-zoom 30s infinite alternate ease-in-out;
        }
      `}} />
    </section>
  );
}

