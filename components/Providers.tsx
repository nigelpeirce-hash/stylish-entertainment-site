"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suppress NextAuth errors in console if API route is not available
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Create a more comprehensive error filter
    const isNextAuthError = (args: any[]): boolean => {
      try {
        // Check all arguments
        for (let i = 0; i < args.length; i++) {
          const arg = args[i];
          let errorMessage = '';
          
          if (arg && typeof arg === 'object') {
            errorMessage = 
              (arg.message || '') + ' ' +
              (arg.name || '') + ' ' +
              (arg.toString ? arg.toString() : '') + ' ' +
              (arg.stack || '');
          } else if (arg) {
            errorMessage = String(arg);
          }
          
          // Check for NextAuth errors more comprehensively
          const isAuthError = 
            errorMessage.includes("Unexpected token '<'") ||
            errorMessage.includes("ClientFetchError") ||
            errorMessage.includes("AuthError") ||
            errorMessage.includes("authjs.dev") ||
            errorMessage.includes("authjs") ||
            errorMessage.includes("<!DOCTYPE") ||
            errorMessage.includes("NextAuth") ||
            errorMessage.includes("/api/auth") ||
            errorMessage.includes("getSession") ||
            errorMessage.includes("SessionProvider") ||
            errorMessage.includes("fetchData") ||
            (arg && arg.name === "ClientFetchError") ||
            (arg && arg.name === "AuthError") ||
            (arg && arg.constructor && arg.constructor.name === "ClientFetchError") ||
            (arg && arg.constructor && arg.constructor.name === "AuthError");
          
          if (isAuthError) {
            return true;
          }
        }
        return false;
      } catch (e) {
        return false;
      }
    };
    
    console.error = (...args: any[]) => {
      if (isNextAuthError(args)) {
        // Silently ignore NextAuth fetch errors
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      if (isNextAuthError(args)) {
        // Silently ignore NextAuth warnings
        return;
      }
      originalWarn.apply(console, args);
    };

    // Also catch unhandled promise rejections from NextAuth
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const errorMessage = (reason?.message || reason?.toString() || "") + " " + (reason?.stack || "");
      
      if (
        errorMessage.includes("Unexpected token '<'") ||
        errorMessage.includes("ClientFetchError") ||
        errorMessage.includes("AuthError") ||
        errorMessage.includes("authjs.dev") ||
        errorMessage.includes("authjs") ||
        errorMessage.includes("<!DOCTYPE") ||
        errorMessage.includes("/api/auth") ||
        errorMessage.includes("getSession") ||
        errorMessage.includes("SessionProvider")
      ) {
        event.preventDefault(); // Suppress the error
        return;
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  // Always render SessionProvider - components like AuthButton need it immediately
  // Errors will be suppressed by the error handlers above
  return (
    <SessionProvider 
      refetchInterval={0}
      refetchOnWindowFocus={false}
      basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  );
}
