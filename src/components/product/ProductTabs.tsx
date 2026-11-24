"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Star,
  QrCode,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Product } from "@/data/mockProducts";

interface ProductTabsProps {
  product: Product;
}

type TabType = "overview" | "facts" | "verify" | "reviews";

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Nutrition Facts based on Category
  const getNutritionRows = () => {
    switch (product.category) {
      case "Whey Protein":
        return [
          { label: "Serving Size", amount: "1 Rounded Scoop (~32g)", dv: "-" },
          { label: "Calories", amount: "120 kcal", dv: "6%" },
          { label: "Pure Whey Protein", amount: "25g", dv: "50%" },
          { label: "BCAAs (Naturally Occurring)", amount: "5.5g", dv: "**" },
          { label: "Glutamine & Precursors", amount: "4.3g", dv: "**" },
          { label: "Total Carbohydrates", amount: "1g", dv: "<1%" },
          { label: "Total Fat", amount: "0.5g", dv: "<1%" },
          { label: "Sugars (No Added Sugar)", amount: "0g", dv: "0%" },
        ];
      case "Mass Gainer":
        return [
          { label: "Serving Size", amount: "2 Heaping Scoops (~165g)", dv: "-" },
          { label: "Calories", amount: "650 kcal", dv: "32%" },
          { label: "Protein Matrix", amount: "50g", dv: "100%" },
          { label: "Complex Carbohydrates", amount: "110g", dv: "40%" },
          { label: "Creatine Monohydrate", amount: "3g", dv: "**" },
          { label: "Total Fat", amount: "4.5g", dv: "6%" },
          { label: "Dietary Fiber", amount: "5g", dv: "18%" },
        ];
      case "Creatine":
        return [
          { label: "Serving Size", amount: "1 Level Scoop (5g)", dv: "-" },
          { label: "Micronized Creatine Monohydrate", amount: "5,000 mg", dv: "**" },
          { label: "Calories", amount: "0 kcal", dv: "0%" },
          { label: "Carbohydrates", amount: "0g", dv: "0%" },
          { label: "Sugar", amount: "0g", dv: "0%" },
        ];
      case "Pre Workout":
        return [
          { label: "Serving Size", amount: "1 Scoop (~10.5g)", dv: "-" },
          { label: "Citrulline Malate (2:1)", amount: "6,000 mg", dv: "**" },
          { label: "Beta-Alanine", amount: "3,200 mg", dv: "**" },
          { label: "Anhydrous Caffeine Matrix", amount: "300 mg", dv: "**" },
          { label: "L-Tyrosine", amount: "1,000 mg", dv: "**" },
          { label: "Vitamin B12", amount: "50 mcg", dv: "2083%" },
        ];
      default:
        return [
          { label: "Serving Size", amount: "1 Serving", dv: "-" },
          { label: "Active Bio-Complex", amount: "100% RDA", dv: "100%" },
          { label: "Calories", amount: "0 kcal", dv: "0%" },
        ];
    }
  };

  const nutritionRows = getNutritionRows();

  const MOCK_REVIEWS = [
    {
      id: "rev-1",
      name: "Dinuk Perera",
      location: "Colombo 07",
      date: "Verified Buyer &bull; 3 days ago",
      rating: 5,
      comment:
        "Scanned the QR batch hologram immediately after unboxing—verified 100% authentic against the manufacturer's lab test! Mixability is flawless with water. Best price in Sri Lanka.",
    },
    {
      id: "rev-2",
      name: "Kavinda Jayasuriya",
      location: "Kandy",
      date: "Verified Buyer &bull; 1 week ago",
      rating: 5,
      comment:
        "PromptX courier delivered to Kandy in less than 36 hours. Seal was factory-tight and tamper-proof. High quality protein without any digestive bloating.",
    },
    {
      id: "rev-3",
      name: "Shehan Fernando",
      location: "Galle",
      date: "Verified Buyer &bull; 2 weeks ago",
      rating: 5,
      comment:
        "Paid with Koko 3 installments which made it super affordable. Results speak for themselves—genuine imported supplement store you can trust.",
    },
  ];

  return (
    <div className="w-full mt-16 pt-10 border-t border-white/[0.08]">
      {/* =========================================================================
          TAB NAVIGATION BUTTONS
          ========================================================================= */}
      <div className="flex items-center gap-2 sm:gap-6 border-b border-white/10 overflow-x-auto pb-px scrollbar-none">
        {[
          { id: "overview", label: "Overview & Benefits" },
          { id: "facts", label: "Supplement Facts" },
          { id: "verify", label: "How to Verify" },
          { id: "reviews", label: `Verified Reviews (${product.reviewsCount})` },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`pb-4 px-2 text-xs sm:text-sm font-bold uppercase tracking-wider font-heading transition-colors relative whitespace-nowrap cursor-pointer ${
                isActive ? "text-[#E2C275]" : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[0_0_12px_rgba(226,194,117,0.5)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB CONTENT PANELS
          ========================================================================= */}
      <div className="pt-8">
        {/* TAB 1: OVERVIEW & BENEFITS */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-zinc-300">
            <div className="lg:col-span-7 space-y-5">
              <h3 className="text-xl font-bold uppercase tracking-wider text-white font-heading">
                Engineered for Peak Athletic Performance
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
                AuraFit.lk is the certified direct importer of {product.brand} in Sri Lanka. Each container is manufactured in GMP-certified and Informed-Choice registered facilities, rigorously checked for prohibited substances, and tested to ensure purity, potency, and label accuracy.
              </p>

              {/* Bulleted Benefits */}
              <div className="space-y-3 pt-2">
                {[
                  "Rapid amino acid bioavailability for immediate post-workout muscle protein synthesis (MPS).",
                  "Cross-flow micro-filtered to eliminate excess lactose, fat, and artificial filler content.",
                  "Instantized formulation ensures clump-free mixing with water, skim milk, or oats in seconds.",
                  `Targeted specifically for athletes pursuing ${product.goal.toLowerCase()} with zero compromises.`,
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#E2C275] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Recommended Usage & Timing */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-[#111115] border border-white/8 space-y-4">
                <div className="flex items-center gap-2 text-white font-heading font-bold text-base uppercase">
                  <Clock className="w-4 h-4 text-[#E2C275]" />
                  <span>Recommended Usage &amp; Timing</span>
                </div>

                <div className="space-y-3 text-xs text-zinc-300">
                  <div className="p-3 rounded-xl bg-[#141418] border border-white/6">
                    <strong className="text-white block mb-0.5">Post-Workout Window:</strong>
                    <span>Mix 1 serving with 250–300ml cold water within 30 minutes of finishing resistance training.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141418] border border-white/6">
                    <strong className="text-white block mb-0.5">Non-Training Days:</strong>
                    <span>Consume 1 serving between main meals or upon waking to support continuous muscular recovery.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SUPPLEMENT FACTS */}
        {activeTab === "facts" && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="text-xl font-bold uppercase tracking-wider text-white font-heading">
                Nutritional Profile &amp; Serving Details
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Values based on standard lab testing. Daily Values (% DV) based on a 2,000 calorie diet.
              </p>
            </div>

            <div className="rounded-2xl bg-[#111115] border border-white/10 overflow-hidden shadow-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#141418] text-zinc-400 font-heading text-[11px] uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Nutrient / Component</th>
                    <th className="py-3 px-4">Amount Per Serving</th>
                    <th className="py-3 px-4 text-right">% Daily Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6 text-zinc-300">
                  {nutritionRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"}
                    >
                      <td className="py-3 px-4 sm:px-6 font-medium text-white">
                        {row.label}
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-300">
                        {row.amount}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#E2C275]">
                        {row.dv}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-zinc-500 italic">
              ** Daily Value (DV) not established. Manufactured on equipment that also processes milk, soy, egg, and wheat.
            </p>
          </div>
        )}

        {/* TAB 3: HOW TO VERIFY */}
        {activeTab === "verify" && (
          <div className="max-w-4xl space-y-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E2C275] font-heading">
                AuraFit Anti-Counterfeit Protocol
              </span>
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white font-heading mt-0.5">
                Scan &amp; Verify Your Batch Code in 3 Steps
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                Counterfeits are rampant in the local market. AuraFit.lk protects athletes with tamper-evident holographic QR seals attached at customs clearance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl bg-[#111115] border border-white/10 space-y-3 relative">
                <span className="w-8 h-8 rounded-full bg-[#E2C275]/15 text-[#E2C275] border border-[#E2C275]/30 flex items-center justify-center font-mono font-bold text-sm">
                  1
                </span>
                <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                  Locate Hologram Seal
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Find the metallic holographic AuraFit security seal affixed across the lid and container body neck.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#111115] border border-white/10 space-y-3 relative">
                <span className="w-8 h-8 rounded-full bg-sky-400/15 text-sky-300 border border-sky-400/30 flex items-center justify-center font-mono font-bold text-sm">
                  2
                </span>
                <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                  Scan QR with Camera
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Scan the high-density QR code with any smartphone camera or enter the alphanumeric serial code manually.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#111115] border border-white/10 space-y-3 relative">
                <span className="w-8 h-8 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 flex items-center justify-center font-mono font-bold text-sm">
                  3
                </span>
                <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                  Inspect Lab Certificate
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  View the official manufacturer Certificate of Analysis (COA) confirming authentic protein content and expiration.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#141418] border border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E2C275]/10 border border-[#E2C275]/25 flex items-center justify-center shrink-0">
                  <QrCode className="w-5 h-5 text-[#E2C275]" />
                </div>
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-white font-heading">
                    Ready to test your container?
                  </h5>
                  <p className="text-[11px] text-zinc-400">
                    Visit our dedicated QR batch verification portal now.
                  </p>
                </div>
              </div>

              <Link
                href="/verify"
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-[#E5C76B] via-[#C9A227] to-[#B08922] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] flex items-center gap-1.5 hover:brightness-105 active:scale-95 transition-all shrink-0"
              >
                <span>Open Verification Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === "reviews" && (
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wider text-white font-heading">
                  Verified Buyer Reviews
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Real feedback from competitive athletes and gym-goers across Sri Lanka.
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-amber-400 font-mono text-sm font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating} / 5.0</span>
              </div>
            </div>

            <div className="space-y-4">
              {MOCK_REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-[#111115] border border-white/8 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-heading">
                          {rev.name}
                        </span>
                        <span className="text-zinc-600">&bull;</span>
                        <span className="text-xs text-zinc-400">
                          {rev.location}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{rev.date}</span>
                      </span>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
