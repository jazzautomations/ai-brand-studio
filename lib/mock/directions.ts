import type { Brief, ColorToken, Direction } from "@/lib/data/types";
import type { Tier } from "@/lib/tiers";

/**
 * Mock Visual Agent — generates N visual directions as inline SVG strings.
 * In production this is replaced by the Recraft V4.1 Pro Vector API
 * (Claude writes the prompt, Recraft returns native SVGs, QA validates).
 * Here we synthesize clean geometric marks so the demo needs zero APIs.
 */

interface Archetype {
  name: string;
  label: string;
  palette: ColorToken[];
  typography: string;
  rationale: (b: Brief) => string;
  mark: (size: number, color: string) => string;
}

const ARCHETYPES: Archetype[] = [
  {
    name: "The Architect",
    label: "Sage / Creator blend",
    palette: [
      { name: "Midnight Navy", hex: "#0F1B2D", rgb: "15, 27, 45", usage: "Primary" },
      { name: "Champagne Gold", hex: "#C9A96E", rgb: "201, 169, 110", usage: "Accent" },
      { name: "Warm Ivory", hex: "#FAF8F5", rgb: "250, 248, 245", usage: "Background" },
      { name: "Charcoal", hex: "#1A1D23", rgb: "26, 29, 35", usage: "Text" },
      { name: "Slate", hex: "#6B7280", rgb: "107, 114, 128", usage: "Muted" },
    ],
    typography: "Neue Haas Grotesk Display / Inter — geometric sans with tight tracking. Precise, architectural, premium without coldness.",
    rationale: (b) =>
      `A measured, structured identity that signals competence and trust. The midnight-navy-and-champagne pairing reads established and considered — the kind of restraint that lets ${b.businessName}'s work speak first. Built around your "${b.desiredAdjectives.join(", ")}" direction with a monogram mark that stays legible from a favicon to a building sign. The interlocking forms suggest precision engineering and lasting partnerships.`,
    mark: (s, c) => `
      <svg width="${s}" height="${s}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="arch-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="${c}" stop-opacity="1"/>
            <stop offset="100%" stop-color="${c}" stop-opacity="0.7"/>
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="12" fill="url(#arch-grad)" opacity="0.08"/>
        <path d="M20 44V20h8l8 12V20h8v24h-8l-8-12v12H20z" fill="${c}"/>
        <rect x="16" y="16" width="32" height="32" rx="4" stroke="${c}" stroke-width="2" fill="none"/>
        <circle cx="48" cy="16" r="3" fill="${c}" opacity="0.4"/>
      </svg>`,
  },
  {
    name: "The Catalyst",
    label: "Hero / Magician blend",
    palette: [
      { name: "Ember Red", hex: "#E63946", rgb: "230, 57, 70", usage: "Primary" },
      { name: "Deep Ink", hex: "#0D1117", rgb: "13, 17, 23", usage: "Text / Contrast" },
      { name: "Sunset Gold", hex: "#F4A261", rgb: "244, 162, 97", usage: "Secondary" },
      { name: "Cloud", hex: "#F8F9FA", rgb: "248, 249, 250", usage: "Background" },
      { name: "Slate Blue", hex: "#457B9D", rgb: "69, 123, 157", usage: "Tertiary" },
    ],
    typography: "Satoshi / General Sans — bold geometric with rounded terminals. Confident, forward-leaning, made to be remembered.",
    rationale: (b) =>
      `An energetic, confident system for a brand that wants to be felt, not just recognized. The ember spark carries momentum; the deep ink grounds it. The lightning-bolt monogram encodes speed and transformation — exactly the "${b.desiredAdjectives.join(", ")}" energy you described. Bold enough to stand apart from ${b.competitors[0] || "the field"}, never frantic. The secondary gold and slate blue give the system range from hero moments to calm explanations.`,
    mark: (s, c) => `
      <svg width="${s}" height="${s}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cat-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="${c}"/>
            <stop offset="100%" stop-color="#F4A261"/>
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#cat-grad)" opacity="0.1"/>
        <circle cx="32" cy="32" r="20" fill="${c}"/>
        <path d="M34 16L26 34h10L30 48l18-22H38L42 16H34z" fill="#fff"/>
        <circle cx="32" cy="32" r="28" stroke="${c}" stroke-width="1.5" fill="none" opacity="0.3"/>
      </svg>`,
  },
  {
    name: "The Sage",
    label: "Sage / Caregiver blend",
    palette: [
      { name: "Forest", hex: "#1B4332", rgb: "27, 67, 50", usage: "Primary" },
      { name: "Terracotta", hex: "#BC6C25", rgb: "188, 108, 37", usage: "Accent" },
      { name: "Linen", hex: "#FEFAE0", rgb: "254, 250, 224", usage: "Background" },
      { name: "Ink", hex: "#1A1A2E", rgb: "26, 26, 46", usage: "Text" },
      { name: "Sage", hex: "#84A98C", rgb: "132, 169, 140", usage: "Secondary" },
    ],
    typography: "Source Serif 4 / DM Sans — humanist serif headlines with sans-serif body. Calm, credible, quietly assured.",
    rationale: (b) =>
      `A grounded, human identity built on trust and longevity. Forest green and warm terracotta feel grown-up and approachable at once — exactly the "${b.desiredAdjectives.join(", ")}" balance you asked for. The leaf-mark suggests organic growth and care, keeping ${b.businessName} distinct from louder competitors like ${b.competitors[0] || "others in the space"}. The sage green secondary adds a natural, calming layer.`,
    mark: (s, c) => `
      <svg width="${s}" height="${s}" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sage-grad" x1="16" y1="48" x2="48" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="${c}"/>
            <stop offset="100%" stop-color="#84A98C"/>
          </linearGradient>
        </defs>
        <path d="M32 8C32 8 12 20 12 36c0 11 9 20 20 20s20-9 20-20C52 20 32 8 32 8z" fill="url(#sage-grad)" opacity="0.15"/>
        <path d="M32 12c0 0-16 10-16 24 0 9 7 16 16 16s16-7 16-16C48 22 32 12 32 12z" fill="${c}"/>
        <path d="M32 20v28M24 36c4-4 8-4 8 0M40 32c-4-4-8-4-8 0" stroke="#FEFAE0" stroke-width="2" stroke-linecap="round" fill="none"/>
        <circle cx="32" cy="16" r="2" fill="#FEFAE0" opacity="0.6"/>
      </svg>`,
  },
];

function uid(): string {
  return "dir_" + Math.random().toString(36).slice(2, 10);
}

export function archetypeByName(name: string): Archetype | undefined {
  return ARCHETYPES.find((a) => a.name === name);
}

/**
 * Compose a full lockup SVG (mark + wordmark) at a given size,
 * with explicit mark + wordmark colors so we can render the four
 * required versions (full / mono / reversed / compact) from one
 * direction without storing four separate assets.
 */
function composeLockup(
  d: Direction,
  markColor: string,
  wordmarkColor: string,
  size: number,
  compact: boolean,
): string {
  const a = archetypeByName(d.archetype);
  const mark = a ? a.mark(size, markColor) : d.svgMark;
  if (compact) return mark.trim();
  const fontSize = Math.round(size * 0.55);
  const gap = Math.round(size * 0.22);
  const width = size + gap + Math.max(4, d.wordmark.length) * fontSize * 0.56;
  return `<svg width="${Math.round(width)}" height="${size}" viewBox="0 0 ${Math.round(width)} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block">
  <g transform="translate(0,0)">${mark.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "")}</g>
  <text x="${size + gap}" y="${Math.round(size * 0.62)}" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="${fontSize}" font-weight="700" letter-spacing="-0.8" fill="${wordmarkColor}">${escapeXml(d.wordmark)}</text>
</svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export interface DirectionVersion {
  key: "full" | "mono" | "reversed" | "compact";
  label: string;
  svg: string;
  bg: string;
}

/**
 * The four required logo versions per PRD §5.4, derived from one
 * direction. `bg` is the frame background the card should paint
 * behind the inline SVG.
 */
export function renderDirectionVersions(d: Direction): DirectionVersion[] {
  const primary = d.colorTokens[0]?.hex || "#0F1B2D";
  const text = d.colorTokens.find((c) => /text|graphite|ink|charcoal|ink/i.test(c.usage))?.hex || "#1A1D23";
  const light = d.colorTokens.find((c) => /paper|mist|bone|background|ivory|linen|cloud/i.test(c.usage))?.hex || "#FAF8F5";
  return [
    { key: "full", label: "Full-color lockup", svg: composeLockup(d, primary, text, 48, false), bg: light },
    { key: "mono", label: "Monochrome", svg: composeLockup(d, text, text, 48, false), bg: "#ffffff" },
    { key: "reversed", label: "Reversed", svg: composeLockup(d, light, light, 48, false), bg: primary },
    { key: "compact", label: "Compact / icon", svg: composeLockup(d, primary, primary, 56, true), bg: "#ffffff" },
  ];
}

export function generateDirections(brief: Brief, tier: Tier): Direction[] {
  const count = tier === "starter" ? 1 : 3;
  const archetypes = ARCHETYPES.slice(0, count);
  return archetypes.map((a, i) => {
    const primary = a.palette[0];
    return {
      id: uid(),
      orderId: "",
      directionNumber: (i + 1) as 1 | 2 | 3,
      rationaleText: a.rationale(brief),
      archetype: a.name,
      colorTokens: a.palette,
      typographyNotes: a.typography,
      svgMark: a.mark(80, primary.hex),
      wordmark: brief.businessName || "Your Brand",
      qaFlags: [],
      reviewStatus: "qa_approved",
    };
  });
}
