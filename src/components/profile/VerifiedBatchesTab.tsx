"use client";

import React from "react";
import Link from "next/link";
import { QrCode, ShieldCheck, ExternalLink, Sparkles } from "lucide-react";

interface VerifiedBatchItem {
  id: string;
  productName: string;
  brand: string;
  batchNumber: string;
  certificateRef: string;
  labResult: string;
  verificationDate: string;
  verifiedBy: string;
}

const VERIFIED_BATCHES: VerifiedBatchItem[] = [
  {
    id: "batch_01",
    productName: "Gold Standard 100% Isolate (5 lbs)",
    brand: "Optimum Nutrition",
    batchNumber: "LOT# 094821-EXP28",
    certificateRef: "SL-CUSTOMS-ASSAY-94821",
    labResult: "99.4% Protein Assay Purity • Zero Heavy Metals Detected",
    verificationDate: "Nov 21, 2026",
    verifiedBy: "AuraFit Importer Assay Lab",
  },
  {
    id: "batch_02",
    productName: "ISO100 Hydrolyzed 100% Whey Isolate (5 lbs)",
    brand: "Dymatize",
    batchNumber: "LOT# 011928-EXP27",
    certificateRef: "SL-CUSTOMS-ASSAY-11928",
    labResult: "100% Hydrolyzed Whey Bioavailability • Factory Seal Verified",
    verificationDate: "Oct 29, 2026",
    verifiedBy: "AuraFit Importer Assay Lab",
  },
];

export default function VerifiedBatchesTab() {
  const [batches] = React.useState<VerifiedBatchItem[]>(() => {
    if (typeof window === "undefined") return VERIFIED_BATCHES;
    try {
      const saved = localStorage.getItem("aurafit_verified_batches");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const combined = [
            ...parsed,
            ...VERIFIED_BATCHES.filter(
              (def) =>
                !parsed.some(
                  (p: VerifiedBatchItem) => p.certificateRef === def.certificateRef
                )
            ),
          ];
          return combined;
        }
      }
    } catch {
      // fallback
    }
    return VERIFIED_BATCHES;
  });

  return (
    <div className="bg-[#141418] rounded-2xl border border-white/8 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-white font-heading">
            Verified Authenticity Batches
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Tubs scanned and validated against direct manufacturer import certificates
          </p>
        </div>

        <Link
          href="/verify"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 transition-all self-start sm:self-auto font-heading"
        >
          <QrCode className="w-4 h-4" />
          <span>Verify Another Product</span>
        </Link>
      </div>

      {/* Info Strip */}
      <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-400/20 text-xs text-sky-200 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block font-heading text-sm uppercase">
            Anti-Counterfeit Hologram Protection Active
          </strong>
          <span className="text-sky-200/80">
            AuraFit.lk guarantees that every supplement tub dispatched from our Colombo warehouse is 100% original, unadulterated, and cleared through official customs lab inspection.
          </span>
        </div>
      </div>

      {/* Batches List */}
      <div className="space-y-4">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="p-5 rounded-2xl bg-[#0E0E12] border border-white/8 space-y-4 hover:border-sky-400/30 transition-all shadow-lg"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E2C275] font-heading block">
                  {batch.brand}
                </span>
                <h3 className="text-base font-bold text-white font-heading">
                  {batch.productName}
                </h3>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-400/35 text-sky-300 text-xs font-bold uppercase tracking-wider self-start sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Authenticity Confirmed</span>
              </div>
            </div>

            {/* Assay Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#141418] border border-white/6">
                <span className="text-zinc-500 block text-[11px]">Batch Hologram Code</span>
                <span className="font-mono text-white font-bold">{batch.batchNumber}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#141418] border border-white/6">
                <span className="text-zinc-500 block text-[11px]">Lab Certificate ID</span>
                <span className="font-mono text-sky-300 font-bold">{batch.certificateRef}</span>
              </div>
            </div>

            {/* Test Results Summary */}
            <div className="p-3.5 rounded-xl bg-[#141418] border border-white/6 flex items-center justify-between text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E2C275] shrink-0" />
                <span>{batch.labResult}</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                Verified on {batch.verificationDate}
              </span>
            </div>

            {/* Action */}
            <div className="flex justify-end pt-1">
              <Link
                href="/verify"
                className="inline-flex items-center gap-1.5 text-xs text-[#E2C275] hover:underline font-semibold"
              >
                <span>View Full Lab Certificate Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
