"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Palette, Sparkles } from "lucide-react";
import { useOrderFromQuery } from "@/lib/mock/use-order";
import { getStore } from "@/lib/mock/store";
import { TIERS } from "@/lib/tiers";
import { renderDirectionVersions } from "@/lib/mock/directions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Direction } from "@/lib/data/types";

function DirectionsInner() {
  const router = useRouter();
  const { id, order, ready } = useOrderFromQuery();
  const [selected, setSelected] = useState<string | null>(null);

  if (!ready) {
    return <div className="grid min-h-[60vh] place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!id || !order) {
    return (
      <div className="mx-auto max-w-md py-20 text-center text-muted-foreground">
        Project not found. <Link href="/checkout" className="text-primary underline">Start one</Link>
      </div>
    );
  }

  const tier = TIERS.find((t) => t.id === order.tier);
  const directions = getStore().getDirections(id);
  const alreadySelected = getStore().getSelectedDirection(id);
  const directionsUnlocked = ["awaiting_client_review", "revision", "final_compile", "delivered"].includes(order.status);

  if (!directionsUnlocked) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <p className="text-muted-foreground">Your directions aren't ready yet.</p>
        <Link href={`/portal/progress?order=${id}`} className="mt-4 inline-block text-primary underline">View progress</Link>
      </div>
    );
  }

  if (!directions.length) {
    return <div className="py-20 text-center text-muted-foreground">No directions generated.</div>;
  }

  const onSelect = (dirId: string) => {
    setSelected(dirId);
    getStore().selectDirection(id, dirId);
    setTimeout(() => router.push(`/portal/progress?order=${id}`), 600);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-2">
        <Link href={`/portal/progress?order=${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to progress
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Choose your direction</h1>
        <p className="max-w-2xl text-muted-foreground">
          {directions.length > 1
            ? `Each direction passed our 4-layer QA review. They share the same strategy but explore different visual expressions. Pick the one that feels right for ${order.tier === "starter" ? "your brand" : "your brand"} — adjustments are always free after.`
            : "Your direction is ready and passed QA. Approve it to continue, or request an adjustment."}
        </p>
      </div>

      <div className={cn("grid gap-6", directions.length > 1 ? "md:grid-cols-3" : "max-w-2xl")}>
        {directions.map((d, i) => (
          <DirectionCard
            key={d.id}
            direction={d}
            index={i}
            selected={selected === d.id || alreadySelected?.direction.id === d.id}
            locked={!!alreadySelected}
            onSelect={() => onSelect(d.id)}
            single={directions.length === 1}
          />
        ))}
      </div>
    </div>
  );
}

function DirectionCard({
  direction, index, selected, locked, onSelect, single,
}: {
  direction: Direction; index: number; selected: boolean; locked: boolean; onSelect: () => void; single: boolean;
}) {
  const versions = renderDirectionVersions(direction);
  const [vFull, vMono, vReversed, vCompact] = versions;
  return (
    <Card className={cn("flex flex-col overflow-hidden transition", selected && "ring-2 ring-primary")}>
      {/* hero preview: full lockup on light + reversed on primary */}
      <div className="grid grid-cols-2">
        <div className="flex h-32 items-center justify-center border-b border-r border-border" style={{ background: vFull.bg }}>
          <SvgFrame svg={vFull.svg} className="h-14 max-w-[85%]" />
        </div>
        <div className="flex h-32 items-center justify-center border-b border-border" style={{ background: vReversed.bg }}>
          <SvgFrame svg={vReversed.svg} className="h-14 max-w-[85%]" />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="accent">Direction {index + 1}</Badge>
            <span className="text-xs text-muted-foreground">{direction.archetype}</span>
          </div>
          {selected && <Check className="h-4 w-4 text-primary" />}
        </div>

        <p className="text-sm leading-relaxed text-foreground/90">{direction.rationaleText}</p>

        {/* all 4 versions */}
        <div className="grid grid-cols-4 gap-2">
          {versions.map((v) => (
            <div key={v.key} className="space-y-1">
              <div className="flex h-14 items-center justify-center rounded-md border border-border p-1" style={{ background: v.bg }}>
                <SvgFrame svg={v.svg} className="h-8 max-w-full" />
              </div>
              <div className="text-center text-[10px] leading-tight text-muted-foreground">{v.label}</div>
            </div>
          ))}
        </div>

        {/* palette */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Palette className="h-3 w-3" /> Palette
          </div>
          <div className="flex flex-wrap gap-2">
            {direction.colorTokens.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[10px]">
                <span className="h-3 w-3 rounded-sm" style={{ background: c.hex }} />
                <span className="text-muted-foreground">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">Type:</span> {direction.typographyNotes}
        </div>

        <Button
          className="w-full gap-2"
          variant={selected ? "secondary" : "default"}
          disabled={locked && !selected}
          onClick={onSelect}
        >
          {selected ? (
            <><Sparkles className="h-4 w-4" /> Selected — building your brand</>
          ) : locked ? (
            "Another direction selected"
          ) : single ? (
            <>Approve direction <ArrowRight className="h-4 w-4" /></>
          ) : (
            <>Select this direction <ArrowRight className="h-4 w-4" /></>
          )}
        </Button>
      </div>
    </Card>
  );
}

/** Renders an inline SVG string safely (mock-generated, trusted). */
function SvgFrame({ svg, className }: { svg: string; className?: string }) {
  return <span className={cn("inline-flex items-center justify-center", className)} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function DirectionsPage() {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
      <DirectionsInner />
    </Suspense>
  );
}
