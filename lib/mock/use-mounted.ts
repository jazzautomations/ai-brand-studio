"use client";

import { useEffect, useState } from "react";

/**
 * Returns false during SSR and the first client render, then true after mount.
 * Use to gate store-dependent UI so server markup and the first client paint
 * match (empty/loading), avoiding hydration mismatches with the mock store.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
