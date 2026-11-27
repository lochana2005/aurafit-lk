import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import AuthenticityPipeline from "@/components/about/AuthenticityPipeline";
import FlagshipShowcase from "@/components/about/FlagshipShowcase";

export const metadata: Metadata = {
  title: "About Us | AuraFit.lk — Authentic Sports Nutrition Sri Lanka",
  description:
    "Learn how AuraFit.lk guarantees 100% authentic USA & UK sports nutrition in Sri Lanka with direct imports, climate-controlled storage, and holographic QR batch verification.",
};

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-[#09090B]">
      <AboutHero />
      <AuthenticityPipeline />
      <FlagshipShowcase />
    </div>
  );
}
