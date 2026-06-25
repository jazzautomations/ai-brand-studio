"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import {
  Search, Compass, MessageSquare, Palette, ShieldCheck,
  Phone, ArrowRight, Mic, Sparkles, CheckCircle2, Loader2,
  FileBox, Boxes, ChevronDown, ChevronRight, Terminal,
} from "lucide-react";
import { useOrderFromQuery } from "@/lib/mock/use-order";
import { getStore } from "@/lib/mock/store";
import { TIERS } from "@/lib/tiers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OrderStatus, AgentLogEntry } from "@/lib/data/types";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "Awaiting payment",
  pending_call: "Start your brand call",
  call_in_progress: "Your brand call is in progress",
  call_completed: "We received your call — your brand strategy is being built",
  in_progress: "Research → Strategy → Visual",
  qa_review: "Quality check in progress",
  awaiting_client_review: "Your directions are ready — see them below",
  revision: "Applying your revision",
  final_compile: "Assembling your brand guide + package",
  delivered: "Your brand is ready 🎉",
};

const TRACKER = [
  { key: "research", label: "Research", icon: Search, desc: "Competitive landscape & market gap" },
  { key: "strategy", label: "Strategy", icon: Compass, desc: "Positioning, archetype, golden why" },
  { key: "verbal", label: "Verbal identity", icon: MessageSquare, desc: "Voice, pillars, tagline" },
  { key: "visual", label: "Visual directions", icon: Palette, desc: "Logo system + palette" },
  { key: "qa_review", label: "QA review", icon: ShieldCheck, desc: "4-layer quality validation" },
];

const FINALIZE_TRACKER = [
  { key: "compiler", label: "Compiler", icon: FileBox, desc: "Assembling the brand guide document" },
  { key: "packager", label: "Packager", icon: Boxes, desc: "Building tokens, DESIGN.md & document set" },
];

const AGENT_LABELS: Record<string, string> = {
  voice_intake: "Voice Intake",
  research: "Research Agent",
  strategy: "Strategy Agent",
  verbal: "Verbal Identity Agent",
  visual: "Visual Agent",
  qa_review: "QA Review Agent",
  creative_director: "Creative Director",
  auto_apply: "Auto-Apply Agent",
  compiler: "Compiler Agent",
  packager: "Packager Agent",
};

function ProgressInner() {
  const { id, order, ready } = useOrderFromQuery();

  if (!ready) {
    return <div className="grid min-h-[60vh] place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!id) {
    return <NoOrder msg="No project selected." />;
  }
  if (!order) {
    return <NoOrder msg="We couldn't find that project." />;
  }

  const tier = TIERS.find((t) => t.id === order.tier);
  const runs = getStore().getAgentRuns(id);
  const session = getStore().getVoiceSession(id);
  const stageState = (key: string) => {
    const run = runs.find((r) => r.agentName === key);
    if (!run) return "pending";
    return run.status;
  };

  const isCallStage = ["pending_call", "call_in_progress", "call_completed"].includes(order.status);
  const pipelineStarted = !isCallStage;
  const finalizeStarted = ["final_compile", "delivered"].includes(order.status);
  const readyForReview = order.status === "awaiting_client_review";
  const delivered = order.status === "delivered";
  const progressRuns = runs.filter((r) => ["voice_intake", "research", "strategy", "verbal", "visual", "qa_review"].includes(r.agentName));
  const finalizeRuns = runs.filter((r) => ["compiler", "packager"].includes(r.agentName));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* headline */}
      <div className="space-y-2">
        <Badge variant="accent">{tier?.name} tier</Badge>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {STATUS_LABEL[order.status]}
        </h1>
        <p className="text-muted-foreground">
          {delivered
            ? "Your brand identity is complete and ready to download."
            : readyForReview
              ? "Your AI agent pipeline finished and passed quality review. Review your directions and pick the one that fits."
              : "Your fully autonomous agent pipeline is working. No action needed from you — we'll notify you the moment directions are ready."}
        </p>
      </div>

      {/* start call CTA */}
      {order.status === "pending_call" && (
        <Card className="overflow-hidden border-primary/30">
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/15 animate-float">
              <Mic className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Start your brand discovery call</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                Click and talk to your AI brand strategist right here in the browser. {tier?.callMinutes} minutes,
                real-time competitor research, no scheduling.
              </p>
            </div>
            <Link href={`/call?order=${id}`}>
              <Button size="lg" className="gap-2">
                <Phone className="h-4 w-4" /> Start brand call
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* call recording / transcript */}
      {session && session.status === "completed" && (
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary">
                <Mic className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-medium">Discovery call recording</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((session.durationSeconds || 0) / 60)} min · transcript saved
                </div>
              </div>
            </div>
            <Badge variant="success">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          </div>
        </Card>
      )}

      {/* pipeline tracker */}
      {pipelineStarted && !delivered && (
        <Card className="p-6">
          <div className="mb-5 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" /> Autonomous agent pipeline
          </div>
          <ol className="relative space-y-5 border-l border-border pl-6">
            {TRACKER.map((s) => {
              const state = stageState(s.key);
              const done = state === "done";
              const active = state === "running";
              return (
                <li key={s.key} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full border",
                      done && "border-primary bg-primary text-primary-foreground",
                      active && "border-primary bg-primary/15 text-primary",
                      !done && !active && "border-border bg-card text-muted-foreground",
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : active ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <s.icon className="h-3 w-3" />
                    )}
                  </span>
                  <div className={cn("transition", done || active ? "opacity-100" : "opacity-50")}>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {s.label}
                      {active && <span className="text-xs text-primary">running…</span>}
                      {done && <span className="text-xs text-muted-foreground">done</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">{s.desc}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>
      )}

      {finalizeStarted && (
        <Card className="p-6">
          <div className="mb-5 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <FileBox className="h-4 w-4 text-primary" /> Delivery assembly
          </div>
          <ol className="relative space-y-5 border-l border-border pl-6">
            {FINALIZE_TRACKER.map((s) => {
              const run = runs.find((r) => r.agentName === s.key);
              const done = run?.status === "done";
              const active = run?.status === "running";
              return (
                <li key={s.key} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full border",
                      done && "border-primary bg-primary text-primary-foreground",
                      active && "border-primary bg-primary/15 text-primary",
                      !done && !active && "border-border bg-card text-muted-foreground",
                    )}
                  >
                    {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : active ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <s.icon className="h-3 w-3" />}
                  </span>
                  <div className={cn("transition", done || active ? "opacity-100" : "opacity-50")}>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {s.label}
                      {active && <span className="text-xs text-primary">running…</span>}
                      {done && <span className="text-xs text-muted-foreground">done</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">{s.desc}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>
      )}

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Terminal className="h-4 w-4 text-primary" /> Agent activity log
        </div>
        <AgentLogPanel orderId={id} runs={finalizeRuns.length ? [...progressRuns, ...finalizeRuns] : progressRuns} />
      </Card>

      {/* ready → directions CTA */}
      {readyForReview && (
        <Card className="border-primary/40 p-6">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-semibold">Your directions are ready</div>
              <p className="text-sm text-muted-foreground">
                {tier?.directionCount === 1 ? "1 visual direction" : `${tier?.directionCount} visual directions`} passed QA. Pick the one that fits.
              </p>
            </div>
            <Link href={`/portal/directions?order=${id}`}>
              <Button className="gap-2">Review directions <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </Card>
      )}

      {/* delivered → delivery CTA */}
      {delivered && (
        <Card className="border-primary/40 p-6">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-semibold">Your brand is delivered</div>
              <p className="text-sm text-muted-foreground">Brand guide PDF + Brand Context Package ready to download.</p>
            </div>
            <Link href={`/portal/delivery?order=${id}`}>
              <Button className="gap-2">Go to delivery <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </Card>
      )}

      {/* demo controls */}
      <DemoControls orderId={id} />
    </div>
  );
}

function NoOrder({ msg }: { msg: string }) {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="text-muted-foreground">{msg}</p>
      <Link href="/checkout" className="mt-4 inline-block text-primary underline">Start a project</Link>
    </div>
  );
}

function DemoControls({ orderId }: { orderId: string }) {
  const skip = () => getStore().skipStage(orderId);
  return (
    <div className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
      <div className="mb-2 font-medium text-foreground/80">Demo controls (not visible to real clients)</div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={skip}>Skip to next stage ▸</Button>
      </div>
    </div>
  );
}

function AgentLogPanel({ orderId, runs }: { orderId: string; runs: Array<{ id: string; agentName: string; status: string; output?: { note?: string } }> }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const logs = getStore().getAgentLogs(orderId);

  const logsByAgent = new Map<string, AgentLogEntry[]>();
  for (const log of logs) {
    const existing = logsByAgent.get(log.agentName) || [];
    existing.push(log);
    logsByAgent.set(log.agentName, existing);
  }

  if (!runs.length) {
    return <p className="text-sm text-muted-foreground">No agent logs yet.</p>;
  }

  return (
    <div className="space-y-2">
      {runs.map((run) => {
        const agentLogs = logsByAgent.get(run.agentName) || [];
        const isExpanded = expanded === run.agentName;
        const isRunning = run.status === "running";
        const isDone = run.status === "done";

        return (
          <div key={run.id} className="rounded-lg border border-border bg-card/50 overflow-hidden">
            <button
              onClick={() => setExpanded(isExpanded ? null : run.agentName)}
              className="flex w-full items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "grid h-7 w-7 place-items-center rounded-md text-xs",
                  isDone && "bg-primary/15 text-primary",
                  isRunning && "bg-amber-500/15 text-amber-500",
                  !isDone && !isRunning && "bg-secondary text-muted-foreground",
                )}>
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-xs font-mono">{runs.indexOf(run) + 1}</span>}
                </div>
                <div>
                  <div className="text-sm font-medium">{AGENT_LABELS[run.agentName] || run.agentName}</div>
                  <div className="text-xs text-muted-foreground">{run.output?.note || "Queued"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {agentLogs.length > 0 && (
                  <Badge variant="outline" className="text-xs">{agentLogs.length} steps</Badge>
                )}
                {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            </button>

            {isExpanded && agentLogs.length > 0 && (
              <div className="border-t border-border/60 bg-secondary/20 px-4 py-3">
                <div className="space-y-2">
                  {agentLogs.map((log, i) => (
                    <div key={log.id} className="flex gap-3 text-xs">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          i === agentLogs.length - 1 && isRunning ? "bg-primary animate-pulse" : "bg-primary/60",
                        )} />
                        {i < agentLogs.length - 1 && <div className="w-px flex-1 bg-border/60 mt-1" />}
                      </div>
                      <div className="pb-2">
                        <div className="font-medium text-foreground/90">{log.step}</div>
                        <div className="mt-0.5 text-muted-foreground leading-relaxed">{log.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isExpanded && agentLogs.length === 0 && (
              <div className="border-t border-border/60 bg-secondary/20 px-4 py-3 text-xs text-muted-foreground">
                Waiting for agent to produce log entries…
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
      <ProgressInner />
    </Suspense>
  );
}
