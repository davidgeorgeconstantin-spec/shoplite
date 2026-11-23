'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

export const cartKey = (productId: string, size?: string, color?: string) => [productId, size, color].filter(Boolean).join('|');

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  isOpen: boolean;
  add: (item: Omit<CartItem, 'key' | 'qty'>, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  applyCoupon: (code: string | null) => void;
  open: () => void;
  close: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      couponCode: null,
      isOpen: false,
      add: (item, qty = 1) =>
        set((s) => {
          const key = cartKey(item.productId, item.size, item.color);
          const existing = s.items.find((i) => i.key === key);
          return {
            items: existing
              ? s.items.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
              : [...s.items, { ...item, key, qty }],
          };
        }),
      setQty: (key, qty) =>
        set((s) => ({ items: qty <= 0 ? s.items.filter((i) => i.key !== key) : s.items.map((i) => (i.key === key ? { ...i, qty } : i)) })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [], couponCode: null }),
      applyCoupon: (couponCode) => set({ couponCode }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    // the drawer state is not saved — only the cart content
    { name: 'shoplite:cart', partialize: (s) => ({ items: s.items, couponCode: s.couponCode }) },
  ),
);
