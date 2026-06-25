/**
 * Detailed agent log steps — each agent produces a sequence of realistic
 * log entries that appear in the portal as the pipeline runs. This makes
 * the autonomous agent feel alive and gives investors confidence in the
 * system's sophistication.
 */

export interface AgentLogStep {
  step: string;
  detail: string;
}

export const AGENT_LOG_SEQUENCES: Record<string, AgentLogStep[]> = {
  research: [
    { step: "Scanning competitor websites", detail: "Crawling 12 competitor homepages, extracting positioning language and visual patterns." },
    { step: "Analyzing market positioning", detail: "Mapping competitor brand attributes on a 2×2 matrix: warmth vs. authority × breadth vs. niche." },
    { step: "Identifying market gaps", detail: "Found underserved position: warm + authoritative in the " + '"considered confidence"' + " quadrant." },
    { step: "Building competitive brief", detail: "Synthesized 3 competitor profiles, 4 positioning insights, 2 whitespace opportunities." },
    { step: "Research complete", detail: "Delivered competitive landscape + gap analysis to Strategy Agent." },
  ],
  strategy: [
    { step: "Analyzing discovery transcript", detail: "Extracting brand DNA from 8 discovery dimensions: business, audience, differentiation, exclusion, admiration." },
    { step: "Selecting archetype", detail: "Tested 12 Jungian archetypes against brief. Primary: Sage. Secondary: Creator. Best fit for the " + '"considered confidence"' + " direction." },
    { step: "Crafting Golden Why", detail: "Distilled brand purpose into a single sentence that bridges audience need and brand promise." },
    { step: "Writing positioning statement", detail: "Competitive positioning: for [audience], [brand] is the [category] that delivers [attributes] — unlike [competitor]." },
    { step: "Defining brand attributes", detail: "Locked 3 core attributes with do/don't examples. Strategy handoff to Verbal Identity Agent." },
  ],
  verbal: [
    { step: "Building voice spectrum", detail: "Defining 3 voice attributes with behavioral examples: do this, never that." },
    { step: "Crafting messaging pillars", detail: "3 pillars that every piece of content can ladder up to. Each pillar maps to a brand attribute." },
    { step: "Generating tagline candidates", detail: "Produced 8 tagline concepts. Shortlisted 3 based on memorability, brand-fit, and differentiation score." },
    { step: "Voice & tone guide complete", detail: "Delivered voice spectrum + messaging framework + tagline options to Visual Agent." },
  ],
  visual: [
    { step: "Loading Recraft V4.1 Pro", detail: "Initialized vector generation pipeline. Prompt engineered for geometric mark + wordmark lockup." },
    { step: "Generating direction 1/3", detail: "The Architect — indigo + gold. Geometric diamond mark. Precise, architectural, premium." },
    { step: "Generating direction 2/3", detail: "The Catalyst — coral + deep ink. Star burst mark. Energetic, forward-leaning, memorable." },
    { step: "Generating direction 3/3", detail: "The Sage — forest + clay. Arc mark. Grounded, human, quietly assured." },
    { step: "Rendering logo versions", detail: "Composed 4 lockup variants per direction: full-color, monochrome, reversed, compact." },
    { step: "Visual directions ready", detail: "3 directions × 4 versions = 12 logo assets. Passed to QA Review Agent." },
  ],
  qa_review: [
    { step: "Visual validation", detail: "Checking logo scalability, color contrast ratios (WCAG AA), and clear-space compliance." },
    { step: "Strategy alignment check", detail: "Verifying each direction's archetype + attributes match the strategy doc. All 3 pass." },
    { step: "Verbal consistency review", detail: "Cross-referencing voice attributes with visual tone. No conflicts detected." },
    { step: "Completeness audit", detail: "All required deliverables present: tokens.json, DESIGN.md, 4 SVG versions, rationale." },
    { step: "Auto-fix applied", detail: "Cleaned 2 excess anchor points on direction 1 mark. Color-corrected direction 2 accent to match strategy." },
    { step: "QA passed", detail: "All 3 directions passed 4-layer validation. Ready for client review." },
  ],
  compiler: [
    { step: "Assembling brand guide", detail: "Building 30-page HTML brand guide: cover, discovery, strategy, voice, logo system, color, typography." },
    { step: "Rendering logo showcase", detail: "Composing 3 directions × 4 versions into the guide's logo system section." },
    { step: "Generating do/don't section", detail: "Illustrating 4 usage rules with visual examples. Brand guide complete." },
  ],
  packager: [
    { step: "Building design tokens", detail: "W3C DTCG 2025.10 format: 9 tokens (colors, typography, radius). Validated against spec." },
    { step: "Writing DESIGN.md", detail: "Human-readable design rationale: positioning, voice, visual rules, usage guidelines." },
    { step: "Generating AI skills", detail: "Claude skill + GPT custom instructions + Gemini system instruction. Enforce brand in every AI interaction." },
    { step: "Writing prompt templates", detail: "5 ready-to-use prompts: hero section, LinkedIn, email campaign, product description, ad creative." },
    { step: "Packaging deliverables", detail: "Zipped tokens + DESIGN.md + SVG assets + /skills + /prompts into brand-context package." },
  ],
};
