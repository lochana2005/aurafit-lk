"use client";

import React, { useState } from "react";
import { X, Check, Plus, Trash2, Trophy, Sparkles } from "lucide-react";
import {
  CoachAffiliate,
  CommissionTier,
  DiscountValueType,
  PromoCode,
} from "@/data/affiliateSchema";

interface PromoAffiliateModalProps {
  promo?: PromoCode;
  coach?: CoachAffiliate;
  onClose: () => void;
  onSave: (input: {
    promoId?: string;
    coachId?: string;
    code: string;
    coachName: string;
    contactInfo: string;
    email?: string;
    gymOrNotes?: string;
    discountType: DiscountValueType;
    discountValue: number;
    cashbackType: DiscountValueType;
    cashbackValue: number;
    isActive: boolean;
    isLevelSystemEnabled: boolean;
    commissionTiers: CommissionTier[];
  }) => { ok: boolean; error?: string };
}

export default function PromoAffiliateModal({
  promo,
  coach,
  onClose,
  onSave,
}: PromoAffiliateModalProps) {
  const [code, setCode] = useState(promo?.code || "");
  const [coachName, setCoachName] = useState(coach?.name || "");
  const [contactInfo, setContactInfo] = useState(coach?.contactInfo || "");
  const [email, setEmail] = useState(coach?.email || "");
  const [gymOrNotes, setGymOrNotes] = useState(coach?.gymOrNotes || "");
  const [discountType, setDiscountType] = useState<DiscountValueType>(
    promo?.discountType || "percentage"
  );
  const [discountValue, setDiscountValue] = useState(
    String(promo?.discountValue ?? 10)
  );
  const [cashbackType, setCashbackType] = useState<DiscountValueType>(
    promo?.cashbackType || "percentage"
  );
  const [cashbackValue, setCashbackValue] = useState(
    String(promo?.cashbackValue ?? 5)
  );
  const [isActive, setIsActive] = useState(promo?.isActive ?? true);

  const [isLevelSystemEnabled, setIsLevelSystemEnabled] = useState(
    coach?.isLevelSystemEnabled ?? false
  );

  const [extraTiers, setExtraTiers] = useState<
    { salesTargetLkr: string; cashbackValue: string }[]
  >(() => {
    const existing = coach?.commissionTiers?.filter((t) => t.level > 1) || [];
    if (existing.length > 0) {
      return existing.map((t) => ({
        salesTargetLkr: String(t.salesTargetLkr),
        cashbackValue: String(t.cashbackValue),
      }));
    }
    return [{ salesTargetLkr: "100000", cashbackValue: "8" }];
  });

  const [error, setError] = useState<string | null>(null);

  const handleAddLevel = () => {
    const last = extraTiers[extraTiers.length - 1];
    const nextTarget = last
      ? Math.round((Number(last.salesTargetLkr) || 100000) * 2)
      : 100000;
    const nextRate = last ? (Number(last.cashbackValue) || 8) + 2 : 8;
    setExtraTiers((prev) => [
      ...prev,
      { salesTargetLkr: String(nextTarget), cashbackValue: String(nextRate) },
    ]);
  };

  const handleRemoveLevel = (idx: number) => {
    setExtraTiers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const baseRate = Math.max(0, Number(cashbackValue) || 0);

    const commissionTiers: CommissionTier[] = isLevelSystemEnabled
      ? [
          { level: 1, salesTargetLkr: 0, cashbackValue: baseRate },
          ...extraTiers.map((t, idx) => ({
            level: idx + 2,
            salesTargetLkr: Math.max(1, Number(t.salesTargetLkr) || 0),
            cashbackValue: Math.max(0, Number(t.cashbackValue) || 0),
          })),
        ]
      : [{ level: 1, salesTargetLkr: 0, cashbackValue: baseRate }];

    const res = onSave({
      promoId: promo?.id,
      coachId: coach?.id,
      code,
      coachName,
      contactInfo,
      email,
      gymOrNotes,
      discountType,
      discountValue: Number(discountValue) || 0,
      cashbackType,
      cashbackValue: baseRate,
      isActive,
      isLevelSystemEnabled,
      commissionTiers,
    });

    if (!res.ok) {
      setError(res.error || "Failed to save coach promo.");
      return;
    }
    onClose();
  };

  const rateUnit = cashbackType === "percentage" ? "%" : "LKR";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div
        data-lenis-prevent
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#111115]/95 backdrop-blur-xl border border-[#E2C275]/35 rounded-2xl p-6 space-y-5 shadow-[0_0_50px_rgba(0,0,0,0.9)] scrollbar-thin"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E2C275]">
              Affiliate &amp; Commission Setup
            </span>
            <h2 className="text-xl font-black uppercase tracking-wider text-white font-heading mt-0.5">
              {promo ? `Edit ${promo.code}` : "Add Coach / Promo Code"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl bg-[#16161C] border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/35 border border-red-500/40 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Coach Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Promo Code *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. COACH10"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161C] border border-white/10 text-sm font-mono uppercase text-white placeholder-zinc-500 focus:outline-none focus:border-[#E2C275]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Coach / Seller Name *
              </label>
              <input
                type="text"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                placeholder="e.g. Coach Kasun Wijesinghe"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161C] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E2C275]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Phone / WhatsApp
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="+94 77 512 8840"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161C] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E2C275]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Coach Email (Portal Login)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coach@gym.lk"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161C] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E2C275]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Gym Affiliation / Notes
            </label>
            <input
              type="text"
              value={gymOrNotes}
              onChange={(e) => setGymOrNotes(e.target.value)}
              placeholder="e.g. IronWorks Colombo 03 — Head Strength Coach"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161C] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E2C275]"
            />
          </div>

          {/* Customer Discount & Base Cashback */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#16161C] border border-white/8 space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-white block">
                Customer Discount
              </label>
              <div className="flex gap-2">
                <select
                  value={discountType}
                  onChange={(e) =>
                    setDiscountType(e.target.value as DiscountValueType)
                  }
                  className="px-2.5 py-2 rounded-lg bg-[#0E0E12] border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-[#E2C275]"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed_lkr">Fixed (LKR)</option>
                </select>
                <input
                  type="number"
                  min={0}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-[#0E0E12] border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-[#E2C275]"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#16161C] border border-white/8 space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#E2C275] block">
                Base Cashback Rate {isLevelSystemEnabled ? "(LV 1)" : ""}
              </label>
              <div className="flex gap-2">
                <select
                  value={cashbackType}
                  onChange={(e) =>
                    setCashbackType(e.target.value as DiscountValueType)
                  }
                  className="px-2.5 py-2 rounded-lg bg-[#0E0E12] border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-[#E2C275]"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed_lkr">Fixed (LKR)</option>
                </select>
                <input
                  type="number"
                  min={0}
                  value={cashbackValue}
                  onChange={(e) => setCashbackValue(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-[#0E0E12] border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-[#E2C275]"
                />
              </div>
            </div>
          </div>

          {/* Promo Active Status */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#16161C] border border-white/8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                Promo Code Status
              </p>
              <p className="text-[11px] text-zinc-400">
                Allow customers to apply this code at checkout
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                isActive
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : "bg-zinc-800 border-white/10 text-zinc-400"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </button>
          </div>

          {/* Selective VIP Level / Sales Task System Toggle */}
          <div className="rounded-2xl border border-[#E2C275]/25 bg-[#0D0D11] p-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#E2C275]/15 border border-[#E2C275]/30 text-[#E2C275] shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <span>Enable VIP Level / Sales Task System</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#E2C275]" />
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Auto-upgrade this coach&apos;s cashback rate when cumulative sales cross custom LKR targets.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isLevelSystemEnabled}
                onClick={() => setIsLevelSystemEnabled((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                  isLevelSystemEnabled ? "bg-[#E2C275]" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-[#09090B] transition-transform ${
                    isLevelSystemEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Level & Target Builder (Only when ON) */}
            {isLevelSystemEnabled && (
              <div className="pt-3 border-t border-white/10 space-y-3">
                {/* LV 1 Base */}
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#16161C] border border-white/8 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 border border-white/10 font-mono font-bold text-zinc-200">
                      LV 1
                    </span>
                    <span className="text-zinc-300 font-medium">
                      Base Tier (From Rs. 0)
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#E2C275]">
                    {cashbackType === "percentage"
                      ? `${cashbackValue || 0}%`
                      : `Rs. ${Number(cashbackValue || 0).toLocaleString()}`}
                  </span>
                </div>

                {/* LV 2+ Milestones */}
                {extraTiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#16161C] border border-[#E2C275]/20 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded bg-[#E2C275]/15 border border-[#E2C275]/35 font-mono font-bold text-[#E2C275] text-xs">
                        LV {idx + 2}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Task {idx + 1}
                      </span>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase block mb-1">
                          Sales Target (LKR)
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={tier.salesTargetLkr}
                          onChange={(e) =>
                            setExtraTiers((prev) =>
                              prev.map((item, i) =>
                                i === idx
                                  ? { ...item, salesTargetLkr: e.target.value }
                                  : item
                              )
                            )
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E0E12] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#E2C275]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[#E2C275] uppercase block mb-1">
                          Upgraded Rate ({rateUnit})
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={tier.cashbackValue}
                          onChange={(e) =>
                            setExtraTiers((prev) =>
                              prev.map((item, i) =>
                                i === idx
                                  ? { ...item, cashbackValue: e.target.value }
                                  : item
                              )
                            )
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#0E0E12] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#E2C275]"
                        />
                      </div>
                    </div>

                    {extraTiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLevel(idx)}
                        aria-label={`Remove LV ${idx + 2}`}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 self-end sm:self-center cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddLevel}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E2C275] hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Next Level (LV {extraTiers.length + 2})</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-dark cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{promo ? "Save Changes" : "Create Coach & Promo"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
