import React from "react";
import Link from "next/link";
import { Headphones, ChevronRight } from "lucide-react";
import ContactChannels from "@/components/contact/ContactChannels";
import SupportTicketForm from "@/components/contact/SupportTicketForm";
import SupportFaqSection from "@/components/contact/SupportFaqSection";

export const metadata = {
  title: "Contact & Concierge Support | AuraFit.lk",
  description:
    "Get in touch with AuraFit.lk sports nutrition specialists in Colombo, Sri Lanka. WhatsApp concierge, customer care hotline, order tracking, and lab batch verification support.",
};

export default function ContactPage() {
  return (
    <div className="w-full bg-[#09090B] text-white min-h-screen">
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
        {/* =========================================================================
            HEADER & BREADCRUMB
            ========================================================================= */}
        <div className="space-y-3 text-center sm:text-left">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-zinc-500">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-[#E2C275]">Contact Us</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141418] border border-white/10 text-xs font-mono font-bold tracking-wider uppercase mb-2">
                <span className="w-2 h-2 rounded-full bg-[#E2C275] animate-pulse" />
                <span className="text-[#E2C275]">24/7 ATHLETE SUPPORT</span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-300">SRI LANKA</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider font-heading text-white">
                GET IN TOUCH
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
                Direct manufacturer assistance, live courier coordination, supplement stack guidance, and tamper-evident batch verification for Sri Lankan athletes.
              </p>
            </div>

            {/* Quick Status Pill */}
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-[#141418] border border-white/8 shrink-0">
              <Headphones className="w-5 h-5 text-sky-400" />
              <div className="text-left text-xs font-mono">
                <div className="text-white font-bold">COLOMBO DESK OPEN</div>
                <div className="text-emerald-400 text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Agents Ready
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TOP SECTION: 12-COLUMN CONTACT GRID
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 Cols): Direct Support Channels & Flagship Address */}
          <div className="lg:col-span-5">
            <ContactChannels />
          </div>

          {/* Right Column (7 Cols): Interactive Support Ticket Form */}
          <div className="lg:col-span-7">
            <SupportTicketForm />
          </div>
        </div>

        {/* =========================================================================
            BOTTOM SECTION: SUPPORT FAQ ACCORDION
            ========================================================================= */}
        <SupportFaqSection />
      </main>
    </div>
  );
}
