export type Tier = "starter" | "signature" | "authority";

export interface TierConfig {
  id: Tier;
  name: string;
  priceCents: number;
  priceLabel: string;
  blurb: string;
  recommended?: boolean;
  callMinutes: number;
  directionCount: number;
  revisionRounds: number;
  guidePages: number;
  mockups: number;
  deliveryLabel: string;
  features: string[];
}

export const TIERS: TierConfig[] = [
  {
    id: "starter",
    name: "Starter",
    priceCents: 29900,
    priceLabel: "$299",
    blurb: "Everything to look credible — fast.",
    callMinutes: 15,
    directionCount: 1,
    revisionRounds: 1,
    guidePages: 12,
    mockups: 0,
    deliveryLabel: "5 business days",
    features: [
      "In-app AI voice call (15 min)",
      "Discovery document",
      "1 visual direction",
      "Logo — 4 versions (full / mono / reversed / compact)",
      "12-page brand guide PDF",
      "Brand Context Package Lite (tokens + DESIGN.md)",
      "1 structural revision round",
      "Unlimited free adjustments",
    ],
  },
  {
    id: "signature",
    name: "Signature",
    priceCents: 59900,
    priceLabel: "$599",
    blurb: "The complete identity. Most founders pick this.",
    recommended: true,
    callMinutes: 25,
    directionCount: 3,
    revisionRounds: 2,
    guidePages: 30,
    mockups: 6,
    deliveryLabel: "5 business days",
    features: [
      "In-app AI voice call (25 min)",
      "Discovery document",
      "3 visual directions with rationale",
      "Logo — full version set",
      "30-page brand guide PDF",
      "6 context mockups",
      "Full Brand Context Package (tokens + DESIGN.md + /skills + /prompts)",
      "Voice & tone guide",
      "2 structural revision rounds",
      "Unlimited free adjustments",
    ],
  },
  {
    id: "authority",
    name: "Authority",
    priceCents: 99700,
    priceLabel: "$997",
    blurb: "For founders who need naming + extended messaging.",
    callMinutes: 35,
    directionCount: 3,
    revisionRounds: 3,
    guidePages: 30,
    mockups: 10,
    deliveryLabel: "24 hours — priority",
    features: [
      "In-app AI voice call (35 min)",
      "Everything in Signature, plus:",
      "Naming exploration",
      "Extended messaging framework",
      "10 context mockups",
      "Priority delivery (24h)",
      "3 structural revision rounds",
      "Unlimited free adjustments",
    ],
  },
];

export const UPSELLS = [
  { id: "extra-revision", label: "Extra structural revision round", price: 49 },
  { id: "extra-mockups", label: "Additional mockup set (3 pieces)", price: 29 },
  { id: "naming-addon", label: "Naming exploration add-on", price: 89 },
  { id: "rush", label: "Rush upgrade (24h delivery)", price: 99 },
];
