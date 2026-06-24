"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, Sparkles } from "lucide-react";
import { STUDIO_NAME } from "@/lib/studio";
import { getStore } from "@/lib/mock/store";
import { useStore } from "@/lib/mock/use-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

function LoginInner() {
  const store = getStore();
  useStore();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const next = params.get("next") || "/portal";

  function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    store.loginOrSignup(email, name || undefined);
    // Mock: no email round-trip — "magic link" instant for the demo.
    setSent(true);
    setTimeout(() => router.push(next), 700);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to {STUDIO_NAME}
        </Link>
        <Card className="p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Welcome to {STUDIO_NAME}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ll email you a magic link to sign in — no password needed.
            </p>
          </div>

          {sent ? (
            <div className="rounded-lg border border-accent/30 bg-accent/10 p-4 text-sm text-foreground">
              <div className="flex items-center gap-2 font-medium">
                <Mail className="h-4 w-4 text-accent" /> Link sent — signing you in…
              </div>
              <p className="mt-1 text-muted-foreground">
                <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">{email}</span>
                <span className="ml-1">(Demo: instant — no real email.)</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Name <span className="text-muted-foreground">(optional)</span></label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Rivera" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
              </div>
              <Button type="submit" className="w-full" size="lg">
                <Mail className="h-4 w-4" /> Send magic link
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo mode — sign-in is simulated client-side. Production uses Supabase Auth magic links.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
