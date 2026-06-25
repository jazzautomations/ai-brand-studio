import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { STUDIO_NAME } from "@/lib/studio";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mb-6 grid h-24 w-24 mx-auto place-items-center rounded-full bg-primary/10">
          <span className="text-5xl font-bold text-primary/40">404</span>
        </div>
        <h1 className="text-3xl font-semibold mb-3">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          This page doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to {STUDIO_NAME}
            </Button>
          </Link>
          <Link href="/checkout">
            <Button variant="outline">Start a project</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
