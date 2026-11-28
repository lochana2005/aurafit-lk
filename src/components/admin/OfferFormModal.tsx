"use client";

import React, { useState, useRef } from "react";
import { X, Check, Upload, Flame, Clock } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/context/ToastContext";
import {
  TimedOffer,
  OfferDiscountType,
  OfferTargetScope,
} from "@/data/offersSchema";

interface OfferFormModalProps {
  editingOffer: TimedOffer | null;
  onClose: () => void;
  onSave: (offer: TimedOffer, isNew: boolean) => void;
}

const toLocalDatetimeValue = (isoOrLocal: string) => {
  if (!isoOrLocal) return "";
  return isoOrLocal.slice(0, 16);
};

export default function OfferFormModal({
  editingOffer,
  onClose,
  onSave,
}: OfferFormModalProps) {
  const { categories, products } = useAdmin();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [headline, setHeadline] = useState(
    editingOffer?.headline || ""
  );
  const [subtitle, setSubtitle] = useState(
    editingOffer?.subtitle || ""
  );
  const [badgeText, setBadgeText] = useState(
    editingOffer?.badgeText || "20% OFF"
  );
  const [discountType, setDiscountType] = useState<OfferDiscountType>(
    editingOffer?.discountType || "percentage"
  );
  const [discountValue, setDiscountValue] = useState(
    String(editingOffer?.discountValue ?? 20)
  );
  const [promoCode, setPromoCode] = useState(editingOffer?.promoCode || "");
  const [targetScope, setTargetScope] = useState<OfferTargetScope>(
    editingOffer?.targetScope || "entire_store"
  );
  const [targetCategory, setTargetCategory] = useState(
    editingOffer?.targetCategory || categories[0]?.name || "Whey Protein"
  );
  const [targetProductId, setTargetProductId] = useState(
    editingOffer?.targetProductId || products[0]?.id || ""
  );
  const [bannerImage, setBannerImage] = useState(
    editingOffer?.bannerImage || "/images/products/gold-standard-isolate.png"
  );
  const [startDate, setStartDate] = useState(() =>
    editingOffer
      ? toLocalDatetimeValue(editingOffer.startDate)
      : "2026-11-29T00:00"
  );
  const [endDate, setEndDate] = useState(() =>
    editingOffer
      ? toLocalDatetimeValue(editingOffer.endDate)
      : "2026-12-02T23:59"
  );
  const [showCountdown, setShowCountdown] = useState(
    editingOffer?.showCountdown ?? true
  );
  const [isActive, setIsActive] = useState(editingOffer?.isActive ?? true);

  const applyDurationPreset = (hours: number) => {
    const base = startDate ? new Date(startDate) : new Date();
    const target = new Date(base.getTime() + hours * 3600 * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    const formatted = `${target.getFullYear()}-${pad(
      target.getMonth() + 1
    )}-${pad(target.getDate())}T${pad(target.getHours())}:${pad(
      target.getMinutes()
    )}`;
    setEndDate(formatted);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/webp"].includes(file.type)) {
      showToast({
        type: "error",
        title: "Unsupported Format",
        subtitle: "Please upload a PNG or WebP image.",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setBannerImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) {
      showToast({
        type: "error",
        title: "Offer Headline Required",
        subtitle: "Enter a headline for this flash deal.",
      });
      return;
    }

    const matchedProduct = products.find((p) => p.id === targetProductId);

    const payload: TimedOffer = {
      id: editingOffer?.id || `offer_${Date.now()}`,
      headline: headline.trim().toUpperCase(),
      subtitle:
        subtitle.trim() ||
        "Limited-time authentic supplement deal for Sri Lankan athletes.",
      badgeText: badgeText.trim().toUpperCase() || "FLASH DEAL",
      discountType,
      discountValue: Math.max(0, Number(discountValue) || 0),
      promoCode: promoCode.trim().toUpperCase() || undefined,
      targetScope,
      targetCategory: targetScope === "category" ? targetCategory : undefined,
      targetProductId: targetScope === "product" ? targetProductId : undefined,
      targetProductName:
        targetScope === "product" ? matchedProduct?.name : undefined,
      bannerImage:
        bannerImage.trim() || "/images/products/gold-standard-isolate.png",
      startDate: startDate.length === 16 ? `${startDate}:00` : startDate,
      endDate: endDate.length === 16 ? `${endDate}:00` : endDate,
      showCountdown,
      isActive,
    };

    onSave(payload, !editingOffer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div
        data-lenis-prevent
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#111115]/95 backdrop-blur-xl border border-[#d4af37]/35 rounded-2xl p-6 space-y-5 shadow-2xl scrollbar-thin"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4af37] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              <span>Storefront Flash Deal Builder</span>
            </span>
            <h2 className="text-xl font-black uppercase tracking-wider text-white font-heading mt-0.5">
              {editingOffer ? "Edit Timed Offer" : "Create Timed Offer"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#16161C] border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Live Card Mini Preview */}
          <div className="p-4 rounded-xl bg-[#09090B] border border-[#d4af37]/30 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#16161C] border border-white/10 p-1.5 shrink-0 overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bannerImage}
                alt="Offer preview"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-[#d4af37] text-[#09090B] text-[10px] font-black uppercase">
                  {badgeText || "20% OFF"}
                </span>
                {promoCode && (
                  <span className="px-2 py-0.5 rounded bg-[#16161C] border border-[#d4af37]/40 font-mono text-[10px] text-[#d4af37]">
                    {promoCode.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="font-heading font-black text-white uppercase truncate mt-1">
                {headline || "FLASH DEAL HEADLINE PREVIEW"}
              </p>
              <p className="text-[11px] text-zinc-400 truncate">
                {subtitle || "Limited-time offer subtitle"}
              </p>
            </div>
          </div>

          {/* Offer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Offer Headline *
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. GOLD STANDARD ISOLATE FLASH DROP"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161C] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Subtitle / Tagline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Limited-time vault release on 100% Whey Isolate tubs."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161C] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Offer Badge Text *
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g. 20% OFF or FREE SHAKER"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161C] border border-white/10 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Optional Promo Code
              </label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="e.g. FLASH20"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161C] border border-white/10 text-sm font-mono uppercase text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) =>
                  setDiscountType(e.target.value as OfferDiscountType)
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161C] border border-white/10 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed_lkr">Fixed Amount (LKR)</option>
                <option value="bundle">Bundle / Free Gift</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Discount Value
              </label>
              <input
                type="number"
                min={0}
                disabled={discountType === "bundle"}
                value={discountType === "bundle" ? 0 : discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161C] border border-white/10 text-sm font-mono text-white disabled:opacity-40 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Target Scope */}
          <div className="p-4 rounded-xl bg-[#16161C] border border-white/10 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-white block">
              Target Scope
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={targetScope}
                onChange={(e) =>
                  setTargetScope(e.target.value as OfferTargetScope)
                }
                className="px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="entire_store">Entire Store</option>
                <option value="category">Specific Category</option>
                <option value="product">Selected Supplement</option>
              </select>

              {targetScope === "category" && (
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}

              {targetScope === "product" && (
                <select
                  value={targetProductId}
                  onChange={(e) => setTargetProductId(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#09090B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#d4af37]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Banner / Artwork Uploader */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
              Offer Artwork / Banner (PNG / WebP or URL)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-[#16161C] border border-dashed border-[#d4af37]/45 text-xs font-bold uppercase tracking-wider text-[#d4af37] hover:bg-[#d4af37]/10 inline-flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PNG / WebP</span>
              </button>
              <input
                type="text"
                value={bannerImage.startsWith("data:") ? "" : bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                placeholder="/images/products/gold-standard-isolate.png"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#16161C] border border-white/10 text-xs font-mono text-zinc-300 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Time Schedule & Countdown Settings */}
          <div className="p-4 rounded-xl bg-[#16161C] border border-white/10 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Time Schedule &amp; Presets</span>
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: "+24 Hours", hrs: 24 },
                  { label: "+3 Days", hrs: 72 },
                  { label: "+7 Days", hrs: 168 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyDurationPreset(preset.hrs)}
                    className="px-2.5 py-1 rounded-lg bg-[#09090B] border border-white/10 text-[10px] font-mono font-bold text-[#d4af37] hover:border-[#d4af37]/50 cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 uppercase block">
                  Start Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 uppercase block">
                  End Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#09090B] border border-white/8">
                <span className="text-xs font-semibold text-zinc-200">
                  Show Live Countdown Timer
                </span>
                <button
                  type="button"
                  onClick={() => setShowCountdown((v) => !v)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border cursor-pointer ${
                    showCountdown
                      ? "bg-[#d4af37]/15 border-[#d4af37]/40 text-[#d4af37]"
                      : "bg-zinc-800 border-white/10 text-zinc-400"
                  }`}
                >
                  {showCountdown ? "ON" : "OFF"}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#09090B] border border-white/8">
                <span className="text-xs font-semibold text-zinc-200">
                  Offer Status
                </span>
                <button
                  type="button"
                  onClick={() => setIsActive((v) => !v)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border cursor-pointer ${
                    isActive
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                      : "bg-zinc-800 border-white/10 text-zinc-400"
                  }`}
                >
                  {isActive ? "ACTIVE" : "PAUSED"}
                </button>
              </div>
            </div>
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
              <span>{editingOffer ? "Save Offer" : "Publish Offer"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
