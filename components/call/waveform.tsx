"use client";

import { cn } from "@/lib/utils";

const BARS = Array.from({ length: 28 }, (_, i) => i);

/**
 * Animated waveform visualizer for the in-app voice call.
 * `active` controls whether the bars pulse (agent/client speaking).
 */
export function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex h-16 items-center justify-center gap-[3px]" role="img" aria-label="Voice waveform">
      {BARS.map((i) => (
        <span
          key={i}
          className={cn(
            "w-[3px] rounded-full bg-primary/80",
            active
              ? "animate-[pulse-bar_900ms_ease-in-out_infinite]"
              : "h-1.5 opacity-30",
          )}
          style={{ animationDelay: `${(i % 14) * 55}ms` }}
        />
      ))}
    </div>
  );
}
