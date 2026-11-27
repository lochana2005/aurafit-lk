"use client";

import React from "react";
import Link from "next/link";
import { Search, X, ChevronRight } from "lucide-react";

interface ShopHeaderProps {
  totalProducts: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function ShopHeader({
  totalProducts,
  searchQuery,
  onSearchChange,
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

        {/* Header Title & Live Search */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
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

          {/* Live Search Input */}
          <div className="relative w-full lg:w-96 shrink-0">
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
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

