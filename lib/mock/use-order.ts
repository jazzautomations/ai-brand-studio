"use client";

import { useSearchParams } from "next/navigation";
import { getStore } from "@/lib/mock/store";
import { useStoreReady } from "@/lib/mock/use-store";

/** Reads `?order=` from the URL and returns the matching order reactively.
 *  `ready` is false until the store has hydrated persisted state, so callers
 *  can gate on it to avoid a "not found" flash before localStorage loads. */
export function useOrderFromQuery() {
  const sp = useSearchParams();
  const ready = useStoreReady();
  const id = sp.get("order") || "";
  const order = id ? getStore().getOrder(id) : undefined;
  return { id, order, ready };
}
