"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, FileText, Package, Download, Loader2, CheckCircle2,
  Sparkles, Image as ImageIcon, RefreshCw,
} from "lucide-react";
import { useOrderFromQuery } from "@/lib/mock/use-order";
import { getStore } from "@/lib/mock/store";
import { TIERS } from "@/lib/tiers";
import { STUDIO_NAME } from "@/lib/studio";
import { buildPackageFiles, buildBrandGuideHtml, mockStrategy, mockVerbal } from "@/lib/mock/package";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

function DeliveryInner() {
  const { id, order } = useOrderFromQuery();
  const [zipping, setZipping] = useState(false);
  const [done, setDone] = useState<string | null>(null);

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
  const slug = (brief?.businessName || "brand").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  if (order.status !== "delivered" || !brief || !sel) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <p className="text-muted-foreground">Your delivery isn't ready yet.</p>
        <Link href={`/portal/progress?order=${id}`} className="mt-4 inline-block text-primary underline">View progress</Link>
      </div>
    );
  }

  async function downloadZip() {
    if (!brief || !sel || !tier) return;
    setZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const files = buildPackageFiles(brief, sel.direction, tier.id);
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
    if (!brief || !sel || !tier) return;
    const strategy = mockStrategy(brief);
    const verbal = mockVerbal(brief);
    const html = buildBrandGuideHtml(brief, sel.direction, strategy, verbal, tier.id);
    triggerDownload(`brand-guide-${slug}.html`, new Blob([html], { type: "text/html" }));
    setDone("guide");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link href={`/portal/progress?order=${id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to progress
        </Link>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-semibold tracking-tight">Your brand is ready</h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          {brief.businessName} — {tier?.name} tier. Download everything below; it's yours to keep.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col p-6">
          <FileText className="h-8 w-8 text-primary" />
          <h3 className="mt-4 text-lg font-medium">Brand Guide</h3>
          <p className="mt-1 flex-1 text-sm text-muted-foreground">
            The full {tier?.guidePages}-page guidelines document — strategy, voice, logo system, color, typography, do/don't. Opens in your browser; print to PDF.
          </p>
          <Button className="mt-5 gap-2" onClick={downloadGuide}>
            {done === "guide" ? <><CheckCircle2 className="h-4 w-4" /> Downloaded</> : <><Download className="h-4 w-4" /> Download brand guide</>}
          </Button>
        </Card>

        <Card className="flex flex-col p-6">
          <Package className="h-8 w-8 text-primary" />
          <h3 className="mt-4 text-lg font-medium">Brand Context Package</h3>
          <p className="mt-1 flex-1 text-sm text-muted-foreground">
            W3C DTCG 2025.10 <code className="text-xs">tokens.tokens.json</code>, <code className="text-xs">DESIGN.md</code>, SVG assets{tier && tier.id !== "starter" ? ", /skills, /prompts" : ""}. Drop into Figma, Tailwind, ChatGPT, Cursor.
          </p>
          <Button className="mt-5 gap-2" onClick={downloadZip} disabled={zipping}>
            {zipping ? <><Loader2 className="h-4 w-4 animate-spin" /> Packaging…</> : done === "zip" ? <><CheckCircle2 className="h-4 w-4" /> Downloaded</> : <><Download className="h-4 w-4" /> Download .zip</>}
          </Button>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-foreground/80">What's inside the package</h3>
        <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <span>✓ Design tokens (DTCG 2025.10)</span>
          <span>✓ DESIGN.md rationale</span>
          <span>✓ Print-ready SVGs (4 versions)</span>
          <span>✓ Digital logo + favicon SVG</span>
          <span>✓ Social avatar SVG</span>
          <span>✓ Editable master SVG</span>
          {tier && tier.id !== "starter" && <><span>✓ Claude / GPT / Gemini skills</span><span>✓ 5 ready-to-use prompts</span></>}
        </div>
      </Card>

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground/80">Add more</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <UpsellCard icon={RefreshCw} title="Extra revision round" price="$49" body="One more structural revision round for your project." />
          <UpsellCard icon={ImageIcon} title="Extra mockup set" price="$29" body="Three additional context mockups of your brand in use." />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Upsells are mocked in this demo — they'll route through Stripe in production.</p>
      </div>

      <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
        Built by {STUDIO_NAME} · fully autonomous delivery · this order cost &lt; $20 in compute to produce.
      </div>
    </div>
  );
}

function UpsellCard({ icon: Icon, title, price, body }: { icon: React.ElementType; title: string; price: string; body: string }) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary"><Icon className="h-5 w-5" /></div>
      <div className="flex-1">
        <div className="flex items-center gap-2"><span className="font-medium">{title}</span><Badge variant="accent">{price}</Badge></div>
        <p className="text-xs text-muted-foreground">{body}</p>
      </div>
      <Sparkles className="h-4 w-4 text-muted-foreground" />
    </Card>
  );
}

export default function DeliveryPage() {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
      <DeliveryInner />
    </Suspense>
  );
}
