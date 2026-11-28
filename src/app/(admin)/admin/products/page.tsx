"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, X, Check } from "lucide-react";
import { useAdmin, AdminProduct } from "@/context/AdminContext";
import { ProductCategory, FitnessGoal } from "@/data/mockProducts";
import { formatLKR, getKokoTotal, getKokoInstallment } from "@/lib/pricing";
import StudioImage from "@/components/StudioImage";

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

const GOALS: FitnessGoal[] = [
  "Muscle Gain",
  "Lean Cutting",
  "Strength & Power",
  "Recovery",
];

const BADGES = [
  "",
  "BEST SELLER",
  "TOP RATED",
  "VERIFIED ORIGINAL",
  "NEW",
] as const;

export default function AdminProductsPage() {
  const { products, saveProduct, toggleProductActive, deleteProduct } = useAdmin();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("ALL");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    name: string;
    brand: string;
    category: ProductCategory;
    goal: FitnessGoal;
    price: number;
    stockCount: number;
    weightOrServings: string;
    badge: "" | "BEST SELLER" | "TOP RATED" | "VERIFIED ORIGINAL" | "NEW";
    image: string;
  }>({
    name: "",
    brand: "Optimum Nutrition",
    category: "Whey Protein",
    goal: "Muscle Gain",
    price: 32500,
    stockCount: 15,
    weightOrServings: "5 lbs · 74 Servings",
    badge: "BEST SELLER",
    image: "/images/products/on-gold-isolate.jpg",
  });

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (catFilter !== "ALL" && p.category !== catFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, search, catFilter]);

  const openAddDrawer = () => {
    setEditingId(null);
    setForm({
      name: "",
      brand: "Optimum Nutrition",
      category: "Whey Protein",
      goal: "Muscle Gain",
      price: 32500,
      stockCount: 20,
      weightOrServings: "5 lbs · 74 Servings",
      badge: "NEW",
      image: "/images/products/on-gold-isolate.jpg",
    });
    setDrawerOpen(true);
  };

  const openEditDrawer = (p: AdminProduct) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      goal: p.goal,
      price: p.price,
      stockCount: p.stockCount,
      weightOrServings: p.weightOrServings,
      badge: p.badge || "",
      image: p.image,
    });
    setDrawerOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const existing = editingId ? products.find((p) => p.id === editingId) : null;
    const slug =
      existing?.slug ||
      form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const payload: AdminProduct = {
      id: existing?.id || `prod_${Date.now()}`,
      slug,
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      goal: form.goal,
      price: Number(form.price) || 0,
      originalPrice: existing?.originalPrice,
      weight: form.weightOrServings.split("·")[0]?.trim() || "5 lbs",
      weightOrServings: form.weightOrServings,
      flavors: existing?.flavors || ["Double Rich Chocolate", "Vanilla Ice Cream"],
      inStock: form.stockCount > 0,
      verifiedBatch: true,
      rating: existing?.rating || 4.9,
      reviewsCount: existing?.reviewsCount || 12,
      badge: form.badge || undefined,
      image: form.image || "/images/products/on-gold-isolate.jpg",
      stockCount: Number(form.stockCount) || 0,
      active: form.stockCount > 0,
    };

    saveProduct(payload, !editingId);
    setDrawerOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-[#111115] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search supplement name or brand..."
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

        <button
          type="button"
          onClick={openAddDrawer}
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>ADD NEW SUPPLEMENT</span>
        </button>
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
                      p.stockCount <= 5
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
                      onClick={() => openEditDrawer(p)}
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

      {/* Add / Edit Slide-Over Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 cursor-pointer"
          />
          <div className="relative z-10 w-full max-w-md bg-[#111115] border-l border-white/10 h-full overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
                {editingId ? "Edit Supplement" : "Add New Supplement"}
              </h3>
              <button
                type="button"
                data-no-glint
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-[#16161C] border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Gold Standard 100% Isolate (5 lbs)"
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Brand</label>
                  <input
                    type="text"
                    required
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as ProductCategory })
                    }
                    className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">
                    Cash Price (LKR)
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                    className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">
                    Stock Count
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.stockCount}
                    onChange={(e) =>
                      setForm({ ...form, stockCount: Number(e.target.value) })
                    }
                    className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Live KOKO Preview */}
              <div className="p-3 rounded-xl bg-[#16161C] border border-[#8B5CF6]/30 flex items-center justify-between text-xs">
                <span className="text-[#A78BFA] font-bold">
                  Auto KOKO 3× (+9%) Preview
                </span>
                <span className="font-mono font-bold text-white">
                  3 × {formatLKR(getKokoInstallment(form.price || 0), false)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">
                    Training Goal
                  </label>
                  <select
                    value={form.goal}
                    onChange={(e) =>
                      setForm({ ...form, goal: e.target.value as FitnessGoal })
                    }
                    className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  >
                    {GOALS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">
                    Highlight Tag
                  </label>
                  <select
                    value={form.badge}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        badge: e.target.value as typeof form.badge,
                      })
                    }
                    className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                  >
                    {BADGES.map((b) => (
                      <option key={b || "none"} value={b}>
                        {b || "None"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Weight / Servings Label
                </label>
                <input
                  type="text"
                  value={form.weightOrServings}
                  onChange={(e) =>
                    setForm({ ...form, weightOrServings: e.target.value })
                  }
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Save Supplement</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
