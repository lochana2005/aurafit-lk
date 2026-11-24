"use client";

import React from "react";
import { Sparkles, QrCode, FileText } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Locate the Hologram",
    description:
      "Find the tamper-evident metallic AuraFit.lk security seal placed over the lid and neck seam of every genuine imported tub.",
    icon: Sparkles,
    badgeColor: "text-sky-400 border-sky-400/30 bg-sky-950/40",
  },
  {
    step: "02",
    title: "Scan or Enter Code",
    description:
      "Gently scratch off the protective security coating to reveal your unique 8-character alphanumeric batch ID or scan the holographic QR code.",
    icon: QrCode,
    badgeColor: "text-[#E2C275] border-[#E2C275]/30 bg-[#1C170E]",
  },
  {
    step: "03",
    title: "Instant Lab Report",
    description:
      "Verify port customs clearance dates, manufacturer expiration certificates, and independent HPLC lab protein purity assays in real time.",
    icon: FileText,
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-950/40",
  },
];

export default function HowToVerifySteps() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/50 border border-sky-400/30 text-[10px] font-bold uppercase tracking-wider text-sky-300 font-heading">
          <Sparkles className="w-3 h-3 text-sky-400" />
          <span>3-Step Simple Authentication</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
          How to Verify Your Supplement
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          We protect Sri Lankan athletes from counterfeit formulas with serialized tamper-proof hologram seals on every shipment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="bg-[#111115] border border-white/8 hover:border-white/20 rounded-2xl p-6 sm:p-7 space-y-4 transition-all relative overflow-hidden group shadow-lg"
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/2 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-400/5 transition-all" />

              {/* Step Badge & Icon Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-black ${item.badgeColor}`}
                >
                  STEP {item.step}
                </span>

                <div className="w-9 h-9 rounded-xl bg-[#181820] border border-white/8 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white font-heading">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

