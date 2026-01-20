/**
 * Get the base URL for the application
 * Uses environment variable or falls back to constructing from request
 * For email links, always use environment variable to ensure full URL
 */
export function getBaseUrl(request?: Request): string {
  // For production/email links, always use environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // For development, try to get from request headers
  if (request) {
    const origin = request.headers.get("origin") || 
                   request.headers.get("host") || 
                   request.headers.get("x-forwarded-host");
    
    if (origin) {
      const protocol = request.headers.get("x-forwarded-proto") || "http";
      return `${protocol}://${origin}`;
    }
  }

  // Last resort: return empty string to use relative paths
  return "";
}

/**
 * Get a relative path (works regardless of port/domain)
 * Use this for redirects within the same application
 */
export function getRelativePath(path: string): string {
  // Ensure path starts with /
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Get a full URL for email links
 * Always returns a full URL (with protocol and domain)
 */
export function getEmailUrl(path: string, request?: Request): string {
  const baseUrl = getBaseUrl(request);
  
  // If we have a base URL, return full URL
  if (baseUrl) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }
  
  // If no base URL, return relative path (shouldn't happen in production)
  console.warn("NEXT_PUBLIC_SITE_URL not set, using relative path for email link");
  return getRelativePath(path);
}
