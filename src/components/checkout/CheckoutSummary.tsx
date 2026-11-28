"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Tag,
  CheckCircle2,
  X,
  Loader2,
  ArrowRight,
  PackageCheck,
} from "lucide-react";
import { CartItem } from "@/context/CartContext";
import StudioImage from "@/components/StudioImage";
import { PaymentMethod } from "./PaymentSelector";
import { getKokoTotal, getKokoInstallment } from "@/lib/pricing";

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discountAmount: number;
  appliedPromo: { code: string; discountLabel: string } | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
  selectedPaymentMethod: PaymentMethod;
  isSubmitting: boolean;
  onSubmitOrder: () => void;
}

export default function CheckoutSummary({
  items,
  subtotal,
  shipping,
  discountAmount,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
  selectedPaymentMethod,
  isSubmitting,
  onSubmitOrder,
}: CheckoutSummaryProps) {
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Base total before any payment method specific fee
  const baseTotal = Math.max(0, subtotal - discountAmount + shipping);

  // Koko Calculations
  const isKoko = selectedPaymentMethod === "koko";
  const kokoTotal = getKokoTotal(baseTotal);
  const kokoFee = isKoko ? kokoTotal - baseTotal : 0;
  const kokoInstallment = getKokoInstallment(baseTotal);

  // Final Total to pay
  const finalTotal = isKoko ? kokoTotal : baseTotal;

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const success = onApplyPromo(promoInput);
    if (success) {
      setPromoInput("");
      setPromoError(null);
    } else {
      setPromoError('Invalid coupon. Try "AURA10" for 10% off.');
    }
  };

  return (
    <div
      data-lenis-prevent
      className="bg-[#111115] rounded-2xl border border-white/10 p-5 sm:p-6 space-y-5 shadow-2xl lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto overscroll-contain scrollbar-thin"
    >
      {/* Header */}
      <div className="pb-3 border-b border-white/8 flex items-center justify-between">
        <h3 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
          Order Summary
        </h3>
        <span className="text-xs font-mono font-bold text-[#E2C275] bg-[#1C1C22] border border-white/10 px-2.5 py-0.5 rounded-full">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      {/* =========================================================================
          ITEMS LIST (SCROLLABLE WITH DATA-LENIS-PREVENT)
          ========================================================================= */}
      <div
        data-lenis-prevent
        className="max-h-[260px] overflow-y-auto overscroll-contain pr-1 divide-y divide-white/8 space-y-3 scrollbar-thin"
      >
        {items.map((item) => (
          <div
            key={`${item.product.id}-${item.selectedFlavor || "default"}`}
            className="pt-3 first:pt-0 flex items-center gap-3"
          >
            {/* Thumbnail */}
            <div className="relative w-14 h-14 rounded-xl bg-[#0D0D10] border border-white/8 p-1.5 shrink-0 overflow-hidden">
              <StudioImage
                src={item.product.image}
                alt={item.product.name}
                fill
                sizes="56px"
                objectFit="contain"
                fallbackLabel={item.product.name}
              />
            </div>

            {/* Meta */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E2C275] font-heading block">
                {item.product.brand}
              </span>
              <h4 className="text-xs font-bold text-white font-heading truncate">
                {item.product.name}
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-0.5">
                <span className="font-mono">{item.product.weight}</span>
                {item.selectedFlavor && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="truncate max-w-[120px]">
                      {item.selectedFlavor.replace("&bull;", "•")}
                    </span>
                  </>
                )}
                <span className="text-zinc-600">•</span>
                <span className="font-bold text-zinc-300">x{item.quantity}</span>
              </div>
            </div>

            {/* Line Total */}
            <div className="text-right shrink-0">
              <span className="text-xs sm:text-sm font-bold text-white font-mono">
                Rs. {(item.product.price * item.quantity).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          PROMO CODE FORM
          ========================================================================= */}
      <div className="pt-2 border-t border-white/8">
        {appliedPromo ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Promo <strong>{appliedPromo.code}</strong> applied (
                {appliedPromo.discountLabel})
              </span>
            </div>
            <button
              type="button"
              onClick={onRemovePromo}
              aria-label="Remove promo code"
              className="text-zinc-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handlePromoSubmit} className="space-y-1.5">
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

      {/* =========================================================================
          PRICING BREAKDOWN
          ========================================================================= */}
      <div className="space-y-2.5 pt-2 border-t border-white/8 text-xs text-zinc-300">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="font-semibold text-white font-mono">
            Rs. {subtotal.toLocaleString()}
          </span>
        </div>

        {appliedPromo && (
          <div className="flex justify-between items-center text-emerald-400">
            <span>Coupon Discount ({appliedPromo.discountLabel})</span>
            <span className="font-semibold font-mono">
              - Rs. {discountAmount.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span>Islandwide Express Courier</span>
            <span className="text-[10px] text-zinc-500">
              {shipping === 0 ? "(Free over Rs. 25k)" : "(Standard)"}
            </span>
          </div>
          {shipping === 0 ? (
            <span className="text-[#E2C275] font-bold uppercase tracking-wider">
              FREE
            </span>
          ) : (
            <span className="font-semibold text-white font-mono">
              Rs. {shipping.toLocaleString()}
            </span>
          )}
        </div>

        {/* Koko Fee line if Koko selected */}
        {isKoko && (
          <div className="flex justify-between items-center text-[#A78BFA]">
            <div className="flex items-center gap-1">
              <span>KOKO Convenience Fee (9%)</span>
            </div>
            <span className="font-semibold font-mono">
              + Rs. {kokoFee.toLocaleString()}
            </span>
          </div>
        )}

        {/* Total Line */}
        <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
          <span className="text-sm font-bold uppercase tracking-wider text-white font-heading">
            Total Due
          </span>
          <div className="text-right">
            <span
              className={`text-2xl font-black font-sans tracking-tight block ${
                isKoko ? "text-[#E2C275]" : "text-white"
              }`}
            >
              Rs. {finalTotal.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-400">
              Includes customs import VAT &amp; taxes
            </span>
          </div>
        </div>

        {/* Koko Highlight Pill if Koko selected */}
        {isKoko && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-[#1A1710] to-[#141418] border border-[#E2C275]/35 text-xs text-zinc-200 flex items-center justify-between">
            <div>
              <span className="block font-semibold">
                Pay Today:{" "}
                <strong className="text-[#E2C275]">
                  Rs. {kokoInstallment.toLocaleString()}
                </strong>
              </span>
              <span className="text-[10px] text-zinc-400">
                Then 2 monthly payments of Rs. {kokoInstallment.toLocaleString()}
              </span>
            </div>
            <span className="px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#A78BFA] font-heading">
              KOKO 3X
            </span>
          </div>
        )}
      </div>

      {/* =========================================================================
          SUBMIT ORDER BUTTON
          ========================================================================= */}
      <div className="pt-2 space-y-3">
        <button
          type="button"
          onClick={onSubmitOrder}
          disabled={isSubmitting || items.length === 0}
          className="w-full py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer font-heading"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#09090B]" />
              <span>Processing Order...</span>
            </>
          ) : (
            <>
              <span>PLACE ORDER — Rs. {finalTotal.toLocaleString()}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>

        {/* Trust Strip */}
        <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-500 pt-1">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#E2C275]" />
            256-Bit SSL
          </span>
          <span className="text-zinc-600">•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#E2C275]" />
            100% Authentic Imports
          </span>
          <span className="text-zinc-600">•</span>
          <span className="flex items-center gap-1">
            <PackageCheck className="w-3 h-3 text-[#E2C275]" />
            Hologram Sealed
          </span>
        </div>
      </div>
    </div>
  );
}
