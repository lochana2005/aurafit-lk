"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShoppingBag,
  Clock,
  Check,
  ArrowRight,
  Truck,
} from "lucide-react";
import { Product } from "@/data/mockProducts";
import { useCart } from "@/context/CartContext";
import StudioImage from "@/components/StudioImage";
import { formatLKR, getKokoTotal, getKokoInstallment } from "@/lib/pricing";

export interface StackItem {
  product: Product;
  timingBadge: string;
  dosageNote: string;
}

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

  if (stackItems.length === 0) return null;

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
    <div className="bg-[#111115] border border-sky-400/30 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/50 border border-sky-400/35 text-[10px] font-bold uppercase tracking-wider text-sky-300 mb-1.5 font-heading">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>AI Recommended Synergy Stack</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-heading">
            {goalTitle} Master Stack
          </h3>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold self-start sm:self-auto font-heading uppercase">
          <Truck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Free Islandwide Express Delivery</span>
        </div>
      </div>

      {/* Rationale explanation */}
      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-[#141418] border border-white/6 p-3.5 rounded-xl">
        <strong className="text-white font-heading uppercase tracking-wide mr-1.5">
          Clinical Rationale:
        </strong>
        {rationale}
      </p>

      {/* 2 or 3 Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stackItems.map(({ product, timingBadge, dosageNote }) => (
          <div
            key={product.id}
            className="p-4 rounded-xl bg-[#0E0E12] border border-white/8 hover:border-white/20 transition-all flex flex-col justify-between space-y-3 group"
          >
            {/* Thumbnail and Timing Badge */}
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950/60 border border-sky-400/30 text-sky-300">
                  <Clock className="w-3 h-3" />
                  <span>{timingBadge}</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {product.weightOrServings}
                </span>
              </div>

              {/* Product Image */}
              <Link
                href={`/shop/${product.slug}`}
                className="relative block aspect-square w-full rounded-xl bg-[#141418] border border-white/6 p-3 my-2 group-hover:border-sky-400/30 transition-colors"
              >
                <StudioImage
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="160px"
                  objectFit="contain"
                  fallbackLabel={product.name}
                />
              </Link>

              {/* Title & Brand */}
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E2C275] font-heading block">
                {product.brand}
              </span>
              <Link
                href={`/shop/${product.slug}`}
                className="text-xs font-bold text-white font-heading hover:text-[#E2C275] line-clamp-2 transition-colors"
              >
                {product.name}
              </Link>
            </div>

            {/* Dosage & Pricing */}
            <div className="pt-2 border-t border-white/6 space-y-1">
              <span className="text-[11px] text-zinc-400 block italic leading-tight">
                {dosageNote}
              </span>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-sm font-extrabold text-white font-sans">
                  {formatLKR(product.price, false)}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  3x {formatLKR(getKokoInstallment(product.price), false)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Combined Pricing & CTA Strip */}
      <div className="pt-4 border-t border-white/8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Total Price Display */}
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-heading">
              Combined Cash / Card:
            </span>
            <span className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
              {formatLKR(totalCash)}
            </span>
          </div>

          <div className="text-xs text-zinc-300 flex items-center gap-2">
            <span>
              or KOKO Pay: <strong className="text-[#E2C275]">{formatLKR(totalKoko, false)}</strong>
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">
              3 × <strong className="text-white">{formatLKR(kokoInstallment, false)}</strong>
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#A78BFA] uppercase">
              KOKO
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleAddAllToCart}
          className="px-8 py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer font-heading shrink-0"
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Stack Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 stroke-[2.3]" />
              <span>Add Full Stack to Cart</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
