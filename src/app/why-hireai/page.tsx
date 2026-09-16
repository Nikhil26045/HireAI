import PublicLayout from "@/components/layouts/PublicLayout";
import { WhyHireAIPage } from "@/components/whyhireai";

export const metadata = {
  title: "Why HireAI — Candidate Evaluation Beyond the Resume",
  description:
    "See how HireAI combines resume information, structured interview responses, and explainable AI-assisted insights for recruiter review.",
};

export default function WhyHireAI() {
  return (
    <PublicLayout>
      <WhyHireAIPage />
    </PublicLayout>
  );
}