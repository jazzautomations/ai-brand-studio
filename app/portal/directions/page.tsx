"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Palette, Sparkles, Copy, CheckCircle2, Columns2, X } from "lucide-react";
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
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

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

  const toggleCompare = (dirId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(dirId)) return prev.filter((x) => x !== dirId);
      if (prev.length >= 2) return [prev[1], dirId];
      return [...prev, dirId];
    });
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const compareDirs = compareIds.map((cid) => directions.find((d) => d.id === cid)).filter(Boolean) as Direction[];
  const isComparing = compareDirs.length === 2;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-2">
        <Link href={`/portal/progress?order=${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to progress
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Choose your direction</h1>
            <p className="mt-1 max-w-2xl text-muted-foreground">
              {directions.length > 1
                ? `Each direction passed our 4-layer QA review. They share the same strategy but explore different visual expressions. Pick the one that feels right — adjustments are always free after.`
                : "Your direction is ready and passed QA. Approve it to continue, or request an adjustment."}
            </p>
          </div>
          {directions.length > 1 && !alreadySelected && (
            <Button
              variant={isComparing ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => {
                if (isComparing) setCompareIds([]);
                else setCompareIds(directions.slice(0, 2).map((d) => d.id));
              }}
            >
              {isComparing ? <><X className="h-3.5 w-3.5" /> Exit compare</> : <><Columns2 className="h-3.5 w-3.5" /> Compare</>}
            </Button>
          )}
        </div>
      </div>

      {/* Compare mode */}
      {isComparing && (
        <CompareView
          directions={compareDirs}
          onSelect={onSelect}
          selected={selected || alreadySelected?.direction.id}
          locked={!!alreadySelected}
          copiedHex={copiedHex}
          onCopyHex={copyHex}
        />
      )}

      {/* Normal grid */}
      {!isComparing && (
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
              compareSelected={compareIds.includes(d.id)}
              onToggleCompare={() => toggleCompare(d.id)}
              showCompareToggle={directions.length > 1 && !alreadySelected}
              copiedHex={copiedHex}
              onCopyHex={copyHex}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CompareView({
  directions, onSelect, selected, locked, copiedHex, onCopyHex,
}: {
  directions: Direction[]; onSelect: (id: string) => void; selected?: string; locked: boolean;
  copiedHex: string | null; onCopyHex: (hex: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {directions.map((d, i) => {
        const versions = renderDirectionVersions(d);
        const isSelected = selected === d.id;
        return (
          <Card key={d.id} className={cn("overflow-hidden transition", isSelected && "ring-2 ring-primary")}>
            {/* Logo header */}
            <div className="grid grid-cols-2">
              <div className="flex h-28 items-center justify-center border-b border-r border-border" style={{ background: versions[0].bg }}>
                <span className="inline-flex items-center justify-center h-12 max-w-[85%]" dangerouslySetInnerHTML={{ __html: versions[0].svg }} />
              </div>
              <div className="flex h-28 items-center justify-center border-b border-border" style={{ background: versions[2].bg }}>
                <span className="inline-flex items-center justify-center h-12 max-w-[85%]" dangerouslySetInnerHTML={{ __html: versions[2].svg }} />
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="accent">Direction {i + 1}</Badge>
                <span className="text-xs text-muted-foreground">{d.archetype}</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90 line-clamp-3">{d.rationaleText}</p>

              {/* Color palette */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Palette className="h-3 w-3" /> Palette</div>
                <div className="flex gap-2">
                  {d.colorTokens.slice(0, 4).map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => onCopyHex(c.hex)}
                      className="group flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[10px] hover:border-primary/50 transition"
                      title={`Copy ${c.hex}`}
                    >
                      <span className="h-3 w-3 rounded-sm shrink-0" style={{ background: c.hex }} />
                      <span className="text-muted-foreground">{c.hex}</span>
                      {copiedHex === c.hex ? <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" /> : <Copy className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground/70">Type:</span> {d.typographyNotes}
              </div>

              {/* Select button */}
              <Button
                className="w-full gap-2"
                variant={isSelected ? "secondary" : "default"}
                disabled={locked && !isSelected}
                onClick={() => onSelect(d.id)}
              >
                {isSelected ? <><Sparkles className="h-4 w-4" /> Selected</> : <><ArrowRight className="h-4 w-4" /> Select</>}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function DirectionCard({
  direction, index, selected, locked, onSelect, single,
  compareSelected, onToggleCompare, showCompareToggle,
  copiedHex, onCopyHex,
}: {
  direction: Direction; index: number; selected: boolean; locked: boolean; onSelect: () => void; single: boolean;
  compareSelected: boolean; onToggleCompare: () => void; showCompareToggle: boolean;
  copiedHex: string | null; onCopyHex: (hex: string) => void;
}) {
  const versions = renderDirectionVersions(direction);
  const [vFull, vMono, vReversed, vCompact] = versions;
  return (
    <Card className={cn("flex flex-col overflow-hidden transition", selected && "ring-2 ring-primary", compareSelected && "ring-2 ring-primary/50")}>
      {/* hero preview */}
      <div className="grid grid-cols-2">
        <div className="group relative flex h-32 items-center justify-center border-b border-r border-border overflow-hidden" style={{ background: vFull.bg }}>
          <span className="inline-flex items-center justify-center h-14 max-w-[85%] transition-transform group-hover:scale-110" dangerouslySetInnerHTML={{ __html: vFull.svg }} />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition" />
        </div>
        <div className="group relative flex h-32 items-center justify-center border-b border-border overflow-hidden" style={{ background: vReversed.bg }}>
          <span className="inline-flex items-center justify-center h-14 max-w-[85%] transition-transform group-hover:scale-110" dangerouslySetInnerHTML={{ __html: vReversed.svg }} />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition" />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="accent">Direction {index + 1}</Badge>
            <span className="text-xs text-muted-foreground">{direction.archetype}</span>
          </div>
          <div className="flex items-center gap-2">
            {showCompareToggle && (
              <button
                onClick={onToggleCompare}
                className={cn(
                  "text-xs px-2 py-1 rounded-md border transition",
                  compareSelected ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50",
                )}
              >
                {compareSelected ? "✓ Compare" : "Compare"}
              </button>
            )}
            {selected && <Check className="h-4 w-4 text-primary" />}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-foreground/90">{direction.rationaleText}</p>

        {/* all 4 versions */}
        <div className="grid grid-cols-4 gap-2">
          {versions.map((v) => (
            <div key={v.key} className="group space-y-1 cursor-default">
              <div className="flex h-14 items-center justify-center rounded-md border border-border p-1 transition group-hover:border-primary/50 group-hover:shadow-sm" style={{ background: v.bg }}>
                <span className="inline-flex items-center justify-center h-8 max-w-full transition-transform group-hover:scale-110" dangerouslySetInnerHTML={{ __html: v.svg }} />
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
          <div className="flex flex-wrap gap-1.5">
            {direction.colorTokens.map((c) => (
              <button
                key={c.hex}
                onClick={() => onCopyHex(c.hex)}
                className="group flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[10px] hover:border-primary/50 transition"
                title={`Copy ${c.hex}`}
              >
                <span className="h-3 w-3 rounded-sm shrink-0" style={{ background: c.hex }} />
                <span className="text-muted-foreground">{c.name}</span>
                {copiedHex === c.hex ? <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" /> : <Copy className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition" />}
              </button>
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

export default function DirectionsPage() {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
      <DirectionsInner />
    </Suspense>
  );
}
