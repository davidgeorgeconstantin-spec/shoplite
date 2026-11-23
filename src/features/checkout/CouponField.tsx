'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { COUPONS } from '@/data/coupons';
import { useCart } from '@/features/cart/cartStore';
import { validateCoupon } from '@/lib/pricing';

export function CouponField({ subtotal }: { subtotal: number }) {
  const couponCode = useCart((s) => s.couponCode);
  const apply = useCart((s) => s.applyCoupon);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const coupon = COUPONS.find((c) => c.code === code.trim().toUpperCase());
    const err = validateCoupon(coupon, subtotal);
    if (err) {
      setError(err);
      setShake((n) => n + 1);
      return;
    }
    setError(null);
    apply(coupon!.code);
    setCode('');
  }

  if (couponCode) {
    const c = COUPONS.find((x) => x.code === couponCode);
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center justify-between rounded-2xl border border-dashed border-emerald-400 bg-emerald-50 px-4 py-3 text-sm">
        <span>🏷️ <b>{couponCode}</b> — {c?.description}</span>
        <button onClick={() => apply(null)} className="text-slate-500 hover:text-rose-600">Remove</button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit}>
      <motion.div key={shake} animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : undefined} transition={{ duration: 0.4 }} className="flex gap-2">
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-slate-900" />
        <button className="rounded-xl bg-slate-100 px-4 text-sm font-semibold hover:bg-slate-200">Apply</button>
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 text-sm text-rose-600">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      <p className="mt-2 text-xs text-slate-400">Demo codes: WELCOME10, COFFEE25, FREESHIP</p>
    </form>
  );
}
