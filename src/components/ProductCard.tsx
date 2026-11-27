"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, Heart, Eye, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/data/mockProducts";
import { formatLKR, getKokoTotal, getKokoInstallment } from "@/lib/pricing";
import { useCart } from "@/context/CartContext";
import StudioImage from "./StudioImage";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdded(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const formattedPrice = `Rs. ${product.price.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formattedOriginalPrice = product.originalPrice
    ? `Rs. ${product.originalPrice.toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : null;

  // Prevent awkward line-breaks like "(5" / "lbs)" by binding number + unit with non-breaking space
  const displayName = product.name.replace(
    /(\d)\s+(lbs?|kg|g|ml|oz|caps|tabs)\b/gi,
    "$1\u00A0$2"
  );

  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-col md:flex-row items-stretch md:items-center gap-5 bg-[#141418] rounded-2xl border border-white/10 hover:border-[#E2C275]/50 transition-all duration-300 p-4 sm:p-5 hover:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7),0_0_24px_-6px_rgba(226,194,117,0.15)]">
        {/* Left: Product Image */}
        <Link
          href={`/shop/${product.slug}`}
          className="relative block w-full md:w-44 lg:w-48 aspect-square shrink-0 rounded-xl bg-[#0D0D10] border border-white/6 overflow-hidden p-3"
        >
          <StudioImage
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 200px"
            objectFit="contain"
            fallbackLabel={product.name}
            className="transition-transform duration-300 group-hover:scale-105"
          />
          {product.badge && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase text-[#09090B] bg-gradient-to-r from-[#E5C76B] to-[#C9A227] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                {product.badge}
              </span>
            </div>
          )}
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="text-[10px] font-mono font-medium text-zinc-400 bg-black/85 px-2 py-0.5 rounded border border-white/8">
              {product.weightOrServings}
            </span>
          </div>
        </Link>

        {/* Middle: Full Name, Specs & Flavors */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold tracking-wider text-zinc-400 font-sans">
                {product.brand} • {product.category}
              </span>
              <div
                title="100% Importer Verified"
                className="inline-flex items-center gap-1 text-[#E2C275] bg-[#E2C275]/10 border border-[#E2C275]/25 px-2 py-0.5 rounded-full text-[10px] font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E2C275]" />
                <span>VERIFIED</span>
              </div>
            </div>

            <Link
              href={`/shop/${product.slug}`}
              className="block group-hover:text-[#E2C275] transition-colors"
            >
              <h3 className="text-lg sm:text-xl font-bold leading-snug text-white font-sans">
                {displayName}
              </h3>
            </Link>
          </div>

          {/* Specs & Flavors */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-300 font-sans">
            <span className="inline-flex items-center gap-1 text-[#E2C275] font-semibold">
              <Star className="w-3.5 h-3.5 fill-[#E2C275] text-[#E2C275]" />
              {product.rating.toFixed(1)}
              <span className="text-zinc-400 font-normal">({product.reviewsCount} reviews)</span>
            </span>
            <span className="text-zinc-600">•</span>
            <span>
              Goal: <strong className="text-zinc-200 font-semibold">{product.goal}</strong>
            </span>
            <span className="text-zinc-600">•</span>
            <span>
              Size: <strong className="text-zinc-200 font-semibold">{product.weightOrServings}</strong>
            </span>
          </div>

          {product.flavors && product.flavors.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-zinc-400 mr-1">Flavors:</span>
              {product.flavors.slice(0, 4).map((flavor) => (
                <span
                  key={flavor}
                  className="px-2 py-0.5 rounded-md bg-[#0D0D10] border border-white/10 text-xs text-zinc-300 font-sans"
                >
                  {flavor}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Dual Cash/KOKO Pricing & Actions */}
        <div className="w-full md:w-64 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/[0.08] md:pl-5 flex flex-col justify-center">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-white tracking-tight font-sans">
              {formattedPrice}
            </span>
            {formattedOriginalPrice && (
              <span className="text-xs text-zinc-400 line-through font-sans">
                {formattedOriginalPrice}
              </span>
            )}
          </div>

          <div className="text-xs text-zinc-300 mt-1.5 font-medium flex items-center gap-1.5 font-sans">
            <span className="text-[10px] font-bold text-[#A78BFA] bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-1.5 py-0.5 rounded font-sans">
              KOKO
            </span>
            <span className="text-zinc-200 font-sans">
              {formatLKR(getKokoTotal(product.price), false)}
            </span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-300 font-sans">
              3 × {formatLKR(getKokoInstallment(product.price), false)}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                isAdded
                  ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-200"
                  : "btn-aurafit-dark"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWishlist}
              aria-label="Add to wishlist"
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isWishlisted
                  ? "bg-red-500/20 border-red-500/40 text-red-400"
                  : "bg-[#1C1C21] border-white/12 text-zinc-300 hover:text-white hover:border-white/25"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? "fill-red-400 text-red-400" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col bg-[#141418] rounded-2xl border border-white/10 hover:border-[#E2C275]/50 overflow-hidden transition-all duration-300 hover:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7),0_0_24px_-6px_rgba(226,194,117,0.15)]">
      {/* 1. Top Image Stage (Aligned Across Every Row) */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-square w-full bg-[#15151B] border-b border-white/[0.06] overflow-hidden p-4"
      >
        <StudioImage
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          objectFit="contain"
          fallbackLabel={product.name}
          className="transition-transform duration-300 group-hover:scale-105"
        />

        {/* Top-Left: Product Highlight Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded text-[9px] font-black tracking-wider uppercase text-[#09090B] bg-gradient-to-r from-[#E5C76B] to-[#C9A227] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              {product.badge}
            </span>
          </div>
        )}

        {/* Top-Right: Compact VERIFIED Authenticity Shield Pill */}
        <div
          title="100% Importer Verified"
          className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 bg-[#09090B]/85 border border-[#E2C275]/40 text-[#E2C275] text-[10px] font-bold px-2 py-0.5 rounded-full"
        >
          <ShieldCheck className="w-3 h-3 text-[#E2C275]" />
          <span>VERIFIED</span>
        </div>

        {/* Bottom-Left: Serving / Weight Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-block bg-[#09090B]/85 border border-white/10 text-zinc-300 text-[11px] font-medium px-2.5 py-1 rounded-md font-sans">
            {product.weightOrServings}
          </span>
        </div>

        {/* Bottom-Right: Subtle Hover Action Icons */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handleWishlist}
            aria-label="Add to wishlist"
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isWishlisted
                ? "bg-red-500/20 border-red-500/40 text-red-400"
                : "bg-[#09090B]/90 border-white/15 text-zinc-300 hover:text-white hover:border-[#E2C275]/40"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isWishlisted ? "fill-red-400 text-red-400" : ""
              }`}
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/shop/${product.slug}`);
            }}
            aria-label="Quick view"
            className="p-2 rounded-lg bg-[#09090B]/90 border border-white/15 text-zinc-300 hover:text-white hover:border-[#E2C275]/40 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </Link>

      {/* 2. Structured Typography Block Below Image */}
      <div className="flex-1 flex flex-col p-4 sm:p-5">
        {/* Single-Line Brand & Category Eyebrow (Never Wraps) */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis font-sans">
          <span className="text-[#E2C275] shrink-0">{product.brand}</span>
          <span className="text-zinc-600 shrink-0">•</span>
          <span className="text-zinc-400 truncate">{product.category}</span>
        </div>

        {/* Clean, Balanced Product Name */}
        <Link
          href={`/shop/${product.slug}`}
          className="block mt-1.5 min-h-[2.75rem]"
        >
          <h3 className="text-[15px] sm:text-base font-semibold leading-[1.35] text-white group-hover:text-[#E2C275] transition-colors font-sans">
            {displayName}
          </h3>
        </Link>

        {/* 3. Bottom-Pinned Dual Pricing & CTA */}
        <div className="mt-auto pt-3.5 border-t border-white/[0.06]">
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight font-sans">
              {formattedPrice}
            </span>
            {formattedOriginalPrice && (
              <span className="text-xs text-zinc-500 line-through font-sans">
                {formattedOriginalPrice}
              </span>
            )}
          </div>

          {/* KOKO 3-Installment Row */}
          <div className="text-xs text-zinc-300 mt-1.5 font-medium flex items-center gap-1.5 truncate font-sans">
            <span className="text-[10px] font-bold text-[#A78BFA] bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-1.5 py-0.5 rounded font-sans shrink-0">
              KOKO
            </span>
            <span className="text-zinc-200 font-sans">
              {formatLKR(getKokoTotal(product.price), false)}
            </span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-300 font-sans">
              3 × {formatLKR(getKokoInstallment(product.price), false)}
            </span>
          </div>

          {/* Full-Width Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`mt-3 w-full py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
              isAdded
                ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-200"
                : "btn-aurafit-dark"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
