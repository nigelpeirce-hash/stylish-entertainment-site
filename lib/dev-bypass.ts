/**
 * Development mode authentication bypass utility
 * Only works in development/localhost environments
 */

export function getDevBypass(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    (process.env.NODE_ENV === "development" || 
     window.location.hostname === "localhost" || 
     window.location.hostname === "127.0.0.1" ||
     window.location.hostname.startsWith("192.168.") ||
     window.location.hostname.startsWith("10.")) &&
    sessionStorage.getItem("dev_admin_bypass") === "true"
  );
}

export function getDevBypassHeaders(): HeadersInit {
  const headers: HeadersInit = {};
  if (getDevBypass()) {
    headers["x-dev-bypass"] = "true";
  }
  return headers;
}
