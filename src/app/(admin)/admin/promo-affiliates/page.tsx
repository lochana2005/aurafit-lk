"use client";

import React, { useState, useMemo } from "react";
import {
  TicketPercent,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Banknote,
  Users,
  TrendingUp,
  Wallet,
  CheckCircle2,
  Phone,
  Mail,
  History,
  Eye,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { PromoCode, resolveTierForSales } from "@/data/affiliateSchema";
import PromoAffiliateModal from "@/components/admin/PromoAffiliateModal";
import CoachProfileDrawer from "@/components/admin/CoachProfileDrawer";

export default function AdminPromoAffiliatesPage() {
  const {
    coaches,
    promoCodes,
    cashbackPayouts,
    orders,
    savePromoAffiliate,
    togglePromoStatus,
    deletePromoCode,
    recordCashbackPayout,
  } = useAdmin();

  // Add/Edit Modal state
  const [modalState, setModalState] = useState<{
    open: boolean;
    promo?: PromoCode;
  }>({ open: false });

  // Coach Profile Drawer state
  const [selectedPromoId, setSelectedPromoId] = useState<string | null>(null);

  // Payout modal state
  const [payoutTarget, setPayoutTarget] = useState<{
    promoId: string;
    coachId: string;
    code: string;
    coachName: string;
    totalEarned: number;
    totalPaid: number;
    pendingBalance: number;
  } | null>(null);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutRef, setPayoutRef] = useState("");

  // Compute live relational metrics per promo code
  const promoRows = useMemo(() => {
    return promoCodes.map((promo) => {
      const coach = coaches.find((c) => c.id === promo.coachId);
      const matchingOrders = orders.filter(
        (o) =>
          o.status !== "Cancelled" &&
          (o.promoCodeId === promo.id ||
            (o.promoCode &&
              o.promoCode.toUpperCase() === promo.code.toUpperCase()))
      );

      const totalUses = matchingOrders.length;
      const totalSales = matchingOrders.reduce(
        (sum, o) => sum + (o.total || 0),
        0
      );
      const totalCashbackEarned = matchingOrders.reduce(
        (sum, o) => sum + (o.cashbackAmount || 0),
        0
      );

      const matchingPayouts = cashbackPayouts.filter(
        (p) => p.promoCodeId === promo.id
      );
      const totalPaid = matchingPayouts.reduce(
        (sum, p) => sum + (p.amountLkr || 0),
        0
      );

      const pendingBalance = Math.max(0, totalCashbackEarned - totalPaid);
      const tierInfo = coach
        ? resolveTierForSales(coach, promo.cashbackValue, totalSales)
        : { currentLevel: 1, activeCashbackRate: promo.cashbackValue };

      return {
        promo,
        coach,
        matchingOrders,
        matchingPayouts,
        totalUses,
        totalSales,
        totalCashbackEarned,
        totalPaid,
        pendingBalance,
        tierInfo,
      };
    });
  }, [promoCodes, coaches, orders, cashbackPayouts]);

  const summary = useMemo(() => {
    return promoRows.reduce(
      (acc, r) => {
        if (r.promo.isActive) acc.activeCodes += 1;
        acc.totalSales += r.totalSales;
        acc.totalEarned += r.totalCashbackEarned;
        acc.totalPaid += r.totalPaid;
        acc.totalPending += r.pendingBalance;
        return acc;
      },
      {
        activeCodes: 0,
        totalSales: 0,
        totalEarned: 0,
        totalPaid: 0,
        totalPending: 0,
      }
    );
  }, [promoRows]);

  const selectedRow = useMemo(
    () => promoRows.find((r) => r.promo.id === selectedPromoId) || null,
    [promoRows, selectedPromoId]
  );

  const handleConfirmPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutTarget) return;
    const amt = Math.round(Number(payoutAmount) || 0);
    if (amt <= 0) return;

    recordCashbackPayout({
      coachId: payoutTarget.coachId,
      promoCodeId: payoutTarget.promoId,
      amountLkr: amt,
      referenceNote: payoutRef || "Bank Transfer",
    });
    setPayoutTarget(null);
    setPayoutAmount("");
    setPayoutRef("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E2C275]/10 border border-[#E2C275]/30 text-[#E2C275] text-[10px] font-bold uppercase tracking-widest mb-2">
            <TicketPercent className="w-3.5 h-3.5" />
            <span>Affiliate &amp; Gym Coach Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-white font-heading">
            PROMO CODES &amp; COACH CASHBACK
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage coach promo codes, VIP level sales targets, pending payable balances, and cashback payouts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalState({ open: true })}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>ADD COACH / PROMO</span>
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-[#111115] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-[11px] uppercase tracking-wider font-bold">
            <span>Active Codes</span>
            <TicketPercent className="w-4 h-4 text-[#E2C275]" />
          </div>
          <p className="text-2xl font-black text-white font-heading mt-1.5">
            {summary.activeCodes}{" "}
            <span className="text-xs font-mono text-zinc-500 font-normal">
              / {promoCodes.length}
            </span>
          </p>
        </div>

        <div className="bg-[#111115] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-[11px] uppercase tracking-wider font-bold">
            <span>Affiliate Sales</span>
            <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white font-mono mt-1.5">
            Rs. {summary.totalSales.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#111115] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-[11px] uppercase tracking-wider font-bold">
            <span>Total Earned</span>
            <Users className="w-4 h-4 text-[#E2C275]" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#E2C275] font-mono mt-1.5">
            Rs. {summary.totalEarned.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#111115] border border-amber-500/25 rounded-2xl p-4">
          <div className="flex items-center justify-between text-amber-300 text-[11px] uppercase tracking-wider font-bold">
            <span>Pending Payable</span>
            <Wallet className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-300 font-mono mt-1.5">
            Rs. {summary.totalPending.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#111115] border border-emerald-500/25 rounded-2xl p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-emerald-300 text-[11px] uppercase tracking-wider font-bold">
            <span>Total Paid Out</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-300 font-mono mt-1.5">
            Rs. {summary.totalPaid.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tracking Dashboard Table */}
      <div className="bg-[#111115] border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-base font-bold uppercase tracking-wider text-white font-heading">
            Affiliate Promo Performance &amp; Cashback Balances
          </h2>
          <span className="text-[11px] font-mono text-zinc-400">
            Click any coach row to inspect profile
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#0E0E12] text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <th className="py-3.5 px-4">Code &amp; Status</th>
                <th className="py-3.5 px-4">Coach / Seller</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Cashback Rate</th>
                <th className="py-3.5 px-4 text-right">Uses</th>
                <th className="py-3.5 px-4 text-right">Sales (LKR)</th>
                <th className="py-3.5 px-4 text-right">Earned</th>
                <th className="py-3.5 px-4 text-right text-amber-300">
                  Pending
                </th>
                <th className="py-3.5 px-4 text-right">Paid</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8 text-xs">
              {promoRows.map(
                ({
                  promo,
                  coach,
                  totalUses,
                  totalSales,
                  totalCashbackEarned,
                  totalPaid,
                  pendingBalance,
                  tierInfo,
                }) => (
                  <tr
                    key={promo.id}
                    onClick={() => setSelectedPromoId(promo.id)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <td
                      className="py-4 px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col items-start gap-1.5">
                        <span className="px-2.5 py-1 rounded-lg bg-[#E2C275]/15 border border-[#E2C275]/35 font-mono font-black text-[#E2C275] tracking-wider">
                          {promo.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePromoStatus(promo.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                            promo.isActive
                              ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-300"
                              : "bg-zinc-800 border-white/10 text-zinc-400"
                          }`}
                        >
                          {promo.isActive ? "Active" : "Inactive"}
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-white">
                        {coach?.name || "Unassigned"}
                      </p>
                      <div className="flex flex-col gap-0.5 mt-1 text-[11px] text-zinc-400">
                        {coach?.contactInfo && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="w-3 h-3 text-zinc-500" />
                            {coach.contactInfo}
                          </span>
                        )}
                        {coach?.email && (
                          <span className="inline-flex items-center gap-1">
                            <Mail className="w-3 h-3 text-zinc-500" />
                            {coach.email}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-zinc-200">
                      {promo.discountType === "percentage"
                        ? `${promo.discountValue}% OFF`
                        : `Rs. ${promo.discountValue.toLocaleString()}`}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#E2C275]">
                          {promo.cashbackType === "percentage"
                            ? `${tierInfo.activeCashbackRate}%`
                            : `Rs. ${tierInfo.activeCashbackRate.toLocaleString()}`}
                        </span>
                        {coach?.isLevelSystemEnabled && (
                          <span className="px-1.5 py-0.5 rounded bg-[#38BDF8]/15 border border-[#38BDF8]/35 text-[#38BDF8] font-mono text-[10px] font-black">
                            LV {tierInfo.currentLevel}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right font-mono font-bold text-white">
                      {totalUses}
                    </td>

                    <td className="py-4 px-4 text-right font-mono text-zinc-200">
                      Rs. {totalSales.toLocaleString()}
                    </td>

                    <td className="py-4 px-4 text-right font-mono font-bold text-[#E2C275]">
                      Rs. {totalCashbackEarned.toLocaleString()}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg font-mono font-black ${
                          pendingBalance > 0
                            ? "bg-amber-500/15 border border-amber-500/35 text-amber-300"
                            : "text-zinc-500"
                        }`}
                      >
                        Rs. {pendingBalance.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right font-mono text-emerald-300">
                      Rs. {totalPaid.toLocaleString()}
                    </td>

                    <td
                      className="py-4 px-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedPromoId(promo.id)}
                          aria-label={`View profile for ${coach?.name || promo.code}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-[#16161C] border border-white/10 text-zinc-200 hover:border-[#E2C275]/40 hover:text-[#E2C275] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Profile</span>
                        </button>

                        <button
                          type="button"
                          disabled={pendingBalance <= 0}
                          onClick={() => {
                            setPayoutTarget({
                              promoId: promo.id,
                              coachId: promo.coachId,
                              code: promo.code,
                              coachName: coach?.name || promo.code,
                              totalEarned: totalCashbackEarned,
                              totalPaid,
                              pendingBalance,
                            });
                            setPayoutAmount(String(pendingBalance));
                            setPayoutRef("");
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-[#E2C275]/15 border border-[#E2C275]/40 text-[#E2C275] hover:bg-[#E2C275] hover:text-[#09090B] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                          <Banknote className="w-3.5 h-3.5" />
                          <span>Pay</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setModalState({ open: true, promo })}
                          aria-label={`Edit ${promo.code}`}
                          className="p-1.5 rounded-lg bg-[#0E0E12] border border-white/10 text-zinc-300 hover:text-[#E2C275] cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (selectedPromoId === promo.id) {
                              setSelectedPromoId(null);
                            }
                            deletePromoCode(promo.id);
                          }}
                          aria-label={`Delete ${promo.code}`}
                          className="p-1.5 rounded-lg bg-[#0E0E12] border border-white/10 text-zinc-400 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Cashback Payouts History */}
      <div className="bg-[#111115] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#E2C275]" />
            <h2 className="text-base font-bold uppercase tracking-wider text-white font-heading">
              Recorded Cashback Payouts ({cashbackPayouts.length})
            </h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            Audit Trail
          </span>
        </div>

        {cashbackPayouts.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">
            No cashback payouts recorded yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cashbackPayouts.map((pay) => {
              const coach = coaches.find((c) => c.id === pay.coachId);
              const promo = promoCodes.find((p) => p.id === pay.promoCodeId);
              return (
                <div
                  key={pay.id}
                  className="p-3.5 rounded-xl bg-[#16161C] border border-white/8 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        {coach?.name || "Coach"}
                      </span>
                      {promo && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E2C275]/15 text-[#E2C275]">
                          {promo.code}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {pay.referenceNote}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500 mt-1">
                      {pay.paidAt}
                    </p>
                  </div>
                  <span className="text-sm font-black font-mono text-emerald-400 shrink-0">
                    Rs. {pay.amountLkr.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Coach & Promo Popup Modal */}
      {modalState.open && (
        <PromoAffiliateModal
          promo={modalState.promo}
          coach={
            modalState.promo
              ? coaches.find((c) => c.id === modalState.promo?.coachId)
              : undefined
          }
          onClose={() => setModalState({ open: false })}
          onSave={savePromoAffiliate}
        />
      )}

      {/* Coach Profile Slide-Over Drawer */}
      {selectedRow && selectedRow.coach && (
        <CoachProfileDrawer
          promo={selectedRow.promo}
          coach={selectedRow.coach}
          orders={selectedRow.matchingOrders}
          payouts={selectedRow.matchingPayouts}
          totalSales={selectedRow.totalSales}
          totalEarned={selectedRow.totalCashbackEarned}
          totalPaid={selectedRow.totalPaid}
          pendingBalance={selectedRow.pendingBalance}
          onClose={() => setSelectedPromoId(null)}
          onToggleStatus={togglePromoStatus}
          onEdit={() => {
            const p = selectedRow.promo;
            setSelectedPromoId(null);
            setModalState({ open: true, promo: p });
          }}
          onRecordPayout={() => {
            setPayoutTarget({
              promoId: selectedRow.promo.id,
              coachId: selectedRow.promo.coachId,
              code: selectedRow.promo.code,
              coachName: selectedRow.coach?.name || selectedRow.promo.code,
              totalEarned: selectedRow.totalCashbackEarned,
              totalPaid: selectedRow.totalPaid,
              pendingBalance: selectedRow.pendingBalance,
            });
            setPayoutAmount(String(selectedRow.pendingBalance));
            setPayoutRef("");
          }}
        />
      )}

      {/* Record Payout Modal */}
      {payoutTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <form
            onSubmit={handleConfirmPayout}
            className="w-full max-w-md bg-[#111115] border border-[#E2C275]/40 rounded-2xl p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-white font-heading">
                  Record Coach Cashback Payout
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {payoutTarget.coachName} ({payoutTarget.code})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPayoutTarget(null)}
                className="p-1.5 rounded-lg bg-[#16161C] text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-[#16161C] border border-white/8">
                <span className="text-[10px] text-zinc-500 uppercase block">
                  Earned
                </span>
                <span className="text-xs font-bold font-mono text-white">
                  Rs. {payoutTarget.totalEarned.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#16161C] border border-white/8">
                <span className="text-[10px] text-zinc-500 uppercase block">
                  Paid
                </span>
                <span className="text-xs font-bold font-mono text-emerald-400">
                  Rs. {payoutTarget.totalPaid.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#16161C] border border-amber-500/30">
                <span className="text-[10px] text-amber-300 uppercase block">
                  Pending
                </span>
                <span className="text-xs font-bold font-mono text-amber-300">
                  Rs. {payoutTarget.pendingBalance.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Transfer Amount (LKR) *
              </label>
              <input
                type="number"
                min={1}
                max={payoutTarget.pendingBalance}
                required
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161C] border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-[#E2C275]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Transfer Reference / Note
              </label>
              <input
                type="text"
                value={payoutRef}
                onChange={(e) => setPayoutRef(e.target.value)}
                placeholder="e.g. HNB Bank Transfer #44812"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161C] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E2C275]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPayoutTarget(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-dark cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Mark as Paid</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
