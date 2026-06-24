"use client";

import { useSearchParams } from "next/navigation";
import { getStore } from "@/lib/mock/store";
import { useStore } from "@/lib/mock/use-store";

/** Reads `?order=` from the URL and returns the matching order reactively. */
export function useOrderFromQuery() {
  const sp = useSearchParams();
  useStore(); // subscribe to store changes
  const id = sp.get("order") || "";
  const order = id ? getStore().getOrder(id) : undefined;
  return { id, order };
}
