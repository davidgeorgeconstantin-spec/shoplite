'use client';

import { AnimatePresence, motion } from 'motion/react';

export function QuantityStepper({ value, onChange, max = 99 }: { value: number; onChange: (n: number) => void; max?: number }) {
  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
      <button type="button" onClick={() => onChange(value - 1)} className="h-9 w-9 rounded-full text-lg hover:bg-slate-100" aria-label="Decrease quantity">−</button>
      <span className="relative w-8 overflow-hidden text-center font-semibold tabular-nums" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={value} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} className="block">
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <button type="button" disabled={value >= max} onClick={() => onChange(value + 1)} className="h-9 w-9 rounded-full text-lg hover:bg-slate-100 disabled:opacity-30" aria-label="Increase quantity">+</button>
    </div>
  );
}
