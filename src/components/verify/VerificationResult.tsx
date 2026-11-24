"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  FileCheck2,
  ExternalLink,
  RotateCcw,
  MessageCircle,
  Building,
  Calendar,
  Anchor,
  QrCode,
  Check,
} from "lucide-react";
import StudioImage from "@/components/StudioImage";
import { BatchVerificationRecord } from "@/data/batchRegistry";
import COAModal from "./COAModal";

interface VerificationResultProps {
  record: BatchVerificationRecord | null;
  searchedCode: string;
  isNotFound: boolean;
  isLoading: boolean;
  onReset: () => void;
}

export default function VerificationResult({
  record,
  searchedCode,
  isNotFound,
  isLoading,
  onReset,
}: VerificationResultProps) {
  const [showCOAModal, setShowCOAModal] = useState(false);

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="bg-[#111115] border border-sky-400/30 rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-sky-950/60 border border-sky-400/40 flex items-center justify-center text-sky-400 mx-auto shadow-[0_0_25px_rgba(56,189,248,0.25)]">
          <RotateCw className="w-7 h-7 animate-spin text-sky-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
            Querying Authentication Vault...
          </h3>
          <p className="text-xs text-zinc-400 font-mono">
            Cross-referencing batch code &ldquo;{searchedCode}&rdquo; with manufacturer manifests and Sri Lanka customs clearance assays...
          </p>
        </div>
      </div>
    );
  }

  // 2. Not Found / Counterfeit Alert State
  if (isNotFound) {
    return (
      <div className="bg-[#160B0B] border border-red-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_40px_rgba(239,68,68,0.12)] relative overflow-hidden">
        {/* Glow Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-950/70 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-[10px] font-bold uppercase tracking-wider text-red-300 font-heading mb-1">
                <span>SECURITY ALERT · NOT VERIFIED</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-heading">
                Batch Code Not Found in Registry
              </h3>
            </div>
          </div>

          <span className="font-mono text-sm px-3.5 py-1.5 rounded-xl bg-black/60 border border-red-500/30 text-red-400 font-bold self-start sm:self-auto">
            {searchedCode}
          </span>
        </div>

        {/* Warning Explanation */}
        <div className="bg-[#201010] border border-red-500/25 rounded-xl p-4 sm:p-5 text-xs text-red-200/90 leading-relaxed space-y-2">
          <p>
            The batch code <strong className="text-white font-mono">{searchedCode}</strong> could not be authenticated against our direct manufacturer database or Sri Lanka Customs import manifests.
          </p>
          <p className="text-zinc-400">
            <strong>Safety Warning:</strong> Counterfeit supplements often contain substandard fillers, expired proteins, unlisted pharmaceuticals, or toxic heavy metals. Do not consume if the holographic seal was missing or already scratched upon delivery.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <a
            href="https://wa.me/94771234567?text=Hi%20AuraFit%2C%20I%20have%20an%20unverified%20batch%20code%20I%20would%20like%20to%20report"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase font-heading tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Report Suspected Fake via WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={onReset}
            className="px-5 py-3 rounded-xl bg-[#1A1A22] hover:bg-[#22222E] text-zinc-300 hover:text-white border border-white/10 transition-all font-bold text-xs uppercase font-heading tracking-wider flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Another Code</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. Valid 100% Authentic State
  if (!record) return null;

  return (
    <>
      <div className="bg-[#0D1318] border border-sky-400/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(56,189,248,0.12)] relative overflow-hidden animate-in fade-in zoom-in-98 duration-300">
        {/* Top Glowing Cyan Accent Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 via-[#E2C275] to-emerald-400 shadow-[0_0_15px_rgba(56,189,248,0.8)]" />

        {/* Header Badge & Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-950/70 border border-sky-400/50 flex items-center justify-center text-sky-400 shrink-0 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <ShieldCheck className="w-7 h-7 text-sky-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider text-emerald-300 font-heading mb-1">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>100% AUTHENTICITY CONFIRMED · DIRECT IMPORT</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-heading">
                Manufacturer Verified Genuine Tub
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="font-mono text-xs sm:text-sm px-3.5 py-1.5 rounded-xl bg-[#141B22] border border-sky-400/30 text-sky-300 font-bold">
              {record.batchNumber}
            </span>
          </div>
        </div>

        {/* Product Match Card */}
        <div className="bg-[#101720] border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/shop/${record.product.slug}`}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#141418] border border-white/10 p-1.5 shrink-0 overflow-hidden"
            >
              <StudioImage
                src={record.product.image}
                alt={record.product.name}
                fill
                sizes="80px"
                objectFit="contain"
                fallbackLabel={record.product.name}
              />
            </Link>

            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E2C275] font-heading block">
                {record.product.brand} · Direct Import
              </span>
              <Link
                href={`/shop/${record.product.slug}`}
                className="text-sm sm:text-base font-bold text-white font-heading hover:text-[#E2C275] transition-colors block line-clamp-1"
              >
                {record.product.name}
              </Link>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span>{record.product.weightOrServings}</span>
                <span>•</span>
                <span className="text-sky-300 font-mono font-semibold">
                  {record.lotNumber}
                </span>
              </div>
            </div>
          </div>

          <Link
            href={`/shop/${record.product.slug}`}
            className="px-4 py-2 rounded-xl bg-[#1A232D] hover:bg-[#22303E] text-sky-300 hover:text-white border border-sky-400/30 transition-all font-bold text-xs uppercase font-heading tracking-wider flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <span>View Product Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Column Batch Certificate Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Manufacturer */}
          <div className="p-3.5 rounded-xl bg-[#090D12] border border-white/8 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400 font-heading flex items-center gap-1">
              <Building className="w-3 h-3 text-sky-400" />
              <span>Manufacturer</span>
            </span>
            <p className="text-xs font-semibold text-white leading-tight">
              {record.manufacturer}
            </p>
            <span className="text-[10px] text-zinc-500 block">
              Origin: {record.countryOfOrigin}
            </span>
          </div>

          {/* Card 2: Customs Clearance */}
          <div className="p-3.5 rounded-xl bg-[#090D12] border border-white/8 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400 font-heading flex items-center gap-1">
              <Anchor className="w-3 h-3 text-sky-400" />
              <span>Customs Clearance</span>
            </span>
            <p className="text-xs font-semibold text-white leading-tight">
              {record.clearanceDetails}
            </p>
            <span className="text-[10px] text-emerald-400 font-mono block">
              Duty Paid &amp; Assay Cleared
            </span>
          </div>

          {/* Card 3: Expiry Date */}
          <div className="p-3.5 rounded-xl bg-[#090D12] border border-white/8 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400 font-heading flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#E2C275]" />
              <span>Expiry Date</span>
            </span>
            <p className="text-xs font-black text-[#E2C275] font-sans">
              {record.expiryDate}
            </p>
            <span className="text-[10px] text-zinc-500 font-mono block">
              Mfg: {record.manufactureDate}
            </span>
          </div>

          {/* Card 4: Holographic Seal */}
          <div className="p-3.5 rounded-xl bg-[#090D12] border border-white/8 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400 font-heading flex items-center gap-1">
              <QrCode className="w-3 h-3 text-sky-400" />
              <span>Security Hologram</span>
            </span>
            <p className="text-xs font-semibold text-emerald-400 leading-tight">
              {record.sealStatus}
            </p>
            <span className="text-[10px] text-zinc-500 font-mono block">
              Ref: {record.certificateRef}
            </span>
          </div>
        </div>

        {/* Lab Quality Checks Pills */}
        <div className="p-4 rounded-xl bg-[#090D12] border border-white/8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Heavy Metals Tested (PASS)</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Protein Purity Verified ({record.proteinAssay.split("(")[0]})</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Holographic Seal Intact (PASS)</span>
            </span>
          </div>

          <span className="text-[10px] text-zinc-500 font-mono">
            Lab Tested: {record.testDate}
          </span>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white/8">
          <button
            type="button"
            onClick={() => setShowCOAModal(true)}
            className="py-3 px-5 rounded-xl bg-gradient-to-r from-sky-500/20 to-sky-400/10 border border-sky-400/40 text-sky-300 hover:bg-sky-500/25 hover:text-white transition-all font-bold text-xs uppercase font-heading tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <FileCheck2 className="w-4 h-4 text-sky-400" />
            <span>View Lab Certificate of Analysis (COA)</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="py-3 px-5 rounded-xl bg-[#141418] hover:bg-[#1E1E24] text-zinc-300 hover:text-white border border-white/10 transition-all font-bold text-xs uppercase font-heading tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Verify Another Product</span>
          </button>
        </div>
      </div>

      {/* COA Certificate Modal */}
      {showCOAModal && (
        <COAModal record={record} onClose={() => setShowCOAModal(false)} />
      )}
    </>
  );
}

