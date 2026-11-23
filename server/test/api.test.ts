import { createHmac } from 'node:crypto';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { createMemoryStore } from '../src/lib/store.js';
import { computeTotals } from '../src/shared/pricing.js';

const customer = { name: 'Ana Pop', email: 'ana@example.com', address: 'Str. Lalelelor 1', city: 'Cluj' };
const config = { clientUrl: 'http://localhost:3000/shoplite', stripeWebhookSecret: 'whsec_test' };

describe('pricing', () => {
  it('adds shipping under 200 RON and removes it above', () => {
    expect(computeTotals(100).shipping).toBeGreaterThan(0);
    expect(computeTotals(250).shipping).toBe(0);
  });
  it('applies percent coupons', () => {
    expect(computeTotals(300, { code: 'X', type: 'percent', value: 10, description: '' }).discount).toBe(30);
  });
});

describe('API', () => {
  it('lists and filters products', async () => {
    const app = createApp();
    const all = await request(app).get('/api/products');
    const coffee = await request(app).get('/api/products?category=coffee');
    expect(all.body.length).toBe(12);
    expect(coffee.body.every((p: { category: string }) => p.category === 'coffee')).toBe(true);
  });

  it('validates coupons with a minimum subtotal', async () => {
    const app = createApp();
    const low = await request(app).post('/api/coupons/validate').send({ code: 'coffee25', subtotal: 100 });
    const ok = await request(app).post('/api/coupons/validate').send({ code: 'COFFEE25', subtotal: 200 });
    expect(low.status).toBe(400);
    expect(ok.body.valid).toBe(true);
  });

  it('creates an order with server-side prices and decrements stock', async () => {
    const store = createMemoryStore();
    const app = createApp(store, config);
    const before = store.getProduct('p2')!.stock;
    const res = await request(app).post('/api/orders').send({ items: [{ productId: 'p2', size: '500g', qty: 2 }], couponCode: 'WELCOME10', customer });
    expect(res.status).toBe(201);
    expect(res.body.lines[0].unitPrice).toBe(106.2); // 59 * 1.8
    expect(res.body.totals.discount).toBeCloseTo(21.24);
    expect(store.getProduct('p2')!.stock).toBe(before - 2);
  });

  it('rejects sold out products, invalid variants and bad input', async () => {
    const app = createApp();
    const sold = await request(app).post('/api/orders').send({ items: [{ productId: 'p8', qty: 1 }], customer });
    const variant = await request(app).post('/api/orders').send({ items: [{ productId: 'p1', size: 'XXL', qty: 1 }], customer });
    const bad = await request(app).post('/api/orders').send({ items: [], customer: { email: 'nope' } });
    expect(sold.status).toBe(409);
    expect(variant.status).toBe(400);
    expect(bad.status).toBe(400);
  });

  it('returns 501 for Stripe when no key is configured', async () => {
    const res = await request(createApp()).post('/api/checkout/stripe').send({ items: [{ productId: 'p1', qty: 1 }], customer });
    expect(res.status).toBe(501);
  });

  it('accepts only correctly signed Stripe webhooks', async () => {
    const store = createMemoryStore();
    const app = createApp(store, config);
    store.saveOrder({ id: 'SL-TEST', lines: [], totals: computeTotals(0), customer, status: 'pending', createdAt: '' });
    const payload = JSON.stringify({ type: 'checkout.session.completed', data: { object: { metadata: { orderId: 'SL-TEST' } } } });
    const t = Math.floor(Date.now() / 1000);
    const sig = createHmac('sha256', 'whsec_test').update(`${t}.${payload}`).digest('hex');

    const bad = await request(app).post('/api/webhooks/stripe').set('Content-Type', 'application/json').set('Stripe-Signature', `t=${t},v1=deadbeef`).send(payload);
    const good = await request(app).post('/api/webhooks/stripe').set('Content-Type', 'application/json').set('Stripe-Signature', `t=${t},v1=${sig}`).send(payload);
    expect(bad.status).toBe(400);
    expect(good.status).toBe(200);
    expect(store.getOrder('SL-TEST')!.status).toBe('paid');
  });
});
