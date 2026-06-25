import Link from "next/link";
import { STUDIO_NAME } from "@/lib/studio";

export function MarketingFooter() {
  return (
    <footer className="bg-white">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
            {STUDIO_NAME.charAt(0)}
          </span>
          <span>{STUDIO_NAME} · Autonomous AI Brand Studio</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/#how" className="hover:text-foreground transition-colors">How it works</Link>
          <Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/login" className="hover:text-foreground transition-colors">Client login</Link>
          <Link href="/admin" className="hover:text-foreground transition-colors">Admin</Link>
        </div>
        <p className="text-xs text-muted-foreground/70">© {new Date().getFullYear()} {STUDIO_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
