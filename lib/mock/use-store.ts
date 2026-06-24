"use client";

import { useSyncExternalStore } from "react";
import { getStore } from "@/lib/mock/store";

/**
 * React binding for the mock store via useSyncExternalStore.
 * Re-renders on any state change. Swap this module for Supabase
 * realtime subscriptions when wiring the real DB.
 *
 * The store hydrates eagerly at module load (client-only), and we pass a
 * stable empty snapshot as the server snapshot so SSR markup and the first
 * client paint match — preventing hydration mismatches. After mount the
 * real loaded state is used automatically.
 */
export function useStore() {
  const store = getStore();
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}

export function useCurrentOrder(orderId: string | undefined) {
  useStore();
  if (!orderId) return null;
  return getStore().getOrder(orderId) ?? null;
}
