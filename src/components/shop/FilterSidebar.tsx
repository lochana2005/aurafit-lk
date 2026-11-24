"use client";

import React from "react";
import {
  X,
  RotateCcw,
  ShieldCheck,
  Check,
} from "lucide-react";
import { ProductCategory, FitnessGoal } from "@/data/mockProducts";

export interface FilterState {
  categories: ProductCategory[];
  goals: FitnessGoal[];
  brands: string[];
  priceRange: "all" | "under-15k" | "15k-30k" | "over-30k";
  inStockOnly: boolean;
  verifiedOnly: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (next: FilterState) => void;
  onClearAll: () => void;
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
  "Applied Nutrition",
  "MuscleTech",
  "Ronnie Coleman",
  "Cellucor",
];

const PRICE_RANGES = [
  { id: "all", label: "All Prices" },
  { id: "under-15k", label: "Under Rs. 15,000" },
  { id: "15k-30k", label: "Rs. 15,000 – 30,000" },
  { id: "over-30k", label: "Rs. 30,000+" },
] as const;

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClearAll,
  isMobileOpen,
  onCloseMobile,
  categoryCounts,
  brandCounts,
  goalCounts,
  hasActiveFilters,
}: FilterSidebarProps) {
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

  const setPriceRange = (range: FilterState["priceRange"]) => {
    onFilterChange({ ...filters, priceRange: range });
  };

  const toggleInStock = () => {
    onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly });
  };

  const toggleVerified = () => {
    onFilterChange({ ...filters, verifiedOnly: !filters.verifiedOnly });
  };

  // Reusable Content Inner
  const filterContent = (
    <div className="space-y-6 text-xs text-zinc-300">
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <span className="text-xs font-bold uppercase tracking-wider text-white font-heading">
          Filter By
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-semibold text-[#E2C275] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. CATEGORIES */}
      <div>
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-heading mb-3">
          Categories
        </h4>
        <div className="space-y-1.5">
          {ALL_CATEGORIES.map((cat) => {
            const isChecked = filters.categories.includes(cat);
            const count = categoryCounts[cat] || 0;
            return (
              <div
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer select-none group"
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
                    className={`text-xs ${
                      isChecked ? "text-white font-semibold" : "text-zinc-300"
                    }`}
                  >
                    {cat}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. FITNESS GOALS (Pill Toggles) */}
      <div className="pt-4 border-t border-white/[0.08]">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-heading mb-3">
          Training Goal
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {ALL_GOALS.map((goal) => {
            const isSelected = filters.goals.includes(goal);
            const count = goalCounts[goal] || 0;
            return (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 select-none cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#E2C275] text-[#09090B] font-bold shadow-sm"
                    : "bg-[#141418] text-zinc-400 hover:text-white border border-white/10 hover:border-white/25"
                }`}
              >
                <span>{goal}</span>
                <span className={`text-[10px] font-mono opacity-70`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. BRANDS */}
      <div className="pt-4 border-t border-white/[0.08]">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-heading mb-3">
          Brands
        </h4>
        <div className="space-y-1.5">
          {ALL_BRANDS.map((brand) => {
            const isChecked = filters.brands.includes(brand);
            const count = brandCounts[brand] || 0;
            return (
              <div
                key={brand}
                onClick={() => toggleBrand(brand)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer select-none group"
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
                    className={`text-xs ${
                      isChecked ? "text-white font-semibold" : "text-zinc-300"
                    }`}
                  >
                    {brand}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. PRICE RANGE */}
      <div className="pt-4 border-t border-white/[0.08]">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-heading mb-3">
          Price Range (LKR)
        </h4>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => {
            const isSelected = filters.priceRange === range.id;
            return (
              <label
                key={range.id}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer select-none"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={isSelected}
                  onChange={() => setPriceRange(range.id)}
                  className="accent-[#E2C275] w-3.5 h-3.5 cursor-pointer"
                />
                <span
                  className={`text-xs ${
                    isSelected ? "text-white font-semibold" : "text-zinc-400"
                  }`}
                >
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. QUICK TOGGLES */}
      <div className="pt-4 border-t border-white/[0.08] space-y-3">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-heading">
          Quick Filters
        </h4>

        {/* In Stock Only */}
        <label className="flex items-center justify-between p-2 rounded-xl bg-[#141418] border border-white/6 hover:border-white/12 transition-colors cursor-pointer select-none">
          <span className="text-xs text-zinc-200">In Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={toggleInStock}
            className="accent-[#E2C275] w-4 h-4 rounded cursor-pointer"
          />
        </label>

        {/* QR Batch Verified Only */}
        <label className="flex items-center justify-between p-2 rounded-xl bg-sky-950/20 border border-sky-400/20 hover:border-sky-400/35 transition-colors cursor-pointer select-none">
          <div className="flex items-center gap-1.5 text-sky-200">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs font-semibold">QR Verified Only</span>
          </div>
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={toggleVerified}
            className="accent-sky-400 w-4 h-4 rounded cursor-pointer"
          />
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside aria-label="Filters" className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-28 bg-[#111115] rounded-2xl border border-white/[0.08] p-5 shadow-lg">
          {filterContent}
        </div>
      </aside>

      {/* MOBILE SLIDE-OVER DRAWER */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/80 cursor-pointer"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-xs sm:max-w-sm bg-[#111115] border-r border-white/10 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <span className="text-base font-bold uppercase tracking-wider text-white font-heading">
                  Filter Catalog
                </span>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1.5 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                {filterContent}
              </div>

              <div className="pt-4 border-t border-white/10 mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center cursor-pointer"
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
