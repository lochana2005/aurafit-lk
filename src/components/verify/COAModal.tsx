"use client";

import React from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Printer,
  Sparkles,
  Building2,
} from "lucide-react";
import { BatchVerificationRecord } from "@/data/batchRegistry";

interface COAModalProps {
  record: BatchVerificationRecord;
  onClose: () => void;
}

export default function COAModal({ record, onClose }: COAModalProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-[#0E0E12] border border-sky-400/40 rounded-2xl shadow-2xl z-10 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Metallic Border */}
        <div className="h-1.5 bg-gradient-to-r from-sky-400 via-[#E2C275] to-emerald-400" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/8 flex items-start justify-between gap-4 bg-[#14141A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-950/70 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold px-2 py-0.5 rounded bg-sky-950/60 border border-sky-400/30">
                  OFFICIAL AUDIT REPORT
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  REF: {record.certificateRef}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white font-heading mt-1">
                Certificate of Analysis &amp; Assay Release
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white bg-[#1A1A22] border border-white/8 hover:border-white/20 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-5 sm:p-6 space-y-6 text-xs text-zinc-300">
          {/* Laboratory & Issuance Authority */}
          <div className="bg-[#141418] border border-white/6 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-400 font-heading">
                Issuing Laboratory Authority:
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                {record.labName}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                ISO/IEC 17025:2017 Chemical &amp; Microbiological Assay Standards
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-white/8 sm:pl-4">
              <div className="text-[10px] font-mono text-zinc-400">TEST COMPLETED:</div>
              <div className="text-xs font-bold text-sky-300 font-mono">
                {record.testDate}
              </div>
              <div className="text-[10px] text-emerald-400 font-bold uppercase mt-0.5 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>SPECIFICATION MET</span>
              </div>
            </div>
          </div>

          {/* Product Identification Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#111115] border border-white/6 rounded-xl p-4 font-mono text-[11px]">
            <div>
              <span className="text-zinc-500 uppercase block text-[10px]">Batch ID</span>
              <span className="font-bold text-sky-300">{record.batchNumber}</span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase block text-[10px]">Lot Number</span>
              <span className="font-bold text-white">{record.lotNumber}</span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase block text-[10px]">Manufactured</span>
              <span className="font-bold text-white">{record.manufactureDate}</span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase block text-[10px]">Expiry</span>
              <span className="font-bold text-[#E2C275]">{record.expiryDate}</span>
            </div>
          </div>

          {/* Chemical & Microbiological Assay Table */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white font-heading flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Quantitative Analytical Assay Matrix</span>
            </h4>

            <div className="border border-white/8 rounded-xl overflow-hidden text-[11px]">
              <table className="w-full text-left">
                <thead className="bg-[#181820] text-zinc-400 font-mono uppercase text-[10px] border-b border-white/8">
                  <tr>
                    <th className="py-2 px-3">Parameter</th>
                    <th className="py-2 px-3">Standard Limit</th>
                    <th className="py-2 px-3">Observed Result</th>
                    <th className="py-2 px-3 text-right">Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6 font-mono text-zinc-300 bg-[#0E0E12]">
                  <tr>
                    <td className="py-2 px-3 font-medium text-white">Active Protein Assay (HPLC)</td>
                    <td className="py-2 px-3">&ge; 98.0% Claim</td>
                    <td className="py-2 px-3 text-sky-300 font-bold">{record.proteinAssay}</td>
                    <td className="py-2 px-3 text-right text-emerald-400 font-bold">PASS</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-white">Heavy Metals: Lead (Pb)</td>
                    <td className="py-2 px-3">&lt; 0.50 ppm</td>
                    <td className="py-2 px-3">&lt; 0.005 ppm</td>
                    <td className="py-2 px-3 text-right text-emerald-400 font-bold">PASS</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-white">Heavy Metals: Arsenic (As)</td>
                    <td className="py-2 px-3">&lt; 0.20 ppm</td>
                    <td className="py-2 px-3">&lt; 0.002 ppm</td>
                    <td className="py-2 px-3 text-right text-emerald-400 font-bold">PASS</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-white">Heavy Metals: Cadmium (Cd)</td>
                    <td className="py-2 px-3">&lt; 0.10 ppm</td>
                    <td className="py-2 px-3">&lt; 0.001 ppm</td>
                    <td className="py-2 px-3 text-right text-emerald-400 font-bold">PASS</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-white">Microbial: Salmonella &amp; E. coli</td>
                    <td className="py-2 px-3">Negative / 25g</td>
                    <td className="py-2 px-3">Negative (Absent)</td>
                    <td className="py-2 px-3 text-right text-emerald-400 font-bold">PASS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Customs Clearance Sign-off */}
          <div className="bg-[#121217] border border-white/6 rounded-xl p-3.5 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#E2C275] shrink-0" />
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-mono">
                  Customs Clearance Log
                </span>
                <span className="font-semibold text-white">{record.clearanceDetails}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-zinc-500 font-mono block">VALIDATED BY</span>
              <span className="font-bold text-sky-300">{record.analystSignature}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/8 bg-[#14141A] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Digital Cryptographic Signature Verified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2 px-3.5 rounded-xl text-xs font-bold font-heading uppercase tracking-wider bg-[#181820] text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-xs font-bold font-heading uppercase tracking-wider bg-sky-500 hover:bg-sky-400 text-[#09090B] transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

