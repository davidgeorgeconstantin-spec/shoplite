import { createId } from '@/lib/id';
import type { Coupon, Customer, Order, Product, CartItem, Totals } from '@/types';
import { variantPrice } from '@/lib/pricing';

/**
 * Simulated payment. In the real version (see /server) this is where we create a
 * Stripe Checkout Session in TEST mode and wait for the webhook before marking the order as paid.
 */
export async function placeOrder(input: { items: CartItem[]; products: Product[]; customer: Customer; totals: Totals; coupon?: Coupon }): Promise<Order> {
  await new Promise((r) => setTimeout(r, 1400)); // pretend we talk to a payment provider
  return {
    id: createId('SL-'),
    lines: input.items.map((i) => {
      const p = input.products.find((x) => x.id === i.productId)!;
      return { productId: p.id, name: p.name, variant: [i.size, i.color].filter(Boolean).join(' · ') || 'Standard', unitPrice: variantPrice(p.price, i.size), qty: i.qty };
    }),
    totals: input.totals,
    coupon: input.coupon?.code,
    customer: input.customer,
    status: 'paid',
    createdAt: new Date().toISOString(),
  };
}
