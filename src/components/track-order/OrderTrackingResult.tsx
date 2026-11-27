"use client";

import React from "react";
import {
  RotateCw,
  AlertTriangle,
  RotateCcw,
  Check,
  Truck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { TrackedOrderRecord } from "@/data/orderTrackingRegistry";
import ShipmentTimeline from "./ShipmentTimeline";
import TrackedOrderSummary from "./TrackedOrderSummary";

interface OrderTrackingResultProps {
  order: TrackedOrderRecord | null;
  searchedId: string;
  isNotFound: boolean;
  isLoading: boolean;
  onReset: () => void;
}

const STEPS = [
  { index: 1, label: "Order Confirmed", sub: "Payment & Vault Verified" },
  { index: 2, label: "QR Hologram Sealed", sub: "Import Assay Certified" },
  { index: 3, label: "Out for Delivery", sub: "Courier Rider Dispatched" },
  { index: 4, label: "Delivered", sub: "Handed Over & Verified" },
];

export default function OrderTrackingResult({
  order,
  searchedId,
  isNotFound,
  isLoading,
  onReset,
}: OrderTrackingResultProps) {
  // 1. Loading State
  if (isLoading) {
    return (
      <div className="bg-[#111115] border border-sky-400/30 rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-sky-950/60 border border-sky-400/40 flex items-center justify-center text-sky-400 mx-auto shadow-[0_0_25px_rgba(56,189,248,0.25)]">
          <RotateCw className="w-7 h-7 animate-spin text-sky-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
            Querying Live Logistics Network...
          </h3>
          <p className="text-xs text-zinc-400 font-mono">
            Locating order &ldquo;{searchedId}&rdquo; across central sorting hubs and courier rider manifests...
          </p>
        </div>
      </div>
    );
  }

  // 2. Order Not Found State
  if (isNotFound) {
    return (
      <div className="bg-[#160B0B] border border-red-500/40 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-950/70 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-[10px] font-bold uppercase tracking-wider text-red-300 font-heading mb-1">
                <span>ORDER NOT LOCATED</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-heading">
                Order ID Not Found
              </h3>
            </div>
          </div>

          <span className="font-mono text-sm px-3.5 py-1.5 rounded-xl bg-black/60 border border-red-500/30 text-red-400 font-bold self-start sm:self-auto">
            {searchedId}
          </span>
        </div>

        <div className="bg-[#201010] border border-red-500/25 rounded-xl p-4 sm:p-5 text-xs text-red-200/90 leading-relaxed space-y-2">
          <p>
            We could not find an active dispatch matching <strong className="text-white font-mono">{searchedId}</strong> in our islandwide logistics ledger.
          </p>
          <p className="text-zinc-400">
            Please check the Order Reference ID in your confirmation SMS or email (format: <code className="text-zinc-300">AF-2026-XXXX</code>) or click one of the quick test sample pills above.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onReset}
            className="px-5 py-2.5 rounded-xl btn-aurafit-dark font-bold text-xs uppercase font-heading tracking-wider flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Search Another Order</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. Active Order Tracking Result
  if (!order) return null;

  const isDelivered = order.status === "Delivered";

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-98 duration-300">
      {/* =========================================================================
          TOP STATUS OVERVIEW CARD & 4-STEP STEPPER
          ========================================================================= */}
      <div className="bg-[#111115] border border-sky-400/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 via-[#E2C275] to-emerald-400 shadow-[0_0_15px_rgba(56,189,248,0.7)]" />

        {/* Overview Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/8">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs uppercase font-bold text-zinc-400 font-heading">
                Live Shipment Tracking
              </span>
              <span className="text-zinc-600">•</span>
              <span className="font-mono font-bold text-sky-300 text-sm">
                #{order.orderId}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-heading">
              {order.status}
            </h2>
            <p className="text-xs text-zinc-400">
              Courier Partner: <strong className="text-white">{order.courierPartner}</strong> · Waybill: <code className="text-sky-300 font-mono">{order.waybillNumber}</code>
            </p>
          </div>

          {/* Status Pill & Delivery Highlight */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="p-3 rounded-xl bg-[#0E0E12] border border-white/8 space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#E2C275]" />
                <span>Estimated Arrival</span>
              </span>
              <span className="text-sm font-black text-[#E2C275] font-sans tracking-tight">
                {order.estimatedDelivery}
              </span>
            </div>

            <div
              className={`px-4 py-3 rounded-xl border flex items-center gap-2 self-stretch sm:self-auto ${
                isDelivered
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                  : "bg-sky-950/60 border-sky-400/40 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.15)]"
              }`}
            >
              {isDelivered ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Truck className="w-5 h-5 text-sky-400 animate-pulse" />
              )}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider block opacity-70">
                  Current Status
                </span>
                <span className="text-xs font-black uppercase font-heading tracking-wide">
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Visual Progress Stepper */}
        <div className="pt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {STEPS.map((step) => {
              const isPassed = step.index < order.currentStepIndex;
              const isCurrent = step.index === order.currentStepIndex;

              return (
                <div key={step.index} className="space-y-2 relative">
                  {/* Step Node & Connector */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                        isPassed
                          ? "bg-gradient-to-r from-[#E5C76B] to-[#C9A227] text-[#09090B]"
                          : isCurrent
                          ? "bg-sky-400 text-[#09090B] ring-4 ring-sky-400/25 shadow-[0_0_15px_rgba(56,189,248,0.8)]"
                          : "bg-[#181820] text-zinc-500 border border-white/10"
                      }`}
                    >
                      {isPassed ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span>{step.index}</span>
                      )}
                    </div>

                    <div
                      className={`flex-1 h-1 rounded-full hidden md:block ${
                        isPassed
                          ? "bg-[#E2C275]"
                          : isCurrent
                          ? "bg-gradient-to-r from-sky-400 to-white/10"
                          : "bg-white/10"
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <div className="space-y-0.5">
                    <h4
                      className={`text-xs font-bold uppercase tracking-wider font-heading ${
                        isCurrent
                          ? "text-sky-300"
                          : isPassed
                          ? "text-white"
                          : "text-zinc-500"
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-[10px] text-zinc-400 leading-tight">
                      {step.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          2-COLUMN LOGISTICS DETAILS GRID
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Shipment Timeline Log */}
        <div className="lg:col-span-7">
          <ShipmentTimeline timeline={order.timeline} />
        </div>

        {/* Right Column (5 cols): Order Items & Destination Summary */}
        <div className="lg:col-span-5">
          <TrackedOrderSummary order={order} />
        </div>
      </div>
    </div>
  );
}
