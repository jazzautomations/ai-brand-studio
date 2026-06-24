"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListTree, ShieldCheck, AlertTriangle } from "lucide-react";
import { STUDIO_NAME } from "@/lib/studio";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ListTree },
  { href: "/admin/qa-logs", label: "QA logs", icon: ShieldCheck },
  { href: "/admin/anomalies", label: "Anomalies", icon: AlertTriangle },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="container flex h-14 items-center gap-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground text-xs">{STUDIO_NAME[0]}</span>
          <span className="hidden sm:inline">Admin</span>
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition",
                  active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" /> <span className="hidden sm:inline">{l.label}</span>
              </Link>
            );
          })}
        </nav>
        <Link href="/" className="ml-auto text-xs text-muted-foreground hover:text-foreground">← to site</Link>
      </div>
    </header>
  );
}
