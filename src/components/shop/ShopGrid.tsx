"use client";

import React from "react";
import { X, RotateCcw, PackageSearch, Sparkles } from "lucide-react";
import { Product } from "@/data/mockProducts";
import ProductCard from "@/components/ProductCard";
import { FilterState, MAX_PRICE_LIMIT } from "./FilterSidebar";

interface ShopGridProps {
  products: Product[];
  viewMode: "grid" | "list";
  filters: FilterState;
  searchQuery: string;
  onRemoveCategory: (cat: string) => void;
  onRemoveBrand: (b: string) => void;
  onRemoveGoal: (g: string) => void;
  onResetPrice: () => void;
  onResetSearch: () => void;
  onToggleInStock: () => void;
  onToggleVerified: () => void;
  onClearAll: () => void;
}

export default function ShopGrid({
  products,
  viewMode,
  filters,
  searchQuery,
  onRemoveCategory,
  onRemoveBrand,
  onRemoveGoal,
  onResetPrice,
  onResetSearch,
  onToggleInStock,
  onToggleVerified,
  onClearAll,
}: ShopGridProps) {
  const hasPriceFilter =
    filters.minPrice > 0 || filters.maxPrice < MAX_PRICE_LIMIT;

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.goals.length > 0 ||
    hasPriceFilter ||
    filters.inStockOnly ||
    filters.verifiedOnly;

  return (
    <div className="flex-1 min-w-0">
      {/* =========================================================================
          ACTIVE FILTERS CHIP BAR
          ========================================================================= */}
      {hasActiveFilters && (
        <div className="mb-6 p-3.5 rounded-2xl bg-[#111115] border border-white/[0.08] flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans mr-1">
            Active:
          </span>

          {/* Search Query Chip */}
          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white bg-[#1C1C22] border border-white/12">
              <span>&ldquo;{searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={onResetSearch}
                aria-label="Remove search filter"
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Category Chips */}
          {filters.categories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#E2C275] bg-[#E2C275]/10 border border-[#E2C275]/30"
            >
              <span>{cat}</span>
              <button
                type="button"
                onClick={() => onRemoveCategory(cat)}
                aria-label={`Remove ${cat} category`}
                className="text-[#E2C275] hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Brand Chips */}
          {filters.brands.map((brand) => (
            <span
              key={brand}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-zinc-200 bg-[#1C1C22] border border-white/15"
            >
              <span>{brand}</span>
              <button
                type="button"
                onClick={() => onRemoveBrand(brand)}
                aria-label={`Remove ${brand} brand`}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Goal Chips */}
          {filters.goals.map((goal) => (
            <span
              key={goal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-zinc-200 bg-[#1C1C22] border border-white/15"
            >
              <span>{goal}</span>
              <button
                type="button"
                onClick={() => onRemoveGoal(goal)}
                aria-label={`Remove ${goal} goal`}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Price Range Chip */}
          {hasPriceFilter && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-zinc-200 bg-[#1C1C22] border border-white/15">
              <span>
                Rs. {filters.minPrice.toLocaleString("en-LK")} – Rs.{" "}
                {filters.maxPrice.toLocaleString("en-LK")}
              </span>
              <button
                type="button"
                onClick={onResetPrice}
                aria-label="Remove price filter"
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* In Stock Only Chip */}
          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30">
              <span>In Stock Only</span>
              <button
                type="button"
                onClick={onToggleInStock}
                aria-label="Remove in stock filter"
                className="text-emerald-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Verified Only Chip */}
          {filters.verifiedOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-sky-300 bg-sky-950/40 border border-sky-400/30">
              <span>QR Verified Only</span>
              <button
                type="button"
                onClick={onToggleVerified}
                aria-label="Remove verified filter"
                className="text-sky-300 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Clear All Button */}
          <button
            type="button"
            onClick={onClearAll}
            className="ml-auto text-xs font-bold uppercase text-[#E2C275] hover:underline flex items-center gap-1 cursor-pointer py-1 px-2"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          PRODUCT GRID OR EMPTY STATE
          ========================================================================= */}
      {products.length === 0 ? (
        <div className="py-20 px-6 rounded-2xl bg-[#111115] border border-white/[0.08] text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#18181E] border border-white/10 flex items-center justify-center mb-4 text-[#E2C275]">
            <PackageSearch className="w-8 h-8 stroke-[1.8]" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white font-heading">
            No Supplements Match Your Filters
          </h3>

          <p className="text-zinc-400 text-xs sm:text-sm max-w-md mt-2 leading-relaxed">
            We couldn&apos;t find any products matching your current combination of keywords, categories, or price ranges.
          </p>

          <button
            type="button"
            onClick={onClearAll}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : viewMode === "list" ? (
        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="list" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} viewMode="grid" />
          ))}
        </div>
      )}

      {/* Bottom Advice Banner */}
      {products.length > 0 && (
        <div className="mt-12 p-6 rounded-2xl bg-[#111115] border border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/25 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase font-heading text-white">
                Unsure which stack fits your fitness goals?
              </h4>
              <p className="text-xs text-zinc-400">
                Let AuraFit AI generate a customized nutrition plan for your training splits.
              </p>
            </div>
          </div>

          <a
            href="/ai-coach"
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-sky-200 bg-sky-400/10 hover:bg-sky-400/20 border border-sky-400/30 transition-all shrink-0"
          >
            Launch AI Coach
          </a>
        </div>
      )}
    </div>
  );
}

