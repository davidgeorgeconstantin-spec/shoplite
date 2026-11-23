# ShopLite — Lecții (în română)

Proiectul 6: un magazin online construit de la zero. Tu știi deja WooCommerce — aici vezi cum funcționează „pe dinăuntru”.

## Lecția 1 — Modelarea datelor (ca în WooCommerce)
În `types/index.ts` avem: `Product`, `CartItem`, `Coupon`, `Order`.
- **Variația** (mărime, culoare) nu e un produs separat. În coș, cheia liniei e `productId|mărime|culoare` (`cartKey`) → „Cafea 250g” și „Cafea 1kg” sunt linii diferite.
- **Comanda** copiază prețul și numele în `OrderLine`. De ce? Dacă mâine schimbi prețul, comanda veche trebuie să rămână cu prețul plătit.

**Exercițiu:** adaugă câmpul `weightGrams` la produs și afișează-l pe pagina produsului.

## Lecția 2 — Coșul cu Zustand și „derived state”
`cartStore` ține doar ce e minim: `items` și `couponCode`. Totalurile **nu se salvează** — se calculează în `useCartSummary` cu `useMemo`.
Regula: salvează date, calculează rezultate. Altfel totalul și produsele pot ajunge să nu mai corespundă.
`partialize` salvează în localStorage doar coșul, nu și dacă sertarul e deschis.

**Exercițiu:** adaugă în sertar un buton „Golește coșul” (folosește `clear`).

## Lecția 3 — Funcții pure pentru prețuri + teste
`lib/pricing.ts`: `computeTotals`, `validateCoupon`, `variantPrice`. Nu citesc nimic din afară → mereu același rezultat → ușor de testat.
Serverul folosește **aceleași reguli** (`server/src/shared/pricing.ts`) și **recalculează prețurile**: niciodată nu ai încredere în prețul trimis din browser (oricine îl poate modifica din DevTools).

**Exercițiu:** creează cuponul `BIG50`: 50 RON reducere la comenzi peste 300 RON. Scrie un test pentru el.

## Lecția 4 — Plăți: Stripe în mod test și webhooks
Fluxul real (în `/server`):
1. Browserul trimite coșul → serverul creează comanda „pending” și o **Checkout Session** Stripe.
2. Clientul plătește pe pagina Stripe.
3. Stripe trimite un **webhook** la server → verificăm **semnătura** (HMAC) → comanda devine „paid”.
De ce webhook? Clientul poate închide pagina înainte de redirect; webhook-ul ajunge oricum.
În demo-ul de pe GitHub Pages plata e **simulată** (fără server).

**Exercițiu:** rulează testele din `server` (`npm test`) și citește testul pentru webhook. Ce se întâmplă dacă semnătura e greșită?

## Lecția 5 — Animația „fly to cart”
1. La click, `launch()` citește poziția imaginii cu `getBoundingClientRect()`.
2. `FlyLayer` desenează o copie `position: fixed` și o animează cu **keyframes** `x: [start, mijloc, final]`, `y: [start, sus, final]` → traiectorie curbă.
3. La final (`onAnimationComplete`) crește `bump` → butonul coșului se re-montează (`key={bump}`) și „sare”.

**Exercițiu:** fă ca obiectul să se rotească 360° în timpul zborului.

## Lecția 6 — SEO pentru produse
- `generateStaticParams` → câte un HTML pentru fiecare produs (Google îl citește fără JavaScript).
- `generateMetadata` → titlu și descriere unice pe pagină.
- JSON-LD `Product` → Google poate arăta prețul și stocul în rezultate.

**Exercițiu:** adaugă `aggregateRating` în JSON-LD (folosește `product.rating`).
