"use client";

import Link from "next/link";
import {
  BarChart3, Clock3, ShieldCheck, DollarSign, Database, Trash2, Plus, TrendingUp, Users,
} from "lucide-react";
import { useStore } from "@/lib/mock/use-store";
import { getStore } from "@/lib/mock/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function BarChart({ data, max }: { data: { label: string; value: number; color: string }[]; max: number }) {
  return (
    <div className="flex items-end gap-3 h-40 pt-4">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
          <div className="text-xs font-mono text-muted-foreground">{d.value}</div>
          <div
            className="w-full rounded-t-md transition-all duration-700"
            style={{
              height: `${max > 0 ? (d.value / max) * 100 : 0}%`,
              background: d.color,
              minHeight: d.value > 0 ? "4px" : "0",
            }}
          />
          <div className="text-[10px] text-muted-foreground text-center leading-tight">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments, total }: { segments: { label: string; value: number; color: string }[]; total: number }) {
  let cumulative = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="flex items-center gap-6">
      <svg width="100" height="100" viewBox="0 0 100 100">
        {segments.map((s) => {
          const pct = total > 0 ? s.value / total : 0;
          const dash = pct * circumference;
          const offset = -cumulative * circumference;
          cumulative += pct;
          return (
            <circle
              key={s.label}
              cx="50" cy="50" r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth="12"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset}
              className="transition-all duration-700"
            />
          );
        })}
        <text x="50" y="48" textAnchor="middle" className="fill-foreground text-[18px] font-bold" dominantBaseline="middle">{total}</text>
        <text x="50" y="62" textAnchor="middle" className="fill-muted-foreground text-[8px]" dominantBaseline="middle">orders</text>
      </svg>
      <div className="space-y-2 text-xs">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="font-medium">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  useStore();
  const store = getStore();
  const orders = store.getAllOrders();
  const runs = orders.flatMap((o) => store.getAgentRuns(o.id));
  const qa = orders.flatMap((o) => store.getQAReviews(o.id));
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const qaPass = qa.filter((q) => q.passed).length;
  const qaRate = qa.length ? Math.round((qaPass / qa.length) * 100) : 100;
  const revenue = orders.reduce((sum, o) => sum + o.pricePaidCents, 0) / 100;

  const tierCounts = orders.reduce((acc, o) => { acc[o.tier] = (acc[o.tier] || 0) + 1; return acc; }, {} as Record<string, number>);
  const tierSegments = [
    { label: "Starter", value: tierCounts.starter || 0, color: "#6B7280" },
    { label: "Signature", value: tierCounts.signature || 0, color: "#C9A96E" },
    { label: "Authority", value: tierCounts.authority || 0, color: "#0F1B2D" },
  ];

  const statusCounts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {} as Record<string, number>);
  const pipelineData = [
    { label: "Pending", value: (statusCounts.pending_call || 0) + (statusCounts.pending_payment || 0), color: "#9CA3AF" },
    { label: "In Progress", value: statusCounts.in_progress || 0, color: "#F59E0B" },
    { label: "Review", value: statusCounts.awaiting_client_review || 0, color: "#3B82F6" },
    { label: "Delivered", value: statusCounts.delivered || 0, color: "#10B981" },
  ];
  const pipelineMax = Math.max(...pipelineData.map((d) => d.value), 1);

  const avgPipelineMin = orders.length ? Math.round(orders.reduce((s, o) => s + (o.deliverySlaHours || 120), 0) / orders.length / 60 * 10) / 10 : 0;

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
            <StatCard icon={BarChart3} label="Total orders" value={String(orders.length)} sub={`${delivered} delivered`} />
            <StatCard icon={TrendingUp} label="Conversion" value={`${orders.length > 0 ? Math.round((delivered / orders.length) * 100) : 0}%`} sub={`${delivered}/${orders.length} completed`} />
            <StatCard icon={ShieldCheck} label="QA pass rate" value={`${qaRate}%`} sub={`${qa.length} reviews`} />
            <StatCard icon={DollarSign} label="Revenue" value={`$${revenue.toLocaleString("en-US", { minimumFractionDigits: 0 })}`} sub="mock transactions" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle className="text-sm">Pipeline status</CardTitle></CardHeader>
              <CardContent>
                <BarChart data={pipelineData} max={pipelineMax} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Tier distribution</CardTitle></CardHeader>
              <CardContent>
                <DonutChart segments={tierSegments} total={orders.length} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Key metrics</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. delivery SLA</span>
                  <span className="font-mono text-sm font-medium">~{avgPipelineMin}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Agent runs completed</span>
                  <span className="font-mono text-sm font-medium">{runs.filter((r) => r.status === "done").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">QA auto-fixes applied</span>
                  <span className="font-mono text-sm font-medium">{qa.reduce((s, q) => s + q.autoFixes.length, 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Revenue per order</span>
                  <span className="font-mono text-sm font-medium">${orders.length ? (revenue / orders.length).toFixed(0) : "0"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active pipelines</span>
                  <span className="font-mono text-sm font-medium">{orders.filter((o) => ["in_progress", "qa_review", "final_compile"].includes(o.status)).length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Recent agent runs</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {runs.slice(-8).reverse().map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                    <div>
                      <div className="font-medium capitalize">{r.agentName.replace(/_/g, " ")}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{r.output?.note || ""}</div>
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
                const brief = store.getBrief(o.id);
                const client = store.getClient(o.clientId);
                return (
                <Link key={o.id} href={`/admin/orders?order=${o.id}`} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 transition hover:border-primary/40">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{brief?.businessName || o.id}</div>
                    <div className="text-xs text-muted-foreground capitalize">{o.tier} · {client?.email || "—"}</div>
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

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub: string }) {
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
