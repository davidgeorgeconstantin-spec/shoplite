import { createApp } from './app.js';
import { createMemoryStore } from './lib/store.js';

const env = process.env;
const app = createApp(createMemoryStore(), {
  clientUrl: env.CLIENT_URL ?? 'http://localhost:3000/shoplite',
  stripeSecretKey: env.STRIPE_SECRET_KEY || undefined,
  stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET || undefined,
  woo: env.WOO_URL && env.WOO_KEY && env.WOO_SECRET ? { url: env.WOO_URL, key: env.WOO_KEY, secret: env.WOO_SECRET } : undefined,
});

const port = Number(env.PORT ?? 4000);
app.listen(port, () => console.log(`ShopLite API on http://localhost:${port}`));
