"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product, MOCK_PRODUCTS } from "@/data/mockProducts";
import ProductCard from "@/components/ProductCard";

interface RelatedProductsProps {
  currentProduct: Product;
}

export default function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  // Find products in the same category or goal
  const related = MOCK_PRODUCTS.filter(
    (p) => p.id !== currentProduct.id && p.category === currentProduct.category
  );

  // If fewer than 4, fill with other supplements
  const fallback = MOCK_PRODUCTS.filter(
    (p) => p.id !== currentProduct.id && p.category !== currentProduct.category
  );

  const displayList = [...related, ...fallback].slice(0, 4);

  if (displayList.length === 0) return null;

  return (
    <section className="w-full mt-20 pt-12 border-t border-white/[0.08]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E2C275] font-heading block mb-1">
            Compatible Stacks
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white font-heading">
            You May Also Like
          </h2>
        </div>

        <Link
          href={`/shop?category=${encodeURIComponent(currentProduct.category)}`}
          className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-[#E2C275] flex items-center gap-1.5 transition-colors"
        >
          <span>View All {currentProduct.category}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

