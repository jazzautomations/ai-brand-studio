"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { STUDIO_NAME } from "@/lib/studio";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            {STUDIO_NAME.charAt(0)}
          </span>
          {STUDIO_NAME}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/#how" className="text-sm text-muted-foreground hover:text-foreground transition-colors">What you get</Link>
          <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login"><Button variant="ghost" size="sm">Client login</Button></Link>
          <Link href="/checkout"><Button size="sm">Start your brand</Button></Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border/30 bg-white md:hidden">
          <div className="container flex flex-col gap-1 py-4">
            <Link href="/#how" onClick={() => setOpen(false)} className="py-2 text-sm text-muted-foreground">What you get</Link>
            <Link href="/#pricing" onClick={() => setOpen(false)} className="py-2 text-sm text-muted-foreground">Pricing</Link>
            <Link href="/#faq" onClick={() => setOpen(false)} className="py-2 text-sm text-muted-foreground">FAQ</Link>
            <Link href="/login" onClick={() => setOpen(false)} className="py-2 text-sm">Client login</Link>
            <Link href="/checkout" onClick={() => setOpen(false)} className="py-2 text-sm font-medium">Start your brand →</Link>
          </div>
        </div>
      )}
    </header>
  );
}
