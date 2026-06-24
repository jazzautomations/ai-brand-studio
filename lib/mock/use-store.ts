"use client";

import { useSyncExternalStore } from "react";
import { getStore } from "@/lib/mock/store";

/**
 * React binding for the mock store via useSyncExternalStore.
 * Re-renders on any state change. Swap this module for Supabase
 * realtime subscriptions when wiring the real DB.
 */
export function useStore() {
  const store = getStore();
  store.init();
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

export function useCurrentOrder(orderId: string | undefined) {
  const s = useStore();
  if (!orderId) return null;
  return s.orders.find((o) => o.id === orderId) ?? null;
}
