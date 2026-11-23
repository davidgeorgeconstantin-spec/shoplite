import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Order } from '../shared/types.js';

/**
 * Minimal Stripe Checkout integration using the REST API directly (no SDK), so you can see what happens.
 * Use a TEST key (sk_test_...) — Stripe test mode is free and never moves real money.
 */
export async function createCheckoutSession(order: Order, secretKey: string, clientUrl: string): Promise<{ id: string; url: string }> {
  const body = new URLSearchParams({
    mode: 'payment',
    success_url: `${clientUrl}/order/?id=${order.id}`,
    cancel_url: `${clientUrl}/checkout/`,
    customer_email: order.customer.email,
    'metadata[orderId]': order.id,
  });
  order.lines.forEach((l, i) => {
    body.set(`line_items[${i}][quantity]`, String(l.qty));
    body.set(`line_items[${i}][price_data][currency]`, 'ron');
    body.set(`line_items[${i}][price_data][unit_amount]`, String(Math.round(l.unitPrice * 100))); // in bani
    body.set(`line_items[${i}][price_data][product_data][name]`, `${l.name} (${l.variant})`);
  });
  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Stripe error ${res.status}`);
  return (await res.json()) as { id: string; url: string };
}

/**
 * Verifies the `Stripe-Signature` header (t=timestamp,v1=hmac). This is how we know the webhook
 * really comes from Stripe and not from someone who found our URL.
 */
export function verifyStripeSignature(rawBody: string, header: string | undefined, secret: string, toleranceSec = 300): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(',').map((kv) => kv.split('=') as [string, string]));
  const t = Number(parts.t);
  const sig = parts.v1;
  if (!t || !sig || Math.abs(Date.now() / 1000 - t) > toleranceSec) return false;
  const expected = createHmac('sha256', secret).update(`${t}.${rawBody}`).digest('hex');
  return expected.length === sig.length && timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}
