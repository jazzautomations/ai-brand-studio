"use client";

import Link from "next/link";
import { useStore } from "@/lib/mock/use-store";
import { getStore } from "@/lib/mock/store";
import { statusLabel } from "@/lib/mock/status";
import { TriangleAlert } from "lucide-react";

export default function AdminAnomalies() {
  useStore();
  const orders = getStore().getAllOrders();
  const qa = getStore().getQAReviews();

  const failedQa = qa.filter((r) => !r.passed || r.regenerations >= 3);
  const revisions = orders.filter((o) => o.status === "revision");
  const inFlight = orders.filter((o) =>
    ["pending_call", "call_in_progress", "call_completed", "in_progress", "qa_review", "final_compile"].includes(o.status),
  );

  const total = failedQa.length + revisions.length;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Anomalies & monitoring</h1>
      <p className="text-sm text-muted-foreground">
        The system runs autonomously. This surface is for observability — the only place a human might step in, and only for system-level issues.
      </p>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
        <div className="flex items-center gap-2 text-amber-300">
          <TriangleAlert className="h-4 w-4" />
          <span className="font-medium">{total} item{total === 1 ? "" : "s"} need attention</span>
        </div>
      </div>

      <Section title="QA failures / max regenerations">
        {failedQa.length ? failedQa.map((r) => (
          <Row key={r.id} title={getStore().getBrief(r.orderId)?.businessName || r.orderId.slice(0, 8)}
            body={`${r.flags.join(", ") || "no flags"} · ${r.regenerations} regen`} />
        )) : <Empty />}
      </Section>

      <Section title="Open revision pushbacks (CD Agent active)">
        {revisions.length ? revisions.map((o) => (
          <Row key={o.id} title={getStore().getBrief(o.id)?.businessName || o.id.slice(0, 8)}
            body={`Creative Director Agent holding the line — awaiting client response`} />
        )) : <Empty />}
      </Section>

      <Section title="In-flight orders (monitor)">
        {inFlight.length ? inFlight.map((o) => (
          <Row key={o.id} title={getStore().getBrief(o.id)?.businessName || o.id.slice(0, 8)} body={statusLabel(o.status)} />
        )) : <Empty />}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function Row({ title, body }: { title: string; body: string }) {
  return (
    <Link href="/" className="block rounded-lg border border-border bg-card p-3 transition hover:border-primary/40">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-muted-foreground">{body}</div>
    </Link>
  );
}
function Empty() {
  return <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">Nothing here.</div>;
}
