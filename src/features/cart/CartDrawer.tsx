'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { ProductArt } from '@/features/catalog/ProductArt';
import { formatMoney } from '@/lib/money';
import { FREE_SHIPPING_FROM } from '@/lib/pricing';
import { useCart } from './cartStore';
import { useCartSummary } from './useCartSummary';

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const { lines, totals } = useCartSummary();
  const progress = Math.min(1, totals.subtotal / FREE_SHIPPING_FROM);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h2 className="text-xl font-bold">Your cart</h2>
              <button onClick={close} className="rounded-full p-2 hover:bg-slate-100" aria-label="Close cart">✕</button>
            </header>

            <div className="px-6 pt-4">
              <p className="text-sm text-slate-600">
                {progress >= 1 ? '🎉 You have free shipping!' : `Add ${formatMoney(FREE_SHIPPING_FROM - totals.subtotal)} more for free shipping`}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div className="h-full origin-left rounded-full bg-amber-400" initial={{ scaleX: 0 }} animate={{ scaleX: progress }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
              </div>
            </div>

            <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <AnimatePresence initial={false}>
                {lines.map(({ item, product, unitPrice }) => (
                  <motion.li
                    key={item.key}
                    layout
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 80, height: 0, marginTop: 0 }}
                    className="flex gap-4"
                  >
                    <ProductArt emoji={product.emoji} hue={product.hue} size="sm" className="h-20 w-20 shrink-0 rounded-2xl" />
                    <div className="flex-1">
                      <div className="flex justify-between gap-2">
                        <p className="font-semibold">{product.name}</p>
                        <button onClick={() => remove(item.key)} className="text-sm text-slate-400 hover:text-rose-500" aria-label={`Remove ${product.name}`}>Remove</button>
                      </div>
                      <p className="text-sm text-slate-500">{[item.size, item.color].filter(Boolean).join(' · ') || 'Standard'}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <QuantityStepper value={item.qty} onChange={(n) => setQty(item.key, n)} max={product.stock} />
                        <span className="font-semibold">{formatMoney(unitPrice * item.qty)}</span>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
              {lines.length === 0 && (
                <li className="py-16 text-center text-slate-500">
                  <motion.p animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.6 }} className="text-5xl">🛒</motion.p>
                  <p className="mt-4">Your cart is empty.</p>
                </li>
              )}
            </ul>

            <footer className="border-t border-slate-100 px-6 py-5">
              <div className="flex justify-between text-lg font-bold">
                <span>Subtotal</span>
                <span>{formatMoney(totals.subtotal)}</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">Coupons and shipping are calculated at checkout.</p>
              <Link
                href="/checkout/"
                onClick={close}
                aria-disabled={lines.length === 0}
                className={`mt-4 block rounded-full py-3.5 text-center font-semibold text-white transition ${lines.length ? 'bg-slate-900 hover:bg-slate-700' : 'pointer-events-none bg-slate-300'}`}
              >
                Checkout
              </Link>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
