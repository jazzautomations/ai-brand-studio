# AI Brand Studio — MVP (Phase 0 shell)

Autonomous AI brand studio. This repo is the **Phase 0 sellable shell** with all
external services **mocked**, so the full product flow is clickable end-to-end on
Vercel with zero API keys. The data layer is isolated so swapping in real
Supabase + Stripe + Inngest + ElevenLabs/Recraft is a matter of replacing one
module each — see [Swapping mocks for real services](#swapping-mocks-for-real-services).

> Studio name is a placeholder. Set `NEXT_PUBLIC_STUDIO_NAME` (defaults to `Forge`)
> before launch and replace it everywhere.

## What works in this MVP

- **Marketing site** — hero, problem, how-it-works, the-call, Brand Context Package, proof, pricing, FAQ (PRD §6.1)
- **Mock checkout** — tier selection → simulated Stripe Checkout → order created → magic-link style login (PRD §1.1, §6.2)
- **In-app voice call UI** — branded call screen, animated waveform, real-time transcript sidebar, "Researching competitor…" indicator, countdown, end-of-call read-back, brief auto-generated (PRD §5.0, §6.2)
- **Autonomous pipeline (simulated)** — Research → Strategy → Verbal → Visual → QA Review, advancing in real time (PRD §5.1–5.5)
- **Client portal** — progress tracker, direction review (3 inline-SVG directions × 4 logo versions), revisions (adjustment = auto-apply / structural = Creative Director Agent pushback), delivery (PRD §6.3)
- **Brand Context Package** — real W3C DTCG 2025.10 `tokens.tokens.json` + `DESIGN.md` + `/skills` + `/prompts`, zipped client-side and downloadable (PRD §5.9)
- **Admin dashboard** — overview, orders, QA audit trail, anomalies/monitoring (PRD §6.4)

## Tech stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · lucide-react · JSZip.
All state lives in `localStorage` via an isolated store (`lib/mock/store.ts`),
so the demo survives navigation and needs no backend.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

No environment variables are required for the mock build. See `.env.example`
for the keys you'll set when wiring real services.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel — it auto-detects Next.js, zero config.
3. (Optional) set `NEXT_PUBLIC_STUDIO_NAME` in Vercel env vars.
4. Deploy. The mock build works on the free tier with no integrations.

## Demo flow (click-through)

1. Land on `/` → pick a tier → `/checkout` → "Pay" (simulated) → login.
2. `/call?order=…` → run the voice discovery (click suggestions or type) → confirm read-back.
3. `/portal/progress` → watch Research → Strategy → Verbal → Visual → QA advance live.
4. `/portal/directions` → review 3 directions × 4 logo versions → select one.
5. `/portal/revisions` → try an adjustment (auto-applied) and a structural change (CD Agent pushback).
6. `/portal/delivery` → download the Brand Guide (HTML) + Brand Context Package (zip).
7. `/admin` → click **Seed demo data** to populate the dashboard; browse orders / QA logs / anomalies.

## Swapping mocks for real services

The mock implementations live in `lib/mock/` behind a clean interface. Replace each:

| Concern | Mock file | Real implementation |
|---|---|---|
| Database / auth | `lib/mock/store.ts` | Supabase client + RLS (schema in PRD §4) |
| Payments | `app/api/checkout/route.ts`, `app/api/webhook/stripe/route.ts` | Stripe Checkout + webhook → create order |
| Voice call | `lib/mock/transcript.ts`, `components/call/call-screen.tsx` | WebRTC (LiveKit/Daily) + ElevenLabs + Deepgram + Claude streaming |
| Agent pipeline | `lib/mock/pipeline.ts`, scheduling in `store.ts` | Inngest functions, one per agent (PRD §5) |
| Visual gen | `lib/mock/directions.ts` | Recraft V4.1 Pro Vector API (Claude writes the prompt) |
| Package | `lib/mock/package.ts` | Same logic, server-side + Style Dictionary v4 validation + Supabase Storage |
| Email | n/a (stub) | Resend transactional templates |

The domain types in `lib/data/types.ts` already mirror the Postgres schema, so the
data model won't change when you swap.

## Project structure

```
app/                  routes (marketing, checkout, login, call, portal/*, admin/*, api/*)
components/           ui primitives + marketing / portal / call / admin sections
lib/
  studio.ts           studio identity (NEXT_PUBLIC_STUDIO_NAME)
  tiers.ts            pricing + tier config (PRD §1.1)
  data/types.ts       domain types = Postgres schema (PRD §4)
  mock/               store, pipeline, directions, transcript, package, status, hooks
```

## Status

Phase 0 complete. Phases 1–6 (real voice, real agents, Recraft, revisions, compiler,
scale) are scaffolded by the mock architecture and documented in PRD §7.
