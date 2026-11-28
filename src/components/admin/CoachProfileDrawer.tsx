"use client";

import React from "react";
import {
  X,
  Phone,
  Mail,
  Dumbbell,
  Banknote,
  Pencil,
  Trophy,
  ShoppingBag,
  History,
  CheckCircle2,
} from "lucide-react";
import { AdminOrder } from "@/context/AdminContext";
import {
  CashbackPayout,
  CoachAffiliate,
  PromoCode,
  resolveTierForSales,
} from "@/data/affiliateSchema";

interface CoachProfileDrawerProps {
  promo: PromoCode;
  coach: CoachAffiliate;
  orders: AdminOrder[];
  payouts: CashbackPayout[];
  totalSales: number;
  totalEarned: number;
  totalPaid: number;
  pendingBalance: number;
  onClose: () => void;
  onToggleStatus: (promoId: string) => void;
  onEdit: () => void;
  onRecordPayout: () => void;
}

export default function CoachProfileDrawer({
  promo,
  coach,
  orders,
  payouts,
  totalSales,
  totalEarned,
  totalPaid,
  pendingBalance,
  onClose,
  onToggleStatus,
  onEdit,
  onRecordPayout,
}: CoachProfileDrawerProps) {
  const tierInfo = resolveTierForSales(coach, promo.cashbackValue, totalSales);

  const formatRate = (val: number) =>
    promo.cashbackType === "percentage"
      ? `${val}%`
      : `Rs. ${val.toLocaleString()}`;

  const progressPercent = tierInfo.nextTier
    ? Math.min(
        100,
        Math.round((totalSales / tierInfo.nextTier.salesTargetLkr) * 100)
      )
    : 100;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div
        data-lenis-prevent
        className="w-full max-w-xl h-full bg-[#0E0E12] border-l border-white/10 p-6 overflow-y-auto space-y-6 shadow-2xl scrollbar-thin"
      >
        {/* Top Bar */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-[#E2C275]/15 border border-[#E2C275]/40 font-mono text-xs font-black text-[#E2C275]">
                {promo.code}
              </span>
              <button
                type="button"
                onClick={() => onToggleStatus(promo.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                  promo.isActive
                    ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-300"
                    : "bg-zinc-800 border-white/10 text-zinc-400"
                }`}
              >
                {promo.isActive ? "Active" : "Inactive"}
              </button>
              {coach.isLevelSystemEnabled && (
                <span className="px-2.5 py-1 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/35 text-[#38BDF8] font-mono text-[10px] font-black uppercase">
                  LV {tierInfo.currentLevel}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wide text-white font-heading mt-2">
              {coach.name}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onEdit}
              className="p-2 rounded-xl bg-[#16161C] border border-white/10 text-zinc-300 hover:text-[#E2C275] cursor-pointer"
              aria-label="Edit coach profile"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#16161C] border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
              aria-label="Close coach profile"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contact & Gym Info */}
        <div className="p-4 rounded-2xl bg-[#141419] border border-white/8 space-y-2 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#E2C275]" />
            <span>{coach.contactInfo || "No phone recorded"}</span>
          </div>
          {coach.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#E2C275]" />
              <span>{coach.email}</span>
            </div>
          )}
          {coach.gymOrNotes && (
            <div className="flex items-center gap-2">
              <Dumbbell className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{coach.gymOrNotes}</span>
            </div>
          )}
        </div>

        {/* Payable Balance Highlight Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1B1710] via-[#141418] to-[#111115] border border-[#E2C275]/40 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E2C275] block">
                Pending Payable Balance
              </span>
              <p className="text-3xl font-black font-mono text-white mt-1">
                Rs. {pendingBalance.toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              disabled={pendingBalance <= 0}
              onClick={onRecordPayout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold disabled:opacity-35 disabled:pointer-events-none cursor-pointer"
            >
              <Banknote className="w-4 h-4" />
              <span>Record Payout</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/10 text-center">
            <div className="p-2.5 rounded-xl bg-black/30">
              <span className="text-[10px] text-zinc-400 uppercase block">
                Total Sales
              </span>
              <span className="text-xs font-bold font-mono text-white">
                Rs. {totalSales.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/30">
              <span className="text-[10px] text-zinc-400 uppercase block">
                Total Earned
              </span>
              <span className="text-xs font-bold font-mono text-[#E2C275]">
                Rs. {totalEarned.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/30">
              <span className="text-[10px] text-zinc-400 uppercase block">
                Paid Out
              </span>
              <span className="text-xs font-bold font-mono text-emerald-400">
                Rs. {totalPaid.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Commission & VIP Task Progress */}
        <div className="p-5 rounded-2xl bg-[#141419] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#E2C275]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                Commission Structure
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#E2C275]">
              Active Rate: {formatRate(tierInfo.activeCashbackRate)}
            </span>
          </div>

          {coach.isLevelSystemEnabled ? (
            <div className="space-y-3">
              {/* Progress to next milestone */}
              <div className="p-3.5 rounded-xl bg-[#0B0B0F] border border-white/8 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-semibold">
                    {tierInfo.nextTier
                      ? `Progress to LV ${tierInfo.nextTier.level} (${formatRate(
                          tierInfo.nextTier.cashbackValue
                        )})`
                      : "Maximum VIP Level Unlocked"}
                  </span>
                  <span className="font-mono text-[#E2C275] font-bold">
                    {progressPercent}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-[#E2C275] via-[#C9A227] to-[#38BDF8] rounded-full transition-all duration-300"
                  />
                </div>

                {tierInfo.nextTier && (
                  <p className="text-[11px] font-mono text-zinc-400">
                    Rs. {totalSales.toLocaleString()} / Rs.{" "}
                    {tierInfo.nextTier.salesTargetLkr.toLocaleString()} to unlock{" "}
                    <span className="text-[#E2C275] font-bold">
                      {formatRate(tierInfo.nextTier.cashbackValue)}
                    </span>
                  </p>
                )}
              </div>

              {/* Tier Breakdown */}
              <div className="space-y-1.5">
                {coach.commissionTiers.map((tier) => {
                  const unlocked = tierInfo.currentLevel >= tier.level;
                  return (
                    <div
                      key={tier.level}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs border ${
                        unlocked
                          ? "bg-[#E2C275]/10 border-[#E2C275]/30 text-white"
                          : "bg-[#0E0E12] border-white/5 text-zinc-500"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">
                          LV {tier.level}
                        </span>
                        <span>
                          {tier.salesTargetLkr === 0
                            ? "Base Target (Rs. 0)"
                            : `Target: Rs. ${tier.salesTargetLkr.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono font-bold">
                        <span>{formatRate(tier.cashbackValue)}</span>
                        {unlocked && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-400">
              Standard flat cashback rate of{" "}
              <strong className="text-white">
                {formatRate(promo.cashbackValue)}
              </strong>{" "}
              per completed order. (VIP Level / Sales Task System is disabled.)
            </p>
          )}
        </div>

        {/* Recent Referred Orders */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Recent Referred Orders ({orders.length})</span>
            </h3>
          </div>
          {orders.length === 0 ? (
            <p className="text-xs text-zinc-500 p-3 rounded-xl bg-[#141419] border border-white/5">
              No completed orders using {promo.code} yet.
            </p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((o) => (
                <div
                  key={o.id}
                  className="p-3 rounded-xl bg-[#141419] border border-white/8 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-mono font-bold text-white">{o.id}</p>
                    <p className="text-[11px] text-zinc-400">
                      {o.customerName} • {o.date}
                    </p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-zinc-200">
                      Rs. {o.total.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-[#E2C275]">
                      +Rs. {(o.cashbackAmount || 0).toLocaleString()} cb
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payout History */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span>Payout History ({payouts.length})</span>
          </h3>
          {payouts.length === 0 ? (
            <p className="text-xs text-zinc-500 p-3 rounded-xl bg-[#141419] border border-white/5">
              No cashback payouts recorded for this coach yet.
            </p>
          ) : (
            <div className="space-y-2">
              {payouts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-[#141419] border border-white/8 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="text-white font-medium">{p.referenceNote}</p>
                    <p className="text-[11px] font-mono text-zinc-500">
                      {p.paidAt}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">
                    Rs. {p.amountLkr.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
