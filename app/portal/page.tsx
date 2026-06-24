"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PortalRedirect() {
  const router = useRouter();
  const sp = useSearchParams();
  useEffect(() => {
    const order = sp.get("order");
    router.replace(order ? `/portal/progress?order=${order}` : "/login");
  }, [router, sp]);
  return <div className="text-muted-foreground">Redirecting…</div>;
}

export default function PortalIndex() {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
      <PortalRedirect />
    </Suspense>
  );
}
