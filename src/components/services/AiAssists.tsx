"use client";

import React from "react";
import {
  BrainCircuit,
  FileText,
  Mic,
  Target,
  Sparkles,
  Eye,
  Scale,
  CheckCircle2,
} from "lucide-react";
import InViewport from "@/components/home/InViewport";

const inputSignals = [
  {
    label: "Resume",
    icon: FileText,
    position: "signal-one",
  },
  {
    label: "Interview",
    icon: Mic,
    position: "signal-two",
  },
  {
    label: "Skills",
    icon: Target,
    position: "signal-three",
  },
  {
    label: "Assessment",
    icon: Scale,
    position: "signal-four",
  },
];

const decisionSignals = [
  {
    label: "Review",
    icon: Eye,
  },
  {
    label: "Context",
    icon: BrainCircuit,
  },
  {
    label: "Decide",
    icon: CheckCircle2,
  },
];

function AiAssists() {
  return (
    <section className="ai-assists-section">
      <div className="ai-assists-shell">
        <div className="ai-orb ai-orb-one" />
        <div className="ai-orb ai-orb-two" />

        <InViewport>
          <div className="ai-section-label">
            <Sparkles size={15} strokeWidth={2.2} />
            <span>HUMAN-IN-THE-LOOP AI</span>
          </div>
        </InViewport>

        <InViewport>
          <div className="ai-heading-wrap">
            <h2>
              AI analyzes.
              <br />
              <span>Recruiters decide.</span>
            </h2>

            <p>
              HireAI turns resumes, interviews, assessments, and candidate
              signals into structured intelligence — giving recruiters better
              evidence while keeping the final decision human.
            </p>
          </div>
        </InViewport>

        <InViewport>
          <div className="ai-visual">
            <div className="analysis-side">
              <div className="side-caption">
                <span className="caption-dot blue-dot" />
                AI ANALYSIS
              </div>

              <div className="signal-stack">
                {inputSignals.map((signal, index) => {
                  const Icon = signal.icon;

                  return (
                    <div
                      key={signal.label}
                      className={`signal-pill ${signal.position}`}
                      style={{
                        animationDelay: `${index * 0.15}s`,
                      }}
                    >
                      <span className="signal-icon">
                        <Icon size={16} strokeWidth={2} />
                      </span>

                      <span>{signal.label}</span>

                      <span className="signal-status" />
                    </div>
                  );
                })}
              </div>

              <div className="analysis-note">
                <span />
                Multiple candidate signals
              </div>
            </div>

            <div className="intelligence-core">
              <div className="core-ring core-ring-one" />
              <div className="core-ring core-ring-two" />

              <div className="core-card">
                <div className="core-icon">
                  <BrainCircuit size={27} strokeWidth={1.8} />
                </div>

                <div className="core-title">STRUCTURED</div>
                <div className="core-title accent">INTELLIGENCE</div>

                <div className="core-line">
                  <span />
                  <span />
                  <span />
                </div>

                <p>
                  Signals organized into meaningful hiring evidence.
                </p>
              </div>
            </div>

            <div className="decision-side">
              <div className="side-caption decision-caption">
                <span className="caption-dot green-dot" />
                HUMAN JUDGMENT
              </div>

              <div className="decision-card">
                <div className="decision-card-top">
                  <div>
                    <span className="decision-eyebrow">
                      RECRUITER REVIEW
                    </span>

                    <h3>Final decision stays human.</h3>
                  </div>

                  <div className="decision-shield">
                    <CheckCircle2 size={19} />
                  </div>
                </div>

                <div className="decision-divider" />

                <div className="decision-options">
                  {decisionSignals.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div
                        className="decision-item"
                        key={item.label}
                        style={{
                          animationDelay: `${0.4 + index * 0.15}s`,
                        }}
                      >
                        <span className="decision-item-icon">
                          <Icon size={15} strokeWidth={2} />
                        </span>

                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="decision-footer">
                  <span className="footer-pulse" />
                  AI provides evidence. You provide judgment.
                </div>
              </div>
            </div>
          </div>
        </InViewport>

        <InViewport>
          <div className="ai-bottom-statement">
            <div className="statement-line" />

            <div className="statement-content">
              <span className="statement-number"></span>

              <span>
                Better signals
                <strong> without automated decisions.</strong>
              </span>
            </div>

            <div className="statement-line" />
          </div>
        </InViewport>
      </div>

      <style jsx>{`
        .ai-assists-section {
          position: relative;
          overflow: hidden;
          padding: 72px 24px 78px;
          background:
            radial-gradient(
              circle at 18% 45%,
              rgba(37, 99, 235, 0.075),
              transparent 30%
            ),
            radial-gradient(
              circle at 82% 58%,
              rgba(79, 70, 229, 0.065),
              transparent 30%
            ),
            linear-gradient(180deg, #f8fbff 0%, #f3f7fd 100%);
        }

        .ai-assists-shell {
          position: relative;
          max-width: 1320px;
          margin: 0 auto;
          padding: 54px 58px 46px;
          border: 1px solid rgba(37, 99, 235, 0.13);
          border-radius: 32px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.96),
              rgba(246, 250, 255, 0.96)
            );
          box-shadow:
            0 28px 80px rgba(15, 35, 75, 0.09),
            0 8px 25px rgba(37, 99, 235, 0.045);
        }

        .ai-orb {
          position: absolute;
          pointer-events: none;
          border-radius: 999px;
          filter: blur(1px);
        }

        .ai-orb-one {
          width: 280px;
          height: 280px;
          left: -150px;
          top: 180px;
          background: radial-gradient(
            circle,
            rgba(37, 99, 235, 0.09),
            transparent 68%
          );
        }

        .ai-orb-two {
          width: 300px;
          height: 300px;
          right: -160px;
          bottom: -130px;
          background: radial-gradient(
            circle,
            rgba(99, 102, 241, 0.09),
            transparent 68%
          );
        }

        .ai-section-label {
          position: relative;
          z-index: 2;
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 9px 15px;
          border: 1px solid rgba(37, 99, 235, 0.15);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.82);
          color: #2455c3;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
          box-shadow: 0 7px 22px rgba(37, 99, 235, 0.07);
        }

        .ai-heading-wrap {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 60px;
          margin-top: 26px;
        }

        .ai-heading-wrap h2 {
          margin: 0;
          color: #071633;
          font-size: clamp(42px, 5vw, 70px);
          line-height: 0.98;
          letter-spacing: -0.055em;
          font-weight: 800;
        }

        .ai-heading-wrap h2 span {
          background: linear-gradient(
            90deg,
            #2563eb 0%,
            #4f46e5 55%,
            #6366f1 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .ai-heading-wrap p {
          max-width: 470px;
          margin: 0 0 5px;
          color: #566987;
          font-size: 17px;
          line-height: 1.75;
        }

        .ai-visual {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 250px 1fr;
          align-items: center;
          gap: 34px;
          min-height: 330px;
          margin-top: 46px;
          padding: 28px 0 20px;
        }

        .analysis-side,
        .decision-side {
          position: relative;
          min-width: 0;
        }

        .side-caption {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 17px;
          color: #60718d;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .caption-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .blue-dot {
          background: #2563eb;
          box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.09);
        }

        .green-dot {
          background: #10b981;
          box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.09);
        }

        .signal-stack {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px;
        }

        .signal-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 53px;
          padding: 9px 12px;
          border: 1px solid #dbe5f4;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.88);
          color: #17294a;
          font-size: 13px;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(15, 35, 75, 0.045);
          animation: signalFloat 4s ease-in-out infinite;
        }

        .signal-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 31px;
          height: 31px;
          flex-shrink: 0;
          border-radius: 10px;
          background: #eef4ff;
          color: #2563eb;
        }

        .signal-status {
          width: 5px;
          height: 5px;
          margin-left: auto;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.08);
        }

        .analysis-note {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 15px;
          color: #71819a;
          font-size: 12px;
        }

        .analysis-note span {
          width: 22px;
          height: 1px;
          background: #b7c8e5;
        }

        .intelligence-core {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 250px;
          height: 250px;
          margin: 0 auto;
        }

        .core-ring {
          position: absolute;
          border: 1px solid rgba(37, 99, 235, 0.15);
          border-radius: 50%;
        }

        .core-ring-one {
          inset: 17px;
          animation: rotateRing 16s linear infinite;
        }

        .core-ring-two {
          inset: 36px;
          border-color: rgba(99, 102, 241, 0.18);
          animation: rotateRingReverse 12s linear infinite;
        }

        .core-card {
          position: relative;
          z-index: 2;
          width: 156px;
          height: 156px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px solid rgba(37, 99, 235, 0.18);
          border-radius: 28px;
          background: linear-gradient(145deg, #ffffff, #eef5ff);
          box-shadow:
            0 20px 45px rgba(37, 99, 235, 0.13),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          animation: coreFloat 5s ease-in-out infinite;
        }

        .core-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 43px;
          height: 43px;
          margin-bottom: 10px;
          border-radius: 13px;
          background: linear-gradient(135deg, #e8f1ff, #eef0ff);
          color: #315ee8;
        }

        .core-title {
          color: #0a1c3b;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.11em;
        }

        .core-title.accent {
          color: #3d5fe8;
        }

        .core-line {
          display: flex;
          gap: 4px;
          margin: 9px 0 7px;
        }

        .core-line span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #4f46e5;
        }

        .core-card p {
          max-width: 118px;
          margin: 0;
          color: #7a89a1;
          font-size: 8px;
          line-height: 1.45;
        }

        .decision-card {
          padding: 21px;
          border: 1px solid #d9e4f2;
          border-radius: 21px;
          background: rgba(255, 255, 255, 0.92);
          box-shadow:
            0 18px 40px rgba(15, 35, 75, 0.07),
            0 3px 10px rgba(15, 35, 75, 0.025);
        }

        .decision-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        .decision-eyebrow {
          color: #72829b;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .decision-card h3 {
          margin: 7px 0 0;
          color: #0a1b39;
          font-size: 18px;
          line-height: 1.25;
          letter-spacing: -0.025em;
        }

        .decision-shield {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border-radius: 12px;
          background: #ecfbf5;
          color: #0ca678;
        }

        .decision-divider {
          height: 1px;
          margin: 17px 0;
          background: #e7edf5;
        }

        .decision-options {
          display: flex;
          gap: 8px;
        }

        .decision-item {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 10px;
          border: 1px solid #e2e9f3;
          border-radius: 10px;
          background: #f9fbfe;
          color: #314562;
          font-size: 11px;
          font-weight: 700;
          animation: decisionAppear 0.7s ease-out both;
        }

        .decision-item-icon {
          color: #315fe7;
        }

        .decision-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          color: #74839a;
          font-size: 10px;
          line-height: 1.4;
        }

        .footer-pulse {
          width: 6px;
          height: 6px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.08);
        }

        .ai-bottom-statement {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 16px;
        }

        .statement-line {
          height: 1px;
          flex: 1;
          background: linear-gradient(
            90deg,
            transparent,
            #d7e2f1
          );
        }

        .statement-line:last-child {
          background: linear-gradient(
            90deg,
            #d7e2f1,
            transparent
          );
        }

        .statement-content {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #65758e;
          font-size: 11px;
          white-space: nowrap;
        }

        .statement-number {
          color: #315fe7;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .statement-content strong {
          color: #182b4b;
          font-weight: 800;
        }

        @keyframes signalFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes coreFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes rotateRing {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotateRingReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes decisionAppear {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1000px) {
          .ai-assists-shell {
            padding: 45px 35px 40px;
          }

          .ai-heading-wrap {
            align-items: flex-start;
            flex-direction: column;
            gap: 20px;
          }

          .ai-visual {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .intelligence-core {
            order: 2;
          }

          .analysis-side {
            order: 1;
          }

          .decision-side {
            order: 3;
          }

          .signal-stack {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 700px) {
          .ai-assists-section {
            padding: 45px 14px;
          }

          .ai-assists-shell {
            padding: 34px 20px 32px;
            border-radius: 24px;
          }

          .ai-heading-wrap h2 {
            font-size: 43px;
          }

          .ai-heading-wrap p {
            font-size: 15px;
          }

          .signal-stack {
            grid-template-columns: 1fr 1fr;
          }

          .decision-options {
            flex-wrap: wrap;
          }

          .ai-bottom-statement {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .signal-pill,
          .core-card,
          .core-ring,
          .decision-item {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

export default AiAssists;