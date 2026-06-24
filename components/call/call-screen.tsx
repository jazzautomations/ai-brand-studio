"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Phone, PhoneOff, Mic, Search, Loader2, Check, Sparkles,
  PanelRightOpen, PanelRightClose, ArrowRight,
} from "lucide-react";
import { STUDIO_NAME } from "@/lib/studio";
import { TIERS } from "@/lib/tiers";
import {
  DISCOVERY_SCRIPT, interpolate,
  type ScriptPrompt, type CollectedAnswers,
} from "@/lib/mock/transcript";
import type { VoiceTurn } from "@/lib/data/types";
import { getStore } from "@/lib/mock/store";
import { Waveform } from "@/components/call/waveform";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Phase = "connecting" | "call" | "building";
type Event =
  | { kind: "speak"; text: string }
  | { kind: "research"; note: string }
  | { kind: "prompt"; prompt: ScriptPrompt }
  | { kind: "readback" };

export function CallScreen({ orderId }: { orderId: string }) {
  const router = useRouter();
  const store = getStore();
  const order = store.getOrder(orderId);
  const tier = TIERS.find((t) => t.id === order?.tier) ?? TIERS[1];

  const events = useMemo<Event[]>(() => {
    const ev: Event[] = [];
    for (const step of DISCOVERY_SCRIPT) {
      for (const line of step.agent) ev.push({ kind: "speak", text: line });
      if (step.researchNote) ev.push({ kind: "research", note: step.researchNote });
      if (step.prompt) ev.push({ kind: "prompt", prompt: step.prompt });
    }
    ev.push({ kind: "readback" });
    return ev;
  }, []);

  const [phase, setPhase] = useState<Phase>("connecting");
  const [eventIndex, setEventIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [answers, setAnswers] = useState<CollectedAnswers>({});
  const [transcript, setTranscript] = useState<VoiceTurn[]>([]);
  const [research, setResearch] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [showPanel, setShowPanel] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(tier.callMinutes * 60);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const current = events[eventIndex];
  const fullLine = current?.kind === "speak" ? interpolate(current.text, answers) : "";

  const pushTurn = (role: VoiceTurn["role"], text: string) => {
    setTranscript((t) => [...t, { id: `${t.length}-${Date.now()}`, role, text, ts: Date.now() }]);
  };

  // connect → call
  useEffect(() => {
    if (!order) return;
    store.startVoiceSession(orderId);
    const t = setTimeout(() => setPhase("call"), 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // typing engine
  useEffect(() => {
    if (phase !== "call" || current?.kind !== "speak") return;
    if (typed.length >= fullLine.length) return;
    const t = setTimeout(() => setTyped(fullLine.slice(0, typed.length + 1)), 20);
    return () => clearTimeout(t);
  }, [phase, current, typed, fullLine]);

  // auto-advance after a speak line completes
  useEffect(() => {
    if (phase !== "call" || current?.kind !== "speak") return;
    if (typed.length < fullLine.length) return;
    const t = setTimeout(() => {
      pushTurn("agent", fullLine);
      setEventIndex((i) => i + 1);
      setTyped("");
    }, 620);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, current, typed, fullLine]);

  // research overlay
  useEffect(() => {
    if (phase !== "call") return;
    if (current?.kind !== "research") { setResearch(null); return; }
    setResearch(current.note);
    const t = setTimeout(() => setEventIndex((i) => i + 1), 2500);
    return () => clearTimeout(t);
  }, [phase, current]);

  // countdown
  useEffect(() => {
    if (phase !== "call") return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { finish(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // scroll transcript
  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [transcript]);

  function submitPrompt(p: ScriptPrompt, value: string) {
    const v = value.trim();
    if (!v) return;
    setAnswers((a) => ({ ...a, [p.field]: v }));
    pushTurn("client", v);
    setDraft("");
    setEventIndex((i) => i + 1);
  }

  function finish() {
    // completeVoiceSession builds the brief + competitor research from the
    // transcript/answers and auto-starts the agent pipeline (mock Inngest).
    store.completeVoiceSession(orderId, transcript, answers);
    setPhase("building");
    setTimeout(() => router.push(`/portal/progress?order=${orderId}`), 3200);
  }

  if (!order) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
        <div>
          <p className="text-lg font-medium">No active brand call found.</p>
          <p className="mt-2 text-sm text-muted-foreground">Pick a tier and start a project first.</p>
          <Link href="/checkout" className="mt-4 inline-block"><Button>Go to checkout</Button></Link>
        </div>
      </div>
    );
  }

  const mm = Math.floor(secondsLeft / 60);
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const progress = Math.round(((tier.callMinutes * 60 - secondsLeft) / (tier.callMinutes * 60)) * 100);

  // ---- connecting ----
  if (phase === "connecting") {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-primary/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-lg font-medium">Connecting you to your AI brand strategist…</p>
          <p className="mt-1 text-sm text-muted-foreground">{STUDIO_NAME} voice studio</p>
        </div>
      </div>
    );
  }

  // ---- building ----
  if (phase === "building") {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-primary/10 animate-float">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold">Got it. Building your brand now.</h2>
          <p className="mt-3 text-muted-foreground">
            Research, strategy, and visual directions are running through our agent pipeline.
            Your portal is unlocking — taking you there…
          </p>
          <div className="mx-auto mt-6 h-1.5 w-56 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
      </div>
    );
  }

  // ---- call ----
  const isSpeaking = current?.kind === "speak";
  const awaitingInput = current?.kind === "prompt";
  const isReadback = current?.kind === "readback";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* top bar */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground text-xs font-bold">{STUDIO_NAME[0]}</span>
          <span className="font-medium">{STUDIO_NAME}</span>
          <Badge variant="success" className="ml-2"><span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Live call</Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm tabular-nums text-muted-foreground">{mm}:{ss}</span>
          <button onClick={() => setShowPanel((v) => !v)} className="text-muted-foreground hover:text-foreground" aria-label="Toggle transcript">
            {showPanel ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* progress bar */}
      <div className="h-1 w-full bg-secondary">
        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* main stage */}
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          {/* research indicator */}
          {research && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
              <Search className="h-4 w-4 animate-pulse" /> {research}
            </div>
          )}

          <div className="relative mb-8">
            <div className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
              <Mic className="h-10 w-10 text-primary" />
            </div>
          </div>

          <Waveform active={isSpeaking || !!research} />

          {/* agent bubble */}
          {isSpeaking && (
            <button
              onClick={() => setTyped(fullLine)}
              className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-foreground/90"
            >
              {typed}
              {typed.length < fullLine.length && <span className="typing-caret ml-0.5">▍</span>}
            </button>
          )}

          {/* prompt input */}
          {awaitingInput && current.kind === "prompt" && (
            <div className="mt-8 w-full max-w-xl text-left">
              <p className="mb-3 text-sm font-medium text-muted-foreground">{current.prompt.label}</p>
              <div className="flex flex-col gap-2">
                {current.prompt.suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => submitPrompt(current.prompt!, s)}
                    className="rounded-lg border border-border bg-card px-4 py-3 text-left text-sm transition hover:border-primary/50 hover:bg-secondary"
                  >
                    {s}
                  </button>
                ))}
                <form
                  onSubmit={(e) => { e.preventDefault(); submitPrompt(current.prompt!, draft); }}
                  className="mt-2 flex gap-2"
                >
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={current.prompt.placeholder}
                    autoFocus
                  />
                  <Button type="submit" size="md"><ArrowRight className="h-4 w-4" /></Button>
                </form>
                <p className="mt-1 text-xs text-muted-foreground">Tap a suggestion or type your own answer.</p>
              </div>
            </div>
          )}

          {/* readback confirm */}
          {isReadback && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="max-w-md text-balance text-lg text-foreground">Does that capture it?</p>
              <div className="flex gap-3">
                <Button onClick={finish} size="lg"><Check className="h-4 w-4" /> Yes — build my brand</Button>
              </div>
            </div>
          )}
        </div>

        {/* transcript panel */}
        {showPanel && (
          <aside className="hidden w-80 flex-col border-l border-border/60 bg-card/40 md:flex">
            <div className="border-b border-border/60 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Live transcript
            </div>
            <div ref={transcriptRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {transcript.length === 0 && (
                <p className="text-sm text-muted-foreground">Your conversation will appear here as it unfolds…</p>
              )}
              {transcript.map((t, i) => (
                <div key={i} className={cn("flex", t.role === "client" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                      t.role === "client"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-secondary text-secondary-foreground",
                    )}
                  >
                    {t.text}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* end call */}
      <div className="flex items-center justify-center border-t border-border/60 py-4">
        <button
          onClick={finish}
          className="inline-flex items-center gap-2 rounded-full bg-red-500/90 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
        >
          <PhoneOff className="h-4 w-4" /> End call
        </button>
      </div>
    </div>
  );
}
