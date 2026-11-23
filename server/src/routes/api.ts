import { Router } from 'express';
import { z } from 'zod';
import { COUPONS } from '../shared/coupons.js';
import { validateCoupon } from '../shared/pricing.js';
import { HttpError } from '../lib/errors.js';
import { buildOrder, orderInput } from '../lib/orders.js';
import type { Store } from '../lib/store.js';
import { createCheckoutSession, verifyStripeSignature } from '../lib/stripe.js';
import { fetchWooProducts } from '../lib/woocommerce.js';

export interface Config {
  clientUrl: string;
  stripeSecretKey?: string;
  stripeWebhookSecret?: string;
  woo?: { url: string; key: string; secret: string };
}

export function apiRouter(store: Store, config: Config) {
  const r = Router();

  r.get('/products', (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    res.json(store.listProducts().filter((p) => !category || p.category === category));
  });

  r.get('/products/:id', (req, res) => {
    const p = store.getProduct(req.params.id);
    if (!p) throw new HttpError(404, 'Product not found');
    res.json(p);
  });

  r.post('/coupons/validate', (req, res) => {
    const { code, subtotal } = z.object({ code: z.string(), subtotal: z.number().min(0) }).parse(req.body);
    const coupon = COUPONS.find((c) => c.code === code.toUpperCase());
    const error = validateCoupon(coupon, subtotal);
    res.status(error ? 400 : 200).json(error ? { valid: false, error } : { valid: true, coupon });
  });

  // Simple flow (no payment provider): create the order directly.
  r.post('/orders', (req, res) => {
    const order = buildOrder(store, orderInput.parse(req.body));
    store.saveOrder(order);
    order.lines.forEach((l) => store.decrementStock(l.productId, l.qty));
    res.status(201).json(order);
  });

  r.get('/orders/:id', (req, res) => {
    const o = store.getOrder(req.params.id);
    if (!o) throw new HttpError(404, 'Order not found');
    res.json(o);
  });

  // Stripe flow: create a pending order and a Checkout Session (TEST mode).
  r.post('/checkout/stripe', async (req, res) => {
    if (!config.stripeSecretKey) throw new HttpError(501, 'Stripe is not configured. Set STRIPE_SECRET_KEY (test key) in .env');
    const order = { ...buildOrder(store, orderInput.parse(req.body)), status: 'paid' as const };
    store.saveOrder({ ...order, status: 'pending' }); // stays "pending" until the webhook confirms payment
    const session = await createCheckoutSession(order, config.stripeSecretKey, config.clientUrl);
    res.json({ orderId: order.id, url: session.url });
  });

  // Optional: preview products from a WooCommerce store
  r.get('/import/woocommerce', async (_req, res) => {
    if (!config.woo) throw new HttpError(501, 'Set WOO_URL, WOO_KEY and WOO_SECRET in .env');
    res.json(await fetchWooProducts(config.woo.url, config.woo.key, config.woo.secret));
  });

  return r;
}

/** Webhook needs the RAW body to verify the signature, so it is mounted before express.json(). */
export function stripeWebhook(store: Store, config: Config) {
  const r = Router();
  r.post('/', (req, res) => {
    const raw = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : '';
    if (!config.stripeWebhookSecret || !verifyStripeSignature(raw, req.header('stripe-signature'), config.stripeWebhookSecret)) {
      throw new HttpError(400, 'Invalid signature');
    }
    const event = JSON.parse(raw) as { type: string; data: { object: { metadata?: { orderId?: string } } } };
    if (event.type === 'checkout.session.completed') {
      const id = event.data.object.metadata?.orderId;
      const order = id ? store.updateOrder(id, { status: 'paid' }) : undefined;
      order?.lines.forEach((l) => store.decrementStock(l.productId, l.qty));
    }
    res.json({ received: true });
  });
  return r;
}
