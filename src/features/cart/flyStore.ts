'use client';

import { create } from 'zustand';

export interface Flight {
  id: number;
  emoji: string;
  hue: number;
  from: { x: number; y: number; size: number };
}

/** "Fly to cart" animation: the product button launches a flight, FlyLayer animates it, CartButton bumps. */
interface FlyState {
  flights: Flight[];
  bump: number;
  launch: (el: HTMLElement, emoji: string, hue: number) => void;
  land: (id: number) => void;
}

let nextId = 1;

export const useFly = create<FlyState>((set) => ({
  flights: [],
  bump: 0,
  launch: (el, emoji, hue) => {
    const r = el.getBoundingClientRect();
    const size = 56;
    set((s) => ({ flights: [...s.flights, { id: nextId++, emoji, hue, from: { x: r.left + r.width / 2 - size / 2, y: r.top + r.height / 2 - size / 2, size } }] }));
  },
  land: (id) => set((s) => ({ flights: s.flights.filter((f) => f.id !== id), bump: s.bump + 1 })),
}));

/** The cart icon registers itself here so flights know where to go. */
export const cartTarget: { el: HTMLElement | null } = { el: null };
