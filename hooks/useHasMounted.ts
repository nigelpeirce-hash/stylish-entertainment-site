"use client";

import { useSyncExternalStore } from "react";

/**
 * True only after the client has hydrated. False on the server and on the
 * first client render pass — use this before showing client-only UI or running
 * random/shuffled content that must not appear during SSR.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
