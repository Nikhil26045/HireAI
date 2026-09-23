import { Metadata } from "next";
import PublicLayout from "@/components/layouts/PublicLayout";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServiceExplorer } from "@/components/services/ServiceExplorer";
import { ProductVisualization } from "@/components/services/ProductVisualization";
import { BuiltForTwoSides } from "@/components/services/BuiltForTwoSides";
import AiAssists from "@/components/services/AiAssists";
import { FinalCTA } from "@/components/services/FinalCTA";

export const metadata: Metadata = {
  title: "Our Services | HireAI",
  description: "AI-powered capabilities for smarter hiring. From resume intelligence to interview evaluation and recruiter insights.",
};

export default function ServicesPage() {
  return (
    <PublicLayout>
      <ServicesHero />
      <ServiceExplorer />
      <ProductVisualization />
      <BuiltForTwoSides />
      <AiAssists />
      <FinalCTA />
    </PublicLayout>
  );
}

