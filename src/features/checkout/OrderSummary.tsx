'use client';

import { AnimatePresence, motion } from 'motion/react';
import { formatMoney } from '@/lib/money';
import type { Totals } from '@/types';

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? 'text-lg font-bold' : 'text-slate-600'}`}>
      <span>{label}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={value} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function OrderSummary({ totals }: { totals: Totals }) {
  return (
    <div className="space-y-2">
      <Row label="Subtotal" value={formatMoney(totals.subtotal)} />
      {totals.discount > 0 && <Row label="Discount" value={`− ${formatMoney(totals.discount)}`} />}
      <Row label="Shipping" value={totals.shipping ? formatMoney(totals.shipping) : 'Free'} />
      <div className="my-2 border-t border-slate-200" />
      <Row label="Total" value={formatMoney(totals.total)} strong />
    </div>
  );
}
