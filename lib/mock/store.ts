"use client";

import type {
  AgentRun,
  AgentLogEntry,
  Brief,
  Client,
  CompetitorResearch,
  Direction,
  Order,
  OrderStatus,
  QAReview,
  Revision,
  SelectedDirection,
  VoiceSession,
  VoiceTurn,
  Deliverable,
} from "@/lib/data/types";
import { AGENT_LOG_SEQUENCES } from "@/lib/mock/agent-logs";
import type { Tier } from "@/lib/tiers";
import { TIERS } from "@/lib/tiers";
import { STUDIO_NAME } from "@/lib/studio";
import {
  PIPELINE_STAGES,
  FINALIZE_STAGES,
} from "@/lib/mock/pipeline";
import { generateDirections } from "@/lib/mock/directions";
import {
  buildBriefFromTranscript,
  competitorResearchFor,
  type CollectedAnswers,
} from "@/lib/mock/transcript";

const STORAGE_KEY = "abs_state_v1";
const TICK_MS = 1000;

interface PipelineState {
  phase: "pipeline" | "finalize";
  stageIdx: number;
  nextStageAt: number; // epoch ms
}

interface StoreState {
  clients: Client[];
  orders: Order[];
  voiceSessions: VoiceSession[];
  briefs: Brief[];
  agentRuns: AgentRun[];
  agentLogs: AgentLogEntry[];
  directions: Direction[];
  selectedDirections: SelectedDirection[];
  revisions: Revision[];
  qaReviews: QAReview[];
  deliverables: Deliverable[];
  currentClientId: string | null;
  currentEmail: string | null;
  pipeline: Record<string, PipelineState>;
}

type Listener = () => void;

function uid(prefix: string): string {
  return prefix + "_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function emptyState(): StoreState {
  return {
    clients: [],
    orders: [],
    voiceSessions: [],
    briefs: [],
    agentRuns: [],
    agentLogs: [],
    directions: [],
    selectedDirections: [],
    revisions: [],
    qaReviews: [],
    deliverables: [],
    currentClientId: null,
    currentEmail: null,
    pipeline: {},
  };
}

class Store {
  private state: StoreState = emptyState();
  // Stable snapshot ref used by useSyncExternalStore. A fresh shallow copy
  // is produced on every emit() so React detects the change and re-renders.
  // Mutable in-place edits to `state` would otherwise keep the same ref and
  // silently skip re-renders.
  private snapshot: StoreState = emptyState();
  private listeners = new Set<Listener>();
  private ticker: ReturnType<typeof setInterval> | null = null;
  private loaded = false;

  /* ---------- lifecycle ---------- */

  init() {
    this.hydrate();
  }

  ensureLoaded() {
    if (!this.loaded) this.hydrate();
  }

  /** SSR-safe hydration. Called from the hook's effect (post-mount), never
   *  mutates state mid-render. On the server it is a no-op. Loads persisted
   *  state from localStorage, then publishes a fresh snapshot so subscribers
   *  re-render with the loaded data. */
  hydrate() {
    if (this.loaded || typeof window === "undefined") return;
    this.loaded = true;
    this.load();
    this.snapshot = { ...this.state };
    this.startTicker();
    this.emit();
  }

  private load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this.state = { ...emptyState(), ...JSON.parse(raw) };
    } catch {
      this.state = emptyState();
    }
  }

  private persist() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      /* ignore quota */
    }
  }

  private emit() {
    // Produce a new top-level reference so useSyncExternalStore detects the
    // change (in-place mutations to `state` keep the same ref otherwise).
    this.snapshot = { ...this.state };
    this.persist();
    this.listeners.forEach((l) => l());
  }

  subscribe = (l: Listener): (() => void) => {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  }

  getSnapshot = (): StoreState => this.snapshot;

  /** Stable empty snapshot used for SSR + the client's first paint so the
   *  hydrated markup matches the server markup. The real (loaded) state is
   *  swapped in after mount via getSnapshot, with no hydration exception. */
  private emptyServer: StoreState = emptyState();
  getServerSnapshot = (): StoreState => this.emptyServer;

  /* ---------- ticker ---------- */

  private startTicker() {
    if (this.ticker) return;
    this.ticker = setInterval(() => this.tick(), TICK_MS);
  }

  private tick() {
    const now = Date.now();
    let changed = false;
    for (const order of this.state.orders) {
      const ps = this.state.pipeline[order.id];
      if (!ps || !ps.nextStageAt) continue;
      if (now < ps.nextStageAt) continue;
      this.advance(order.id);
      changed = true;
    }
    if (changed) this.emit();
  }

  private advance(orderId: string) {
    const order = this.state.orders.find((o) => o.id === orderId);
    const ps = this.state.pipeline[orderId];
    if (!order || !ps) return;

    const stages = ps.phase === "pipeline" ? PIPELINE_STAGES : FINALIZE_STAGES;
    // mark current stage agent run done
    const cur = stages[ps.stageIdx];
    if (cur) {
      const run = this.state.agentRuns.find(
        (r) => r.orderId === orderId && r.agentName === cur.agentName && r.status === "running",
      );
      if (run) {
        run.status = "done";
        run.completedAt = new Date().toISOString();
      }
    }

    const nextIdx = ps.stageIdx + 1;
    if (nextIdx < stages.length) {
      const next = stages[nextIdx];
      order.status = next.status;
      ps.stageIdx = nextIdx;
      ps.nextStageAt = Date.now() + next.durationMs;
      this.logAgentRun(orderId, next.agentName, "running", next.preview);
      this.emitAgentLogs(orderId, next.agentName);
      return;
    }

    // phase complete
    ps.nextStageAt = 0;
    if (ps.phase === "pipeline") {
      this.completePipelinePhase(orderId);
    } else {
      this.completeFinalizePhase(orderId);
    }
  }

  private completePipelinePhase(orderId: string) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;
    const brief = this.state.briefs.find((b) => b.orderId === orderId);
    if (brief) {
      const dirs = generateDirections(brief, order.tier);
      dirs.forEach((d) => (d.orderId = orderId));
      this.state.directions.push(...dirs);
    }
    // QA review record — all pass (mock)
    this.state.qaReviews.push({
      id: uid("qa"),
      orderId,
      reviewType: "visual",
      passed: true,
      flags: [],
      autoFixes: ["Cleaned 2 excess anchor points on direction 1 mark", "Color-corrected direction 2 accent to match strategy"],
      regenerations: 0,
      reviewedAt: new Date().toISOString(),
    });
    order.status = "awaiting_client_review";
    delete this.state.pipeline[orderId];
    this.logAgentRun(orderId, "qa_review", "done", "All directions passed 4-layer QA validation.");
  }

  private completeFinalizePhase(orderId: string) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;
    order.status = "delivered";
    order.deliveredAt = new Date().toISOString();
    // always create deliverables — the mock doesn't need a real selection
    this.state.deliverables.push(
      { id: uid("del"), orderId, type: "brand_guide_pdf", fileUrl: "#brand-guide.pdf", version: 1, createdAt: new Date().toISOString() },
      { id: uid("del"), orderId, type: "context_package_zip", fileUrl: "#brand-context.zip", version: 1, createdAt: new Date().toISOString() },
      { id: uid("del"), orderId, type: "market_research_doc", fileUrl: "#market-research.html", version: 1, createdAt: new Date().toISOString() },
      { id: uid("del"), orderId, type: "strategy_doc", fileUrl: "#brand-strategy.html", version: 1, createdAt: new Date().toISOString() },
      { id: uid("del"), orderId, type: "mood_board", fileUrl: "#mood-board.html", version: 1, createdAt: new Date().toISOString() },
      { id: uid("del"), orderId, type: "social_media_kit", fileUrl: "#social-media-kit.html", version: 1, createdAt: new Date().toISOString() },
      { id: uid("del"), orderId, type: "brand_in_context", fileUrl: "#brand-in-context.html", version: 1, createdAt: new Date().toISOString() },
    );
    delete this.state.pipeline[orderId];
  }

  private logAgentRun(orderId: string, agentName: AgentRun["agentName"], status: AgentRun["status"], note: string) {
    this.state.agentRuns.push({
      id: uid("run"),
      orderId,
      agentName,
      status,
      input: {},
      output: { note },
      retryCount: 0,
      qaFlags: [],
      startedAt: new Date().toISOString(),
      completedAt: status === "done" ? new Date().toISOString() : undefined,
    });
  }

  private emitAgentLogs(orderId: string, agentName: AgentRun["agentName"]) {
    const steps = AGENT_LOG_SEQUENCES[agentName];
    if (!steps) return;
    steps.forEach((s, i) => {
      setTimeout(() => {
        this.state.agentLogs.push({
          id: uid("alog"),
          orderId,
          agentName,
          step: s.step,
          detail: s.detail,
          timestamp: new Date().toISOString(),
        });
        this.emit();
      }, i * 1200);
    });
  }

  /* ---------- auth (mock magic link) ---------- */

  loginOrSignup(email: string, name?: string): Client {
    this.ensureLoaded();
    email = email.trim().toLowerCase();
    let client = this.state.clients.find((c) => c.email === email);
    if (!client) {
      client = {
        id: uid("cli"),
        email,
        name: name || email.split("@")[0],
        createdAt: new Date().toISOString(),
      };
      this.state.clients.push(client);
    } else if (name) {
      client.name = name;
    }
    this.state.currentClientId = client.id;
    this.state.currentEmail = email;
    this.emit();
    return client;
  }

  logout() {
    this.state.currentClientId = null;
    this.state.currentEmail = null;
    this.emit();
  }

  getCurrentClient(): Client | null {
    if (!this.state.currentClientId) return null;
    return this.state.clients.find((c) => c.id === this.state.currentClientId) || null;
  }

  getClient(clientId: string): Client | undefined {
    return this.state.clients.find((c) => c.id === clientId);
  }

  /* ---------- orders ---------- */

  createOrder({ tier, email, name, country }: { tier: Tier; email: string; name?: string; country?: string }): Order {
    const client = this.loginOrSignup(email, name);
    const cfg = TIERS.find((t) => t.id === tier)!;
    const order: Order = {
      id: uid("ord"),
      clientId: client.id,
      tier,
      pricePaidCents: cfg.priceCents,
      currencyDisplay: "USD",
      stripeSessionId: "mock_sess_" + uid("s"),
      status: "pending_call",
      deliverySlaHours: tier === "authority" ? 24 : 120,
      revisionCredits: cfg.revisionCredits,
      createdAt: new Date().toISOString(),
    };
    this.state.orders.push(order);
    if (country) client.country = country;
    this.emit();
    return order;
  }

  getOrder(id: string): Order | undefined {
    return this.state.orders.find((o) => o.id === id);
  }

  getOrdersByClientId(clientId: string): Order[] {
    return this.state.orders.filter((o) => o.clientId === clientId);
  }

  getOrdersByEmail(email: string): Order[] {
    const client = this.state.clients.find((c) => c.email === email.toLowerCase());
    return client ? this.getOrdersByClientId(client.id) : [];
  }

  getAllOrders(): Order[] {
    return [...this.state.orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  /** Wipe all demo data (client portal + admin). */
  resetDemo() {
    this.state = emptyState();
    this.persist();
    this.emit();
  }

  /** Populate sample orders at varied statuses for the admin dashboard demo. */
  seedDemo() {
    this.state = emptyState();
    const samples: Array<{ tier: Tier; status: Order["status"]; days: number; adj: string[] }> = [
      { tier: "signature", status: "delivered", days: 6, adj: ["bold", "warm", "sharp"] },
      { tier: "authority", status: "delivered", days: 3, adj: ["calm", "premium", "human"] },
      { tier: "starter", status: "awaiting_client_review", days: 1, adj: ["precise", "energetic", "trusted"] },
      { tier: "signature", status: "in_progress", days: 0, adj: ["confident", "considered", "clear"] },
      { tier: "authority", status: "pending_call", days: 0, adj: ["bold", "modern", "global"] },
    ];
    const names = ["Northwind Coffee", "Atlas Strength", "Mira Automation", "Verdant Books", "Helio Finance"];
    const industries = ["Specialty food & beverage", "Health & fitness", "SaaS / software", "Publishing", "Financial services"];
    samples.forEach((s, i) => {
      const t = TIERS.find((x) => x.id === s.tier)!;
      const client: Client = {
        id: uid("cli"),
        email: `demo${i + 1}@stud.io`,
        name: names[i].split(" ")[0],
        companyName: names[i],
        country: i % 2 ? "BR" : "US",
        locale: i % 2 ? "pt-BR" : "en-US",
        createdAt: new Date(Date.now() - s.days * 864e5).toISOString(),
      };
      this.state.clients.push(client);
      const order: Order = {
        id: uid("ord"),
        clientId: client.id,
        tier: s.tier,
        pricePaidCents: t.priceCents,
        currencyDisplay: "USD",
        stripeSessionId: "mock_" + uid("s"),
        status: s.status,
        deliverySlaHours: s.tier === "authority" ? 24 : 120,
        revisionCredits: t.revisionCredits,
        createdAt: new Date(Date.now() - s.days * 864e5).toISOString(),
        deliveredAt: s.status === "delivered" ? new Date().toISOString() : undefined,
      };
      this.state.orders.push(order);
      const brief: Brief = {
        id: uid("brf"),
        orderId: order.id,
        voiceSessionId: uid("vs"),
        businessName: names[i],
        industry: industries[i],
        whatTheySell: `${names[i]} — their core offering, delivered with care.`,
        targetAudience: "A specific, underserved segment.",
        competitors: ["Competitor A", "Competitor B"],
        existingAssetsUrls: [],
        desiredAdjectives: s.adj,
        explicitExclusions: "Generic, cold, forgettable.",
        primaryMarket: i % 2 ? "Brazil" : "United States",
        languagePreference: i % 2 ? "pt-BR" : "en",
        brandAdmirationReference: "A considered, confident brand.",
        confidenceScores: { businessName: 0.9, industry: 0.82, targetAudience: 0.85, competitors: 0.8, desiredAdjectives: 0.88, explicitExclusions: 0.82, primaryMarket: 0.9 },
        createdAt: new Date().toISOString(),
      };
      this.state.briefs.push(brief);
      if (["in_progress", "awaiting_client_review", "delivered"].includes(s.status)) {
        this.logAgentRun(order.id, "research", "done", "Discovery summary generated.");
        this.logAgentRun(order.id, "strategy", "done", "Positioning + archetype documented.");
        for (const agent of ["research", "strategy", "verbal", "visual", "qa_review"] as AgentRun["agentName"][]) {
          const steps = AGENT_LOG_SEQUENCES[agent];
          if (steps) {
            steps.forEach((step) => {
              this.state.agentLogs.push({
                id: uid("alog"),
                orderId: order.id,
                agentName: agent,
                step: step.step,
                detail: step.detail,
                timestamp: new Date(Date.now() - Math.random() * 864e5).toISOString(),
              });
            });
          }
        }
      }
      if (["awaiting_client_review", "delivered"].includes(s.status)) {
        const dirs = generateDirections(brief, s.tier);
        dirs.forEach((d) => (d.orderId = order.id));
        this.state.directions.push(...dirs);
        this.state.qaReviews.push({
          id: uid("qa"),
          orderId: order.id,
          reviewType: "visual",
          passed: i !== 2,
          flags: i === 2 ? ["color drift on direction 2 accent"] : [],
          autoFixes: i === 2 ? [] : ["Cleaned excess anchor points"],
          regenerations: i === 2 ? 1 : 0,
          reviewedAt: new Date().toISOString(),
        });
      }
      if (s.status === "delivered") {
        const dirs = this.state.directions.filter((d) => d.orderId === order.id);
        if (dirs[0]) {
          this.state.selectedDirections.push({ orderId: order.id, directionId: dirs[0].id, selectedAt: new Date().toISOString() });
          this.state.deliverables.push({ id: uid("del"), orderId: order.id, type: "brand_guide_pdf", fileUrl: "#brand-guide.pdf", version: 1, createdAt: new Date().toISOString() });
          this.state.deliverables.push({ id: uid("del"), orderId: order.id, type: "context_package_zip", fileUrl: "#brand-context.zip", version: 1, createdAt: new Date().toISOString() });
        }
      }
    });
    this.persist();
    this.emit();
  }

  /* ---------- voice sessions ---------- */

  startVoiceSession(orderId: string): VoiceSession {
    const existing = this.state.voiceSessions.find((v) => v.orderId === orderId);
    if (existing && existing.status === "in_progress") return existing;
    const session: VoiceSession = {
      id: uid("vs"),
      orderId,
      sessionType: "in_app",
      status: "in_progress",
      transcript: [],
      competitorResearch: [],
      startedAt: new Date().toISOString(),
    };
    this.state.voiceSessions.push(session);
    this.setOrderStatus(orderId, "call_in_progress");
    this.emit();
    return session;
  }

  getVoiceSession(orderId: string): VoiceSession | undefined {
    return this.state.voiceSessions.find((v) => v.orderId === orderId);
  }

  addVoiceTurn(orderId: string, turn: VoiceTurn) {
    const s = this.state.voiceSessions.find((v) => v.orderId === orderId);
    if (s) {
      s.transcript.push(turn);
      this.emit();
    }
  }

  setVoiceResearch(orderId: string, research: CompetitorResearch[]) {
    const s = this.state.voiceSessions.find((v) => v.orderId === orderId);
    if (s) {
      s.competitorResearch = research;
      this.emit();
    }
  }

  completeVoiceSession(orderId: string, transcript: VoiceTurn[], answers: CollectedAnswers) {
    const session = this.state.voiceSessions.find((v) => v.orderId === orderId);
    if (!session) return;
    const brief = buildBriefFromTranscript(transcript, answers);
    const research = competitorResearchFor(brief.competitors);
    session.transcript = transcript;
    session.competitorResearch = research;
    session.status = "completed";
    session.completedAt = new Date().toISOString();
    session.durationSeconds = Math.round(
      (Date.now() - (session.startedAt ? new Date(session.startedAt).getTime() : Date.now())) / 1000,
    );
    session.generatedBrief = brief;

    brief.id = uid("brf");
    brief.orderId = orderId;
    brief.voiceSessionId = session.id;
    brief.createdAt = new Date().toISOString();
    this.state.briefs.push(brief);
    this.setOrderStatus(orderId, "call_completed");
    this.emit();
    // auto-start pipeline shortly after
    setTimeout(() => this.startPipeline(orderId), 1500);
  }

  /* ---------- pipeline ---------- */

  private setOrderStatus(orderId: string, status: OrderStatus) {
    const o = this.state.orders.find((x) => x.id === orderId);
    if (o) o.status = status;
  }

  startPipeline(orderId: string) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;
    if (this.state.pipeline[orderId]) return; // already running
    const first = PIPELINE_STAGES[0];
    order.status = first.status;
    this.state.pipeline[orderId] = {
      phase: "pipeline",
      stageIdx: 0,
      nextStageAt: Date.now() + first.durationMs,
    };
    this.logAgentRun(orderId, first.agentName, "running", first.preview);
    this.emitAgentLogs(orderId, first.agentName);
    this.emit();
  }

  /** Demo helper: instantly jump to the next milestone. Handles every status transition. */
  skipStage(orderId: string) {
    const ps = this.state.pipeline[orderId];
    if (ps) {
      // Pipeline is running — complete all remaining stages instantly
      const stages = ps.phase === "pipeline" ? PIPELINE_STAGES : FINALIZE_STAGES;
      for (let i = ps.stageIdx; i < stages.length; i++) {
        const stage = stages[i];
        const run = this.state.agentRuns.find(
          (r) => r.orderId === orderId && r.agentName === stage.agentName && r.status === "running",
        );
        if (run) { run.status = "done"; run.completedAt = new Date().toISOString(); }
      }
      ps.nextStageAt = 0;
      if (ps.phase === "pipeline") {
        this.completePipelinePhase(orderId);
      } else {
        this.completeFinalizePhase(orderId);
      }
      this.emit();
      return;
    }
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) return;
    if (order.status === "pending_call") {
      this.startVoiceSession(orderId);
      const answers = { business: "Demo business", audience: "Demo audience", competitors: "Demo competitor", adjectives: "bold, warm, sharp" };
      this.completeVoiceSession(orderId, [], answers);
    } else if (order.status === "call_completed") {
      this.startPipeline(orderId);
    } else if (order.status === "awaiting_client_review") {
      const dirs = this.state.directions.filter((d) => d.orderId === orderId);
      if (dirs[0]) this.selectDirection(orderId, dirs[0].id);
    } else if (order.status === "revision") {
      order.status = "awaiting_client_review";
      this.emit();
    }
  }

  getAgentRuns(orderId: string): AgentRun[] {
    return this.state.agentRuns
      .filter((r) => r.orderId === orderId)
      .sort((a, b) => ((a.startedAt || "") < (b.startedAt || "") ? -1 : 1));
  }

  getAgentLogs(orderId: string): AgentLogEntry[] {
    return this.state.agentLogs
      .filter((l) => l.orderId === orderId)
      .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));
  }

  /* ---------- directions + selection ---------- */

  getDirections(orderId: string): Direction[] {
    return this.state.directions.filter((d) => d.orderId === orderId);
  }

  getSelectedDirection(orderId: string): { direction: Direction } | null {
    const sel = this.state.selectedDirections.find((s) => s.orderId === orderId);
    if (!sel) return null;
    const direction = this.state.directions.find((d) => d.id === sel.directionId);
    return direction ? { direction } : null;
  }

  selectDirection(orderId: string, directionId: string) {
    if (this.state.selectedDirections.some((s) => s.orderId === orderId)) return;
    this.state.selectedDirections.push({
      orderId,
      directionId,
      selectedAt: new Date().toISOString(),
    });
    this.setOrderStatus(orderId, "final_compile");
    const first = FINALIZE_STAGES[0];
    this.state.pipeline[orderId] = {
      phase: "finalize",
      stageIdx: 0,
      nextStageAt: Date.now() + first.durationMs,
    };
    this.logAgentRun(orderId, first.agentName, "running", first.preview);
    this.emitAgentLogs(orderId, first.agentName);
    this.emit();
  }

  /* ---------- revisions ---------- */

  getRevisions(orderId: string): Revision[] {
    return this.state.revisions.filter((r) => r.orderId === orderId);
  }

  submitRevision(orderId: string, text: string, type: "adjustment" | "structural"): Revision {
    const order = this.state.orders.find((o) => o.id === orderId);
    const brief = this.state.briefs.find((b) => b.orderId === orderId);

    if (type === "adjustment") {
      const rev: Revision = {
        id: uid("rev"),
        orderId,
        requestText: text,
        type: "adjustment",
        agentResponseText: `Applied: ${text.slice(0, 80)}${text.length > 80 ? "…" : ""}. Updated the selected direction and re-ran QA — check passed.`,
        status: "auto_applied",
        pushbackRound: 0,
        createdAt: new Date().toISOString(),
        resolvedAt: new Date().toISOString(),
      };
      this.state.revisions.push(rev);
      this.emit();
      return rev;
    }

    // structural — Creative Director Agent
    // Check if this is a repeat request on the same topic
    const prevStructural = this.state.revisions.filter(
      (r) => r.orderId === orderId && r.type === "structural",
    );
    const isFirstStructural = prevStructural.length === 0;
    const adj = brief?.desiredAdjectives.join(", ") || "confident and considered";

    if (isFirstStructural) {
      // First structural request — CD pushes back, doesn't use a credit yet
      const rev: Revision = {
        id: uid("rev"),
        orderId,
        requestText: text,
        type: "structural",
        agentResponseText: cdPushback(text, adj),
        status: "pushback_sent",
        pushbackRound: 1,
        createdAt: new Date().toISOString(),
      };
      this.state.revisions.push(rev);
      if (order) order.status = "revision";
      this.emit();
      return rev;
    }

    // Repeat structural request — use 1 credit and auto-apply
    if (order && order.revisionCredits > 0) {
      order.revisionCredits -= 1;
    }
    const rev: Revision = {
      id: uid("rev"),
      orderId,
      requestText: text,
      type: "structural",
      agentResponseText: `Applied. Trade-off noted: this pulls the identity slightly away from the "${adj}" direction we built in the discovery call, so some downstream materials may feel a touch less aligned. ${order && order.revisionCredits > 0 ? `${order.revisionCredits} credits remaining.` : "No credits remaining — upgrade to get more."}`,
      status: "auto_applied",
      pushbackRound: 2,
      createdAt: new Date().toISOString(),
      resolvedAt: new Date().toISOString(),
    };
    this.state.revisions.push(rev);
    if (order && order.status === "revision") order.status = "awaiting_client_review";
    this.emit();
    return rev;
  }

  /** Client persists after a CD pushback → auto-apply with trade-off. */
  persistRevision(orderId: string, revisionId: string) {
    const rev = this.state.revisions.find((r) => r.id === revisionId);
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!rev || rev.type !== "structural") return;
    const brief = this.state.briefs.find((b) => b.orderId === orderId);
    const adj = brief?.desiredAdjectives.join(", ") || "confident and considered";
    rev.status = "auto_applied";
    rev.pushbackRound = 2;
    rev.resolvedAt = new Date().toISOString();
    rev.agentResponseText = `Applied with a documented trade-off: this shifts the identity away from the “${adj}” core from your discovery call. It's your brand — but worth knowing the strategic cost so future materials stay coherent.`;
    if (order && order.status === "revision") order.status = "awaiting_client_review";
    this.emit();
  }

  /* ---------- deliverables ---------- */

  getDeliverables(orderId: string): Deliverable[] {
    return this.state.deliverables.filter((d) => d.orderId === orderId);
  }

  /* ---------- admin / qa ---------- */

  getQAReviews(orderId?: string): QAReview[] {
    return orderId
      ? this.state.qaReviews.filter((q) => q.orderId === orderId)
      : [...this.state.qaReviews].sort((a, b) => (a.reviewedAt < b.reviewedAt ? 1 : -1));
  }

  getBrief(orderId: string): Brief | undefined {
    return this.state.briefs.find((b) => b.orderId === orderId);
  }

  /* ---------- demo helpers ---------- */

  resetAll() {
    this.state = emptyState();
    this.emit();
  }
}

function cdPushback(request: string, adj: string): string {
  const short = request.slice(0, 60) + (request.length > 60 ? "…" : "");
  return [
    `I hear what you're after with “${short}” — let me make sure I've got the intent right before we touch the strategy.`,
    ``,
    `Here's the principle at stake: in your discovery call you told us the brand needed to feel ${adj}. The current direction was built specifically to protect that — this change pulls the identity in the opposite direction, which would weaken the positioning we documented.`,
    ``,
    `Concretely, what the brand loses: the strategic coherence between your visual system and the audience promise. Competitors already occupy the space this move opens up, so you'd be trading a defensible position for a crowded one.`,
    ``,
    `If the underlying intent is what I think it is, here's an alternative that serves it without breaking the spine of the brand — a tonal shift inside the existing palette and wordmark, keeping the ${adj} core intact. Want me to apply that instead?`,
  ].join("\n");
}

// Singleton
let _store: Store | null = null;
export function getStore(): Store {
  if (!_store) _store = new Store();
  return _store;
}

// NOTE: hydration happens lazily inside the useStore() hook's effect
// (see lib/mock/use-store.ts). We deliberately do NOT hydrate eagerly at
// module load time — doing so loads localStorage before React's first
// client render, which makes the client snapshot diverge from the empty
// SSR snapshot and throws a hydration exception on store-backed pages.
