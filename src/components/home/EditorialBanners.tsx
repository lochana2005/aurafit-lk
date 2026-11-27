"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import StudioImage from "@/components/StudioImage";
import { EDITORIAL_BANNERS } from "@/data/mockProducts";

export default function EditorialBanners() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-white/[0.08]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: "some", margin: "0px 0px -40px 0px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
      >
        {EDITORIAL_BANNERS.map((banner) => (
          <div
            key={banner.id}
            className="group relative rounded-2xl bg-[#141418] border border-white/12 overflow-hidden aspect-[16/10] sm:aspect-[16/9] flex flex-col justify-end p-6 sm:p-7 shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
          >
            {/* Background Photography Container */}
            <div className="absolute inset-0 z-0">
              <StudioImage
                src={banner.image}
                alt={banner.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                objectFit="cover"
                fallbackLabel={banner.title}
              />
              {/* Crisp dark gradient overlay for typography readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/80 to-transparent z-10" />
            </div>

            {/* Banner Typography & CTA */}
            <div className="relative z-20">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E2C275] block mb-1">
                {banner.sublabel}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase text-white font-heading tracking-wider leading-tight">
                {banner.title}
              </h3>

              <Link
                href={banner.ctaLink}
                className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider btn-aurafit-dark"
              >
                <span>{banner.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

