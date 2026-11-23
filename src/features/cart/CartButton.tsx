'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useHydrated } from '@/hooks/useHydrated';
import { useCart } from './cartStore';
import { cartTarget, useFly } from './flyStore';

export function CartButton() {
  const ref = useRef<HTMLButtonElement>(null);
  const open = useCart((s) => s.open);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const bump = useFly((s) => s.bump);
  const hydrated = useHydrated();

  useEffect(() => {
    cartTarget.el = ref.current;
    return () => {
      cartTarget.el = null;
    };
  }, []);

  return (
    <motion.button
      ref={ref}
      key={bump} // re-mount on each landing → replays the bump animation
      initial={bump ? { scale: 1.35, rotate: -8 } : false}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 12 }}
      onClick={open}
      className="relative grid h-11 w-11 place-items-center rounded-full bg-slate-900 text-white"
      aria-label={`Open cart, ${hydrated ? count : 0} items`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 7h12l-1.2 12.1a2 2 0 0 1-2 1.9H9.2a2 2 0 0 1-2-1.9z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
      <AnimatePresence>
        {hydrated && count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, y: -6 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0 }}
            className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-amber-400 px-1 text-xs font-bold text-slate-900"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
