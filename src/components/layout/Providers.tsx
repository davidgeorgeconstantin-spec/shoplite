'use client';

import { MotionConfig } from 'motion/react';
import { CartDrawer } from '@/features/cart/CartDrawer';
import { FlyLayer } from '@/features/cart/FlyLayer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
      <CartDrawer />
      <FlyLayer />
    </MotionConfig>
  );
}
