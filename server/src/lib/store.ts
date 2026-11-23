import { PRODUCTS } from '../shared/products.js';
import type { Order, Product } from '../shared/types.js';

/**
 * In-memory "database". The interface is small on purpose: swapping it for Prisma + PostgreSQL
 * (Supabase free tier) means re-implementing these 5 methods.
 */
export interface Store {
  listProducts(): Product[];
  getProduct(id: string): Product | undefined;
  decrementStock(id: string, qty: number): void;
  saveOrder(order: Order): void;
  getOrder(id: string): Order | undefined;
  updateOrder(id: string, patch: Partial<Order>): Order | undefined;
}

export function createMemoryStore(): Store {
  const products = new Map(PRODUCTS.map((p) => [p.id, { ...p }]));
  const orders = new Map<string, Order>();
  return {
    listProducts: () => [...products.values()],
    getProduct: (id) => products.get(id),
    decrementStock: (id, qty) => {
      const p = products.get(id);
      if (p) p.stock = Math.max(0, p.stock - qty);
    },
    saveOrder: (o) => void orders.set(o.id, o),
    getOrder: (id) => orders.get(id),
    updateOrder: (id, patch) => {
      const o = orders.get(id);
      if (!o) return undefined;
      const next = { ...o, ...patch };
      orders.set(id, next);
      return next;
    },
  };
}
