"use client";

import React from "react";
import { SlidersHorizontal, LayoutGrid, List, ChevronDown } from "lucide-react";

interface ShopToolbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenMobileFilters: () => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  visibleCount: number;
  totalCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  itemsPerPage: number | "all";
  onItemsPerPageChange: (val: number | "all") => void;
  activeFilterCount: number;
}

export default function ShopToolbar({
  isSidebarOpen,
  onToggleSidebar,
  onOpenMobileFilters,
  viewMode,
  onViewModeChange,
  visibleCount,
  totalCount,
  sortBy,
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
  activeFilterCount,
}: ShopToolbarProps) {
  return (
    <div className="mb-6 bg-[#111115] border border-white/10 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-4">
      {/* Left Controls: Filter Toggle + Grid/List View Switcher */}
      <div className="flex items-center gap-3">
        {/* Desktop Filter Sidebar Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-expanded={isSidebarOpen}
          className={`hidden lg:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold cursor-pointer font-sans btn-aurafit-dark ${
            isSidebarOpen
              ? "border-[#E2C275]/55 text-[#E2C275]"
              : ""
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-[#E2C275] text-[#09090B] font-mono text-[10px] font-black leading-none">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Mobile Filter Drawer Trigger */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#16161C] border border-white/12 text-sm font-semibold text-zinc-200 hover:border-[#E2C275]/45 hover:text-white transition-all cursor-pointer font-sans"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#E2C275]" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-[#E2C275] text-[#09090B] font-mono text-[10px] font-black leading-none">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* View Mode Switcher */}
        <div
          role="group"
          aria-label="View mode"
          className="inline-flex items-center bg-[#09090B] border border-white/10 rounded-lg p-1 gap-1"
        >
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-[#E2C275] text-[#09090B] shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-[#E2C275] text-[#09090B] shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Status */}
      <div className="text-sm text-zinc-300 font-sans order-3 sm:order-2 w-full sm:w-auto text-center">
        {totalCount === 0 ? (
          <span>Showing 0 results</span>
        ) : (
          <span>
            Showing <strong className="text-white font-semibold">1–{visibleCount}</strong> of{" "}
            <strong className="text-white font-semibold">{totalCount}</strong> results
          </span>
        )}
      </div>

      {/* Right Controls: Sort Dropdown & Items Per Page */}
      <div className="flex items-center gap-2.5 order-2 sm:order-3 ml-auto sm:ml-0">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort products"
            className="appearance-none bg-[#16161C] border border-white/12 hover:border-[#E2C275]/45 focus:border-[#E2C275] rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-zinc-200 focus:outline-none cursor-pointer transition-colors font-sans"
          >
            <option value="featured">Default sorting</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>

        {/* Items Per Page Selector */}
        <div className="relative">
          <select
            value={itemsPerPage === "all" ? "all" : String(itemsPerPage)}
            onChange={(e) => {
              const val = e.target.value;
              onItemsPerPageChange(val === "all" ? "all" : Number(val));
            }}
            aria-label="Items per page"
            className="appearance-none bg-[#16161C] border border-white/12 hover:border-[#E2C275]/45 focus:border-[#E2C275] rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-zinc-200 focus:outline-none cursor-pointer transition-colors font-sans"
          >
            <option value="12">Show: 12</option>
            <option value="24">Show: 24</option>
            <option value="all">Show: All</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
