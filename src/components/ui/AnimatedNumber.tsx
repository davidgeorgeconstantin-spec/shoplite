'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';

/** Counts from 0 to `value` when it scrolls into view. Writes to the DOM directly (no re-render per frame). */
export function AnimatedNumber({ value, format = (n: number) => Math.round(n).toString() }: { value: number; format?: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!inView || reduce) {
      el.textContent = format(value);
      return;
    }
    const controls = animate(0, value, { duration: 1.1, ease: 'easeOut', onUpdate: (v) => (el.textContent = format(v)) });
    return () => controls.stop();
  }, [value, inView, reduce, format]);

  return <span ref={ref}>{format(value)}</span>;
}
