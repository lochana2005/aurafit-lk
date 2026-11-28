"use client";

import React, { useState } from "react";
import {
  QrCode,
  ShieldCheck,
  Search,
  Camera,
  Sparkles,
  Zap,
  RotateCw,
} from "lucide-react";

interface VerificationConsoleProps {
  onVerify: (code: string) => void;
  isLoading: boolean;
  initialCode?: string;
}

export default function VerificationConsole({
  onVerify,
  isLoading,
  initialCode = "",
}: VerificationConsoleProps) {
  const [mode, setMode] = useState<"code" | "qr">("code");
  const [inputCode, setInputCode] = useState(initialCode);
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim() || isLoading) return;
    onVerify(inputCode.trim());
  };

  const handleQuickSample = (code: string) => {
    setInputCode(code);
    onVerify(code);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const simulatedCode = "AF-ON-8842";
      setInputCode(simulatedCode);
      onVerify(simulatedCode);
    }, 1200);
  };

  return (
    <div className="bg-[#111115] border border-sky-400/25 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(56,189,248,0.06)] relative overflow-hidden space-y-6">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-32 bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center">
        <div className="bg-[#09090B] p-1.5 rounded-2xl flex items-center gap-1 border border-white/8 shadow-inner max-w-sm w-full">
          <button
            type="button"
            onClick={() => setMode("code")}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs uppercase font-heading tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mode === "code"
                ? "bg-[#181820] text-sky-300 border border-sky-400/40 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Enter Batch Code</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("qr")}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs uppercase font-heading tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mode === "qr"
                ? "bg-[#181820] text-sky-300 border border-sky-400/40 shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan QR Code</span>
          </button>
        </div>
      </div>

      {/* MODE 1: MANUAL CODE ENTRY */}
      {mode === "code" && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="e.g. AF-ON-8842 or AF-MT-5190"
                className="w-full bg-[#09090B] border border-white/15 focus:border-sky-400/70 rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-lg font-mono font-bold tracking-widest text-white placeholder:font-sans placeholder:tracking-normal placeholder:text-zinc-500 placeholder:text-sm focus:outline-none transition-colors uppercase"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none hidden sm:block">
                <ShieldCheck className="w-5 h-5 text-sky-400/50" />
              </div>
            </div>

            <button
              type="submit"
              disabled={!inputCode.trim() || isLoading}
              className="py-3.5 sm:py-4 px-8 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading shrink-0"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  <span>Verify Now</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-zinc-400 text-center font-mono">
            Enter the 8 to 12-character alphanumeric code printed beneath the lid scratch hologram.
          </p>
        </form>
      )}

      {/* MODE 2: INTERACTIVE MOCK QR SCANNER */}
      {mode === "qr" && (
        <div className="max-w-md mx-auto space-y-4">
          <div className="aspect-video w-full rounded-xl bg-[#09090B] border border-sky-400/40 relative overflow-hidden flex flex-col items-center justify-center p-6 shadow-inner group">
            {/* 4 Corner Viewfinder Brackets */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-sky-400" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-sky-400" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-sky-400" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-sky-400" />

            {/* Scanning Laser Line Animation */}
            {isScanning && (
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_15px_rgba(56,189,248,1)] animate-bounce" />
            )}

            {/* Central QR Hologram Mockup */}
            <div className="p-4 rounded-xl bg-[#141418] border border-white/10 flex flex-col items-center gap-2 relative z-0">
              <QrCode
                className={`w-14 h-14 ${
                  isScanning ? "text-sky-400 scale-105" : "text-zinc-400"
                } transition-all duration-300`}
              />
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                {isScanning ? "Decoding Holographic QR..." : "Align QR Within Frame"}
              </span>
            </div>

            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={handleSimulateScan}
            disabled={isScanning || isLoading}
            className="w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-sky-400 to-sky-500 shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:brightness-105 active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading"
          >
            {isScanning ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-[#09090B]" />
                <span>Scanning Camera Stream...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 stroke-[2.5]" />
                <span>Simulate Camera QR Scan</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Quick-Test Sample Pills */}
      <div className="pt-4 border-t border-white/8 text-center space-y-2">
        <span className="text-[11px] uppercase font-bold text-zinc-400 font-heading block">
          Quick Test Sample Batches:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickSample("AF-ON-8842")}
            className="px-3 py-1.5 rounded-lg bg-[#181820] hover:bg-[#202028] border border-sky-400/30 hover:border-sky-400 text-sky-300 hover:text-white transition-all cursor-pointer font-mono font-medium flex items-center gap-1.5 text-[11px]"
          >
            <Zap className="w-3 h-3 text-sky-400" />
            <span>Valid: AF-ON-8842</span>
            <span className="text-zinc-500 font-sans">(ON Isolate)</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSample("AF-MT-5190")}
            className="px-3 py-1.5 rounded-lg bg-[#181820] hover:bg-[#202028] border border-sky-400/30 hover:border-sky-400 text-sky-300 hover:text-white transition-all cursor-pointer font-mono font-medium flex items-center gap-1.5 text-[11px]"
          >
            <Zap className="w-3 h-3 text-sky-400" />
            <span>Valid: AF-MT-5190</span>
            <span className="text-zinc-500 font-sans">(Critical Mass)</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickSample("AF-FAKE-000")}
            className="px-3 py-1.5 rounded-lg bg-[#201414] hover:bg-[#281818] border border-red-500/30 hover:border-red-500 text-red-300 hover:text-white transition-all cursor-pointer font-mono font-medium flex items-center gap-1.5 text-[11px]"
          >
            <span>Invalid: AF-FAKE-000</span>
            <span className="text-red-400/80 font-sans">(Counterfeit Alert)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

