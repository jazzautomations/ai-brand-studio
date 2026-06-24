import type { Brief, Direction } from "@/lib/data/types";
import type { Tier } from "@/lib/tiers";
import { STUDIO_NAME } from "@/lib/studio";
import { renderDirectionVersions, type DirectionVersion } from "@/lib/mock/directions";

/**
 * Packager Agent (mock) — builds the Brand Context Package file set
 * as the real Packager would, using the W3C DTCG 2025.10 format for
 * tokens. The delivery page zips these client-side with JSZip.
 *
 * Production: validate tokens.json against Style Dictionary v4
 * before zipping; this mock emits spec-compliant structure.
 */

export interface StrategyDoc {
  archetypePrimary: string;
  archetypeSecondary: string;
  goldenWhy: string;
  positioningStatement: string;
  brandAttributes: string[];
  colorDirection: { paletteRationale: string; suggestedHues: string[]; avoid: string[] };
  typographyDirection: { rationale: string; suggestedStyle: string; avoid: string };
}

export interface VerbalIdentity {
  voiceAttributes: { name: string; definition: string; doExample: string; dontExample: string }[];
  messagingPillars: string[];
  taglineOptions: { tagline: string; rationale: string }[];
}

export function mockStrategy(brief: Brief): StrategyDoc {
  const adj = brief.desiredAdjectives.join(", ");
  return {
    archetypePrimary: "The Sage",
    archetypeSecondary: "The Creator",
    goldenWhy: `To make trustworthy, considered work feel accessible to every founder who believed they had to choose between speed and craft.`,
    positioningStatement: `For ${brief.targetAudience}, ${brief.businessName} is the ${brief.industry} brand that delivers ${adj} — unlike ${brief.competitors[0] || "incumbents"} who trade depth for scale.`,
    brandAttributes: brief.desiredAdjectives,
    colorDirection: {
      paletteRationale: `A grounded palette that reads as calm authority, chosen to carry the "${adj}" promise without screaming.`,
      suggestedHues: ["Deep ink blue", "Warm neutral", "Single saturated accent"],
      avoid: ["Neon", "High-contrast gradients", "Candy pinks"],
    },
    typographyDirection: {
      rationale: `A confident geometric sans for the wordmark paired with a readable text face — modern but not trendy.`,
      suggestedStyle: "Geometric sans-serif wordmark + humanist text face",
      avoid: "Decorative scripts, condensed display faces",
    },
  };
}

export function mockVerbal(brief: Brief): VerbalIdentity {
  const a = brief.desiredAdjectives;
  return {
    voiceAttributes: [
      { name: a[0] || "Clear", definition: "Says exactly what it means, no filler.", doExample: "Here's what we recommend and why.", dontExample: "We leverage synergies to optimize outcomes." },
      { name: a[1] || "Warm", definition: "Respects the reader's intelligence and time.", doExample: "You're in good company — let's get started.", dontExample: "Kindly note that your request is being processed." },
      { name: a[2] || "Confident", definition: "Committed, never hedging.", doExample: "This is the right call.", dontExample: "This might possibly be perhaps the way." },
    ],
    messagingPillars: [
      `Strategy before pixels — every choice is defensible.`,
      `Built for the tools you already use, not against them.`,
      `Professional outcome, not a DIY template.`,
    ],
    taglineOptions: [
      { tagline: "Strategy you can see.", rationale: "Anchors on the strategy-first promise." },
      { tagline: "Your brand, on every tool.", rationale: "Leads with the Brand Context Package USP." },
      { tagline: "Considered. Not costly.", rationale: "Contrasts craft with agency pricing." },
    ],
  };
}

interface DTCGToken {
  $value: string;
  $type: string;
  $description?: string;
}

export function buildTokensJson(direction: Direction, brief: Brief): string {
  const colors = direction.colorTokens;
  const tokens: Record<string, DTCGToken> = {
    "color.brand.primary": { $value: colors[0]?.hex || "#1a2238", $type: "color", $description: colors[0]?.name || "Primary brand color" },
    "color.brand.accent": { $value: colors[1]?.hex || "#d8a657", $type: "color", $description: colors[1]?.name || "Accent color" },
    "color.brand.neutral.dark": { $value: colors[2]?.hex || "#1a1a1a", $type: "color", $description: "Neutral dark" },
    "color.brand.neutral.light": { $value: "#f7f5f0", $type: "color", $description: "Neutral light / paper" },
    "color.brand.onPrimary": { $value: "#ffffff", $type: "color", $description: "Text/elements on primary" },
    "typography.wordmark.family": { $value: "Geometric Sans, system-ui, sans-serif", $type: "fontFamily", $description: "Logo wordmark family" },
    "typography.body.family": { $value: "Inter, system-ui, sans-serif", $type: "fontFamily", $description: "Body text family" },
    "typography.heading.weight": { $value: "700", $type: "fontWeight" },
    "radius.scale": { $value: "8px", $type: "dimension", $description: "Default corner radius" },
  };
  const pkg = {
    $schema: "https://design-tokens.org/schema/",
    brand: brief.businessName,
    studio: STUDIO_NAME,
    generatedAt: new Date().toISOString(),
    standard: "W3C DTCG 2025.10",
    tokens,
  };
  return JSON.stringify(pkg, null, 2);
}

export function buildDesignMd(brief: Brief, direction: Direction, strategy: StrategyDoc, verbal: VerbalIdentity): string {
  return `# ${brief.businessName} — Design System

> Generated by ${STUDIO_NAME}. This file is human- and AI-readable — paste it into ChatGPT, Claude, Cursor, or v0 to get on-brand output instantly.

## Positioning
${strategy.positioningStatement}

**Why:** ${strategy.goldenWhy}

**Archetype:** ${strategy.archetypePrimary} (primary) / ${strategy.archetypeSecondary} (secondary)

## Brand attributes
${brief.desiredAdjectives.map((a) => `- ${a}`).join("\n")}

**Never feel like:** ${brief.explicitExclusions}

## Voice & tone
${verbal.voiceAttributes.map((v) => `### ${v.name}\n${v.definition}\n- ✅ Do: ${v.doExample}\n- ❌ Don't: ${v.dontExample}`).join("\n\n")}

## Messaging pillars
${verbal.messagingPillars.map((p) => `- ${p}`).join("\n")}

## Selected visual direction: ${direction.archetype}
${direction.rationaleText}

### Color
${direction.colorTokens.map((c) => `- \`${c.hex}\` — ${c.name} (${c.usage})`).join("\n")}

### Typography
${direction.typographyNotes}

## Usage rules
- Maintain clear space equal to the cap height of the wordmark around the logo.
- Minimum logo width: 120px digital / 30mm print.
- Never recolor the mark outside the approved palette.
- Never stretch, skew, or add effects (shadows, gradients, outlines).
`;
}

export function buildClaudeSkill(brief: Brief, strategy: StrategyDoc): string {
  return `# ${brief.businessName} — Claude Skill

You are the brand voice and visual system guardian for **${brief.businessName}**.

## Identity
- Positioning: ${strategy.positioningStatement}
- Attributes: ${brief.desiredAdjectives.join(", ")}
- Never: ${brief.explicitExclusions}

## Voice
Be clear, warm, and confident. No filler, no hedging, no corporate jargon.

## Visual rules
- Palette only from the approved tokens.
- Geometric sans wordmark. No decorative type.
- Flat, clean, no gradients or shadows.

When generating any asset for ${brief.businessName}, enforce the above. If a request would violate the brand, say so and propose an on-brand alternative.
`;
}

export function buildGptInstructions(brief: Brief, strategy: StrategyDoc): string {
  return `# Custom instructions — ${brief.businessName}

You represent ${brief.businessName}. Positioning: ${strategy.positioningStatement}.
Tone: ${brief.desiredAdjectives.join(", ")}. Never: ${brief.explicitExclusions}.
Always prefer clear, confident, jargon-free language. Keep visuals on-brand: approved palette, geometric sans, flat design.
`;
}

export function buildPromptFiles(brief: Brief, verbal: VerbalIdentity): Record<string, string> {
  const ctx = `Brand: ${brief.businessName}. Audience: ${brief.targetAudience}. Voice: ${brief.desiredAdjectives.join(", ")}.`;
  return {
    "hero-section.md": `# Hero section prompt\n\n${ctx}\n\nWrite a hero section: headline (≤9 words), subhead (1 line), one CTA. On-brand, no jargon. Output HTML.`,
    "linkedin-post.md": `# LinkedIn post prompt\n\n${ctx}\n\nWrite a 120-word LinkedIn post. Hook → value → soft CTA. ${verbal.voiceAttributes[0]?.name || "Clear"} tone.`,
    "email-campaign.md": `# Email campaign prompt\n\n${ctx}\n\nWrite a 3-email welcome sequence. Subject + body each. Warm, confident, no spam tropes.`,
    "product-description.md": `# Product description prompt\n\n${ctx}\n\nWrite a product description for ${brief.whatTheySell}. Benefit-led, scannable, ≤120 words.`,
    "ad-creative.md": `# Ad creative prompt\n\n${ctx}\n\nWrite 3 ad variants (headline + body + CTA) for ${brief.primaryMarket || "your market"}. Distinct angles.`,
  };
}

export function buildPackageFiles(
  brief: Brief,
  direction: Direction,
  tier: Tier,
): Record<string, string> {
  const strategy = mockStrategy(brief);
  const verbal = mockVerbal(brief);
  const versions = renderDirectionVersions(direction);
  const byKey = (k: DirectionVersion["key"]) => versions.find((v) => v.key === k)?.svg || "";
  const standalone = (svg: string) =>
    svg.startsWith("<svg") ? svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"') : svg;

  const files: Record<string, string> = {
    "tokens.tokens.json": buildTokensJson(direction, brief),
    "DESIGN.md": buildDesignMd(brief, direction, strategy, verbal),
    "assets/print/full-color.svg": standalone(byKey("full")),
    "assets/print/monochrome.svg": standalone(byKey("mono")),
    "assets/print/reversed.svg": standalone(byKey("reversed")),
    "assets/print/compact.svg": standalone(byKey("compact")),
    "assets/digital/logo.svg": standalone(byKey("full")),
    "assets/digital/favicon.svg": standalone(byKey("compact")),
    "assets/social/avatar.svg": standalone(byKey("compact")),
    "assets/editable/master.svg": standalone(byKey("full")),
  };

  if (tier === "signature" || tier === "authority") {
    files["skills/claude-skill.md"] = buildClaudeSkill(brief, strategy);
    files["skills/gpt-custom-instructions.md"] = buildGptInstructions(brief, strategy);
    files["skills/gemini-system-instruction.md"] = buildGptInstructions(brief, strategy);
    for (const [name, content] of Object.entries(buildPromptFiles(brief, verbal))) {
      files[`prompts/${name}`] = content;
    }
  }
  return files;
}

export function buildBrandGuideHtml(
  brief: Brief,
  direction: Direction,
  strategy: StrategyDoc,
  verbal: VerbalIdentity,
  tier: Tier,
): string {
  const primary = direction.colorTokens[0]?.hex || "#1E2A78";
  const text = direction.colorTokens.find((c) => /text|graphite|ink|charcoal/i.test(c.usage))?.hex || "#2B2B33";
  const light = direction.colorTokens.find((c) => /paper|mist|bone|background/i.test(c.usage))?.hex || "#F6F3EC";
  const accent = direction.colorTokens[1]?.hex || primary;
  const versions = renderDirectionVersions(direction);
  const byKey = (k: "full" | "mono" | "reversed" | "compact") =>
    versions.find((v) => v.key === k)?.svg || "";
  const tagline = verbal.taglineOptions[0]?.tagline || "";
  const swatches = direction.colorTokens
    .map(
      (c) =>
        `<div class="sw"><div class="chip" style="background:${c.hex}"></div><div><b>${c.name}</b><br><span>${c.hex} · rgb(${c.rgb})</span><br><span class="u">${c.usage}</span></div></div>`,
    )
    .join("");
  const voice = verbal.voiceAttributes
    .map(
      (v) =>
        `<div class="va"><h4>${v.name}</h4><p>${v.definition}</p><p class="do"><b>Do:</b> ${v.doExample}</p><p class="dont"><b>Don't:</b> ${v.dontExample}</p></div>`,
    )
    .join("");
  const pillars = verbal.messagingPillars.map((p) => `<li>${p}</li>`).join("");
  const taglines = verbal.taglineOptions
    .map((t) => `<li><b>"${t.tagline}"</b> — ${t.rationale}</li>`)
    .join("");
  const attrs = strategy.brandAttributes.map((a) => `<span class="attr">${a}</span>`).join("");
  const logoRow = versions
    .map(
      (v) =>
        `<div class="logo-cell"><div class="logo-frame" style="background:${v.bg}">${v.svg}</div><span>${v.label}</span></div>`,
    )
    .join("");

  return `<!doctype html>
<html lang="${brief.languagePreference || "en"}">
<head>
<meta charset="utf-8">
<title>${escapeHtml(brief.businessName)} — Brand Guide</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  @page { margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: ${text}; background: #fff; margin: 0; line-height: 1.55; }
  .wrap { max-width: 880px; margin: 0 auto; padding: 48px 32px; }
  .cover { background: ${primary}; color: ${light}; border-radius: 18px; padding: 72px 48px; margin-bottom: 40px; }
  .cover .lockup { margin-bottom: 28px; } .cover svg { display: block; }
  .cover h1 { font-size: 52px; margin: 8px 0 6px; letter-spacing: -1px; }
  .cover .tag { font-size: 20px; opacity: .85; font-style: italic; }
  .cover .meta { margin-top: 36px; font-size: 13px; opacity: .7; letter-spacing: .08em; text-transform: uppercase; }
  h2 { font-size: 24px; margin: 40px 0 12px; padding-bottom: 8px; border-bottom: 2px solid ${accent}; }
  h3 { font-size: 16px; margin: 22px 0 8px; color: ${primary}; }
  p { color: #444; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .sw { display: flex; gap: 10px; align-items: flex-start; font-size: 12px; }
  .chip { width: 44px; height: 44px; border-radius: 8px; border: 1px solid rgba(0,0,0,.08); flex: none; }
  .sw span { color: #777; } .sw .u { color: ${primary}; font-weight: 600; }
  .colors { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .va { background: ${light}; border-radius: 10px; padding: 16px; margin-bottom: 12px; }
  .va h4 { margin: 0 0 6px; color: ${primary}; } .va p { margin: 4px 0; font-size: 14px; }
  .va .do { color: #1f7a4d; } .va .dont { color: #b23b3b; }
  .attr { display: inline-block; background: ${primary}; color: ${light}; padding: 6px 14px; border-radius: 999px; margin: 0 8px 8px 0; font-size: 13px; }
  .logo-cell { text-align: center; } .logo-cell span { display: block; font-size: 11px; color: #888; margin-top: 6px; }
  .logo-frame { height: 110px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: 1px solid rgba(0,0,0,.08); padding: 12px; }
  ul { padding-left: 20px; } li { margin-bottom: 6px; color: #444; }
  .callout { background: ${light}; border-left: 4px solid ${accent}; padding: 16px 18px; border-radius: 8px; margin: 16px 0; }
  .dodont { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .dodont div { border-radius: 10px; padding: 16px; font-size: 14px; }
  .dodont .ok { background: #eafaf1; } .dodont .no { background: #fdecec; }
  .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
  @media print { .wrap { padding: 0; } .cover { break-after: page; } h2 { break-after: avoid; } }
</style>
</head>
<body>
<div class="wrap">

  <section class="cover">
    <div class="lockup">${byKey("reversed")}</div>
    <h1>${escapeHtml(brief.businessName)}</h1>
    <div class="tag">${escapeHtml(tagline)}</div>
    <div class="meta">Brand Guidelines · ${tier.charAt(0).toUpperCase() + tier.slice(1)} · ${new Date().getFullYear()}</div>
  </section>

  <h2>Discovery Summary</h2>
  <p><b>What they do:</b> ${escapeHtml(brief.whatTheySell)}</p>
  <p><b>For whom:</b> ${escapeHtml(brief.targetAudience)}</p>
  <p><b>Competitors:</b> ${brief.competitors.map((c) => escapeHtml(c)).join(", ")}</p>
  <p><b>Market:</b> ${escapeHtml(brief.primaryMarket)}</p>

  <h2>Strategy Foundation</h2>
  <h3>Archetype</h3>
  <p>${escapeHtml(strategy.archetypePrimary)} (primary) · ${escapeHtml(strategy.archetypeSecondary)} (secondary)</p>
  <h3>Golden Why</h3>
  <p>${escapeHtml(strategy.goldenWhy)}</p>
  <h3>Positioning</h3>
  <p>${escapeHtml(strategy.positioningStatement)}</p>
  <h3>Brand attributes</h3>
  <div>${attrs}</div>

  <h2>Voice &amp; Tone</h2>
  ${voice}
  <h3>Messaging pillars</h3>
  <ul>${pillars}</ul>
  <h3>Tagline candidates</h3>
  <ul>${taglines}</ul>

  <h2>Logo System</h2>
  <p>The logo system comprises four versions. Always preserve clear space equal to the height of the mark's icon, and never reproduce the full lockup below 96px wide.</p>
  <div class="grid">${logoRow}</div>

  <h2>Color Palette</h2>
  <div class="colors">${swatches}</div>

  <h2>Typography</h2>
  <p>${escapeHtml(direction.typographyNotes)}</p>
  <p><b>Avoid:</b> ${escapeHtml(strategy.typographyDirection.avoid)}</p>

  <h2>The Brand Context Package</h2>
  <div class="callout">
    Your delivery includes a machine-readable Brand Context Package (W3C DTCG 2025.10). Drop <code>tokens.tokens.json</code> into Figma or Tailwind, paste <code>DESIGN.md</code> into ChatGPT or Claude, and every downstream asset stays automatically on-brand — no manual setup.
  </div>

  <h2>Do / Don't</h2>
  <div class="dodont">
    <div class="ok"><b>Do</b><br>Use the approved palette. Keep generous clear space. Let the mark breathe on ${light}.</div>
    <div class="no"><b>Don't</b><br>Recolor the mark outside the palette. Add drop shadows or gradients. Stretch or rotate the lockup.</div>
  </div>

  <div class="footer">Generated by ${STUDIO_NAME} · This brand guide is part of a complete brand identity deliverable.</div>
</div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
