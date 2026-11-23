import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { COUPONS } from '../shared/coupons.js';
import { computeTotals, validateCoupon, variantPrice } from '../shared/pricing.js';
import type { Order } from '../shared/types.js';
import { HttpError } from './errors.js';
import type { Store } from './store.js';

export const orderInput = z.object({
  items: z.array(z.object({ productId: z.string(), size: z.string().optional(), color: z.string().optional(), qty: z.number().int().min(1).max(20) })).min(1),
  couponCode: z.string().optional(),
  customer: z.object({ name: z.string().min(2), email: z.string().email(), address: z.string().min(5), city: z.string().min(2) }),
});
export type OrderInput = z.infer<typeof orderInput>;

/**
 * NEVER trust prices sent by the browser: the server recomputes everything
 * from its own catalog, checks stock and validates the coupon.
 */
export function buildOrder(store: Store, input: OrderInput): Order {
  const lines = input.items.map((item) => {
    const p = store.getProduct(item.productId);
    if (!p) throw new HttpError(400, `Unknown product ${item.productId}`);
    if (item.size && !p.sizes?.includes(item.size)) throw new HttpError(400, `Invalid size for ${p.name}`);
    if (item.color && !p.colors?.some((c) => c.name === item.color)) throw new HttpError(400, `Invalid color for ${p.name}`);
    if (p.stock < item.qty) throw new HttpError(409, `Not enough stock for ${p.name}`);
    return { productId: p.id, name: p.name, variant: [item.size, item.color].filter(Boolean).join(' · ') || 'Standard', unitPrice: variantPrice(p.price, item.size), qty: item.qty };
  });
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const coupon = input.couponCode ? COUPONS.find((c) => c.code === input.couponCode!.toUpperCase()) : undefined;
  if (input.couponCode) {
    const err = validateCoupon(coupon, subtotal);
    if (err) throw new HttpError(400, err);
  }
  return {
    id: 'SL-' + randomUUID().slice(0, 6).toUpperCase(),
    lines,
    totals: computeTotals(subtotal, coupon),
    coupon: coupon?.code,
    customer: input.customer,
    status: 'paid',
    createdAt: new Date().toISOString(),
  };
}
