"use client";

import type { ReactNode } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";

type ClientOnlyProps = {
  children: ReactNode;
  /** Must match what the server renders when `mounted === false`. */
  fallback?: ReactNode;
};

/**
 * Renders `fallback` until hydration completes, then `children`.
 * Server HTML and the initial client pass must stay identical — never put
 * Math.random(), Date.now(), or browser APIs in the main render path.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const mounted = useHasMounted();
  if (!mounted) return fallback;
  return children;
}
