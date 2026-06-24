import { NextResponse } from "next/server";
import { PIPELINE_STAGES } from "@/lib/mock/pipeline";

/**
 * GET /api/pipeline
 * ------------------------------------------------------------------
 * Production: would proxy Inngest step-level observability for the
 * client portal progress tracker.
 *
 * MVP: returns the documented stage order so the portal can render
 * the animated progress sequence without coupling to internals.
 */
export async function GET() {
  return NextResponse.json({
    stages: PIPELINE_STAGES.map((s) => ({
      agent: s.agentName,
      label: s.label,
      demoMs: s.durationMs,
      preview: s.preview,
    })),
    note: "Mock. Production reads Inngest run state.",
  });
}

export const runtime = "nodejs";
