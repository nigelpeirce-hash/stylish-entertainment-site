"use client";

import { useEffect } from "react";

/**
 * Global error handler for Next.js prefetch failures (non-critical)
 * Prefetch failures are expected in some scenarios (offline, server down, etc.)
 * and don't affect actual navigation, so we can safely ignore them
 */
export default function PrefetchErrorHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Silently handle prefetch failures - they're not critical
      if (
        event.reason?.message?.includes("Failed to fetch") ||
        event.reason?.message?.includes("fetch") ||
        event.reason?.name === "TypeError" ||
        (typeof event.reason === "string" && event.reason.includes("fetch"))
      ) {
        // Prefetch failures are expected in some scenarios (offline, server down, etc.)
        // They don't affect actual navigation, so we can safely ignore them
        event.preventDefault();
        console.debug("[Prefetch] Silently handling prefetch failure:", event.reason?.message || event.reason);
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null; // This component doesn't render anything
}
