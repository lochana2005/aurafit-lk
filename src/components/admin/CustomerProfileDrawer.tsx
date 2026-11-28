"use client";

import React, { useState } from "react";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Copy,
  MessageCircle,
  ShoppingBag,
  TicketPercent,
  Check,
  StickyNote,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export type CustomerTag = "VIP" | "Regular" | "COD Risk";

export interface CustomerOrderHistoryItem {
  orderId: string;
  date: string;
  itemsSummary: string;
  paymentMethod: "Card" | "KOKO 3x" | "COD";
  totalLkr: number;
  status: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  ordersCount: number;
  totalSpentLkr: number;
  promoCode?: string;
  coachName?: string;
  lastOrderDate: string;
  isNewLast30Days: boolean;
  tag: CustomerTag;
  adminNote: string;
  orderHistory: CustomerOrderHistoryItem[];
}

interface CustomerProfileDrawerProps {
  customer: AdminCustomer;
  onClose: () => void;
  onUpdateTag: (customerId: string, tag: CustomerTag) => void;
  onUpdateNote: (customerId: string, note: string) => void;
}

export default function CustomerProfileDrawer({
  customer,
  onClose,
  onUpdateTag,
  onUpdateNote,
}: CustomerProfileDrawerProps) {
  const { showToast } = useToast();
  const [noteDraft, setNoteDraft] = useState(customer.adminNote);
  const [noteSaved, setNoteSaved] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(customer.phone);
    showToast({
      type: "gold",
      title: "Phone Copied",
      subtitle: customer.phone,
    });
  };

  const handleSaveNote = () => {
    onUpdateNote(customer.id, noteDraft);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1800);
    showToast({
      type: "gold",
      title: "Customer Note Saved",
      subtitle: `Updated note for ${customer.name}.`,
    });
  };

  const whatsappUrl = `https://wa.me/${customer.phone.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(
    `Hello ${customer.name}, reaching out from AuraFit.lk!`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div
        data-lenis-prevent
        className="w-full max-w-xl h-full bg-[#0E0E12]/95 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto space-y-5 shadow-2xl scrollbar-thin"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37]">
              Athlete Customer Profile
            </span>
            <h2 className="text-2xl font-black uppercase tracking-wide text-white font-heading mt-0.5">
              {customer.name}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">{customer.city}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close customer drawer"
            className="p-2 rounded-xl bg-[#16161C] border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tag Selector */}
        <div className="p-3.5 rounded-xl bg-[#131318] border border-white/[0.08] flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Customer Tag
          </span>
          <div className="flex items-center gap-1.5">
            {(["VIP", "Regular", "COD Risk"] as CustomerTag[]).map((t) => {
              const active = customer.tag === t;
              const activeStyle =
                t === "VIP"
                  ? "bg-[#d4af37]/20 border-[#d4af37]/50 text-[#d4af37]"
                  : t === "COD Risk"
                  ? "bg-red-500/20 border-red-500/45 text-red-300"
                  : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300";

              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onUpdateTag(customer.id, t)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                    active
                      ? activeStyle
                      : "bg-[#09090B] border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact & Address Card */}
        <div className="p-4 rounded-xl bg-[#131318] border border-white/[0.08] space-y-2.5 text-xs text-zinc-300">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 font-mono text-white">
              <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyPhone}
                className="px-2.5 py-1 rounded-lg bg-[#09090B] border border-white/10 text-[11px] font-semibold text-zinc-300 hover:border-[#d4af37]/50 inline-flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/35 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/25 inline-flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp Chat</span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
            <span>{customer.email}</span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
            <span>{customer.address}</span>
          </div>
        </div>

        {/* Lifetime Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#131318] border border-white/[0.08]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
              Total Orders
            </span>
            <span className="text-xl font-black font-heading text-white mt-1 block">
              {customer.ordersCount}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#131318] border border-[#d4af37]/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] block">
              Total Spent
            </span>
            <span className="text-base sm:text-lg font-black font-mono text-white mt-1 block">
              Rs. {customer.totalSpentLkr.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#131318] border border-white/[0.08]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <TicketPercent className="w-3 h-3 text-[#d4af37]" />
              <span>Coach / Promo</span>
            </span>
            {customer.promoCode ? (
              <div className="mt-1">
                <span className="text-xs font-mono font-bold text-[#d4af37] block">
                  {customer.promoCode}
                </span>
                <span className="text-[10px] text-zinc-400 truncate block">
                  {customer.coachName}
                </span>
              </div>
            ) : (
              <span className="text-xs text-zinc-500 mt-1.5 block">
                Direct Store
              </span>
            )}
          </div>
        </div>

        {/* Editable Admin Customer Note */}
        <div className="p-4 rounded-xl bg-[#131318] border border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Admin Customer Note</span>
            </label>
            <button
              type="button"
              onClick={handleSaveNote}
              className="px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider btn-aurafit-gold inline-flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>{noteSaved ? "Saved" : "Save Note"}</span>
            </button>
          </div>
          <textarea
            rows={2}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Preferred delivery window, supplement goal, or COD verification note..."
            className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37] resize-none"
          />
        </div>

        {/* Order & Supplement History */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>
                Order &amp; Supplement History ({customer.orderHistory.length})
              </span>
            </h3>
          </div>

          <div className="space-y-2.5">
            {customer.orderHistory.map((ord) => (
              <div
                key={ord.orderId}
                className="p-3.5 rounded-xl bg-[#131318] border border-white/[0.08] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">
                      {ord.orderId}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {ord.date}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      ord.status === "Delivered"
                        ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-300"
                        : ord.status === "Cancelled"
                        ? "bg-red-500/15 border-red-500/35 text-red-300"
                        : "bg-[#38BDF8]/15 border-[#38BDF8]/35 text-[#38BDF8]"
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                <p className="text-zinc-300 leading-relaxed">
                  {ord.itemsSummary}
                </p>

                <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ord.paymentMethod === "COD"
                        ? "bg-amber-500/15 text-amber-300"
                        : ord.paymentMethod === "KOKO 3x"
                        ? "bg-[#38BDF8]/15 text-[#38BDF8]"
                        : "bg-emerald-500/15 text-emerald-300"
                    }`}
                  >
                    {ord.paymentMethod}
                  </span>
                  <span className="font-mono font-bold text-white">
                    Rs. {ord.totalLkr.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
