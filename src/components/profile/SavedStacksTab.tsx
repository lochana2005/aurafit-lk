"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ShoppingCart, Trash2, Clock, ArrowRight } from "lucide-react";
import { MOCK_PRODUCTS, Product } from "@/data/mockProducts";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatLKR, getKokoTotal, getKokoInstallment } from "@/lib/pricing";

export interface SavedAiStack {
  id: string;
  name: string;
  goal: string;
  items: {
    timing: string;
    product: Product;
  }[];
  createdAt: string;
}

export const SAVED_STACKS_KEY = "aurafit_saved_stacks";

export const SEEDED_SAVED_STACKS: SavedAiStack[] = [
  {
    id: "stack_lean_recovery",
    name: "Lean Muscle & Recovery Stack",
    goal: "Lean Cutting",
    createdAt: "Saved Nov 2026",
    items: [
      { timing: "Post-Workout", product: MOCK_PRODUCTS[1] },
      { timing: "Daily 5g", product: MOCK_PRODUCTS[4] },
      { timing: "Intra-Workout", product: MOCK_PRODUCTS[8] },
    ],
  },
  {
    id: "stack_mass_bulk",
    name: "Sri Lankan Mass Bulk Stack",
    goal: "Muscle Gain",
    createdAt: "Saved Nov 2026",
    items: [
      { timing: "Post-Workout", product: MOCK_PRODUCTS[2] },
      { timing: "Daily 5g", product: MOCK_PRODUCTS[4] },
      { timing: "Morning", product: MOCK_PRODUCTS[10] },
    ],
  },
];

export default function SavedStacksTab({
  onCountChange,
}: {
  onCountChange?: (count: number) => void;
}) {
  const { addToCart, openCart } = useCart();
  const { showToast } = useToast();

  const [stacks, setStacks] = useState<SavedAiStack[]>(() => {
    if (typeof window === "undefined") return SEEDED_SAVED_STACKS;
    try {
      const saved = window.localStorage.getItem(SAVED_STACKS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      window.localStorage.setItem(SAVED_STACKS_KEY, JSON.stringify(SEEDED_SAVED_STACKS));
    } catch {
      // fallback
    }
    return SEEDED_SAVED_STACKS;
  });

  const persistStacks = (next: SavedAiStack[]) => {
    setStacks(next);
    onCountChange?.(next.length);
    try {
      localStorage.setItem(SAVED_STACKS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleAddStackToCart = (stack: SavedAiStack) => {
    stack.items.forEach((entry) => {
      addToCart(entry.product, 1);
    });
    showToast({
      type: "cyan",
      title: "AI Stack Added to Cart",
      subtitle: `${stack.name} (${stack.items.length} items) added to your cart.`,
      actionLabel: "VIEW CART →",
      onAction: () => openCart(),
    });
  };

  const handleDeleteStack = (id: string, name: string) => {
    const next = stacks.filter((s) => s.id !== id);
    persistStacks(next);
    showToast({
      type: "gold",
      title: "Stack Removed",
      subtitle: `${name} deleted from Saved AI Stacks.`,
    });
  };

  return (
    <div className="bg-[#141418] rounded-2xl border border-white/8 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-white font-heading">
            SAVED AI STACKS
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Personalized supplement protocols saved from your AI Stack Coach sessions
          </p>
        </div>

        <Link
          href="/ai-coach"
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-dark inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Build New AI Stack</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {stacks.length === 0 ? (
        <div className="py-14 px-6 rounded-2xl bg-[#0E0E12] border border-white/8 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#16161C] border border-sky-400/25 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-[#38BDF8]" />
          </div>
          <h3 className="text-lg font-bold uppercase tracking-wider text-white font-heading">
            No Saved AI Stacks Yet
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mt-1.5 leading-relaxed">
            Launch our AI Stack Coach to generate and save custom whey, creatine, and pre-workout protocols.
          </p>
          <Link
            href="/ai-coach"
            className="mt-6 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center gap-2"
          >
            <span>Launch AI Stack Coach</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {stacks.map((stack) => {
            const totalCash = stack.items.reduce(
              (sum, entry) => sum + entry.product.price,
              0
            );
            const kokoTotal = getKokoTotal(totalCash);
            const kokoInstallment = getKokoInstallment(totalCash);

            return (
              <div
                key={stack.id}
                className="rounded-2xl bg-[#16161C] border border-white/10 hover:border-[#38BDF8]/40 p-5 flex flex-col justify-between gap-5 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#38BDF8]/12 border border-[#38BDF8]/30 text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
                        <Sparkles className="w-3 h-3" />
                        <span>{stack.goal}</span>
                      </span>
                      <h3 className="text-lg font-bold uppercase tracking-wide text-white font-heading mt-2">
                        {stack.name}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                      {stack.createdAt}
                    </span>
                  </div>

                  {/* Supplements & Daily Timing Breakdown */}
                  <div className="space-y-2">
                    {stack.items.map((entry) => (
                      <div
                        key={`${stack.id}-${entry.product.id}`}
                        className="p-2.5 rounded-xl bg-[#0E0E12] border border-white/6 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#E2C275]">
                            <Clock className="w-3 h-3" />
                            <span>{entry.timing}</span>
                          </div>
                          <div className="text-xs font-semibold text-white truncate mt-0.5">
                            {entry.product.name}
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-zinc-200 shrink-0">
                          {formatLKR(entry.product.price, false)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bundle Total & Actions */}
                <div className="pt-4 border-t border-white/[0.08] space-y-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="text-[11px] text-zinc-400 block">
                        Bundle Cash Total
                      </span>
                      <span className="text-lg font-extrabold text-white">
                        {formatLKR(totalCash, false)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-[#A78BFA] bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-1.5 py-0.5 rounded">
                        KOKO 3×
                      </span>
                      <div className="text-xs text-zinc-300 mt-0.5">
                        3 × {formatLKR(kokoInstallment, false)} ({formatLKR(kokoTotal, false)})
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleAddStackToCart(stack)}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>ADD FULL STACK TO CART</span>
                    </button>

                    <button
                      type="button"
                      data-no-glint
                      onClick={() => handleDeleteStack(stack.id, stack.name)}
                      className="py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-dark flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
                      <span>DELETE STACK</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
