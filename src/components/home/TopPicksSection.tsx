"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { MOCK_PRODUCTS } from "@/data/mockProducts";

type CategoryFilter = "ALL" | "WHEY PROTEIN" | "CREATINE" | "PRE WORKOUT" | "MASS GAINER";

const FILTER_TABS: CategoryFilter[] = [
  "ALL",
  "WHEY PROTEIN",
  "CREATINE",
  "PRE WORKOUT",
  "MASS GAINER",
];

export default function TopPicksSection() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("ALL");

  const filteredProducts =
    selectedCategory === "ALL"
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter(
          (p) => p.category.toUpperCase() === selectedCategory.toUpperCase()
        );

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-white/[0.08]"
    >
      {/* Header row: Two-Tone Title on left + Interactive Category Tabs on right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider font-heading">
            <span className="text-white">TOP PICKS </span>
            <span className="text-[#71717A]">FOR YOU</span>
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Handpicked authentic nutrition stacks certified for Sri Lankan athletes.
          </p>
        </div>

        {/* Interactive Category Filter Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {FILTER_TABS.map((tab) => {
            const isActive = selectedCategory === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedCategory(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 select-none ${
                  isActive
                    ? "bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] text-[#09090B] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                    : "bg-[#141418] text-[#A1A1AA] hover:text-white border border-white/10 hover:border-white/20"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4-Column Responsive Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Bottom Catalog Redirect Strip */}
      <div className="mt-12 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#141418] hover:bg-[#1C1C22] border border-white/12 hover:border-[#E2C275]/50 transition-all shadow-md active:scale-95"
        >
          <span>Explore Entire Supplement Catalog (200+ Products)</span>
          <ArrowRight className="w-4 h-4 text-[#E2C275]" />
        </Link>
      </div>
    </motion.section>
  );
}

