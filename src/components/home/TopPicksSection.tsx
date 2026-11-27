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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 border-t border-white/[0.08]">
      {/* Header row: Two-Tone Title on left + Interactive Category Tabs on right */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: "some" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8"
      >
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
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 select-none cursor-pointer ${
                  isActive
                    ? "btn-aurafit-gold"
                    : "btn-aurafit-dark text-[#A1A1AA]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* 4-Column Responsive Product Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: "some", margin: "0px 0px -40px 0px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>

      {/* Bottom Catalog Redirect Strip */}
      <div className="mt-12 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider btn-aurafit-dark shadow-md"
        >
          <span>Explore Entire Supplement Catalog (200+ Products)</span>
          <ArrowRight className="w-4 h-4 text-[#E2C275]" />
        </Link>
      </div>
    </section>
  );
}

