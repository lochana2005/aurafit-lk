"use client";

import React, { useState } from "react";
import { Search, RotateCw, Sparkles, Truck, Package, CheckCircle2 } from "lucide-react";

interface TrackingSearchBoxProps {
  onSearch: (orderId: string, phoneOrEmail?: string) => void;
  isLoading: boolean;
  initialOrderId?: string;
}

export default function TrackingSearchBox({
  onSearch,
  isLoading,
  initialOrderId = "",
}: TrackingSearchBoxProps) {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [recentOrders] = useState<Array<{ id: string; name: string }>>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("aurafit_orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return parsed.slice(0, 2).map((o: any) => ({ id: o.orderId, name: o.customerName }));
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || isLoading) return;
    onSearch(orderId.trim(), phoneOrEmail.trim());
  };

  const handleSelectSample = (sampleId: string, sampleContact?: string) => {
    setOrderId(sampleId);
    if (sampleContact) {
      setPhoneOrEmail(sampleContact);
    }
    onSearch(sampleId, sampleContact);
  };

  return (
    <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 right-1/3 w-72 h-32 bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-heading">
          Live Dispatch Tracking Console
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Enter your AuraFit order ID to inspect live courier movement, hub checkpoints, and delivery window.
        </p>
      </div>

      {/* Horizontal Input Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Order ID Input */}
        <div className="md:col-span-5 space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-heading flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-sky-400" />
            <span>Order Reference ID</span>
          </label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. AF-2026-8492"
            className="w-full bg-[#09090B] border border-white/15 focus:border-sky-400/70 rounded-xl px-4 py-3.5 text-sm font-mono font-bold uppercase tracking-wider text-white placeholder:font-sans placeholder:tracking-normal placeholder:text-zinc-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Phone or Email Input */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-heading flex items-center justify-between">
            <span>Phone or Email (Optional)</span>
            <span className="text-[10px] text-zinc-500 font-mono">VERIFY</span>
          </label>
          <input
            type="text"
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            placeholder="+94 77 123 4567 or email"
            className="w-full bg-[#09090B] border border-white/15 focus:border-sky-400/70 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={!orderId.trim() || isLoading}
            className="w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading"
          >
            {isLoading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-[#09090B]" />
                <span>Locating...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Track Order</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick-Test Sample Chips */}
      <div className="pt-4 border-t border-white/8 space-y-2">
        <span className="text-[11px] uppercase font-bold text-zinc-400 font-heading block">
          Test Logistics Stages in Real-Time:
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleSelectSample("AF-2026-8492", "+94 77 123 4567")}
            className="px-3 py-1.5 rounded-lg bg-[#181820] hover:bg-[#22222E] border border-sky-400/30 hover:border-sky-400 text-sky-300 hover:text-white transition-all cursor-pointer font-mono font-medium flex items-center gap-1.5 text-[11px]"
          >
            <Truck className="w-3 h-3 text-sky-400" />
            <span>Out for Delivery: AF-2026-8492</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSample("AF-2026-7910", "+94 71 456 7890")}
            className="px-3 py-1.5 rounded-lg bg-[#181820] hover:bg-[#22222E] border border-white/10 hover:border-white/25 text-zinc-300 hover:text-white transition-all cursor-pointer font-mono font-medium flex items-center gap-1.5 text-[11px]"
          >
            <span>In Transit: AF-2026-7910</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSample("AF-2026-6304", "+94 76 998 8776")}
            className="px-3 py-1.5 rounded-lg bg-[#141A14] hover:bg-[#1C241C] border border-emerald-500/30 hover:border-emerald-500 text-emerald-300 hover:text-white transition-all cursor-pointer font-mono font-medium flex items-center gap-1.5 text-[11px]"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Delivered: AF-2026-6304</span>
          </button>

          {/* Dynamic Recent Orders from Checkout */}
          {recentOrders.map((rec) => (
            <button
              key={rec.id}
              type="button"
              onClick={() => handleSelectSample(rec.id)}
              className="px-3 py-1.5 rounded-lg bg-[#1A1810] hover:bg-[#222014] border border-[#E2C275]/40 text-[#E2C275] hover:text-white transition-all cursor-pointer font-mono font-medium flex items-center gap-1.5 text-[11px]"
            >
              <Sparkles className="w-3 h-3 text-[#E2C275]" />
              <span>Your Placed Order: {rec.id}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
