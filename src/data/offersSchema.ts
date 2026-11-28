export type OfferDiscountType = "percentage" | "fixed_lkr" | "bundle";
export type OfferTargetScope = "entire_store" | "category" | "product";
export type OfferComputedStatus = "LIVE" | "SCHEDULED" | "EXPIRED" | "PAUSED";

export interface TimedOffer {
  id: string;
  headline: string;
  subtitle: string;
  badgeText: string;
  discountType: OfferDiscountType;
  discountValue: number;
  promoCode?: string;
  targetScope: OfferTargetScope;
  targetCategory?: string;
  targetProductId?: string;
  targetProductName?: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  showCountdown: boolean;
  isActive: boolean;
}

export const SEED_OFFERS: TimedOffer[] = [
  {
    id: "offer_flash_whey",
    headline: "GOLD STANDARD ISOLATE FLASH DROP",
    subtitle:
      "Limited-time vault release on 100% Whey Isolate tubs with verified USA batch seals.",
    badgeText: "20% OFF",
    discountType: "percentage",
    discountValue: 20,
    promoCode: "FLASH20",
    targetScope: "category",
    targetCategory: "Whey Protein",
    bannerImage: "/images/products/gold-standard-isolate.png",
    startDate: "2026-11-27T00:00:00",
    endDate: "2026-12-03T23:59:59",
    showCountdown: true,
    isActive: true,
  },
  {
    id: "offer_bundle_pre",
    headline: "PRE-WORKOUT + CREATINE POWER STACK",
    subtitle:
      "Claim a complimentary AuraFit Shaker & Micronized Creatine sample with any Pre-Workout.",
    badgeText: "FREE SHAKER + CREATINE",
    discountType: "bundle",
    discountValue: 0,
    promoCode: "STACKVIP",
    targetScope: "category",
    targetCategory: "Pre Workout",
    bannerImage: "/images/products/c4-preworkout.png",
    startDate: "2026-11-28T00:00:00",
    endDate: "2026-12-01T20:00:00",
    showCountdown: true,
    isActive: true,
  },
  {
    id: "offer_scheduled_dec",
    headline: "DECEMBER MASS GAINER BLITZ",
    subtitle:
      "Flat Rs. 4,500 off all 6 kg high-calorie lean mass formulas for islandwide athletes.",
    badgeText: "SAVE Rs. 4,500",
    discountType: "fixed_lkr",
    discountValue: 4500,
    promoCode: "MASS4500",
    targetScope: "category",
    targetCategory: "Mass Gainer",
    bannerImage: "/images/products/critical-mass.png",
    startDate: "2026-12-05T00:00:00",
    endDate: "2026-12-10T23:59:59",
    showCountdown: true,
    isActive: true,
  },
  {
    id: "offer_expired_nov",
    headline: "BLACK WEEK CREATINE DROP",
    subtitle: "15% off Micronized Creatine Monohydrate 400g tubs.",
    badgeText: "15% OFF",
    discountType: "percentage",
    discountValue: 15,
    promoCode: "CR15",
    targetScope: "category",
    targetCategory: "Creatine",
    bannerImage: "/images/products/creatine-monohydrate.png",
    startDate: "2026-11-15T00:00:00",
    endDate: "2026-11-20T23:59:59",
    showCountdown: true,
    isActive: true,
  },
];

export function getOfferStatus(
  offer: TimedOffer,
  nowMs: number
): OfferComputedStatus {
  if (!offer.isActive) return "PAUSED";
  const startMs = Date.parse(offer.startDate);
  const endMs = Date.parse(offer.endDate);
  if (!Number.isNaN(startMs) && nowMs < startMs) return "SCHEDULED";
  if (!Number.isNaN(endMs) && nowMs > endMs) return "EXPIRED";
  return "LIVE";
}

export function getCountdownParts(endDateIso: string, nowMs: number) {
  const endMs = Date.parse(endDateIso);
  const diff = Math.max(0, (Number.isNaN(endMs) ? nowMs : endMs) - nowMs);
  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
    isExpired: diff <= 0,
  };
}
