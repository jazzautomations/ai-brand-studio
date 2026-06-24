import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = { title: "Admin · Studio", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="container py-8">{children}</main>
    </div>
  );
}
