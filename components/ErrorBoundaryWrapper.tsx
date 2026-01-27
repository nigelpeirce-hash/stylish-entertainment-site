"use client";

import { ErrorBoundary } from "./ErrorBoundary";

export function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  // During SSR/build, skip error boundary to prevent getCurrentStack errors
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }
  
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
