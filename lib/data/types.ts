import type { Tier } from "@/lib/tiers";

/**
 * Shared domain types — mirror the Postgres schema in PRD §4.
 * The mock store implements the same shape so swapping in Supabase
 * later is a drop-in replacement at the data-access layer.
 */

export type OrderStatus =
  | "pending_payment"
  | "pending_call"
  | "call_in_progress"
  | "call_completed"
  | "in_progress"
  | "qa_review"
  | "awaiting_client_review"
  | "revision"
  | "final_compile"
  | "delivered";

export interface Client {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  country?: string;
  locale?: string;
  createdAt: string;
}

export interface VoiceTurn {
  role: "agent" | "client";
  text: string;
  ts: number;
  researchNote?: string;
}

export interface VoiceSession {
  id: string;
  orderId: string;
  sessionType: string;
  status: "available" | "in_progress" | "completed" | "failed" | "no_show";
  durationSeconds?: number;
  transcript: VoiceTurn[];
  competitorResearch: CompetitorResearch[];
  generatedBrief?: Brief;
  startedAt?: string;
  completedAt?: string;
}

export interface CompetitorResearch {
  name: string;
  positioning: string;
  visualStyle: string;
  priceTier: string;
  note: string;
}

export interface Brief {
  id?: string;
  orderId?: string;
  voiceSessionId?: string;
  createdAt?: string;
  businessName: string;
  industry: string;
  whatTheySell: string;
  targetAudience: string;
  competitors: string[];
  existingAssetsUrls: string[];
  desiredAdjectives: string[];
  explicitExclusions: string;
  primaryMarket: string;
  languagePreference: string;
  brandAdmirationReference: string;
  confidenceScores: Record<string, number>;
}

export interface AgentRun {
  id: string;
  orderId: string;
  agentName:
    | "voice_intake"
    | "research"
    | "strategy"
    | "verbal"
    | "visual"
    | "qa_review"
    | "creative_director"
    | "auto_apply"
    | "compiler"
    | "packager";
  status: "queued" | "running" | "done" | "failed";
  input?: Record<string, unknown>;
  output?: { note?: string } & Record<string, unknown>;
  errorMessage?: string;
  retryCount?: number;
  qaFlags?: string[];
  startedAt?: string;
  completedAt?: string;
}

export interface ColorToken {
  name: string;
  hex: string;
  rgb: string;
  usage: string;
}

export interface Direction {
  id: string;
  orderId: string;
  directionNumber: 1 | 2 | 3;
  rationaleText: string;
  archetype: string;
  colorTokens: ColorToken[];
  typographyNotes: string;
  svgMark: string; // inline SVG string for the icon
  wordmark: string; // text label derived from business name
  qaFlags: string[];
  reviewStatus: "pending_qa" | "qa_approved" | "qa_rejected" | "regenerating";
}

export interface SelectedDirection {
  orderId: string;
  directionId: string;
  selectedAt: string;
}

export interface Revision {
  id: string;
  orderId: string;
  requestText: string;
  type: "adjustment" | "structural";
  agentResponseText?: string;
  status: "auto_applied" | "pushback_sent" | "resolved";
  pushbackRound: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface QAReview {
  id: string;
  orderId: string;
  directionId?: string;
  reviewType: "visual" | "verbal" | "strategy" | "package";
  passed: boolean;
  flags: string[];
  autoFixes: string[];
  regenerations: number;
  reviewedAt: string;
}

export interface Order {
  id: string;
  clientId: string;
  clientEmail?: string;
  clientName?: string;
  tier: Tier;
  pricePaidCents: number;
  currencyDisplay: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  status: OrderStatus;
  deliverySlaHours: number;
  selectedDirectionId?: string;
  revisionsRemaining?: number;
  createdAt: string;
  deliveredAt?: string;
}

export interface Deliverable {
  id: string;
  orderId: string;
  type: "brand_guide_pdf" | "context_package_zip" | "market_research_doc" | "strategy_doc";
  fileUrl: string;
  version: number;
  createdAt: string;
}
