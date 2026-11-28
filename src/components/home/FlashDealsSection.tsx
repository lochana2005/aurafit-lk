"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Copy, Check, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/context/ToastContext";
import {
  TimedOffer,
  getOfferStatus,
  getCountdownParts,
} from "@/data/offersSchema";
import StudioImage from "@/components/StudioImage";

const SSR_ANCHOR_MS = Date.parse("2026-11-29T00:00:00");

export default function FlashDealsSection() {
  const { offers, products } = useAdmin();
  const { showToast } = useToast();
  const [nowMs, setNowMs] = useState<number>(SSR_ANCHOR_MS);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const syncTimer = setTimeout(() => setNowMs(Date.now()), 0);
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => {
      clearTimeout(syncTimer);
      clearInterval(interval);
    };
  }, []);

  const liveOffers = offers.filter((o) => getOfferStatus(o, nowMs) === "LIVE");
  if (liveOffers.length === 0) return null;

  const getOfferHref = (offer: TimedOffer) => {
    if (offer.targetScope === "category" && offer.targetCategory) {
      return `/shop?category=${encodeURIComponent(offer.targetCategory)}`;
    }
    if (offer.targetScope === "product" && offer.targetProductId) {
      const prod = products.find((p) => p.id === offer.targetProductId);
      if (prod) return `/shop/${prod.slug}`;
    }
    return "/shop";
  };

  const handleCopyCode = (offerId: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(offerId);
    setTimeout(() => setCopiedId(null), 1800);
    showToast({
      type: "gold",
      title: `Code ${code} Copied`,
      subtitle: "Apply this flash deal code at checkout.",
    });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 border-t border-white/[0.08]">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: "some" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/35 text-[#d4af37] text-[10px] font-bold uppercase tracking-widest mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
            <Flame className="w-3.5 h-3.5" />
            <span>LIMITED-TIME FLASH DROPS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-wider font-heading">
            <span className="text-white">LIMITED-TIME OFFERS &amp; </span>
            <span className="text-[#d4af37]">FLASH DEALS</span>
          </h2>
        </div>

        <Link
          href="/shop"
          className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400 hover:text-[#d4af37] transition-colors shrink-0"
        >
          <span>ALL VAULT DEALS</span>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all duration-200" />
        </Link>
      </motion.div>

      {/* Offers Grid */}
      <div
        className={`grid grid-cols-1 ${
          liveOffers.length === 1 ? "lg:grid-cols-1" : "lg:grid-cols-2"
        } gap-6`}
      >
        {liveOffers.map((offer) => {
          const countdown = getCountdownParts(offer.endDate, nowMs);
          const isCopied = copiedId === offer.id;

          return (
            <div
              key={offer.id}
              className="group relative bg-[#111115] border border-[#d4af37]/30 hover:border-[#d4af37]/65 rounded-2xl overflow-hidden shadow-[0_0_32px_rgba(212,175,55,0.08)] transition-all duration-300 grid grid-cols-1 sm:grid-cols-12"
            >
              {/* Artwork Column */}
              <div className="sm:col-span-5 relative min-h-[210px] bg-gradient-to-br from-[#191610] via-[#131318] to-[#09090B] flex items-center justify-center p-5 border-b sm:border-b-0 sm:border-r border-white/[0.08] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.16),transparent_68%)] pointer-events-none" />
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 transition-transform duration-300 group-hover:scale-105">
                  <StudioImage
                    src={offer.bannerImage}
                    alt={offer.headline}
                    fill
                    sizes="160px"
                    objectFit="contain"
                    fallbackLabel={offer.headline}
                  />
                </div>

                {/* Bold Discount Badge */}
                <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#E5C76B] via-[#d4af37] to-[#B08922] text-[#09090B] text-[11px] font-black uppercase tracking-wider shadow-lg">
                  {offer.badgeText}
                </span>
              </div>

              {/* Details & Countdown Column */}
              <div className="sm:col-span-7 p-5 sm:p-6 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#d4af37]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE OFFER
                      {offer.targetScope === "category" && offer.targetCategory
                        ? ` · ${offer.targetCategory.toUpperCase()}`
                        : ""}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white font-heading leading-tight">
                    {offer.headline}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {offer.subtitle}
                  </p>
                </div>

                {/* Live Ticking Countdown Timer */}
                {offer.showCountdown && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#d4af37]" />
                      <span>Ends In</span>
                    </span>
                    <div className="grid grid-cols-4 gap-2 max-w-xs">
                      {[
                        { label: "DAYS", val: countdown.days },
                        { label: "HRS", val: countdown.hours },
                        { label: "MIN", val: countdown.minutes },
                        { label: "SEC", val: countdown.seconds },
                      ].map((unit) => (
                        <div
                          key={unit.label}
                          className="py-2 px-1.5 rounded-lg bg-[#09090B] border border-[#d4af37]/25 text-center"
                        >
                          <span className="block font-mono text-sm sm:text-base font-black text-[#d4af37] leading-none">
                            {unit.val}
                          </span>
                          <span className="block text-[9px] font-mono text-zinc-500 mt-1 tracking-wider">
                            {unit.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {offer.promoCode && (
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyCode(offer.id, offer.promoCode as string)
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#09090B] border border-dashed border-[#d4af37]/50 text-xs font-mono font-bold text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors cursor-pointer"
                    >
                      <span>{offer.promoCode}</span>
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  <Link
                    href={getOfferHref(offer)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold"
                  >
                    <span>CLAIM OFFER</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
