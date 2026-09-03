import PublicLayout from "@/components/layouts/PublicLayout";
import {
  HeroSection,
  CoreProductSection,
  WorkflowSection,
  DashboardShowcase,
  ExplainableWhySection,
  FinalCTA,
} from "@/components/home";

export default function Home() {
  return (
    <PublicLayout>
      <HeroSection />
      <CoreProductSection />
      <WorkflowSection />
      <DashboardShowcase />
      <ExplainableWhySection />
      <FinalCTA />
    </PublicLayout>
  );
}
