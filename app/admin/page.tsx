"use client";

import Link from "next/link";
import {
  BarChart3, Clock3, ShieldCheck, DollarSign, Database, Trash2, Plus,
} from "lucide-react";
import { useStore } from "@/lib/mock/use-store";
import { getStore } from "@/lib/mock/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminOverviewPage() {
  useStore(); // re-render on store changes
  const store = getStore();
  const orders = store.getAllOrders();
  const runs = orders.flatMap((o) => store.getAgentRuns(o.id));
  const qa = orders.flatMap((o) => store.getQAReviews(o.id));
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const rows = orders.map((o) => {
    const brief = store.getBrief(o.id);
    const client = store.getClient(o.clientId);
    return {
      id: o.id,
      businessName: brief?.businessName || o.id,
      tier: o.tier,
      email: client?.email || "—",
      status: o.status.replace(/_/g, " "),
    };
  });
  const qaPass = qa.filter((q) => q.passed).length;
  const qaRate = qa.length ? Math.round((qaPass / qa.length) * 100) : 100;
  const revenue = orders.reduce((sum, o) => sum + o.pricePaidCents, 0) / 100;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant="secondary">Internal</Badge>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">System health</h1>
          <p className="text-muted-foreground">Autonomous pipeline observability — no manual review queue.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { store.seedDemo(); }} className="gap-2">
            <Plus className="h-4 w-4" /> Seed demo data
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { if (confirm("Clear all demo data?")) store.resetDemo(); }} className="gap-2 text-muted-foreground">
            <Trash2 className="h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Database className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">No orders yet. Run the demo flow, or seed sample data to populate the dashboard.</p>
            <Button variant="outline" onClick={() => store.seedDemo()} className="gap-2"><Plus className="h-4 w-4" /> Seed demo data</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard icon={BarChart3} label="Orders" value={String(orders.length)} sub={`${delivered} delivered`} />
            <StatCard icon={Clock3} label="Avg. pipeline" value="~12m" sub="mock demo" />
            <StatCard icon={ShieldCheck} label="QA pass rate" value={`${qaRate}%`} sub={`${qa.length} reviews`} />
            <StatCard icon={DollarSign} label="Revenue" value={`$${revenue.toFixed(2)}`} sub="mock transactions" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Recent agent runs</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {runs.slice(-8).reverse().map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                    <div>
                      <div className="font-medium capitalize">{r.agentName.replace(/_/g, " ")}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{(r.output as any)?.note || ""}</div>
                    </div>
                    <Badge variant={r.status === "done" ? "success" : "secondary"}>{r.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>QA reviews</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {qa.slice(-8).reverse().map((q) => (
                  <div key={q.id} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                    <div>
                      <div className="font-medium capitalize">{q.reviewType} review</div>
                      <div className="text-xs text-muted-foreground">{q.flags.length ? q.flags.join(" • ") : "clean"}{q.autoFixes.length ? ` · fixed ${q.autoFixes.length}` : ""}</div>
                    </div>
                    <Badge variant={q.passed ? "success" : "warning"}>{q.passed ? "passed" : "flagged"}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Recent orders</CardTitle>
              <Link href="/admin/orders" className="text-sm text-primary underline">View all</Link>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {orders.slice(-5).reverse().map((o) => {
                const r = rows.find((x) => x.id === o.id)!;
                return (
                <Link key={o.id} href={`/admin/orders?order=${o.id}`} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 transition hover:border-primary/40">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{r.businessName || o.id}</div>
                    <div className="text-xs text-muted-foreground capitalize">{o.tier} · {r.email}</div>
                  </div>
                  <Badge>{o.status.replace(/_/g, " ")}</Badge>
                </Link>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">{sub}</div>
        </div>
      </CardContent>
    </Card>
  );
}
