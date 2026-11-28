"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useAdmin, AdminProduct } from "@/context/AdminContext";
import { ProductCategory } from "@/data/mockProducts";
import { formatLKR, getKokoTotal, getKokoInstallment } from "@/lib/pricing";
import StudioImage from "@/components/StudioImage";
import ProductFormModal from "@/components/admin/ProductFormModal";

const CATEGORIES: ProductCategory[] = [
  "Whey Protein",
  "Mass Gainer",
  "Creatine",
  "Pre Workout",
  "BCAA",
  "Amino",
  "Fat Burner",
  "Multivitamins",
];

function AdminProductsContent() {
  const { products, saveProduct, toggleProductActive, deleteProduct } = useAdmin();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [modalKey, setModalKey] = useState(0);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (catFilter !== "ALL" && p.category !== catFilter) return false;
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
  }, [products, search, catFilter]);

  const openEditModal = (p: AdminProduct) => {
    setEditingProduct(p);
    setModalKey((k) => k + 1);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-[#09090B] border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search supplement name, brand, or batch..."
              className="w-full bg-[#16161C] border border-white/12 focus:border-[#E2C275] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            aria-label="Filter by category"
            className="bg-[#16161C] border border-white/12 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>ADD NEW SUPPLEMENT</span>
        </Link>
      </div>

      {/* Product Table */}
      <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-white/10 text-zinc-400 uppercase text-[11px] tracking-wider">
              <th className="pb-3 pr-4">Supplement</th>
              <th className="pb-3 pr-4">Category</th>
              <th className="pb-3 pr-4">Cash Price</th>
              <th className="pb-3 pr-4">KOKO 3x (+9%)</th>
              <th className="pb-3 pr-4">Stock</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02]">
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-lg bg-[#09090B] border border-white/10 p-1 shrink-0 overflow-hidden">
                      <StudioImage
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="44px"
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
                      {p.badge && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-[#E2C275]/15 text-[#E2C275] text-[9px] font-bold">
                          {p.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3.5 pr-4 text-zinc-300 whitespace-nowrap">
                  {p.category}
                </td>
                <td className="py-3.5 pr-4 font-bold text-white whitespace-nowrap">
                  {formatLKR(p.price, false)}
                </td>
                <td className="py-3.5 pr-4 text-zinc-300 whitespace-nowrap">
                  <div className="font-semibold text-[#A78BFA]">
                    3 × {formatLKR(getKokoInstallment(p.price), false)}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Total {formatLKR(getKokoTotal(p.price), false)}
                  </div>
                </td>
                <td className="py-3.5 pr-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold ${
                      p.stockCount <= (p.lowStockThreshold ?? 5)
                        ? "bg-red-500/15 text-red-300 border border-red-400/30"
                        : "bg-[#16161C] text-zinc-200 border border-white/10"
                    }`}
                  >
                    {p.stockCount} units
                  </span>
                </td>
                <td className="py-3.5 pr-4 whitespace-nowrap">
                  <button
                    type="button"
                    data-no-glint
                    onClick={() => toggleProductActive(p.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer border ${
                      p.active
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
                        : "bg-zinc-800 text-zinc-400 border-white/10"
                    }`}
                  >
                    {p.active ? "Active" : "Out of Stock"}
                  </button>
                </td>
                <td className="py-3.5 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      data-no-glint
                      onClick={() => openEditModal(p)}
                      aria-label={`Edit ${p.name}`}
                      className="p-2 rounded-lg bg-[#16161C] border border-white/10 text-zinc-300 hover:text-[#E2C275] hover:border-[#E2C275]/45 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      data-no-glint
                      onClick={() => deleteProduct(p.id)}
                      aria-label={`Delete ${p.name}`}
                      className="p-2 rounded-lg bg-[#16161C] border border-white/10 text-zinc-400 hover:text-red-400 hover:border-red-400/45 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rich Product Creation Studio Modal */}
      <ProductFormModal
        key={modalKey}
        isOpen={modalOpen}
        editingProduct={editingProduct}
        onClose={() => setModalOpen(false)}
        onSave={saveProduct}
      />
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-zinc-500 uppercase tracking-widest">
          Loading Products Studio...
        </div>
      }
    >
      <AdminProductsContent />
    </Suspense>
  );
}
