/**
 * Centralized Pricing & Currency Calculation Helpers for AuraFit.lk
 * Separates Cash / Card Price and KOKO Pay Price (including 9% fee).
 */

export const KOKO_FEE_RATE = 0.09; // 9% KOKO merchant / convenience fee

/**
 * Calculates total price when paying via KOKO (includes 9% fee).
 */
export function getKokoTotal(cashPrice: number): number {
  return Math.round(cashPrice * (1 + KOKO_FEE_RATE));
}

/**
 * Calculates per-installment amount when paying in 3 installments via KOKO.
 */
export function getKokoInstallment(cashPrice: number): number {
  return Math.round(getKokoTotal(cashPrice) / 3);
}

/**
 * Formats a numeric amount in Sri Lankan Rupees.
 * @param amount - The numeric price in LKR
 * @param showDecimals - If true, formats with two decimals e.g. "Rs. 28,500.00", else "Rs. 28,500"
 */
export function formatLKR(amount: number, showDecimals = true): string {
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
  return `Rs. ${formatted}`;
}

/**
 * Formats an amount without decimals, e.g. "Rs. 28,500".
 */
export function formatLKRNoDecimals(amount: number): string {
  return formatLKR(amount, false);
}

export type ProductDiscountType = "none" | "percentage" | "fixed_lkr";

export interface ProductProfitMetrics {
  regularPrice: number;
  costPrice: number;
  finalSellingPrice: number;
  unitProfit: number;
  marginPercent: number;
}

/**
 * Calculates final selling price, unit profit, and profit margin %
 * given regular selling price, landed cost price, and optional product discount.
 */
export function calculateProductPricing(
  regularPrice: number,
  costPrice: number,
  discountType: ProductDiscountType = "none",
  discountValue = 0
): ProductProfitMetrics {
  const safeRegular = Math.max(0, Math.round(Number(regularPrice) || 0));
  const safeCost = Math.max(0, Math.round(Number(costPrice) || 0));
  const safeDisc = Math.max(0, Number(discountValue) || 0);

  let finalSellingPrice = safeRegular;
  if (discountType === "percentage") {
    finalSellingPrice = Math.max(
      0,
      Math.round(safeRegular * (1 - Math.min(100, safeDisc) / 100))
    );
  } else if (discountType === "fixed_lkr") {
    finalSellingPrice = Math.max(0, Math.round(safeRegular - safeDisc));
  }

  const unitProfit = finalSellingPrice - safeCost;
  const marginPercent =
    finalSellingPrice > 0
      ? Math.round((unitProfit / finalSellingPrice) * 1000) / 10
      : 0;

  return {
    regularPrice: safeRegular,
    costPrice: safeCost,
    finalSellingPrice,
    unitProfit,
    marginPercent,
  };
}


