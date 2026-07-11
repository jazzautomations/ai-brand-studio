"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, FileText, Package, Download, Loader2, CheckCircle2,
  Sparkles, Image as ImageIcon, RefreshCw, Search, Compass,
  Palette, Share2, Eye, ChevronDown, ChevronRight, Code,
  MessageSquare, Globe, Zap, Bot, Send, Instagram, Linkedin, Mail,
} from "lucide-react";
import { useOrderFromQuery } from "@/lib/mock/use-order";
import { getStore } from "@/lib/mock/store";
import { TIERS } from "@/lib/tiers";
import { STUDIO_NAME } from "@/lib/studio";
import {
  buildPackageFiles, buildBrandGuideHtml, buildMarketResearchHtml,
  buildStrategyHtml, mockStrategy, mockVerbal,
  buildMoodBoardHtml, buildSocialMediaKitHtml, buildBrandInContextHtml,
  buildTokensJson, buildDesignMd, buildClaudeSkill, buildGptInstructions,
  buildPromptFiles,
} from "@/lib/mock/package";
import { renderDirectionVersions, archetypeByName } from "@/lib/mock/directions";
import { competitorResearchFor } from "@/lib/mock/transcript";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function triggerDownload(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

type PreviewTab = "overview" | "agent" | "research" | "strategy" | "tokens" | "design" | "guide" | "skills" | "mockups";

function DeliveryInner() {
  const { id, order, ready } = useOrderFromQuery();
  const [zipping, setZipping] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PreviewTab>("overview");
  const [expandedFile, setExpandedFile] = useState<string | null>(null);

  if (!ready) {
    return <div className="grid min-h-[60vh] place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!id || !order) {
    return (
      <div className="mx-auto max-w-md py-20 text-center text-muted-foreground">
        Project not found. <Link href="/checkout" className="text-primary underline">Start one</Link>
      </div>
    );
  }

  const tier = TIERS.find((t) => t.id === order.tier);
  const brief = getStore().getBrief(id);
  const sel = getStore().getSelectedDirection(id);
  const dirs = getStore().getDirections(id);
  const direction = sel?.direction || dirs[0];
  const session = getStore().getVoiceSession(id);
  const competitors = session?.competitorResearch?.length ? session.competitorResearch : competitorResearchFor(brief?.competitors || []);
  const slug = (brief?.businessName || "brand").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  if (order.status !== "delivered" || !brief || !direction) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <p className="text-muted-foreground">Your delivery isn't ready yet.</p>
        <Link href={`/portal/progress?order=${id}`} className="mt-4 inline-block text-primary underline">View progress</Link>
      </div>
    );
  }

  const strategy = mockStrategy(brief);
  const verbal = mockVerbal(brief);
  const versions = renderDirectionVersions(direction);
  const tokensJson = buildTokensJson(direction, brief);
  const designMd = buildDesignMd(brief, direction, strategy, verbal);
  const claudeSkill = buildClaudeSkill(brief, strategy);
  const gptInstructions = buildGptInstructions(brief, strategy);
  const promptFiles = buildPromptFiles(brief, verbal);

  async function downloadZip() {
    if (!brief || !tier) return;
    setZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const files = buildPackageFiles(brief, direction, tier.id);
      const zip = new JSZip();
      const root = zip.folder(`brand-context-${slug}-v1`)!;
      for (const [path, content] of Object.entries(files)) root.file(path, content);
      const blob = await zip.generateAsync({ type: "blob" });
      triggerDownload(`brand-context-${slug}-v1.zip`, blob);
      setDone("zip");
    } finally {
      setZipping(false);
    }
  }

  function downloadGuide() {
    if (!brief || !tier) return;
    const html = buildBrandGuideHtml(brief, direction, strategy, verbal, tier.id);
    triggerDownload(`brand-guide-${slug}.html`, new Blob([html], { type: "text/html" }));
    setDone("guide");
  }

  function downloadFile(name: string, content: string, ext = "html") {
    triggerDownload(`${name}-${slug}.${ext}`, new Blob([content], { type: ext === "json" ? "application/json" : "text/plain" }));
  }

  const tabs: { key: PreviewTab; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Overview", icon: Eye },
    { key: "agent", label: "Brand Agent", icon: Bot },
    { key: "research", label: "Market Research", icon: Search },
    { key: "strategy", label: "Brand Strategy", icon: Compass },
    { key: "tokens", label: "Tokens & DESIGN.md", icon: Code },
    { key: "guide", label: "Brand Guide", icon: FileText },
    { key: "skills", label: "AI Skills & Prompts", icon: Zap },
    { key: "mockups", label: "Brand in Context", icon: Globe },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <Link href={`/portal/progress?order=${id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to progress
        </Link>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Your brand is ready</h1>
            <p className="mt-1 text-muted-foreground">
              {brief.businessName} — {tier?.name} tier. Preview everything below, then download what you need.
            </p>
          </div>
        </div>
      </div>

      {/* Download row */}
      <div className="flex flex-wrap gap-3">
        <Button className="gap-2" onClick={downloadGuide}>
          {done === "guide" ? <><CheckCircle2 className="h-4 w-4" /> Downloaded</> : <><Download className="h-4 w-4" /> Brand Guide PDF</>}
        </Button>
        <Button className="gap-2" onClick={downloadZip} disabled={zipping}>
          {zipping ? <><Loader2 className="h-4 w-4 animate-spin" /> Packaging…</> : done === "zip" ? <><CheckCircle2 className="h-4 w-4" /> Downloaded</> : <><Download className="h-4 w-4" /> Full Package .zip</>}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-border pb-0">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {t.key === "agent" && <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-primary" />}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <OverviewTab brief={brief} strategy={strategy} verbal={verbal} direction={direction} tier={tier!} versions={versions} competitors={competitors} />
        )}
        {activeTab === "agent" && (
          <BrandAgentTab brief={brief} strategy={strategy} verbal={verbal} direction={direction} versions={versions} />
        )}
        {activeTab === "research" && (
          <ResearchTab brief={brief} competitors={competitors} />
        )}
        {activeTab === "strategy" && (
          <StrategyTab brief={brief} strategy={strategy} verbal={verbal} />
        )}
        {activeTab === "tokens" && (
          <TokensTab
            tokensJson={tokensJson}
            designMd={designMd}
            expandedFile={expandedFile}
            setExpandedFile={setExpandedFile}
            onDownloadTokens={() => downloadFile("tokens", tokensJson, "json")}
            onDownloadDesignMd={() => downloadFile("DESIGN", designMd, "md")}
          />
        )}
        {activeTab === "guide" && (
          <GuideTab html={buildBrandGuideHtml(brief, direction, strategy, verbal, tier!.id)} />
        )}
        {activeTab === "skills" && (
          <SkillsTab
            claudeSkill={claudeSkill}
            gptInstructions={gptInstructions}
            promptFiles={promptFiles}
            tier={tier!}
            expandedFile={expandedFile}
            setExpandedFile={setExpandedFile}
          />
        )}
        {activeTab === "mockups" && (
          <MockupsTab html={buildBrandInContextHtml(brief, direction, strategy, verbal)} />
        )}
      </div>

      <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
        Built by {STUDIO_NAME} · fully autonomous delivery · this order cost &lt; $20 in compute to produce.
      </div>
    </div>
  );
}

/* ==================== TAB COMPONENTS ==================== */

function OverviewTab({ brief, strategy, verbal, direction, tier, versions, competitors }: {
  brief: any; strategy: any; verbal: any; direction: any; tier: any; versions: any; competitors: any;
}) {
  const primary = direction.colorTokens[0]?.hex || "#1E2A78";
  const accent = direction.colorTokens[1]?.hex || "#C8A24B";
  return (
    <div className="space-y-6">
      {/* Hero card */}
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-8" style={{ background: primary }}>
            <div className="text-white/70 text-xs uppercase tracking-widest mb-2">{STUDIO_NAME} Brand Delivery</div>
            <h2 className="text-4xl font-bold text-white mb-3">{brief.businessName}</h2>
            <p className="text-white/80 text-lg italic">"{verbal.taglineOptions[0]?.tagline || "Strategy you can see."}"</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {brief.desiredAdjectives.map((a: string) => (
                <span key={a} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: accent, color: "#fff" }}>{a}</span>
              ))}
            </div>
          </div>
          <div className="w-full md:w-72 bg-card p-6 flex flex-col items-center justify-center">
            <div dangerouslySetInnerHTML={{ __html: versions[0]?.svg || "" }} className="mb-4" />
            <div className="text-xs text-gray-500 text-center">Full-color lockup</div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{competitors.length}</div>
          <div className="text-xs text-muted-foreground">Competitors analyzed</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{versions.length}</div>
          <div className="text-xs text-muted-foreground">Logo versions</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">3</div>
          <div className="text-xs text-muted-foreground">Brand directions</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">7</div>
          <div className="text-xs text-muted-foreground">AI agents used</div>
        </Card>
      </div>

      {/* Logo versions */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Logo System</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {versions.map((v: any) => (
            <div key={v.key} className="text-center">
              <div className="rounded-lg border border-border p-4 flex items-center justify-center min-h-[80px]" style={{ background: v.bg }}>
                <div dangerouslySetInnerHTML={{ __html: v.svg }} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{v.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Color palette */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {direction.colorTokens.map((c: any) => (
            <div key={c.hex} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg border border-black/10 shrink-0" style={{ background: c.hex }} />
              <div className="text-xs">
                <div className="font-medium">{c.name}</div>
                <div className="text-muted-foreground">{c.hex}</div>
                <div className="text-primary text-[10px]">{c.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick strategy */}
      <Card className="p-6">
        <h3 className="font-medium mb-3">Strategy Snapshot</h3>
        <div className="space-y-3 text-sm">
          <div><span className="text-muted-foreground">Archetype:</span> <span className="font-medium">{strategy.archetypePrimary}</span> (primary) / <span className="font-medium">{strategy.archetypeSecondary}</span> (secondary)</div>
          <div><span className="text-muted-foreground">Golden Why:</span> <span className="italic">"{strategy.goldenWhy}"</span></div>
          <div><span className="text-muted-foreground">Positioning:</span> {strategy.positioningStatement}</div>
        </div>
      </Card>
    </div>
  );
}

function ResearchTab({ brief, competitors }: { brief: any; competitors: any[] }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-medium mb-4 flex items-center gap-2"><Search className="h-4 w-4 text-primary" /> Competitive Landscape</h3>
        <div className="space-y-4">
          {competitors.map((c, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{c.name}</span>
                <Badge variant="outline">{c.priceTier}</Badge>
              </div>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <div><span className="text-foreground/70">Positioning:</span> {c.positioning}</div>
                <div><span className="text-foreground/70">Visual style:</span> {c.visualStyle}</div>
                <div><span className="text-foreground/70">Key insight:</span> {c.note}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-medium mb-3">Market Gap Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Where incumbents go broad and polished, <strong>{brief.businessName}</strong> can carve a defensible position by being{" "}
          <strong>{brief.desiredAdjectives.join(", ")}</strong> — and explicitly never {brief.explicitExclusions.toLowerCase().split(",")[0].trim()}.
        </p>
        <div className="mt-4 rounded-lg bg-primary/5 border border-primary/20 p-4 text-sm">
          <strong className="text-primary">Recommended wedge:</strong> own the{" "}
          {brief.desiredAdjectives.slice(0, 2).join(" + ")} position. Currently underserved and aligns with audience preference.
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-medium mb-3">Discovery Brief</h3>
        <div className="grid gap-2 text-sm">
          <div><span className="text-muted-foreground">Business:</span> {brief.whatTheySell}</div>
          <div><span className="text-muted-foreground">Audience:</span> {brief.targetAudience}</div>
          <div><span className="text-muted-foreground">Market:</span> {brief.primaryMarket}</div>
          <div><span className="text-muted-foreground">Admiration:</span> {brief.brandAdmirationReference}</div>
        </div>
      </Card>
    </div>
  );
}

function StrategyTab({ brief, strategy, verbal }: { brief: any; strategy: any; verbal: any }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-medium mb-4 flex items-center gap-2"><Compass className="h-4 w-4 text-primary" /> Strategic Foundation</h3>
        <div className="space-y-4">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Archetype</div>
            <div className="flex gap-2">
              <Badge variant="accent">{strategy.archetypePrimary} (primary)</Badge>
              <Badge variant="outline">{strategy.archetypeSecondary} (secondary)</Badge>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Golden Why</div>
            <p className="text-lg italic text-foreground/90">"{strategy.goldenWhy}"</p>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Positioning Statement</div>
            <p className="text-sm">{strategy.positioningStatement}</p>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Brand Attributes</div>
            <div className="flex flex-wrap gap-2">
              {brief.desiredAdjectives.map((a: string) => (
                <span key={a} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{a}</span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-medium mb-4 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Voice &amp; Tone</h3>
        <div className="space-y-3">
          {verbal.voiceAttributes.map((v: any, i: number) => (
            <div key={i} className="rounded-lg bg-secondary/40 p-4 text-sm">
              <div className="font-medium mb-1">{v.name}</div>
              <div className="text-muted-foreground mb-2">{v.definition}</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded bg-emerald-500/10 p-2"><strong className="text-emerald-600">Do:</strong> {v.doExample}</div>
                <div className="rounded bg-red-500/10 p-2"><strong className="text-red-500">Don't:</strong> {v.dontExample}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-medium mb-3">Messaging Pillars</h3>
          <ul className="space-y-2 text-sm">
            {verbal.messagingPillars.map((p: string, i: number) => (
              <li key={i} className="flex gap-2"><span className="text-primary">→</span> {p}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <h3 className="font-medium mb-3">Tagline Candidates</h3>
          <ul className="space-y-3 text-sm">
            {verbal.taglineOptions.map((t: any, i: number) => (
              <li key={i}>
                <span className="font-medium">"{t.tagline}"</span>
                <div className="text-xs text-muted-foreground mt-0.5">{t.rationale}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function TokensTab({ tokensJson, designMd, expandedFile, setExpandedFile, onDownloadTokens, onDownloadDesignMd }: {
  tokensJson: string; designMd: string; expandedFile: string | null;
  setExpandedFile: (s: string | null) => void; onDownloadTokens: () => void; onDownloadDesignMd: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Machine-readable files that make your brand work in Figma, Tailwind, ChatGPT, and Cursor.</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onDownloadTokens}><Download className="h-3 w-3 mr-1" /> tokens.json</Button>
          <Button size="sm" variant="outline" onClick={onDownloadDesignMd}><Download className="h-3 w-3 mr-1" /> DESIGN.md</Button>
        </div>
      </div>

      {/* tokens.json */}
      <Card className="overflow-hidden">
        <button onClick={() => setExpandedFile(expandedFile === "tokens" ? null : "tokens")} className="flex w-full items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">tokens.tokens.json</span>
            <Badge variant="outline" className="text-[10px]">W3C DTCG 2025.10</Badge>
          </div>
          {expandedFile === "tokens" ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </button>
        {expandedFile === "tokens" && (
          <div className="border-t border-border">
            <pre className="p-4 text-xs leading-relaxed overflow-x-auto bg-secondary/20 max-h-96"><code>{tokensJson}</code></pre>
          </div>
        )}
      </Card>

      {/* DESIGN.md */}
      <Card className="overflow-hidden">
        <button onClick={() => setExpandedFile(expandedFile === "design" ? null : "design")} className="flex w-full items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">DESIGN.md</span>
            <Badge variant="outline" className="text-[10px]">Human-readable</Badge>
          </div>
          {expandedFile === "design" ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </button>
        {expandedFile === "design" && (
          <div className="border-t border-border">
            <pre className="p-4 text-xs leading-relaxed overflow-x-auto bg-secondary/20 max-h-96 whitespace-pre-wrap">{designMd}</pre>
          </div>
        )}
      </Card>

      {/* Token preview */}
      <Card className="p-6">
        <h3 className="font-medium mb-3 text-sm">Token Preview</h3>
        <div className="grid grid-cols-2 gap-3">
          {(() => {
            const parsed = JSON.parse(tokensJson);
            return Object.entries(parsed.tokens).map(([key, val]: [string, any]) => (
              <div key={key} className="flex items-center gap-3 rounded-lg border border-border p-3">
                {val.$type === "color" && <div className="w-8 h-8 rounded border border-black/10 shrink-0" style={{ background: val.$value }} />}
                <div className="text-xs">
                  <div className="font-mono font-medium">{key}</div>
                  <div className="text-muted-foreground">{val.$value}</div>
                </div>
              </div>
            ));
          })()}
        </div>
      </Card>
    </div>
  );
}

function GuideTab({ html }: { html: string }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4 text-primary" /> Brand Guide Preview
        </div>
        <Badge variant="outline">Full HTML document</Badge>
      </div>
      <iframe
        srcDoc={html}
        className="w-full border-0 bg-card"
        style={{ height: "70vh" }}
        title="Brand Guide Preview"
      />
    </Card>
  );
}

function SkillsTab({ claudeSkill, gptInstructions, promptFiles, tier, expandedFile, setExpandedFile }: {
  claudeSkill: string; gptInstructions: string; promptFiles: Record<string, string>;
  tier: any; expandedFile: string | null; setExpandedFile: (s: string | null) => void;
}) {
  const isStarter = tier.id === "starter";
  const files: { name: string; content: string; icon: React.ElementType }[] = [];
  if (!isStarter) {
    files.push({ name: "skills/claude-skill.md", content: claudeSkill, icon: Sparkles });
    files.push({ name: "skills/gpt-custom-instructions.md", content: gptInstructions, icon: Sparkles });
    for (const [name, content] of Object.entries(promptFiles)) {
      files.push({ name: `prompts/${name}`, content, icon: MessageSquare });
    }
  }

  return (
    <div className="space-y-4">
      {isStarter ? (
        <Card className="p-8 text-center text-muted-foreground text-sm">
          AI skills and prompts are included in Signature and Authority tiers. Upgrade to get Claude, GPT, and Gemini skills pre-loaded with your brand.
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">Ready-to-use instructions for AI tools. Paste into ChatGPT, Claude, Cursor, or Gemini to get on-brand output instantly.</p>
          {files.map((f) => (
            <Card key={f.name} className="overflow-hidden">
              <button onClick={() => setExpandedFile(expandedFile === f.name ? null : f.name)} className="flex w-full items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-2">
                  <f.icon className="h-4 w-4 text-primary" />
                  <span className="font-mono text-sm">{f.name}</span>
                </div>
                {expandedFile === f.name ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </button>
              {expandedFile === f.name && (
                <div className="border-t border-border">
                  <pre className="p-4 text-xs leading-relaxed overflow-x-auto bg-secondary/20 max-h-64 whitespace-pre-wrap">{f.content}</pre>
                </div>
              )}
            </Card>
          ))}
        </>
      )}
    </div>
  );
}

function MockupsTab({ html }: { html: string }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Globe className="h-4 w-4 text-primary" /> Brand in Context
        </div>
        <Badge variant="outline">Touchpoint mockups</Badge>
      </div>
      <iframe
        srcDoc={html}
        className="w-full border-0 bg-card"
        style={{ height: "70vh" }}
        title="Brand in Context Preview"
      />
    </Card>
  );
}

/* ==================== BRAND AGENT (preview) ==================== */

type AgentArtifactType = "instagram" | "linkedin" | "email";

interface AgentArtifact {
  type: AgentArtifactType;
  payload: any;
}

interface AgentMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  displayed: string;
  artifact?: AgentArtifact;
  streaming: boolean;
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || "")
      .join("") || "B"
  );
}

function buildAgentReply(
  prompt: string,
  ctx: { brief: any; strategy: any; verbal: any; direction: any; versions: any[] },
): { text: string; artifact?: AgentArtifact } {
  const { brief, strategy, verbal, direction, versions } = ctx;
  const primary = direction.colorTokens[0]?.hex || "#1E2A78";
  const accent = direction.colorTokens[1]?.hex || "#C8A24B";
  const tagline = verbal.taglineOptions[0]?.tagline || "Strategy you can see.";
  const voice = verbal.voiceAttributes[0]?.name || "confident";
  const adjective = brief.desiredAdjectives[0] || "distinct";
  const lower = prompt.toLowerCase();

  if (lower.includes("instagram") || lower.includes("drop") || lower.includes("launch")) {
    const light = direction.colorTokens.find((c: any) => /paper|mist|bone|background|ivory|linen|cloud/i.test(c.usage))?.hex || "#ffffff";
    const archetype = archetypeByName(direction.archetype);
    const iconSvg = archetype ? archetype.mark(64, light) : versions.find((v: any) => v.key === "reversed")?.svg;
    return {
      text: `Using your ${direction.archetype} palette and ${voice} voice — here's a launch post, on-brand out of the box:`,
      artifact: {
        type: "instagram",
        payload: { bg: primary, logoSvg: iconSvg, headline: "New. Now available.", sub: brief.businessName },
      },
    };
  }
  if (lower.includes("linkedin") || lower.includes("announce") || lower.includes("rebrand")) {
    return {
      text: `Here's a LinkedIn announcement pulling straight from your positioning and messaging pillars:`,
      artifact: {
        type: "linkedin",
        payload: {
          name: brief.businessName,
          initials: initials(brief.businessName),
          accent,
          body: `We just rebuilt what ${brief.businessName} stands for. ${strategy.positioningStatement}\n\n${verbal.messagingPillars[0] || tagline}`,
        },
      },
    };
  }
  if (lower.includes("email") || lower.includes("subject")) {
    return {
      text: `Three subject lines in your voice — ${adjective}, never generic:`,
      artifact: {
        type: "email",
        payload: {
          lines: [
            tagline,
            `The ${adjective} way to ${(brief.whatTheySell || "get this done").toLowerCase()}`,
            `A quick look at what's next for ${brief.businessName}`,
          ],
        },
      },
    };
  }
  const exclusion = (brief.explicitExclusions || "generic, forgettable").toLowerCase().split(",")[0].trim();
  return {
    text: `Working from your brand context — ${strategy.archetypePrimary} archetype, ${adjective} tone, never ${exclusion}. Here's a first pass on "${prompt}":\n\n"${tagline}" — reframed for this ask. Want it shorter, longer, or in a different channel?`,
  };
}

function AgentArtifactCard({ artifact }: { artifact: AgentArtifact }) {
  if (artifact.type === "instagram") {
    const { bg, headline, sub, logoSvg } = artifact.payload;
    return (
      <div className="mt-3 w-56 overflow-hidden rounded-xl border border-border/50">
        <div className="flex aspect-square flex-col items-center justify-center gap-3 p-5 text-center" style={{ background: bg }}>
          <div className="h-8 w-8 [&_svg]:h-full [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: logoSvg || "" }} />
          <div className="text-base font-semibold text-white">{headline}</div>
          <div className="text-[11px] uppercase tracking-widest text-white/70">{sub}</div>
        </div>
        <div className="flex items-center gap-1.5 bg-card px-3 py-2 text-[11px] text-muted-foreground">
          <Instagram className="h-3 w-3" /> Post preview
        </div>
      </div>
    );
  }
  if (artifact.type === "linkedin") {
    const { name, initials: init, accent, body } = artifact.payload;
    return (
      <div className="mt-3 w-72 rounded-xl border border-border/50 bg-card p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ background: accent }}>
            {init}
          </div>
          <div className="text-xs font-medium">{name}</div>
        </div>
        <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">{body}</p>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Linkedin className="h-3 w-3" /> Post preview
        </div>
      </div>
    );
  }
  const { lines } = artifact.payload;
  return (
    <div className="mt-3 w-72 rounded-xl border border-border/50 bg-card p-4">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Mail className="h-3 w-3" /> Subject line options
      </div>
      <ul className="space-y-1.5 text-xs">
        {lines.map((l: string, i: number) => (
          <li key={i} className="rounded-lg bg-secondary/40 px-2.5 py-1.5">{l}</li>
        ))}
      </ul>
    </div>
  );
}

function BrandAgentTab({ brief, strategy, verbal, direction, versions }: {
  brief: any; strategy: any; verbal: any; direction: any; versions: any[];
}) {
  const greeting = `Hey — I'm ${brief.businessName}'s Brand Agent. I already know your positioning, voice, and tokens. Try one of these, or ask me anything:`;
  const [messages, setMessages] = useState<AgentMessage[]>([
    { id: "greet", role: "agent", text: greeting, displayed: greeting, streaming: false },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  function streamIn(id: string, fullText: string) {
    const words = fullText.split(" ");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, displayed: words.slice(0, i).join(" "), streaming: i < words.length } : m)),
      );
      if (i >= words.length) clearInterval(interval);
    }, 28);
  }

  function handleSend(promptOverride?: string) {
    const text = (promptOverride ?? input).trim();
    if (!text || thinking) return;
    const userMsg: AgentMessage = { id: `u-${Date.now()}`, role: "user", text, displayed: text, streaming: false };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    const reply = buildAgentReply(text, { brief, strategy, verbal, direction, versions });
    setTimeout(() => {
      setThinking(false);
      const id = `a-${Date.now()}`;
      setMessages((m) => [...m, { id, role: "agent", text: reply.text, displayed: "", artifact: reply.artifact, streaming: true }]);
      streamIn(id, reply.text);
    }, 700 + Math.random() * 500);
  }

  const suggestions = [
    "Design an Instagram post for our next drop",
    "Write a LinkedIn post announcing our rebrand",
    "Give me 3 subject lines for our next email",
  ];

  return (
    <div className="space-y-4">
      <Card className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium">Brand Agent</div>
            <div className="text-xs text-muted-foreground">Same tokens, same voice — every asset, on demand.</div>
          </div>
        </div>
        <Badge variant="outline">Preview</Badge>
      </Card>

      <Card className="flex flex-col overflow-hidden">
        <div ref={scrollRef} className="max-h-[440px] min-h-[320px] space-y-4 overflow-y-auto p-5">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-secondary/50",
                )}
              >
                <span className="whitespace-pre-wrap">{m.displayed}</span>
                {m.streaming && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-current/60 align-middle" />}
                {m.artifact && !m.streaming && <AgentArtifactCard artifact={m.artifact} />}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-secondary/50 px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 border-t border-border p-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 border-t border-border p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for a post, an email, a one-pager…"
            disabled={thinking}
            className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary/50 disabled:opacity-60"
          />
          <Button type="submit" size="sm" className="gap-1.5 rounded-full" disabled={thinking || !input.trim()}>
            <Send className="h-3.5 w-3.5" /> Send
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function DeliveryPage() {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
      <DeliveryInner />
    </Suspense>
  );
}
