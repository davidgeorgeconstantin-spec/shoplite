'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatus } from '@/types';

interface OrderState {
  orders: Order[];
  addOrder: (o: Order) => void;
  setStatus: (id: string, status: OrderStatus) => void;
}

export const useOrders = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
      setStatus: (id, status) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
    }),
    { name: 'shoplite:orders' },
  ),
);
