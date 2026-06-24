"use client";

import { useStore } from "@/lib/mock/use-store";

/**
 * Mounts once in the root layout and triggers client-side hydration of the
 * demo store (loads persisted state from localStorage) on every page. Without
 * this, pages that only read the store inside event handlers (e.g. checkout)
 * would mutate an un-hydrated state and clobber prior localStorage data.
 */
export function StoreHydrator() {
  useStore();
  return null;
}
