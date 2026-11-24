"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  QrCode,
  MessageCircle,
  CreditCard,
  Banknote,
  ShieldCheck,
} from "lucide-react";
import StudioImage from "@/components/StudioImage";
import { formatLKR } from "@/lib/pricing";
import { TrackedOrderRecord } from "@/data/orderTrackingRegistry";

interface TrackedOrderSummaryProps {
  order: TrackedOrderRecord;
}

export default function TrackedOrderSummary({ order }: TrackedOrderSummaryProps) {
  return (
    <div className="bg-[#111115] border border-white/8 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl">
      {/* Header */}
      <div className="pb-3 border-b border-white/8">
        <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white font-heading">
          Order Contents &amp; Destination
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Dispatched from Colombo Importer Vault
        </p>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-heading block">
          Inspected Items in Package ({order.items.length})
        </span>

        <div className="space-y-2.5">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#0E0E12] border border-white/6 hover:border-white/15 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Link
                  href={`/shop/${item.product.slug}`}
                  className="relative w-12 h-12 rounded-lg bg-[#141418] border border-white/8 p-1 shrink-0 overflow-hidden"
                >
                  <StudioImage
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="48px"
                    objectFit="contain"
                    fallbackLabel={item.product.name}
                  />
                </Link>

                <div className="min-w-0 space-y-0.5">
                  <Link
                    href={`/shop/${item.product.slug}`}
                    className="text-xs font-bold text-white font-heading truncate hover:text-[#E2C275] transition-colors block"
                  >
                    {item.product.name}
                  </Link>
                  <div className="text-[11px] text-zinc-400 truncate">
                    {item.flavorOrVariant} · Qty: {item.quantity}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#E2C275] font-sans">
                      {formatLKR(item.price * item.quantity, false)}
                    </span>
                    <Link
                      href="/verify"
                      className="text-[10px] text-sky-400 hover:underline font-mono inline-flex items-center gap-0.5"
                    >
                      <QrCode className="w-2.5 h-2.5" />
                      <span>Verify Seal</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destination & Recipient */}
      <div className="p-4 rounded-xl bg-[#0E0E12] border border-white/6 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 text-zinc-400 font-heading uppercase text-[11px] font-bold">
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span>Delivery Destination</span>
        </div>
        <div>
          <p className="font-bold text-white">{order.customerName}</p>
          <p className="text-zinc-300 mt-0.5">{order.deliveryAddress}</p>
          <p className="text-zinc-500 font-mono text-[11px] mt-0.5">
            Phone: {order.phone}
          </p>
        </div>
      </div>

      {/* Payment Details */}
      <div className="p-4 rounded-xl bg-[#0E0E12] border border-white/6 space-y-3 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-white/6">
          <span className="text-zinc-400">Payment Method:</span>
          <div className="flex items-center gap-1.5 font-semibold text-white">
            {order.paymentMethod.includes("KOKO") ? (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#A78BFA] uppercase">
                KOKO
              </span>
            ) : order.paymentMethod.includes("Card") ? (
              <CreditCard className="w-3.5 h-3.5 text-sky-400" />
            ) : (
              <Banknote className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="truncate max-w-[180px]">{order.paymentMethod}</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <span className="font-heading uppercase text-xs tracking-wider text-zinc-300 font-bold">
            Grand Total:
          </span>
          <span className="text-xl font-black text-white font-sans tracking-tight">
            {formatLKR(order.total)}
          </span>
        </div>

        <div className="text-[10px] text-zinc-400 font-mono text-right flex items-center justify-end gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Status: {order.paymentStatus}</span>
        </div>
      </div>

      {/* Live Dispatch Help Box */}
      <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-400/20 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300 font-heading">
            Need Delivery Assistance?
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Need to reschedule rider delivery or update drop-off notes? Our logistics desk is connected directly with the courier rider.
        </p>

        <a
          href={`https://wa.me/94771234567?text=Hi%20AuraFit%20Dispatch%2C%20I%20need%20assistance%20with%20Order%20${order.orderId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl bg-[#141A22] hover:bg-[#1E2632] border border-sky-400/30 text-sky-300 hover:text-white font-heading uppercase text-xs tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
          <span>Chat with Dispatch on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
