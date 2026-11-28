"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Flame,
  CalendarClock,
  Clock,
  Percent,
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import {
  TimedOffer,
  OfferComputedStatus,
  getOfferStatus,
  getCountdownParts,
} from "@/data/offersSchema";
import OfferFormModal from "@/components/admin/OfferFormModal";
import StudioImage from "@/components/StudioImage";

type OfferFilterTab = "ALL OFFERS" | "LIVE NOW" | "SCHEDULED" | "EXPIRED" | "PAUSED";
const SSR_ANCHOR_MS = Date.parse("2026-11-29T00:00:00");

export default function AdminOffersPage() {
  const { offers, saveOffer, toggleOfferStatus, deleteOffer } = useAdmin();
  const [tab, setTab] = useState<OfferFilterTab>("ALL OFFERS");
  const [search, setSearch] = useState("");
  const [nowMs, setNowMs] = useState<number>(SSR_ANCHOR_MS);
  const [modalState, setModalState] = useState<{
    open: boolean;
    editing: TimedOffer | null;
  }>({ open: false, editing: null });

  useEffect(() => {
    const syncTimer = setTimeout(() => setNowMs(Date.now()), 0);
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => {
      clearTimeout(syncTimer);
      clearInterval(interval);
    };
  }, []);

  const enriched = useMemo(() => {
    return offers.map((offer) => ({
      offer,
      status: getOfferStatus(offer, nowMs),
    }));
  }, [offers, nowMs]);

  const counts = useMemo<Record<OfferFilterTab, number>>(
    () => ({
      "ALL OFFERS": enriched.length,
      "LIVE NOW": enriched.filter((e) => e.status === "LIVE").length,
      SCHEDULED: enriched.filter((e) => e.status === "SCHEDULED").length,
      EXPIRED: enriched.filter((e) => e.status === "EXPIRED").length,
      PAUSED: enriched.filter((e) => e.status === "PAUSED").length,
    }),
    [enriched]
  );

  const avgDiscount = useMemo(() => {
    const pctOffers = offers.filter(
      (o) => o.discountType === "percentage" && o.discountValue > 0
    );
    if (pctOffers.length === 0) return 0;
    return Math.round(
      pctOffers.reduce((s, o) => s + o.discountValue, 0) / pctOffers.length
    );
  }, [offers]);

  const filtered = useMemo(() => {
    return enriched.filter(({ offer, status }) => {
      if (tab === "LIVE NOW" && status !== "LIVE") return false;
      if (tab === "SCHEDULED" && status !== "SCHEDULED") return false;
      if (tab === "EXPIRED" && status !== "EXPIRED") return false;
      if (tab === "PAUSED" && status !== "PAUSED") return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          offer.headline.toLowerCase().includes(q) ||
          offer.badgeText.toLowerCase().includes(q) ||
          (offer.promoCode || "").toLowerCase().includes(q) ||
          (offer.targetCategory || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [enriched, tab, search]);

  const statusBadgeClass = (status: OfferComputedStatus) => {
    if (status === "LIVE")
      return "bg-emerald-500/15 border-emerald-500/40 text-emerald-300";
    if (status === "SCHEDULED")
      return "bg-[#38BDF8]/15 border-[#38BDF8]/40 text-[#38BDF8]";
    if (status === "EXPIRED")
      return "bg-red-500/15 border-red-500/40 text-red-300";
    return "bg-zinc-800 border-white/10 text-zinc-400";
  };

  return (
    <div className="-m-4 sm:-m-6 lg:-m-8 h-[calc(100vh-4rem)] flex flex-col overflow-hidden px-4 sm:px-6 py-4 gap-4 bg-[#09090B]">
      {/* Fixed Top Command Deck */}
      <div className="shrink-0 rounded-xl border border-white/[0.08] bg-[#0e0e12] overflow-hidden">
        {/* Compact 4-Column KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
          <div className="px-5 py-3.5 border-t-2 border-t-[#d4af37]/80 lg:border-t-0 lg:border-l-2 lg:border-l-[#d4af37]/80">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                LIVE OFFERS
              </span>
              <Flame className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-heading mt-1">
              {counts["LIVE NOW"]}
            </div>
          </div>

          <div className="px-5 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                SCHEDULED DEALS
              </span>
              <CalendarClock className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#38BDF8] font-heading mt-1">
              {counts.SCHEDULED}
            </div>
          </div>

          <div className="px-5 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                EXPIRED OFFERS
              </span>
              <Clock className="w-3.5 h-3.5 text-red-400 shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-red-300 font-heading mt-1">
              {counts.EXPIRED}
            </div>
          </div>

          <div className="px-5 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                AVG. DEAL DISCOUNT
              </span>
              <Percent className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#d4af37] font-heading mt-1">
              {avgDiscount}%
            </div>
          </div>
        </div>

        {/* Filter & Action Toolbar */}
        <div className="px-4 py-3 bg-[#131318] border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                "ALL OFFERS",
                "LIVE NOW",
                "SCHEDULED",
                "EXPIRED",
                "PAUSED",
              ] as OfferFilterTab[]
            ).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer ${
                  tab === t ? "btn-aurafit-gold" : "btn-aurafit-dark"
                }`}
              >
                <span>{t}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full font-mono text-[10px] leading-none ${
                    tab === t
                      ? "bg-[#09090B] text-white"
                      : "bg-[#09090B]/70 text-[#E2C275]"
                  }`}
                >
                  {counts[t]}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search headline, code..."
                className="w-full bg-[#09090B] border border-white/12 focus:border-[#d4af37] rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setModalState({ open: true, editing: null })}
              className="px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>CREATE OFFER</span>
            </button>
          </div>
        </div>
      </div>

      {/* Framed Scrollable Offers List */}
      <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-white/[0.08] bg-[#0e0e12] overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col overflow-x-auto">
          <div className="min-w-[980px] flex-1 min-h-0 flex flex-col">
            {/* Pinned Header Row */}
            <div className="shrink-0 bg-[#131318] border-b border-white/[0.08] grid grid-cols-[minmax(250px,2fr)_minmax(120px,1fr)_minmax(130px,1fr)_minmax(160px,1.2fr)_minmax(130px,1fr)_minmax(95px,0.8fr)_minmax(150px,1fr)] items-center px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              <div>Offer &amp; Artwork</div>
              <div>Discount Badge</div>
              <div>Target Scope</div>
              <div>Schedule Window</div>
              <div>Countdown</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Scrollable Body */}
            <div
              data-lenis-prevent
              className="flex-1 min-h-0 overflow-y-auto divide-y divide-white/[0.06] scrollbar-thin"
            >
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500 uppercase tracking-widest">
                  No offers match your current filter.
                </div>
              ) : (
                filtered.map(({ offer, status }) => {
                  const countdown = getCountdownParts(offer.endDate, nowMs);
                  const scopeLabel =
                    offer.targetScope === "entire_store"
                      ? "All Store"
                      : offer.targetScope === "category"
                      ? offer.targetCategory || "Category"
                      : offer.targetProductName || "Product";

                  return (
                    <div
                      key={offer.id}
                      className="grid grid-cols-[minmax(250px,2fr)_minmax(120px,1fr)_minmax(130px,1fr)_minmax(160px,1.2fr)_minmax(130px,1fr)_minmax(95px,0.8fr)_minmax(150px,1fr)] items-center px-5 py-3.5 text-xs hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3 pr-3 min-w-0">
                        <div className="relative w-11 h-11 rounded-lg bg-[#09090B] border border-white/10 p-1 shrink-0 overflow-hidden">
                          <StudioImage
                            src={offer.bannerImage}
                            alt={offer.headline}
                            fill
                            sizes="44px"
                            objectFit="contain"
                            fallbackLabel={offer.headline}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white font-heading uppercase truncate">
                            {offer.headline}
                          </div>
                          {offer.promoCode && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-[#d4af37]/15 font-mono text-[10px] text-[#d4af37]">
                              {offer.promoCode}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pr-3">
                        <span className="px-2 py-0.5 rounded bg-[#d4af37]/15 border border-[#d4af37]/35 font-bold text-[#d4af37] text-[11px]">
                          {offer.badgeText}
                        </span>
                      </div>

                      <div className="text-zinc-300 pr-3 truncate">
                        {scopeLabel}
                      </div>

                      <div className="font-mono text-[11px] text-zinc-400 pr-3">
                        <div>{offer.startDate.slice(0, 10)}</div>
                        <div className="text-zinc-500">
                          → {offer.endDate.slice(0, 10)}
                        </div>
                      </div>

                      <div className="font-mono text-[11px] text-[#d4af37] pr-3">
                        {status === "EXPIRED"
                          ? "Ended"
                          : `${countdown.days}d : ${countdown.hours}h : ${countdown.minutes}m : ${countdown.seconds}s`}
                      </div>

                      <div className="pr-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${statusBadgeClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleOfferStatus(offer.id)}
                          aria-label={
                            offer.isActive ? "Pause offer" : "Activate offer"
                          }
                          className={`p-1.5 rounded-lg border cursor-pointer ${
                            offer.isActive
                              ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-300"
                              : "bg-zinc-800 border-white/10 text-zinc-400"
                          }`}
                        >
                          {offer.isActive ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setModalState({ open: true, editing: offer })
                          }
                          aria-label={`Edit ${offer.headline}`}
                          className="p-1.5 rounded-lg bg-[#16161C] border border-white/10 text-zinc-300 hover:text-[#d4af37] cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteOffer(offer.id)}
                          aria-label={`Delete ${offer.headline}`}
                          className="p-1.5 rounded-lg bg-[#16161C] border border-white/10 text-zinc-400 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Timed Offer Modal */}
      {modalState.open && (
        <OfferFormModal
          editingOffer={modalState.editing}
          onClose={() => setModalState({ open: false, editing: null })}
          onSave={saveOffer}
        />
      )}
    </div>
  );
}
