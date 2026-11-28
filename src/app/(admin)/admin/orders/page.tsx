"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Truck,
  Phone,
  MapPin,
  Copy,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  Wand2,
  Printer,
  Check,
  Package,
  ArrowRight,
  QrCode,
} from "lucide-react";
import {
  useAdmin,
  AdminOrderStatus,
  CourierProvider,
} from "@/context/AdminContext";
import { useToast } from "@/context/ToastContext";
import { formatLKR } from "@/lib/pricing";
import StudioImage from "@/components/StudioImage";
import WaybillPrintModal from "@/components/admin/WaybillPrintModal";

const PROGRESS_STAGES: AdminOrderStatus[] = [
  "Order Placed",
  "Packed & QR Sealed",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

const ALL_STATUS_OPTIONS: AdminOrderStatus[] = [
  "Order Placed",
  "Packed & QR Sealed",
  "Handed to Courier",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const COURIERS: CourierProvider[] = [
  "Koombiyo Express",
  "PromptX Courier",
  "Domex",
  "Colombo Flagship Rider",
];

type FilterTab =
  | "NEW ORDERS"
  | "PACKING"
  | "IN TRANSIT"
  | "OUT FOR DELIVERY"
  | "DELIVERED"
  | "ALL ORDERS";

function getStageIndex(status: AdminOrderStatus): number {
  if (status === "Order Placed") return 0;
  if (status === "Packed & QR Sealed") return 1;
  if (status === "Handed to Courier" || status === "In Transit") return 2;
  if (status === "Out for Delivery") return 3;
  if (status === "Delivered") return 4;
  return -1;
}

function generateWaybillForCourier(courier: CourierProvider): string {
  const prefix =
    courier === "Koombiyo Express"
      ? "KMB"
      : courier === "Domex"
      ? "DMX"
      : courier === "Colombo Flagship Rider"
      ? "CFR"
      : "PX";
  const num = Math.floor(100000 + Math.random() * 899999);
  return `${prefix}-${num}-LK`;
}

function AdminOrdersCockpitContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  const { orders, products, updateOrderDispatch } = useAdmin();
  const { showToast } = useToast();

  const [tab, setTab] = useState<FilterTab>(() =>
    filterParam === "new" ? "NEW ORDERS" : "ALL ORDERS"
  );
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [packedChecks, setPackedChecks] = useState<Record<string, boolean>>({});
  const [showPrintModal, setShowPrintModal] = useState(false);

  const counts = useMemo(
    () => ({
      "NEW ORDERS": orders.filter((o) => o.status === "Order Placed").length,
      PACKING: orders.filter((o) => o.status === "Packed & QR Sealed").length,
      "IN TRANSIT": orders.filter(
        (o) => o.status === "In Transit" || o.status === "Handed to Courier"
      ).length,
      "OUT FOR DELIVERY": orders.filter((o) => o.status === "Out for Delivery")
        .length,
      DELIVERED: orders.filter((o) => o.status === "Delivered").length,
      "ALL ORDERS": orders.length,
    }),
    [orders]
  );

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (tab === "NEW ORDERS" && o.status !== "Order Placed") return false;
      if (tab === "PACKING" && o.status !== "Packed & QR Sealed") return false;
      if (
        tab === "IN TRANSIT" &&
        o.status !== "In Transit" &&
        o.status !== "Handed to Courier"
      )
        return false;
      if (tab === "OUT FOR DELIVERY" && o.status !== "Out for Delivery")
        return false;
      if (tab === "DELIVERED" && o.status !== "Delivered") return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q) ||
          o.district.toLowerCase().includes(q) ||
          (o.waybillNumber || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, tab, search]);

  const activeOrder = useMemo(() => {
    if (filtered.length === 0) return null;
    if (selectedOrderId) {
      const match = filtered.find((o) => o.id === selectedOrderId);
      if (match) return match;
    }
    return filtered[0];
  }, [filtered, selectedOrderId]);

  const handleCopy = (label: string, text: string) => {
    navigator.clipboard.writeText(text);
    showToast({
      type: "gold",
      title: "Copied to Clipboard",
      subtitle: `${label}: ${text}`,
    });
  };

  const handleAdvanceStep = () => {
    if (!activeOrder) return;
    if (activeOrder.status === "Order Placed") {
      updateOrderDispatch(activeOrder.id, { status: "Packed & QR Sealed" });
    } else if (activeOrder.status === "Packed & QR Sealed") {
      const wb =
        activeOrder.waybillNumber?.trim() ||
        generateWaybillForCourier(activeOrder.courier);
      updateOrderDispatch(activeOrder.id, {
        status: "In Transit",
        waybillNumber: wb,
      });
    } else if (
      activeOrder.status === "In Transit" ||
      activeOrder.status === "Handed to Courier"
    ) {
      updateOrderDispatch(activeOrder.id, { status: "Out for Delivery" });
    } else if (activeOrder.status === "Out for Delivery") {
      updateOrderDispatch(activeOrder.id, { status: "Delivered" });
    }
  };

  const getNextStepLabel = (status: AdminOrderStatus): string | null => {
    if (status === "Order Placed") return "1. ACCEPT & MARK PACKED →";
    if (status === "Packed & QR Sealed") return "2. DISPATCH TO COURIER →";
    if (status === "In Transit" || status === "Handed to Courier")
      return "3. MARK OUT FOR DELIVERY →";
    if (status === "Out for Delivery") return "4. CONFIRM DELIVERED ✓";
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Bar */}
      <div className="bg-[#111115] border border-white/10 rounded-2xl p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              "NEW ORDERS",
              "PACKING",
              "IN TRANSIT",
              "OUT FOR DELIVERY",
              "DELIVERED",
              "ALL ORDERS",
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

        <div className="relative max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, customer name, phone, city, or waybill..."
            className="w-full bg-[#16161C] border border-white/12 focus:border-[#E2C275] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Split Master-Detail Cockpit */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Scannable Order Queue */}
        <div className="xl:col-span-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-[#111115] border border-white/10 rounded-2xl p-10 text-center text-sm text-zinc-400">
              No orders match your current filter.
            </div>
          ) : (
            filtered.map((order) => {
              const isSelected = activeOrder?.id === order.id;
              const isCod = order.paymentMethod === "COD";
              const totalUnits = order.items.reduce(
                (s, it) => s + it.quantity,
                0
              );

              return (
                <button
                  key={order.id}
                  type="button"
                  data-no-glint
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`w-full text-left rounded-2xl p-4 border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? "border-[#E2C275] bg-[#16161C] shadow-[0_0_24px_rgba(226,194,117,0.14)]"
                      : "border-white/10 bg-[#111115] hover:border-white/25"
                  }`}
                >
                  {/* Row 1: Order ID + Status Pill + Date */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-sm font-bold text-white">
                        {order.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#38BDF8]/12 border border-[#38BDF8]/30 text-[10px] font-bold text-[#38BDF8] truncate">
                        {order.status}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                      {order.date}
                    </span>
                  </div>

                  {/* Row 2: Customer Name + District + Item Count */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-white truncate">
                        {order.customerName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#09090B] border border-white/10 text-[11px] text-zinc-300 shrink-0">
                        {order.district}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#1C1C24] border border-white/10 text-[11px] font-semibold text-zinc-300 shrink-0">
                      {totalUnits} {totalUnits === 1 ? "Item" : "Items"}
                    </span>
                  </div>

                  {/* Row 3: Payment Badge + Special Note Indicator */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/[0.06]">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                        isCod
                          ? "bg-amber-500/15 border border-amber-400/35 text-amber-300"
                          : order.paymentMethod === "KOKO 3x"
                          ? "bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8]"
                          : "bg-emerald-500/15 border border-emerald-400/30 text-emerald-300"
                      }`}
                    >
                      {isCod
                        ? `COD · Collect ${formatLKR(order.total, false)}`
                        : `PAID · ${order.paymentMethod} (${formatLKR(order.total, false)})`}
                    </span>

                    {order.notes && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E2C275]">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Note Attached</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column (7 cols): Interactive Order Fulfillment & Waybill Cockpit */}
        <div className="xl:col-span-7">
          {!activeOrder ? (
            <div className="bg-[#111115] border border-white/10 rounded-2xl p-12 text-center text-zinc-400 text-sm">
              Select an order from the queue to begin fulfillment.
            </div>
          ) : (
            <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 sm:p-7 space-y-6">
              {/* 1. Header & Guided Next-Step Action Bar */}
              <div className="space-y-4 pb-5 border-b border-white/[0.08]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl sm:text-2xl font-black font-mono text-white">
                        {activeOrder.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/35 text-xs font-bold text-[#38BDF8]">
                        {activeOrder.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Placed on {activeOrder.date} · {activeOrder.paymentMethod}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {getNextStepLabel(activeOrder.status) && (
                      <button
                        type="button"
                        onClick={handleAdvanceStep}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold cursor-pointer"
                      >
                        {getNextStepLabel(activeOrder.status)}
                      </button>
                    )}

                    <select
                      value={activeOrder.status}
                      onChange={(e) =>
                        updateOrderDispatch(activeOrder.id, {
                          status: e.target.value as AdminOrderStatus,
                        })
                      }
                      aria-label="Override order status"
                      className="bg-[#16161C] border border-white/15 focus:border-[#E2C275] rounded-xl px-3 py-2.5 text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
                    >
                      {ALL_STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Visual 5-Stage Progress Stepper */}
                <div className="grid grid-cols-5 gap-1.5 pt-2">
                  {PROGRESS_STAGES.map((stage, idx) => {
                    const currentIdx = getStageIndex(activeOrder.status);
                    const done = currentIdx >= idx;
                    return (
                      <div key={stage} className="space-y-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            done
                              ? "bg-gradient-to-r from-[#E2C275] to-[#C9A227]"
                              : "bg-white/10"
                          }`}
                        />
                        <div
                          className={`text-[10px] font-semibold leading-tight truncate ${
                            done ? "text-[#E2C275]" : "text-zinc-500"
                          }`}
                        >
                          {stage}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Customer & Delivery Location Card (2-Column Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Contact */}
                <div className="p-4 rounded-xl bg-[#16161C] border border-white/8 space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#E2C275]">
                    CUSTOMER CONTACT
                  </div>
                  <div className="text-sm font-bold text-white">
                    {activeOrder.customerName}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-200">
                    <Phone className="w-3.5 h-3.5 text-[#E2C275]" />
                    <span>{activeOrder.phone}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      data-no-glint
                      onClick={() => handleCopy("Phone", activeOrder.phone)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#09090B] border border-white/12 text-[11px] font-semibold text-zinc-200 hover:border-[#E2C275] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Phone</span>
                    </button>

                    <a
                      href={`https://wa.me/${activeOrder.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Hello ${activeOrder.customerName}, your AuraFit.lk order ${activeOrder.id} update:`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-[11px] font-bold text-emerald-300 inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp Customer</span>
                    </a>
                  </div>
                </div>

                {/* Delivery Destination */}
                <div className="p-4 rounded-xl bg-[#16161C] border border-white/8 space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#38BDF8]">
                    DELIVERY DESTINATION
                  </div>
                  <div className="text-xs text-zinc-200 leading-relaxed flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>
                      {activeOrder.address}, {activeOrder.city},{" "}
                      {activeOrder.district}
                      {activeOrder.postalCode ? ` (${activeOrder.postalCode})` : ""}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      data-no-glint
                      onClick={() =>
                        handleCopy(
                          "Address",
                          `${activeOrder.address}, ${activeOrder.city}, ${activeOrder.district}`
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-[#09090B] border border-white/12 text-[11px] font-semibold text-zinc-200 hover:border-[#E2C275] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Address</span>
                    </button>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${activeOrder.address}, ${activeOrder.city}, ${activeOrder.district}, Sri Lanka`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-[#09090B] border border-white/12 text-[11px] font-semibold text-[#38BDF8] hover:border-[#38BDF8] inline-flex items-center gap-1"
                    >
                      <span>Open in Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* 3. Special Customer Delivery Note Callout */}
              {activeOrder.notes ? (
                <div className="bg-[#E2C275]/10 border border-[#E2C275]/40 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#E2C275] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#E2C275]">
                      CUSTOMER DELIVERY NOTE
                    </div>
                    <p className="text-sm text-white font-medium mt-0.5">
                      {activeOrder.notes}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#16161C]/60 border border-white/6 rounded-xl px-4 py-3 text-xs text-zinc-500">
                  No special delivery instructions provided.
                </div>
              )}

              {/* 4. Itemized Packing List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                    <Package className="w-4 h-4 text-[#E2C275]" />
                    <span>ITEMIZED PACKING LIST</span>
                  </div>
                  <span className="text-xs text-zinc-400">
                    Tick off each tub before sealing box
                  </span>
                </div>

                <div className="rounded-xl bg-[#0B0B0F] border border-white/10 divide-y divide-white/[0.06]">
                  {activeOrder.items.map((item, idx) => {
                    const checkKey = `${activeOrder.id}-${idx}`;
                    const checked = Boolean(packedChecks[checkKey]);
                    const catalogMatch = products.find((p) =>
                      item.name
                        .toLowerCase()
                        .includes(p.name.split(" (")[0].toLowerCase())
                    );
                    const thumb =
                      catalogMatch?.image ||
                      "/images/products/gold-standard-isolate.png";
                    const batch = catalogMatch?.batchCode || "AF-QR-2026";

                    return (
                      <div
                        key={checkKey}
                        onClick={() =>
                          setPackedChecks((prev) => ({
                            ...prev,
                            [checkKey]: !prev[checkKey],
                          }))
                        }
                        className="p-3.5 flex items-center gap-3.5 hover:bg-white/[0.02] cursor-pointer select-none"
                      >
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            checked
                              ? "bg-[#E2C275] border-[#E2C275] text-[#09090B]"
                              : "border-white/25 bg-[#16161C]"
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="relative w-11 h-11 rounded-lg bg-[#16161C] border border-white/10 p-1 shrink-0 overflow-hidden">
                          <StudioImage
                            src={thumb}
                            alt={item.name}
                            fill
                            sizes="44px"
                            objectFit="contain"
                            fallbackLabel={item.name}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-sm font-semibold ${
                              checked
                                ? "line-through text-zinc-500"
                                : "text-white"
                            }`}
                          >
                            {item.name}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {item.flavor && (
                              <span className="px-2 py-0.5 rounded bg-[#16161C] border border-white/10 text-[11px] text-zinc-300">
                                {item.flavor}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#38BDF8]/10 border border-[#38BDF8]/25 text-[10px] font-mono text-[#38BDF8]">
                              <QrCode className="w-2.5 h-2.5" />
                              {batch}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded bg-[#E2C275]/15 text-[#E2C275] font-mono text-xs font-black">
                            × {item.quantity}
                          </span>
                          <div className="text-xs font-bold text-white">
                            {formatLKR(item.price * item.quantity, false)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Footer */}
                <div className="p-4 rounded-xl bg-[#16161C] border border-white/8 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4 text-zinc-300">
                    <span>
                      Courier: <strong className="text-emerald-400">FREE</strong>
                    </span>
                    <span>
                      Payment:{" "}
                      <strong
                        className={
                          activeOrder.paymentMethod === "COD"
                            ? "text-amber-300"
                            : "text-emerald-400"
                        }
                      >
                        {activeOrder.paymentMethod === "COD"
                          ? `COD — COLLECT ${formatLKR(activeOrder.total, false)}`
                          : `PREPAID (${activeOrder.paymentMethod})`}
                      </strong>
                    </span>
                  </div>
                  <div className="text-base font-extrabold text-white">
                    Total: {formatLKR(activeOrder.total, false)}
                  </div>
                </div>
              </div>

              {/* 5. Courier Assignment & Printable Waybill Label */}
              <div className="pt-4 border-t border-white/[0.08] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>Courier Provider</span>
                    </label>
                    <select
                      value={activeOrder.courier}
                      onChange={(e) =>
                        updateOrderDispatch(activeOrder.id, {
                          courier: e.target.value as CourierProvider,
                        })
                      }
                      className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none cursor-pointer"
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
                      Waybill Tracking Number
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={activeOrder.waybillNumber}
                        onChange={(e) =>
                          updateOrderDispatch(activeOrder.id, {
                            waybillNumber: e.target.value,
                          })
                        }
                        placeholder="e.g. KMB-884920-LK"
                        className="flex-1 min-w-0 bg-[#09090B] border border-white/15 focus:border-[#38BDF8] rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none uppercase"
                      />
                      <button
                        type="button"
                        data-no-glint
                        onClick={() =>
                          updateOrderDispatch(activeOrder.id, {
                            waybillNumber: generateWaybillForCourier(
                              activeOrder.courier
                            ),
                          })
                        }
                        className="px-3 py-2.5 rounded-xl text-xs font-bold btn-aurafit-dark inline-flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Wand2 className="w-3.5 h-3.5 text-[#E2C275]" />
                        <span>AUTO</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                  <a
                    href={`/track-order?id=${activeOrder.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-dark inline-flex items-center justify-center gap-2"
                  >
                    <span>Preview Customer Tracking</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setShowPrintModal(true)}
                    className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>PRINT WAYBILL / PACKING SLIP</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thermal / A6 Waybill Print Modal */}
      {showPrintModal && (
        <WaybillPrintModal
          order={activeOrder}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-zinc-500 uppercase tracking-widest">
          Loading Order Fulfillment Cockpit...
        </div>
      }
    >
      <AdminOrdersCockpitContent />
    </Suspense>
  );
}
