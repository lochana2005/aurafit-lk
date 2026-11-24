"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck,
  ArrowRight,
  ShieldCheck,
  Lock,
  Tag,
  CheckCircle2,
  X,
  CreditCard,
  Banknote,
} from "lucide-react";
import { getKokoTotal, getKokoInstallment } from "@/lib/pricing";

interface OrderSummaryProps {
  subtotal: number;
}

const FREE_SHIPPING_THRESHOLD = 25000;
const STANDARD_SHIPPING_FEE = 450;

export default function OrderSummary({ subtotal }: OrderSummaryProps) {
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercent: number;
  } | null>(null);

  // Free shipping calculations
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Discount calculation
  const discountAmount = appliedPromo
    ? Math.round((subtotal * appliedPromo.discountPercent) / 100)
    : 0;

  // Shipping fee
  const shippingFee = isFreeShipping || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;

  // Final Total
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Promo Code Handler
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const cleaned = promoInput.trim().toUpperCase();

    if (!cleaned) return;

    if (cleaned === "AURA10") {
      setAppliedPromo({ code: "AURA10", discountPercent: 10 });
      setPromoInput("");
      setPromoError(null);
    } else {
      setPromoError('Invalid coupon. Try "AURA10" for 10% off.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  return (
    <div className="bg-[#111115] rounded-2xl border border-white/10 p-5 sm:p-6 space-y-5 shadow-2xl lg:sticky lg:top-28 lg:self-start">
      {/* Header */}
      <div className="pb-3 border-b border-white/8 flex items-center justify-between">
        <h3 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
          Order Summary
        </h3>
        <span className="text-[11px] font-semibold text-[#E2C275] bg-[#1C1C22] border border-white/10 px-2.5 py-0.5 rounded-full">
          Secure Checkout
        </span>
      </div>

      {/* Free Delivery Meter */}
      <div className="p-3.5 rounded-xl bg-[#141418] border border-white/8 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <Truck className="w-4 h-4 text-[#E2C275]" />
            {isFreeShipping ? (
              <span className="text-[#E2C275] font-bold">
                FREE Islandwide Delivery Unlocked! 🎉
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

      {/* Promo Code Input */}
      <div className="space-y-2">
        {appliedPromo ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Promo <strong>{appliedPromo.code}</strong> applied (
                {appliedPromo.discountPercent}% OFF)
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemovePromo}
              aria-label="Remove promo code"
              className="text-zinc-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromo} className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    if (promoError) setPromoError(null);
                  }}
                  placeholder="Discount code (try AURA10)"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1C1C22] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E2C275] uppercase transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] to-[#C9A227] hover:brightness-105 active:scale-95 transition-all cursor-pointer font-heading"
              >
                Apply
              </button>
            </div>
            {promoError && (
              <p className="text-[11px] text-red-400 pl-1">{promoError}</p>
            )}
          </form>
        )}
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-2.5 pt-2 border-t border-white/8 text-xs text-zinc-300">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="font-semibold text-white font-mono">
            Rs. {subtotal.toLocaleString()}
          </span>
        </div>

        {/* Promo Discount */}
        {appliedPromo && (
          <div className="flex justify-between items-center text-emerald-400">
            <span>Coupon Discount ({appliedPromo.discountPercent}%)</span>
            <span className="font-semibold font-mono">
              - Rs. {discountAmount.toLocaleString()}
            </span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span>Estimated Delivery</span>
            <span className="text-[10px] text-zinc-500">
              {isFreeShipping ? "(Island-wide)" : "(Standard)"}
            </span>
          </div>
          {isFreeShipping ? (
            <span className="text-[#E2C275] font-bold uppercase tracking-wider">
              FREE
            </span>
          ) : (
            <span className="font-semibold text-white font-mono">
              Rs. {STANDARD_SHIPPING_FEE.toLocaleString()}
            </span>
          )}
        </div>

        {/* Total */}
        <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
          <span className="text-sm font-bold uppercase tracking-wider text-white font-heading">
            Estimated Total
          </span>
          <div className="text-right">
            <span className="text-2xl font-black text-white font-sans tracking-tight block">
              Rs. {finalTotal.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-500">Includes all local taxes</span>
          </div>
        </div>

        {/* Koko 3-Installment Note */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#1A1710] to-[#141418] border border-[#E2C275]/25 text-[11px] text-zinc-300 flex items-center justify-between">
          <div>
            <span>
              Koko Pay Total:{" "}
              <strong className="text-white font-mono">
                Rs. {getKokoTotal(finalTotal).toLocaleString()}
              </strong>
            </span>
            <span className="block text-[10px] text-zinc-400 mt-0.5">
              3 installments of{" "}
              <strong className="text-[#E2C275]">
                Rs. {getKokoInstallment(finalTotal).toLocaleString()}
              </strong>{" "}
              (includes 9% fee)
            </span>
          </div>
          <span className="px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#A78BFA]">
            KOKO
          </span>
        </div>
      </div>

      {/* Checkout CTA */}
      <div className="space-y-3 pt-2">
        <Link
          href="/checkout"
          className="w-full py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading"
        >
          <span>PROCEED TO CHECKOUT</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>

        {/* Payment Methods Badges */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 pt-1">
          <span className="px-2 py-1 rounded bg-[#1C1C22] border border-white/10 flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-[#E2C275]" />
            VISA / MASTER
          </span>
          <span className="px-2 py-1 rounded bg-[#1C1C22] border border-white/10 text-[#FF5A82]">
            KOKO PAY
          </span>
          <span className="px-2 py-1 rounded bg-[#1C1C22] border border-white/10 flex items-center gap-1">
            <Banknote className="w-3 h-3 text-emerald-400" />
            COD
          </span>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-500 pt-1">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#E2C275]" />
            256-Bit SSL
          </span>
          <span className="text-zinc-600">•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#E2C275]" />
            100% Authentic
          </span>
          <span className="text-zinc-600">•</span>
          <span>Same-Day Dispatch</span>
        </div>
      </div>
    </div>
  );
}

