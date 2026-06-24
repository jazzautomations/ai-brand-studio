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
      { name: "Ink Indigo", hex: "#1E2A78", rgb: "30, 42, 120", usage: "Primary" },
      { name: "Warm Gold", hex: "#C8A24B", rgb: "200, 162, 75", usage: "Accent" },
      { name: "Paper", hex: "#F6F3EC", rgb: "246, 243, 236", usage: "Background" },
      { name: "Graphite", hex: "#2B2B33", rgb: "43, 43, 51", usage: "Text" },
    ],
    typography: "Geometric sans wordmark with tight tracking — precise, architectural, premium without being cold.",
    rationale: (b) =>
      `A measured, structured identity that signals competence and trust. The indigo-and-gold pairing reads established and considered — the kind of restraint that lets ${b.businessName}'s work speak first. Built around your “${b.desiredAdjectives.join(", ")}” direction with a mark that stays legible from a favicon to a building sign.`,
    mark: (s, c) => `
      <svg width="${s}" height="${s}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4 L44 24 L24 44 L4 24 Z" stroke="${c}" stroke-width="2.4" fill="none"/>
        <path d="M24 14 L34 24 L24 34 L14 24 Z" fill="${c}"/>
        <circle cx="24" cy="24" r="2.4" fill="#F6F3EC"/>
      </svg>`,
  },
  {
    name: "The Catalyst",
    label: "Hero / Magician blend",
    palette: [
      { name: "Ember Coral", hex: "#FF5A4D", rgb: "255, 90, 77", usage: "Primary" },
      { name: "Deep Ink", hex: "#14141B", rgb: "20, 20, 27", usage: "Text / Contrast" },
      { name: "Sun Gold", hex: "#FFB347", rgb: "255, 179, 71", usage: "Secondary" },
      { name: "Mist", hex: "#F2F1EE", rgb: "242, 241, 238", usage: "Background" },
    ],
    typography: "Rounded bold sans — confident, forward-leaning, made to be remembered.",
    rationale: (b) =>
      `An energetic, confident system for a brand that wants to be felt, not just recognized. The coral spark carries momentum; the deep ink grounds it. This leans into ${b.businessName}'s momentum and the “${b.desiredAdjectives.join(", ")}” energy you described — bold enough to stand apart from ${b.competitors[0] || "the field"}, never frantic.`,
    mark: (s, c) => `
      <svg width="${s}" height="${s}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="15" fill="${c}"/>
        <path d="M24 9 L27 21 L39 24 L27 27 L24 39 L21 27 L9 24 L21 21 Z" fill="#FFB347"/>
      </svg>`,
  },
  {
    name: "The Sage",
    label: "Sage / Caregiver blend",
    palette: [
      { name: "Forest", hex: "#1F4D3F", rgb: "31, 77, 63", usage: "Primary" },
      { name: "Clay", hex: "#C97B5B", rgb: "201, 123, 91", usage: "Accent" },
      { name: "Bone", hex: "#F4F0E6", rgb: "244, 240, 230", usage: "Background" },
      { name: "Charcoal", hex: "#222624", rgb: "34, 38, 36", usage: "Text" },
    ],
    typography: "Refined humanist sans with generous spacing — calm, credible, quietly assured.",
    rationale: (b) =>
      `A grounded, human identity built on trust and longevity. Forest green and warm clay feel grown-up and approachable at once — exactly the “${b.desiredAdjectives.join(", ")}” balance you asked for. The arc mark suggests growth and care, keeping ${b.businessName} distinct from louder competitors like ${b.competitors[0] || "others in the space"}.`,
    mark: (s, c) => `
      <svg width="${s}" height="${s}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 38 C8 22, 20 10, 40 8 C40 24, 28 36, 8 38 Z" fill="${c}"/>
        <path d="M16 34 C18 26, 24 20, 32 18" stroke="#F4F0E6" stroke-width="2.2" fill="none" stroke-linecap="round"/>
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
  const fontSize = Math.round(size * 0.62);
  const gap = Math.round(size * 0.28);
  const width = size + gap + Math.max(4, d.wordmark.length) * fontSize * 0.58;
  return `<svg width="${Math.round(width)}" height="${size}" viewBox="0 0 ${Math.round(width)} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block">
  <g transform="translate(0,0)">${mark.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "")}</g>
  <text x="${size + gap}" y="${Math.round(size * 0.66)}" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="${fontSize}" font-weight="700" letter-spacing="-0.5" fill="${wordmarkColor}">${escapeXml(d.wordmark)}</text>
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
  const primary = d.colorTokens[0]?.hex || "#1E2A78";
  const text = d.colorTokens.find((c) => /text|graphite|ink|charcoal/i.test(c.usage))?.hex || "#2B2B33";
  const light = d.colorTokens.find((c) => /paper|mist|bone|background/i.test(c.usage))?.hex || "#F6F3EC";
  return [
    { key: "full", label: "Full-color lockup", svg: composeLockup(d, primary, text, 40, false), bg: light },
    { key: "mono", label: "Monochrome", svg: composeLockup(d, text, text, 40, false), bg: "#ffffff" },
    { key: "reversed", label: "Reversed", svg: composeLockup(d, light, light, 40, false), bg: primary },
    { key: "compact", label: "Compact / icon", svg: composeLockup(d, primary, primary, 44, true), bg: "#ffffff" },
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
      svgMark: a.mark(64, primary.hex),
      wordmark: brief.businessName || "Your Brand",
      qaFlags: [],
      reviewStatus: "qa_approved",
    };
  });
}
