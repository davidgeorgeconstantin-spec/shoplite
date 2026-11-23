'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useCart } from '@/features/cart/cartStore';
import { useCartSummary } from '@/features/cart/useCartSummary';
import { useInventory } from '@/features/catalog/inventoryStore';
import { ProductArt } from '@/features/catalog/ProductArt';
import { useHydrated } from '@/hooks/useHydrated';
import { useProducts } from '@/hooks/useProducts';
import { cn } from '@/lib/cn';
import { formatMoney } from '@/lib/money';
import type { Customer } from '@/types';
import { CouponField } from './CouponField';
import { OrderSummary } from './OrderSummary';
import { useOrders } from './orderStore';
import { placeOrder } from './placeOrder';

const STEPS = ['Details', 'Payment', 'Review'];
const EMPTY: Customer = { name: '', email: '', address: '', city: '' };

export function Checkout() {
  const hydrated = useHydrated();
  const router = useRouter();
  const { lines, totals, coupon } = useCartSummary();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const products = useProducts();
  const addOrder = useOrders((s) => s.addOrder);
  const decrementStock = useInventory((s) => s.decrementStock);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [customer, setCustomer] = useState<Customer>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});
  const [paying, setPaying] = useState(false);

  if (!hydrated) return <div className="mx-auto h-96 max-w-6xl animate-pulse rounded-3xl bg-slate-100" />;
  if (lines.length === 0)
    return (
      <div className="py-24 text-center">
        <p className="text-5xl">🛒</p>
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <Link href="/shop/" className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-3 font-semibold text-white">Go shopping</Link>
      </div>
    );

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  function validate() {
    const e: typeof errors = {};
    if (customer.name.trim().length < 2) e.name = 'Enter your name';
    if (!/^\S+@\S+\.\S+$/.test(customer.email)) e.email = 'Enter a valid email';
    if (customer.address.trim().length < 5) e.address = 'Enter your street address';
    if (customer.city.trim().length < 2) e.city = 'Enter your city';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function pay() {
    setPaying(true);
    const order = await placeOrder({ items, products, customer, totals, coupon });
    addOrder(order);
    order.lines.forEach((l) => decrementStock(l.productId, l.qty));
    clear();
    router.push(`/order/?id=${order.id}`);
  }

  const field = (key: keyof Customer, label: string, type = 'text') => (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input
        type={type}
        value={customer[key]}
        onChange={(e) => setCustomer({ ...customer, [key]: e.target.value })}
        className={cn('mt-1 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-slate-900', errors[key] ? 'border-rose-400' : 'border-slate-200')}
      />
      {errors[key] && <span className="mt-1 block text-sm text-rose-600">{errors[key]}</span>}
    </label>
  );

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[1fr_380px]">
      <section>
        <h1 className="text-3xl font-extrabold">Checkout</h1>
        {/* animated stepper */}
        <ol className="mt-6 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <motion.span animate={{ backgroundColor: i <= step ? '#0f172a' : '#e2e8f0', color: i <= step ? '#fff' : '#64748b' }} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold">
                {i < step ? '✓' : i + 1}
              </motion.span>
              <span className="hidden text-sm font-semibold sm:inline">{s}</span>
              {i < STEPS.length - 1 && (
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <motion.span className="block h-full origin-left bg-slate-900" animate={{ scaleX: i < step ? 1 : 0 }} />
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="relative mt-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={{ enter: (d: number) => ({ x: d * 60, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (d: number) => ({ x: d * -60, opacity: 0 }) }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {step === 0 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {field('name', 'Full name')}
                    {field('email', 'Email', 'email')}
                  </div>
                  {field('address', 'Address')}
                  {field('city', 'City')}
                  <button onClick={() => validate() && go(1)} className="rounded-full bg-slate-900 px-8 py-3 font-semibold text-white">Continue to payment</button>
                </>
              )}
              {step === 1 && (
                <>
                  <div className="rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50 p-5">
                    <p className="font-bold">💳 Simulated payment — no real money</p>
                    <p className="mt-1 text-sm text-slate-600">
                      This demo does not collect card details. The <code>/server</code> folder shows how a real store would redirect to a Stripe Checkout page in <b>test mode</b>.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => go(0)} className="rounded-full border border-slate-200 px-6 py-3 font-semibold">Back</button>
                    <button onClick={() => go(2)} className="rounded-full bg-slate-900 px-8 py-3 font-semibold text-white">Review order</button>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="rounded-2xl bg-slate-50 p-5 text-sm">
                    <p className="font-semibold">Ship to</p>
                    <p className="text-slate-600">{customer.name} · {customer.email}<br />{customer.address}, {customer.city}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => go(1)} className="rounded-full border border-slate-200 px-6 py-3 font-semibold">Back</button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={pay} disabled={paying} className="flex items-center gap-3 rounded-full bg-emerald-600 px-8 py-3 font-semibold text-white disabled:opacity-80">
                      {paying && <motion.span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />}
                      {paying ? 'Processing…' : `Place order · ${formatMoney(totals.total)}`}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <aside className="h-fit space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <h2 className="font-bold">Order summary</h2>
        <ul className="space-y-3">
          {lines.map(({ item, product, unitPrice }) => (
            <li key={item.key} className="flex items-center gap-3 text-sm">
              <span className="relative">
                <ProductArt emoji={product.emoji} hue={product.hue} size="sm" className="h-14 w-14 rounded-xl" />
                <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-xs text-white">{item.qty}</span>
              </span>
              <span className="flex-1">
                <span className="font-semibold">{product.name}</span>
                <span className="block text-slate-500">{[item.size, item.color].filter(Boolean).join(' · ') || 'Standard'}</span>
              </span>
              <span>{formatMoney(unitPrice * item.qty)}</span>
            </li>
          ))}
        </ul>
        <CouponField subtotal={totals.subtotal} />
        <OrderSummary totals={totals} />
      </aside>
    </div>
  );
}
