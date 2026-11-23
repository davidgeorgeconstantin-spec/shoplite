import type { Coupon, Totals } from '@/types';

export const FREE_SHIPPING_FROM = 200;
export const SHIPPING_COST = 19.99;

const round = (n: number) => Math.round(n * 100) / 100;

/** Size variants change the price (like WooCommerce variations). */
export function variantPrice(basePrice: number, size?: string): number {
  if (size === '500g') return round(basePrice * 1.8);
  if (size === '1kg') return round(basePrice * 3.3);
  return basePrice;
}

export function validateCoupon(coupon: Coupon | undefined, subtotal: number): string | null {
  if (!coupon) return 'This coupon does not exist.';
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return `Valid for orders over ${coupon.minSubtotal} RON.`;
  return null;
}

/** Pure function: same input → same output. Easy to test, and the server uses the same rules. */
export function computeTotals(subtotal: number, coupon?: Coupon): Totals {
  const valid = coupon && !validateCoupon(coupon, subtotal) ? coupon : undefined;
  let discount = 0;
  if (valid?.type === 'percent') discount = (subtotal * valid.value) / 100;
  if (valid?.type === 'fixed') discount = Math.min(valid.value, subtotal);
  const afterDiscount = subtotal - discount;
  const freeShip = valid?.code === 'FREESHIP' || afterDiscount >= FREE_SHIPPING_FROM || subtotal === 0;
  const shipping = freeShip ? 0 : SHIPPING_COST;
  return { subtotal: round(subtotal), discount: round(discount), shipping, total: round(afterDiscount + shipping) };
}
