'use client';

import { motion } from 'motion/react';
import { cartTarget, useFly } from './flyStore';

export function FlyLayer() {
  const flights = useFly((s) => s.flights);
  const land = useFly((s) => s.land);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]">
      {flights.map((f) => {
        const t = cartTarget.el?.getBoundingClientRect();
        const to = t ? { x: t.left + t.width / 2 - f.from.size / 2, y: t.top + t.height / 2 - f.from.size / 2 } : { x: window.innerWidth - 80, y: 10 };
        return (
          <motion.div
            key={f.id}
            className="absolute grid place-items-center rounded-2xl text-2xl shadow-xl"
            style={{ width: f.from.size, height: f.from.size, background: `hsl(${f.hue} 80% 88%)` }}
            initial={{ x: f.from.x, y: f.from.y, scale: 1, opacity: 1 }}
            // keyframes: go up first, then curve into the cart (feels like a throw)
            animate={{ x: [f.from.x, (f.from.x + to.x) / 2, to.x], y: [f.from.y, Math.min(f.from.y, to.y) - 120, to.y], scale: [1, 1.1, 0.3], opacity: [1, 1, 0.6] }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            onAnimationComplete={() => land(f.id)}
          >
            {f.emoji}
          </motion.div>
        );
      })}
    </div>
  );
}
