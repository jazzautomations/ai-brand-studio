import type { AgentRun, OrderStatus } from "@/lib/data/types";

export interface PipelineStage {
  status: OrderStatus;
  agentName: AgentRun["agentName"];
  label: string;
  preview: string;
  durationMs: number;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { status: "in_progress", agentName: "research", label: "Research Agent", preview: "Expanding competitor research, mapping the market gap.", durationMs: 7000 },
  { status: "in_progress", agentName: "strategy", label: "Strategy Agent", preview: "Applying Kapferer, Aaker, archetypes, Golden Why.", durationMs: 7000 },
  { status: "in_progress", agentName: "verbal", label: "Verbal Identity Agent", preview: "Voice attributes, messaging pillars, tagline candidates.", durationMs: 6000 },
  { status: "in_progress", agentName: "visual", label: "Visual Agent", preview: "Generating vector logo directions via Recraft.", durationMs: 8000 },
  { status: "qa_review", agentName: "qa_review", label: "QA Review Agent", preview: "4-layer validation — visual, strategy, verbal, completeness.", durationMs: 6000 },
];

export const FINALIZE_STAGES: PipelineStage[] = [
  { status: "final_compile", agentName: "compiler", label: "Compiler Agent", preview: "Assembling the brand guide PDF (component tree).", durationMs: 6000 },
  { status: "final_compile", agentName: "packager", label: "Packager Agent", preview: "Building DTCG tokens + DESIGN.md + /skills + /prompts zip.", durationMs: 6000 },
];
