"use client";

import React from "react";
import { CreditCard, Banknote, ShieldCheck } from "lucide-react";
import { getKokoInstallment } from "@/lib/pricing";

export type PaymentMethod = "card" | "cod" | "koko";

interface PaymentSelectorProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  subtotal: number;
}

export default function PaymentSelector({
  selectedMethod,
  onSelectMethod,
  subtotal,
}: PaymentSelectorProps) {
  const kokoInstallment = getKokoInstallment(subtotal);

  return (
    <section className="bg-[#141418] rounded-2xl border border-white/8 p-5 sm:p-7 shadow-lg space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-white/8">
        <div className="w-8 h-8 rounded-full bg-[#1C1C22] border border-[#E2C275]/40 flex items-center justify-center text-xs font-bold text-[#E2C275] font-mono">
          3
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white font-heading">
            Payment Method
          </h2>
          <p className="text-xs text-zinc-400">
            Choose your preferred secure payment option
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* =========================================================================
            OPTION 1: CARD PAYMENT (VISA / MASTERCARD / PAYHERE)
            ========================================================================= */}
        <div
          onClick={() => onSelectMethod("card")}
          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            selectedMethod === "card"
              ? "bg-[#1A1710] border-[#E2C275] ring-1 ring-[#E2C275]/40 shadow-lg"
              : "bg-[#0E0E12] border-white/10 hover:border-white/20"
          }`}
        >
          <div className="pt-0.5">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                selectedMethod === "card"
                  ? "border-[#E2C275] bg-[#E2C275]"
                  : "border-zinc-500 bg-transparent"
              }`}
            >
              {selectedMethod === "card" && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#09090B]" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#E2C275]" />
                <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wide">
                  Debit or Credit Card
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                <span className="px-1.5 py-0.5 rounded bg-[#1C1C22] border border-white/10">
                  VISA
                </span>
                <span className="px-1.5 py-0.5 rounded bg-[#1C1C22] border border-white/10">
                  MASTERCARD
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Instant secure gateway payment via 256-bit SSL encryption. Standard Cash/Card price.
            </p>
          </div>
        </div>

        {/* =========================================================================
            OPTION 2: CASH ON DELIVERY (COD)
            ========================================================================= */}
        <div
          onClick={() => onSelectMethod("cod")}
          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            selectedMethod === "cod"
              ? "bg-[#1A1710] border-[#E2C275] ring-1 ring-[#E2C275]/40 shadow-lg"
              : "bg-[#0E0E12] border-white/10 hover:border-white/20"
          }`}
        >
          <div className="pt-0.5">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                selectedMethod === "cod"
                  ? "border-[#E2C275] bg-[#E2C275]"
                  : "border-zinc-500 bg-transparent"
              }`}
            >
              {selectedMethod === "cod" && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#09090B]" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wide">
                  Cash on Delivery (COD)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/50 border border-emerald-500/30 text-emerald-300">
                ISLANDWIDE
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Pay with cash directly to the courier when your parcel arrives at your doorstep.
            </p>
          </div>
        </div>

        {/* =========================================================================
            OPTION 3: KOKO PAY (3 INSTALLMENTS)
            ========================================================================= */}
        <div
          onClick={() => onSelectMethod("koko")}
          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            selectedMethod === "koko"
              ? "bg-[#1A1710] border-[#E2C275] ring-1 ring-[#E2C275]/40 shadow-lg"
              : "bg-[#0E0E12] border-white/10 hover:border-white/20"
          }`}
        >
          <div className="pt-0.5">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                selectedMethod === "koko"
                  ? "border-[#E2C275] bg-[#E2C275]"
                  : "border-zinc-500 bg-transparent"
              }`}
            >
              {selectedMethod === "koko" && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#09090B]" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#A78BFA] font-heading">
                  KOKO
                </span>
                <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wide">
                  KOKO Pay (3 Monthly Installments)
                </h3>
              </div>
              <span className="text-xs font-bold text-[#E2C275] font-mono">
                3 × Rs. {kokoInstallment.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Split your purchase into 3 payments. Pay first installment today with any debit card.
              <span className="text-zinc-500 block text-[11px] mt-0.5">
                *Includes 9% KOKO merchant convenience fee.
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 text-[11px] text-zinc-400">
        <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
        <span>Your transaction is protected with end-to-end 256-bit bank grade encryption.</span>
      </div>
    </section>
  );
}

