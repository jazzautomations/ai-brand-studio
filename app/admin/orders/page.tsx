"use client";

import Link from "next/link";
import { useStore } from "@/lib/mock/use-store";
import { getStore } from "@/lib/mock/store";
import { TIERS } from "@/lib/tiers";
import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/lib/mock/status";

export default function AdminOrders() {
  useStore();
  const orders = getStore().getAllOrders();
  if (!orders.length)
    return <Empty />;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Business</th>
              <th className="p-3">Tier</th>
              <th className="p-3">Status</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Created</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const brief = getStore().getBrief(o.id);
              const tier = TIERS.find((t) => t.id === o.tier);
              return (
                <tr key={o.id} className="border-t border-border">
                  <td className="p-3 font-medium">{brief?.businessName || "—"}</td>
                  <td className="p-3 capitalize">{tier?.name || o.tier}</td>
                  <td className="p-3"><Badge variant="outline">{statusLabel(o.status)}</Badge></td>
                  <td className="p-3">${(o.pricePaidCents / 100).toFixed(0)}</td>
                  <td className="p-3 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <Link href={`/portal/progress?order=${o.id}`} className="text-primary underline">Portal</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="py-20 text-center text-muted-foreground">
      No orders yet. Seed demo data from the <Link href="/admin" className="text-primary underline">overview</Link>.
    </div>
  );
}
