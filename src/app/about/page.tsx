import PublicLayout from "@/components/layouts/PublicLayout";
import {
  AboutHero,
  PurposeSection,
  WhyHireAISection,
  HiringTransformation,
  PrinciplesSection,
  ExplainableAISection,
  MetricsSection,
  AboutCTA,
} from "@/components/about";

export const metadata = {
  title: "About HireAI — AI-Powered Candidate Evaluation",
  description:
    "HireAI brings AI-powered candidate evaluation into the hiring process. Learn how explainable AI helps recruiters evaluate talent fairly and faster.",
  openGraph: {
    title: "About HireAI — AI-Powered Candidate Evaluation",
    description:
      "HireAI brings AI-powered candidate evaluation into the hiring process. Learn how explainable AI helps recruiters evaluate talent fairly and faster.",
  },
};

export default function About() {
  return (
    <PublicLayout>
      <AboutHero />
      <PurposeSection />
      <WhyHireAISection />
      <PrinciplesSection />
      <HiringTransformation />
      <ExplainableAISection />
      <MetricsSection />
      <AboutCTA />
    </PublicLayout>
  );
}
