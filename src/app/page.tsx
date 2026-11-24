import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import EditorialBanners from "@/components/home/EditorialBanners";
import TopPicksSection from "@/components/home/TopPicksSection";
import TrustFeatures from "@/components/home/TrustFeatures";
import BrandMarquee from "@/components/home/BrandMarquee";

export default function HomePage() {
  return (
    <div className="w-full bg-[#09090B] text-white overflow-x-clip">
      <HeroSection />
      <CategorySection />
      <EditorialBanners />
      <TopPicksSection />
      <TrustFeatures />
      <BrandMarquee />
    </div>
  );
}
