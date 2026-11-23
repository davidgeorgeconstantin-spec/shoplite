'use client';

import { useMemo } from 'react';
import { COUPONS } from '@/data/coupons';
import { useProducts } from '@/hooks/useProducts';
import { computeTotals, variantPrice } from '@/lib/pricing';
import { useCart } from './cartStore';

/** Joins cart items with product data and computes totals (derived state, never stored). */
export function useCartSummary() {
  const items = useCart((s) => s.items);
  const couponCode = useCart((s) => s.couponCode);
  const products = useProducts();

  return useMemo(() => {
    const lines = items.flatMap((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return [];
      const unitPrice = variantPrice(product.price, item.size);
      return [{ item, product, unitPrice, lineTotal: unitPrice * item.qty }];
    });
    const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    const coupon = COUPONS.find((c) => c.code === couponCode);
    const count = items.reduce((n, i) => n + i.qty, 0);
    return { lines, count, coupon, totals: computeTotals(subtotal, coupon) };
  }, [items, couponCode, products]);
}
