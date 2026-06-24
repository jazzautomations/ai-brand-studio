"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getStore } from "@/lib/mock/store";

/**
 * Subscribes a component to the in-memory mock store.
 *
 * Hydration is deferred to a mount effect so the first client render uses
 * the empty SSR snapshot (getServerSnapshot) — this keeps server and client
 * markup identical and avoids hydration exceptions. Once mounted, the store
 * loads localStorage and publishes a fresh snapshot, triggering a re-render
 * with the real data.
 */
export function useStore() {
  const store = getStore();
  useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  // Hydrate after mount (client only). useEffect runs once after the initial
  // render, so the SSR-matching empty snapshot is used for hydration first.
  useEffect(() => {
    store.init();
  }, [store]);
  return store;
}
