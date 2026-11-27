"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Truck,
  CreditCard,
  Banknote,
  Sparkles,
} from "lucide-react";
import { CartItem } from "@/context/CartContext";
import { PaymentMethod } from "./PaymentSelector";

export interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  paymentMethod: PaymentMethod;
  total: number;
  items: CartItem[];
  isKoko: boolean;
  kokoInstallment?: number;
}

interface OrderSuccessProps {
  order: OrderConfirmationData;
}

export default function OrderSuccess({ order }: OrderSuccessProps) {
  const paymentMethodLabel =
    order.paymentMethod === "card"
      ? "Credit / Debit Card (Online Secured)"
      : order.paymentMethod === "cod"
      ? "Cash on Delivery (Pay to Courier)"
      : "KOKO Pay (3 Monthly Installments)";

  return (
    <div className="max-w-3xl mx-auto py-10 sm:py-14 space-y-8">
      {/* =========================================================================
          HERO CELEBRATION BOX
          ========================================================================= */}
      <div className="text-center space-y-4">
        {/* Animated Checkmark Circle */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-[#141418] border-2 border-emerald-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" />
          <div className="absolute -inset-2 rounded-full bg-emerald-500/10 blur-xl -z-10 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Order Successfully Placed</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-heading">
          ORDER CONFIRMED!
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
          Thank you, <strong className="text-white">{order.customerName}</strong>.
          Your authentic supplement vault is being prepared for express dispatch
          from our Colombo direct importer facility.
        </p>

        {/* Order ID Pill */}
        <div className="pt-2">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141418] border border-white/10 text-xs text-zinc-300">
            <span>Order Reference:</span>
            <strong className="text-[#E2C275] font-mono text-sm tracking-wider">
              {order.orderId}
            </strong>
          </span>
        </div>
      </div>

      {/* =========================================================================
          ORDER DETAILS SUMMARY CARD
          ========================================================================= */}
      <div className="bg-[#141418] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-base font-bold uppercase tracking-wider text-white font-heading border-b border-white/8 pb-3">
          Dispatch &amp; Payment Summary
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          {/* Delivery Address */}
          <div className="space-y-1.5">
            <span className="font-bold uppercase tracking-wider text-zinc-400 font-heading block">
              Delivery Destination
            </span>
            <p className="text-white font-medium">{order.customerName}</p>
            <p className="text-zinc-300">{order.address}</p>
            <p className="text-zinc-300">
              {order.city}, {order.district}
            </p>
            <p className="text-zinc-400 font-mono pt-1">+94 {order.phone}</p>
          </div>

          {/* Payment Details */}
          <div className="space-y-1.5">
            <span className="font-bold uppercase tracking-wider text-zinc-400 font-heading block">
              Payment Method
            </span>
            <div className="flex items-center gap-2 text-white font-medium">
              {order.paymentMethod === "cod" ? (
                <Banknote className="w-4 h-4 text-emerald-400" />
              ) : (
                <CreditCard className="w-4 h-4 text-[#E2C275]" />
              )}
              <span>{paymentMethodLabel}</span>
            </div>

            <div className="pt-2">
              <span className="text-zinc-400 block text-[11px]">Total Amount</span>
              <span className="text-xl font-black text-white font-sans">
                Rs. {order.total.toLocaleString()}
              </span>
              {order.isKoko && order.kokoInstallment && (
                <span className="block text-[11px] text-[#A78BFA] mt-0.5">
                  Split into 3 monthly payments of Rs.{" "}
                  {order.kokoInstallment.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Courier & Delivery Speed Strip */}
        <div className="p-3.5 rounded-xl bg-[#0E0E12] border border-white/8 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-zinc-300 font-medium">
            <Truck className="w-4 h-4 text-[#E2C275] shrink-0" />
            <span>
              Estimated Delivery:{" "}
              <strong className="text-white">24–48 Hours</strong> via Express Courier
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            Domex / PromptX
          </span>
        </div>
      </div>

      {/* =========================================================================
          ICE CYAN HOLOGRAPHIC QR VERIFICATION REMINDER
          ========================================================================= */}
      <div className="p-5 rounded-2xl bg-sky-950/30 border border-sky-400/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-400/35 flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-heading">
              Tamper-Evident QR Hologram Attached
            </h3>
            <p className="text-xs text-sky-200/80 mt-0.5">
              Every tub in this shipment carries a scannable batch code. Verify your
              import certificate upon unboxing.
            </p>
          </div>
        </div>

        <Link
          href="/verify"
          className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-sky-200 bg-sky-900/40 border border-sky-400/40 hover:bg-sky-900/60 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>Verify Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* =========================================================================
          ACTION BUTTONS
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href={`/track-order?id=${order.orderId}`}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:brightness-105 active:scale-95 transition-all text-center font-heading flex items-center justify-center gap-2 cursor-pointer"
        >
          <Truck className="w-4 h-4 text-[#09090B]" />
          <span>Track This Order Live</span>
        </Link>

        <Link
          href="/shop"
          className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 transition-all text-center font-heading"
        >
          Continue Shopping
        </Link>

        <Link
          href="/verify"
          className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider btn-aurafit-dark text-center flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-[#E2C275]" />
          <span>Verify a Product</span>
        </Link>
      </div>
    </div>
  );
}
