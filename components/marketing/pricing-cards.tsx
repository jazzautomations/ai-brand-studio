"use client";

import Link from "next/link";
import { Check, Star } from "lucide-react";
import { TIERS } from "@/lib/tiers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PricingCards({ ctaHref = "/checkout", ctaLabel = "Choose {name}" }: { ctaHref?: string; ctaLabel?: string }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {TIERS.map((t) => (
        <Card
          key={t.id}
          className={cn(
            "relative flex flex-col p-7 transition-shadow",
            t.recommended && "border-primary/50 shadow-lg shadow-primary/5 md:-translate-y-2",
          )}
        >
          {t.recommended && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="accent" className="gap-1 px-3 py-1">
                <Star className="h-3 w-3 fill-current" /> Recommended
              </Badge>
            </div>
          )}
          <div className="mb-1 text-sm font-medium uppercase tracking-wider text-muted-foreground">{t.name}</div>
          <div className="mb-2 flex items-baseline gap-1">
            <span className="text-4xl font-semibold tracking-tight">{t.priceLabel}</span>
            <span className="text-sm text-muted-foreground">one-time</span>
          </div>
          <p className="mb-5 text-sm text-muted-foreground">{t.blurb}</p>
          <ul className="mb-6 space-y-2.5 text-sm">
            {t.features.map((f) => (
              <li key={f} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-foreground/90">{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto">
            <Link href={`${ctaHref}?tier=${t.id}`}>
              <Button variant={t.recommended ? "default" : "outline"} className="w-full">
                {ctaLabel.replace("{name}", t.name)}
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
