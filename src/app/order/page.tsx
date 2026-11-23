import type { Metadata } from 'next';
import { Suspense } from 'react';
import { OrderConfirmation } from '@/features/checkout/OrderConfirmation';

export const metadata: Metadata = { title: 'Order confirmed' };

export default function OrderPage() {
  return (
    <Suspense>
      <OrderConfirmation />
    </Suspense>
  );
}
