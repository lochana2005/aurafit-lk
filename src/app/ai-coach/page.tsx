"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, ChevronRight } from "lucide-react";
import AthleteProfilePanel, { AthleteConfig } from "@/components/ai-coach/AthleteProfilePanel";
import AIChatWorkspace from "@/components/ai-coach/AIChatWorkspace";
import RecommendedStackCard, { StackItem } from "@/components/ai-coach/RecommendedStackCard";
import { MOCK_PRODUCTS } from "@/data/mockProducts";

// Curated Master Stacks based on Goal & Budget
function resolveStack(config: AthleteConfig): {
  items: StackItem[];
  title: string;
  rationale: string;
} {
  switch (config.goal) {
    case "Lean Cutting":
      return {
        title: "Lean Cut & Vascularity",
        rationale:
          "Zero-sugar hydrolyzed whey isolate preserves lean muscle tissue during a caloric deficit, while pure micronized creatine sustains intramuscular ATP power and BCAA reduces catabolic breakdown.",
        items: [
          {
            product: MOCK_PRODUCTS[1], // Dymatize ISO100
            timingBadge: "Post-Workout",
            dosageNote: "1 scoop immediately after training in 250ml cold water",
          },
          {
            product: MOCK_PRODUCTS[4], // Applied Nutrition Creatine
            timingBadge: "Daily 5g",
            dosageNote: "5 grams daily with meal to preserve lean muscle density",
          },
          {
            product: MOCK_PRODUCTS[9], // BCAA Amino
            timingBadge: "Intra-Workout",
            dosageNote: "Sip throughout fasted or high-intensity cardio sessions",
          },
        ],
      };

    case "Strength & Power":
      return {
        title: "Max Power & Explosive Force",
        rationale:
          "Combines high-stimulant citrulline malate and beta-alanine for immediate blood flow and mental drive, backed by ultra-pure whey isolate and creatine monohydrate for heavy progressive overload.",
        items: [
          {
            product: MOCK_PRODUCTS[0], // Gold Standard Isolate
            timingBadge: "Post-Workout",
            dosageNote: "1 rounded scoop within 30 minutes of lifting",
          },
          {
            product: MOCK_PRODUCTS[7], // Applied Nutrition ABE Pre-Workout
            timingBadge: "30m Pre-Workout",
            dosageNote: "1 scoop 20-30 mins prior to training for nitric oxide surge",
          },
          {
            product: MOCK_PRODUCTS[4], // Creatine
            timingBadge: "Daily 5g",
            dosageNote: "5g daily for continuous phosphocreatine resynthesis",
          },
        ],
      };

    case "Recovery":
      return {
        title: "Complete Cellular Recovery",
        rationale:
          "Engineered for endurance and high-frequency training. Paces amino acid availability across the day and replenishes micronutrients depleted through heavy sweat and fatigue.",
        items: [
          {
            product: MOCK_PRODUCTS[11], // Dymatize Elite 100% Whey
            timingBadge: "Post-Workout",
            dosageNote: "1 scoop post-workout or upon waking on rest days",
          },
          {
            product: MOCK_PRODUCTS[9], // BCAA Amino
            timingBadge: "Intra-Workout",
            dosageNote: "1 serving during training for cellular hydration",
          },
          {
            product: MOCK_PRODUCTS[10], // Opti-Men Multivitamin
            timingBadge: "Morning",
            dosageNote: "Take with breakfast for full-spectrum micronutrient support",
          },
        ],
      };

    case "Muscle Gain":
    default:
      if (config.budget === "Under Rs. 20,000") {
        return {
          title: "Hypertrophy Starter",
          rationale:
            "High-yield micronized creatine monohydrate increases cellular hydration, power output, and accelerates muscle fullness on an economical budget.",
          items: [
            {
              product: MOCK_PRODUCTS[4], // Creatine
              timingBadge: "Daily 5g",
              dosageNote: "1 scoop (5g) daily mixed with water or fruit juice",
            },
          ],
        };
      }

      if (config.budget === "Rs. 20k – 45k") {
        return {
          title: "Hypertrophy Power",
          rationale:
            "Combines 50g of clean protein with multi-source carbohydrates and 5g of pure creatine to create the ideal anabolic environment for rapid mass building.",
          items: [
            {
              product: MOCK_PRODUCTS[2], // Applied Nutrition Critical Mass
              timingBadge: "Post-Workout",
              dosageNote: "2 scoops post-workout with 400ml water or milk",
            },
            {
              product: MOCK_PRODUCTS[4], // Applied Nutrition Creatine
              timingBadge: "Daily 5g",
              dosageNote: "5g daily for progressive strength overload",
            },
          ],
        };
      }

      // 45,000+
      return {
        title: "Pro Anabolic Hypertrophy",
        rationale:
          "The complete golden trifecta: clinical pre-workout pump formula, pure micro-filtered whey isolate for zero-bloat recovery, and daily micronized creatine for continuous strength progression.",
        items: [
          {
            product: MOCK_PRODUCTS[0], // Gold Standard Isolate
            timingBadge: "Post-Workout",
            dosageNote: "1 scoop immediately after training",
          },
          {
            product: MOCK_PRODUCTS[4], // Creatine
            timingBadge: "Daily 5g",
            dosageNote: "5g daily to maximize intracellular ATP capacity",
          },
          {
            product: MOCK_PRODUCTS[6], // Cellucor C4 Pre-Workout
            timingBadge: "30m Pre-Workout",
            dosageNote: "1 scoop 20-30 mins before workout for intense laser focus",
          },
        ],
      };
  }
}

export default function AICoachPage() {
  const [activeConfig, setActiveConfig] = useState<AthleteConfig>({
    goal: "Muscle Gain",
    weightKg: 72,
    heightCm: 175,
    frequency: "5–6 Days/wk",
    budget: "Rs. 20k – 45k",
  });

  const [externalPrompt, setExternalPrompt] = useState<string | null>(null);

  const currentStack = resolveStack(activeConfig);

  const handleGenerateStack = (newConfig: AthleteConfig) => {
    setActiveConfig(newConfig);

    // Build automated prompt for AI Chat
    const promptSummary = `[Diagnostic Scan: Goal: ${newConfig.goal}, Weight: ${newConfig.weightKg}kg, Height: ${newConfig.heightCm}cm, Frequency: ${newConfig.frequency}, Budget: ${newConfig.budget}]. Generate tailored clinical advice and matching stack recommendations.`;
    setExternalPrompt(promptSummary);
  };

  return (
    <div className="w-full min-h-screen bg-[#09090B] text-white">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* =========================================================================
            BREADCRUMBS
            ========================================================================= */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 mb-6 flex-wrap"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-sky-300 font-semibold">AI Nutrition Coach</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/8 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/40 border border-sky-400/30 text-xs font-semibold text-sky-300 mb-2 font-heading uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>AI-Powered Nutrition Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-heading">
              AURAFIT AI{" "}
              <span className="bg-gradient-to-r from-sky-400 via-[#E2C275] to-[#B08922] bg-clip-text text-transparent">
                FITNESS COACH
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Get clinical supplement recommendations, dosage timing protocols, and custom
              stacks calibrated to your exact biometrics and training regimen in Sri Lanka.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141418] border border-sky-400/25 text-xs font-semibold text-sky-200 self-start sm:self-auto font-heading uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>100% Laboratory Verified Catalog</span>
          </div>
        </div>

        {/* =========================================================================
            12-COLUMN WORKSPACE
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column (4 cols): Sticky Athlete Profile Configurator */}
          <aside className="lg:col-span-4 lg:sticky lg:top-36 lg:self-start">
            <AthleteProfilePanel onGenerateStack={handleGenerateStack} />
          </aside>

          {/* Right Column (8 cols): Interactive AI Chat + Recommended Stack Card */}
          <main className="lg:col-span-8 space-y-6 w-full">
            <AIChatWorkspace
              externalPrompt={externalPrompt}
              onClearExternalPrompt={() => setExternalPrompt(null)}
            />

            <RecommendedStackCard
              stackItems={currentStack.items}
              goalTitle={currentStack.title}
              rationale={currentStack.rationale}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

