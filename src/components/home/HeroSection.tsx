"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, QrCode, Sparkles, Truck } from "lucide-react";
import StudioImage from "@/components/StudioImage";
import { HERO_SLIDES } from "@/data/mockProducts";

const AUTHORIZED_BRANDS = [
  "OPTIMUM NUTRITION",
  "DYMATIZE",
  "MUSCLETECH",
  "APPLIED NUTRITION",
  "RONNIE COLEMAN",
  "CELLUCOR",
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const currentHeroSlide = HERO_SLIDES[activeSlide] || HERO_SLIDES[0];

  return (
    <section className="relative w-full max-w-[1380px] mx-auto px-4 sm:px-6 pt-5 pb-8 lg:min-h-[calc(100vh-115px)] flex flex-col justify-between">
      {/* =========================================================================
          HERO CARDS GRID (Sleek Proportional 470px Height)
          ========================================================================= */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Left Main Hero Banner (8 columns, proportional 470px height) */}
        <div className="lg:col-span-8 relative rounded-2xl bg-gradient-to-br from-[#1C1C22] to-[#111114] border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.6)] overflow-hidden min-h-[440px] sm:min-h-[460px] lg:h-[470px] flex flex-col justify-between p-6 sm:p-8 lg:p-10 group">
          {/* Background Studio Photography Container with Dark Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <StudioImage
              src={currentHeroSlide.image}
              alt={currentHeroSlide.headline}
              fill
              priority
              objectFit="cover"
              objectPosition="right"
              fallbackLabel="HERO BANNER STUDIO PHOTOGRAPHY"
            />
            {/* Subtle left-to-right dark gradient overlay: typography stays crisp while right-side supplement bottles remain clearly visible at true proportion */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-[#09090B]/85 sm:via-[#09090B]/60 to-transparent z-10" />
          </div>

          {/* Top Tag inside Main Banner */}
          <div className="relative z-20 max-w-full md:max-w-[48%] mb-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#F0D78C] bg-[#09090B]/95 border border-[#F0D78C]/35">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0D78C] gold-badge-glow" />
              {currentHeroSlide.tag}
            </span>
          </div>

          {/* Content inside Main Banner (Barlow Condensed 2-Line Headline with whitespace-nowrap) */}
          <div className="relative z-20 w-full md:max-w-[48%] my-auto">
            <h1 className="text-4xl xl:text-5xl font-bold tracking-wide uppercase leading-[1.0] font-heading">
              <span className="text-white block whitespace-nowrap white-glow-headline">PURE PERFORMANCE.</span>
              <span className="gold-shimmer-headline block whitespace-nowrap">100% AUTHENTIC.</span>
            </h1>
            <p className="text-zinc-200 text-sm sm:text-base mt-3.5 leading-relaxed font-normal">
              {currentHeroSlide.subtext}
            </p>

            <div className="mt-6 flex flex-wrap sm:flex-nowrap items-center gap-3">
              <Link
                href={currentHeroSlide.ctaLink}
                className="px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 active:scale-95 transition-all duration-200 flex items-center gap-2 shrink-0"
              >
                <span>{currentHeroSlide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>

              <Link
                href="/verify"
                className="px-5 py-3 rounded-full text-sm font-bold uppercase tracking-wider text-sky-100 bg-[#1C1C21] hover:bg-sky-400/10 border border-sky-400/30 hover:border-sky-400/60 transition-all active:scale-95 shrink-0"
              >
                Verify Batch
              </Link>
            </div>
          </div>

          {/* Bottom Slider Dots */}
          <div className="relative z-20 flex items-center gap-2 pt-2">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlide === idx
                    ? "w-8 bg-[#E2C275]"
                    : "w-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side Promo Banner (4 columns, proportional 470px height & p-6) */}
        <div className="lg:col-span-4 relative rounded-2xl bg-gradient-to-br from-[#1C1C22] to-[#111114] border border-sky-400/25 shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(56,189,248,0.08)] overflow-hidden min-h-[440px] sm:min-h-[460px] lg:h-[470px] flex flex-col justify-between p-6">
          {/* Background Studio Photography with object-top alignment */}
          <div className="absolute inset-0 z-0">
            <StudioImage
              src="/images/banners/hero-verify.jpg"
              alt="QR Authenticity Verification"
              fill
              priority
              objectFit="cover"
              objectPosition="top"
              fallbackLabel="AUTHENTICITY PROMO PHOTO"
            />
            {/* Gradient overlay: transparent top half so glowing QR code & logo appear cleanly; dark bottom for readable text */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] from-45% via-[#09090B]/80 via-60% to-transparent z-10" />
          </div>

          {/* Top Tag inside Right Banner */}
          <div className="relative z-20 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#F0D78C] bg-[#09090B]/90 border border-[#F0D78C]/35 px-3.5 py-1.5 rounded-full shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0D78C] gold-badge-glow" />
              AUTHENTICITY ASSURED
            </span>
            <div className="p-1.5 rounded-full bg-[#09090B]/90 border border-white/10 shadow-lg flex items-center justify-center gold-badge-glow">
              <ShieldCheck className="w-4 h-4 text-[#F0D78C]" />
            </div>
          </div>

          {/* Content inside Right Banner: compact & comfortably fit inside 470px */}
          <div className="relative z-20 mt-auto space-y-3">
            <h3 className="text-2xl lg:text-[1.75rem] font-bold uppercase tracking-wider font-heading text-white leading-tight">
              SCAN &amp; VERIFY YOUR BATCH CODE
            </h3>
            <p className="text-zinc-200 text-sm leading-relaxed">
              Counterfeit-free guarantee. Every container carries an authentic holographic QR code linked directly to the manufacturer&apos;s laboratory test report.
            </p>

            <div className="space-y-2 pt-1">
              <Link
                href="/verify"
                className="w-full py-2.5 px-4 rounded-xl text-sm font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:brightness-105 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <QrCode className="w-4 h-4 stroke-[2.3]" />
                <span>Verify Batch Code</span>
              </Link>

              <Link
                href="/ai-coach"
                className="w-full py-2.5 px-4 rounded-xl text-sm font-bold uppercase tracking-wider text-sky-200 bg-[#141418] hover:bg-sky-400/15 border border-sky-400/30 hover:border-sky-400/50 transition-all flex items-center justify-center gap-2 text-center"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                <span>Build Stack with AI</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 1: 4-COLUMN TRUST STRIP (Sleek Dark Glass Bar)
          ========================================================================= */}
      <div className="mt-6 rounded-2xl bg-[#111114] border border-white/[0.08] grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        {/* Item 1 */}
        <div className="flex items-center gap-3.5 p-4 sm:p-5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-[#E2C275]/25 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#E2C275]" />
          </div>
          <div>
            <h4 className="text-base font-bold tracking-wide uppercase font-heading text-white">
              100% Authentic
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 leading-snug">
              Direct manufacturer imports
            </p>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex items-center gap-3.5 p-4 sm:p-5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-[#E2C275]/25 flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5 text-[#E2C275]" />
          </div>
          <div>
            <h4 className="text-base font-bold tracking-wide uppercase font-heading text-white">
              QR Batch Verified
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 leading-snug">
              Scan &amp; verify every tub
            </p>
          </div>
        </div>

        {/* Item 3 */}
        <div className="flex items-center gap-3.5 p-4 sm:p-5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-[#E2C275]/25 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-[#E2C275]" />
          </div>
          <div>
            <h4 className="text-base font-bold tracking-wide uppercase font-heading text-white">
              24–48h Delivery
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 leading-snug">
              Islandwide express courier
            </p>
          </div>
        </div>

        {/* Item 4 */}
        <div className="flex items-center gap-3.5 p-4 sm:p-5">
          <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/25 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <h4 className="text-base font-bold tracking-wide uppercase font-heading text-white">
              AI Stack Coach
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 leading-snug">
              Personalized supplement plans
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 2: SUBTLE AUTHORIZED BRANDS STRIP
          ========================================================================= */}
      <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-heading">
          TRUSTED GLOBAL BRANDS
        </span>
        <div className="flex flex-wrap items-center gap-6 sm:gap-8 lg:gap-10">
          {AUTHORIZED_BRANDS.map((brand) => (
            <span
              key={brand}
              className="text-base sm:text-lg font-heading font-semibold tracking-widest text-zinc-300 hover:text-[#E2C275] transition-colors uppercase select-none cursor-default"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
