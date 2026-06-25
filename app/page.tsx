"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Phone, Sparkles, FileText, Package, ShieldCheck,
  Zap, MessageSquare, Star, Check,
  Search, Compass, Palette, Code,
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
  { q: "Why not just use Looka or Canva?", a: "Looka gives you a logo for $20-$96. That's it. No strategy. No voice guidelines. No design tokens your developer can use. No market research. No AI skills. You end up with a logo that looks like 10,000 other businesses. We give you a brand system that works in Figma, Tailwind, ChatGPT, and Cursor — not just a logo file." },
  { q: "Why not hire a branding agency?", a: "The average agency charges $71,651 (Clutch data) and takes 6-16 weeks. We deliver the same deliverables — strategy, identity, voice, tokens — in hours for $299-$997. The difference is overhead: we don't have account managers, creative directors on salary, or office space. Just the craft." },
  { q: "How is this different from a freelancer?", a: "A freelancer gives you a logo and maybe some colors for $1K-$5K. No strategy. No voice. No tokens. No research. You get a pretty file, not a system. We give you everything an agency would deliver — strategy, identity, voice, tokens, AI skills — at a fraction of the cost." },
  { q: "What if I don't like what I receive?", a: "You get revision credits based on your tier (1–7 credits), plus unlimited free adjustments. Our Creative Director agent responds to bigger changes with strategic reasoning — and after one pushback, applies your call with a documented trade-off." },
  { q: "Will my developer or designer be able to use this?", a: "Yes. The Brand Context Package uses the W3C DTCG 2025.10 token standard — drag tokens into Figma, import into Tailwind, and your whole stack stays on-brand. We also ship AI skills for Claude, GPT, and Gemini so every AI output sounds like your brand." },
  { q: "How long does it take?", a: "The discovery call happens immediately after checkout — no scheduling. The brand system is built in hours. Starter and Signature deliver same-day. Authority is priority delivery within 24 hours." },
  { q: "What's included that I can't get elsewhere?", a: "Three things no other tool offers: (1) W3C DTCG design tokens that work in code, (2) AI skills that make ChatGPT/Claude/Gemini sound like your brand, (3) A voice call that researches your competitors in real-time and builds your strategy while you talk. Looka doesn't have these. Agencies charge $15K+ for the first two." },
];

function AnimatedWaveform() {
  return (
    <div className="flex h-10 items-end gap-1" aria-hidden="true">
      {[6, 14, 9, 18, 12, 22, 8, 16, 11, 20, 7, 13, 10, 17].map((h, i) => (
        <span key={i} className="w-1 rounded-full bg-primary/50"
          style={{ height: h, animation: `pulse-bar ${0.8 + (i % 3) * 0.2}s ease-in-out ${i * 0.06}s infinite alternate` }} />
      ))}
    </div>
  );
}

const LOGOS = ["SaaS", "Agency", "Consultancy", "DTC", "Startup", "Freelancer", "E-commerce", "Creator"];

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
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent" />
        <div className="container relative py-36 md:py-48">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="outline" className="mb-8 gap-2 animate-fade-in-up border-primary/30 text-primary px-4 py-2">
              <Sparkles className="h-4 w-4" /> {STUDIO_TAGLINE}
            </Badge>
            <h1 className="text-balance text-5xl font-bold tracking-tight md:text-7xl lg:text-[84px] animate-fade-in-up stagger-1 leading-[1.05]">
              Your brand is losing you<br />
              <span className="text-gradient">$15K–$75K in credibility.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-xl text-muted-foreground animate-fade-in-up stagger-2 leading-relaxed">
              A complete brand system — strategy, identity, voice, tokens, AI skills — for what a freelancer charges for a logo. Delivered in hours, not months. Works in Figma, Tailwind, ChatGPT, and Cursor from day one.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up stagger-3">
              <Link href="/checkout">
                <Button size="lg" className="gap-3 px-10 py-7 text-lg font-semibold shadow-premium hover:shadow-glow transition-all">
                  Get your brand system <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/#problem">
                <Button size="lg" variant="outline" className="px-10 py-7 text-lg">Why this matters</Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-secondary animate-fade-in-up stagger-4">
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> $299–$997 one-time</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> No retainers</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Same-day delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* LOGO BAR */}
      <section className="py-16">
        <div className="container">
          <RevealSection>
            <p className="text-center text-sm font-medium text-secondary mb-10">Trusted by founders, agencies, and teams who move fast</p>
          </RevealSection>
          <div className="relative overflow-hidden logo-bar">
            <div className="flex gap-16 animate-marquee whitespace-nowrap">
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <span key={i} className="text-xl font-semibold text-muted-foreground/20">{logo}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section id="problem" className="py-28 md:py-36">
        <div className="container">
          <RevealSection>
            <div className="mx-auto max-w-3xl text-center mb-20">
              <Badge variant="accent" className="mb-6 gap-2">The problem</Badge>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                95% of buying decisions are subconscious.<br />
                <span className="text-gradient">Your brand is making the wrong one.</span>
              </h2>
              <p className="mt-6 text-xl text-secondary">Businesses with consistent branding see 10–23% more revenue. Meanwhile, you&apos;re losing clients to competitors who look more professional — even if your product is better.</p>
            </div>
          </RevealSection>
          <div className="mx-auto max-w-4xl space-y-8">
            <RevealSection>
              <div className="rounded-2xl bg-card p-10 shadow-soft accent-border-left">
                <h3 className="text-2xl font-bold mb-4">DIY tools give you a logo. Your customers can tell.</h3>
                <p className="text-secondary text-lg leading-relaxed">Canva, Looka, Hatchful — you get a logo in 5 minutes. No strategy. No voice guidelines. No design tokens. Your developer can&apos;t use it. Your designer ignores it. And your customers know it was made in a template. <strong className="text-foreground">You saved $200 but lost credibility worth $15K+.</strong></p>
              </div>
            </RevealSection>
            <RevealSection delay={0.1}>
              <div className="rounded-2xl bg-card p-10 shadow-soft accent-border-left">
                <h3 className="text-2xl font-bold mb-4">Agencies give you a PDF. Your developer asks &ldquo;what are the tokens?&rdquo;</h3>
                <p className="text-secondary text-lg leading-relaxed">6–16 weeks. $15K–$75K. You get a beautiful brand guide that sits in Google Drive. There are no tokens. The font is buried on page 23. Your designer asks &ldquo;what color should I use?&rdquo; — you don&apos;t know because it&apos;s not in the system. <strong className="text-foreground">The average agency charges $71,651. You paid for a document, not a system.</strong></p>
              </div>
            </RevealSection>
            <RevealSection delay={0.2}>
              <div className="rounded-2xl bg-card p-10 shadow-soft accent-border-left">
                <h3 className="text-2xl font-bold mb-4">Every week without a brand system costs you money.</h3>
                <p className="text-secondary text-lg leading-relaxed">While you wait for an agency, your competitors launch. Your investors ask &ldquo;where&apos;s the brand?&rdquo; Your developer builds with default styles. Your landing page looks like everyone else&apos;s. <strong className="text-foreground">Every week without a brand system is a week you look like you don&apos;t have your shit together.</strong></p>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* WHY $300 — VALUE COMPARISON */}
      <section className="py-28 md:py-36 bg-secondary/30">
        <div className="container">
          <RevealSection>
            <div className="mx-auto max-w-3xl text-center mb-20">
              <Badge variant="accent" className="mb-6 gap-2">The math</Badge>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Why $300 is a steal for what you get
              </h2>
              <p className="mt-6 text-xl text-secondary">Here&apos;s what the market charges for the same deliverables. We deliver everything in hours.</p>
            </div>
          </RevealSection>
          <div className="mx-auto max-w-5xl">
            <RevealSection>
              <div className="rounded-2xl overflow-hidden shadow-premium">
                <div className="grid grid-cols-4 bg-secondary/50 text-xs font-semibold text-secondary">
                  <div className="p-6"></div>
                  <div className="p-6 text-center">Looka / Canva</div>
                  <div className="p-6 text-center">Freelancer</div>
                  <div className="p-6 text-center bg-gradient-to-b from-primary/10 to-transparent text-primary font-bold">Forge</div>
                </div>
                {[
                  { feature: "Brand strategy & positioning", diy: "—", agency: "$2K–$10K", forge: "✓" },
                  { feature: "Visual identity (3 directions)", diy: "Logo only", agency: "$3K–$15K", forge: "✓" },
                  { feature: "Voice guidelines", diy: "—", agency: "$2K–$8K", forge: "✓" },
                  { feature: "Design tokens (W3C DTCG)", diy: "—", agency: "—", forge: "✓" },
                  { feature: "AI skills for ChatGPT/Claude", diy: "—", agency: "—", forge: "✓" },
                  { feature: "Market research & competitors", diy: "—", agency: "$5K–$15K", forge: "✓" },
                  { feature: "Works in Figma + Tailwind", diy: "Hex codes", agency: "PDF", forge: "✓ Tokens" },
                  { feature: "Delivery time", diy: "Minutes", agency: "6–16 weeks", forge: "Hours" },
                  { feature: "Total cost", diy: "$20–$96", agency: "$15K–$75K", forge: "$299–$997" },
                ].map((row, i) => (
                  <div key={i} className={`grid grid-cols-4 text-sm border-t border-border/50 ${i % 2 === 0 ? "bg-card" : "bg-secondary/30"}`}>
                    <div className="p-5 font-semibold">{row.feature}</div>
                    <div className="p-5 text-center text-secondary">{row.diy}</div>
                    <div className="p-5 text-center text-secondary">{row.agency}</div>
                    <div className="p-5 text-center font-bold bg-gradient-to-b from-primary/5 to-transparent">{row.forge}</div>
                  </div>
                ))}
              </div>
            </RevealSection>
            <RevealSection delay={0.1}>
              <div className="mt-10 rounded-2xl bg-card p-8 shadow-soft text-center">
                <p className="text-lg text-secondary">
                  A freelancer charges <strong className="text-foreground">$1K–$5K</strong> for a logo and colors — no strategy, no voice, no tokens.
                  An agency charges <strong className="text-foreground">$15K–$75K</strong> for the same system we deliver in hours.
                  <br /><br />
                  <strong className="text-foreground text-xl">You&apos;re not paying $300 for a logo. You&apos;re getting a $25K brand system for 1% of the cost.</strong>
                </p>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* THE SOLUTION */}
      <section className="py-28 md:py-36">
        <div className="container">
          <RevealSection>
            <div className="mx-auto max-w-3xl text-center mb-20">
              <Badge variant="accent" className="mb-6 gap-2">The solution</Badge>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">A brand operating system. Not a design project.</h2>
              <p className="mt-6 text-xl text-secondary">Every tool you use — Figma, Tailwind, ChatGPT, Cursor — stays on-brand from day one. No guesswork. No inconsistency. No &ldquo;what color should I use?&rdquo;</p>
            </div>
          </RevealSection>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Compass, title: "Strategy your developer can't argue with", body: "Positioning, archetype, Golden Why. Not 'we like blue' — a strategic foundation that makes every visual and verbal choice defensible." },
              { icon: Palette, title: "Identity that scales from favicon to billboard", body: "3 custom logo directions. Full/mono/reversed/compact versions. Color palette with usage rules. Typography system. Every size, every format." },
              { icon: MessageSquare, title: "Voice that stays consistent everywhere", body: "3 voice attributes with do/don't examples. Messaging pillars. Tagline candidates. Your brand sounds like itself — website, email, social, ads, investor decks." },
              { icon: Code, title: "Tokens that work in code (W3C DTCG 2025.10)", body: "Design tokens your developer can drop into Tailwind, Figma, or any design system. No more &ldquo;what&apos;s the hex for our primary?&rdquo; — it's in the code." },
              { icon: Zap, title: "AI skills that keep every output on-brand", body: "Ready-made instructions for Claude, GPT, and Gemini. Paste them in and every AI output — emails, posts, copy — sounds like your brand. 5 prompt templates included." },
              { icon: Search, title: "Research that informs every decision", body: "Competitive landscape, positioning map, gap analysis. Know exactly where your brand fits and why. Not vibes — data. The same research agencies charge $5K–$15K for." },
            ].map((s, i) => (
              <RevealSection key={i} delay={i * 0.08}>
                <div className="rounded-2xl bg-card p-8 shadow-soft premium-card h-full">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><s.icon className="h-6 w-6" /></div>
                  <h3 className="mb-3 text-xl font-bold">{s.title}</h3>
                  <p className="text-secondary leading-relaxed">{s.body}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHY FORGE */}
      <section className="py-28 md:py-36">
        <div className="container">
          <RevealSection>
            <div className="mx-auto max-w-3xl text-center mb-20">
              <Badge variant="accent" className="mb-6 gap-2">Why Forge</Badge>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">What you get with Forge vs. everything else</h2>
            </div>
          </RevealSection>
          <div className="mx-auto max-w-5xl">
            <RevealSection>
              <div className="rounded-2xl overflow-hidden shadow-premium">
                <div className="grid grid-cols-4 bg-secondary/50 text-xs font-semibold text-secondary">
                  <div className="p-6"></div>
                  <div className="p-6 text-center">DIY Tools</div>
                  <div className="p-6 text-center">Agencies</div>
                  <div className="p-6 text-center bg-gradient-to-b from-primary/10 to-transparent text-primary font-bold">Forge</div>
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
                  <div key={i} className={`grid grid-cols-4 text-sm border-t border-border/50 ${i % 2 === 0 ? "bg-card" : "bg-secondary/30"}`}>
                    <div className="p-5 font-semibold">{row.feature}</div>
                    <div className="p-5 text-center text-secondary">{row.diy}</div>
                    <div className="p-5 text-center text-secondary">{row.agency}</div>
                    <div className="p-5 text-center font-bold bg-gradient-to-b from-primary/5 to-transparent">{row.forge}</div>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* THE DISCOVERY CALL */}
      <section className="py-28 md:py-36 bg-secondary/30">
        <div className="container grid items-center gap-16 lg:grid-cols-2">
          <RevealSection>
            <Badge variant="accent" className="mb-6 gap-2"><Phone className="h-4 w-4" /> How it starts</Badge>
            <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">Tell us about your business. We&apos;ll build the strategy while you talk.</h2>
            <p className="text-xl text-secondary mb-10 leading-relaxed">No forms. No mood boards. No scheduling. Just click and talk — our strategist researches your market in real time, captures your positioning, and builds a brief that drives every visual and verbal choice in your brand system.</p>
            <ul className="space-y-5 text-lg">
              {["Real-time competitor research while you speak", "Captures your positioning, not just your preferences", "Produces a strategic brief that drives the entire brand", "Transcript and research included in your deliverables"].map((f) => (
                <li key={f} className="flex items-center gap-4"><Check className="h-5 w-5 text-primary shrink-0" /> {f}</li>
              ))}
            </ul>
          </RevealSection>
          <RevealSection delay={0.15}>
            <div className="rounded-2xl bg-card p-10 shadow-premium relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/30 to-transparent" />
              <div className="relative">
                <div className="mb-8 flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-lg font-bold">F</span>
                  <div>
                    <div className="text-base font-semibold">{STUDIO_NAME} Strategist</div>
                    <div className="flex items-center gap-1.5 text-sm text-emerald-500"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Live · in-app call</div>
                  </div>
                </div>
                <div className="space-y-4 text-base">
                  <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary/10 px-5 py-3 animate-slide-in-right stagger-1">We build CRM tools for indie consultants.</div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary px-5 py-3 animate-fade-in-up stagger-2">Love it. I&apos;m looking at Notion and Honeybook now — they position around all-in-one. Do you feel that&apos;s what your market expects, or are you going somewhere different?</div>
                  <div className="flex items-center gap-2 text-sm text-secondary animate-fade-in-up stagger-3"><Sparkles className="h-4 w-4 text-primary animate-pulse" /> Researching Honeybook…</div>
                </div>
                <div className="mt-8 flex items-end justify-between gap-2">
                  <AnimatedWaveform />
                  <span className="text-sm text-secondary">18:42 remaining</span>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-28 md:py-36">
        <div className="container">
          <RevealSection>
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">Built for founders who move fast</h2>
              <p className="mt-6 text-xl text-secondary">The data is clear: consistent branding isn&apos;t vanity — it&apos;s revenue.</p>
            </div>
          </RevealSection>
          <RevealSection>
            <div className="mx-auto max-w-4xl mb-20">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {[
                  { stat: "10–23%", label: "More revenue with consistent branding" },
                  { stat: "95%", label: "Of buying decisions are subconscious" },
                  { stat: "5–7", label: "Impressions before someone remembers you" },
                  { stat: "$71K", label: "Average agency branding cost (Clutch)" },
                ].map((s, i) => (
                  <div key={i} className="rounded-2xl bg-card p-6 shadow-soft text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{s.stat}</div>
                    <div className="text-sm text-secondary">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { role: "SaaS founder", quote: "I had a full brand system in an afternoon. The strategy doc alone was worth more than what I paid. My developer dropped the tokens into Tailwind and everything just matched." },
              { role: "Consultancy", quote: "The voice call was wild — it actually researched my competitors live. I got positioning, messaging, and a brand voice in one session. An agency wanted $30K and 3 months for this." },
              { role: "DTC brand", quote: "We went from 'another Shopify store' to a brand that looks like it raised $5M. The AI skills mean our ChatGPT content stays on-brand every time. Game changer." },
            ].map((t, i) => (
              <RevealSection key={t.role} delay={i * 0.1}>
                <div className="rounded-2xl bg-card p-8 shadow-soft premium-card h-full">
                  <div className="mb-5 flex gap-1 text-primary">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-5 w-5 fill-current" />)}</div>
                  <p className="mb-6 text-base text-foreground/90 leading-relaxed">{t.quote}</p>
                  <div className="text-sm text-secondary font-medium">{t.role} · early access</div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-28 md:py-36 bg-secondary/30">
        <div className="container">
          <RevealSection>
            <div className="mx-auto max-w-3xl text-center mb-20">
              <Badge variant="accent" className="mb-6 gap-2">Pricing</Badge>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">What this would cost otherwise</h2>
              <p className="mt-6 text-xl text-secondary">A branding agency charges $15K–$75K and takes months. A freelancer charges $1K–$5K for a logo. We deliver the same system in hours. One-time payment. No retainers. No surprise invoices.</p>
            </div>
          </RevealSection>
          <PricingCards ctaLabel="Choose {name}" />
          <RevealSection delay={0.2}>
            <p className="mt-10 text-center text-sm text-secondary">
              Every tier includes strategy, visual identity, voice, tokens, AI skills, and research. The difference is the number of directions, revisions, and delivery speed.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28 md:py-36">
        <div className="container max-w-3xl">
          <RevealSection><h2 className="mb-14 text-center text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">FAQ</h2></RevealSection>
          <div className="divide-y divide-border/50">
            {faqs.map((f, i) => (
              <RevealSection key={f.q} delay={i * 0.05}>
                <details className="group py-7">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold list-none">{f.q}<span className="text-secondary transition-transform group-open:rotate-45 text-2xl">+</span></summary>
                  <p className="mt-4 text-base text-secondary leading-relaxed">{f.a}</p>
                </details>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden py-32 md:py-40">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/30 via-transparent to-secondary/30" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="container relative text-center">
          <RevealSection>
            <h2 className="mx-auto mb-6 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl leading-tight">
              Your competitor launched today.<br /><span className="text-gradient">Where&apos;s your brand?</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-xl text-secondary leading-relaxed">While you&apos;re thinking about it, they&apos;re closing deals with a brand that looks like they raised $5M. Talk to our strategist, pick a direction, and walk away with a complete brand system — today.</p>
            <Link href="/checkout"><Button size="lg" className="gap-3 px-12 py-8 text-lg font-semibold shadow-premium hover:shadow-glow transition-all">Get your brand system <ArrowRight className="h-5 w-5" /></Button></Link>
            <p className="mt-8 text-sm text-secondary">No scheduling. No forms. Just click and talk. Same-day delivery.</p>
          </RevealSection>
        </div>
      </section>

      <MarketingFooter />

      {showSticky && (
        <div className="fixed bottom-0 inset-x-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-xl py-4 px-6 shadow-lg animate-fade-in-up">
          <div className="container flex items-center justify-between">
            <div className="hidden sm:block"><span className="text-base font-semibold">Complete brand system from $299</span><span className="ml-3 text-sm text-secondary">Strategy · Identity · Voice · Tokens · AI Skills</span></div>
            <Link href="/checkout"><Button className="gap-2 px-6 py-3 font-semibold shadow-sm">Get your brand <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      )}
    </div>
  );
}
