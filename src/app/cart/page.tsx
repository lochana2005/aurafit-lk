"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  QrCode,
  Award,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartItemRow from "@/components/cart/CartItemRow";
import OrderSummary from "@/components/cart/OrderSummary";

export default function CartPage() {
  const { items, subtotal, totalItems, updateQuantity, removeFromCart, clearCart } =
    useCart();

  return (
    <div className="min-h-screen pt-4 pb-16 bg-[#09090B]">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 w-full">
        {/* =========================================================================
            BREADCRUMBS
            ========================================================================= */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-zinc-400 mb-6"
        >
          <Link
            href="/"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            Home
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-[#E2C275] font-semibold">Shopping Cart</span>
        </nav>

        {/* =========================================================================
            PAGE HEADER
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/8 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141418] border border-white/8 text-[11px] font-semibold text-[#E2C275] tracking-wider uppercase mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Direct Importer Warehouse</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-heading">
              YOUR SUPPLEMENT{" "}
              <span className="bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] bg-clip-text text-transparent">
                VAULT
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Every item in your cart is protected by AuraFit&apos;s 100% authenticity
              guarantee and customs laboratory batch verification.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#141418] border border-white/10 text-white font-mono">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
          )}
        </div>

        {/* =========================================================================
            CONTENT AREA: EMPTY STATE VS 12-COLUMN CART
            ========================================================================= */}
        {items.length === 0 ? (
          <div className="py-16 sm:py-24 text-center max-w-xl mx-auto">
            {/* Empty Bag Graphic */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-[#141418] border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative">
              <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-[#E2C275]" />
              <div className="absolute -inset-1 rounded-3xl bg-[#E2C275]/10 blur-xl -z-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white font-heading">
              Your Vault Is Empty
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 mb-8 leading-relaxed">
              You haven&apos;t added any verified supplements to your vault yet. Explore
              our curated inventory of genuine protein, creatine, and pre-workouts
              imported directly from the USA &amp; UK.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 transition-all font-heading"
            >
              <span>Explore Supplements</span>
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            </Link>

            {/* Quick Guarantees Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 pt-8 border-t border-white/8 text-left">
              <div className="p-4 rounded-xl bg-[#111115] border border-white/6">
                <ShieldCheck className="w-5 h-5 text-[#E2C275] mb-2" />
                <h4 className="text-xs font-bold text-white uppercase font-heading">
                  100% Authentic
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Direct manufacturer imports with anti-counterfeit batch seals.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#111115] border border-white/6">
                <QrCode className="w-5 h-5 text-sky-400 mb-2" />
                <h4 className="text-xs font-bold text-white uppercase font-heading">
                  QR Batch Verified
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Scan each tub to view third-party laboratory assay certificates.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#111115] border border-white/6">
                <Award className="w-5 h-5 text-[#E2C275] mb-2" />
                <h4 className="text-xs font-bold text-white uppercase font-heading">
                  Island-Wide Express
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Next-day delivery in Colombo; 48 hours for outstation areas.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* =========================================================================
                LEFT COLUMN (8 COLS): CART ITEMS LIST
                ========================================================================= */}
            <div className="lg:col-span-8 space-y-4">
              {/* Action Bar */}
              <div className="flex items-center justify-between pb-2 text-xs">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-[#E2C275] transition-colors font-medium cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Shopping</span>
                </Link>

                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Cart</span>
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <CartItemRow
                    key={`${item.product.id}-${item.selectedFlavor || "default"}`}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>

              {/* Bottom Authenticity Assurance Banner */}
              <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-[#111115] border border-sky-400/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-950/40 border border-sky-400/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-heading">
                      AuraFit Authenticity Guarantee Attached
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      Every tub in this shipment includes a holographic security sticker
                      and instant QR verification access.
                    </p>
                  </div>
                </div>

                <Link
                  href="/verify"
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-sky-300 bg-sky-950/50 border border-sky-400/30 hover:border-sky-400/60 transition-colors shrink-0"
                >
                  Learn About Verification
                </Link>
              </div>
            </div>

            {/* =========================================================================
                RIGHT COLUMN (4 COLS): ORDER SUMMARY
                ========================================================================= */}
            <div className="lg:col-span-4">
              <OrderSummary subtotal={subtotal} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

