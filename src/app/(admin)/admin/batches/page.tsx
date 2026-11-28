"use client";

import React, { useState, useMemo } from "react";
import { QrCode, Plus, Search, Copy, ShieldCheck, ShieldOff } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/context/ToastContext";

export default function AdminBatchesPage() {
  const { batches, products, generateBatch, toggleBatchStatus } = useAdmin();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    batchNumber: "AF-ON-2026-901",
    brand: "Optimum Nutrition",
    productName: products[0]?.name || "Gold Standard 100% Isolate (5 lbs)",
    lotNumber: "LOT# 901284-EXP28",
    expiryDate: "December 2028",
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return batches;
    const q = search.toLowerCase();
    return batches.filter(
      (b) =>
        b.batchNumber.toLowerCase().includes(q) ||
        b.productName.toLowerCase().includes(q) ||
        b.brand.toLowerCase().includes(q)
    );
  }, [batches, search]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.batchNumber.trim()) return;
    generateBatch(form);
    setShowForm(false);
    setForm((prev) => ({
      ...prev,
      batchNumber: `AF-ON-2026-${Math.floor(902 + Math.random() * 90)}`,
    }));
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast({
      type: "gold",
      title: "Copied to Clipboard",
      subtitle: `${code} ready to paste.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-[#111115] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search QR batch code, brand, or product..."
            className="w-full bg-[#16161C] border border-white/12 focus:border-[#38BDF8] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>GENERATE BATCH CODE</span>
        </button>
      </div>

      {/* Generate Batch Form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-[#111115] border border-[#38BDF8]/35 rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#38BDF8]">
            <QrCode className="w-4 h-4" />
            <span>Register New Holographic QR Batch</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                QR Batch Code
              </label>
              <input
                type="text"
                required
                value={form.batchNumber}
                onChange={(e) =>
                  setForm({ ...form, batchNumber: e.target.value })
                }
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#38BDF8] rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Brand</label>
              <input
                type="text"
                required
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#38BDF8] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                Linked Product
              </label>
              <input
                type="text"
                required
                value={form.productName}
                onChange={(e) =>
                  setForm({ ...form, productName: e.target.value })
                }
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#38BDF8] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                Expiry Date
              </label>
              <input
                type="text"
                required
                value={form.expiryDate}
                onChange={(e) =>
                  setForm({ ...form, expiryDate: e.target.value })
                }
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#38BDF8] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              data-no-glint
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold btn-aurafit-dark cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold cursor-pointer"
            >
              Create &amp; Seal Batch
            </button>
          </div>
        </form>
      )}

      {/* Batch Registry Table */}
      <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-white/10 text-zinc-400 uppercase text-[11px] tracking-wider">
              <th className="pb-3 pr-4">Batch Code</th>
              <th className="pb-3 pr-4">Product</th>
              <th className="pb-3 pr-4">Lot &amp; Expiry</th>
              <th className="pb-3 pr-4">Scans</th>
              <th className="pb-3 pr-4">COA Status</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {filtered.map((b) => (
              <tr key={b.batchNumber} className="hover:bg-white/[0.02]">
                <td className="py-3.5 pr-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#38BDF8]">
                      {b.batchNumber}
                    </span>
                    <button
                      type="button"
                      data-no-glint
                      onClick={() => handleCopy(b.batchNumber)}
                      aria-label={`Copy ${b.batchNumber}`}
                      className="p-1 rounded bg-[#16161C] border border-white/10 text-zinc-400 hover:text-[#E2C275] cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td className="py-3.5 pr-4">
                  <div className="text-[11px] font-bold text-[#E2C275]">
                    {b.brand}
                  </div>
                  <div className="text-white font-medium">{b.productName}</div>
                </td>
                <td className="py-3.5 pr-4 text-zinc-300 whitespace-nowrap">
                  <div className="font-mono text-xs">{b.lotNumber}</div>
                  <div className="text-xs text-zinc-400">Exp: {b.expiryDate}</div>
                </td>
                <td className="py-3.5 pr-4 font-mono font-bold text-white whitespace-nowrap">
                  {b.scanCount}
                </td>
                <td className="py-3.5 pr-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      b.status === "Verified"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
                        : "bg-red-500/15 text-red-300 border-red-400/30"
                    }`}
                  >
                    {b.status === "Verified" ? (
                      <ShieldCheck className="w-3 h-3" />
                    ) : (
                      <ShieldOff className="w-3 h-3" />
                    )}
                    <span>{b.status}</span>
                  </span>
                </td>
                <td className="py-3.5 text-right whitespace-nowrap">
                  <button
                    type="button"
                    data-no-glint
                    onClick={() => toggleBatchStatus(b.batchNumber)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold btn-aurafit-dark cursor-pointer"
                  >
                    {b.status === "Verified" ? "Revoke" : "Re-Verify"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
