'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useOrders } from '@/features/checkout/orderStore';
import { formatMoney } from '@/lib/money';
import type { OrderStatus } from '@/types';

const STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

export function OrdersList() {
  const orders = useOrders((s) => s.orders);
  const setStatus = useOrders((s) => s.setStatus);
  const [openId, setOpenId] = useState<string | null>(null);

  if (orders.length === 0)
    return (
      <p className="rounded-2xl bg-slate-50 py-16 text-center text-slate-500">
        No orders yet. <Link href="/shop/" className="font-semibold underline">Place a test order</Link> and it will appear here.
      </p>
    );

  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <motion.li layout key={o.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <motion.div layout="position" className="flex flex-wrap items-center gap-4 px-5 py-4">
            <button onClick={() => setOpenId(openId === o.id ? null : o.id)} className="flex flex-1 items-center gap-3 text-left" aria-expanded={openId === o.id}>
              <motion.span animate={{ rotate: openId === o.id ? 90 : 0 }}>▸</motion.span>
              <span className="font-bold">{o.id}</span>
              <span className="text-sm text-slate-500">{o.customer.name} · {new Date(o.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </button>
            <span className="font-semibold">{formatMoney(o.totals.total)}</span>
            <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm capitalize" aria-label={`Status of ${o.id}`}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </motion.div>
          <AnimatePresence initial={false}>
            {openId === o.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-100 bg-slate-50 px-5">
                <ul className="py-3 text-sm">
                  {o.lines.map((l) => (
                    <li key={l.productId + l.variant} className="flex justify-between py-1">
                      <span>{l.qty} × {l.name} ({l.variant})</span>
                      <span>{formatMoney(l.unitPrice * l.qty)}</span>
                    </li>
                  ))}
                </ul>
                <p className="pb-3 text-sm text-slate-500">{o.customer.email} · {o.customer.address}, {o.customer.city}{o.coupon ? ` · coupon ${o.coupon}` : ''}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.li>
      ))}
    </ul>
  );
}
