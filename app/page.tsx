"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Phone, Sparkles, FileText, Package, ShieldCheck,
  Clock, Layers, Zap, MessageSquare, Star, Check,
  Search, Compass, Palette, Terminal,
} from "lucide-react";
import { STUDIO_NAME, STUDIO_TAGLINE } from "@/lib/studio";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

const faqs = [
  { q: "Is this just AI slop?", a: "Every direction is validated by our QA system before you see it. No unreviewed AI output ever reaches you — four automated review layers check visual quality, strategy alignment, verbal-visual consistency, and completeness." },
  { q: "What's the difference between adjustments and structural changes?", a: "Adjustments are small tweaks — a color shift, spacing, a copy edit — and they're unlimited and free on every tier. Structural changes swap a concept, overhaul the palette, or change the archetype, and they consume a revision round." },
  { q: "What do I actually receive?", a: "Your call transcript, a discovery document, a full brand guide PDF, all logo versions as SVG, market research, brand strategy, mood board, social media kit, brand-in-context mockups, and a Brand Context Package zip containing design tokens, a DESIGN.md rationale, and ready-to-use skill/prompt files for your AI tools." },
  { q: "Will my developer or designer be able to use this?", a: "Yes. The Brand Context Package uses the W3C DTCG 2025.10 token standard — drag tokens into Figma, import into Tailwind, and your whole stack stays on-brand without manual configuration." },
  { q: "Can I use this with ChatGPT, Cursor, or Midjourney?", a: "Yes. The /skills/ folder ships ready-made instructions for Claude, GPT, and Gemini, plus prompt templates for hero sections, LinkedIn posts, emails, product descriptions, and ad creative." },
  { q: "How long does it take?", a: "Starter and Signature deliver in around 5 business days. Authority is priority delivery in 24 hours. The discovery call happens the moment you pay — no scheduling." },
  { q: "What if I don't like what I receive?", a: "You get structural revision rounds based on your tier, and unlimited free adjustments. Our Creative Director agent responds to bigger changes with strategic reasoning — and after one pushback, applies your call with a documented trade-off." },
];

function AnimatedWaveform() {
  return (
    <div className="flex h-10 items-end gap-1" aria-hidden="true">
      {[6, 14, 9, 18, 12, 22, 8, 16, 11, 20, 7, 13, 10, 17].map((h, i) => (
        <span
          key={i}
          className="w-1 rounded-full bg-primary/50"
          style={{
            height: h,
            animation: `pulse-bar ${0.8 + (i % 3) * 0.2}s ease-in-out ${i * 0.06}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--primary)/0.12),transparent)]" />
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6 gap-1.5 animate-fade-in-up">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Fully autonomous · No humans in the loop
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl animate-fade-in-up stagger-1">
              {STUDIO_TAGLINE}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground animate-fade-in-up stagger-2">
              Research-backed strategy. Professional logo. Complete brand guide. Everything your business
              needs to look like it&apos;s worth trusting — without the agency timeline or the agency invoice.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up stagger-3">
              <Link href="/checkout">
                <Button size="lg" className="gap-2">
                  Start your brand <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#how">
                <Button size="lg" variant="outline">See how it works</Button>
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted-foreground/70 animate-fade-in-up stagger-4">
              Starts with a live AI voice call inside the app · Delivered in hours
            </p>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="border-b border-border/60 py-20">
        <div className="container">
          <RevealSection>
            <h2 className="mx-auto mb-14 max-w-2xl text-center text-3xl font-semibold tracking-tight md:text-4xl">
              Branding is stuck between two broken extremes
            </h2>
          </RevealSection>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Zap, title: "DIY tools", body: "Fast, cheap, and immediately recognizable as AI-generated. No strategy, no guidelines. Your customers can tell." },
              { icon: Clock, title: "Traditional agencies", body: "6–16 weeks. $5k–$50k. Most of the cost is overhead, not craft." },
              { icon: Sparkles, title: STUDIO_NAME, body: "Strategy-led, AI-powered, fully autonomous. Delivered in hours. And it ships with your brand pre-loaded into every AI tool you'll ever use.", highlight: true },
            ].map((s, i) => (
              <RevealSection key={s.title} delay={i * 0.1}>
                <Card className={`p-7 h-full ${s.highlight ? "border-primary/40 bg-primary/[0.03]" : ""}`}>
                  <div className={`mb-4 inline-flex rounded-lg p-2.5 ${s.highlight ? "bg-primary/10" : "bg-secondary"}`}>
                    <s.icon className={`h-5 w-5 ${s.highlight ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.body}</p>
                </Card>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-b border-border/60 py-20">
        <div className="container">
          <RevealSection>
            <h2 className="mb-3 text-center text-3xl font-semibold tracking-tight md:text-4xl">How it works</h2>
            <p className="mx-auto mb-14 max-w-xl text-center text-muted-foreground">
              From payment to a complete brand identity — five steps, zero homework.
            </p>
          </RevealSection>
          <div className="grid gap-6 md:grid-cols-5">
            {[
              { icon: ShieldCheck, title: "Pay & start", body: "Pick your tier, check out, and start your brand call immediately." },
              { icon: Phone, title: "Talk to our AI strategist", body: "Right here in the app. Tell us about your business, customers, and competitors. We research in real time as you speak." },
              { icon: Layers, title: "Receive directions", body: "Strategy-backed visual directions, each with a rationale. Pick the one that's right." },
              { icon: MessageSquare, title: "Refine if needed", body: "Adjustments are always free. Bigger changes go through a structured review process." },
              { icon: Package, title: "Your brand, delivered", body: "PDF brand guide plus the Brand Context Package. Ready to use everywhere." },
            ].map((s, i) => (
              <RevealSection key={s.title} delay={i * 0.08}>
                <div className="relative">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground/60">0{i + 1}</span>
                    <h3 className="text-base font-medium">{s.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.body}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* THE CALL */}
      <section className="border-b border-border/60 bg-secondary/30 py-20">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <RevealSection>
            <Badge variant="accent" className="mb-5 gap-1.5">
              <Phone className="h-3.5 w-3.5" /> The discovery call
            </Badge>
            <h2 className="mb-5 text-3xl font-semibold tracking-tight md:text-4xl">
              Most brand processes start with a form. Ours starts with a conversation.
            </h2>
            <p className="text-lg text-muted-foreground">
              Click a button, and our AI brand strategist joins you for 25 minutes, researches your
              market in real time as you talk, and leaves with everything needed to build your brand
              from the ground up. No homework. No mood boards. No scheduling. Just click and talk.
            </p>
            <ul className="mt-7 space-y-3 text-sm">
              {["Real-time competitor research while you speak", "Adaptive follow-up questions", "A richer brief than any form could capture", "Transcript saved to your portal forever"].map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
          </RevealSection>
          <RevealSection delay={0.15}>
            <Card className="relative overflow-hidden p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,hsl(var(--primary)/0.12),transparent)]" />
              <div className="relative">
                <div className="mb-6 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-medium">A</span>
                  <div>
                    <div className="text-sm font-medium">{STUDIO_NAME} AI Strategist</div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live · in-app call</div>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary/15 px-4 py-2.5 animate-slide-in-right stagger-1">We build CRM tools for indie consultants.</div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary px-4 py-2.5 animate-fade-in-up stagger-2">Love it. I&apos;m looking at Notion and Honeybook now — they position around all-in-one. Do you feel that&apos;s what your market expects, or are you going somewhere different?</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/70 animate-fade-in-up stagger-3"><Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" /> Researching Honeybook…</div>
                </div>
                <div className="mt-6 flex items-end justify-between gap-2">
                  <AnimatedWaveform />
                  <span className="text-xs text-muted-foreground">18:42 remaining</span>
                </div>
              </div>
            </Card>
          </RevealSection>
        </div>
      </section>

      {/* BRAND PACKAGE */}
      <section id="package" className="border-b border-border/60 py-20">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <RevealSection>
            <Card className="order-2 p-7 md:order-1">
              <pre className="overflow-x-auto rounded-lg bg-background/60 p-4 text-xs leading-relaxed text-muted-foreground"><code>{`brand-context-yourbrand-v1/
├── tokens.tokens.json    ← W3C DTCG 2025.10
├── DESIGN.md             ← rationale
├── assets/
│   ├── print/  digital/  social/  editable/
├── skills/               ← Claude · GPT · Gemini
└── prompts/              ← hero · linkedin · email · ads`}</code></pre>
            </Card>
          </RevealSection>
          <RevealSection delay={0.1}>
            <div className="order-1 md:order-2">
              <Badge variant="outline" className="mb-5 gap-1.5"><Package className="h-3.5 w-3.5 text-primary" /> Brand Context Package</Badge>
              <h2 className="mb-5 text-3xl font-semibold tracking-tight md:text-4xl">
                Your brand, pre-loaded into every AI tool you&apos;ll ever use.
              </h2>
              <p className="text-lg text-muted-foreground">
                Every deliverable includes a structured file that speaks natively to AI tools. Drag
                tokens into Figma. Import them into Tailwind. Paste DESIGN.md into ChatGPT or Claude
                and get on-brand content instantly, every time.
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* AGENT PIPELINE */}
      <section className="border-b border-border/60 bg-secondary/30 py-20">
        <div className="container">
          <RevealSection>
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge variant="accent" className="mb-5 gap-1.5"><Terminal className="h-3.5 w-3.5" /> Autonomous pipeline</Badge>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Watch 7 AI agents build your brand</h2>
              <p className="mt-4 text-muted-foreground">
                Every project runs through a fully autonomous pipeline. You can watch each agent work in real time — research, strategy, visual, QA — or just wait for the notification that your brand is ready.
              </p>
            </div>
          </RevealSection>
          <div className="mx-auto max-w-3xl">
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6">
                {[
                  { icon: Search, agent: "Research Agent", time: "~7s demo", desc: "Crawls competitors, maps the market gap, builds competitive profiles.", color: "text-blue-500" },
                  { icon: Compass, agent: "Strategy Agent", time: "~7s demo", desc: "Selects archetype, crafts Golden Why, writes positioning statement.", color: "text-purple-500" },
                  { icon: MessageSquare, agent: "Verbal Identity Agent", time: "~6s demo", desc: "Defines voice spectrum, messaging pillars, tagline candidates.", color: "text-emerald-500" },
                  { icon: Palette, agent: "Visual Agent", time: "~8s demo", desc: "Generates 3 vector logo directions via Recraft V4.1 Pro.", color: "text-amber-500" },
                  { icon: ShieldCheck, agent: "QA Review Agent", time: "~6s demo", desc: "4-layer validation: visual, strategy, verbal, completeness.", color: "text-red-500" },
                ].map((s, i) => (
                  <RevealSection key={s.agent} delay={i * 0.1}>
                    <div className="relative flex gap-4">
                      <div className="relative z-10 grid h-12 w-12 place-items-center rounded-xl border border-border bg-background text-lg">
                        <s.icon className={`h-5 w-5 ${s.color}`} />
                      </div>
                      <div className="flex-1 rounded-xl border border-border bg-background p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{s.agent}</span>
                          <span className="text-xs text-muted-foreground font-mono">{s.time}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                      </div>
                    </div>
                  </RevealSection>
                ))}
              </div>
              <div className="mt-6 ml-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
                <p className="text-sm font-medium text-primary">Your brand is ready — review directions in your portal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="border-b border-border/60 py-20">
        <div className="container">
          <RevealSection>
            <h2 className="mb-3 text-center text-3xl font-semibold tracking-tight md:text-4xl">Built for founders who move fast</h2>
            <p className="mx-auto mb-14 max-w-xl text-center text-muted-foreground">
              Early access clients are building their brands right now. Real case studies land after our first pilot cohort ships.
            </p>
          </RevealSection>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { role: "SaaS founder", quote: "I had a full brand system in an afternoon. The strategy doc alone was worth it." },
              { role: "Consultancy", quote: "The voice call was wild — it actually researched my competitors live." },
              { role: "DTC brand", quote: "My developer dropped the tokens into Tailwind and everything just matched." },
            ].map((t, i) => (
              <RevealSection key={t.role} delay={i * 0.1}>
                <Card className="p-7 h-full">
                  <div className="mb-4 flex gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="mb-5 text-sm text-foreground/90">{t.quote}</p>
                  <div className="text-xs text-muted-foreground">{t.role} · pilot cohort</div>
                </Card>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="border-b border-border/60 py-20">
        <div className="container">
          <RevealSection>
            <h2 className="mb-3 text-center text-3xl font-semibold tracking-tight md:text-4xl">Simple, one-time pricing</h2>
            <p className="mx-auto mb-14 max-w-xl text-center text-muted-foreground">
              No retainers. No agency overhead. Adjustments are always free.
            </p>
          </RevealSection>
          <PricingCards ctaLabel="Choose {name}" />
          <p className="mt-8 text-center text-xs text-muted-foreground/70">
            Billed in USD. Pilot cohort may see local estimates (BRL · EUR · GBP) at checkout.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container max-w-3xl">
          <RevealSection>
            <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight md:text-4xl">FAQ</h2>
          </RevealSection>
          <div className="divide-y divide-border">
            {faqs.map((f, i) => (
              <RevealSection key={f.q} delay={i * 0.05}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium list-none">
                    {f.q}
                    <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
                </details>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-border/60 bg-secondary/30 py-20">
        <div className="container text-center">
          <RevealSection>
            <h2 className="mx-auto mb-5 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
              Your brand is one conversation away.
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              Pay now, talk to your AI strategist in the next minute, and have a complete brand identity in days.
            </p>
            <Link href="/checkout">
              <Button size="lg" className="gap-2">Start your brand <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </RevealSection>
        </div>
      </section>

      <MarketingFooter />

      {/* Sticky CTA */}
      {showSticky && (
        <div className="fixed bottom-0 inset-x-0 z-50 border-t border-border/60 bg-background/90 backdrop-blur-xl py-3 px-4 animate-fade-in-up">
          <div className="container flex items-center justify-between">
            <div className="hidden sm:block">
              <span className="text-sm font-medium">Your brand is one conversation away.</span>
              <span className="ml-2 text-xs text-muted-foreground">From $299</span>
            </div>
            <Link href="/checkout">
              <Button className="gap-2">Start your brand <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
