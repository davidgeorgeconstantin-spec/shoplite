'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { useHydrated } from '@/hooks/useHydrated';
import { formatMoney } from '@/lib/money';
import { OrderSummary } from './OrderSummary';
import { useOrders } from './orderStore';

/** Confetti made of 24 small divs with random trajectories. */
function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-10 flex justify-center">
      {pieces.map((i) => {
        const angle = (i / pieces.length) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute h-2.5 w-2.5 rounded-sm"
            style={{ background: ['#f59e0b', '#10b981', '#6366f1', '#f43f5e'][i % 4] }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: Math.cos(angle) * (120 + (i % 3) * 40), y: Math.sin(angle) * 90 + 160, opacity: 0, rotate: 360 }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
          />
        );
      })}
    </div>
  );
}

export function OrderConfirmation() {
  const id = useSearchParams().get('id');
  const hydrated = useHydrated();
  const order = useOrders((s) => s.orders.find((o) => o.id === id));

  if (!hydrated) return <div className="mx-auto mt-10 h-96 max-w-2xl animate-pulse rounded-3xl bg-slate-100" />;
  if (!order) return <p className="py-24 text-center text-slate-500">Order not found. <Link className="underline" href="/shop/">Back to shop</Link></p>;

  return (
    <div className="relative mx-auto max-w-2xl px-5 py-12">
      <Confetti />
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500 text-4xl text-white">
        ✓
      </motion.div>
      <h1 className="mt-6 text-center text-3xl font-extrabold">Thank you, {order.customer.name.split(' ')[0]}!</h1>
      <p className="mt-2 text-center text-slate-600">Order <b>{order.id}</b> was placed (simulated — nothing was charged).</p>

      {/* Email preview: in the real app the server sends this with Resend (free plan) */}
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-3 text-xs text-slate-500">
          📧 Email preview · To: {order.customer.email} · Subject: Your ShopLite order {order.id}
        </div>
        <div className="space-y-4 p-6">
          <p>Hi {order.customer.name}, thanks for your order! Here is what you bought:</p>
          <ul className="divide-y divide-slate-100 text-sm">
            {order.lines.map((l) => (
              <li key={l.productId + l.variant} className="flex justify-between py-2">
                <span>{l.qty} × {l.name} <span className="text-slate-500">({l.variant})</span></span>
                <span>{formatMoney(l.unitPrice * l.qty)}</span>
              </li>
            ))}
          </ul>
          <OrderSummary totals={order.totals} />
          <p className="text-sm text-slate-500">Shipping to {order.customer.address}, {order.customer.city}.</p>
        </div>
      </motion.section>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/shop/" className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white">Continue shopping</Link>
        <Link href="/admin/" className="rounded-full border border-slate-200 px-6 py-3 font-semibold">See it in Admin</Link>
      </div>
    </div>
  );
}
