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

function stripTrailingPunctuation(s: string): string {
  return s.replace(/[.!?]+\s*$/, "").trim();
}

export function interpolate(line: string, a: CollectedAnswers): string {
  return line
    .replace(/\{\{business\}\}/g, stripTrailingPunctuation(a.business || "your business"))
    .replace(/\{\{audience\}\}/g, stripTrailingPunctuation(a.audience || "your ideal customer"))
    .replace(/\{\{competitor\}\}/g, stripTrailingPunctuation((a.competitors || "the competition").split(",")[0].trim()))
    .replace(/\{\{adjectives\}\}/g, stripTrailingPunctuation(a.adjectives || "confident and considered"))
    .replace(/\{\{exclusions\}\}/g, stripTrailingPunctuation((a.exclusions || "generic").split(",")[0].trim()));
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
 * Rich competitor research profiles by industry — each one reads like
 * a real competitive intelligence brief from a brand strategist.
 */
const COMPETITOR_PROFILES: Record<string, CompetitorResearch[]> = {
  coffee: [
    { name: "Stumptown Coffee Roasters", positioning: "Portland-founded specialty pioneer. Positions on craft, origin transparency, and barista expertise. Sells direct-to-consumer and wholesale.", visualStyle: "Hand-drawn illustration, vintage Americana palette, kraft textures, condensed display type. Feels artisanal but slightly nostalgic.", priceTier: "Premium ($18-22/lb)", note: "Owned by Peet's since 2015 — lost indie credibility with some purists. Strong brand equity but aging visual system. Opportunity: own the 'modern craft' space they're leaving behind." },
    { name: "Blue Bottle Coffee", positioning: "Japanese-influenced minimalism meets third-wave craft. Premium retail and subscription model. Known for 48-hour freshness promise.", visualStyle: "Blue monogram on white. Extreme minimalism — lots of whitespace, thin serif type, muted photography. Every touchpoint screams considered restraint.", priceTier: "Luxury ($19-26/lb)", note: "Nestlé-owned since 2017 — similar corporate acquisition fatigue. Visual system is beautiful but cold. Warmth and personality are the gap." },
    { name: "Trade Coffee", positioning: "Tech-forward discovery platform. Algorithm-matched subscriptions connecting consumers to 450+ roasters. Positioned as the 'Spotify of coffee'.", visualStyle: "App-first design, bright accent colors, product photography focused on packaging. Modern DTC aesthetic — clean but generic.", priceTier: "Mid-High ($15-20/lb)", note: "Strong UX, weak brand personality. No emotional resonance — feels like a logistics company. The 'curated experience' promise lacks soul." },
  ],
  saas: [
    { name: "Notion", positioning: "All-in-one workspace for docs, wikis, and project management. Developer-to-executive appeal. Community-driven growth.", visualStyle: "Black and white minimalism, geometric sans-serif, illustration-heavy docs. Feels like a design tool pretending to be productivity software.", priceTier: "Freemium ($8-15/user/mo)", note: "Massive brand equity but increasingly cluttered product. New users report 'template paralysis'. Opportunity: own simplicity and focus." },
    { name: "Coda", positioning: 'Documents that grow with your team. "The doc that grows with you" — emphasis on customization and power-user flexibility.', visualStyle: "Purple gradient accents, clean illustration, slightly more playful than Notion. Developer-forward but approachable.", priceTier: "Freemium ($10-30/user/mo)", note: "Strong product, weak brand recall. Most users can't describe Coda's personality in three words. The power-user positioning alienates mainstream buyers." },
    { name: "Monday.com", positioning: "Work management OS. Visual, colorful, enterprise-friendly. Heavy on TV advertising and brand awareness.", visualStyle: "Bright color system (green, yellow, pink), rounded UI, friendly illustration. Deliberately 'fun enterprise' — the anti-Salesforce.", priceTier: "Mid ($8-16/seat/mo)", note: "Strong awareness but generic positioning — could be any project management tool. Visual identity is loud but not distinctive. Confuses 'colorful' with 'branded'." },
  ],
  fitness: [
    { name: "Equinox", positioning: "Ultra-premium fitness and lifestyle club. Positions on exclusivity, performance, and luxury. 'It's not fitness. It's life.'", visualStyle: "Black and white photography, editorial layout, sans-serif type. Every ad looks like a fashion campaign. Aspirational to the point of intimidation.", priceTier: "Luxury ($260-350/mo)", note: "Strong brand but completely inaccessible to 95% of the market. Creates aspiration but not belonging. The 'elite' positioning limits TAM." },
    { name: "F45 Training", positioning: "45-minute functional group fitness. Franchise model, community-driven, high-energy. 'Team training, life changing.'", visualStyle: "High-contrast black and yellow, aggressive typography, action photography. Feels like a sports brand — intense and motivational.", priceTier: "Mid-Premium ($150-200/mo)", note: "High energy but zero nuance. The 'go hard' messaging alienates beginners and older demographics. Visual system is loud and forgettable." },
    { name: "Peloton", positioning: "Connected fitness platform. Premium equipment + streaming classes. Community and leaderboard-driven. Post-pandemic identity crisis.", visualStyle: "Dark mode aesthetic, neon accents, tech-forward UI. Feels more like a software product than a fitness brand. Slick but impersonal.", priceTier: "Premium ($44/mo + equipment)", note: "Massive installed base but brand is associated with pandemic-era excess. Struggling to redefine beyond the bike. The 'tech company' identity feels cold." },
  ],
};

const GENERIC_PROFILES: CompetitorResearch[] = [
  { name: "Industry Leader A", positioning: "Established market leader with broad appeal. Conservative visual identity, enterprise-focused messaging. Strong distribution but aging brand.", visualStyle: "Corporate blue, serif headlines, stock photography. Clean but forgettable — the default 'professional' template.", priceTier: "Premium", note: "Dominant market share but vulnerable to challenger brands with stronger emotional resonance. Visual system hasn't been updated in 5+ years." },
  { name: "Digital-First Challenger", positioning: "DTC-native upstart. App-first experience, aggressive growth, social-media-driven acquisition. Strong product, emerging brand.", visualStyle: "Bright gradients, rounded sans-serif, illustration-heavy. Modern startup aesthetic — trendy but already showing signs of visual fatigue.", priceTier: "Mid", note: "Fast-growing but brand personality is 'generic Silicon Valley'. No distinctive voice or visual territory. Scaling faster than branding can keep up." },
  { name: "Heritage Incumbent", positioning: "Traditional player with decades of trust. Risk-averse branding, mass-market positioning. Losing relevance with younger demographics.", visualStyle: "Warm but dated palette, serif typography, lifestyle photography. Feels like a 2015 rebrand that never got refreshed.", priceTier: "Mid-Premium", note: "Trust is the moat, but trust without relevance erodes. The 'safe' positioning is becoming a liability as market tastes shift toward authenticity and specificity." },
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
  if (!competitors.length) return GENERIC_PROFILES;
  // Try to match by industry keywords, fallback to generic
  const allText = competitors.join(" ").toLowerCase();
  if (/coffee|brew|cafe|beverage|tea|food/.test(allText)) return COMPETITOR_PROFILES.coffee;
  if (/software|app|tool|saas|automation|platform|notion|coda/.test(allText)) return COMPETITOR_PROFILES.saas;
  if (/fitness|gym|training|strength|pt|health|equinox|peloton/.test(allText)) return COMPETITOR_PROFILES.fitness;
  // For named competitors, create detailed profiles
  return competitors.slice(0, 3).map((name, i) => ({
    ...GENERIC_PROFILES[i % GENERIC_PROFILES.length],
    name,
  }));
}

const NAME_STOP_WORDS = new Set([
  "a", "an", "the", "for", "to", "with", "helping", "that", "who", "which",
  "and", "of", "in", "on", "at", "from", "by",
]);
const NAME_LEADING_VERBS = /^(we|i|our|my)\s+(are|make|build|run|do|help|offer|provide|create|sell)\b\s*/i;

function capitalizeWord(w: string): string {
  if (w === w.toUpperCase()) return w; // keep acronyms like PT, AI as-is
  return w
    .split("-")
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1).toLowerCase() : p))
    .join("-");
}

function deriveBusinessName(business: string): string {
  const trimmed = business.trim();
  if (!trimmed) return "Your Brand";

  // Prefer an explicit proper noun if the answer names one directly.
  const words = trimmed.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const cap = words.find((w) => /^[A-Z]/.test(w) && !["We", "I", "Our", "My"].includes(w));
  if (cap && cap.length > 2) return cap;

  // Otherwise, the answer is usually a description ("We build automation
  // tools for..."). Strip the leading pronoun+verb and take the first
  // meaningful noun phrase instead of chopping the raw sentence.
  const firstSentence = trimmed.split(/[.!?]/)[0];
  const rest = firstSentence.replace(NAME_LEADING_VERBS, "");
  const chunk: string[] = [];
  for (const raw of rest.split(/\s+/)) {
    const clean = raw.replace(/[^a-zA-Z0-9-]/g, "");
    if (!clean) continue;
    if (NAME_STOP_WORDS.has(clean.toLowerCase())) {
      if (chunk.length) break;
      continue;
    }
    chunk.push(clean);
    if (chunk.length >= 3) break;
  }
  if (chunk.length) return chunk.map(capitalizeWord).join(" ");
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
