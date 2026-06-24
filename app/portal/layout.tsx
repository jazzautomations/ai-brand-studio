import type { Metadata } from "next";
import { PortalNav } from "@/components/portal/portal-nav";

export const metadata: Metadata = { title: "Client Portal" };

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <PortalNav />
      <main className="container py-8">{children}</main>
    </div>
  );
}
