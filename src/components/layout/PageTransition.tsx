'use client';

import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';

/** Fade/slide each route in. Keyed by pathname so it replays on navigation. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.main key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
      {children}
    </motion.main>
  );
}
