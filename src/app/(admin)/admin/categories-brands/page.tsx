"use client";

import React, { useState } from "react";
import {
  Tags,
  Award,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const ORIGIN_PRESETS = ["USA Direct", "UK Direct", "EU Certified", "Global Import"];

export default function AdminCategoriesBrandsPage() {
  const {
    products,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    brands,
    addBrand,
    updateBrand,
    deleteBrand,
    toggleBrandStatus,
  } = useAdmin();

  // Category Inline Add State
  const [catName, setCatName] = useState("");
  const [catTagline, setCatTagline] = useState("");

  // Category Inline Edit State
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatTagline, setEditCatTagline] = useState("");
  const [confirmDeleteCatId, setConfirmDeleteCatId] = useState<string | null>(null);

  // Brand Inline Add State
  const [brandName, setBrandName] = useState("");
  const [brandOrigin, setBrandOrigin] = useState("USA Direct");

  // Brand Inline Edit State
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [editBrandName, setEditBrandName] = useState("");
  const [editBrandOrigin, setEditBrandOrigin] = useState("");
  const [confirmDeleteBrandId, setConfirmDeleteBrandId] = useState<string | null>(null);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    addCategory(catName, catTagline);
    setCatName("");
    setCatTagline("");
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    addBrand(brandName, brandOrigin);
    setBrandName("");
    setBrandOrigin("USA Direct");
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#E2C275]">
            DYNAMIC TAXONOMY · ZERO PHOTO UPLOAD REQUIRED
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-white font-heading mt-0.5">
            CATEGORIES &amp; BRANDS MANAGER
          </h1>
        </div>
        <div className="text-xs text-zinc-400">
          Changes sync live with Storefront (`/`, `/shop`) &amp; Product Forms
        </div>
      </div>

      {/* 2-Column Side-by-Side Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT CARD — Supplement Categories Manager */}
        <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E2C275]/12 border border-[#E2C275]/30 flex items-center justify-center text-[#E2C275]">
                <Tags className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
                  Supplement Categories
                </h2>
                <p className="text-xs text-zinc-400">
                  {categories.filter((c) => c.isActive).length} active ·{" "}
                  {categories.length} total
                </p>
              </div>
            </div>
          </div>

          {/* Quick Inline Add Form */}
          <form
            onSubmit={handleAddCategory}
            className="p-4 rounded-xl bg-[#16161C] border border-white/10 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="Category Name (e.g. Electrolytes & Hydration)"
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
              <input
                type="text"
                value={catTagline}
                onChange={(e) => setCatTagline(e.target.value)}
                placeholder="Short Tagline (optional)"
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>ADD CATEGORY</span>
            </button>
          </form>

          {/* Categories List */}
          <div className="space-y-2.5">
            {categories.map((cat) => {
              const linkedCount = products.filter(
                (p) => p.category.toLowerCase() === cat.name.toLowerCase()
              ).length;
              const isEditing = editingCatId === cat.id;
              const isConfirmingDelete = confirmDeleteCatId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="p-3.5 rounded-xl bg-[#0E0E12] border border-white/8 hover:border-white/15 transition-colors space-y-2.5"
                >
                  {isEditing ? (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editCatName}
                          onChange={(e) => setEditCatName(e.target.value)}
                          className="bg-[#16161C] border border-[#E2C275] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                        <input
                          type="text"
                          value={editCatTagline}
                          onChange={(e) => setEditCatTagline(e.target.value)}
                          className="bg-[#16161C] border border-white/15 focus:border-[#E2C275] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          data-no-glint
                          onClick={() => setEditingCatId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs btn-aurafit-dark cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (editCatName.trim()) {
                              updateCategory(cat.id, {
                                name: editCatName.trim(),
                                tagline: editCatTagline.trim(),
                              });
                            }
                            setEditingCatId(null);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold btn-aurafit-gold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white">
                              {cat.name}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#16161C] border border-white/10 text-[10px] font-mono text-zinc-400">
                              /{cat.slug}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-[#38BDF8]/12 border border-[#38BDF8]/25 text-[10px] font-mono font-bold text-[#38BDF8]">
                              {linkedCount} {linkedCount === 1 ? "Product" : "Products"}
                            </span>
                          </div>
                          {cat.tagline && (
                            <p className="text-xs text-zinc-400 mt-1">
                              {cat.tagline}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            data-no-glint
                            onClick={() => toggleCategoryStatus(cat.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer ${
                              cat.isActive
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
                                : "bg-zinc-800 text-zinc-400 border-white/10"
                            }`}
                          >
                            {cat.isActive ? "Visible" : "Hidden"}
                          </button>

                          <button
                            type="button"
                            data-no-glint
                            onClick={() => {
                              setEditingCatId(cat.id);
                              setEditCatName(cat.name);
                              setEditCatTagline(cat.tagline);
                            }}
                            aria-label={`Edit ${cat.name}`}
                            className="p-1.5 rounded-lg bg-[#16161C] border border-white/10 text-zinc-300 hover:text-[#E2C275] cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            data-no-glint
                            onClick={() => {
                              if (linkedCount > 0) {
                                setConfirmDeleteCatId(
                                  isConfirmingDelete ? null : cat.id
                                );
                              } else {
                                deleteCategory(cat.id);
                              }
                            }}
                            aria-label={`Delete ${cat.name}`}
                            className="p-1.5 rounded-lg bg-[#16161C] border border-white/10 text-zinc-400 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {isConfirmingDelete && (
                        <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/35 flex items-center justify-between gap-2 text-xs">
                          <span className="flex items-center gap-1.5 text-red-300">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {linkedCount} product(s) use this category. Delete anyway?
                            </span>
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              data-no-glint
                              onClick={() => setConfirmDeleteCatId(null)}
                              className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              data-no-glint
                              onClick={() => {
                                deleteCategory(cat.id);
                                setConfirmDeleteCatId(null);
                              }}
                              className="px-2.5 py-1 rounded bg-red-500 text-white font-bold text-[11px] cursor-pointer"
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT CARD — Official Supplement Brands Manager */}
        <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#38BDF8]/12 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
                  Official Supplement Brands
                </h2>
                <p className="text-xs text-zinc-400">
                  {brands.filter((b) => b.isActive).length} active ·{" "}
                  {brands.length} total
                </p>
              </div>
            </div>
          </div>

          {/* Quick Inline Add Form */}
          <form
            onSubmit={handleAddBrand}
            className="p-4 rounded-xl bg-[#16161C] border border-white/10 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Brand Name (e.g. Ghost Lifestyle)"
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
              <select
                value={brandOrigin}
                onChange={(e) => setBrandOrigin(e.target.value)}
                aria-label="Brand origin"
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none cursor-pointer"
              >
                {ORIGIN_PRESETS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>ADD BRAND</span>
            </button>
          </form>

          {/* Brands List */}
          <div className="space-y-2.5">
            {brands.map((brand) => {
              const linkedCount = products.filter(
                (p) => p.brand.toLowerCase() === brand.name.toLowerCase()
              ).length;
              const isEditing = editingBrandId === brand.id;
              const isConfirmingDelete = confirmDeleteBrandId === brand.id;

              return (
                <div
                  key={brand.id}
                  className="p-3.5 rounded-xl bg-[#0E0E12] border border-white/8 hover:border-white/15 transition-colors space-y-2.5"
                >
                  {isEditing ? (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editBrandName}
                          onChange={(e) => setEditBrandName(e.target.value)}
                          className="bg-[#16161C] border border-[#E2C275] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                        <input
                          type="text"
                          value={editBrandOrigin}
                          onChange={(e) => setEditBrandOrigin(e.target.value)}
                          className="bg-[#16161C] border border-white/15 focus:border-[#E2C275] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          data-no-glint
                          onClick={() => setEditingBrandId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs btn-aurafit-dark cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (editBrandName.trim()) {
                              updateBrand(brand.id, {
                                name: editBrandName.trim(),
                                originCountry: editBrandOrigin.trim(),
                              });
                            }
                            setEditingBrandId(null);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold btn-aurafit-gold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-heading text-base font-black uppercase tracking-wider text-white">
                              {brand.name}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#E2C275]/12 border border-[#E2C275]/25 text-[10px] font-mono font-bold uppercase text-[#E2C275]">
                              {brand.originCountry}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-[#38BDF8]/12 border border-[#38BDF8]/25 text-[10px] font-mono font-bold text-[#38BDF8]">
                              {linkedCount} {linkedCount === 1 ? "Product" : "Products"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            data-no-glint
                            onClick={() => toggleBrandStatus(brand.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer ${
                              brand.isActive
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
                                : "bg-zinc-800 text-zinc-400 border-white/10"
                            }`}
                          >
                            {brand.isActive ? "Visible" : "Hidden"}
                          </button>

                          <button
                            type="button"
                            data-no-glint
                            onClick={() => {
                              setEditingBrandId(brand.id);
                              setEditBrandName(brand.name);
                              setEditBrandOrigin(brand.originCountry);
                            }}
                            aria-label={`Edit ${brand.name}`}
                            className="p-1.5 rounded-lg bg-[#16161C] border border-white/10 text-zinc-300 hover:text-[#E2C275] cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            data-no-glint
                            onClick={() => {
                              if (linkedCount > 0) {
                                setConfirmDeleteBrandId(
                                  isConfirmingDelete ? null : brand.id
                                );
                              } else {
                                deleteBrand(brand.id);
                              }
                            }}
                            aria-label={`Delete ${brand.name}`}
                            className="p-1.5 rounded-lg bg-[#16161C] border border-white/10 text-zinc-400 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {isConfirmingDelete && (
                        <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/35 flex items-center justify-between gap-2 text-xs">
                          <span className="flex items-center gap-1.5 text-red-300">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {linkedCount} product(s) use this brand. Delete anyway?
                            </span>
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              data-no-glint
                              onClick={() => setConfirmDeleteBrandId(null)}
                              className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              data-no-glint
                              onClick={() => {
                                deleteBrand(brand.id);
                                setConfirmDeleteBrandId(null);
                              }}
                              className="px-2.5 py-1 rounded bg-red-500 text-white font-bold text-[11px] cursor-pointer"
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
