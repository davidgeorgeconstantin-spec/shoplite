# ShopLite API (Express + Zod)

```bash
cp .env.example .env     # all values optional
npm install
npm run dev              # http://localhost:4000
npm test                 # 8 tests
```

| Method | Path | Description |
|---|---|---|
| GET | `/api/products?category=coffee` | List products |
| GET | `/api/products/:id` | One product |
| POST | `/api/coupons/validate` | `{ code, subtotal }` |
| POST | `/api/orders` | Create an order (prices recomputed server-side) |
| GET | `/api/orders/:id` | Get an order |
| POST | `/api/checkout/stripe` | Stripe Checkout Session — needs `STRIPE_SECRET_KEY` (**test key**) |
| POST | `/api/webhooks/stripe` | Stripe webhook — needs `STRIPE_WEBHOOK_SECRET` |
| GET | `/api/import/woocommerce` | Preview products from a WooCommerce store — needs `WOO_*` |

## Stripe test mode (free)
1. Create a free Stripe account, stay in **Test mode**, copy the `sk_test_...` key into `.env`.
2. `stripe listen --forward-to localhost:4000/api/webhooks/stripe` and copy the `whsec_...` secret.
3. Pay with the test card `4242 4242 4242 4242`. No real money moves.

## Database
The `Store` interface in `src/lib/store.ts` is in-memory. To persist data, implement it with Prisma + PostgreSQL (Supabase free tier).

Never commit `.env`. It is in `.gitignore`.
