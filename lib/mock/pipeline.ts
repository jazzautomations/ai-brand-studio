import type { AgentRun, OrderStatus } from "@/lib/data/types";

/**
 * Mock agent pipeline — simulates the Inngest durable execution flow.
 * Production: each stage is an Inngest function emitting events
 * (studio/research.completed → studio/strategy.completed → …).
 * Here we advance status + log agent_runs on a demo-fast timer so the
 * portal shows a believable live progression with zero infrastructure.
 */

export interface PipelineStage {
  status: OrderStatus;
  agentName: AgentRun["agentName"];
  label: string;
  preview: string;
  /** Demo duration in ms (production = minutes, scaled by tier). */
  durationMs: number;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    status: "in_progress",
    agentName: "research",
    label: "Research Agent",
    preview: "Expanding competitor research, mapping the market gap.",
    durationMs: 7000,
  },
  {
    status: "in_progress",
    agentName: "strategy",
    label: "Strategy Agent",
    preview: "Applying Kapferer, Aaker, archetypes, Golden Why.",
    durationMs: 7000,
  },
  {
    status: "in_progress",
    agentName: "verbal",
    label: "Verbal Identity Agent",
    preview: "Voice attributes, messaging pillars, tagline candidates.",
    durationMs: 6000,
  },
  {
    status: "in_progress",
    agentName: "visual",
    label: "Visual Agent",
    preview: "Generating vector logo directions via Recraft.",
    durationMs: 8000,
  },
  {
    status: "qa_review",
    agentName: "qa_review",
    label: "QA Review Agent",
    preview: "4-layer validation — visual, strategy, verbal, completeness.",
    durationMs: 6000,
  },
];

export const FINALIZE_STAGES: PipelineStage[] = [
  {
    status: "final_compile",
    agentName: "compiler",
    label: "Compiler Agent",
    preview: "Assembling the brand guide PDF (component tree).",
    durationMs: 6000,
  },
  {
    status: "final_compile",
    agentName: "packager",
    label: "Packager Agent",
    preview: "Building DTCG tokens + DESIGN.md + /skills + /prompts zip.",
    durationMs: 6000,
  },
];

/** Human-readable labels for the portal progress tracker (PRD §6.3). */
export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Complete checkout",
  pending_call: "Start your brand call",
  call_in_progress: "Your brand call is in progress",
  call_completed: "We received your call — your brand is being built",
  in_progress: "Research → Strategy → Visual",
  qa_review: "Quality check in progress",
  awaiting_client_review: "Your directions are ready",
  revision: "Working on your revision",
  final_compile: "Compiling your final delivery",
  delivered: "Your brand is ready",
};

export const PIPELINE_ORDER: OrderStatus[] = [
  "pending_call",
  "call_in_progress",
  "call_completed",
  "in_progress",
  "qa_review",
  "awaiting_client_review",
  "final_compile",
  "delivered",
];
