'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { useOrders } from '@/features/checkout/orderStore';
import { useHydrated } from '@/hooks/useHydrated';
import { useProducts } from '@/hooks/useProducts';
import { cn } from '@/lib/cn';
import { formatMoney } from '@/lib/money';
import { OrdersList } from './OrdersList';
import { ProductsTable } from './ProductsTable';

const TABS = ['Products', 'Orders'] as const;
const fmtMoney = (n: number) => formatMoney(n);
const fmtInt = (n: number) => Math.round(n).toString();

export function AdminDashboard() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Products');
  const hydrated = useHydrated();
  const products = useProducts();
  const orders = useOrders((s) => s.orders);

  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-slate-100" />;

  const revenue = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.totals.total, 0);
  const kpis = [
    { label: 'Revenue (demo)', value: revenue, fmt: fmtMoney },
    { label: 'Orders', value: orders.length, fmt: fmtInt },
    { label: 'Products', value: products.length, fmt: fmtInt },
    { label: 'Low / out of stock', value: products.filter((p) => p.stock < 10).length, fmt: fmtInt },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{k.label}</p>
            <p className="mt-1 text-2xl font-extrabold"><AnimatedNumber value={k.value} format={k.fmt} /></p>
          </motion.div>
        ))}
      </div>
      <div>
        <div role="tablist" className="mb-5 flex gap-6 border-b border-slate-100">
          {TABS.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn('relative pb-3 font-semibold', tab === t ? 'text-slate-900' : 'text-slate-400')}>
              {t}{t === 'Orders' && orders.length > 0 && <span className="ml-1.5 rounded-full bg-slate-900 px-1.5 text-xs text-white">{orders.length}</span>}
              {tab === t && <motion.span layoutId="admin-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-slate-900" />}
            </button>
          ))}
        </div>
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {tab === 'Products' ? <ProductsTable /> : <OrdersList />}
        </motion.div>
      </div>
    </div>
  );
}
