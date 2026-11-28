import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import SmoothScroll from "@/components/SmoothScroll";
import CartDrawer from "@/components/CartDrawer";
import WatchlistDrawer from "@/components/WatchlistDrawer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <Navbar />
      <main className="flex-1 w-full bg-[#09090B] rounded-b-[36px] md:rounded-b-[48px] border-b border-[#E2C275]/25 relative z-10 overflow-x-clip pb-12 sm:pb-16">
        {children}
      </main>
      <Footer />
      <FloatingActions />
      <CartDrawer />
      <WatchlistDrawer />
    </SmoothScroll>
  );
}
