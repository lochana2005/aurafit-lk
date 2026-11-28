"use client";

import React from "react";
import { TrendingUp, TrendingDown, Calculator } from "lucide-react";
import {
  ProductDiscountType,
  calculateProductPricing,
  formatLKR,
  getKokoTotal,
  getKokoInstallment,
} from "@/lib/pricing";

interface ProductProfitSectionProps {
  costPrice: number;
  regularPrice: number;
  discountType: ProductDiscountType;
  discountValue: number;
  onCostPriceChange: (val: number) => void;
  onRegularPriceChange: (val: number) => void;
  onDiscountTypeChange: (val: ProductDiscountType) => void;
  onDiscountValueChange: (val: number) => void;
}

export default function ProductProfitSection({
  costPrice,
  regularPrice,
  discountType,
  discountValue,
  onCostPriceChange,
  onRegularPriceChange,
  onDiscountTypeChange,
  onDiscountValueChange,
}: ProductProfitSectionProps) {
  const metrics = calculateProductPricing(
    regularPrice,
    costPrice,
    discountType,
    discountValue
  );
  const isPositive = metrics.unitProfit >= 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Buying / Landed Cost Price */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300">
            Buying / Landed Cost Price (LKR) *
          </label>
          <input
            type="number"
            required
            min={0}
            value={costPrice}
            onChange={(e) => onCostPriceChange(Math.max(0, Number(e.target.value)))}
            className="w-full bg-[#09090B] border border-white/15 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none"
          />
        </div>

        {/* Regular Selling Price */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300">
            Regular Selling Price (LKR) *
          </label>
          <input
            type="number"
            required
            min={100}
            value={regularPrice}
            onChange={(e) =>
              onRegularPriceChange(Math.max(0, Number(e.target.value)))
            }
            className="w-full bg-[#09090B] border border-white/15 focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Product Discount */}
      <div className="p-3.5 rounded-xl bg-[#16161C] border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Product Discount
          </label>
          {discountType !== "none" && (
            <span className="text-xs font-mono text-[#d4af37]">
              Final Selling Price: {formatLKR(metrics.finalSellingPrice, false)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <select
            value={discountType}
            onChange={(e) =>
              onDiscountTypeChange(e.target.value as ProductDiscountType)
            }
            className="bg-[#09090B] border border-white/15 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="none">None (No Discount)</option>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed_lkr">Fixed Amount (LKR)</option>
          </select>

          <input
            type="number"
            min={0}
            disabled={discountType === "none"}
            value={discountType === "none" ? 0 : discountValue}
            onChange={(e) =>
              onDiscountValueChange(Math.max(0, Number(e.target.value)))
            }
            placeholder={
              discountType === "percentage" ? "e.g. 10 (%)" : "e.g. 2500 (LKR)"
            }
            className="bg-[#09090B] border border-white/15 focus:border-[#d4af37] disabled:opacity-40 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Live Unit Profit Preview Box */}
      <div
        className={`p-4 rounded-xl border space-y-3 ${
          isPositive
            ? "bg-emerald-950/20 border-emerald-500/35"
            : "bg-red-950/25 border-red-500/40"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
            <Calculator className="w-4 h-4 text-[#d4af37]" />
            <span>Live Unit Profit Preview</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-black ${
              isPositive
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>{metrics.marginPercent}% Margin</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-[#09090B]/70 border border-white/5">
            <span className="text-[10px] text-zinc-400 uppercase block">
              Final Selling
            </span>
            <span className="font-mono font-bold text-white mt-0.5 block">
              {formatLKR(metrics.finalSellingPrice, false)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#09090B]/70 border border-white/5">
            <span className="text-[10px] text-zinc-400 uppercase block">
              Unit Cost
            </span>
            <span className="font-mono font-bold text-zinc-300 mt-0.5 block">
              {formatLKR(metrics.costPrice, false)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#09090B]/70 border border-white/5">
            <span className="text-[10px] text-zinc-400 uppercase block">
              Net Profit / Unit
            </span>
            <span
              className={`font-mono font-black mt-0.5 block ${
                isPositive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {isPositive ? "+" : "-"}
              {formatLKR(Math.abs(metrics.unitProfit), false)}
            </span>
          </div>
        </div>
      </div>

      {/* Auto KOKO 3x Calculator */}
      <div className="p-3.5 rounded-xl bg-[#16161C] border border-[#8B5CF6]/35 flex items-center justify-between text-xs">
        <div>
          <span className="text-[#A78BFA] font-bold block">
            AUTO KOKO 3× (+9%) CALCULATOR
          </span>
          <span className="text-zinc-400">
            Total: {formatLKR(getKokoTotal(metrics.finalSellingPrice), false)}
          </span>
        </div>
        <span className="text-sm font-mono font-bold text-white">
          3 × {formatLKR(getKokoInstallment(metrics.finalSellingPrice), false)}
        </span>
      </div>
    </div>
  );
}
