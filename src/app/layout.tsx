import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import SmoothScroll from "@/components/SmoothScroll";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AuraFit.lk | Authentic Luxury Sports Nutrition Sri Lanka",
  description:
    "Sri Lanka's trusted destination for 100% authentic fitness supplements, sports nutrition, and AI-driven performance stacks. Direct importer guarantee with QR batch verification.",
  keywords: [
    "supplements sri lanka",
    "whey protein colombo",
    "creatine monohydrate lk",
    "pre workout sri lanka",
    "aurafit",
    "gym supplements colombo",
    "mass gainer sri lanka",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${barlowCondensed.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#141418] text-white selection:bg-[#E2C275] selection:text-black">
        <SmoothScroll>
          <Navbar />
          <main className="flex-1 w-full bg-[#09090B] rounded-b-[36px] md:rounded-b-[48px] border-b border-[#E2C275]/25 relative z-10 overflow-x-clip pb-12 sm:pb-16">
            {children}
          </main>
          <Footer />
          <FloatingActions />
        </SmoothScroll>
      </body>
    </html>
  );
}
