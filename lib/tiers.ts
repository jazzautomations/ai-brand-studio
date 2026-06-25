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
  revisionCredits: number;
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
    blurb: "A solid brand foundation. Strategy, logo, and guidelines — ready to use.",
    callMinutes: 15,
    directionCount: 1,
    revisionRounds: 1,
    revisionCredits: 1,
    guidePages: 12,
    mockups: 0,
    deliveryLabel: "5 business days",
    features: [
      "15-min discovery call with brand strategist",
      "1 visual direction with 4 logo versions",
      "12-page brand guide PDF",
      "Design tokens (W3C DTCG 2025.10)",
      "Market research document",
      "1 revision credit",
      "Unlimited free adjustments",
    ],
  },
  {
    id: "signature",
    name: "Signature",
    priceCents: 59900,
    priceLabel: "$599",
    blurb: "The complete brand system. Most founders pick this.",
    recommended: true,
    callMinutes: 25,
    directionCount: 3,
    revisionRounds: 3,
    revisionCredits: 3,
    guidePages: 30,
    mockups: 6,
    deliveryLabel: "5 business days",
    features: [
      "25-min discovery call with brand strategist",
      "3 visual directions with rationale",
      "30-page brand guide PDF",
      "6 context mockups",
      "Full Brand Context Package (tokens + DESIGN.md)",
      "Voice & tone guide",
      "AI skills for Claude, GPT, and Gemini",
      "5 ready-to-use prompt templates",
      "3 revision credits",
      "Unlimited free adjustments",
    ],
  },
  {
    id: "authority",
    name: "Authority",
    priceCents: 99700,
    priceLabel: "$997",
    blurb: "Priority delivery. Extended messaging framework. For brands that move fast.",
    callMinutes: 35,
    directionCount: 3,
    revisionRounds: 5,
    revisionCredits: 7,
    guidePages: 30,
    mockups: 10,
    deliveryLabel: "24 hours — priority",
    features: [
      "35-min discovery call with brand strategist",
      "Everything in Signature, plus:",
      "Extended messaging framework",
      "10 context mockups",
      "Priority delivery (24 hours)",
      "7 revision credits",
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
