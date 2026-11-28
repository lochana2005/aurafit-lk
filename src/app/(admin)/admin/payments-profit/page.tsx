"use client";

import React, { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Percent,
  Search,
  X,
  CreditCard,
  Package,
  TicketPercent,
} from "lucide-react";
import { useAdmin, AdminOrder, AdminProduct } from "@/context/AdminContext";
import { formatLKR } from "@/lib/pricing";

type PaymentFilter =
  | "ALL PAYMENTS"
  | "CARD"
  | "KOKO 3X"
  | "BANK TRANSFER"
  | "COD";

interface EnrichedOrderFinancials {
  order: AdminOrder;
  channel: "Card" | "KOKO 3x" | "Bank Transfer" | "COD";
  paymentStatus: "PAID" | "COD PENDING" | "PARTIAL/REFUNDED";
  transactionRef: string;
  revenue: number;
  cogs: number;
  discount: number;
  cashback: number;
  netProfit: number;
  marginPercent: number;
  itemBreakdowns: {
    name: string;
    quantity: number;
    unitSell: number;
    unitCost: number;
    lineSell: number;
    lineCost: number;
    lineProfit: number;
  }[];
}

function estimateOrderCogs(
  order: AdminOrder,
  products: AdminProduct[]
): {
  cogs: number;
  itemBreakdowns: EnrichedOrderFinancials["itemBreakdowns"];
} {
  const breakdowns = order.items.map((item) => {
    const match = products.find((p) =>
      item.name.toLowerCase().includes(p.name.split(" (")[0].toLowerCase())
    );
    const unitCost =
      match?.costPrice ?? Math.round((item.price * 0.72) / 100) * 100;
    const lineSell = item.price * item.quantity;
    const lineCost = unitCost * item.quantity;
    return {
      name: item.name,
      quantity: item.quantity,
      unitSell: item.price,
      unitCost,
      lineSell,
      lineCost,
      lineProfit: lineSell - lineCost,
    };
  });

  const computedCogs = breakdowns.reduce((s, b) => s + b.lineCost, 0);
  return {
    cogs: order.costOfGoods ?? computedCogs,
    itemBreakdowns: breakdowns,
  };
}

export default function AdminPaymentsProfitPage() {
  const { orders, products } = useAdmin();
  const [channelFilter, setChannelFilter] =
    useState<PaymentFilter>("ALL PAYMENTS");
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const enrichedOrders = useMemo<EnrichedOrderFinancials[]>(() => {
    return orders
      .filter((o) => o.status !== "Cancelled")
      .map((order) => {
        const channel: EnrichedOrderFinancials["channel"] =
          order.paymentChannel || order.paymentMethod;
        const paymentStatus: EnrichedOrderFinancials["paymentStatus"] =
          order.paymentStatus ||
          (channel === "COD" && order.status !== "Delivered"
            ? "COD PENDING"
            : "PAID");
        const transactionRef =
          order.transactionRef ||
          (channel === "COD"
            ? `COD-${order.id}`
            : `TXN-${order.id.replace("AF-", "")}`);

        const { cogs, itemBreakdowns } = estimateOrderCogs(order, products);
        const revenue = order.total;
        const discount = order.discountAmount || 0;
        const cashback = order.cashbackAmount || 0;
        const netProfit = revenue - cogs - discount - cashback;
        const marginPercent =
          revenue > 0 ? Math.round((netProfit / revenue) * 1000) / 10 : 0;

        return {
          order,
          channel,
          paymentStatus,
          transactionRef,
          revenue,
          cogs,
          discount,
          cashback,
          netProfit,
          marginPercent,
          itemBreakdowns,
        };
      });
  }, [orders, products]);

  // Totals for Command Deck KPIs
  const totals = useMemo(() => {
    const grossRevenue = enrichedOrders.reduce((s, e) => s + e.revenue, 0);
    const totalCogs = enrichedOrders.reduce((s, e) => s + e.cogs, 0);
    const totalDiscountsCashbacks = enrichedOrders.reduce(
      (s, e) => s + e.discount + e.cashback,
      0
    );
    const netProfit = enrichedOrders.reduce((s, e) => s + e.netProfit, 0);
    const netMargin =
      grossRevenue > 0
        ? Math.round((netProfit / grossRevenue) * 1000) / 10
        : 0;

    const cardTotal = enrichedOrders
      .filter((e) => e.channel === "Card")
      .reduce((s, e) => s + e.revenue, 0);
    const kokoTotal = enrichedOrders
      .filter((e) => e.channel === "KOKO 3x")
      .reduce((s, e) => s + e.revenue, 0);
    const bankTotal = enrichedOrders
      .filter((e) => e.channel === "Bank Transfer")
      .reduce((s, e) => s + e.revenue, 0);
    const codCollected = enrichedOrders
      .filter((e) => e.channel === "COD" && e.paymentStatus === "PAID")
      .reduce((s, e) => s + e.revenue, 0);
    const codPending = enrichedOrders
      .filter((e) => e.channel === "COD" && e.paymentStatus === "COD PENDING")
      .reduce((s, e) => s + e.revenue, 0);

    return {
      grossRevenue,
      totalCogs,
      totalDiscountsCashbacks,
      netProfit,
      netMargin,
      cardTotal,
      kokoTotal,
      bankTotal,
      codCollected,
      codPending,
    };
  }, [enrichedOrders]);

  const filtered = useMemo(() => {
    return enrichedOrders.filter((e) => {
      if (channelFilter === "CARD" && e.channel !== "Card") return false;
      if (channelFilter === "KOKO 3X" && e.channel !== "KOKO 3x") return false;
      if (channelFilter === "BANK TRANSFER" && e.channel !== "Bank Transfer")
        return false;
      if (channelFilter === "COD" && e.channel !== "COD") return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          e.order.id.toLowerCase().includes(q) ||
          e.transactionRef.toLowerCase().includes(q) ||
          e.order.customerName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [enrichedOrders, channelFilter, search]);

  const selectedEntry = useMemo(
    () =>
      enrichedOrders.find((e) => e.order.id === selectedOrderId) || null,
    [enrichedOrders, selectedOrderId]
  );

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8 h-[calc(100vh-4rem)] flex flex-col overflow-hidden px-4 sm:px-6 py-4 gap-4 bg-[#09090B]">
      {/* Fixed Financial Command Deck */}
      <div className="shrink-0 rounded-xl border border-white/[0.08] bg-[#0e0e12] overflow-hidden">
        {/* Top Row — 4-Column Profit KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
          {/* 1. Gross Sales Revenue */}
          <div className="px-5 py-3.5 border-t-2 border-t-[#d4af37]/80 lg:border-t-0 lg:border-l-2 lg:border-l-[#d4af37]/80">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                GROSS SALES REVENUE
              </span>
              <DollarSign className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
              {formatLKR(totals.grossRevenue, false)}
            </div>
          </div>

          {/* 2. Product Cost / COGS */}
          <div className="px-5 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                PRODUCT COST / COGS
              </span>
              <Receipt className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-zinc-200 font-heading mt-1">
              {formatLKR(totals.totalCogs, false)}
            </div>
          </div>

          {/* 3. Discounts & Coach Cashbacks */}
          <div className="px-5 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                DISCOUNTS &amp; CASHBACKS
              </span>
              <Percent className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-heading mt-1">
              -{formatLKR(totals.totalDiscountsCashbacks, false)}
            </div>
          </div>

          {/* 4. Net Profit */}
          <div className="px-5 py-3.5 bg-emerald-950/15">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                NET PROFIT ({totals.netMargin}% MARGIN)
              </span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-heading mt-1">
              +{formatLKR(totals.netProfit, false)}
            </div>
          </div>
        </div>

        {/* Bottom Row — Payment Method Filter & Breakdown Bar */}
        <div className="px-4 py-3 bg-[#131318] border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                {
                  key: "ALL PAYMENTS",
                  label: `ALL PAYMENTS (${formatLKR(totals.grossRevenue, false)})`,
                },
                {
                  key: "CARD",
                  label: `CARD · ${formatLKR(totals.cardTotal, false)}`,
                },
                {
                  key: "KOKO 3X",
                  label: `KOKO 3X · ${formatLKR(totals.kokoTotal, false)}`,
                },
                {
                  key: "BANK TRANSFER",
                  label: `BANK TRANSFER · ${formatLKR(totals.bankTotal, false)}`,
                },
                {
                  key: "COD",
                  label: `COD · ${formatLKR(totals.codCollected, false)} / ${formatLKR(totals.codPending, false)} PEND`,
                },
              ] as { key: PaymentFilter; label: string }[]
            ).map((pill) => (
              <button
                key={pill.key}
                type="button"
                onClick={() => setChannelFilter(pill.key)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider cursor-pointer ${
                  channelFilter === pill.key
                    ? "btn-aurafit-gold"
                    : "btn-aurafit-dark"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Order ID, Ref, Customer..."
              className="w-full bg-[#09090B] border border-white/12 focus:border-[#d4af37] rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Framed Scrollable Payment & Profit Ledger Table */}
      <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-white/[0.08] bg-[#0e0e12] overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col overflow-x-auto">
          <div className="min-w-[1020px] flex-1 min-h-0 flex flex-col">
            {/* Pinned Header Row */}
            <div className="shrink-0 bg-[#131318] border-b border-white/[0.08] grid grid-cols-[minmax(140px,1.1fr)_minmax(150px,1.2fr)_minmax(160px,1.3fr)_minmax(115px,0.9fr)_minmax(115px,0.9fr)_minmax(115px,0.9fr)_minmax(120px,0.95fr)_minmax(130px,1fr)] items-center px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              <div>Order ID &amp; Date</div>
              <div>Customer</div>
              <div>Payment &amp; Ref</div>
              <div>Status</div>
              <div className="text-right">Revenue</div>
              <div className="text-right">Cost (COGS)</div>
              <div className="text-right">Disc. / CB</div>
              <div className="text-right">Net Profit</div>
            </div>

            {/* Independently Scrollable Body */}
            <div
              data-lenis-prevent
              className="flex-1 min-h-0 overflow-y-auto divide-y divide-white/[0.06] scrollbar-thin"
            >
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500 uppercase tracking-widest">
                  No payment records match your current filter.
                </div>
              ) : (
                filtered.map((entry) => {
                  const isPos = entry.netProfit >= 0;
                  const statusBadge =
                    entry.paymentStatus === "PAID"
                      ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-300"
                      : entry.paymentStatus === "COD PENDING"
                      ? "bg-amber-500/15 border-amber-500/35 text-amber-300"
                      : "bg-red-500/15 border-red-500/35 text-red-300";

                  return (
                    <div
                      key={entry.order.id}
                      onClick={() => setSelectedOrderId(entry.order.id)}
                      className="grid grid-cols-[minmax(140px,1.1fr)_minmax(150px,1.2fr)_minmax(160px,1.3fr)_minmax(115px,0.9fr)_minmax(115px,0.9fr)_minmax(115px,0.9fr)_minmax(120px,0.95fr)_minmax(130px,1fr)] items-center px-5 py-3.5 text-xs hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <div className="pr-3">
                        <div className="font-mono font-bold text-white">
                          {entry.order.id}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          {entry.order.date}
                        </div>
                      </div>

                      <div className="pr-3 min-w-0">
                        <div className="font-semibold text-white truncate">
                          {entry.order.customerName}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {entry.order.city}
                        </div>
                      </div>

                      <div className="pr-3 min-w-0">
                        <div className="font-bold text-[#d4af37]">
                          {entry.channel}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400 truncate">
                          {entry.transactionRef}
                        </div>
                      </div>

                      <div className="pr-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${statusBadge}`}
                        >
                          {entry.paymentStatus}
                        </span>
                      </div>

                      <div className="text-right font-mono font-bold text-white">
                        {formatLKR(entry.revenue, false)}
                      </div>

                      <div className="text-right font-mono text-zinc-400">
                        {formatLKR(entry.cogs, false)}
                      </div>

                      <div className="text-right font-mono text-amber-300">
                        -{formatLKR(entry.discount + entry.cashback, false)}
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg font-mono font-black border ${
                            isPos
                              ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-300"
                              : "bg-red-500/15 border-red-500/35 text-red-300"
                          }`}
                        >
                          {isPos ? "+" : "-"}
                          {formatLKR(Math.abs(entry.netProfit), false)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Profit Breakdown Slide-Over Drawer */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
          <div
            data-lenis-prevent
            className="w-full max-w-xl h-full bg-[#0E0E12]/95 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto space-y-5 shadow-2xl scrollbar-thin"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
                  Order Profit Breakdown
                </span>
                <h2 className="text-2xl font-black font-mono text-white mt-0.5">
                  {selectedEntry.order.id}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {selectedEntry.order.customerName} • {selectedEntry.order.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderId(null)}
                className="p-2 rounded-xl bg-[#16161C] border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Net Profit Highlight */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/30 via-[#131318] to-[#0e0e12] border border-emerald-500/35 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 block">
                  Net Order Profit ({selectedEntry.marginPercent}% Margin)
                </span>
                <p className="text-2xl font-black font-mono text-emerald-400 mt-1">
                  +{formatLKR(selectedEntry.netProfit, false)}
                </p>
              </div>
              <div className="text-right text-xs font-mono text-zinc-300 space-y-1">
                <div>Rev: {formatLKR(selectedEntry.revenue, false)}</div>
                <div>COGS: -{formatLKR(selectedEntry.cogs, false)}</div>
              </div>
            </div>

            {/* Payment Gateway / COD Details */}
            <div className="p-4 rounded-xl bg-[#131318] border border-white/[0.08] space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[#d4af37]">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payment Channel &amp; Reference</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">
                    Channel
                  </span>
                  <span className="font-bold text-white">
                    {selectedEntry.channel}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">
                    Status
                  </span>
                  <span className="font-bold text-emerald-300">
                    {selectedEntry.paymentStatus}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">
                    Ref ID
                  </span>
                  <span className="font-mono text-zinc-300">
                    {selectedEntry.transactionRef}
                  </span>
                </div>
              </div>
            </div>

            {/* Item-by-Item Cost vs Selling Price */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Item-by-Item Cost vs. Selling Price</span>
              </h3>
              <div className="space-y-2">
                {selectedEntry.itemBreakdowns.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#131318] border border-white/[0.08] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">
                        {item.name} × {item.quantity}
                      </p>
                      <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                        Cost: {formatLKR(item.lineCost, false)} • Sell:{" "}
                        {formatLKR(item.lineSell, false)}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 shrink-0">
                      +{formatLKR(item.lineProfit, false)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo & Cashback Deduction */}
            {(selectedEntry.discount > 0 || selectedEntry.cashback > 0) && (
              <div className="p-4 rounded-xl bg-[#131318] border border-amber-500/25 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-300">
                  <TicketPercent className="w-3.5 h-3.5" />
                  <span>
                    Promo &amp; Coach Cashback Deduction (
                    {selectedEntry.order.promoCode || "PROMO"})
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Customer Discount</span>
                  <span className="font-mono text-amber-300">
                    -{formatLKR(selectedEntry.discount, false)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Coach Cashback Commission</span>
                  <span className="font-mono text-amber-300">
                    -{formatLKR(selectedEntry.cashback, false)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
