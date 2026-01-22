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
      const reason = event.reason;
      const errorMessage = reason?.message || reason?.toString() || "";
      const errorName = reason?.name || "";
      const errorStack = reason?.stack || "";

      // Check if this is a prefetch-related fetch error
      const isPrefetchError = 
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("fetch") ||
        errorName === "TypeError" ||
        errorStack.includes("fetch-server-response") ||
        errorStack.includes("prefetch-cache-utils") ||
        errorStack.includes("router-reducer");

      if (isPrefetchError) {
        // Prefetch failures are expected in some scenarios (offline, server down, etc.)
        // They don't affect actual navigation, so we can safely ignore them
        event.preventDefault();
        // Only log in development to avoid console noise in production
        if (process.env.NODE_ENV === "development") {
          console.debug("[Prefetch] Silently handling prefetch failure:", errorMessage || reason);
        }
      }
    };

    const handleError = (event: ErrorEvent) => {
      const error = event.error;
      const errorMessage = error?.message || event.message || "";
      const errorStack = error?.stack || event.filename || "";

      // Check if this is a prefetch-related fetch error
      const isPrefetchError = 
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("fetch") ||
        errorStack.includes("fetch-server-response") ||
        errorStack.includes("prefetch-cache-utils") ||
        errorStack.includes("router-reducer");

      if (isPrefetchError) {
        // Prevent the error from showing in console
        event.preventDefault();
        if (process.env.NODE_ENV === "development") {
          console.debug("[Prefetch] Silently handling prefetch error:", errorMessage);
        }
        return true; // Indicate we handled it
      }
      return false;
    };

    // Handle both promise rejections and regular errors
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError as EventListener);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError as EventListener);
    };
  }, []);

  return null; // This component doesn't render anything
}
