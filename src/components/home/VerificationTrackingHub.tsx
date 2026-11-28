"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, MapPin, Clock, Phone, ArrowRight, QrCode } from "lucide-react";

export default function VerificationTrackingHub() {
  const router = useRouter();
  const [batchCode, setBatchCode] = useState("");
  const [orderId, setOrderId] = useState("");

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = batchCode.trim() || "AF-ON-2026-884";
    router.push(`/verify?code=${encodeURIComponent(target)}`);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = orderId.trim() || "AF-2026-7055";
    router.push(`/track-order?id=${encodeURIComponent(target)}`);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
      {/* Top 2-Column Interactive Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card — Instant QR Batch Verifier */}
        <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E2C275]">
              <ShieldCheck className="w-4 h-4 text-[#E2C275]" />
              <span>100% COUNTERFEIT PROTECTION</span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-white">
              VERIFY YOUR TUB&apos;S BATCH CODE
            </h3>

            <p className="text-sm text-zinc-300 leading-relaxed">
              Every AuraFit container carries a holographic QR seal linked to official manufacturer lab certificates.
            </p>
          </div>

          <form onSubmit={handleVerifySubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                placeholder="Enter Batch Code (e.g. AF-ON-2026-884)"
                className="flex-1 min-w-0 bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:font-sans placeholder:text-zinc-500 focus:outline-none transition-colors uppercase"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider btn-aurafit-gold flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>VERIFY AUTHENTICITY</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Quick sample:</span>
              <button
                type="button"
                onClick={() => setBatchCode("AF-ON-2026-884")}
                className="px-2.5 py-1 rounded-lg bg-[#16161C] border border-white/10 text-[#E2C275] font-mono text-[11px] hover:border-[#E2C275]/50 cursor-pointer"
              >
                Try: AF-ON-2026-884
              </button>
            </div>
          </form>
        </div>

        {/* Right Card — Live Order Tracker */}
        <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#38BDF8]">
              <Truck className="w-4 h-4 text-[#38BDF8]" />
              <span>24–48H ISLANDWIDE EXPRESS</span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-white">
              TRACK YOUR DELIVERY LIVE
            </h3>

            <p className="text-sm text-zinc-300 leading-relaxed">
              Enter your AuraFit Order Reference or Courier Waybill number to check real-time dispatch progress.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. AF-2026-7055)"
                className="flex-1 min-w-0 bg-[#09090B] border border-white/15 focus:border-[#38BDF8] rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:font-sans placeholder:text-zinc-500 focus:outline-none transition-colors uppercase"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider btn-aurafit-dark flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Truck className="w-4 h-4 text-[#38BDF8]" />
                <span>TRACK SHIPMENT</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Quick sample:</span>
              <button
                type="button"
                onClick={() => setOrderId("AF-2026-7055")}
                className="px-2.5 py-1 rounded-lg bg-[#16161C] border border-white/10 text-[#38BDF8] font-mono text-[11px] hover:border-[#38BDF8]/50 cursor-pointer"
              >
                Try: AF-2026-7055
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Full-Width Concierge & Contact Strip */}
      <div className="mt-6 bg-[#111115] border border-white/10 rounded-2xl p-6 sm:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-wide text-white">
            NEED SUPPLEMENT ADVICE OR WHOLESALE SUPPORT?
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16161C] border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>Colombo 03 Flagship Vault</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16161C] border border-white/10">
              <Clock className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>Daily 9:00 AM – 8:30 PM</span>
            </span>
            <a
              href="tel:+94771234567"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16161C] border border-white/10 text-[#E2C275] font-semibold hover:border-[#E2C275]/50"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+94 77 123 4567</span>
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
          <Link
            href="/contact"
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center justify-center gap-2"
          >
            <span>CONTACT SUPPORT</span>
            <ArrowRight className="w-4 h-4 stroke-[2.3]" />
          </Link>

          <Link
            href="/about"
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider btn-aurafit-dark inline-flex items-center justify-center gap-2"
          >
            <span>OUR STORY</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
