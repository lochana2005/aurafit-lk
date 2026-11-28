import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import ToastContainer from "@/components/ui/ToastContainer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { WatchlistProvider } from "@/context/WatchlistContext";
import { AdminProvider } from "@/context/AdminContext";

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
        <ToastProvider>
          <AuthProvider>
            <WatchlistProvider>
              <CartProvider>
                <AdminProvider>
                  {children}
                  <ToastContainer />
                </AdminProvider>
              </CartProvider>
            </WatchlistProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
