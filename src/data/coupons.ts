import type { Coupon } from '@/types';

export const COUPONS: Coupon[] = [
  { code: 'WELCOME10', type: 'percent', value: 10, description: '10% off your order' },
  { code: 'COFFEE25', type: 'fixed', value: 25, minSubtotal: 150, description: '25 RON off orders over 150 RON' },
  { code: 'FREESHIP', type: 'fixed', value: 0, description: 'Free shipping' },
];
