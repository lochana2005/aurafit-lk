"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ShoppingBag, Clock, Check, ArrowRight, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import StudioImage from "@/components/StudioImage";
import { formatLKR, getKokoTotal, getKokoInstallment } from "@/lib/pricing";
import { StackItem } from "./types";

export type { StackItem };

interface RecommendedStackCardProps {
  stackItems: StackItem[];
  goalTitle: string;
  rationale: string;
}

export default function RecommendedStackCard({
  stackItems,
  goalTitle,
  rationale,
}: RecommendedStackCardProps) {
  const { addToCart, openCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  if (!stackItems || stackItems.length === 0) return null;

  // Pricing calculations
  const totalCash = stackItems.reduce((acc, item) => acc + item.product.price, 0);
  const totalKoko = getKokoTotal(totalCash);
  const kokoInstallment = getKokoInstallment(totalCash);

  const handleAddAllToCart = () => {
    stackItems.forEach((item) => {
      addToCart(item.product, 1, item.product.flavors?.[0] || item.product.weight);
    });
    setIsAdded(true);
    openCart();
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-[#121217] border border-sky-400/30 rounded-2xl p-4 sm:p-5 mt-4 space-y-4 shadow-xl relative overflow-hidden">
      {/* Subtle Cyan Ambient Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-sky-400/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-950/60 border border-sky-400/30 text-[10px] font-bold uppercase tracking-wider text-sky-300 mb-1 font-heading">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>AI Recommended Synergy Stack</span>
          </div>
          <h4 className="text-base sm:text-lg font-black uppercase tracking-wide text-white font-heading">
            {goalTitle} Master Stack
          </h4>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/25 text-emerald-300 text-[11px] font-semibold self-start sm:self-auto font-heading uppercase">
          <Truck className="w-3 h-3 text-emerald-400" />
          <span>Free Express Delivery</span>
        </div>
      </div>

      {/* Rationale note */}
      {rationale && (
        <p className="text-xs text-zinc-300 leading-relaxed bg-[#0E0E12] border border-white/6 p-3 rounded-xl">
          <strong className="text-white font-heading uppercase tracking-wide mr-1.5">
            Formulation Rationale:
          </strong>
          {rationale}
        </p>
      )}

      {/* Product Stack Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {stackItems.map(({ product, timingBadge, dosageNote }) => (
          <div
            key={product.id}
            className="p-3 rounded-xl bg-[#0A0A0D] border border-white/8 hover:border-white/20 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950/60 border border-sky-400/30 text-sky-300 font-heading">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{timingBadge}</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {product.weightOrServings}
                </span>
              </div>

              <div className="flex items-center gap-2.5 my-1">
                <Link
                  href={`/shop/${product.slug}`}
                  className="relative w-12 h-12 rounded-lg bg-[#141418] border border-white/8 p-1 shrink-0 overflow-hidden"
                >
                  <StudioImage
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="48px"
                    objectFit="contain"
                    fallbackLabel={product.name}
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#E2C275] font-heading block truncate">
                    {product.brand}
                  </span>
                  <Link
                    href={`/shop/${product.slug}`}
                    className="text-xs font-bold text-white font-heading hover:text-[#E2C275] line-clamp-2 transition-colors leading-tight"
                  >
                    {product.name}
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/6 flex items-baseline justify-between">
              <span className="text-xs text-zinc-400 truncate mr-2 italic text-[10px]">
                {dosageNote}
              </span>
              <span className="text-xs font-extrabold text-white font-sans shrink-0">
                {formatLKR(product.price, false)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Combined Pricing & Add to Cart Strip */}
      <div className="pt-3 border-t border-white/8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Pricing Info */}
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-heading">
              Bundle Total:
            </span>
            <span className="text-lg font-black text-white font-sans tracking-tight">
              {formatLKR(totalCash)}
            </span>
          </div>

          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 flex-wrap">
            <span>
              or KOKO: <strong className="text-[#E2C275]">{formatLKR(totalKoko, false)}</strong>
            </span>
            <span className="text-zinc-600">•</span>
            <span>
              3 × <strong className="text-white">{formatLKR(kokoInstallment, false)}</strong>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleAddAllToCart}
          className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading shrink-0"
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Full Stack Added!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 stroke-[2.3]" />
              <span>Add Full Stack to Cart</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
