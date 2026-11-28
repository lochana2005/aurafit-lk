"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Truck, ChevronRight, RotateCw, MapPin, ShieldCheck } from "lucide-react";
import TrackingSearchBox from "@/components/track-order/TrackingSearchBox";
import OrderTrackingResult from "@/components/track-order/OrderTrackingResult";
import { lookupTrackedOrder, TrackedOrderRecord } from "@/data/orderTrackingRegistry";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [searchedId, setSearchedId] = useState(initialId);
  const [activeOrder, setActiveOrder] = useState<TrackedOrderRecord | null>(() => {
    if (!initialId) return null;
    return lookupTrackedOrder(initialId);
  });
  const [isNotFound, setIsNotFound] = useState(() => {
    if (!initialId) return false;
    return lookupTrackedOrder(initialId) === null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (orderId: string) => {
    const cleanId = orderId.trim().toUpperCase();
    setSearchedId(cleanId);
    setIsLoading(true);
    setIsNotFound(false);
    setActiveOrder(null);

    // Realistic lookup delay (600ms)
    setTimeout(() => {
      const found = lookupTrackedOrder(cleanId);
      setIsLoading(false);

      if (found) {
        setActiveOrder(found);
        setIsNotFound(false);
      } else {
        setIsNotFound(true);
      }
    }, 600);
  };

  const handleReset = () => {
    setActiveOrder(null);
    setIsNotFound(false);
    setSearchedId("");
  };

  return (
    <div className="space-y-8">
      {/* Search Hub */}
      <TrackingSearchBox
        onSearch={handleSearch}
        isLoading={isLoading}
        initialOrderId={initialId}
      />

      {/* Result Display */}
      {(isLoading || activeOrder || isNotFound) && (
        <OrderTrackingResult
          order={activeOrder}
          searchedId={searchedId}
          isNotFound={isNotFound}
          isLoading={isLoading}
          onReset={handleReset}
        />
      )}

      {/* Logistics Assurances Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/8 text-xs text-zinc-400">
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#111115] border border-white/6">
          <Truck className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Islandwide 24–48h Delivery via PromptX &amp; Domex</span>
        </div>
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#111115] border border-white/6">
          <ShieldCheck className="w-4 h-4 text-[#E2C275] shrink-0" />
          <span>Tamper-Proof Insulated Supplement Packaging</span>
        </div>
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#111115] border border-white/6">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Central Hub: Colombo 03 Importer Warehouse</span>
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="w-full min-h-screen bg-[#09090B] text-white">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
        {/* =========================================================================
            BREADCRUMBS
            ========================================================================= */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 flex-wrap"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-sky-300 font-semibold">Live Order Tracking</span>
        </nav>

        {/* =========================================================================
            PAGE HEADER
            ========================================================================= */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-950/50 border border-sky-400/35 text-xs font-semibold text-sky-300 font-heading uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-sky-400" />
            <span>Live Islandwide Logistics</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-heading">
            TRACK YOUR{" "}
            <span className="bg-gradient-to-r from-sky-400 via-[#E2C275] to-[#B08922] bg-clip-text text-transparent">
              ORDER
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Follow your genuine imported supplement shipment in real-time from our Colombo vault
            to your doorstep across all 25 districts in Sri Lanka.
          </p>
        </div>

        {/* =========================================================================
            CONTENT WRAPPED IN SUSPENSE FOR NEXT.JS App Router useSearchParams
            ========================================================================= */}
        <Suspense
          fallback={
            <div className="p-12 text-center text-zinc-500 flex items-center justify-center gap-2">
              <RotateCw className="w-5 h-5 animate-spin text-sky-400" />
              <span>Loading tracking portal...</span>
            </div>
          }
        >
          <TrackOrderContent />
        </Suspense>
      </div>
    </div>
  );
}
