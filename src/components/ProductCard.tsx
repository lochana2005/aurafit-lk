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
                {product.name}
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
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer ${
                isAdded
                  ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "bg-[#1C1C21] text-white hover:bg-gradient-to-r hover:from-[#E5C76B] hover:via-[#C9A227] hover:to-[#B08922] hover:text-[#09090B] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] border border-white/12 hover:border-transparent"
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
    <div className="group relative flex flex-col justify-between bg-[#141418] rounded-2xl border border-white/10 hover:border-[#E2C275]/50 transition-all duration-300 p-5 hover:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7),0_0_24px_-6px_rgba(226,194,117,0.15)]">
      <div>
        {/* Top of card: Title, Category label, and Gold verified tick */}
        <div className="flex items-start justify-between gap-2 mb-3 min-h-[68px]">
          <div className="flex-1 flex flex-col justify-start">
            <span className="text-xs font-semibold tracking-wider text-zinc-400 font-sans block mb-1">
              {product.brand} • {product.category}
            </span>
            <Link href={`/shop/${product.slug}`} className="block group-hover:text-[#E2C275] transition-colors">
              <h3 className="text-base sm:text-[17px] font-bold leading-snug text-white font-sans">
                {product.name}
              </h3>
            </Link>
          </div>

          <div
            title="100% Importer Verified"
            className="flex-shrink-0 flex items-center gap-1 text-[#E2C275] bg-[#E2C275]/10 border border-[#E2C275]/25 px-2 py-0.5 rounded-full text-[10px] font-bold"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#E2C275]" />
            <span className="hidden sm:inline">VERIFIED</span>
          </div>
        </div>

        {/* Middle of card: Clean aspect-square studio image container with floating hover action icons */}
        <Link
          href={`/shop/${product.slug}`}
          className="relative block aspect-square w-full rounded-xl bg-[#0D0D10] border border-white/6 overflow-hidden my-3 p-4 group/img"
        >
          {/* Studio Image Container */}
          <StudioImage
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            objectFit="contain"
            fallbackLabel={product.name}
            className="transition-transform duration-300 group-hover:scale-105"
          />

          {/* Floating Badge (e.g. BEST SELLER / TOP RATED) */}
          {product.badge && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase text-[#09090B] bg-gradient-to-r from-[#E5C76B] to-[#C9A227] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                {product.badge}
              </span>
            </div>
          )}

          {/* Subtle floating hover action icons on the right */}
          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={handleWishlist}
              aria-label="Add to wishlist"
              className={`p-2 rounded-lg border transition-all ${
                isWishlisted
                  ? "bg-red-500/20 border-red-500/40 text-red-400"
                  : "bg-[#141418] border-white/10 text-zinc-300 hover:text-white hover:bg-[#1C1C24]"
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
              className="p-2 rounded-lg bg-[#141418] border border-white/10 text-zinc-300 hover:text-white hover:bg-[#1C1C24] transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Weight / Servings Tag at Bottom Left */}
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="text-[10px] font-mono font-medium text-zinc-400 bg-black/85 px-2 py-0.5 rounded border border-white/8">
              {product.weightOrServings}
            </span>
          </div>
        </Link>
      </div>

      {/* Bottom of card: Pricing, KOKO installment line, and Full-Width Add to Cart button */}
      <div className="mt-2 pt-3 border-t border-white/[0.08]">
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

        {/* Koko Installment Info Line */}
        <div className="text-xs text-zinc-300 mt-1.5 font-medium flex items-center gap-1.5 truncate font-sans">
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

        {/* Full-Width Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full mt-4 py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${
            isAdded
              ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              : "bg-[#1C1C21] text-white hover:bg-gradient-to-r hover:from-[#E5C76B] hover:via-[#C9A227] hover:to-[#B08922] hover:text-[#09090B] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] border border-white/12 hover:border-transparent"
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
  );
}
