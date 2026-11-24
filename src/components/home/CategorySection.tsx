"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import StudioImage from "@/components/StudioImage";
import { CATEGORIES } from "@/data/mockProducts";

export default function CategorySection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-white/[0.08]"
    >
      {/* Two-Tone Uppercase Section Heading */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider font-heading">
          <span className="text-[#71717A]">SHOP BY </span>
          <span className="text-white">CATEGORY</span>
        </h2>

        <Link
          href="/shop"
          className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] hover:text-[#E2C275] flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 8-Column Responsive Category Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?cat=${cat.slug}`}
            className="group flex flex-col items-center text-center p-3 rounded-2xl bg-[#141418] border border-white/10 hover:border-[#E2C275]/50 hover:bg-[#18181E] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          >
            {/* Clean square dark studio image container ready for category PNG */}
            <div className="relative aspect-square w-full rounded-xl bg-[#0D0D10] border border-white/6 overflow-hidden p-3 flex items-center justify-center mb-3">
              <StudioImage
                src={cat.image}
                alt={cat.name}
                fill
                sizes="120px"
                objectFit="contain"
                fallbackLabel={cat.name}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Category label neatly centered below */}
            <span className="text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#E2C275] transition-colors font-heading line-clamp-1">
              {cat.name}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
              {cat.count} Items
            </span>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}

