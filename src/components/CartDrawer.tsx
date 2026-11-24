"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Lock,
  Truck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getKokoTotal, getKokoInstallment } from "@/lib/pricing";
import StudioImage from "./StudioImage";

const FREE_SHIPPING_THRESHOLD = 25000;

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    totalItems,
    subtotal,
  } = useCart();

  // Disable background scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Free shipping calculations
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/80 cursor-pointer"
          />

          {/* Slide-over Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-[#111115] border-l border-white/10 shadow-2xl flex flex-col justify-between"
            >
              {/* =========================================================================
                  DRAWER HEADER
                  ========================================================================= */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#E2C275]" />
                  <h2 className="text-xl font-bold uppercase tracking-wider text-white font-heading">
                    YOUR CART
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1C1C22] text-[#E2C275] border border-white/10 font-mono">
                    {totalItems}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={closeCart}
                  aria-label="Close cart drawer"
                  className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* =========================================================================
                  FREE SHIPPING THRESHOLD PROGRESS BAR
                  ========================================================================= */}
              <div className="px-5 py-3.5 bg-[#141418] border-b border-white/8">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Truck className="w-4 h-4 text-[#E2C275]" />
                    {remainingForFreeShipping === 0 ? (
                      <span className="text-[#E2C275] font-bold">
                        FREE Express Delivery Unlocked! 🎉
                      </span>
                    ) : (
                      <span className="text-zinc-300">
                        Add{" "}
                        <strong className="text-white">
                          Rs. {remainingForFreeShipping.toLocaleString()}
                        </strong>{" "}
                        for <strong className="text-[#E2C275]">FREE Delivery</strong>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 font-bold">
                    {progressPercent}%
                  </span>
                </div>

                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] transition-all duration-300 rounded-full"
                  />
                </div>
              </div>

              {/* =========================================================================
                  CART ITEMS LIST (SCROLLABLE)
                  ========================================================================= */}
              <div
                data-lenis-prevent
                className="flex-1 overflow-y-auto p-5 divide-y divide-white/8 space-y-4 overscroll-contain"
              >
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#1C1C22] border border-white/10 flex items-center justify-center mb-4 text-zinc-500">
                      <ShoppingBag className="w-8 h-8 text-[#E2C275]/50" />
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-wider font-heading text-white">
                      Your Cart is Empty
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-xs mt-1.5 leading-relaxed">
                      Discover 100% authentic fitness supplements backed by direct importer laboratory batch test certificates.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        closeCart();
                      }}
                      className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 transition-all"
                    >
                      <Link href="/shop" onClick={closeCart}>
                        Start Shopping
                      </Link>
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedFlavor || ""}`}
                      className="pt-4 first:pt-0 flex items-center gap-3.5"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-16 h-16 rounded-xl bg-[#0D0D10] border border-white/8 p-1.5 shrink-0 overflow-hidden">
                        <StudioImage
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          objectFit="contain"
                          fallbackLabel={item.product.name}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-zinc-500 font-heading block leading-none">
                              {item.product.brand}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-white font-heading truncate mt-0.5">
                              {item.product.name}
                            </h4>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            aria-label={`Remove ${item.product.name} from cart`}
                            className="text-zinc-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Weight & Selected Flavor */}
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1">
                          <span className="font-mono">{item.product.weight}</span>
                          {item.selectedFlavor && (
                            <>
                              <span className="text-zinc-600">•</span>
                              <span className="truncate">{item.selectedFlavor}</span>
                            </>
                          )}
                        </div>

                        {/* Price & Quantity Stepper */}
                        <div className="flex items-center justify-between mt-2.5">
                          <span className="text-xs sm:text-sm font-extrabold text-white font-sans">
                            Rs. {(item.product.price * item.quantity).toLocaleString()}
                          </span>

                          <div className="flex items-center rounded-lg bg-[#1C1C22] border border-white/10 px-1 py-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                              className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-white font-mono">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* =========================================================================
                  DRAWER FOOTER & CHECKOUT CTA
                  ========================================================================= */}
              {items.length > 0 && (
                <div className="p-5 bg-[#0E0E12] border-t border-white/10 space-y-4">
                  {/* Subtotal */}
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-heading">
                        Subtotal
                      </span>
                      <span className="text-xl font-black text-white font-sans tracking-tight">
                        Rs. {subtotal.toLocaleString()}
                      </span>
                    </div>

                    {/* Koko 3-Payment Installment Note */}
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                      <span>
                        or Koko Pay:{" "}
                        <strong className="text-white">
                          Rs. {getKokoTotal(subtotal).toLocaleString()}
                        </strong>{" "}
                        <span className="text-zinc-500">
                          (3 ×{" "}
                          <strong className="text-[#E2C275]">
                            Rs. {getKokoInstallment(subtotal).toLocaleString()}
                          </strong>
                          )
                        </span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#A78BFA] uppercase">
                        KOKO
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>

                  {/* View Full Cart Button */}
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="w-full py-3 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider text-center text-white hover:text-[#E2C275] bg-[#1C1C22] border border-white/15 hover:border-[#E2C275]/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View Full Cart</span>
                    <ShoppingBag className="w-4 h-4 text-[#E2C275]" />
                  </Link>

                  {/* Security Guarantee Strip */}
                  <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#E2C275]" />
                      SSL Encrypted
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#E2C275]" />
                      100% Authentic Guarantee
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

