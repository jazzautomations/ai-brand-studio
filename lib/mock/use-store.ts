"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
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
  useEffect(() => {
    store.init();
  }, [store]);
  return store;
}

/**
 * Returns false until the store has loaded persisted state from localStorage
 * (client only). Use it to gate store-dependent UI: the gated branch renders
 * an SSR-safe loading state that matches the server markup until the store is
 * ready, then swaps in the real data — avoiding both hydration mismatches and
 * the "project not found" flash that happens when reading an un-hydrated store.
 *
 * Also subscribes the component to store changes, so callers re-render on
 * every state update after hydration.
 */
export function useStoreReady(): boolean {
  const store = getStore();
  useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  const [ready, setReady] = useState(false);
  useEffect(() => {
    store.ensureLoaded();
    setReady(true);
  }, [store]);
  return ready;
}
