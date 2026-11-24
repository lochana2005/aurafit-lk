"use client";

import React from "react";
import { ShieldCheck, Truck, Award } from "lucide-react";

export default function TrustStatsStrip() {
  return (
    <div className="bg-[#111115] border border-white/8 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/8">
        {/* Stat 1 */}
        <div className="flex items-center gap-4 pt-4 md:pt-0">
          <div className="w-12 h-12 rounded-xl bg-sky-950/60 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
            <ShieldCheck className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              14,280+
            </div>
            <p className="text-xs text-zinc-400 uppercase font-heading tracking-wider mt-0.5">
              Tubs Verified in Sri Lanka
            </p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="flex items-center gap-4 pt-6 md:pt-0 md:pl-8">
          <div className="w-12 h-12 rounded-xl bg-[#1C170E] border border-[#E2C275]/30 flex items-center justify-center text-[#E2C275] shrink-0">
            <Truck className="w-6 h-6 text-[#E2C275]" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              100%
            </div>
            <p className="text-xs text-zinc-400 uppercase font-heading tracking-wider mt-0.5">
              Direct Manufacturer Imports
            </p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="flex items-center gap-4 pt-6 md:pt-0 md:pl-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Award className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
              ZERO
            </div>
            <p className="text-xs text-zinc-400 uppercase font-heading tracking-wider mt-0.5">
              Counterfeit Tolerance Guaranteed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

