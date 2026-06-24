"use client";

import { useStore } from "@/lib/mock/use-store";
import { getStore } from "@/lib/mock/store";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert } from "lucide-react";

export default function AdminQaLogs() {
  useStore();
  const reviews = getStore().getQAReviews();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">QA Review audit trail</h1>
      <p className="text-sm text-muted-foreground">
        Every direction passes the 4-layer QA Review Agent before it reaches a client. Patterns here tune the Visual Agent prompt.
      </p>
      {reviews.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">No QA reviews yet.</div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => {
            const brief = getStore().getBrief(r.orderId);
            return (
              <div key={r.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {r.passed ? <ShieldCheck className="h-4 w-4 text-primary" /> : <ShieldAlert className="h-4 w-4 text-red-400" />}
                    <span className="font-medium">{brief?.businessName || r.orderId.slice(0, 8)}</span>
                    <Badge variant="outline" className="capitalize">{r.reviewType}</Badge>
                  </div>
                  <Badge variant={r.passed ? "success" : "warning"}>{r.passed ? "Passed" : "Failed"}</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                  <Field label="Flags">{r.flags.length ? r.flags.join(", ") : "None"}</Field>
                  <Field label="Auto-fixes">{r.autoFixes.length ? r.autoFixes.join("; ") : "None"}</Field>
                  <Field label="Regenerations">{r.regenerations}</Field>
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">{new Date(r.reviewedAt).toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/30 p-2">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className="text-foreground/90">{children}</div>
    </div>
  );
}
