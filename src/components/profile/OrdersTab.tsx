"use client";

import React from "react";
import Link from "next/link";
import { Package, Truck, QrCode, ArrowRight, CreditCard, Banknote, RotateCcw } from "lucide-react";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

interface MockOrder {
  id: string;
  date: string;
  status: "Delivered" | "In Transit";
  total: number;
  paymentMethod: "KOKO Pay (3 Monthly Installments)" | "Debit / Credit Card" | "Cash on Delivery (COD)";
  courier: string;
  items: Array<{
    name: string;
    variant: string;
    quantity: number;
    price: number;
    batchNumber: string;
  }>;
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: "AF-2026-8492",
    date: "Nov 20, 2026",
    status: "Delivered",
    total: 35425,
    paymentMethod: "KOKO Pay (3 Monthly Installments)",
    courier: "PromptX Express Courier (Colombo 03)",
    items: [
      {
        name: "Optimum Nutrition Gold Standard 100% Isolate",
        variant: "Double Rich Chocolate • 5 lbs",
        quantity: 1,
        price: 32500,
        batchNumber: "LOT# 094821-EXP28",
      },
    ],
  },
  {
    id: "AF-2026-7105",
    date: "Nov 14, 2026",
    status: "In Transit",
    total: 18900,
    paymentMethod: "Debit / Credit Card",
    courier: "Domex Express Delivery (Kandy Hub)",
    items: [
      {
        name: "Cellucor C4 Original Explosive Pre-Workout",
        variant: "Icy Blue Razz • 30 Servings",
        quantity: 1,
        price: 18900,
        batchNumber: "LOT# 038294-EXP27",
      },
    ],
  },
  {
    id: "AF-2025-4219",
    date: "Oct 28, 2026",
    status: "Delivered",
    total: 34900,
    paymentMethod: "Cash on Delivery (COD)",
    courier: "PromptX Courier Delivery (Colombo)",
    items: [
      {
        name: "Dymatize ISO100 Hydrolyzed 100% Whey Isolate",
        variant: "Gourmet Chocolate • 5 lbs",
        quantity: 1,
        price: 34900,
        batchNumber: "LOT# 011928-EXP27",
      },
    ],
  },
];

export default function OrdersTab() {
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();

  const handleReorder = (order: MockOrder) => {
    order.items.forEach((orderItem) => {
      const matched =
        MOCK_PRODUCTS.find((p) =>
          orderItem.name.toLowerCase().includes(p.name.split(" (")[0].toLowerCase())
        ) || MOCK_PRODUCTS[0];
      addToCart(matched, orderItem.quantity, orderItem.variant);
    });
    showToast({
      type: "gold",
      title: "Order Items Added to Cart",
      subtitle: `Items from order ${order.id} are ready in your cart.`,
      actionLabel: "VIEW CART →",
      onAction: () => openCart(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#141418] rounded-2xl border border-white/8 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-6">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-white font-heading">
              Order History &amp; Tracking
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              View your past supplement purchases, courier dispatches, and batch assay reports
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#E2C275] bg-[#1C1C22] border border-white/10 px-3 py-1 rounded-full">
            {MOCK_ORDERS.length} Orders Placed
          </span>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {MOCK_ORDERS.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-2xl bg-[#0E0E12] border border-white/8 hover:border-white/15 transition-all space-y-4 shadow-lg"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#18181D] border border-white/10 flex items-center justify-center text-[#E2C275]">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold font-mono text-white tracking-wider block">
                      {order.id}
                    </span>
                    <span className="text-xs text-zinc-400 font-sans">
                      Placed on {order.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Pill */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === "Delivered"
                        ? "bg-emerald-950/60 border border-emerald-500/30 text-emerald-300"
                        : "bg-amber-950/60 border border-amber-500/30 text-amber-300 animate-pulse"
                    }`}
                  >
                    {order.status}
                  </span>

                  <span className="text-base font-extrabold text-white font-sans">
                    Rs. {order.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-300"
                  >
                    <div>
                      <p className="font-bold text-white font-heading text-sm">
                        {item.name}
                      </p>
                      <p className="text-zinc-400 text-[11px]">{item.variant}</p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <span className="text-zinc-400 font-mono">Qty: {item.quantity}</span>
                      <span className="font-mono text-white font-semibold">
                        Rs. {item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Courier & Payment Footer */}
              <div className="pt-3 border-t border-white/6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Truck className="w-3.5 h-3.5 text-[#E2C275]" />
                    <span>{order.courier}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                    {order.paymentMethod.includes("KOKO") ? (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-[#A78BFA]">
                        KOKO
                      </span>
                    ) : order.paymentMethod.includes("Card") ? (
                      <CreditCard className="w-3 h-3 text-zinc-400" />
                    ) : (
                      <Banknote className="w-3 h-3 text-emerald-400" />
                    )}
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>

                {/* Reorder, Tracking & Batch Verification CTAs */}
                <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleReorder(order)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>REORDER STACK</span>
                  </button>

                  <Link
                    href={`/track-order?id=${order.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-dark"
                  >
                    <Truck className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>TRACK SHIPMENT</span>
                  </Link>

                  <Link
                    href="/verify"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-sky-300 bg-sky-950/40 border border-sky-400/25 hover:border-sky-400/50 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-sky-400" />
                    <span>Verify Hologram</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

