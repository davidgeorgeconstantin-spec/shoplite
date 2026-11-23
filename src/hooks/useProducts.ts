'use client';

import { useMemo } from 'react';
import { PRODUCTS } from '@/data/products';
import { useInventory } from '@/features/catalog/inventoryStore';
import { useHydrated } from './useHydrated';
import type { Product } from '@/types';

/** Catalog merged with admin overrides. Before hydration we return the static data (same as the server HTML). */
export function useProducts(): Product[] {
  const overrides = useInventory((s) => s.overrides);
  const hydrated = useHydrated();
  return useMemo(
    () => (hydrated ? PRODUCTS.map((p) => ({ ...p, ...overrides[p.id] })) : PRODUCTS),
    [overrides, hydrated],
  );
}

export function useProduct(id: string): Product | undefined {
  return useProducts().find((p) => p.id === id);
}
