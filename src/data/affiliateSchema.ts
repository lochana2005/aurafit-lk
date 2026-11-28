export type DiscountValueType = "percentage" | "fixed_lkr";

export interface CoachAffiliate {
  id: string;
  name: string;
  contactInfo: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  coachId: string;
  discountType: DiscountValueType;
  discountValue: number;
  cashbackType: DiscountValueType;
  cashbackValue: number;
  isActive: boolean;
  createdAt: string;
}

export interface CashbackPayout {
  id: string;
  coachId: string;
  promoCodeId: string;
  amountLkr: number;
  referenceNote: string;
  paidAt: string;
  recordedBy: string;
}

export interface PromoValidationResult {
  valid: boolean;
  promo?: PromoCode;
  coach?: CoachAffiliate;
  discountAmount: number;
  cashbackAmount: number;
  discountLabel: string;
  error?: string;
}

export const SEED_COACHES: CoachAffiliate[] = [
  {
    id: "coach_aurafit_vip",
    name: "AuraFit VIP Club",
    contactInfo: "+94 11 234 5678",
    email: "vip@aurafit.lk",
    isActive: true,
    createdAt: "2026-11-01T08:00:00.000Z",
  },
  {
    id: "coach_kasun_01",
    name: "Coach Kasun Wijesinghe",
    contactInfo: "+94 77 512 8840",
    email: "kasun.coach@gmail.com",
    isActive: true,
    createdAt: "2026-11-05T09:30:00.000Z",
  },
  {
    id: "coach_rohan_02",
    name: "Rohan Fitness Studio",
    contactInfo: "+94 71 904 3311",
    email: "rohan@fitstudio.lk",
    isActive: true,
    createdAt: "2026-11-10T11:15:00.000Z",
  },
];

export const SEED_PROMO_CODES: PromoCode[] = [
  {
    id: "promo_aura10",
    code: "AURA10",
    coachId: "coach_aurafit_vip",
    discountType: "percentage",
    discountValue: 10,
    cashbackType: "percentage",
    cashbackValue: 0,
    isActive: true,
    createdAt: "2026-11-01T08:00:00.000Z",
  },
  {
    id: "promo_coach10",
    code: "COACH10",
    coachId: "coach_kasun_01",
    discountType: "percentage",
    discountValue: 10,
    cashbackType: "percentage",
    cashbackValue: 5,
    isActive: true,
    createdAt: "2026-11-05T09:30:00.000Z",
  },
  {
    id: "promo_rohan1500",
    code: "ROHAN1500",
    coachId: "coach_rohan_02",
    discountType: "fixed_lkr",
    discountValue: 1500,
    cashbackType: "fixed_lkr",
    cashbackValue: 1000,
    isActive: true,
    createdAt: "2026-11-10T11:15:00.000Z",
  },
];

export const SEED_CASHBACK_PAYOUTS: CashbackPayout[] = [
  {
    id: "pay_seed_01",
    coachId: "coach_kasun_01",
    promoCodeId: "promo_coach10",
    amountLkr: 1500,
    referenceNote: "Sampath Bank Transfer #SB-90214",
    paidAt: "Nov 26, 2026",
    recordedBy: "Admin Vault",
  },
];

export function evaluatePromoCode(
  rawCode: string,
  subtotal: number,
  promoCodes: PromoCode[],
  coaches: CoachAffiliate[]
): PromoValidationResult {
  const cleaned = rawCode.trim().toUpperCase();
  if (!cleaned) {
    return {
      valid: false,
      discountAmount: 0,
      cashbackAmount: 0,
      discountLabel: "",
      error: "Please enter a promo code.",
    };
  }

  const promo = promoCodes.find((p) => p.code.toUpperCase() === cleaned);
  if (!promo || !promo.isActive) {
    return {
      valid: false,
      discountAmount: 0,
      cashbackAmount: 0,
      discountLabel: "",
      error: 'Invalid or inactive promo code. Try "AURA10" or "COACH10".',
    };
  }

  const coach = coaches.find((c) => c.id === promo.coachId);
  if (coach && !coach.isActive) {
    return {
      valid: false,
      discountAmount: 0,
      cashbackAmount: 0,
      discountLabel: "",
      error: "This affiliate promo code is currently paused.",
    };
  }

  const discountAmount =
    promo.discountType === "percentage"
      ? Math.round((subtotal * promo.discountValue) / 100)
      : Math.min(subtotal, Math.round(promo.discountValue));

  const netOrderSubtotal = Math.max(0, subtotal - discountAmount);
  const cashbackAmount =
    promo.cashbackType === "percentage"
      ? Math.round((netOrderSubtotal * promo.cashbackValue) / 100)
      : Math.round(promo.cashbackValue);

  const discountLabel =
    promo.discountType === "percentage"
      ? `${promo.discountValue}% OFF`
      : `Rs. ${promo.discountValue.toLocaleString()} OFF`;

  return {
    valid: true,
    promo,
    coach,
    discountAmount,
    cashbackAmount,
    discountLabel,
  };
}
