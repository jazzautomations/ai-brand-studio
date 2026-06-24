import { NextResponse } from "next/server";

/**
 * POST /api/webhook/stripe
 * ------------------------------------------------------------------
 * Production: Stripe Checkout webhook. Verifies signature, creates
 * the order record (status: pending_call), sends magic-link email
 * via Resend, redirects client to /call.
 *
 * MVP: documented stub. The mock checkout in /checkout creates the
 * order directly client-side. When Stripe is wired in, replace this
 * body with signature verification + order creation + Resend email.
 */
export async function POST(req: Request) {
  const evt = await req.json().catch(() => null);
  // eslint-disable-next-line no-console
  console.log("[stripe-webhook] received (mock):", evt?.type ?? "unknown");
  return NextResponse.json({ received: true, mock: true });
}

export const runtime = "nodejs";
