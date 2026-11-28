"use client";

import React, { useState, useMemo } from "react";
import { Truck, Phone, MapPin } from "lucide-react";
import {
  useAdmin,
  AdminOrderStatus,
  CourierProvider,
} from "@/context/AdminContext";
import { formatLKR } from "@/lib/pricing";

const STATUS_OPTIONS: AdminOrderStatus[] = [
  "Order Placed",
  "Packed & QR Sealed",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

const COURIERS: CourierProvider[] = ["Koombiyo", "PromptX", "Domex"];

export default function AdminOrdersPage() {
  const { orders, updateOrderDispatch } = useAdmin();
  const [tab, setTab] = useState<"All" | "Pending Dispatch" | "In Transit" | "Delivered">("All");

  const filtered = useMemo(() => {
    if (tab === "All") return orders;
    if (tab === "Pending Dispatch") {
      return orders.filter(
        (o) => o.status === "Order Placed" || o.status === "Packed & QR Sealed"
      );
    }
    if (tab === "In Transit") {
      return orders.filter(
        (o) => o.status === "In Transit" || o.status === "Out for Delivery"
      );
    }
    return orders.filter((o) => o.status === "Delivered");
  }, [orders, tab]);

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(["All", "Pending Dispatch", "In Transit", "Delivered"] as const).map(
          (t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer ${
                tab === t ? "btn-aurafit-gold" : "btn-aurafit-dark"
              }`}
            >
              {t}
            </button>
          )
        )}
      </div>

      {/* Orders Dispatch List */}
      <div className="space-y-4">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="bg-[#111115] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-base font-mono font-bold text-white">
                    {order.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#16161C] border border-white/10 text-[11px] font-semibold text-[#E2C275]">
                    {order.paymentMethod}
                  </span>
                  <span className="text-xs text-zinc-400">{order.date}</span>
                </div>
                <div className="text-sm text-zinc-200 font-medium">
                  {order.itemsSummary}
                </div>
              </div>

              <div className="text-left lg:text-right">
                <div className="text-xs text-zinc-400">Order Total</div>
                <div className="text-xl font-extrabold text-white">
                  {formatLKR(order.total, false)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              {/* Customer Details */}
              <div className="lg:col-span-5 space-y-1.5 text-xs text-zinc-300">
                <div className="font-bold text-white text-sm">
                  {order.customerName}
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Phone className="w-3.5 h-3.5 text-[#E2C275]" />
                  <span>{order.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>
                    {order.city}, {order.district}
                  </span>
                </div>
              </div>

              {/* Dispatch Controls */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <Truck className="w-3 h-3 text-[#38BDF8]" />
                    <span>Courier</span>
                  </label>
                  <select
                    value={order.courier}
                    onChange={(e) =>
                      updateOrderDispatch(order.id, {
                        courier: e.target.value as CourierProvider,
                      })
                    }
                    className="w-full bg-[#16161C] border border-white/15 focus:border-[#E2C275] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none cursor-pointer"
                  >
                    {COURIERS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Waybill Number
                  </label>
                  <input
                    type="text"
                    value={order.waybillNumber}
                    onChange={(e) =>
                      updateOrderDispatch(order.id, {
                        waybillNumber: e.target.value,
                      })
                    }
                    className="w-full bg-[#16161C] border border-white/15 focus:border-[#E2C275] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Order Status
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderDispatch(order.id, {
                        status: e.target.value as AdminOrderStatus,
                      })
                    }
                    className="w-full bg-[#16161C] border border-[#E2C275]/40 focus:border-[#E2C275] rounded-xl px-3 py-2 text-xs font-bold text-[#E2C275] focus:outline-none cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="text-white bg-[#16161C]">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
