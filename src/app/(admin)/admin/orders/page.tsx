"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Truck,
  Phone,
  MapPin,
  X,
  Wand2,
  Check,
  Package,
  MessageCircle,
} from "lucide-react";
import {
  useAdmin,
  AdminOrder,
  AdminOrderStatus,
  CourierProvider,
} from "@/context/AdminContext";
import { formatLKR } from "@/lib/pricing";

const DELIVERY_STAGES: AdminOrderStatus[] = [
  "Order Placed",
  "Packed & QR Sealed",
  "Handed to Courier",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

const COURIERS: CourierProvider[] = [
  "Koombiyo Express",
  "PromptX Courier",
  "Domex",
  "Colombo Flagship Rider",
];

type FilterTab =
  | "All Orders"
  | "New Orders"
  | "Packed & QR Sealed"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered";

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  const { orders, updateOrderDispatch } = useAdmin();
  const [tab, setTab] = useState<FilterTab>(() =>
    filterParam === "new" ? "New Orders" : "All Orders"
  );

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [draftCourier, setDraftCourier] =
    useState<CourierProvider>("PromptX Courier");
  const [draftWaybill, setDraftWaybill] = useState("");
  const [draftStatus, setDraftStatus] =
    useState<AdminOrderStatus>("Order Placed");
  const [draftEta, setDraftEta] = useState("");
  const [draftRiderNotes, setDraftRiderNotes] = useState("");

  const counts = useMemo(
    () => ({
      "New Orders": orders.filter((o) => o.status === "Order Placed").length,
      "Packed & QR Sealed": orders.filter(
        (o) => o.status === "Packed & QR Sealed"
      ).length,
      "In Transit": orders.filter(
        (o) => o.status === "In Transit" || o.status === "Handed to Courier"
      ).length,
      "Out for Delivery": orders.filter((o) => o.status === "Out for Delivery")
        .length,
      Delivered: orders.filter((o) => o.status === "Delivered").length,
      "All Orders": orders.length,
    }),
    [orders]
  );

  const filtered = useMemo(() => {
    if (tab === "All Orders") return orders;
    if (tab === "New Orders")
      return orders.filter((o) => o.status === "Order Placed");
    if (tab === "In Transit")
      return orders.filter(
        (o) => o.status === "In Transit" || o.status === "Handed to Courier"
      );
    return orders.filter((o) => o.status === tab);
  }, [orders, tab]);

  const openManageDrawer = (order: AdminOrder) => {
    setSelectedOrder(order);
    setDraftCourier(order.courier);
    setDraftWaybill(order.waybillNumber);
    setDraftStatus(order.status);
    setDraftEta(order.estimatedArrival);
    setDraftRiderNotes(order.riderNotes || "");
  };

  const handleAutoGenerateWaybill = () => {
    const prefix =
      draftCourier === "Koombiyo Express"
        ? "KMB"
        : draftCourier === "Domex"
        ? "DMX"
        : draftCourier === "Colombo Flagship Rider"
        ? "CFR"
        : "PX";
    const num = Math.floor(100000 + Math.random() * 899999);
    setDraftWaybill(`${prefix}-${num}-LK`);
  };

  const handleSaveDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    updateOrderDispatch(selectedOrder.id, {
      courier: draftCourier,
      waybillNumber: draftWaybill.trim(),
      status: draftStatus,
      estimatedArrival: draftEta.trim() || "Within 24–48 Hours",
      riderNotes: draftRiderNotes.trim(),
    });
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Status Filter Tabs with Live Counts */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            "New Orders",
            "Packed & QR Sealed",
            "In Transit",
            "Out for Delivery",
            "Delivered",
            "All Orders",
          ] as FilterTab[]
        ).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer ${
              tab === t ? "btn-aurafit-gold" : "btn-aurafit-dark"
            }`}
          >
            <span>{t}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full font-mono text-[10px] ${
                tab === t
                  ? "bg-[#09090B] text-white"
                  : "bg-[#09090B]/70 text-[#E2C275]"
              }`}
            >
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="bg-[#111115] border border-white/10 rounded-2xl p-12 text-center text-sm text-zinc-400">
          No orders in &ldquo;{tab}&rdquo;.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="bg-[#111115] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-base font-mono font-bold text-white">
                      {order.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#16161C] border border-white/10 text-[11px] font-semibold text-[#E2C275]">
                      {order.paymentMethod}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#38BDF8]/12 border border-[#38BDF8]/30 text-[11px] font-bold text-[#38BDF8]">
                      {order.status}
                    </span>
                    <span className="text-xs text-zinc-400">{order.date}</span>
                  </div>
                  <div className="text-sm text-zinc-200 font-medium">
                    {order.itemsSummary}
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-4">
                  <div className="text-left lg:text-right">
                    <div className="text-xs text-zinc-400">Order Total</div>
                    <div className="text-xl font-extrabold text-white">
                      {formatLKR(order.total, false)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openManageDrawer(order)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Manage Delivery</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-300">
                <span className="font-bold text-white">{order.customerName}</span>
                <span className="inline-flex items-center gap-1.5 text-zinc-400">
                  <Phone className="w-3.5 h-3.5 text-[#E2C275]" />
                  <span>{order.phone}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>
                    {order.address ? `${order.address}, ` : ""}
                    {order.city}, {order.district}
                  </span>
                </span>
                <span className="ml-auto font-mono text-xs text-zinc-300">
                  {order.courier} ·{" "}
                  <strong className="text-[#E2C275]">
                    {order.waybillNumber || "No Waybill"}
                  </strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-Over Delivery & Courier Management Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-black/80 cursor-pointer"
          />
          <div
            data-lenis-prevent
            className="relative z-10 w-full max-w-lg bg-[#111115] border-l border-white/10 h-full overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-6 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#38BDF8]">
                  COURIER DISPATCH CENTER
                </span>
                <h3 className="text-xl font-bold font-mono text-white">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                type="button"
                data-no-glint
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl bg-[#16161C] border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details & Click-to-WhatsApp */}
            <div className="p-4 rounded-2xl bg-[#16161C] border border-white/10 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">
                  {selectedOrder.customerName}
                </span>
                <a
                  href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-bold hover:brightness-110"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
              <div className="text-zinc-300">
                {selectedOrder.address}, {selectedOrder.city},{" "}
                {selectedOrder.district}
              </div>
              {selectedOrder.notes && (
                <div className="text-[#E2C275] italic">
                  Customer Note: &ldquo;{selectedOrder.notes}&rdquo;
                </div>
              )}
            </div>

            {/* Itemized Supplements */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#E2C275]" />
                <span>Itemized Supplements</span>
              </div>
              <div className="space-y-1.5">
                {selectedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#09090B] border border-white/8 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">
                        {it.name} × {it.quantity}
                      </div>
                      {it.flavor && (
                        <div className="text-[11px] text-zinc-400">{it.flavor}</div>
                      )}
                    </div>
                    <span className="font-mono font-bold text-zinc-200">
                      {formatLKR(it.price * it.quantity, false)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispatch Form */}
            <form onSubmit={handleSaveDispatch} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Courier Assignment
                </label>
                <select
                  value={draftCourier}
                  onChange={(e) =>
                    setDraftCourier(e.target.value as CourierProvider)
                  }
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                >
                  {COURIERS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Waybill Tracking Number
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={draftWaybill}
                    onChange={(e) => setDraftWaybill(e.target.value)}
                    placeholder="e.g. KMB-884920-LK"
                    className="flex-1 bg-[#09090B] border border-white/15 focus:border-[#38BDF8] rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none uppercase"
                  />
                  <button
                    type="button"
                    data-no-glint
                    onClick={handleAutoGenerateWaybill}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold btn-aurafit-dark inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-[#E2C275]" />
                    <span>AUTO-GENERATE</span>
                  </button>
                </div>
              </div>

              {/* Delivery Stage Stepper */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">
                  Delivery Stage Stepper
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DELIVERY_STAGES.map((stage) => {
                    const active = draftStatus === stage;
                    return (
                      <button
                        key={stage}
                        type="button"
                        data-no-glint
                        onClick={() => setDraftStatus(stage)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-colors cursor-pointer ${
                          active
                            ? "bg-[#E2C275]/15 border-[#E2C275] text-[#E2C275]"
                            : "bg-[#09090B] border-white/10 text-zinc-300 hover:border-white/25"
                        }`}
                      >
                        {stage}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Estimated Arrival
                </label>
                <input
                  type="text"
                  value={draftEta}
                  onChange={(e) => setDraftEta(e.target.value)}
                  placeholder="Tomorrow, 2:00 PM – 5:00 PM"
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Courier Rider Notes
                </label>
                <textarea
                  rows={2}
                  value={draftRiderNotes}
                  onChange={(e) => setDraftRiderNotes(e.target.value)}
                  placeholder="Instructions for courier rider..."
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider btn-aurafit-gold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Save &amp; Sync Live Tracking</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-zinc-500 uppercase tracking-widest">
          Loading Dispatch Center...
        </div>
      }
    >
      <AdminOrdersContent />
    </Suspense>
  );
}
