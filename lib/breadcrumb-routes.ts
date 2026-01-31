/**
 * Breadcrumb Route Verification System
 * 
 * DEPRECATED: This file is kept for backward compatibility.
 * New code should use breadcrumb-config.ts and breadcrumb-utils.ts instead.
 * 
 * These functions now proxy to the centralized configuration.
 */

import { BREADCRUMB_ROUTE_LABELS } from "./breadcrumb-config";
import { isRouteClickable as _isRouteClickable, getRouteLabel as _getRouteLabel } from "./breadcrumb-utils";

/**
 * @deprecated Use BREADCRUMB_ROUTE_LABELS from breadcrumb-config.ts instead
 */
export const adminRoutes: Record<string, string> = BREADCRUMB_ROUTE_LABELS;

/**
 * @deprecated No longer used - all admin routes have actual pages
 */
export const nonPageRoutes: string[] = [];

/**
 * Check if a route exists
 * @deprecated Use isRouteClickable from breadcrumb-utils.ts instead
 */
export function routeExists(path: string): boolean {
  const normalizedPath = path.replace(/\/$/, "");
  
  // Check exact match in route labels
  if (BREADCRUMB_ROUTE_LABELS[normalizedPath]) {
    return true;
  }
  
  // Check if it's a dynamic route pattern (contains [id] or similar)
  // For now, we'll consider dynamic routes as existing if their parent exists
  if (normalizedPath.includes("/[id]") || normalizedPath.match(/\/[a-z0-9]{20,}/)) {
    // Check if parent route exists
    const parentPath = normalizedPath.split("/").slice(0, -1).join("/");
    return routeExists(parentPath) || BREADCRUMB_ROUTE_LABELS[parentPath] !== undefined;
  }
  
  return false;
}

/**
 * Get the label for a route
 * @deprecated Use getRouteLabel from breadcrumb-utils.ts instead
 */
export function getRouteLabel(path: string): string | null {
  return _getRouteLabel(path);
}

/**
 * Check if a route should be clickable
 * @deprecated Use isRouteClickable from breadcrumb-utils.ts instead
 */
export function isRouteClickable(path: string): boolean {
  return _isRouteClickable(path);
}
