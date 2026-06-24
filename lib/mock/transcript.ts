import type { Brief, CompetitorResearch, VoiceTurn } from "@/lib/data/types";

/**
 * Mock Voice Intake Agent — a scripted brand discovery interview.
 * Production replaces this with WebRTC + ElevenLabs + Deepgram + Claude
 * (streaming), with real-time web search during the call. Here we
 * simulate the conversation so the demo flow is fully clickable.
 *
 * Agent lines support {{token}} interpolation filled from prior answers:
 *   {{business}} {{audience}} {{competitor}} {{adjectives}} {{exclusions}}
 */

export interface ScriptPrompt {
  label: string;
  field: string;
  placeholder: string;
  suggestions: string[];
}

export interface ScriptStep {
  id: string;
  agent: string[];
  researchNote?: string;
  prompt?: ScriptPrompt;
}

export const DISCOVERY_SCRIPT: ScriptStep[] = [
  {
    id: "intro",
    agent: [
      "Hey — really glad you're here. I'm your AI brand strategist, and for the next few minutes I'm going to learn everything I need to build your brand from the ground up.",
      "There are no wrong answers. Talk to me like you'd talk to someone who genuinely wants to get this right. Let's start simple — tell me about your business. What do you do, and who do you do it for?",
    ],
    prompt: {
      label: "Your business",
      field: "business",
      placeholder: "e.g. We build accounting software for indie freelancers...",
      suggestions: [
        "We make cold-brew coffee for offices — premium, delivered weekly.",
        "I run a PT studio helping busy professionals rebuild their strength.",
        "We build automation tools for small marketing teams.",
      ],
    },
  },
  {
    id: "audience",
    agent: [
      "Got it — {{business}}. That's a clear picture.",
      "Now the audience. Not everyone — the one person you'd clone if you could. When your offering lands perfectly, who is on the other side of it?",
    ],
    prompt: {
      label: "Your ideal customer",
      field: "audience",
      placeholder: "The specific person, not 'everyone'...",
      suggestions: [
        "A 30-something founder who's outgrown spreadsheets but hates bloated tools.",
        "An office manager tired of bad coffee and vending machines.",
        "A busy dad who wants to feel strong again but has 45 minutes, three times a week.",
      ],
    },
  },
  {
    id: "competitors",
    agent: [
      "Perfect — that's the person we're designing for.",
      "Who are you up against? Name a couple of competitors so I can take a look at how they show up.",
    ],
    researchNote: "Researching the competitive landscape…",
    prompt: {
      label: "Your competitors",
      field: "competitors",
      placeholder: "Name 2-3 competitors...",
      suggestions: ["Notion, Coda", "Stumptown, Blue Bottle", "Equinox, F45"],
    },
  },
  {
    id: "differentiation",
    agent: [
      "Interesting — I'm looking at {{competitor}} now. They lean hard on polish and breadth. Do you feel like that's what your market actually wants, or are you going somewhere different?",
      "What makes you different from them — even if it's hard to put into words?",
    ],
    prompt: {
      label: "Your difference",
      field: "difference",
      placeholder: "What sets you apart...",
      suggestions: [
        "We're simpler and faster — we do one thing exceptionally well.",
        "We're warmer and more human — not a corporate machine.",
        "We're built by people who actually live the problem.",
      ],
    },
  },
  {
    id: "adjectives",
    agent: [
      "Love that. That difference is the spine of the whole brand.",
      "Quick one — describe your brand in three words. The first three that come to mind, no overthinking.",
    ],
    prompt: {
      label: "Three words",
      field: "adjectives",
      placeholder: "Three words that capture the feeling...",
      suggestions: ["Bold, warm, sharp", "Calm, premium, human", "Precise, energetic, trusted"],
    },
  },
  {
    id: "exclusions",
    agent: [
      "{{adjectives}} — that's a strong direction.",
      "Flip it: what should this brand never feel like? What's the opposite of what you want?",
    ],
    prompt: {
      label: "What to avoid",
      field: "exclusions",
      placeholder: "The anti-vibe...",
      suggestions: [
        "Corporate, cold, beige. Never generic.",
        "Cheap, frantic, loud. Never desperate.",
        "Clunky, outdated, overcomplicated. Never a chore to use.",
      ],
    },
  },
  {
    id: "admiration",
    agent: [
      "That's as useful as the adjectives — it draws the fence.",
      "Last one before I synthesize: a brand in any industry — not necessarily yours — that you admire aesthetically? And what about it?",
    ],
    prompt: {
      label: "A brand you admire",
      field: "admiration",
      placeholder: "A brand + why it resonates...",
      suggestions: [
        "Stripe — confident, clean, the type is gorgeous.",
        "Aesop — calm, editorial, everything feels considered.",
        "Liquid Death — bold and fun, completely owns its voice.",
      ],
    },
  },
  {
    id: "market",
    agent: [
      "Great reference — I can see how that maps to what you want.",
      "Where are your customers, geographically? Helps me frame the market.",
    ],
    prompt: {
      label: "Your market",
      field: "market",
      placeholder: "City, country, or 'global'...",
      suggestions: ["United States", "Brazil", "Global, English-speaking"],
    },
  },
  {
    id: "readback",
    agent: [
      "Here's what I'm taking forward: {{business}} is for {{audience}}. In a market where {{competitor}} goes broad and polished, you're carving out something {{adjectives}} — and never {{exclusions}}.",
      "I've got everything I need. I'll go build your brand now — research, strategy, visual directions, the works. Hang tight in your portal, you'll see it come together.",
    ],
  },
];

export interface CollectedAnswers {
  business?: string;
  audience?: string;
  competitors?: string;
  difference?: string;
  adjectives?: string;
  exclusions?: string;
  admiration?: string;
  market?: string;
}

export function interpolate(line: string, a: CollectedAnswers): string {
  return line
    .replace(/\{\{business\}\}/g, a.business || "your business")
    .replace(/\{\{audience\}\}/g, a.audience || "your ideal customer")
    .replace(/\{\{competitor\}\}/g, (a.competitors || "the competition").split(",")[0].trim())
    .replace(/\{\{adjectives\}\}/g, a.adjectives || "confident and considered")
    .replace(/\{\{exclusions\}\}/g, (a.exclusions || "generic").split(",")[0].trim());
}

const SAMPLE_COMPETITOR_RESEARCH: CompetitorResearch[] = [
  {
    name: "Competitor A",
    positioning: "Polished, broad, all-in-one — appeals to power users.",
    visualStyle: "Clean corporate blue, lots of whitespace, sans-serif.",
    priceTier: "Premium",
    note: "Strong on breadth; weak on warmth and simplicity.",
  },
  {
    name: "Competitor B",
    positioning: "Friendly, community-led, lifestyle branding.",
    visualStyle: "Warm photography, rounded type, muted earth tones.",
    priceTier: "Mid",
    note: "Strong emotional pull; less credible on capability.",
  },
];

/**
 * Mock Brief Extraction sub-agent — turns the conversation into a
 * structured brief with confidence scores. Production: Claude processes
 * the transcript and scores every field; low-confidence fields get probed.
 */
export function buildBriefFromTranscript(
  transcript: VoiceTurn[],
  answers: CollectedAnswers,
): Brief {
  const business = (answers.business || "").trim();
  const businessName = deriveBusinessName(business);
  const competitors = (answers.competitors || "Competitor A, Competitor B")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  const adjectives = (answers.adjectives || "confident, warm, sharp")
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  return {
    businessName,
    industry: inferIndustry(business),
    whatTheySell: business || "Their core offering, delivered with care.",
    targetAudience: answers.audience || "A specific, underserved segment.",
    competitors,
    existingAssetsUrls: [],
    desiredAdjectives: adjectives.length ? adjectives : ["confident", "warm", "sharp"],
    explicitExclusions: answers.exclusions || "Generic, cold, forgettable.",
    primaryMarket: answers.market || "Global",
    languagePreference: "en",
    brandAdmirationReference: answers.admiration || "A considered, confident brand.",
    confidenceScores: {
      businessName: business ? 0.92 : 0.55,
      industry: 0.8,
      targetAudience: answers.audience ? 0.9 : 0.5,
      competitors: 0.85,
      desiredAdjectives: adjectives.length >= 3 ? 0.88 : 0.6,
      explicitExclusions: answers.exclusions ? 0.86 : 0.5,
      primaryMarket: 0.9,
    },
  };
}

export function competitorResearchFor(competitors: string[]): CompetitorResearch[] {
  if (!competitors.length) return SAMPLE_COMPETITOR_RESEARCH;
  return competitors.slice(0, 3).map((name, i) => ({
    ...SAMPLE_COMPETITOR_RESEARCH[i % SAMPLE_COMPETITOR_RESEARCH.length],
    name,
  }));
}

function deriveBusinessName(business: string): string {
  const trimmed = business.trim();
  if (!trimmed) return "Your Brand";
  // grab the first capitalized-looking noun chunk, else first 2 words
  const words = trimmed.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const cap = words.find((w) => /^[A-Z]/.test(w));
  if (cap && cap.length > 2) return cap;
  return words.slice(0, 2).join(" ") || "Your Brand";
}

function inferIndustry(business: string): string {
  const b = business.toLowerCase();
  if (/coffee|brew|cafe|beverage/.test(b)) return "Specialty food & beverage";
  if (/software|app|tool|saas|automation|platform|tech/.test(b)) return "SaaS / software";
  if (/fitness|gym|training|strength|pt|health/.test(b)) return "Health & fitness";
  if (/account|finance|tax|book/.test(b)) return "Financial services";
  return "Professional services";
}
