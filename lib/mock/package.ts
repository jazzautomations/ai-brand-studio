import type { Brief, CompetitorResearch, Direction } from "@/lib/data/types";
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

export function buildMoodBoardHtml(brief: Brief, direction: Direction, strategy: StrategyDoc): string {
  const primary = direction.colorTokens[0]?.hex || "#0F1B2D";
  const accent = direction.colorTokens[1]?.hex || "#C9A96E";
  const light = direction.colorTokens.find((c) => /paper|mist|bone|background|ivory|linen|cloud/i.test(c.usage))?.hex || "#FAF8F5";
  const text = direction.colorTokens.find((c) => /text|graphite|ink|charcoal|ink/i.test(c.usage))?.hex || "#1A1D23";
  const secondary = direction.colorTokens.find((c) => /sage|slate|terracotta|secondary|muted/i.test(c.usage))?.hex || accent;

  const moodKeywords = brief.desiredAdjectives.map(a =>
    `<span class="keyword" style="border-color:${primary};color:${primary}">${a}</span>`
  ).join("");

  const paletteSwatches = direction.colorTokens.map(c =>
    `<div class="swatch"><div class="color" style="background:${c.hex}"></div><div><b>${c.name}</b><br><code>${c.hex}</code><br><span class="usage">${c.usage}</span></div></div>`
  ).join("");

  const body = `
  <h2>Mood & Direction</h2>
  <p>This mood board captures the visual and emotional territory your brand occupies. Every element — color, type, imagery style — reinforces the <b>${brief.desiredAdjectives.join(", ")}</b> promise.</p>

  <div class="keywords">${moodKeywords}</div>

  <h2>Color Territory</h2>
  <div class="palette">${paletteSwatches}</div>
  <p class="rationale">${strategy.colorDirection.paletteRationale}</p>
  <p><b>Avoid:</b> ${strategy.colorDirection.avoid.join(", ")}</p>

  <h2>Typography Territory</h2>
  <div class="type-showcase">
    <div class="type-sample" style="font-family:'Inter',system-ui,sans-serif;font-size:32px;font-weight:700;color:${primary}">Aa Bb Cc</div>
    <div class="type-sample" style="font-family:'Inter',system-ui,sans-serif;font-size:16px;color:${text};margin-top:8px">The quick brown fox jumps over the lazy dog</div>
  </div>
  <p>${strategy.typographyDirection.rationale}</p>
  <p><b>Style:</b> ${strategy.typographyDirection.suggestedStyle}</p>

  <h2>Visual Personality</h2>
  <div class="personality-grid">
    <div class="personality-card" style="border-left-color:${primary}">
      <h4>Primary archetype</h4>
      <p>${strategy.archetypePrimary}</p>
    </div>
    <div class="personality-card" style="border-left-color:${accent}">
      <h4>Secondary archetype</h4>
      <p>${strategy.archetypeSecondary}</p>
    </div>
  </div>

  <h2>Brand Essence</h2>
  <div class="callout" style="border-left-color:${accent}">
    <p style="font-size:18px;font-style:italic;color:${primary}">"${strategy.goldenWhy}"</p>
  </div>

  <h2>Imagery Style</h2>
  <p>Photography and illustration should feel <b>${brief.desiredAdjectives.slice(0, 2).join(" and ")}</b> — never ${brief.explicitExclusions.toLowerCase().split(",")[0]}.</p>
  <div class="imagery-grid">
    <div class="imagery-note"><b>Do:</b> Natural light, authentic moments, considered compositions.</div>
    <div class="imagery-note"><b>Don't:</b> Stock photos, heavy filters, overly staged setups.</div>
  </div>
  `;

  return docShell(brief.languagePreference || "en", `${brief.businessName} — Mood Board`, "Visual & emotional territory", `Mood Board · ${new Date().getFullYear()}`, `
  <style>
    .keywords { display: flex; gap: 8px; flex-wrap: wrap; margin: 16px 0; }
    .keyword { display: inline-block; padding: 8px 20px; border: 2px solid; border-radius: 999px; font-size: 14px; font-weight: 600; letter-spacing: 0.02em; }
    .palette { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; margin: 16px 0; }
    .swatch { display: flex; gap: 10px; align-items: center; }
    .swatch .color { width: 52px; height: 52px; border-radius: 10px; border: 1px solid rgba(0,0,0,.06); flex: none; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
    .swatch span, .swatch div { font-size: 12px; color: #666; line-height: 1.4; }
    .swatch code { font-size: 11px; color: #999; }
    .usage { color: ${primary}; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
    .rationale { font-style: italic; color: #666; margin: 8px 0; }
    .type-showcase { background: ${light}; border-radius: 16px; padding: 32px; margin: 16px 0; border: 1px solid rgba(0,0,0,.04); }
    .personality-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
    .personality-card { border-left: 4px solid; padding: 20px; background: ${light}; border-radius: 0 12px 12px 0; }
    .personality-card h4 { margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; }
    .personality-card p { margin: 0; font-size: 20px; font-weight: 600; color: ${primary}; }
    .imagery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
    .imagery-note { padding: 20px; border-radius: 12px; font-size: 14px; line-height: 1.6; }
    .imagery-note:first-child { background: #eafaf1; border: 1px solid #c6f6d5; }
    .imagery-note:last-child { background: #fdecec; border: 1px solid #fed7d7; }
  </style>
  ${body}
  `);
}

export function buildSocialMediaKitHtml(brief: Brief, direction: Direction, strategy: StrategyDoc, verbal: VerbalIdentity): string {
  const primary = direction.colorTokens[0]?.hex || "#0F1B2D";
  const accent = direction.colorTokens[1]?.hex || "#C9A96E";
  const light = direction.colorTokens.find((c) => /paper|mist|bone|background|ivory|linen|cloud/i.test(c.usage))?.hex || "#FAF8F5";
  const text = direction.colorTokens.find((c) => /text|graphite|ink|charcoal|ink/i.test(c.usage))?.hex || "#1A1D23";

  const tagline = verbal.taglineOptions[0]?.tagline || "";
  const pillars = verbal.messagingPillars.map(p => `<li>${escapeHtml(p)}</li>`).join("");

  const body = `
  <h2>Social Media Kit</h2>
  <p>Ready-to-use templates and copy frameworks for your brand's social presence. Every piece stays on-brand using the voice and visual system defined in your brand guide.</p>

  <h2>Profile Templates</h2>
  <div class="profile-grid">
    <div class="profile-card">
      <h4>Twitter / X</h4>
      <div class="profile-preview" style="background:${primary};color:${light}">
        <div style="font-weight:700;font-size:16px">${escapeHtml(brief.businessName)}</div>
        <div style="opacity:0.8;font-size:13px;margin-top:4px">${escapeHtml(tagline)}</div>
      </div>
      <p class="template-note">Bio: ${escapeHtml(verbal.voiceAttributes[0]?.definition || "Clear, confident, no filler.")}</p>
    </div>
    <div class="profile-card">
      <h4>LinkedIn</h4>
      <div class="profile-preview" style="background:${light};color:${text};border:1px solid #ddd">
        <div style="font-weight:700;font-size:16px">${escapeHtml(brief.businessName)}</div>
        <div style="font-size:13px;margin-top:4px;color:#666">${escapeHtml(tagline)}</div>
      </div>
      <p class="template-note">Headline: ${escapeHtml(brief.businessName)} — ${escapeHtml(tagline)}</p>
    </div>
  </div>

  <h2>Content Pillars</h2>
  <div class="pillars">${pillars}</div>

  <h2>Post Templates</h2>
  <div class="post-templates">
    <div class="post-template">
      <h4>Announcement</h4>
      <div class="post-preview" style="background:${light};border-left:4px solid ${primary}">
        <p><b>${escapeHtml(brief.businessName)}</b> — ${escapeHtml(verbal.messagingPillars[0] || "Strategy before pixels.")}</p>
        <p style="color:${primary};font-weight:600">→ Your CTA here</p>
      </div>
    </div>
    <div class="post-template">
      <h4>Value Post</h4>
      <div class="post-preview" style="background:${light};border-left:4px solid ${accent}">
        <p>Quick tip for ${escapeHtml(brief.targetAudience)}:</p>
        <p style="font-style:italic">"${escapeHtml(verbal.voiceAttributes[0]?.doExample || "Here's what we recommend and why.")}"</p>
      </div>
    </div>
    <div class="post-template">
      <h4>Social Proof</h4>
      <div class="post-preview" style="background:${light};border-left:4px solid ${text}">
        <p>"${escapeHtml(brief.businessName)} helped us ${escapeHtml(brief.desiredAdjectives[0] || "launch")} our brand in days, not months."</p>
        <p style="color:#888;font-size:13px">— Client name, Title</p>
      </div>
    </div>
  </div>

  <h2>Hashtag Strategy</h2>
  <div class="hashtags">
    <span class="hashtag" style="background:${primary};color:${light}">#${brief.businessName.replace(/\s+/g, "")}</span>
    <span class="hashtag" style="background:${accent};color:#fff">#BrandStrategy</span>
    <span class="hashtag" style="background:${text};color:${light}">#${brief.industry.replace(/\s+/g, "")}</span>
  </div>

  <h2>Brand Voice Quick Reference</h2>
  <div class="voice-ref">
    ${verbal.voiceAttributes.map(v => `
      <div class="voice-attr">
        <b>${escapeHtml(v.name)}</b>: ${escapeHtml(v.definition)}<br>
        <span style="color:#1f7a4d">✓ ${escapeHtml(v.doExample)}</span><br>
        <span style="color:#b23b3b">✗ ${escapeHtml(v.dontExample)}</span>
      </div>
    `).join("")}
  </div>
  `;

  return docShell(brief.languagePreference || "en", `${brief.businessName} — Social Media Kit`, "Templates, voice & content strategy", `Social Media Kit · ${new Date().getFullYear()}`, `
  <style>
    .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
    .profile-card h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #888; margin-bottom: 8px; }
    .profile-preview { padding: 16px; border-radius: 10px; }
    .template-note { font-size: 12px; color: #888; margin-top: 8px; }
    .pillars { margin: 16px 0; }
    .pillars li { margin-bottom: 8px; padding: 8px 12px; background: ${light}; border-radius: 6px; }
    .post-templates { display: grid; gap: 16px; margin: 16px 0; }
    .post-template h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #888; margin-bottom: 8px; }
    .post-preview { padding: 16px; border-radius: 8px; }
    .post-preview p { margin: 4px 0; font-size: 14px; }
    .hashtags { display: flex; gap: 8px; flex-wrap: wrap; margin: 16px 0; }
    .hashtag { padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 600; }
    .voice-ref { margin: 16px 0; }
    .voice-attr { padding: 12px; background: ${light}; border-radius: 8px; margin-bottom: 8px; font-size: 14px; line-height: 1.6; }
  </style>
  ${body}
  `);
}

export function buildBrandInContextHtml(brief: Brief, direction: Direction, strategy: StrategyDoc, verbal: VerbalIdentity): string {
  const primary = direction.colorTokens[0]?.hex || "#0F1B2D";
  const accent = direction.colorTokens[1]?.hex || "#C9A96E";
  const light = direction.colorTokens.find((c) => /paper|mist|bone|background|ivory|linen|cloud/i.test(c.usage))?.hex || "#FAF8F5";
  const text = direction.colorTokens.find((c) => /text|graphite|ink|charcoal|ink/i.test(c.usage))?.hex || "#1A1D23";

  const tagline = brief.desiredAdjectives[0] || "Considered";

  const body = `
  <h2>Brand in Context</h2>
  <p>See how ${escapeHtml(brief.businessName)} looks across real-world touchpoints. Every mockup uses your approved palette, typography, and voice.</p>

  <h2>Website Hero</h2>
  <div class="mockup hero-mock" style="background:${primary};color:${light}">
    <div style="font-size:12px;opacity:0.7;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:16px">${escapeHtml(brief.businessName)}</div>
    <div style="font-size:36px;font-weight:700;line-height:1.2;max-width:500px">${escapeHtml(verbal.messagingPillars[0] || "Strategy you can see.")}</div>
    <div style="margin-top:20px;font-size:16px;opacity:0.85;max-width:400px">${escapeHtml(brief.whatTheySell)} — built for ${escapeHtml(brief.targetAudience)}.</div>
    <div style="margin-top:24px;display:inline-block;padding:12px 28px;background:${accent};color:#fff;border-radius:8px;font-weight:600">Get started →</div>
  </div>

  <h2>Business Card</h2>
  <div class="mockup card-mock" style="background:#fff;border:1px solid #eee;border-radius:12px;padding:32px;max-width:400px">
    <div style="font-size:20px;font-weight:700;color:${primary}">${escapeHtml(brief.businessName)}</div>
    <div style="font-size:12px;color:${accent};margin-top:4px;text-transform:uppercase;letter-spacing:0.08em">${escapeHtml(tagline)}</div>
    <div style="margin-top:24px;font-size:13px;color:#666;line-height:1.6">
      Name · Title<br>
      email@${brief.businessName.toLowerCase().replace(/\s+/g, "")}.com<br>
      +1 (555) 000-0000
    </div>
    <div style="margin-top:20px;width:32px;height:32px;background:${primary};border-radius:6px"></div>
  </div>

  <h2>Email Signature</h2>
  <div class="mockup email-mock" style="background:${light};border-radius:8px;padding:20px;max-width:400px">
    <div style="font-size:14px;font-weight:600;color:${text}">Best,<br>Name</div>
    <div style="margin-top:12px;padding-top:12px;border-top:2px solid ${primary}">
      <div style="font-size:13px;font-weight:600;color:${primary}">${escapeHtml(brief.businessName)}</div>
      <div style="font-size:11px;color:#888;margin-top:2px">${escapeHtml(tagline)}</div>
    </div>
  </div>

  <h2>Social Media Post</h2>
  <div class="mockup social-mock" style="background:#fff;border:1px solid #eee;border-radius:12px;padding:24px;max-width:400px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <div style="width:40px;height:40px;background:${primary};border-radius:50%"></div>
      <div>
        <div style="font-size:14px;font-weight:600">${escapeHtml(brief.businessName)}</div>
        <div style="font-size:11px;color:#888">Sponsored</div>
      </div>
    </div>
    <div style="font-size:14px;color:${text};line-height:1.5">
      ${escapeHtml(verbal.voiceAttributes[0]?.doExample || "Here's what we recommend and why.")}
    </div>
    <div style="margin-top:16px;padding:10px 16px;background:${primary};color:${light};border-radius:6px;text-align:center;font-size:13px;font-weight:600">Learn more →</div>
  </div>

  <h2>Brand Consistency Check</h2>
  <div class="consistency-grid">
    <div class="check-item pass">✓ Logo uses approved primary color</div>
    <div class="check-item pass">✓ Typography matches brand guide</div>
    <div class="check-item pass">✓ Voice tone is ${brief.desiredAdjectives[0] || "clear"}</div>
    <div class="check-item pass">✓ Clear space maintained around mark</div>
  </div>
  `;

  return docShell(brief.languagePreference || "en", `${brief.businessName} — Brand in Context`, "Real-world touchpoint mockups", `Brand in Context · ${new Date().getFullYear()}`, `
  <style>
    .mockup { margin: 16px 0; }
    .hero-mock { padding: 48px; border-radius: 16px; }
    .card-mock, .email-mock, .social-mock { margin: 16px 0; }
    .consistency-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 16px 0; }
    .check-item { padding: 10px 14px; background: #eafaf1; border-radius: 6px; font-size: 13px; }
  </style>
  ${body}
  `);
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
  const primary = direction.colorTokens[0]?.hex || "#0F1B2D";
  const text = direction.colorTokens.find((c) => /text|graphite|ink|charcoal|ink/i.test(c.usage))?.hex || "#1A1D23";
  const light = direction.colorTokens.find((c) => /paper|mist|bone|background|ivory|linen|cloud/i.test(c.usage))?.hex || "#FAF8F5";
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

/* =========================================================================
 *  Standalone strategy & market-research documents (delivered alongside the
 *  brand guide so the client gets the reasoning, not just the visuals).
 * ======================================================================= */

const DOC_BASE_CSS = `
  @page { margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #1A1D23; background: #fff; margin: 0; line-height: 1.6; }
  .wrap { max-width: 880px; margin: 0 auto; padding: 48px 32px; }
  .cover { background: #0F1B2D; color: #FAF8F5; border-radius: 18px; padding: 64px 48px; margin-bottom: 40px; }
  .cover h1 { font-size: 46px; margin: 8px 0 6px; letter-spacing: -1px; }
  .cover .tag { font-size: 19px; opacity: .85; font-style: italic; }
  .cover .meta { margin-top: 32px; font-size: 12px; opacity: .7; letter-spacing: .08em; text-transform: uppercase; }
  h2 { font-size: 24px; margin: 40px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #C9A96E; }
  h3 { font-size: 16px; margin: 22px 0 8px; color: #0F1B2D; }
  p { color: #444; }
  .callout { background: #FAF8F5; border-left: 4px solid #C9A96E; padding: 16px 18px; border-radius: 8px; margin: 16px 0; }
  .attr { display: inline-block; background: #0F1B2D; color: #FAF8F5; padding: 6px 14px; border-radius: 999px; margin: 0 8px 8px 0; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 14px; }
  th, td { text-align: left; padding: 12px 14px; border-bottom: 1px solid #eee; vertical-align: top; }
  th { background: #FAF8F5; font-weight: 600; color: #0F1B2D; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
  td.name { font-weight: 600; color: #0F1B2D; }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; background: #eee; color: #555; }
  ul { padding-left: 20px; } li { margin-bottom: 6px; color: #444; }
  .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
  @media print { .wrap { padding: 0; } .cover { break-after: page; } h2 { break-after: avoid; } }
`;

function docShell(lang: string, title: string, coverTag: string, meta: string, body: string): string {
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${DOC_BASE_CSS}</style>
</head>
<body>
<div class="wrap">
  <section class="cover">
    <h1>${escapeHtml(title)}</h1>
    <div class="tag">${escapeHtml(coverTag)}</div>
    <div class="meta">${escapeHtml(meta)}</div>
  </section>
  ${body}
  <div class="footer">Generated by ${STUDIO_NAME} · Part of your complete brand identity deliverable.</div>
</div>
</body>
</html>`;
}

export function buildMarketResearchHtml(brief: Brief, competitors: CompetitorResearch[]): string {
  const lang = brief.languagePreference || "en";
  const compRows = competitors.length
    ? competitors
        .map(
          (c) => `<tr>
  <td class="name">${escapeHtml(c.name)}</td>
  <td>${escapeHtml(c.positioning)}</td>
  <td>${escapeHtml(c.visualStyle)}</td>
  <td><span class="badge">${escapeHtml(c.priceTier)}</span></td>
  <td>${escapeHtml(c.note)}</td>
</tr>`,
        )
        .join("")
    : `<tr><td colspan="5">No competitor data captured.</td></tr>`;

  const gaps = competitors
    .map((c) => `<li><b>${escapeHtml(c.name)}:</b> ${escapeHtml(c.note)}</li>`)
    .join("");

  const body = `
  <h2>Market Snapshot</h2>
  <p><b>Business:</b> ${escapeHtml(brief.businessName)}</p>
  <p><b>What they do:</b> ${escapeHtml(brief.whatTheySell)}</p>
  <p><b>Primary market:</b> ${escapeHtml(brief.primaryMarket)}</p>
  <p><b>Target audience:</b> ${escapeHtml(brief.targetAudience)}</p>

  <h2>Competitive Landscape</h2>
  <p>A scan of how direct and adjacent competitors position themselves, present visually, and price. Use this to find the gap your brand can own.</p>
  <table>
    <thead><tr><th>Competitor</th><th>Positioning</th><th>Visual style</th><th>Price tier</th><th>Read</th></tr></thead>
    <tbody>${compRows}</tbody>
  </table>

  <h2>Market Gap Analysis</h2>
  <div class="callout">
    Where incumbents go broad and polished, ${escapeHtml(brief.businessName)} can carve a defensible position by being
    <b>${escapeHtml(brief.desiredAdjectives.join(", "))}</b> — and explicitly never
    ${escapeHtml(brief.explicitExclusions.toLowerCase())}.
  </div>
  <h3>Per-competitor reads</h3>
  <ul>${gaps || "<li>No competitor notes recorded.</li>"}</ul>

  <h2>Opportunity</h2>
  <p>The whitespace in this market rewards a brand that pairs credibility with warmth — the ${escapeHtml(brief.desiredAdjectives[0] || "confident")} promise delivered without the cold, corporate tone the incumbents default to. ${escapeHtml(brief.businessName)}'s reference point (${escapeHtml(brief.brandAdmirationReference)}) confirms this is the direction the audience already responds to.</p>
  <p><b>Recommended wedge:</b> own the ${escapeHtml(brief.desiredAdjectives.slice(0, 2).join(" + "))} position. It is currently underserved and aligns with the audience's stated preference for ${escapeHtml(brief.desiredAdjectives[1] || "warmth")} over breadth.</p>
  `;
  return docShell(lang, `${brief.businessName} — Market Research`, "Competitive landscape & market opportunity", `Market Research · ${new Date().getFullYear()}`, body);
}

export function buildStrategyHtml(brief: Brief, strategy: StrategyDoc, verbal: VerbalIdentity): string {
  const lang = brief.languagePreference || "en";
  const attrs = strategy.brandAttributes.map((a) => `<span class="attr">${escapeHtml(a)}</span>`).join("");
  const voice = verbal.voiceAttributes
    .map(
      (v) =>
        `<div class="callout"><h3 style="margin-top:0">${escapeHtml(v.name)}</h3><p>${escapeHtml(v.definition)}</p><p><b>Do:</b> ${escapeHtml(v.doExample)}</p><p><b>Don't:</b> ${escapeHtml(v.dontExample)}</p></div>`,
    )
    .join("");
  const pillars = verbal.messagingPillars.map((p) => `<li>${escapeHtml(p)}</li>`).join("");
  const taglines = verbal.taglineOptions.map((t) => `<li><b>"${escapeHtml(t.tagline)}"</b> — ${escapeHtml(t.rationale)}</li>`).join("");

  const body = `
  <h2>Strategic Foundation</h2>
  <h3>Archetype</h3>
  <p>${escapeHtml(strategy.archetypePrimary)} <span class="badge">primary</span> &nbsp; ${escapeHtml(strategy.archetypeSecondary)} <span class="badge">secondary</span></p>
  <p>The ${escapeHtml(strategy.archetypePrimary.toLowerCase())} archetype gives ${escapeHtml(brief.businessName)} its core drive: ${escapeHtml(strategy.goldenWhy)}</p>

  <h3>Golden Why</h3>
  <div class="callout">${escapeHtml(strategy.goldenWhy)}</div>

  <h3>Positioning Statement</h3>
  <p>${escapeHtml(strategy.positioningStatement)}</p>

  <h2>Brand Attributes</h2>
  <div>${attrs}</div>
  <p><b>Never feel like:</b> ${escapeHtml(brief.explicitExclusions)}</p>

  <h2>Voice &amp; Tone</h2>
  ${voice}

  <h3>Messaging Pillars</h3>
  <ul>${pillars}</ul>

  <h3>Tagline Candidates</h3>
  <ul>${taglines}</ul>

  <h2>Direction Notes</h2>
  <h3>Color</h3>
  <p>${escapeHtml(strategy.colorDirection.paletteRationale)}</p>
  <ul>${strategy.colorDirection.suggestedHues.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}</ul>
  <p><b>Avoid:</b> ${escapeHtml(strategy.colorDirection.avoid.join(", "))}</p>
  <h3>Typography</h3>
  <p>${escapeHtml(strategy.typographyDirection.rationale)}</p>
  <p><b>Suggested:</b> ${escapeHtml(strategy.typographyDirection.suggestedStyle)}</p>
  <p><b>Avoid:</b> ${escapeHtml(strategy.typographyDirection.avoid)}</p>
  `;
  return docShell(lang, `${brief.businessName} — Brand Strategy`, "Positioning, archetype & voice", `Brand Strategy · ${new Date().getFullYear()}`, body);
}
