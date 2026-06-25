"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Phone, Sparkles, FileText, Package, ShieldCheck,
  Clock, Layers, Zap, MessageSquare, Star, Check,
  Search, Compass, Palette, Terminal, Code,
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
  { q: "Why would I pay for something AI-generated?", a: "You're not paying for 'AI-generated' — you're paying for a complete brand system: strategy, identity, voice, tokens, and AI skills. The AI is how we deliver it in hours instead of months. The output is the same quality an agency would produce — strategy-first, visually consistent, ready to use everywhere." },
  { q: "Is this just a logo?", a: "No. You get a complete brand system: positioning strategy, visual identity (3 directions, 4 logo versions each), voice guidelines, design tokens (W3C DTCG 2025.10), market research, AI skills for ChatGPT/Claude/Gemini, and 5 prompt templates. A logo is maybe 10% of what we deliver." },
  { q: "How is this different from Canva or Looka?", a: "Canva and Looka give you a logo. We give you a brand system — strategy, identity, voice, tokens, and AI skills that make every tool you use stay on-brand. Canva doesn't know your positioning. We build everything from your strategy." },
  { q: "How is this different from an agency?", a: "Same deliverables, different economics. An agency charges $5k–$50k and takes 6–16 weeks. We deliver in hours at $299–$997. The difference is overhead — we don't have account managers, creative directors on salary, or office space. Just the craft." },
  { q: "What if I don't like what I receive?", a: "You get revision rounds based on your tier (1–3 structural rounds), plus unlimited free adjustments. Our Creative Director agent responds to bigger changes with strategic reasoning — and after one pushback, applies your call with a documented trade-off." },
  { q: "Will my developer or designer be able to use this?", a: "Yes. The Brand Context Package uses the W3C DTCG 2025.10 token standard — drag tokens into Figma, import into Tailwind, and your whole stack stays on-brand. We also ship AI skills for Claude, GPT, and Gemini so every AI output sounds like your brand." },
  { q: "How long does it take?", a: "The discovery call happens immediately after checkout — no scheduling. The brand system is built in hours. Starter and Signature deliver same-day. Authority is priority delivery within 24 hours." },
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
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Brand identity system, not just a logo
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl animate-fade-in-up stagger-1">
              Your brand needs a system.<br />Not a logo file.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground animate-fade-in-up stagger-2">
              Strategy, visual identity, voice guidelines, design tokens, AI skills, and prompt templates —
              everything that makes your brand work across every tool, every touchpoint, every time.
              Delivered in hours. Priced for founders, not enterprises.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in-up stagger-3">
              <Link href="/checkout">
                <Button size="lg" className="gap-2">
                  Get your brand system <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#problem">
                <Button size="lg" variant="outline">Why this matters</Button>
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted-foreground/70 animate-fade-in-up stagger-4">
              $299–$997 one-time · No retainers · No surprise invoices
            </p>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section id="problem" className="border-b border-border/60 py-20">
        <div className="container">
          <RevealSection>
            <div className="mx-auto max-w-3xl text-center mb-14">
              <Badge variant="accent" className="mb-5 gap-1.5">The problem</Badge>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Branding is broken. You&apos;re paying for the overhead, not the craft.
              </h2>
            </div>
          </RevealSection>

          <div className="mx-auto max-w-4xl space-y-8">
            <RevealSection>
              <Card className="p-8 border-l-4 border-l-red-500">
                <h3 className="text-lg font-semibold mb-3">DIY tools give you a logo. That&apos;s it.</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Canva, Looka, Hatchful — they spit out a logo in 5 minutes. No strategy. No guidelines.
                  No system. Your developer can&apos;t use it. Your designer ignores it. And your customers
                  can tell it was made in a template. <strong>You saved money but lost credibility.</strong>
                </p>
              </Card>
            </RevealSection>

            <RevealSection delay={0.1}>
              <Card className="p-8 border-l-4 border-l-amber-500">
                <h3 className="text-lg font-semibold mb-3">Agencies give you a PDF. That&apos;s it.</h3>
                <p className="text-muted-foreground leading-relaxed">
                  6–16 weeks. $5k–$50k. Three rounds of revisions. You get a beautiful brand guide PDF
                  that sits in a Google Drive folder. Your developer asks &ldquo;what are the tokens?&rdquo; —
                  there are none. Your designer asks &ldquo;what font do I use?&rdquo; — it&apos;s buried on page 23.
                  <strong> You paid for a document, not a system.</strong>
                </p>
              </Card>
            </RevealSection>

            <RevealSection delay={0.2}>
              <Card className="p-8 border-l-4 border-l-primary">
                <h3 className="text-lg font-semibold mb-3">The real cost isn&apos;t the money — it&apos;s the time.</h3>
                <p className="text-muted-foreground leading-relaxed">
                  While you wait 3 months for an agency, your competitors are launching. Your investors
                  are asking &ldquo;where&apos;s the brand?&rdquo; Your developer is building with default styles.
                  <strong> Every week without a brand system is a week you look like you don&apos;t have your shit together.</strong>
                </p>
              </Card>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* THE SOLUTION */}
      <section className="border-b border-border/60 bg-secondary/30 py-20">
        <div className="container">
          <RevealSection>
            <div className="mx-auto max-w-3xl text-center mb-14">
              <Badge variant="accent" className="mb-5 gap-1.5">The solution</Badge>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                A brand system that works everywhere. Not just in a PDF.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Forge gives you everything a brand needs to function — strategy, identity, voice, tokens, and AI skills —
                in one package that works with the tools you already use.
              </p>
            </div>
          </RevealSection>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Compass, title: "Strategy that&apos;s defensible", body: "Positioning statement, archetype, Golden Why, brand attributes. Not 'we like blue' — a strategic foundation that makes every visual and verbal choice defensible." },
              { icon: Palette, title: "Identity that scales", body: "3 custom logo directions. Full/mono/reversed/compact versions. Color palette with usage rules. Typography system. Works from favicon to billboard." },
              { icon: MessageSquare, title: "Voice that&apos;s consistent", body: "3 voice attributes with do/don't examples. Messaging pillars. Tagline candidates. Your brand sounds like itself everywhere — website, email, social, ads." },
              { icon: Code, title: "Tokens that work in code", body: "W3C DTCG 2025.10 design tokens. Drop into Figma. Import into Tailwind. Your developer builds on-brand from day one. No guesswork." },
              { icon: Zap, title: "AI skills that keep you on-brand", body: "Ready-made instructions for Claude, GPT, and Gemini. Paste them in and every AI output sounds like your brand. 5 prompt templates included." },
              { icon: Search, title: "Research that informs everything", body: "Competitive landscape, positioning map, gap analysis. Know exactly where your brand fits and why. Not vibes — data." },
            ].map((s, i) => (
              <RevealSection key={i} delay={i * 0.08}>
                <Card className="p-6 h-full">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-medium" dangerouslySetInnerHTML={{ __html: s.title }} />
                  <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: s.body }} />
                </Card>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHY FORGE */}
      <section className="border-b border-border/60 py-20">
        <div className="container">
          <RevealSection>
            <div className="mx-auto max-w-3xl text-center mb-14">
              <Badge variant="accent" className="mb-5 gap-1.5">Why Forge</Badge>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                What makes this different from everything else
              </h2>
            </div>
          </RevealSection>

          <div className="mx-auto max-w-4xl">
            <RevealSection>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-4 bg-muted/50 text-xs font-medium text-muted-foreground">
                  <div className="p-4"></div>
                  <div className="p-4 text-center">DIY Tools</div>
                  <div className="p-4 text-center">Agencies</div>
                  <div className="p-4 text-center bg-primary/5 text-primary font-semibold">Forge</div>
                </div>
                {[
                  { feature: "Brand strategy", diy: "—", agency: "✓", forge: "✓" },
                  { feature: "Visual identity", diy: "Logo only", agency: "✓", forge: "✓" },
                  { feature: "Voice guidelines", diy: "—", agency: "Partial", forge: "✓" },
                  { feature: "Design tokens", diy: "—", agency: "—", forge: "✓" },
                  { feature: "AI skills / prompts", diy: "—", agency: "—", forge: "✓" },
                  { feature: "Works in Figma", diy: "—", agency: "PDF", forge: "✓ Tokens" },
                  { feature: "Works in code", diy: "—", agency: "—", forge: "✓ Tailwind" },
                  { feature: "Works in ChatGPT", diy: "—", agency: "—", forge: "✓ Skills" },
                  { feature: "Delivery time", diy: "Minutes", agency: "6-16 weeks", forge: "Hours" },
                  { feature: "Cost", diy: "$0-50", agency: "$5k-50k", forge: "$299-997" },
                ].map((row, i) => (
                  <div key={i} className={`grid grid-cols-4 text-sm border-t border-border ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                    <div className="p-4 font-medium">{row.feature}</div>
                    <div className="p-4 text-center text-muted-foreground">{row.diy}</div>
                    <div className="p-4 text-center text-muted-foreground">{row.agency}</div>
                    <div className="p-4 text-center font-medium bg-primary/5">{row.forge}</div>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* THE DISCOVERY CALL */}
      <section className="border-b border-border/60 bg-secondary/30 py-20">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <RevealSection>
            <Badge variant="accent" className="mb-5 gap-1.5">
              <Phone className="h-3.5 w-3.5" /> How it starts
            </Badge>
            <h2 className="mb-5 text-3xl font-semibold tracking-tight md:text-4xl">
              Tell us about your business. We&apos;ll build the strategy while you talk.
            </h2>
            <p className="text-lg text-muted-foreground">
              No forms. No mood boards. No scheduling. Just click and talk — our strategist
              researches your market in real time, captures your positioning, and builds a
              brief that drives every visual and verbal choice in your brand system.
            </p>
            <ul className="mt-7 space-y-3 text-sm">
              {["Real-time competitor research while you speak", "Captures your positioning, not just your preferences", "Produces a strategic brief that drives the entire brand", "Transcript and research included in your deliverables"].map((f) => (
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
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-medium">F</span>
                  <div>
                    <div className="text-sm font-medium">{STUDIO_NAME} Strategist</div>
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

      {/* HOW IT WORKS */}
      <section id="how" className="border-b border-border/60 py-20">
        <div className="container">
          <RevealSection>
            <h2 className="mb-3 text-center text-3xl font-semibold tracking-tight md:text-4xl">What you get</h2>
            <p className="mx-auto mb-14 max-w-xl text-center text-muted-foreground">
              Every brand comes with a complete system — not just a logo, but everything you need to use it everywhere.
            </p>
          </RevealSection>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FileText, title: "Brand Strategy", body: "Positioning statement, archetype, Golden Why, brand attributes. The strategic foundation that makes every visual and verbal choice defensible." },
              { icon: Sparkles, title: "Visual Identity", body: "3 custom logo directions with full/mono/reversed/compact versions. Color palette, typography system, usage guidelines." },
              { icon: MessageSquare, title: "Voice & Tone", body: "3 voice attributes with do/don't examples. Messaging pillars. Tagline candidates. Your brand sounds consistent everywhere." },
              { icon: Package, title: "Design Tokens", body: "W3C DTCG 2025.10 tokens. Drop into Figma, import into Tailwind. Your whole stack stays on-brand automatically." },
              { icon: Search, title: "Market Research", body: "Competitive landscape, positioning map, gap analysis. Know exactly where your brand fits and why." },
              { icon: ShieldCheck, title: "AI Skills & Prompts", body: "Ready-made instructions for Claude, GPT, and Gemini. 5 prompt templates for hero sections, LinkedIn, email, product descriptions, and ads." },
            ].map((s, i) => (
              <RevealSection key={s.title} delay={i * 0.08}>
                <Card className="p-6 h-full">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-medium">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </Card>
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
              <Phone className="h-3.5 w-3.5" /> Discovery call
            </Badge>
            <h2 className="mb-5 text-3xl font-semibold tracking-tight md:text-4xl">
              Tell us about your business. We&apos;ll build the strategy while you talk.
            </h2>
            <p className="text-lg text-muted-foreground">
              No forms. No mood boards. No scheduling. Just click and talk — our strategist
              researches your market in real time, captures your positioning, and builds a
              brief that drives every visual and verbal choice in your brand system.
            </p>
            <ul className="mt-7 space-y-3 text-sm">
              {["Real-time competitor research while you speak", "Captures your positioning, not just your preferences", "Produces a strategic brief that drives the entire brand", "Transcript and research included in your deliverables"].map((f) => (
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
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-medium">F</span>
                  <div>
                    <div className="text-sm font-medium">{STUDIO_NAME} Strategist</div>
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
            <div className="mx-auto max-w-3xl text-center mb-14">
              <Badge variant="accent" className="mb-5 gap-1.5">Pricing</Badge>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                What this would cost otherwise
              </h2>
              <p className="mt-4 text-muted-foreground">
                A branding agency charges $5k–$50k and takes months. We deliver the same system in hours.
                One-time payment. No retainers. No surprise invoices.
              </p>
            </div>
          </RevealSection>
          <PricingCards ctaLabel="Choose {name}" />
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
              Stop waiting for a brand. Start using one.
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              Talk to our strategist, pick a direction, and walk away with a complete brand system —
              strategy, identity, tokens, skills — ready to use everywhere. Today.
            </p>
            <Link href="/checkout">
              <Button size="lg" className="gap-2">Get your brand system <ArrowRight className="h-4 w-4" /></Button>
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
              <span className="text-sm font-medium">A complete brand identity system.</span>
              <span className="ml-2 text-xs text-muted-foreground">From $299</span>
            </div>
            <Link href="/checkout">
              <Button className="gap-2">Get your brand <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
