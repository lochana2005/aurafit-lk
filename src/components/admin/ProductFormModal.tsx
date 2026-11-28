"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Plus,
  Check,
  Star,
  Trash2,
  Link as LinkIcon,
  ShieldCheck,
} from "lucide-react";
import { AdminProduct, useAdmin } from "@/context/AdminContext";
import { ProductCategory, FitnessGoal } from "@/data/mockProducts";
import {
  ProductDiscountType,
  calculateProductPricing,
  formatLKR,
  getKokoInstallment,
} from "@/lib/pricing";
import ProductProfitSection from "@/components/admin/ProductProfitSection";

interface ProductFormModalProps {
  isOpen: boolean;
  editingProduct: AdminProduct | null;
  onClose: () => void;
  onSave: (product: AdminProduct, isNew: boolean) => void;
}

const BRAND_PRESETS = [
  "Optimum Nutrition",
  "Dymatize",
  "MuscleTech",
  "Applied Nutrition",
  "Ronnie Coleman",
  "Cellucor",
  "Custom Brand",
];

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

export default function ProductFormModal({
  isOpen,
  editingProduct,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const { categories, brands } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCategoryNames = categories
    .filter((c) => c.isActive)
    .map((c) => c.name);
  const activeBrandNames = brands
    .filter((b) => b.isActive)
    .map((b) => b.name);
  const dynamicBrands = [...activeBrandNames, "Custom Brand"];

  const [name, setName] = useState(editingProduct?.name || "");
  const [brandSelect, setBrandSelect] = useState(() => {
    if (!editingProduct) return "Optimum Nutrition";
    return BRAND_PRESETS.includes(editingProduct.brand)
      ? editingProduct.brand
      : "Custom Brand";
  });
  const [customBrand, setCustomBrand] = useState(
    editingProduct && !BRAND_PRESETS.includes(editingProduct.brand)
      ? editingProduct.brand
      : ""
  );
  const [category, setCategory] = useState<ProductCategory>(
    editingProduct?.category || "Whey Protein"
  );
  const [goal, setGoal] = useState<FitnessGoal>(
    editingProduct?.goal || "Muscle Gain"
  );
  const [weight, setWeight] = useState(editingProduct?.weight || "5.0 lbs");
  const [servingsCount, setServingsCount] = useState(
    editingProduct?.servingsCount || "74 Servings"
  );
  const [flavors, setFlavors] = useState<string[]>(
    editingProduct?.flavors || ["Double Rich Chocolate", "Vanilla Ice Cream"]
  );
  const [flavorInput, setFlavorInput] = useState("");
  const [costPrice, setCostPrice] = useState<number>(
    editingProduct?.costPrice ?? 23400
  );
  const [regularPrice, setRegularPrice] = useState<number>(
    editingProduct?.originalPrice && editingProduct.originalPrice > (editingProduct?.price || 0)
      ? editingProduct.originalPrice
      : editingProduct?.price || 32500
  );
  const [discountType, setDiscountType] = useState<ProductDiscountType>(
    editingProduct?.discountType || "none"
  );
  const [discountValue, setDiscountValue] = useState<number>(
    editingProduct?.discountValue ?? 0
  );
  const [stockCount, setStockCount] = useState<number>(
    editingProduct?.stockCount ?? 20
  );
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(
    editingProduct?.lowStockThreshold ?? 5
  );
  const [batchCode, setBatchCode] = useState(
    editingProduct?.batchCode || "AF-ON-2026-910"
  );
  const [badge, setBadge] = useState<
    "" | "BEST SELLER" | "TOP RATED" | "VERIFIED ORIGINAL" | "NEW"
  >(editingProduct?.badge || "NEW");
  const [images, setImages] = useState<string[]>(() => {
    if (editingProduct?.galleryImages && editingProduct.galleryImages.length > 0) {
      return editingProduct.galleryImages;
    }
    if (editingProduct?.image) return [editingProduct.image];
    return ["/images/products/gold-standard-isolate.png"];
  });
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [highlightsText, setHighlightsText] = useState(
    (
      editingProduct?.highlights || [
        "100% Direct USA/UK Manufacturer Import",
        "Tamper-Evident Holographic QR Batch Seal",
        "Climate-Controlled Colombo 03 Vault Storage",
      ]
    ).join("\n")
  );
  const [description, setDescription] = useState(
    editingProduct?.description ||
      "Laboratory-verified authentic sports nutrition imported directly from authorized global manufacturers."
  );

  if (!isOpen) return null;

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    Array.from(files)
      .slice(0, Math.max(0, 4 - images.length))
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setImages((prev) =>
              prev.length < 4 ? [...prev, reader.result as string] : prev
            );
          }
        };
        reader.readAsDataURL(file);
      });
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed || images.length >= 4) return;
    setImages((prev) => [...prev, trimmed]);
    setImageUrlInput("");
  };

  const handleMakePrimary = (idx: number) => {
    if (idx === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [picked] = next.splice(idx, 1);
      return [picked, ...next];
    });
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddFlavor = () => {
    const cleaned = flavorInput.trim();
    if (!cleaned) return;
    if (!flavors.includes(cleaned)) {
      setFlavors((prev) => [...prev, cleaned]);
    }
    setFlavorInput("");
  };

  const resolvedBrand =
    brandSelect === "Custom Brand"
      ? customBrand.trim() || "AuraFit Import"
      : brandSelect;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug =
      editingProduct?.slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const primaryImage =
      images[0] || "/images/products/gold-standard-isolate.png";
    const pricing = calculateProductPricing(
      regularPrice,
      costPrice,
      discountType,
      discountValue
    );

    const payload: AdminProduct = {
      id: editingProduct?.id || `prod_${Date.now()}`,
      slug,
      name: name.trim(),
      brand: resolvedBrand,
      category,
      goal,
      price: pricing.finalSellingPrice,
      originalPrice:
        discountType !== "none" && pricing.regularPrice > pricing.finalSellingPrice
          ? pricing.regularPrice
          : undefined,
      costPrice: pricing.costPrice,
      discountType,
      discountValue,
      weight: weight.trim() || "5.0 lbs",
      weightOrServings: `${weight.trim()}${servingsCount.trim() ? ` · ${servingsCount.trim()}` : ""}`,
      servingsCount: servingsCount.trim(),
      flavors: flavors.length > 0 ? flavors : ["Unflavored"],
      inStock: stockCount > 0,
      verifiedBatch: true,
      rating: editingProduct?.rating || 4.9,
      reviewsCount: editingProduct?.reviewsCount || 18,
      badge: badge || undefined,
      image: primaryImage,
      galleryImages: images.slice(0, 4),
      stockCount: Number(stockCount) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 5,
      active: stockCount > 0,
      batchCode: batchCode.trim().toUpperCase(),
      highlights: highlightsText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      description: description.trim(),
      restockHistory: editingProduct?.restockHistory || [],
    };

    onSave(payload, !editingProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 cursor-pointer"
      />
      <div
        data-lenis-prevent
        className="relative z-10 w-full max-w-2xl bg-[#111115] border-l border-white/10 h-full overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E2C275]">
              PRODUCT CREATION STUDIO
            </span>
            <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white font-heading">
              {editingProduct ? "Edit Supplement" : "Add New Supplement"}
            </h3>
          </div>
          <button
            type="button"
            data-no-glint
            onClick={onClose}
            aria-label="Close product studio"
            className="p-2 rounded-xl bg-[#16161C] border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Interactive Multi-Photo Uploader */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                Product Photos ({images.length}/4)
              </label>
              <span className="text-[11px] text-zinc-400">
                First photo is Primary Cover
              </span>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFilesSelected(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/15 hover:border-[#E2C275]/60 rounded-2xl bg-[#09090B] p-5 text-center cursor-pointer transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFilesSelected(e.target.files)}
                className="hidden"
              />
              <Upload className="w-6 h-6 text-[#E2C275] mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-white">
                Drop supplement photos here or click to upload
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                PNG, JPG, WEBP · Up to 4 gallery images
              </p>
            </div>

            {/* Paste Image URL */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Or paste image URL (https://... or /images/...)"
                  className="w-full bg-[#09090B] border border-white/12 focus:border-[#E2C275] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <button
                type="button"
                data-no-glint
                onClick={handleAddImageUrl}
                className="px-3.5 py-2 rounded-xl text-xs font-bold btn-aurafit-dark cursor-pointer"
              >
                Add URL
              </button>
            </div>

            {/* Thumbnail Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((src, idx) => (
                  <div
                    key={`${src.slice(0, 24)}-${idx}`}
                    className={`relative aspect-square rounded-xl bg-[#09090B] border overflow-hidden p-1.5 group ${
                      idx === 0 ? "border-[#E2C275]" : "border-white/10"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                    {idx === 0 ? (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#E2C275] text-[#09090B] text-[8px] font-black uppercase">
                        COVER
                      </span>
                    ) : (
                      <button
                        type="button"
                        data-no-glint
                        onClick={() => handleMakePrimary(idx)}
                        title="Set as Primary Cover"
                        className="absolute top-1 left-1 p-1 rounded bg-black/80 text-zinc-300 hover:text-[#E2C275] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Star className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      data-no-glint
                      onClick={() => handleRemoveImage(idx)}
                      aria-label="Remove image"
                      className="absolute top-1 right-1 p-1 rounded bg-black/80 text-zinc-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Core Specifications */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                Product Title
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gold Standard 100% Isolate (5 lbs)"
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Brand</label>
                <select
                  value={brandSelect}
                  onChange={(e) => setBrandSelect(e.target.value)}
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                >
                  {dynamicBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {brandSelect === "Custom Brand" && (
                  <input
                    type="text"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    placeholder="Enter brand name"
                    className="mt-2 w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ProductCategory)
                  }
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                >
                  {(activeCategoryNames.length > 0 ? activeCategoryNames : CATEGORIES).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Training Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as FitnessGoal)}
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
                >
                  {GOALS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Package Size / Weight
                </label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="5.0 lbs"
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Servings Count
                </label>
                <input
                  type="text"
                  value={servingsCount}
                  onChange={(e) => setServingsCount(e.target.value)}
                  placeholder="74 Servings"
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Multi-Flavor Tag Builder */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">
              Available Flavors
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={flavorInput}
                onChange={(e) => setFlavorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFlavor();
                  }
                }}
                placeholder="Type flavor (e.g. Double Rich Chocolate) & press Add"
                className="flex-1 bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                data-no-glint
                onClick={handleAddFlavor}
                className="px-3.5 py-2 rounded-xl text-xs font-bold btn-aurafit-dark inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {flavors.map((flav) => (
                <span
                  key={flav}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16161C] border border-[#E2C275]/30 text-xs text-zinc-200"
                >
                  <span>{flav}</span>
                  <button
                    type="button"
                    data-no-glint
                    onClick={() =>
                      setFlavors((prev) => prev.filter((f) => f !== flav))
                    }
                    className="text-zinc-400 hover:text-red-400 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 4. Pricing, Discount & Live Profit Calculator */}
          <ProductProfitSection
            costPrice={costPrice}
            regularPrice={regularPrice}
            discountType={discountType}
            discountValue={discountValue}
            onCostPriceChange={setCostPrice}
            onRegularPriceChange={setRegularPrice}
            onDiscountTypeChange={setDiscountType}
            onDiscountValueChange={setDiscountValue}
          />

          {/* 5. Inventory & Authenticity */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                Initial Stock
              </label>
              <input
                type="number"
                min={0}
                value={stockCount}
                onChange={(e) => setStockCount(Number(e.target.value))}
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                Low-Stock Alert
              </label>
              <input
                type="number"
                min={1}
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                Batch Code
              </label>
              <input
                type="text"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#38BDF8] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                Highlight Badge
              </label>
              <select
                value={badge}
                onChange={(e) =>
                  setBadge(e.target.value as typeof badge)
                }
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
              >
                {BADGES.map((b) => (
                  <option key={b || "none"} value={b}>
                    {b || "None"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 6. Highlights & Description */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                Key Supplement Highlights (one per line)
              </label>
              <textarea
                rows={3}
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">
                Full Product Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Live Card Preview */}
          <div className="p-4 rounded-2xl bg-[#09090B] border border-white/10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#16161C] border border-white/10 p-1.5 shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[0] || "/images/products/gold-standard-isolate.png"}
                alt="Live card preview"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#E2C275]">
                <span>{resolvedBrand}</span>
                <span>•</span>
                <span className="text-zinc-400">{category}</span>
                <ShieldCheck className="w-3 h-3 text-[#E2C275] ml-auto" />
              </div>
              <div className="text-sm font-bold text-white truncate mt-0.5">
                {name || "New Supplement Preview"}
              </div>
              <div className="text-xs font-extrabold text-white mt-0.5">
                {formatLKR(
                  calculateProductPricing(
                    regularPrice,
                    costPrice,
                    discountType,
                    discountValue
                  ).finalSellingPrice,
                  false
                )}{" "}
                <span className="text-zinc-400 font-normal">
                  · 3 ×{" "}
                  {formatLKR(
                    getKokoInstallment(
                      calculateProductPricing(
                        regularPrice,
                        costPrice,
                        discountType,
                        discountValue
                      ).finalSellingPrice
                    ),
                    false
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider btn-aurafit-gold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>
              {editingProduct ? "Save Product Changes" : "Publish Supplement to Store"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
