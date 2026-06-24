"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CallScreen } from "@/components/call/call-screen";

function CallGate() {
  const sp = useSearchParams();
  const order = sp.get("order") || "";
  return <CallScreen orderId={order} />;
}

export default function CallPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-background text-muted-foreground">Loading call…</div>}>
      <CallGate />
    </Suspense>
  );
}
