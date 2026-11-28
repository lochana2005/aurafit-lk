"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Flame, Zap, Dumbbell, HeartPulse } from "lucide-react";
import { formatLKR, getKokoTotal, getKokoInstallment } from "@/lib/pricing";

interface GoalPreview {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  stackName: string;
  dailyTarget: string;
  items: {
    timing: string;
    name: string;
    brand: string;
    price: number;
  }[];
}

const GOAL_PREVIEWS: GoalPreview[] = [
  {
    id: "Lean Muscle & Recovery",
    label: "Lean Muscle & Recovery",
    icon: HeartPulse,
    stackName: "Lean Hypertrophy & Recovery Protocol",
    dailyTarget: "145g Protein · 5g Creatine · 7g BCAA",
    items: [
      {
        timing: "Post-Workout",
        name: "Gold Standard 100% Isolate (5 lbs)",
        brand: "Optimum Nutrition",
        price: 34500,
      },
      {
        timing: "Daily 5g",
        name: "Micronized Creatine Powder (400g)",
        brand: "Applied Nutrition",
        price: 11500,
      },
      {
        timing: "Intra-Workout",
        name: "Xtend Original BCAA (30 Servings)",
        brand: "Scivation",
        price: 12900,
      },
    ],
  },
  {
    id: "Weight Gain & Mass Bulk",
    label: "Weight Gain & Mass Bulk",
    icon: Dumbbell,
    stackName: "Clean Caloric Surplus Stack",
    dailyTarget: "+450 kcal Surplus · 160g Protein · 5g Creatine",
    items: [
      {
        timing: "Post-Workout",
        name: "Critical Mass Original (6 kg)",
        brand: "Applied Nutrition",
        price: 29500,
      },
      {
        timing: "Daily 5g",
        name: "Micronized Creatine Powder (400g)",
        brand: "Applied Nutrition",
        price: 11500,
      },
      {
        timing: "Morning",
        name: "Opti-Men Multivitamin (90 Tabs)",
        brand: "Optimum Nutrition",
        price: 10800,
      },
    ],
  },
  {
    id: "Fat Loss & Cutting",
    label: "Fat Loss & Cutting",
    icon: Flame,
    stackName: "Zero-Sugar Shred & Vascularity",
    dailyTarget: "155g Pure Isolate · 0g Sugar · Thermogenic Support",
    items: [
      {
        timing: "Post-Workout",
        name: "ISO100 Hydrolyzed Whey Isolate (5 lbs)",
        brand: "Dymatize",
        price: 38900,
      },
      {
        timing: "Intra-Workout",
        name: "Amino X Effervescent BCAA (30 Serv)",
        brand: "BSN",
        price: 11200,
      },
      {
        timing: "Pre-Cardio",
        name: "L-Carnitine 3000 Liquid",
        brand: "Applied Nutrition",
        price: 9800,
      },
    ],
  },
  {
    id: "Explosive Strength & Pump",
    label: "Explosive Strength & Pump",
    icon: Zap,
    stackName: "Max Power & Nitric Oxide Surge",
    dailyTarget: "6g Citrulline · 5g Creatine · 25g Isolate",
    items: [
      {
        timing: "30m Pre-Workout",
        name: "ABE All Black Everything (30 Serv)",
        brand: "Applied Nutrition",
        price: 13500,
      },
      {
        timing: "Daily 5g",
        name: "Micronized Creatine Powder (400g)",
        brand: "Applied Nutrition",
        price: 11500,
      },
      {
        timing: "Post-Workout",
        name: "Gold Standard 100% Isolate (5 lbs)",
        brand: "Optimum Nutrition",
        price: 34500,
      },
    ],
  },
];

export default function AiCoachShowcase() {
  const [selectedGoal, setSelectedGoal] = useState<string>(GOAL_PREVIEWS[0].id);
  const activePreview =
    GOAL_PREVIEWS.find((g) => g.id === selectedGoal) || GOAL_PREVIEWS[0];

  const totalCash = activePreview.items.reduce((sum, item) => sum + item.price, 0);
  const kokoTotal = getKokoTotal(totalCash);
  const kokoInstallment = getKokoInstallment(totalCash);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-[#111115] border border-[#38BDF8]/25 rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
        {/* Subtle Ambient Cyan & Gold Corner Glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#38BDF8]/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#E2C275]/6 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#09090B] border border-[#38BDF8]/35">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#38BDF8]">
                AI NUTRITIONIST · POWERED BY AURAFIT INTELLIGENCE
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wide text-white font-heading leading-[1.04]">
              UNSURE WHICH STACK FITS YOUR BODY?{" "}
              <span className="text-[#E2C275]">ASK OUR AI COACH.</span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
              Select your training objective below to preview a precision-dosed whey, creatine, and pre-workout protocol tailored for Sri Lankan athletes and your monthly budget.
            </p>

            {/* Interactive Goal Selector Chips */}
            <div className="pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                Choose Your Primary Goal:
              </div>
              <div className="flex flex-wrap gap-2.5">
                {GOAL_PREVIEWS.map((goal) => {
                  const Icon = goal.icon;
                  const isActive = selectedGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                        isActive
                          ? "bg-[#38BDF8]/15 border border-[#38BDF8] text-white shadow-[0_0_16px_rgba(56,189,248,0.2)]"
                          : "bg-[#16161C] border border-white/12 text-zinc-300 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 ${
                          isActive ? "text-[#38BDF8]" : "text-[#E2C275]"
                        }`}
                      />
                      <span>{goal.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <Link
                href={`/ai-coach?goal=${encodeURIComponent(selectedGoal)}`}
                className="px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center gap-2"
              >
                <span>LAUNCH AI STACK COACH</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href="/shop"
                className="px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider btn-aurafit-dark inline-flex items-center gap-2"
              >
                <span>EXPLORE SAMPLE STACKS</span>
              </Link>
            </div>
          </div>

          {/* Right Column (5 cols): Live AI Stack Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#0B0B0F] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl">
              <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-white/[0.08]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#38BDF8] block">
                    AI PROTOCOL PREVIEW
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-white font-heading mt-0.5">
                    {activePreview.stackName}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 shrink-0">
                  100% VERIFIED
                </span>
              </div>

              {/* Daily Intake Pill */}
              <div className="px-3 py-2 rounded-xl bg-[#141418] border border-white/8 text-xs text-zinc-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span className="font-medium">{activePreview.dailyTarget}</span>
              </div>

              {/* Stack Items */}
              <div className="space-y-2.5">
                {activePreview.items.map((item) => (
                  <div
                    key={item.name}
                    className="p-3 rounded-xl bg-[#141418] border border-white/8 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#E2C275]/12 text-[#E2C275] border border-[#E2C275]/25">
                          {item.timing}
                        </span>
                        <span className="text-[11px] text-zinc-400 truncate">
                          {item.brand}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white truncate">
                        {item.name}
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white shrink-0 font-mono">
                      {formatLKR(item.price, false)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total LKR + KOKO 3x Installment */}
              <div className="pt-3.5 border-t border-white/[0.08] flex items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-zinc-400 block">
                    Estimated Stack Total
                  </span>
                  <span className="text-xl font-extrabold text-white">
                    {formatLKR(totalCash, false)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="inline-block text-[10px] font-bold text-[#A78BFA] bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-1.5 py-0.5 rounded mb-0.5">
                    KOKO 3× INSTALLMENTS
                  </span>
                  <div className="text-xs font-semibold text-zinc-200">
                    3 × {formatLKR(kokoInstallment, false)}
                    <span className="text-zinc-500 ml-1">
                      ({formatLKR(kokoTotal, false)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
