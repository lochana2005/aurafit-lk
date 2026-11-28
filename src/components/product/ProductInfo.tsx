"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  QrCode,
  Sparkles,
  Truck,
  Check,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { Product } from "@/data/mockProducts";
import { useCart } from "@/context/CartContext";
import { useWatchlist } from "@/context/WatchlistContext";
import { formatLKR, getKokoTotal, getKokoInstallment } from "@/lib/pricing";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const isWishlisted = isInWatchlist(product.id);
  const [selectedFlavor, setSelectedFlavor] = useState(
    product.flavors?.[0] || "Standard"
  );
  const [selectedWeight, setSelectedWeight] = useState(product.weight);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const formattedPrice = formatLKR(product.price);
  const formattedOriginalPrice = product.originalPrice
    ? formatLKR(product.originalPrice)
    : null;

  const savingsAmount = product.originalPrice
    ? product.originalPrice - product.price
    : null;

  const handleAddToCart = () => {
    const itemFlavor = selectedFlavor ? `${selectedFlavor} • ${selectedWeight}` : selectedWeight;
    addToCart(product, quantity, itemFlavor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    const itemFlavor = selectedFlavor ? `${selectedFlavor} • ${selectedWeight}` : selectedWeight;
    addToCart(product, quantity, itemFlavor);
    router.push("/checkout");
  };

  return (
    <div className="w-full space-y-6 sm:space-y-7">
      {/* =========================================================================
          BREADCRUMBS
          ========================================================================= */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 flex-wrap"
      >
        <Link href="/" className="hover:text-[#E2C275] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <Link href="/shop" className="hover:text-[#E2C275] transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <Link
          href={`/shop?category=${encodeURIComponent(product.category)}`}
          className="hover:text-[#E2C275] transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-zinc-200 font-medium truncate max-w-[240px]">
          {product.name}
        </span>
      </nav>

      {/* =========================================================================
          TITLE, BRAND & RATING
          ========================================================================= */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-black uppercase tracking-widest text-[#E2C275] font-heading">
            {product.brand}
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-xs text-zinc-400 font-medium">
            Goal: <strong className="text-zinc-200">{product.goal}</strong>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white font-heading leading-tight tracking-wide">
          {product.name}
        </h1>

        {/* Rating & Stock Indicator */}
        <div className="mt-3 flex items-center gap-4 flex-wrap text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold font-mono">{product.rating}</span>
            <span className="text-zinc-400 font-sans">
              ({product.reviewsCount} reviews)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {product.inStock ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs sm:text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                In Stock • Ready for Islandwide Dispatch
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs sm:text-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Shipment in Transit • Pre-Orders Open
              </span>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRICING: CASH / CARD PRICE & KOKO PAY PRICE (SIDE-BY-SIDE GRID)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Box 1 — Cash / Bank / Card Price */}
        <div className="bg-[#141418] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold tracking-wider text-zinc-300 uppercase font-heading">
              CASH / CARD PRICE
            </span>
            {savingsAmount && product.originalPrice && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30">
                Save {Math.round((savingsAmount / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          <div>
            {formattedOriginalPrice && (
              <span className="text-sm text-zinc-300 line-through font-mono block mb-0.5">
                {formattedOriginalPrice}
              </span>
            )}
            <span className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
              {formattedPrice}
            </span>
          </div>
        </div>

        {/* Box 2 — KOKO Pay Price */}
        <div className="bg-gradient-to-br from-[#1A1710] to-[#141418] border border-[#E2C275]/35 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#A78BFA] font-heading">
                KOKO
              </span>
              <span className="text-xs font-semibold tracking-wider text-zinc-300 uppercase font-heading">
                PAY PRICE
              </span>
            </div>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#E2C275] font-sans tracking-tight block">
              {formatLKR(getKokoTotal(product.price))}
            </span>
            <span className="text-sm text-zinc-300 font-medium font-sans mt-0.5 block">
              3 × {formatLKR(getKokoInstallment(product.price))}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FLAVOR SELECTOR
          ========================================================================= */}
      {product.flavors && product.flavors.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold uppercase tracking-wider text-zinc-300 font-heading">
              Select Flavor:
            </span>
            <span className="text-[#E2C275] font-bold">
              {selectedFlavor}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {product.flavors.map((flavor) => {
              const isSelected = selectedFlavor === flavor;
              return (
                <button
                  key={flavor}
                  type="button"
                  onClick={() => setSelectedFlavor(flavor)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#E2C275]/20 border border-[#E2C275] text-white shadow-sm ring-1 ring-[#E2C275]/40 font-bold"
                      : "bg-[#18181D] text-zinc-200 hover:text-white border border-white/15 hover:border-white/30"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#E2C275]" />}
                  <span>{flavor}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          WEIGHT / SIZE SELECTOR
          ========================================================================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-semibold uppercase tracking-wider text-zinc-300 font-heading">
            Size / Package:
          </span>
          <span className="text-zinc-300 font-mono font-medium">
            {product.weightOrServings}
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setSelectedWeight(product.weight)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedWeight === product.weight
                ? "bg-[#E2C275]/20 border border-[#E2C275] text-white ring-1 ring-[#E2C275]/40"
                : "bg-[#18181D] text-zinc-200 hover:text-white border border-white/15 hover:border-white/30"
            }`}
          >
            {product.weight}
          </button>
        </div>
      </div>

      {/* =========================================================================
          QUANTITY & ACTION BUTTONS
          ========================================================================= */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Stepper */}
          <div className="h-12 rounded-xl bg-[#141418] border border-white/15 px-2 flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center text-sm font-bold text-white font-mono">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="p-1.5 text-zinc-400 hover:text-white cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 h-12 px-6 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer ${
              isAdded
                ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                : "bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] text-[#09090B] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 stroke-[2.3]" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* Watchlist Heart Button */}
          <button
            type="button"
            data-no-glint
            onClick={() => toggleWatchlist(product)}
            aria-label={isWishlisted ? "Remove from watchlist" : "Save to watchlist"}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
              isWishlisted
                ? "bg-[#E2C275]/15 border-[#E2C275]/60 text-[#E2C275]"
                : "bg-[#141418] border-white/15 text-zinc-300 hover:text-white hover:border-[#E2C275]/45"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${isWishlisted ? "fill-[#E2C275] text-[#E2C275]" : ""}`}
            />
          </button>
        </div>

        {/* Buy Now Button */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="w-full h-12 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider btn-aurafit-dark flex items-center justify-center gap-2 cursor-pointer font-heading"
        >
          <Zap className="w-4 h-4 text-[#E2C275]" />
          <span>Buy Now • Instant Checkout</span>
        </button>
      </div>

      {/* =========================================================================
          AUTHENTICITY & AI TRUST BOX
          ========================================================================= */}
      <div className="p-4 rounded-2xl bg-[#111115] border border-white/8 space-y-3">
        {/* Link 1: QR Verification */}
        <Link
          href="/verify"
          className="flex items-center justify-between text-xs text-sky-300 hover:text-sky-200 group"
        >
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">
              Verify Batch Code on Manufacturer Portal
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-sky-400/60 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {/* Link 2: AI Coach */}
        <Link
          href="/ai-coach"
          className="flex items-center justify-between text-xs text-sky-300 hover:text-sky-200 group pt-2.5 border-t border-white/6"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">
              Ask AI Coach if this fits your training goal
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-sky-400/60 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* =========================================================================
          DELIVERY & PAYMENT ASSURANCE STRIP
          ========================================================================= */}
      <div className="p-4 rounded-xl bg-[#141418] border border-white/6 space-y-2 text-xs text-zinc-400">
        <div className="flex items-center gap-2.5 text-zinc-300 font-medium">
          <Truck className="w-4 h-4 text-[#E2C275] shrink-0" />
          <span>Islandwide 24–48h Express Courier Delivery (PromptX / Domex)</span>
        </div>
        <div className="flex items-center gap-2.5 text-zinc-300 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#E2C275] shrink-0" />
          <span>Cash on Delivery (COD) &amp; Bank Transfer Available</span>
        </div>
      </div>
    </div>
  );
}
