/**
 * Studio identity — single source of truth for the brand name.
 * Override via NEXT_PUBLIC_STUDIO_NAME env var before launch.
 * (The PRD uses [STUDIO_NAME] as a placeholder; this resolves it.)
 */
export const STUDIO_NAME =
  process.env.NEXT_PUBLIC_STUDIO_NAME || "Lumen";

export const STUDIO_TAGLINE =
  process.env.NEXT_PUBLIC_STUDIO_TAGLINE ||
  "Your brand, built by AI. Delivered in hours, not months.";

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export function studioPath(prefix: string) {
  return `${STUDIO_NAME} · ${prefix}`;
}
