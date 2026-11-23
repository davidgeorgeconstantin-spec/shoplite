'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRODUCTS } from '@/data/products';
import type { Product } from '@/types';

/** Admin edits (price, stock) are saved on top of the static catalog — like a tiny database. */
interface InventoryState {
  overrides: Record<string, Partial<Pick<Product, 'price' | 'stock'>>>;
  update: (id: string, patch: Partial<Pick<Product, 'price' | 'stock'>>) => void;
  decrementStock: (id: string, qty: number) => void;
  reset: () => void;
}

export const useInventory = create<InventoryState>()(
  persist(
    (set) => ({
      overrides: {},
      update: (id, patch) => set((s) => ({ overrides: { ...s.overrides, [id]: { ...s.overrides[id], ...patch } } })),
      decrementStock: (id, qty) =>
        set((s) => {
          const current = s.overrides[id]?.stock ?? PRODUCTS.find((p) => p.id === id)?.stock ?? 0;
          return { overrides: { ...s.overrides, [id]: { ...s.overrides[id], stock: Math.max(0, current - qty) } } };
        }),
      reset: () => set({ overrides: {} }),
    }),
    { name: 'shoplite:inventory' },
  ),
);
