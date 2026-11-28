"use client";

import React, { useState, useRef } from "react";
import {
  Layers,
  Plus,
  Upload,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  ImageIcon,
} from "lucide-react";
import { useAdmin, AdminCategory } from "@/context/AdminContext";
import { useToast } from "@/context/ToastContext";

export default function AdminCategoriesPage() {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    reorderCategory,
  } = useAdmin();
  const { showToast } = useToast();

  // Form state (supports Add & Edit)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedCategories = [...categories].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );

  const getLinkedCount = (catName: string) =>
    products.filter(
      (p) => p.category.toLowerCase() === catName.toLowerCase()
    ).length;

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setTagline("");
    setImage("");
    setIsActive(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditClick = (cat: AdminCategory) => {
    setEditingId(cat.id);
    setName(cat.name);
    setTagline(cat.tagline || "");
    setImage(cat.image || "");
    setIsActive(cat.isActive);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showToast({
        type: "error",
        title: "Unsupported Format",
        subtitle: "Please upload a transparent PNG or WebP image.",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast({
        type: "error",
        title: "Image Too Large",
        subtitle: "Please choose a PNG/WebP under 2 MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast({
        type: "error",
        title: "Category Name Required",
        subtitle: "Enter a category title before saving.",
      });
      return;
    }

    if (editingId) {
      updateCategory(editingId, {
        name: name.trim(),
        tagline: tagline.trim() || "Certified sports nutrition formula",
        image,
        isActive,
      });
      resetForm();
    } else {
      addCategory({
        name: name.trim(),
        tagline: tagline.trim(),
        image,
        isActive,
      });
      resetForm();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E2C275]/10 border border-[#E2C275]/30 text-[#E2C275] text-[10px] font-bold uppercase tracking-widest mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Homepage Carousel &amp; Catalog Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-white font-heading">
            CATEGORIES MANAGEMENT
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Add, edit, reorder, and upload PNG/WebP artwork. Active categories sync directly to the Homepage &ldquo;SHOP BY CATEGORY&rdquo; carousel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#111115] border border-white/10 text-xs">
            <span className="text-zinc-400">Active: </span>
            <span className="font-bold text-[#E2C275] font-mono">
              {categories.filter((c) => c.isActive).length} / {categories.length}
            </span>
          </div>
        </div>
      </div>

      {/* 12-Col Split: Left Form + Live Preview | Right Sortable List */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Add / Edit Category + Live Circular Preview (Compact & Sticky) */}
        <form
          onSubmit={handleSubmit}
          data-lenis-prevent
          className="xl:col-span-5 xl:sticky xl:top-0 self-start max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin bg-[#111115] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5"
        >
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              {editingId ? "Edit Category" : "Add New Category"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Cancel Edit
              </button>
            )}
          </div>

          {/* Live Circular Dark-Theme Preview matching Homepage "SHOP BY CATEGORY" */}
          <div className="p-3.5 rounded-2xl bg-[#09090B] border border-white/8 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#E2C275]" />
              Live Homepage Medallion Preview
            </span>

            <div className="group flex flex-col items-center cursor-default select-none">
              <div className="w-24 h-24 rounded-full relative flex items-center justify-center bg-[#16161C] border border-white/[0.06] transition-all duration-300 group-hover:bg-[#E2C275] group-hover:border-[#E2C275] group-hover:shadow-[0_0_28px_rgba(226,194,117,0.35)]">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={image}
                      alt={name || "Category preview"}
                      className="w-28 h-28 max-w-none object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1.5"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-zinc-500 group-hover:text-[#09090B]">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-[9px] font-mono uppercase">
                        PNG / WebP
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <span className="font-heading text-sm sm:text-base font-bold tracking-wide text-zinc-200 group-hover:text-[#E2C275] mt-2.5 transition-colors">
                {name.trim() || "Category Title"}
              </span>
            </div>
          </div>

          {/* Category Name & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                Category Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Whey Isolate"
                className="w-full px-3 py-2 rounded-xl bg-[#16161C] border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E2C275]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                Short Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Pure isolates"
                className="w-full px-3 py-2 rounded-xl bg-[#16161C] border border-white/10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E2C275]"
              />
            </div>
          </div>

          {/* PNG / WebP Image Uploader */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 block">
              Category Artwork (PNG / WebP)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#16161C] border border-dashed border-[#E2C275]/45 text-xs font-bold uppercase tracking-wider text-[#E2C275] hover:bg-[#E2C275]/10 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{image ? "Replace PNG / WebP" : "Upload PNG / WebP"}</span>
              </button>
              {image && (
                <button
                  type="button"
                  onClick={() => {
                    setImage("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-400 hover:bg-red-500/20 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <input
              type="text"
              value={image.startsWith("data:") ? "" : image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Or paste path e.g. /images/categories/whey-protein.png"
              className="w-full px-3 py-1.5 rounded-xl bg-[#0D0D10] border border-white/8 text-[11px] font-mono text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-[#E2C275]"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#16161C] border border-white/8">
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Storefront Visibility
              </p>
              <p className="text-[10px] text-zinc-400">
                Show in Homepage &ldquo;SHOP BY CATEGORY&rdquo;
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                isActive
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : "bg-zinc-800 border-white/10 text-zinc-400"
              }`}
            >
              {isActive ? "Active" : "Hidden"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold flex items-center justify-center gap-2 cursor-pointer"
          >
            {editingId ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Save Category Changes</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Category to Vault</span>
              </>
            )}
          </button>
        </form>

        {/* Right: Ordered Categories List */}
        <div className="xl:col-span-7 bg-[#111115] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-base font-bold uppercase tracking-wider text-white font-heading">
              Configured Categories &amp; Sort Order ({sortedCategories.length})
            </h2>
            <span className="text-[11px] font-mono text-zinc-400">
              Use arrows to reorder carousel
            </span>
          </div>

          <div className="space-y-3">
            {sortedCategories.map((cat, idx) => {
              const linked = getLinkedCount(cat.name);
              const isConfirmingDelete = confirmDeleteId === cat.id;

              return (
                <div
                  key={cat.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    cat.isActive
                      ? "bg-[#16161C] border-white/10"
                      : "bg-[#111115] border-white/5 opacity-65"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Reorder Arrows + Order Index */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => reorderCategory(cat.id, "up")}
                        aria-label={`Move ${cat.name} up`}
                        className="p-1 rounded bg-[#0E0E12] border border-white/10 text-zinc-400 hover:text-[#E2C275] disabled:opacity-25 cursor-pointer"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] font-mono text-zinc-500 font-bold">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        disabled={idx === sortedCategories.length - 1}
                        onClick={() => reorderCategory(cat.id, "down")}
                        aria-label={`Move ${cat.name} down`}
                        className="p-1 rounded bg-[#0E0E12] border border-white/10 text-zinc-400 hover:text-[#E2C275] disabled:opacity-25 cursor-pointer"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Circular Thumbnail Preview */}
                    <div className="w-14 h-14 rounded-full bg-[#09090B] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden p-1.5">
                      {cat.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-zinc-600" />
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wide truncate">
                          {cat.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                          {linked} {linked === 1 ? "product" : "products"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {cat.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Row Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => toggleCategoryStatus(cat.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border cursor-pointer ${
                        cat.isActive
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-zinc-800 border-white/10 text-zinc-400"
                      }`}
                    >
                      {cat.isActive ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEditClick(cat)}
                      aria-label={`Edit ${cat.name}`}
                      className="p-2 rounded-lg bg-[#0E0E12] border border-white/10 text-zinc-300 hover:text-[#E2C275] hover:border-[#E2C275]/40 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1 bg-red-950/40 border border-red-500/40 rounded-lg px-2 py-1">
                        {linked > 0 && (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            deleteCategory(cat.id);
                            setConfirmDeleteId(null);
                            if (editingId === cat.id) resetForm();
                          }}
                          className="text-[10px] font-bold text-red-300 hover:text-white px-1 cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-[10px] text-zinc-400 hover:text-white px-1 cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(cat.id)}
                        aria-label={`Delete ${cat.name}`}
                        className="p-2 rounded-lg bg-[#0E0E12] border border-white/10 text-zinc-400 hover:text-red-400 hover:border-red-500/40 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
