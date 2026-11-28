"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Truck, ChevronRight, RotateCw, MapPin, ShieldCheck } from "lucide-react";
import TrackingSearchBox from "@/components/track-order/TrackingSearchBox";
import OrderTrackingResult from "@/components/track-order/OrderTrackingResult";
import {
  lookupTrackedOrder,
  TrackedOrderRecord,
  OrderDeliveryStatus,
} from "@/data/orderTrackingRegistry";
import { MOCK_PRODUCTS } from "@/data/mockProducts";

function resolveFromLocalOrRegistry(orderId: string): TrackedOrderRecord | null {
  const cleanId = orderId.trim().toUpperCase();
  if (!cleanId) return null;

  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem("aurafit_orders");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const found = parsed.find((o: any) => {
            const id = (o.id || o.orderId || "").toUpperCase();
            const wb = (o.waybillNumber || "").toUpperCase();
            return id === cleanId || (wb && wb === cleanId);
          });
          if (found) {
            const statusStr = found.status || "Order Placed";
            const mappedStatus: OrderDeliveryStatus =
              statusStr === "Delivered"
                ? "Delivered"
                : statusStr === "Out for Delivery"
                ? "Out for Delivery"
                : statusStr === "In Transit" || statusStr === "Handed to Courier"
                ? "In Transit"
                : statusStr === "Packed & QR Sealed"
                ? "QR Hologram Sealed"
                : "Order Confirmed";

            const stepIdx =
              mappedStatus === "Delivered"
                ? 4
                : mappedStatus === "Out for Delivery" || mappedStatus === "In Transit"
                ? 3
                : mappedStatus === "QR Hologram Sealed"
                ? 2
                : 1;

            return {
              orderId: found.id || found.orderId,
              customerName: found.customerName || "AuraFit Customer",
              phone: found.phone || "+94 77 000 0000",
              email: found.email || "",
              deliveryAddress: found.address || "",
              city: found.city || "Colombo",
              district: found.district || "Colombo",
              status: mappedStatus,
              currentStepIndex: stepIdx,
              courierPartner: found.courier || "PromptX Courier",
              waybillNumber: found.waybillNumber || "Pending Assignment",
              estimatedDelivery: found.estimatedArrival || "Within 24–48 Hours",
              paymentMethod: found.paymentMethod || "Card",
              paymentStatus:
                found.paymentMethod === "COD" ? "Pending COD" : "Paid",
              total: Number(found.total) || 0,
              items: Array.isArray(found.items)
                ? found.items.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (it: any) => ({
                      product: it.product || MOCK_PRODUCTS[0],
                      flavorOrVariant: it.flavor || it.selectedFlavor || "Standard",
                      quantity: it.quantity || 1,
                      price: it.price || it.product?.price || 0,
                      batchNumber: "AF-QR-VERIFIED",
                    })
                  )
                : [],
              timeline: [
                {
                  id: "tl_1",
                  timestamp: found.date || "Today",
                  location: "Colombo 03 Flagship Vault",
                  title: "Order Confirmed & Queued",
                  description: "Order registered in AuraFit dispatch system.",
                  isCompleted: stepIdx >= 1,
                  isCurrent: stepIdx === 1,
                },
                {
                  id: "tl_2",
                  timestamp: stepIdx >= 2 ? "Completed" : "Pending",
                  location: "AuraFit QA Lab",
                  title: "Holographic QR Sealed",
                  description: "Tamper-evident authenticity seal applied.",
                  isCompleted: stepIdx >= 2,
                  isCurrent: stepIdx === 2,
                },
                {
                  id: "tl_3",
                  timestamp: stepIdx >= 3 ? "Dispatched" : "Pending",
                  location: found.courier || "Courier Hub",
                  title: `In Transit (${found.courier || "Express Courier"})`,
                  description: found.riderNotes || "En route to destination city.",
                  isCompleted: stepIdx >= 3,
                  isCurrent: stepIdx === 3,
                },
                {
                  id: "tl_4",
                  timestamp: stepIdx >= 4 ? "Delivered" : "Pending",
                  location: `${found.city || "Colombo"}, ${found.district || "Colombo"}`,
                  title: "Delivered to Customer",
                  description: "Signed & received by customer.",
                  isCompleted: stepIdx >= 4,
                  isCurrent: stepIdx === 4,
                },
              ],
            };
          }
        }
      }
    } catch {
      // ignore
    }
  }
  return lookupTrackedOrder(cleanId);
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [searchedId, setSearchedId] = useState(initialId);
  const [activeOrder, setActiveOrder] = useState<TrackedOrderRecord | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!initialId) return;
    const timer = setTimeout(() => {
      const found = resolveFromLocalOrRegistry(initialId);
      setActiveOrder(found);
      setIsNotFound(found === null);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialId]);

  const handleSearch = (orderId: string) => {
    const cleanId = orderId.trim().toUpperCase();
    setSearchedId(cleanId);
    setIsLoading(true);
    setIsNotFound(false);
    setActiveOrder(null);

    // Realistic lookup delay (600ms)
    setTimeout(() => {
      const found = resolveFromLocalOrRegistry(cleanId);
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
