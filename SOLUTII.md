# ShopLite — Soluții

## Lecția 1
În `types/index.ts`: `weightGrams?: number;`. În `data/products.ts` adaugă `weightGrams: 250` la cafele. În `ProductDetail.tsx`, sub descriere:
```tsx
product.weightGrams ? <p key="weight" className="text-sm text-slate-500">Weight: {product.weightGrams} g</p> : null,
```

## Lecția 2
În `CartDrawer.tsx`, în `footer`:
```tsx
const clear = useCart((s) => s.clear);
// ...
{lines.length > 0 && <button onClick={clear} className="mt-3 w-full text-sm text-slate-500 hover:text-rose-600">Empty cart</button>}
```

## Lecția 3
În `data/coupons.ts` (și în `server/src/shared/coupons.ts`):
```ts
{ code: 'BIG50', type: 'fixed', value: 50, minSubtotal: 300, description: '50 RON off orders over 300 RON' },
```
Test în `server/test/api.test.ts`:
```ts
it('BIG50 needs 300 RON', async () => {
  const app = createApp();
  expect((await request(app).post('/api/coupons/validate').send({ code: 'BIG50', subtotal: 299 })).status).toBe(400);
  expect((await request(app).post('/api/coupons/validate').send({ code: 'BIG50', subtotal: 300 })).status).toBe(200);
});
```

## Lecția 4
`verifyStripeSignature` întoarce `false` → serverul răspunde **400 Invalid signature** și comanda rămâne „pending”. Așa nimeni nu poate marca o comandă ca plătită trimițând un request fals.

## Lecția 5
În `FlyLayer.tsx`, în `animate` adaugă `rotate: [0, 180, 360]`.

## Lecția 6
În `app/products/[slug]/page.tsx`, în `jsonLd`:
```ts
aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: 1 },
```
(Notă: în realitate Google cere recenzii reale; aici e doar exercițiu.)
