"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import {
  Activity, Layers, MessageSquare, Download, ArrowLeft, CircleDot,
} from "lucide-react";
import { TIERS } from "@/lib/tiers";
import { getStore } from "@/lib/mock/store";
import { useStore } from "@/lib/mock/use-store";
import { STUDIO_NAME } from "@/lib/studio";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/portal/progress", label: "Progress", icon: Activity },
  { href: "/portal/directions", label: "Directions", icon: Layers },
  { href: "/portal/revisions", label: "Revisions", icon: MessageSquare },
  { href: "/portal/delivery", label: "Delivery", icon: Download },
];

function NavInner() {
  const sp = useSearchParams();
  const pathname = usePathname();
  useStore(); // re-render on store changes
  const orderId = sp.get("order") || "";
  const order = orderId ? getStore().getOrder(orderId) : undefined;
  const tier = TIERS.find((t) => t.id === order?.tier);
  const brief = order ? getStore().getBrief(order.id) : undefined;

  if (!order) {
    return (
      <div className="border-b border-border bg-card/50 px-4 py-3 text-sm text-muted-foreground">
        No active project. <Link href="/checkout" className="text-primary underline">Start one</Link>.
      </div>
    );
  }

  return (
    <div className="border-b border-border bg-card/40">
      <div className="container flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CircleDot className="h-3.5 w-3.5 text-primary" />
              {brief?.businessName || "Your brand project"}
            </div>
            <div className="text-xs text-muted-foreground">
              {tier?.name} tier · Order #{order.id.slice(-6)}
            </div>
          </div>
        </div>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={`${n.href}?order=${orderId}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition",
                  active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function PortalNav() {
  return (
    <Suspense fallback={null}>
      <NavInner />
    </Suspense>
  );
}
