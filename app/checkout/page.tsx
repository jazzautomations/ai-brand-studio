"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { STUDIO_NAME } from "@/lib/studio";
import { TIERS, type Tier } from "@/lib/tiers";
import { getStore } from "@/lib/mock/store";
import { useStore } from "@/lib/mock/use-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Tier | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("US");
  const [processing, setProcessing] = useState(false);

  function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !email) return;
    setProcessing(true);
    // Mock payment — production: redirect to Stripe Checkout, then webhook
    // creates the order. Here we create it directly (status: pending_call).
    const order = getStore().createOrder({ tier: selected, email, name: name || undefined, country });
    setTimeout(() => {
      router.push(`/call?order=${order.id}`);
    }, 1100);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to {STUDIO_NAME}
        </Link>

        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight">Choose your tier</h1>
          <p className="mt-2 text-muted-foreground">Pick a plan and start your brand call immediately after checkout.</p>

          {/* Tier selector */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {TIERS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={cn(
                  "rounded-xl border p-5 text-left transition-all",
                  selected === t.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/40"
                    : "border-border bg-card hover:border-muted-foreground/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{t.name}</span>
                  {t.recommended && <Badge variant="accent">Popular</Badge>}
                </div>
                <div className="mt-2 text-2xl font-semibold">{t.priceLabel}</div>
                <div className="mt-1 text-xs text-muted-foreground">{t.callMinutes}-min call · {t.directionCount} direction(s) · {t.guidePages}-pg guide</div>
              </button>
            ))}
          </div>

          {/* Checkout form */}
          {selected && (
            <Card className="mt-8 p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold">Checkout</h2>
                <Badge variant="outline"><Lock className="mr-1 h-3 w-3" /> Demo payment</Badge>
              </div>
              <form onSubmit={pay} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Rivera" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Company <span className="text-muted-foreground">(optional)</span></label>
                    <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="flex h-11 w-full rounded-lg border border-border bg-background/50 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="BR">Brasil</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="ES">Spain</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{TIERS.find((t) => t.id === selected)?.name} tier</span>
                    <span className="font-semibold">{TIERS.find((t) => t.id === selected)?.priceLabel}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Tax (Stripe Tax)</span>
                    <span>Calculated at payment</span>
                  </div>
                  <div className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">
                    Billed in USD. Your bank may apply conversion fees.
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={processing}>
                  {processing ? (
                    <>Processing…</>
                  ) : (
                    <><ShieldCheck className="h-4 w-4" /> Pay {TIERS.find((t) => t.id === selected)?.priceLabel} & start call</>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Demo mode — no real charge. Production uses Stripe Checkout (Card, Apple Pay, Google Pay, Stripe Link) + Stripe Tax.
                </p>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
