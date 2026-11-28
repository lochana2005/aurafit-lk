import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import EditorialBanners from "@/components/home/EditorialBanners";
import FlashDealsSection from "@/components/home/FlashDealsSection";
import TopPicksSection from "@/components/home/TopPicksSection";
import TrustFeatures from "@/components/home/TrustFeatures";
import BrandMarquee from "@/components/home/BrandMarquee";
import AiCoachShowcase from "@/components/home/AiCoachShowcase";
import VerificationTrackingHub from "@/components/home/VerificationTrackingHub";

export default function HomePage() {
  return (
    <div className="w-full bg-[#09090B] text-white overflow-x-clip">
      <HeroSection />
      <CategorySection />
      <EditorialBanners />
      <FlashDealsSection />
      <TopPicksSection />
      <TrustFeatures />
      <BrandMarquee />
      <AiCoachShowcase />
      <VerificationTrackingHub />
    </div>
  );
}
