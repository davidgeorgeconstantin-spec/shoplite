'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
/** false during static HTML render, true in the browser. Avoids hydration mismatches with localStorage data. */
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
