"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Award } from "lucide-react";

interface BrandItem {
  id: string;
  name: string;
  queryParam: string;
  logo: React.ReactNode;
}

const GLOBAL_BRANDS: BrandItem[] = [
  {
    id: "ronnie-coleman",
    name: "RONNIE COLEMAN",
    queryParam: "Ronnie Coleman",
    logo: (
      <div className="flex items-center gap-3.5 group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 40 36" fill="currentColor" className="w-9 h-8 sm:w-10 sm:h-9 shrink-0">
          <polygon points="10,11 14,5 20,9 26,5 30,11" fill="#E2C275" />
          <text x="4" y="27" fontFamily="sans-serif" fontWeight="900" fontSize="18" fill="currentColor">
            RC
          </text>
          <path d="M4 31h32" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        <div className="flex flex-col text-left">
          <span className="font-heading font-black text-base sm:text-lg tracking-wider leading-none">
            RONNIE COLEMAN
          </span>
          <span className="text-[9px] font-mono tracking-[0.22em] text-[#E2C275] uppercase leading-none mt-1">
            SIGNATURE SERIES
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "on",
    name: "OPTIMUM NUTRITION",
    queryParam: "Optimum Nutrition",
    logo: (
      <div className="flex items-center gap-3.5 group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 36 36" fill="currentColor" className="w-8 h-8 sm:w-9 sm:h-9 shrink-0">
          <rect x="2" y="2" width="32" height="32" rx="7" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="13" cy="18" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
          <path
            d="M20 12v12l7-12v12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
        <div className="flex flex-col text-left tracking-wider">
          <span className="font-heading font-black text-base sm:text-lg tracking-widest leading-none">
            OPTIMUM
          </span>
          <span className="font-heading font-bold text-xs sm:text-sm tracking-[0.25em] text-zinc-400 leading-none mt-1">
            NUTRITION
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "muscletech",
    name: "MUSCLETECH",
    queryParam: "MuscleTech",
    logo: (
      <div className="flex items-center gap-3.5 group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 36 36" fill="currentColor" className="w-8 h-8 sm:w-9 sm:h-9 shrink-0">
          <path d="M4 28V8l7 9 7-9v20h-4V15l-3 4-3-4v13H4z" />
          <path d="M22 8h10v4h-3v16h-4V12h-3V8z" fill="#E2C275" />
          <line x1="2" y1="32" x2="34" y2="32" stroke="currentColor" strokeWidth="2" />
        </svg>
        <div className="flex flex-col text-left">
          <span className="font-heading font-black text-lg sm:text-xl tracking-wider italic leading-none">
            MUSCLETECH
          </span>
          <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-400 uppercase leading-none mt-1">
            RESEARCH &amp; DEV
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "dymatize",
    name: "DYMATIZE",
    queryParam: "Dymatize",
    logo: (
      <div className="flex items-center gap-3.5 group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 36 36" fill="currentColor" className="w-8 h-8 sm:w-9 sm:h-9 shrink-0">
          <path d="M6 6h12c7.5 0 13 4.8 13 12s-5.5 12-13 12H6V6zm6 5v14h6c4.5 0 7.5-2.8 7.5-7s-3-7-7.5-7h-6z" />
          <polygon points="17,14 26,18 17,22" fill="#E2C275" className="opacity-90" />
        </svg>
        <div className="flex flex-col text-left">
          <span className="font-heading font-black text-lg sm:text-xl tracking-widest italic leading-none">
            DYMATIZE
          </span>
          <span className="text-[9px] font-mono tracking-[0.22em] text-zinc-400 uppercase leading-none mt-1">
            ELITE ATHLETICS
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "applied-nutrition",
    name: "APPLIED NUTRITION",
    queryParam: "Applied Nutrition",
    logo: (
      <div className="flex items-center gap-3.5 group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 36 36" fill="currentColor" className="w-8 h-8 sm:w-9 sm:h-9 shrink-0">
          <polygon points="18,3 33,31 3,31" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <polygon points="18,9 28,28 8,28" fill="none" stroke="#E2C275" strokeWidth="1.5" />
          <line x1="10" y1="23" x2="26" y2="23" stroke="currentColor" strokeWidth="2" />
        </svg>
        <div className="flex flex-col text-left">
          <span className="font-heading font-extrabold text-base sm:text-lg tracking-widest leading-none">
            APPLIED
          </span>
          <span className="font-heading font-bold text-xs sm:text-sm tracking-[0.2em] text-zinc-400 leading-none mt-1">
            NUTRITION
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "cellucor",
    name: "CELLUCOR",
    queryParam: "Cellucor",
    logo: (
      <div className="flex items-center gap-3.5 group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 36 36" fill="currentColor" className="w-8 h-8 sm:w-9 sm:h-9 shrink-0">
          <polygon points="18,3 31,10.5 31,25.5 18,33 5,25.5 5,10.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <text x="18" y="23" fontFamily="sans-serif" fontWeight="900" fontSize="13" textAnchor="middle" fill="#E2C275">
            C4
          </text>
        </svg>
        <div className="flex flex-col text-left">
          <span className="font-heading font-black text-lg sm:text-xl tracking-widest leading-none">
            CELLUCOR
          </span>
          <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-400 uppercase leading-none mt-1">
            EXPLOSIVE ENERGY
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "bsn",
    name: "BSN",
    queryParam: "BSN",
    logo: (
      <div className="flex items-center gap-3.5 group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 44 36" fill="currentColor" className="w-10 h-8 sm:w-11 sm:h-9 shrink-0">
          <rect x="2" y="6" width="40" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
          <text
            x="22"
            y="23"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="14"
            letterSpacing="1"
            textAnchor="middle"
            fill="currentColor"
          >
            BSN
          </text>
          <circle cx="6" cy="18" r="2" fill="#E2C275" />
          <circle cx="38" cy="18" r="2" fill="#E2C275" />
        </svg>
        <div className="flex flex-col text-left">
          <span className="font-heading font-black text-lg sm:text-xl tracking-widest leading-none">
            BSN
          </span>
          <span className="text-[9px] font-mono tracking-[0.2em] text-[#E2C275] uppercase leading-none mt-1">
            FINISH FIRST.
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "myprotein",
    name: "MYPROTEIN",
    queryParam: "MyProtein",
    logo: (
      <div className="flex items-center gap-3.5 group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 36 36" fill="currentColor" className="w-8 h-8 sm:w-9 sm:h-9 shrink-0">
          <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path
            d="M11 24V12l7 7 7-7v12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="24" r="2" fill="#E2C275" />
        </svg>
        <div className="flex flex-col text-left">
          <span className="font-heading font-black text-base sm:text-lg tracking-widest leading-none">
            MYPROTEIN
          </span>
          <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-400 uppercase leading-none mt-1">
            FUEL AMBITION
          </span>
        </div>
      </div>
    ),
  },
];

export default function BrandMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const offsetRef = useRef(0);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      if (!isPausedRef.current && trackRef.current) {
        // Smoothly decrement offset at 60fps (normalized by delta time to eliminate jitter)
        const step = 0.65 * (Math.min(delta, 50) / 16.667);
        offsetRef.current -= step;

        const halfWidth = trackRef.current.scrollWidth / 2;
        if (halfWidth > 0 && Math.abs(offsetRef.current) >= halfWidth) {
          offsetRef.current += halfWidth;
        }

        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section className="w-full py-14 sm:py-18 border-t border-white/[0.08] relative z-10 overflow-x-clip bg-[#09090B]">
      {/* Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#141418] border border-[#E2C275]/30 text-[#E2C275] text-[10px] sm:text-xs font-bold tracking-widest uppercase font-mono mb-3 shadow-[0_0_16px_rgba(226,194,117,0.08)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E2C275]" />
          <span>AUTHORIZED GLOBAL PARTNERS · 100% DIRECT IMPORTS</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider font-heading text-white">
          <span>TRUSTED WORLD-CLASS </span>
          <span className="text-[#E2C275]">BRANDS</span>
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl mx-auto leading-relaxed">
          Sourced directly from certified pharmaceutical-grade manufacturing facilities in the United States and the United Kingdom.
        </p>
      </div>

      {/* Infinite Scrolling Marquee Track Container */}
      <div
        className="relative w-full overflow-hidden marquee-container py-3"
        onMouseEnter={() => {
          isPausedRef.current = true;
        }}
        onMouseLeave={() => {
          isPausedRef.current = false;
        }}
      >
        {/* Left Edge Gradient Fade Mask */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-44 lg:w-64 z-20 bg-gradient-to-r from-[#09090B] via-[#09090B]/90 to-transparent" />

        {/* Right Edge Gradient Fade Mask */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-44 lg:w-64 z-20 bg-gradient-to-l from-[#09090B] via-[#09090B]/90 to-transparent" />

        {/* Moving Track */}
        <div
          ref={trackRef}
          className="flex w-max items-center will-change-transform"
        >
          {/* Group 1 */}
          <div className="flex shrink-0 items-center gap-12 sm:gap-16 pr-12 sm:pr-16">
            {GLOBAL_BRANDS.map((brand) => (
              <Link
                key={brand.id}
                href={`/shop?brand=${encodeURIComponent(brand.queryParam)}`}
                className="group shrink-0 flex items-center text-zinc-300 opacity-75 hover:opacity-100 hover:text-[#E2C275] transition-all duration-300 cursor-pointer select-none"
              >
                {brand.logo}
              </Link>
            ))}
          </div>

          {/* Group 2 (Duplicate for seamless loop) */}
          <div aria-hidden="true" className="flex shrink-0 items-center gap-12 sm:gap-16 pr-12 sm:pr-16">
            {GLOBAL_BRANDS.map((brand) => (
              <Link
                key={`${brand.id}-dup`}
                tabIndex={-1}
                href={`/shop?brand=${encodeURIComponent(brand.queryParam)}`}
                className="group shrink-0 flex items-center text-zinc-300 opacity-75 hover:opacity-100 hover:text-[#E2C275] transition-all duration-300 cursor-pointer select-none"
              >
                {brand.logo}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Micro-assurance footer strip */}
      <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-mono text-zinc-500 px-4 text-center">
        <span className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#E2C275]" />
          <span>Exclusive Brand Authorization</span>
        </span>
        <span className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:inline" />
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>Tamper-Proof Holographic Security Seal</span>
        </span>
        <span className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:inline" />
        <span>Direct Air Freight &amp; Temperature Controlled Storage</span>
      </div>
    </section>
  );
}

