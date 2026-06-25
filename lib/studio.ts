/**
 * Studio identity — single source of truth for the brand name.
 * Override via NEXT_PUBLIC_STUDIO_NAME env var before launch.
 */
export const STUDIO_NAME =
  process.env.NEXT_PUBLIC_STUDIO_NAME || "Forge";

export const STUDIO_TAGLINE =
  process.env.NEXT_PUBLIC_STUDIO_TAGLINE ||
  "Brand infrastructure for the AI era.";

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export function studioPath(prefix: string) {
  return `${STUDIO_NAME} · ${prefix}`;
}
