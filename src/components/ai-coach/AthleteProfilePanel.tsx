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
    <div
      data-lenis-prevent
      className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar p-3.5 space-y-4 text-xs"
    >
      {/* Sub-header */}
      <div className="pb-2 border-b border-white/6">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-400 font-heading">
          <Sparkles className="w-3 h-3" />
          <span>Biometric Calibrator</span>
        </div>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          {user ? `Profile: ${user.name}` : "Configure body stats to build your stack"}
        </p>
      </div>

      {/* 1. Goal Pills */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5 uppercase font-heading tracking-wider">
          <Target className="w-3 h-3 text-sky-400" />
          <span>Primary Goal</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {GOALS.map((g) => {
            const active = goal === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setGoal(g)}
                className={`py-2 px-2 rounded-lg font-bold text-center transition-all cursor-pointer text-[11px] font-heading uppercase tracking-wide truncate ${
                  active
                    ? "bg-sky-400/15 border border-sky-400/60 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                    : "bg-[#181820] text-zinc-400 hover:text-white border border-white/6 hover:border-white/15"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Weight & Height */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5 uppercase font-heading tracking-wider">
          <Activity className="w-3 h-3 text-sky-400" />
          <span>Biometrics</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 flex items-center gap-1">
              <Weight className="w-2.5 h-2.5 text-zinc-500" />
              <span>Weight (kg)</span>
            </span>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(Math.max(30, Number(e.target.value)))}
              min={30}
              max={200}
              className="w-full bg-[#181820] border border-white/10 focus:border-sky-400/60 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 flex items-center gap-1">
              <Ruler className="w-2.5 h-2.5 text-zinc-500" />
              <span>Height (cm)</span>
            </span>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(Math.max(100, Number(e.target.value)))}
              min={100}
              max={250}
              className="w-full bg-[#181820] border border-white/10 focus:border-sky-400/60 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white font-mono focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Training Frequency */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-zinc-300 uppercase font-heading tracking-wider block">
          Weekly Frequency
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {FREQUENCIES.map((freq) => {
            const active = frequency === freq;
            return (
              <button
                key={freq}
                type="button"
                onClick={() => setFrequency(freq)}
                className={`py-1.5 px-1 text-center rounded-lg font-bold transition-all cursor-pointer text-[10px] font-heading uppercase ${
                  active
                    ? "bg-sky-400/15 border border-sky-400/60 text-sky-300"
                    : "bg-[#181820] text-zinc-400 hover:text-white border border-white/6 hover:border-white/15"
                }`}
              >
                {freq}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Budget */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5 uppercase font-heading tracking-wider">
          <DollarSign className="w-3 h-3 text-[#E2C275]" />
          <span>Monthly Budget</span>
        </label>
        <div className="space-y-1">
          {BUDGETS.map((b) => {
            const active = budget === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => setBudget(b)}
                className={`w-full py-1.5 px-2.5 text-left rounded-lg font-bold transition-all cursor-pointer text-[11px] flex items-center justify-between ${
                  active
                    ? "bg-gradient-to-r from-[#1A1710] to-[#141418] border border-[#E2C275]/70 text-[#E2C275]"
                    : "bg-[#181820] text-zinc-300 hover:text-white border border-white/6 hover:border-white/15"
                }`}
              >
                <span>{b}</span>
                {active && <span className="text-[9px] font-mono text-[#E2C275]">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate CTA Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-2.5 rounded-xl font-bold uppercase tracking-wider text-[#09090B] bg-gradient-to-r from-sky-400 via-[#E2C275] to-[#C9A227] shadow-[0_0_20px_rgba(56,189,248,0.2)] hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading text-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#09090B]" />
          <span>{isGenerating ? "Analyzing..." : "Generate My Stack ✨"}</span>
        </button>
      </div>
    </div>
  );
}
