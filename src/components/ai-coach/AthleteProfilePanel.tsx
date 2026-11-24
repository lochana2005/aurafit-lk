"use client";

import React, { useState } from "react";
import { Sparkles, Target, Activity, DollarSign, Weight, Ruler } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { FitnessGoal } from "@/data/mockProducts";

export interface AthleteConfig {
  goal: FitnessGoal;
  weightKg: number;
  heightCm: number;
  frequency: "3–4 Days/wk" | "5–6 Days/wk" | "Daily";
  budget: "Under Rs. 20,000" | "Rs. 20k – 45k" | "Rs. 45,000+";
}

interface AthleteProfilePanelProps {
  onGenerateStack: (config: AthleteConfig) => void;
  isGenerating?: boolean;
}

const GOALS: FitnessGoal[] = [
  "Muscle Gain",
  "Lean Cutting",
  "Strength & Power",
  "Recovery",
];

const FREQUENCIES: AthleteConfig["frequency"][] = [
  "3–4 Days/wk",
  "5–6 Days/wk",
  "Daily",
];

const BUDGETS: AthleteConfig["budget"][] = [
  "Under Rs. 20,000",
  "Rs. 20k – 45k",
  "Rs. 45,000+",
];

export default function AthleteProfilePanel({
  onGenerateStack,
  isGenerating = false,
}: AthleteProfilePanelProps) {
  const { user } = useAuth();

  const [goal, setGoal] = useState<FitnessGoal>(() => {
    if (user?.fitnessGoal) {
      const match = GOALS.find(
        (g) => g.toLowerCase() === user.fitnessGoal.toLowerCase()
      );
      if (match) return match;
    }
    return "Muscle Gain";
  });

  const [weightKg, setWeightKg] = useState<number>(72);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [frequency, setFrequency] = useState<AthleteConfig["frequency"]>("5–6 Days/wk");
  const [budget, setBudget] = useState<AthleteConfig["budget"]>("Rs. 20k – 45k");

  const handleGenerate = () => {
    onGenerateStack({
      goal,
      weightKg,
      heightCm,
      frequency,
      budget,
    });
  };

  return (
    <div className="bg-[#111115] border border-sky-400/25 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="border-b border-white/8 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/40 border border-sky-400/30 text-[10px] font-bold uppercase tracking-wider text-sky-300 mb-2 font-heading">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Intelligent Diagnostic Config</span>
        </div>
        <h2 className="text-xl font-bold uppercase tracking-wider text-white font-heading">
          Athlete Parameters
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          {user ? `Loaded profile for ${user.name}` : "Configure body stats to build your ideal stack"}
        </p>
      </div>

      <div className="space-y-5 text-xs">
        {/* 1. Fitness Goal Pills */}
        <div className="space-y-2">
          <label className="font-semibold text-zinc-300 flex items-center gap-1.5 uppercase font-heading text-xs tracking-wider">
            <Target className="w-3.5 h-3.5 text-sky-400" />
            <span>Primary Fitness Goal</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {GOALS.map((g) => {
              const active = goal === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={`py-2.5 px-3 rounded-xl font-bold text-center transition-all cursor-pointer text-xs font-heading uppercase tracking-wider ${
                    active
                      ? "bg-sky-400/15 border border-sky-400 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                      : "bg-[#18181D] text-zinc-400 hover:text-white border border-white/8 hover:border-white/20"
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Body Stats: Weight & Height */}
        <div className="space-y-2">
          <label className="font-semibold text-zinc-300 flex items-center gap-1.5 uppercase font-heading text-xs tracking-wider">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>Biometric Measurements</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Weight */}
            <div className="space-y-1">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Weight className="w-3 h-3 text-zinc-500" />
                <span>Weight (kg)</span>
              </span>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Math.max(30, Number(e.target.value)))}
                min={30}
                max={200}
                className="w-full bg-[#18181D] border border-white/12 focus:border-sky-400/60 rounded-xl px-3 py-2.5 text-sm font-bold text-white font-mono focus:outline-none"
              />
            </div>

            {/* Height */}
            <div className="space-y-1">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Ruler className="w-3 h-3 text-zinc-500" />
                <span>Height (cm)</span>
              </span>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Math.max(100, Number(e.target.value)))}
                min={100}
                max={250}
                className="w-full bg-[#18181D] border border-white/12 focus:border-sky-400/60 rounded-xl px-3 py-2.5 text-sm font-bold text-white font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Training Frequency */}
        <div className="space-y-2">
          <label className="font-semibold text-zinc-300 uppercase font-heading text-xs tracking-wider block">
            Weekly Gym Frequency
          </label>
          <div className="grid grid-cols-3 gap-2">
            {FREQUENCIES.map((freq) => {
              const active = frequency === freq;
              return (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={`py-2 px-1 text-center rounded-xl font-bold transition-all cursor-pointer text-[11px] font-heading uppercase ${
                    active
                      ? "bg-sky-400/15 border border-sky-400 text-sky-300"
                      : "bg-[#18181D] text-zinc-400 hover:text-white border border-white/8 hover:border-white/20"
                  }`}
                >
                  {freq}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Monthly Budget */}
        <div className="space-y-2">
          <label className="font-semibold text-zinc-300 flex items-center gap-1.5 uppercase font-heading text-xs tracking-wider">
            <DollarSign className="w-3.5 h-3.5 text-[#E2C275]" />
            <span>Monthly Supplement Budget (LKR)</span>
          </label>
          <div className="grid grid-cols-1 gap-2">
            {BUDGETS.map((b) => {
              const active = budget === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={`py-2 px-3 text-left rounded-xl font-bold transition-all cursor-pointer text-xs flex items-center justify-between ${
                    active
                      ? "bg-gradient-to-r from-[#1A1710] to-[#141418] border border-[#E2C275] text-[#E2C275]"
                      : "bg-[#18181D] text-zinc-300 hover:text-white border border-white/8 hover:border-white/20"
                  }`}
                >
                  <span>{b}</span>
                  {active && <span className="text-[10px] font-mono text-[#E2C275]">SELECTED</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Stack CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-sky-400 via-[#E2C275] to-[#C9A227] shadow-[0_0_25px_rgba(56,189,248,0.25)] hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading text-xs sm:text-sm"
          >
            <Sparkles className="w-4 h-4 text-[#09090B]" />
            <span>{isGenerating ? "Analyzing Catalog..." : "Generate My Stack ✨"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
