import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpError } from './lib/errors.js';
import { createMemoryStore, type Store } from './lib/store.js';
import { apiRouter, stripeWebhook, type Config } from './routes/api.js';

export function createApp(store: Store = createMemoryStore(), config: Config = { clientUrl: 'http://localhost:3000/shoplite' }) {
  const app = express();
  app.use(cors({ origin: new URL(config.clientUrl).origin }));
  app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhook(store, config));
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use('/api', apiRouter(store, config));

  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof ZodError) return void res.status(400).json({ error: 'Validation failed', details: err.flatten().fieldErrors });
    if (err instanceof HttpError) return void res.status(err.status).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  };
  app.use(onError);
  return app;
}
