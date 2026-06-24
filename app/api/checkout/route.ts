import { NextResponse } from "next/server";
import { TIERS, type Tier } from "@/lib/tiers";

/**
 * POST /api/checkout
 * ------------------------------------------------------------------
 * Production: creates a Stripe Checkout Session for the selected tier
 * and returns the hosted URL for client redirection.
 *
 * MVP: returns a mock "session" so the client flow mirrors the real
 * one. Swap body with:
 *   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
 *   const session = await stripe.checkout.sessions.create({ ... });
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const tier: Tier = body.tier;
  const config = TIERS.find((t) => t.id === tier);
  if (!config) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

  // Mock session — replace with real Stripe Checkout Session URL
  return NextResponse.json({
    mock: true,
    tier: config.id,
    amount: config.priceCents,
    currency: "usd",
    url: `/call?demo=1&tier=${config.id}`,
  });
}

export const runtime = "nodejs";
