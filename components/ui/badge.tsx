import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "outline" | "secondary" | "accent" | "success" | "warning";

const variants: Record<BadgeVariant, string> = {
  default: "bg-primary/15 text-primary border-primary/30",
  outline: "border border-border text-muted-foreground",
  secondary: "bg-secondary text-secondary-foreground border-transparent",
  accent: "bg-accent/20 text-accent border-accent/30",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
