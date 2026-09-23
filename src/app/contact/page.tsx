import { Metadata } from "next";
import PublicLayout from "@/components/layouts/PublicLayout";
import { ContactHero, ContactSection } from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact Us | HireAI",
  description:
    "Get in touch with HireAI. Have a question, want to explore AI-powered hiring, or want to talk? We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <PublicLayout>
      <ContactHero />
      <ContactSection />
    </PublicLayout>
  );
}

