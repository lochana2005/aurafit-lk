"use client";

import React, { useState, useMemo } from "react";
import {
  Boxes,
  DollarSign,
  AlertTriangle,
  XCircle,
  Search,
  Plus,
  Minus,
  X,
  History,
} from "lucide-react";
import { useAdmin, AdminProduct } from "@/context/AdminContext";
import { formatLKR } from "@/lib/pricing";
import StudioImage from "@/components/StudioImage";

type InventoryTab =
  | "All Products"
  | "Healthy Stock"
  | "Low Stock"
  | "Out of Stock";

export default function AdminInventoryPage() {
  const { products, adjustStock } = useAdmin();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<InventoryTab>("All Products");

  const [restockTarget, setRestockTarget] = useState<AdminProduct | null>(null);
  const [customQty, setCustomQty] = useState(20);
  const [batchUnitCost, setBatchUnitCost] = useState(0);
  const [customNote, setCustomNote] = useState(
    "New Colombo Air-Freight Shipment"
  );

  const totalRetailValue = products.reduce(
    (sum, p) => sum + p.price * p.stockCount,
    0
  );
  const totalInventoryCost = products.reduce(
    (sum, p) => sum + (p.costPrice || 0) * p.stockCount,
    0
  );
  const estimatedStockProfit = totalRetailValue - totalInventoryCost;
  const totalUnits = products.reduce((sum, p) => sum + p.stockCount, 0);
  const healthyStockCount = products.filter(
    (p) => p.stockCount > (p.lowStockThreshold ?? 5)
  ).length;
  const lowStockCount = products.filter(
    (p) => p.stockCount > 0 && p.stockCount <= (p.lowStockThreshold ?? 5)
  ).length;
  const outOfStockCount = products.filter((p) => p.stockCount === 0).length;

  const tabCounts: Record<InventoryTab, number> = {
    "All Products": products.length,
    "Healthy Stock": healthyStockCount,
    "Low Stock": lowStockCount,
    "Out of Stock": outOfStockCount,
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const thresh = p.lowStockThreshold ?? 5;
      if (tab === "Healthy Stock" && p.stockCount <= thresh) return false;
      if (tab === "Low Stock" && (p.stockCount === 0 || p.stockCount > thresh))
        return false;
      if (tab === "Out of Stock" && p.stockCount > 0) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.batchCode || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, tab, search]);

  const handleCustomRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockTarget || customQty <= 0) return;
    const totalBatchCost = customQty * (batchUnitCost || 0);
    const noteWithCost = `${customNote.trim() || "Manual restock"} (Batch Cost: ${formatLKR(totalBatchCost, false)})`;
    adjustStock(restockTarget.id, customQty, noteWithCost, batchUnitCost);
    setRestockTarget(null);
  };

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8 h-[calc(100vh-4rem)] flex flex-col overflow-hidden px-4 sm:px-6 py-4 gap-4 bg-[#09090B]">
      {/* Fixed Sleek Inventory Command Deck */}
      <div className="shrink-0 rounded-xl border border-white/[0.08] bg-[#0e0e12] overflow-hidden">
        {/* Top Row — Compact 4-Column KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
          {/* 1. Total Retail Stock Value + Cost & Est. Profit */}
          <div className="px-5 py-3.5 relative border-t-2 border-t-[#d4af37]/80 lg:border-t-0 lg:border-l-2 lg:border-l-[#d4af37]/80">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                TOTAL RETAIL STOCK VALUE
              </span>
              <DollarSign className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
              {formatLKR(totalRetailValue, false)}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[10px] font-mono">
              <span className="text-zinc-400">
                Cost: {formatLKR(totalInventoryCost, false)}
              </span>
              <span className="text-emerald-400 font-bold">
                Est. Profit: +{formatLKR(estimatedStockProfit, false)}
              </span>
            </div>
          </div>

          {/* 2. Total Units in Warehouse */}
          <div className="px-5 py-3.5 relative border-t-2 border-t-[#38BDF8]/80 lg:border-t-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                TOTAL UNITS IN WAREHOUSE
              </span>
              <Boxes className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
              {totalUnits.toLocaleString()} Units
            </div>
          </div>

          {/* 3. Low-Stock SKUs (Clickable) */}
          <button
            type="button"
            onClick={() => setTab("Low Stock")}
            className={`px-5 py-3.5 text-left transition-colors cursor-pointer ${
              tab === "Low Stock"
                ? "bg-amber-500/[0.08]"
                : "hover:bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                LOW-STOCK SKUS (≤ 5)
              </span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-heading mt-1">
              {lowStockCount}
            </div>
          </button>

          {/* 4. Out-of-Stock SKUs (Clickable) */}
          <button
            type="button"
            onClick={() => setTab("Out of Stock")}
            className={`px-5 py-3.5 text-left transition-colors cursor-pointer ${
              tab === "Out of Stock"
                ? "bg-red-500/[0.08]"
                : "hover:bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                OUT-OF-STOCK SKUS
              </span>
              <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-red-400 font-heading mt-1">
              {outOfStockCount}
            </div>
          </button>
        </div>

        {/* Bottom Row — Integrated Filter & Search Bar */}
        <div className="px-4 py-3 bg-[#131318] border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                "All Products",
                "Healthy Stock",
                "Low Stock",
                "Out of Stock",
              ] as InventoryTab[]
            ).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer ${
                  tab === t ? "btn-aurafit-gold" : "btn-aurafit-dark"
                }`}
              >
                <span>{t}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full font-mono text-[10px] leading-none ${
                    tab === t
                      ? "bg-[#09090B] text-white"
                      : "bg-[#09090B]/70 text-[#E2C275]"
                  }`}
                >
                  {tabCounts[t]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, brand, or batch..."
              className="w-full bg-[#09090B] border border-white/12 focus:border-[#E2C275] rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Framed Scrollable Inventory Table */}
      <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-white/[0.08] bg-[#0e0e12] overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col overflow-x-auto">
          <div className="min-w-[980px] flex-1 min-h-0 flex flex-col">
            {/* Pinned Table Column Header Row */}
            <div className="shrink-0 bg-[#131318] border-b border-white/[0.08] grid grid-cols-[minmax(220px,1.8fr)_minmax(115px,0.9fr)_minmax(100px,0.8fr)_minmax(115px,0.9fr)_minmax(105px,0.8fr)_minmax(105px,0.8fr)_minmax(230px,1.4fr)] items-center px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              <div>Supplement</div>
              <div>Batch Code</div>
              <div>Cost Price</div>
              <div>Selling Price</div>
              <div>Unit Profit</div>
              <div>Current Stock</div>
              <div className="text-right">Quick Inline Stock Controls</div>
            </div>

            {/* Independently Scrollable Table Body Rows */}
            <div
              data-lenis-prevent
              className="flex-1 min-h-0 overflow-y-auto divide-y divide-white/[0.06] scrollbar-thin"
            >
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500 uppercase tracking-widest">
                  No inventory SKUs match your filter.
                </div>
              ) : (
                filtered.map((p) => {
                  const thresh = p.lowStockThreshold ?? 5;
                  const stockBadge =
                    p.stockCount === 0
                      ? "bg-red-500/15 text-red-300 border-red-400/30"
                      : p.stockCount <= thresh
                      ? "bg-amber-500/15 text-amber-300 border-amber-400/30"
                      : "bg-emerald-500/15 text-emerald-300 border-emerald-400/30";

                  const unitProfit = p.price - (p.costPrice || 0);
                  const isProfitPos = unitProfit >= 0;

                  return (
                    <div
                      key={p.id}
                      className="grid grid-cols-[minmax(220px,1.8fr)_minmax(115px,0.9fr)_minmax(100px,0.8fr)_minmax(115px,0.9fr)_minmax(105px,0.8fr)_minmax(105px,0.8fr)_minmax(230px,1.4fr)] items-center px-5 py-3 text-xs sm:text-sm hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3 pr-4 min-w-0">
                        <div className="relative w-10 h-10 rounded-lg bg-[#09090B] border border-white/10 p-1 shrink-0 overflow-hidden">
                          <StudioImage
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="40px"
                            objectFit="contain"
                            fallbackLabel={p.name}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold uppercase text-[#E2C275]">
                            {p.brand}
                          </div>
                          <div className="font-semibold text-white truncate">
                            {p.name}
                          </div>
                        </div>
                      </div>

                      <div className="font-mono text-xs text-[#38BDF8] whitespace-nowrap pr-4">
                        {p.batchCode || "—"}
                      </div>

                      <div className="font-mono text-xs text-zinc-400 whitespace-nowrap pr-4">
                        {formatLKR(p.costPrice || 0, false)}
                      </div>

                      <div className="whitespace-nowrap pr-4">
                        <div className="font-semibold text-white font-mono">
                          {formatLKR(p.price, false)}
                        </div>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <div className="text-[10px] font-mono text-zinc-500 line-through">
                            {formatLKR(p.originalPrice, false)}
                          </div>
                        )}
                      </div>

                      <div className="whitespace-nowrap pr-4">
                        <span
                          className={`px-2 py-0.5 rounded-lg font-mono text-xs font-bold border ${
                            isProfitPos
                              ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-300"
                              : "bg-red-500/15 border-red-500/35 text-red-300"
                          }`}
                        >
                          {isProfitPos ? "+" : "-"}
                          {formatLKR(Math.abs(unitProfit), false)}
                        </span>
                      </div>

                      <div className="whitespace-nowrap pr-4">
                        <span
                          className={`px-2.5 py-1 rounded-full border text-xs font-mono font-bold ${stockBadge}`}
                        >
                          {p.stockCount} units
                        </span>
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            data-no-glint
                            onClick={() =>
                              adjustStock(p.id, -1, "Quick decrement (-1)")
                            }
                            aria-label={`Decrease stock for ${p.name}`}
                            className="p-1.5 rounded-lg bg-[#16161C] border border-white/12 text-zinc-300 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            data-no-glint
                            onClick={() =>
                              adjustStock(p.id, 1, "Quick increment (+1)")
                            }
                            aria-label={`Increase stock for ${p.name}`}
                            className="p-1.5 rounded-lg bg-[#16161C] border border-white/12 text-zinc-300 hover:text-white cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            data-no-glint
                            onClick={() =>
                              adjustStock(p.id, 10, "Quick restock (+10)")
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-[#16161C] border border-white/12 text-xs font-mono font-bold text-zinc-200 hover:border-[#E2C275]/50 hover:text-[#E2C275] cursor-pointer"
                          >
                            +10
                          </button>
                          <button
                            type="button"
                            data-no-glint
                            onClick={() =>
                              adjustStock(p.id, 25, "Bulk restock (+25)")
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-[#16161C] border border-white/12 text-xs font-mono font-bold text-zinc-200 hover:border-[#E2C275]/50 hover:text-[#E2C275] cursor-pointer"
                          >
                            +25
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRestockTarget(p);
                              setCustomQty(20);
                              setBatchUnitCost(p.costPrice || 0);
                            }}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider btn-aurafit-gold cursor-pointer"
                          >
                            RESTOCK
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Restock Modal */}
      {restockTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setRestockTarget(null)}
            className="fixed inset-0 bg-black/80 cursor-pointer"
          />
          <div className="relative z-10 w-full max-w-md bg-[#111115] border border-[#E2C275]/35 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E2C275]">
                  WAREHOUSE STOCK-IN
                </span>
                <h3 className="text-lg font-bold text-white font-heading uppercase">
                  {restockTarget.name}
                </h3>
              </div>
              <button
                type="button"
                data-no-glint
                onClick={() => setRestockTarget(null)}
                className="p-1.5 rounded-lg bg-[#16161C] border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCustomRestock} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">
                    Quantity to Add
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={customQty}
                    onChange={(e) => setCustomQty(Number(e.target.value))}
                    className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">
                    Purchase Cost / Unit (LKR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={batchUnitCost}
                    onChange={(e) => setBatchUnitCost(Number(e.target.value))}
                    className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#09090B] border border-[#E2C275]/25 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Total Batch Purchase Cost</span>
                <span className="font-mono font-black text-[#E2C275]">
                  {formatLKR(Math.max(0, customQty) * Math.max(0, batchUnitCost), false)}
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Shipment / Audit Note
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              {restockTarget.restockHistory &&
                restockTarget.restockHistory.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/[0.08]">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      <History className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>Recent Stock-In History</span>
                    </div>
                    <div className="max-h-28 overflow-y-auto space-y-1.5 text-xs">
                      {restockTarget.restockHistory.slice(0, 4).map((h) => (
                        <div
                          key={h.id}
                          className="flex items-center justify-between text-zinc-300 bg-[#09090B] px-2.5 py-1.5 rounded-lg"
                        >
                          <span className="truncate pr-2">{h.note}</span>
                          <span className="font-mono text-[#E2C275] shrink-0">
                            {h.delta >= 0 ? `+${h.delta}` : h.delta} ·{" "}
                            {h.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold cursor-pointer"
              >
                Confirm Stock-In (+{customQty})
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
