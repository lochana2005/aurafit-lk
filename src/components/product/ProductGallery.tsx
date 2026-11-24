"use client";

import React, { useState } from "react";
import { ShieldCheck, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { Product } from "@/data/mockProducts";
import StudioImage from "@/components/StudioImage";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [activeSlot, setActiveSlot] = useState(0);

  const GALLERY_SLOTS = [
    {
      id: "main",
      label: "Official Product Tub",
      icon: null,
      image: product.image,
      fallbackLabel: product.name,
    },
    {
      id: "facts",
      label: "Supplement Facts",
      icon: <FileText className="w-5 h-5 text-[#E2C275]" />,
      image: "/images/products/supplement-facts.png",
      fallbackLabel: "NUTRITION FACTS & AMINO PROFILE",
    },
    {
      id: "seal",
      label: "Batch Hologram Seal",
      icon: <ShieldCheck className="w-5 h-5 text-sky-400" />,
      image: "/images/products/batch-seal.png",
      fallbackLabel: "AURAFIT TAMPER-EVIDENT QR SEAL",
    },
    {
      id: "import",
      label: "Customs Clearance",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      image: "/images/products/import-cert.png",
      fallbackLabel: "SRI LANKA CUSTOMS CLEARANCE",
    },
  ];

  const currentSlot = GALLERY_SLOTS[activeSlot] || GALLERY_SLOTS[0];

  return (
    <div className="w-full space-y-4">
      {/* =========================================================================
          MAIN STUDIO SHOWCASE BOX
          ========================================================================= */}
      <div className="relative aspect-square max-w-[500px] mx-auto w-full rounded-2xl bg-[#111115] border border-white/10 p-6 sm:p-10 overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex items-center justify-center group">
        {/* Top-Left Floating Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
            {product.badge || "100% AUTHENTIC"}
          </span>
        </div>

        {/* Top-Right Ice Cyan QR Batch Verified Badge */}
        <div className="absolute top-4 right-4 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-sky-300 bg-sky-950/80 border border-sky-400/35 shadow-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>QR BATCH VERIFIED</span>
          </span>
        </div>

        {/* Main Image View */}
        <div className="relative w-full h-full">
          <StudioImage
            src={currentSlot.image}
            alt={`${product.name} - ${currentSlot.label}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            objectFit="contain"
            fallbackLabel={currentSlot.fallbackLabel}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Subtitle label at bottom center of showcase */}
        <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
          <span className="px-3 py-0.5 rounded-full bg-black/80 text-[10px] font-mono text-zinc-400 uppercase tracking-widest border border-white/10">
            {currentSlot.label}
          </span>
        </div>
      </div>

      {/* =========================================================================
          ROW OF 4 THUMBNAIL SLOTS
          ========================================================================= */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 max-w-[500px] mx-auto">
        {GALLERY_SLOTS.map((slot, idx) => {
          const isActive = activeSlot === idx;
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => setActiveSlot(idx)}
              className={`relative aspect-square rounded-xl bg-[#0D0D10] border p-2 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer overflow-hidden ${
                isActive
                  ? "border-[#E2C275] ring-2 ring-[#E2C275]/30 shadow-[0_0_15px_rgba(226,194,117,0.3)] scale-[1.02]"
                  : "border-white/10 hover:border-white/30 opacity-70 hover:opacity-100"
              }`}
            >
              {slot.icon ? (
                <div className="flex flex-col items-center justify-center text-center p-1">
                  {slot.icon}
                  <span className="text-[11px] font-medium uppercase tracking-tight text-zinc-300 mt-1 line-clamp-1">
                    {slot.label}
                  </span>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <StudioImage
                    src={slot.image}
                    alt={slot.label}
                    fill
                    sizes="80px"
                    objectFit="contain"
                    fallbackLabel={product.brand}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Trust Micro-Banner */}
      <div className="max-w-[500px] mx-auto p-3 rounded-xl bg-[#141418] border border-white/6 flex items-center justify-between text-zinc-300 text-xs">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E2C275]" />
          Direct Factory Imported Batch
        </span>
        <span className="font-mono text-zinc-400">Seal Intact Guarantee</span>
      </div>
    </div>
  );
}

