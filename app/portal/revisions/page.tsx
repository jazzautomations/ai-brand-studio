"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Wand2, RefreshCw, MessageSquare, Sparkles, AlertTriangle, Send,
} from "lucide-react";
import { useOrderFromQuery } from "@/lib/mock/use-order";
import { getStore } from "@/lib/mock/store";
import { TIERS } from "@/lib/tiers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function RevisionsInner() {
  const { id, order, ready } = useOrderFromQuery();
  const [type, setType] = useState<"adjustment" | "structural">("adjustment");
  const [text, setText] = useState("");
  const [lastRevId, setLastRevId] = useState<string | null>(null);

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

  const tier = TIERS.find((t) => t.id === order.tier)!;
  const revisions = getStore().getRevisions(id);
  const structuralApplied = revisions.filter((r) => r.type === "structural" && r.status === "auto_applied").length;
  const roundsLeft = Math.max(0, tier.revisionRounds - structuralApplied);
  const lastRev = revisions.find((r) => r.id === lastRevId);

  const submit = () => {
    if (!text.trim()) return;
    const rev = getStore().submitRevision(id, text.trim(), type);
    setLastRevId(rev.id);
    setText("");
  };

  const persist = () => {
    if (lastRevId) getStore().persistRevision(id, lastRevId);
  };

  const structuralBlocked = type === "structural" && roundsLeft === 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <Link href={`/portal/directions?order=${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to directions
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Request a change</h1>
        <p className="text-muted-foreground">
          Adjustments (color, spacing, copy) are always free. Bigger changes — a different concept, palette, or archetype — use a revision round.
        </p>
      </div>

      <Card className="space-y-5 p-6">
        {/* type selector */}
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => setType("adjustment")}
            className={cn(
              "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition",
              type === "adjustment" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-secondary",
            )}
          >
            <span className="flex items-center gap-2 font-medium"><Wand2 className="h-4 w-4 text-primary" /> Small adjustment</span>
            <span className="text-xs text-muted-foreground">Color tweak, spacing, copy edit — free & instant</span>
          </button>
          <button
            onClick={() => setType("structural")}
            className={cn(
              "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition",
              type === "structural" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-secondary",
            )}
          >
            <span className="flex items-center gap-2 font-medium"><RefreshCw className="h-4 w-4 text-primary" /> Bigger change</span>
            <span className="text-xs text-muted-foreground">Concept, palette, or archetype swap — uses a round</span>
          </button>
        </div>

        {/* rounds remaining */}
        {type === "structural" && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-4 py-2.5 text-sm">
            <span className="text-muted-foreground">Structural revision rounds remaining</span>
            <Badge variant={roundsLeft > 0 ? "accent" : "warning"}>{roundsLeft} of {tier.revisionRounds}</Badge>
          </div>
        )}

        {structuralBlocked && (
          <div className="flex flex-col gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            <span className="flex items-center gap-2 font-medium text-amber-300"><AlertTriangle className="h-4 w-4" /> No structural rounds left</span>
            <span className="text-muted-foreground">Buy an extra round to keep iterating on the concept.</span>
            <Link href="/checkout" className="inline-flex w-fit items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
              Add a round — $49
            </Link>
          </div>
        )}

        {/* request textarea */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tell us what to change</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            disabled={structuralBlocked}
            placeholder={type === "adjustment"
              ? "e.g. Make the accent a touch warmer and tighten the wordmark spacing."
              : "e.g. I want to pivot to a more playful, colorful concept instead of the minimal one."}
            className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none disabled:opacity-40"
          />
        </div>

        <Button className="w-full gap-2" disabled={!text.trim() || structuralBlocked} onClick={submit}>
          <Send className="h-4 w-4" /> {type === "adjustment" ? "Apply adjustment" : "Send to Creative Director"}
        </Button>

        {/* live agent response */}
        {lastRev && (
          <div className="space-y-3 rounded-xl border border-border bg-secondary/30 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" />
              {lastRev.type === "adjustment" ? "Auto-Apply Agent" : "Creative Director Agent"}
              <Badge variant={lastRev.status === "auto_applied" ? "success" : "accent"}>
                {lastRev.status === "auto_applied" ? "Applied" : lastRev.status === "pushback_sent" ? "Pushback" : "Resolved"}
              </Badge>
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{lastRev.agentResponseText}</p>
            {lastRev.type === "structural" && lastRev.status === "pushback_sent" && (
              <div className="flex flex-wrap gap-2 pt-1">
                <Button size="sm" variant="default" className="gap-1.5" onClick={persist}>
                  <RefreshCw className="h-3.5 w-3.5" /> I still want this — apply it
                </Button>
                <Link href={`/portal/directions?order=${id}`}>
                  <Button size="sm" variant="outline">Keep current direction</Button>
                </Link>
              </div>
            )}
            {lastRev.status === "auto_applied" && (
              <Link href={`/portal/directions?order=${id}`} className="inline-block text-sm text-primary underline">
                See the updated direction →
              </Link>
            )}
          </div>
        )}
      </Card>

      {/* history */}
      {revisions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Revision history</h2>
          {revisions.slice().reverse().map((r) => (
            <Card key={r.id} className="space-y-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{r.requestText}</span>
                <Badge variant={r.type === "adjustment" ? "secondary" : "accent"}>{r.type}</Badge>
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">{r.agentResponseText}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RevisionsPage() {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
      <RevisionsInner />
    </Suspense>
  );
}
