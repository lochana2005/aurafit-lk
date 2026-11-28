"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";

interface CategoryItem {
  id: string;
  name: string;
  href: string;
  image: string;
  color: string;
  subBadge: string;
}

const CATEGORIES_8: CategoryItem[] = [
  {
    id: "cat-whey",
    name: "Whey Protein",
    href: "/shop?category=Whey%20Protein",
    image: "/images/categories/whey-protein.png",
    color: "#E2C275",
    subBadge: "ISOLATE",
  },
  {
    id: "cat-gainer",
    name: "Mass Gainer",
    href: "/shop?category=Mass%20Gainer",
    image: "/images/categories/mass-gainer.png",
    color: "#F59E0B",
    subBadge: "SURPLUS",
  },
  {
    id: "cat-preworkout",
    name: "Pre Workout",
    href: "/shop?category=Pre%20Workout",
    image: "/images/categories/pre-workout.png",
    color: "#38BDF8",
    subBadge: "NITRIC PUMP",
  },
  {
    id: "cat-creatine",
    name: "Creatine",
    href: "/shop?category=Creatine",
    image: "/images/categories/creatine.png",
    color: "#E2C275",
    subBadge: "CREAPURE",
  },
  {
    id: "cat-bcaa",
    name: "BCAA",
    href: "/shop?category=BCAA",
    image: "/images/categories/bcaa.png",
    color: "#A78BFA",
    subBadge: "RECOVERY",
  },
  {
    id: "cat-amino",
    name: "Amino",
    href: "/shop?category=Amino",
    image: "/images/categories/amino.png",
    color: "#06B6D4",
    subBadge: "AMINO 9",
  },
  {
    id: "cat-fatburner",
    name: "Fat Burner",
    href: "/shop?category=Fat%20Burner",
    image: "/images/categories/fat-burner.png",
    color: "#EF4444",
    subBadge: "THERMO",
  },
  {
    id: "cat-vitamins",
    name: "Multivitamins",
    href: "/shop?category=Multivitamins",
    image: "/images/categories/multivitamins.png",
    color: "#10B981",
    subBadge: "VITALITY",
  },
];

function SupplementClusterSVG({ item }: { item: CategoryItem }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-32 h-32 sm:w-36 sm:h-36 max-w-none object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1.5"
    >
      <ellipse cx="100" cy="178" rx="72" ry="14" fill="rgba(0,0,0,0.8)" />
      {/* Left Shaker */}
      <g transform="translate(24, 76)">
        <rect x="8" y="12" width="34" height="82" rx="6" fill="#1A1A22" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <path d="M10 28 Q25 32 40 28 L39 74 Q25 78 11 74 Z" fill={item.color} fillOpacity="0.18" />
        <rect x="5" y="2" width="40" height="12" rx="3" fill="#2A2A36" stroke={item.color} strokeWidth="1" strokeOpacity="0.4" />
        <rect x="20" y="-5" width="10" height="8" rx="2" fill={item.color} />
        <line x1="8" y1="50" x2="42" y2="50" stroke={item.color} strokeWidth="2" strokeOpacity="0.8" />
      </g>
      {/* Central Tub */}
      <g transform="translate(54, 30)">
        <rect x="12" y="10" width="68" height="16" rx="4" fill="#2A2A36" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <line x1="28" y1="10" x2="28" y2="26" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1="46" y1="10" x2="46" y2="26" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1="64" y1="10" x2="64" y2="26" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <path d="M8 32 C8 26, 16 26, 20 26 L72 26 C76 26, 84 26, 84 32 L88 136 C88 142, 80 144, 46 144 C12 144, 4 142, 4 136 Z" fill="#14141C" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <path d="M5 52 L87 52 L86 118 L6 118 Z" fill="#0D0D12" stroke={item.color} strokeWidth="1.2" strokeOpacity="0.7" />
        <rect x="5" y="52" width="82" height="4" fill={item.color} />
        <rect x="5" y="114" width="82" height="4" fill={item.color} />
        <text x="46" y="74" textAnchor="middle" fill="white" fontFamily="sans-serif" fontWeight="900" fontSize="8.5" letterSpacing="1.5">AURAFIT</text>
        <text x="46" y="90" textAnchor="middle" fill={item.color} fontFamily="sans-serif" fontWeight="900" fontSize="10" letterSpacing="1">{item.name.toUpperCase()}</text>
        <text x="46" y="104" textAnchor="middle" fill="#A1A1AA" fontFamily="sans-serif" fontWeight="700" fontSize="6.5" letterSpacing="1.5">{item.subBadge}</text>
      </g>
      {/* Right Canister */}
      <g transform="translate(126, 94)">
        <rect x="6" y="0" width="30" height="10" rx="2.5" fill="#282834" stroke={item.color} strokeWidth="1.2" strokeOpacity="0.7" />
        <rect x="2" y="10" width="38" height="62" rx="5" fill="#121218" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <rect x="3" y="22" width="36" height="36" fill="#1A1A24" stroke={item.color} strokeWidth="0.8" strokeOpacity="0.4" />
        <rect x="3" y="22" width="36" height="2.5" fill={item.color} />
        <rect x="3" y="55.5" width="36" height="2.5" fill={item.color} />
      </g>
    </svg>
  );
}

export default function CategorySection() {
  const { categories: adminCategories, isHydrated } = useAdmin();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const displayedCategories: CategoryItem[] = isHydrated
    ? [...adminCategories]
        .filter((c) => c.isActive)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((c) => {
          const matched = CATEGORIES_8.find(
            (item) => item.name.toLowerCase() === c.name.toLowerCase()
          );
          const resolvedImage = c.image || matched?.image || "";
          return {
            id: c.id,
            name: c.name,
            href: `/shop?category=${encodeURIComponent(c.name)}`,
            image: resolvedImage,
            color: matched?.color || "#E2C275",
            subBadge:
              matched?.subBadge ||
              (c.tagline
                ? c.tagline.split(" ")[0].toUpperCase().slice(0, 10)
                : "FORMULA"),
          };
        })
    : CATEGORIES_8;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-white/[0.08]">
      {/* Dual-Tone Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: "some" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center justify-between mb-8 sm:mb-12"
      >
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight">
          <span className="text-zinc-500">SHOP BY </span>
          <span className="text-white">CATEGORY</span>
        </h2>

        <Link
          href="/shop"
          className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400 hover:text-[#E2C275] transition-colors"
        >
          <span>VIEW ALL</span>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#E2C275] group-hover:translate-x-1 transition-all duration-200" />
        </Link>
      </motion.div>

      {/* 8 Frameless Categories Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: "some", margin: "0px 0px -40px 0px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-5 gap-y-8"
      >
        {displayedCategories.map((cat, idx) => (
          <Link
            key={cat.id}
            href={cat.href}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="group flex flex-col items-center text-center cursor-pointer select-none"
          >
            {/* Circular Backdrop Medallion */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full relative flex items-center justify-center bg-[#16161C] border border-white/[0.06] transition-all duration-300 group-hover:bg-[#E2C275] group-hover:border-[#E2C275] group-hover:shadow-[0_0_28px_rgba(226,194,117,0.35)]">
              {/* 3D Pop-Out Supplement Cluster */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {!cat.image || failedImages[cat.id] ? (
                  <SupplementClusterSVG item={cat} />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={cat.image}
                    alt={cat.name}
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [cat.id]: true }))
                    }
                    className="w-32 h-32 sm:w-36 sm:h-36 max-w-none object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1.5"
                  />
                )}
              </div>
            </div>

            {/* Title Below */}
            <span className="font-heading text-base sm:text-lg font-bold tracking-wide text-zinc-200 group-hover:text-[#E2C275] mt-4 transition-colors leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </motion.div>

      {/* Minimal Pagination Dots Below */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {displayedCategories.map((cat, idx) => {
          const isActive = hoveredIdx === idx || (hoveredIdx === null && idx === 0);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setHoveredIdx(idx)}
              aria-label={`Select category ${cat.name}`}
              className={`transition-all duration-200 cursor-pointer ${
                isActive
                  ? "w-2.5 h-2.5 rounded-full border border-[#E2C275] bg-transparent scale-110"
                  : "w-1.5 h-1.5 rounded-full bg-zinc-600 hover:bg-zinc-400"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
