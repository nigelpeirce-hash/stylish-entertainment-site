/**
 * Breadcrumb Utility Functions
 * Pure functions for breadcrumb generation and route handling
 */

import {
  BREADCRUMB_ROUTE_LABELS,
  PATH_SEGMENT_LABELS,
  DYNAMIC_ROUTE_PATTERNS,
  CUSTOM_ROUTE_REDIRECTS,
  NON_LINKABLE_SEGMENTS,
  ADMIN_CONTEXT_ROUTES,
  DYNAMIC_ID_MIN_LENGTH,
  DYNAMIC_ID_REGEX,
  type DynamicRouteConfig,
} from "./breadcrumb-config";

// ============================================================================
// TYPES
// ============================================================================

export interface BreadcrumbItem {
  label: string;
  href: string;
  isClickable: boolean;
}

// ============================================================================
// LABEL FORMATTING
// ============================================================================

/**
 * Format a URL segment into a readable label
 */
export function formatSegmentLabel(segment: string): string {
  // Check if we have a custom label
  if (PATH_SEGMENT_LABELS[segment]) {
    return PATH_SEGMENT_LABELS[segment];
  }
  
  // Otherwise, format the slug: "hello-world" -> "Hello World"
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get label for a full route path
 */
export function getRouteLabel(path: string): string | null {
  const normalizedPath = path.replace(/\/$/, "");
  return BREADCRUMB_ROUTE_LABELS[normalizedPath] || null;
}

// ============================================================================
// DYNAMIC ROUTE DETECTION
// ============================================================================

/**
 * Check if a segment is likely a dynamic ID (e.g., cuid, uuid)
 */
export function isDynamicId(segment: string): boolean {
  return (
    segment.length > DYNAMIC_ID_MIN_LENGTH &&
    DYNAMIC_ID_REGEX.test(segment)
  );
}

/**
 * Find matching dynamic route configuration for a pathname
 */
export function findDynamicRouteConfig(pathname: string): {
  config: DynamicRouteConfig;
  dynamicId: string;
} | null {
  const pathSegments = pathname.split("/").filter(Boolean);
  
  for (const config of DYNAMIC_ROUTE_PATTERNS) {
    const patternSegments = config.pattern.split("/").filter(Boolean);
    
    // Check if lengths match
    if (patternSegments.length !== pathSegments.length) {
      continue;
    }
    
    // Check if pattern matches
    const matches = patternSegments.every((seg, idx) => {
      if (seg.startsWith("[") && seg.endsWith("]")) {
        return true; // Dynamic segment - matches anything
      }
      return seg === pathSegments[idx];
    });
    
    if (matches) {
      const dynamicId = pathSegments[config.paramIndex];
      if (dynamicId && isDynamicId(dynamicId)) {
        return { config, dynamicId };
      }
    }
  }
  
  return null;
}

/**
 * Generate fallback label for dynamic ID based on parent segment
 */
export function getDynamicIdFallbackLabel(
  segment: string,
  parentSegment: string,
  isLoading: boolean
): string {
  if (isLoading) {
    return "Loading...";
  }
  
  const shortId = segment.substring(0, 8);
  
  switch (parentSegment) {
    case "bookings":
      return `Booking ${shortId}`;
    case "new-enquiries":
      return `Enquiry ${shortId}`;
    case "email-templates":
      return `Template ${shortId}`;
    case "inbox":
      return `Thread ${shortId}`;
    case "orders":
      return `Order ${shortId}`;
    default:
      return formatSegmentLabel(segment);
  }
}

// ============================================================================
// ROUTE VALIDATION
// ============================================================================

/**
 * Check if a route exists and should be clickable
 */
export function isRouteClickable(path: string): boolean {
  const normalizedPath = path.replace(/\/$/, "");
  
  // Never point admin routes to root
  if (normalizedPath === "/" && path.startsWith("/admin")) {
    return false;
  }
  
  // Check if route exists in our configuration
  return BREADCRUMB_ROUTE_LABELS[normalizedPath] !== undefined;
}

/**
 * Check if a segment should be linkable
 */
export function isSegmentLinkable(segment: string): boolean {
  return !NON_LINKABLE_SEGMENTS.includes(segment);
}

// ============================================================================
// ROUTE CONTEXT DETECTION
// ============================================================================

/**
 * Check if pathname is an admin route
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

/**
 * Check if pathname should show admin context (admin or related routes)
 */
export function shouldShowAdminContext(pathname: string): boolean {
  return isAdminRoute(pathname) || ADMIN_CONTEXT_ROUTES.includes(pathname);
}

/**
 * Check if pathname is a password reset route
 */
export function isPasswordResetRoute(pathname: string): boolean {
  return pathname === "/reset-password" || pathname === "/forgot-password";
}

// ============================================================================
// BREADCRUMB GENERATION
// ============================================================================

/**
 * Get the href for a breadcrumb segment
 */
export function getSegmentHref(
  segment: string,
  currentPath: string,
  isLast: boolean,
  pathname: string,
  isAdmin: boolean,
  isPasswordReset: boolean
): { href: string; isClickable: boolean } {
  // Last segment - current page, not clickable
  if (isLast) {
    return { href: pathname, isClickable: false };
  }
  
  // Check for custom route redirect
  const customRoute = CUSTOM_ROUTE_REDIRECTS[segment];
  let href = customRoute || currentPath;
  
  // CRITICAL: Never allow admin routes to point to root "/"
  if ((isAdmin || isPasswordReset) && href === "/") {
    href = "/admin";
    return { href, isClickable: true };
  }
  
  // Check if segment is linkable
  const isLinkable = isSegmentLinkable(segment);
  
  // For admin routes, verify the route exists
  if (isAdmin || isPasswordReset) {
    const isClickable = isRouteClickable(href) && isLinkable && href !== "/";
    return { href: isClickable ? href : "#", isClickable };
  }
  
  // For non-admin routes, just check linkability
  return { href: isLinkable ? href : "#", isClickable: isLinkable };
}

/**
 * Generate breadcrumb items from pathname
 * This is the main breadcrumb generation logic
 */
export function generateBreadcrumbs(
  pathname: string,
  dynamicLabels: Record<string, string> = {},
  loadingDynamic: boolean = false
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Don't generate breadcrumbs for homepage
  if (pathname === "/") {
    return [];
  }
  
  const isAdmin = isAdminRoute(pathname);
  const isPasswordReset = isPasswordResetRoute(pathname);
  const showAdminContext = shouldShowAdminContext(pathname);
  
  // Add root breadcrumb
  if (pathname === "/admin") {
    // On /admin itself, show non-clickable "Admin Dashboard"
    breadcrumbs.push({
      label: "Admin Dashboard",
      href: "/admin",
      isClickable: false,
    });
  } else if (showAdminContext) {
    // For admin routes, start with clickable "Admin Dashboard"
    breadcrumbs.push({
      label: "Admin Dashboard",
      href: "/admin",
      isClickable: true,
    });
    
    // For password reset routes, add Settings as parent
    if (isPasswordReset) {
      breadcrumbs.push({
        label: "Settings",
        href: "/admin/settings",
        isClickable: true,
      });
    }
  } else {
    // For non-admin routes, start with "Home"
    breadcrumbs.push({
      label: "Home",
      href: "/",
      isClickable: true,
    });
  }
  
  // Build breadcrumb path incrementally
  const pathSegments = pathname.split("/").filter(Boolean);
  let currentPath = "";
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip "admin" segment if we're on admin route (already added as "Admin Dashboard")
    if (showAdminContext && segment === "admin" && index === 0) {
      return;
    }
    
    // Skip settings segment for password reset routes (already added)
    if (isPasswordReset && segment === "settings") {
      return;
    }
    
    // Determine label
    let label: string;
    const isDynamic = isDynamicId(segment);
    
    if (isDynamic && dynamicLabels[segment]) {
      // Use fetched dynamic label
      label = dynamicLabels[segment];
    } else if (isDynamic) {
      // Generate fallback label
      const parentSegment = index > 0 ? pathSegments[index - 1] : "";
      label = getDynamicIdFallbackLabel(segment, parentSegment, loadingDynamic);
    } else {
      // Use static label
      label = formatSegmentLabel(segment);
    }
    
    // Get href and clickability
    const isLast = index === pathSegments.length - 1;
    const { href, isClickable } = getSegmentHref(
      segment,
      currentPath,
      isLast,
      pathname,
      isAdmin,
      isPasswordReset
    );
    
    breadcrumbs.push({
      label,
      href,
      isClickable,
    });
  });
  
  return breadcrumbs;
}
