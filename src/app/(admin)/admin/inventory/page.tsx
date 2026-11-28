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

export default function AdminInventoryPage() {
  const { products, adjustStock } = useAdmin();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<
    "All Products" | "Healthy Stock" | "Low Stock" | "Out of Stock"
  >("All Products");

  const [restockTarget, setRestockTarget] = useState<AdminProduct | null>(null);
  const [customQty, setCustomQty] = useState(20);
  const [customNote, setCustomNote] = useState("New Colombo Air-Freight Shipment");

  const totalRetailValue = products.reduce(
    (sum, p) => sum + p.price * p.stockCount,
    0
  );
  const totalUnits = products.reduce((sum, p) => sum + p.stockCount, 0);
  const lowStockCount = products.filter(
    (p) => p.stockCount > 0 && p.stockCount <= (p.lowStockThreshold ?? 5)
  ).length;
  const outOfStockCount = products.filter((p) => p.stockCount === 0).length;

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
    adjustStock(restockTarget.id, customQty, customNote.trim() || "Manual restock");
    setRestockTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* 4 Inventory KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              TOTAL RETAIL STOCK VALUE
            </span>
            <DollarSign className="w-4 h-4 text-[#E2C275]" />
          </div>
          <div className="text-2xl font-black text-white font-heading">
            {formatLKR(totalRetailValue, false)}
          </div>
        </div>

        <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              TOTAL UNITS IN WAREHOUSE
            </span>
            <Boxes className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-black text-white font-heading">
            {totalUnits.toLocaleString()} Units
          </div>
        </div>

        <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              LOW-STOCK SKUS (≤ 5)
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-heading">
            {lowStockCount}
          </div>
        </div>

        <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              OUT-OF-STOCK SKUS (0)
            </span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 font-heading">
            {outOfStockCount}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-[#09090B] border-b border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(
            ["All Products", "Healthy Stock", "Low Stock", "Out of Stock"] as const
          ).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer ${
                tab === t ? "btn-aurafit-gold" : "btn-aurafit-dark"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, brand, or batch..."
            className="w-full bg-[#16161C] border border-white/12 focus:border-[#E2C275] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Live Stock Management Table */}
      <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-white/10 text-zinc-400 uppercase text-[11px] tracking-wider">
              <th className="pb-3 pr-4">Supplement</th>
              <th className="pb-3 pr-4">Batch Code</th>
              <th className="pb-3 pr-4">Unit Price</th>
              <th className="pb-3 pr-4">Current Stock</th>
              <th className="pb-3 text-right">Quick Inline Stock Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {filtered.map((p) => {
              const thresh = p.lowStockThreshold ?? 5;
              const stockBadge =
                p.stockCount === 0
                  ? "bg-red-500/15 text-red-300 border-red-400/30"
                  : p.stockCount <= thresh
                  ? "bg-amber-500/15 text-amber-300 border-amber-400/30"
                  : "bg-emerald-500/15 text-emerald-300 border-emerald-400/30";

              return (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
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
                        <div className="font-semibold text-white truncate max-w-[240px]">
                          {p.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 pr-4 font-mono text-xs text-[#38BDF8] whitespace-nowrap">
                    {p.batchCode || "—"}
                  </td>

                  <td className="py-3.5 pr-4 font-semibold text-white whitespace-nowrap">
                    {formatLKR(p.price, false)}
                  </td>

                  <td className="py-3.5 pr-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full border text-xs font-mono font-bold ${stockBadge}`}
                    >
                      {p.stockCount} units
                    </span>
                  </td>

                  <td className="py-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        data-no-glint
                        onClick={() => adjustStock(p.id, -1, "Quick decrement (-1)")}
                        aria-label={`Decrease stock for ${p.name}`}
                        className="p-1.5 rounded-lg bg-[#16161C] border border-white/12 text-zinc-300 hover:text-white cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        data-no-glint
                        onClick={() => adjustStock(p.id, 1, "Quick increment (+1)")}
                        aria-label={`Increase stock for ${p.name}`}
                        className="p-1.5 rounded-lg bg-[#16161C] border border-white/12 text-zinc-300 hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        data-no-glint
                        onClick={() => adjustStock(p.id, 10, "Quick restock (+10)")}
                        className="px-2.5 py-1.5 rounded-lg bg-[#16161C] border border-white/12 text-xs font-mono font-bold text-zinc-200 hover:border-[#E2C275]/50 hover:text-[#E2C275] cursor-pointer"
                      >
                        +10
                      </button>
                      <button
                        type="button"
                        data-no-glint
                        onClick={() => adjustStock(p.id, 25, "Bulk restock (+25)")}
                        className="px-2.5 py-1.5 rounded-lg bg-[#16161C] border border-white/12 text-xs font-mono font-bold text-zinc-200 hover:border-[#E2C275]/50 hover:text-[#E2C275] cursor-pointer"
                      >
                        +25
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRestockTarget(p);
                          setCustomQty(20);
                        }}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider btn-aurafit-gold cursor-pointer"
                      >
                        RESTOCK
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Quantity to Add (Current: {restockTarget.stockCount})
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
                            {h.delta >= 0 ? `+${h.delta}` : h.delta} · {h.timestamp}
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
