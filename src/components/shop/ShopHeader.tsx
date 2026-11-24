"use client";

import React from "react";
import Link from "next/link";
import { Search, X, SlidersHorizontal, ChevronRight, ArrowUpDown } from "lucide-react";

interface ShopHeaderProps {
  totalProducts: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}

export default function ShopHeader({
  totalProducts,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onOpenMobileFilters,
  activeFilterCount,
}: ShopHeaderProps) {
  return (
    <div className="w-full bg-[#111115] border-b border-white/[0.08] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-zinc-400 mb-3"
        >
          <Link href="/" className="hover:text-[#E2C275] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-white font-medium">Shop Supplements</span>
        </nav>

        {/* Header Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wider text-white font-heading">
                SUPPLEMENT VAULT
              </h1>
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-bold font-mono text-[#E2C275] bg-[#E2C275]/10 border border-[#E2C275]/25">
                {totalProducts} Products
              </span>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              100% authentic, laboratory-verified sports nutrition imports directly from authorized global manufacturers.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:hidden text-xs text-zinc-400 font-mono">
            <span>Showing {totalProducts} verified items</span>
          </div>
        </div>

        {/* Toolbar: Live Search, Sort Dropdown & Mobile Filter Trigger */}
        <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
          {/* Live Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by product, brand, or flavor..."
              className="w-full bg-[#141418] border border-white/10 hover:border-white/20 focus:border-[#E2C275]/60 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white placeholder-zinc-400 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls Right */}
          <div className="flex items-center gap-3">
            {/* Mobile Filters Trigger */}
            <button
              type="button"
              onClick={onOpenMobileFilters}
              className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#141418] border border-white/12 text-sm font-semibold text-white hover:border-[#E2C275] transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#E2C275] text-[#09090B] font-mono text-[10px] font-black flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center gap-2 flex-1 sm:flex-none">
              <div className="relative w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  aria-label="Sort products"
                  className="w-full sm:w-48 appearance-none bg-[#141418] border border-white/12 hover:border-white/25 focus:border-[#E2C275]/60 rounded-xl pl-3.5 pr-8 py-2.5 text-sm font-medium text-white focus:outline-none cursor-pointer transition-colors"
                >
                  <option value="featured">Featured Stacks</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

