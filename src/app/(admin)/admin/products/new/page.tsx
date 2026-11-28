"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Plus,
  Check,
  Star,
  Trash2,
  Link as LinkIcon,
  ShieldCheck,
  ShoppingCart,
  X,
} from "lucide-react";
import { useAdmin, AdminProduct } from "@/context/AdminContext";
import { ProductCategory, FitnessGoal } from "@/data/mockProducts";
import {
  formatLKR,
  getKokoTotal,
  getKokoInstallment,
  ProductDiscountType,
  calculateProductPricing,
} from "@/lib/pricing";
import ProductProfitSection from "@/components/admin/ProductProfitSection";

const createProductId = () => `prod_${Date.now()}`;

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

export default function AdminNewProductPage() {
  const router = useRouter();
  const { saveProduct, categories, brands } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCategoryNames = categories
    .filter((c) => c.isActive)
    .map((c) => c.name);
  const activeBrandNames = brands
    .filter((b) => b.isActive)
    .map((b) => b.name);
  const dynamicBrands = [...activeBrandNames, "Custom Brand"];

  const [name, setName] = useState("");
  const [brandSelect, setBrandSelect] = useState("Optimum Nutrition");
  const [customBrand, setCustomBrand] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Whey Protein");
  const [goal, setGoal] = useState<FitnessGoal>("Muscle Gain");
  const [weight, setWeight] = useState("5.0 lbs");
  const [servingsCount, setServingsCount] = useState("74 Servings");
  const [flavors, setFlavors] = useState<string[]>([
    "Double Rich Chocolate",
    "Vanilla Ice Cream",
  ]);
  const [flavorInput, setFlavorInput] = useState("");
  const [costPrice, setCostPrice] = useState<number>(23400);
  const [regularPrice, setRegularPrice] = useState<number>(36500);
  const [discountType, setDiscountType] =
    useState<ProductDiscountType>("fixed_lkr");
  const [discountValue, setDiscountValue] = useState<number>(4000);
  const [stockCount, setStockCount] = useState<number>(20);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [batchCode, setBatchCode] = useState("AF-ON-2026-910");
  const [badge, setBadge] = useState<
    "" | "BEST SELLER" | "TOP RATED" | "VERIFIED ORIGINAL" | "NEW"
  >("NEW");
  const [images, setImages] = useState<string[]>([
    "/images/products/gold-standard-isolate.png",
  ]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [highlightsText, setHighlightsText] = useState(
    [
      "100% Direct USA/UK Manufacturer Import",
      "Tamper-Evident Holographic QR Batch Seal",
      "Climate-Controlled Colombo 03 Vault Storage",
    ].join("\n")
  );
  const [description, setDescription] = useState(
    "Laboratory-verified authentic sports nutrition imported directly from authorized global manufacturers."
  );

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

  const weightLabel = `${weight.trim()}${
    servingsCount.trim() ? ` · ${servingsCount.trim()}` : ""
  }`;

  const pricing = calculateProductPricing(
    regularPrice,
    costPrice,
    discountType,
    discountValue
  );
  const price = pricing.finalSellingPrice;
  const validOrig =
    discountType !== "none" && pricing.regularPrice > pricing.finalSellingPrice
      ? pricing.regularPrice
      : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const payload: AdminProduct = {
      id: createProductId(),
      slug,
      name: name.trim(),
      brand: resolvedBrand,
      category,
      goal,
      price,
      originalPrice: validOrig,
      costPrice: pricing.costPrice,
      discountType,
      discountValue,
      weight: weight.trim() || "5.0 lbs",
      weightOrServings: weightLabel,
      servingsCount: servingsCount.trim(),
      flavors: flavors.length > 0 ? flavors : ["Unflavored"],
      inStock: stockCount > 0,
      verifiedBatch: true,
      rating: 4.9,
      reviewsCount: 18,
      badge: badge || undefined,
      image: images[0] || "/images/products/gold-standard-isolate.png",
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
      restockHistory: [],
    };

    saveProduct(payload, true);
    router.push("/admin/products");
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-[#E2C275] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products &amp; Stock</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-white font-heading">
            PUBLISH NEW SUPPLEMENT TO VAULT
          </h1>
        </div>

        <Link
          href="/admin/products"
          className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-dark self-start sm:self-auto"
        >
          Cancel
        </Link>
      </div>

      {/* 2-Column Full-Page Studio */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start"
      >
        {/* Left Column (8 cols): Full Form */}
        <div className="xl:col-span-8 space-y-6">
          {/* Card 1: Multi-Photo Uploader */}
          <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold uppercase tracking-wider text-white font-heading">
                1. Supplement Photography ({images.length}/4)
              </h2>
              <span className="text-xs text-zinc-400">
                First image is the Primary Storefront Cover
              </span>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFilesSelected(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/15 hover:border-[#E2C275]/60 rounded-2xl bg-[#09090B] p-6 text-center cursor-pointer transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFilesSelected(e.target.files)}
                className="hidden"
              />
              <Upload className="w-7 h-7 text-[#E2C275] mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">
                Drag &amp; drop supplement photos here, or click to browse
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Supports PNG, JPG, WEBP · Up to 4 gallery photos
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Or paste an image URL (https://... or /images/...)"
                  className="w-full bg-[#09090B] border border-white/12 focus:border-[#E2C275] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
              <button
                type="button"
                data-no-glint
                onClick={handleAddImageUrl}
                className="px-4 py-2.5 rounded-xl text-xs font-bold btn-aurafit-dark cursor-pointer"
              >
                Add URL
              </button>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {images.map((src, idx) => (
                  <div
                    key={`${src.slice(0, 24)}-${idx}`}
                    className={`relative aspect-square rounded-xl bg-[#09090B] border overflow-hidden p-2 group ${
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
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#E2C275] text-[#09090B] text-[9px] font-black uppercase">
                        COVER
                      </span>
                    ) : (
                      <button
                        type="button"
                        data-no-glint
                        onClick={() => handleMakePrimary(idx)}
                        title="Set as Primary Cover"
                        className="absolute top-1.5 left-1.5 p-1 rounded bg-black/80 text-zinc-300 hover:text-[#E2C275] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      data-no-glint
                      onClick={() => handleRemoveImage(idx)}
                      aria-label="Remove image"
                      className="absolute top-1.5 right-1.5 p-1 rounded bg-black/80 text-zinc-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 2: Specifications & Flavors */}
          <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-bold uppercase tracking-wider text-white font-heading">
              2. Specifications &amp; Flavors
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Product Title
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gold Standard 100% Isolate (5 lbs)"
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Brand</label>
                <select
                  value={brandSelect}
                  onChange={(e) => setBrandSelect(e.target.value)}
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
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
                    placeholder="Enter custom brand"
                    className="mt-2 w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ProductCategory)
                  }
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                >
                  {(activeCategoryNames.length > 0 ? activeCategoryNames : CATEGORIES).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Training Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as FitnessGoal)}
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                >
                  {GOALS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Package Size / Weight
                </label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Servings Count
                </label>
                <input
                  type="text"
                  value={servingsCount}
                  onChange={(e) => setServingsCount(e.target.value)}
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">
                Multi-Flavor Tag Builder
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
                  placeholder="Type a flavor & press Add"
                  className="flex-1 bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  data-no-glint
                  onClick={handleAddFlavor}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold btn-aurafit-dark inline-flex items-center gap-1 cursor-pointer"
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
          </div>

          {/* Card 3: Pricing, Discount & Profit Calculator */}
          <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-bold uppercase tracking-wider text-white font-heading">
              3. Pricing, Discount &amp; Profit Calculator
            </h2>

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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Initial Stock
                </label>
                <input
                  type="number"
                  min={0}
                  value={stockCount}
                  onChange={(e) => setStockCount(Number(e.target.value))}
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Low-Stock Alert
                </label>
                <input
                  type="number"
                  min={1}
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Batch Code
                </label>
                <input
                  type="text"
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value)}
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#38BDF8] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Highlight Badge
                </label>
                <select
                  value={badge}
                  onChange={(e) =>
                    setBadge(e.target.value as typeof badge)
                  }
                  className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  {BADGES.map((b) => (
                    <option key={b || "none"} value={b}>
                      {b || "None"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Key Supplement Highlights (one per line)
              </label>
              <textarea
                rows={3}
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Full Product Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#09090B] border border-white/15 focus:border-[#E2C275] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Sticky Live Storefront Card Preview */}
        <div className="xl:col-span-4 xl:sticky xl:top-24 space-y-5">
          <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E2C275]">
                LIVE STOREFRONT PREVIEW
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {stockCount} in stock
              </span>
            </div>

            {/* Mirror of Storefront Image-First ProductCard */}
            <div className="flex flex-col bg-[#141418] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
              <div className="relative aspect-square w-full bg-[#15151B] border-b border-white/[0.06] overflow-hidden p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[0] || "/images/products/gold-standard-isolate.png"}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                {badge && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded text-[9px] font-black tracking-wider uppercase text-[#09090B] bg-gradient-to-r from-[#E5C76B] to-[#C9A227]">
                      {badge}
                    </span>
                  </div>
                )}
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-[#09090B]/85 border border-[#E2C275]/40 text-[#E2C275] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  <span>VERIFIED</span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="inline-block bg-[#09090B]/85 border border-white/10 text-zinc-300 text-[11px] font-medium px-2.5 py-1 rounded-md">
                    {weightLabel}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex flex-col">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="text-[#E2C275]">{resolvedBrand}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-400">{category}</span>
                </div>

                <h3 className="mt-1.5 text-base font-semibold leading-[1.35] text-white min-h-[2.75rem]">
                  {name.trim() || "New Supplement Title Preview (5.0 lbs)"}
                </h3>

                <div className="mt-3 pt-3 border-t border-white/[0.06]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-white">
                      {formatLKR(price || 0, true)}
                    </span>
                    {validOrig && (
                      <span className="text-xs text-zinc-500 line-through">
                        {formatLKR(validOrig, true)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-300 mt-1.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#A78BFA] bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-1.5 py-0.5 rounded">
                      KOKO
                    </span>
                    <span>{formatLKR(getKokoTotal(price || 0), false)}</span>
                    <span className="text-zinc-500">·</span>
                    <span>3 × {formatLKR(getKokoInstallment(price || 0), false)}</span>
                  </div>
                  <div className="mt-3 w-full py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-[#1C1C21] border border-white/12 text-white flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider btn-aurafit-gold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Publish Supplement to Store</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
