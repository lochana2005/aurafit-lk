"use client";

import React, { useState } from "react";
import { RotateCcw, ShieldCheck, Check, Minus, Plus, X } from "lucide-react";
import { ProductCategory, FitnessGoal } from "@/data/mockProducts";
import { useAdmin } from "@/context/AdminContext";

export const MAX_PRICE_LIMIT = 60000;
export const PRICE_STEP = 500;

export interface FilterState {
  categories: ProductCategory[];
  goals: FitnessGoal[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  verifiedOnly: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (next: FilterState) => void;
  onClearAll: () => void;
  isDesktopOpen: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  categoryCounts: Record<string, number>;
  brandCounts: Record<string, number>;
  goalCounts: Record<string, number>;
  hasActiveFilters: boolean;
}

const ALL_CATEGORIES: ProductCategory[] = [
  "Whey Protein",
  "Mass Gainer",
  "Creatine",
  "Pre Workout",
  "BCAA",
  "Amino",
  "Fat Burner",
  "Multivitamins",
];

const ALL_GOALS: FitnessGoal[] = [
  "Muscle Gain",
  "Lean Cutting",
  "Strength & Power",
  "Recovery",
];

const ALL_BRANDS = [
  "Optimum Nutrition",
  "Dymatize",
  "MuscleTech",
  "Applied Nutrition",
  "Ronnie Coleman",
  "Cellucor",
];

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClearAll,
  isDesktopOpen,
  isMobileOpen,
  onCloseMobile,
  categoryCounts,
  brandCounts,
  goalCounts,
  hasActiveFilters,
}: FilterSidebarProps) {
  const { categories: adminCategories, brands: adminBrands, isHydrated } = useAdmin();

  const displayedCategories: ProductCategory[] = isHydrated
    ? adminCategories.filter((c) => c.isActive).map((c) => c.name)
    : ALL_CATEGORIES;

  const displayedBrands: string[] = isHydrated
    ? adminBrands.filter((b) => b.isActive).map((b) => b.name)
    : ALL_BRANDS;

  const [openSections, setOpenSections] = useState({
    price: true,
    categories: true,
    goals: true,
    brands: true,
    quick: true,
  });

  // Draft dual-thumb price values committed via FILTER button
  const [draftMin, setDraftMin] = useState(filters.minPrice);
  const [draftMax, setDraftMax] = useState(filters.maxPrice);
  const priceKey = `${filters.minPrice}-${filters.maxPrice}`;
  const [prevPriceKey, setPrevPriceKey] = useState(priceKey);

  if (priceKey !== prevPriceKey) {
    setPrevPriceKey(priceKey);
    setDraftMin(filters.minPrice);
    setDraftMax(filters.maxPrice);
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCategory = (cat: ProductCategory) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFilterChange({ ...filters, categories: next });
  };

  const toggleGoal = (goal: FitnessGoal) => {
    const next = filters.goals.includes(goal)
      ? filters.goals.filter((g) => g !== goal)
      : [...filters.goals, goal];
    onFilterChange({ ...filters, goals: next });
  };

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: next });
  };

  const applyPriceFilter = () => {
    onFilterChange({
      ...filters,
      minPrice: draftMin,
      maxPrice: draftMax,
    });
  };

  const toggleInStock = () => {
    onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly });
  };

  const toggleVerified = () => {
    onFilterChange({ ...filters, verifiedOnly: !filters.verifiedOnly });
  };

  const minPercent = (draftMin / MAX_PRICE_LIMIT) * 100;
  const maxPercent = (draftMax / MAX_PRICE_LIMIT) * 100;

  const filterContent = (
    <div className="space-y-5 font-sans text-zinc-300">
      {/* Header with Reset All */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-100">
          Filter Catalog
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-[#E2C275] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. FILTER BY PRICE (Dual-Thumb Range Slider) */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-[#E2C275] transition-colors cursor-pointer"
        >
          <span>FILTER BY PRICE</span>
          <span className="text-zinc-400">
            {openSections.price ? (
              <Minus className="w-3.5 h-3.5" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
          </span>
        </button>

        {openSections.price && (
          <div className="mt-4 space-y-4">
            {/* Dual-thumb slider container */}
            <div className="relative h-6 flex items-center">
              {/* Background Track */}
              <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/10" />
              {/* Active Gold Track */}
              <div
                className="absolute h-1.5 rounded-full bg-gradient-to-r from-[#E2C275] to-[#C9A227]"
                style={{
                  left: `${minPercent}%`,
                  right: `${100 - maxPercent}%`,
                }}
              />
              {/* Min Slider Input */}
              <input
                type="range"
                min={0}
                max={MAX_PRICE_LIMIT}
                step={PRICE_STEP}
                value={draftMin}
                aria-label="Minimum price"
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), draftMax - PRICE_STEP);
                  setDraftMin(val);
                }}
                className="aurafit-range-input absolute inset-x-0 w-full z-20"
              />
              {/* Max Slider Input */}
              <input
                type="range"
                min={0}
                max={MAX_PRICE_LIMIT}
                step={PRICE_STEP}
                value={draftMax}
                aria-label="Maximum price"
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), draftMin + PRICE_STEP);
                  setDraftMax(val);
                }}
                className="aurafit-range-input absolute inset-x-0 w-full z-30"
              />
            </div>

            {/* Live Price Readout + Underlined FILTER button */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-sm text-zinc-300 leading-snug">
                Price:{" "}
                <strong className="text-white font-semibold">
                  Rs. {draftMin.toLocaleString("en-LK")}
                </strong>{" "}
                —{" "}
                <strong className="text-white font-semibold">
                  Rs. {draftMax.toLocaleString("en-LK")}
                </strong>
              </span>
              <button
                type="button"
                onClick={applyPriceFilter}
                className="text-xs font-bold uppercase tracking-wider text-[#E2C275] underline underline-offset-4 hover:text-[#F5DC93] transition-colors shrink-0 cursor-pointer"
              >
                FILTER
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. PRODUCT CATEGORIES */}
      <div className="pt-4 border-t border-white/[0.08]">
        <button
          type="button"
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-[#E2C275] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>PRODUCT CATEGORIES</span>
            {filters.categories.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#E2C275] text-[#09090B] font-mono text-[9px] font-black flex items-center justify-center">
                {filters.categories.length}
              </span>
            )}
          </span>
          <span className="text-zinc-400">
            {openSections.categories ? (
              <Minus className="w-3.5 h-3.5" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
          </span>
        </button>

        {openSections.categories && (
          <div className="mt-2.5 space-y-1.5">
            {displayedCategories.map((cat) => {
              const isChecked = filters.categories.includes(cat);
              const count = categoryCounts[cat] || 0;
              return (
                <div
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-[#E2C275] border-[#E2C275] text-[#09090B]"
                          : "border-white/20 group-hover:border-white/40 bg-[#1C1C22]"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-sm transition-colors ${
                        isChecked
                          ? "text-white font-semibold"
                          : "text-zinc-300 group-hover:text-white"
                      }`}
                    >
                      {cat}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. TRAINING GOAL (Collapsible Checkbox List) */}
      <div className="pt-4 border-t border-white/[0.08]">
        <button
          type="button"
          onClick={() => toggleSection("goals")}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-[#E2C275] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>TRAINING GOAL</span>
            {filters.goals.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#E2C275] text-[#09090B] font-mono text-[9px] font-black flex items-center justify-center">
                {filters.goals.length}
              </span>
            )}
          </span>
          <span className="text-zinc-400">
            {openSections.goals ? (
              <Minus className="w-3.5 h-3.5" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
          </span>
        </button>

        {openSections.goals && (
          <div className="mt-2.5 space-y-1.5">
            {ALL_GOALS.map((goal) => {
              const isChecked = filters.goals.includes(goal);
              const count = goalCounts[goal] || 0;
              return (
                <div
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-[#E2C275] border-[#E2C275] text-[#09090B]"
                          : "border-white/20 group-hover:border-white/40 bg-[#1C1C22]"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-sm transition-colors ${
                        isChecked
                          ? "text-white font-semibold"
                          : "text-zinc-300 group-hover:text-white"
                      }`}
                    >
                      {goal}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. AUTHORIZED BRANDS */}
      <div className="pt-4 border-t border-white/[0.08]">
        <button
          type="button"
          onClick={() => toggleSection("brands")}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-[#E2C275] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>AUTHORIZED BRANDS</span>
            {filters.brands.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#E2C275] text-[#09090B] font-mono text-[9px] font-black flex items-center justify-center">
                {filters.brands.length}
              </span>
            )}
          </span>
          <span className="text-zinc-400">
            {openSections.brands ? (
              <Minus className="w-3.5 h-3.5" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
          </span>
        </button>

        {openSections.brands && (
          <div className="mt-2.5 space-y-1.5">
            {displayedBrands.map((brand) => {
              const isChecked = filters.brands.includes(brand);
              const count = brandCounts[brand] || 0;
              return (
                <div
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-[#E2C275] border-[#E2C275] text-[#09090B]"
                          : "border-white/20 group-hover:border-white/40 bg-[#1C1C22]"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-sm transition-colors ${
                        isChecked
                          ? "text-white font-semibold"
                          : "text-zinc-300 group-hover:text-white"
                      }`}
                    >
                      {brand}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. QUICK FILTERS */}
      <div className="pt-4 border-t border-white/[0.08]">
        <button
          type="button"
          onClick={() => toggleSection("quick")}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-[#E2C275] transition-colors cursor-pointer"
        >
          <span>QUICK FILTERS</span>
          <span className="text-zinc-400">
            {openSections.quick ? (
              <Minus className="w-3.5 h-3.5" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
          </span>
        </button>

        {openSections.quick && (
          <div className="space-y-2.5 pt-2.5">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#16161C] border border-white/6 hover:border-white/12 transition-colors cursor-pointer select-none">
              <span className="text-sm text-zinc-300 font-medium">In Stock Only</span>
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={toggleInStock}
                className="accent-[#E2C275] w-4 h-4 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-xl bg-sky-950/20 border border-sky-400/20 hover:border-sky-400/35 transition-colors cursor-pointer select-none">
              <div className="flex items-center gap-1.5 text-sky-200">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span className="text-sm font-semibold">QR Verified Only</span>
              </div>
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={toggleVerified}
                className="accent-sky-400 w-4 h-4 rounded cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP STICKY COLLAPSIBLE SIDEBAR */}
      {isDesktopOpen && (
        <aside
          aria-label="Filter Catalog"
          className="hidden lg:block w-72 shrink-0 lg:sticky lg:top-28 lg:self-start"
        >
          <div
            data-lenis-prevent
            className="bg-[#111115] rounded-2xl border border-white/[0.08] p-5 shadow-xl lg:max-h-[calc(100vh-135px)] lg:overflow-y-auto overflow-x-hidden scrollbar-thin overscroll-contain"
          >
            {filterContent}
          </div>
        </aside>
      )}

      {/* MOBILE SLIDE-OVER DRAWER */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/80 cursor-pointer"
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <div
              data-lenis-prevent
              className="w-screen max-w-xs sm:max-w-sm bg-[#111115] border-r border-white/10 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto overscroll-contain"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <span className="text-base font-bold uppercase tracking-wider text-white font-sans">
                  Filter Catalog
                </span>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  aria-label="Close filters"
                  className="p-1.5 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                data-lenis-prevent
                className="flex-1 overflow-y-auto pr-1 overscroll-contain"
              >
                {filterContent}
              </div>

              <div className="pt-4 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold text-center cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
