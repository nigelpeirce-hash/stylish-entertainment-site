/**
 * Breadcrumb Route Verification System
 * Defines valid admin routes and their labels
 */

// Map of valid admin routes to their display labels
export const adminRoutes: Record<string, string> = {
  "/admin": "Admin Dashboard",
  "/admin/bookings": "Bookings",
  "/admin/settings": "Settings",
  "/admin/users": "User Management",
  "/admin/hire-items": "Hire Shop Items",
  "/admin/email-audit": "Email Setup Audit",
  "/admin/db-audit": "Database Audit",
  "/admin/dev-bypass-toggle": "Dev Bypass Toggle",
  "/admin/90-day-command": "90-Day Command Centre",
  "/admin/orders": "Hire Orders",
  "/admin/inbox": "Email Inbox",
  "/admin/email-templates": "Email Templates",
  "/admin/emails": "Email Journey",
  "/admin/freelance-crew": "Freelance Crew",
  "/admin/enquiries": "Enquiries",
  "/admin/new-enquiries": "New Enquiries",
  "/admin/djs": "DJs",
  "/admin/musicians": "Musicians",
  "/admin/vice-versa": "Vice Versa Dashboard",
  "/admin/setup": "Setup",
  "/admin/dev-entry": "Dev Entry",
  "/admin/bookings/fix-dates": "Fix Dates",
  "/admin/hire-items/seed": "Seed Hire Items",
  "/admin/email-templates/create-default": "Create Default Templates",
  "/admin/email-previews": "Email Template Previews",
  // Password reset routes (public but accessed from admin)
  "/reset-password": "Password Reset",
  "/forgot-password": "Forgot Password",
};

// Routes that don't have their own page (parent routes that are just containers)
// These routes exist and are clickable, so they're not in this list
export const nonPageRoutes: string[] = [
  // None - all admin routes have actual pages
];

// Check if a route exists
export function routeExists(path: string): boolean {
  // Remove trailing slashes
  const normalizedPath = path.replace(/\/$/, "");
  
  // Check exact match
  if (adminRoutes[normalizedPath]) {
    return true;
  }
  
  // Check if it's a dynamic route pattern (contains [id] or similar)
  // For now, we'll consider dynamic routes as existing if their parent exists
  if (normalizedPath.includes("/[id]") || normalizedPath.match(/\/[a-z0-9]{20,}/)) {
    // Check if parent route exists
    const parentPath = normalizedPath.split("/").slice(0, -1).join("/");
    return routeExists(parentPath) || adminRoutes[parentPath] !== undefined;
  }
  
  return false;
}

// Get the label for a route
export function getRouteLabel(path: string): string | null {
  const normalizedPath = path.replace(/\/$/, "");
  return adminRoutes[normalizedPath] || null;
}

// Check if a route should be clickable
export function isRouteClickable(path: string): boolean {
  const normalizedPath = path.replace(/\/$/, "");
  
  // Never point admin routes to root
  if (normalizedPath.startsWith("/admin") && normalizedPath === "/") {
    return false;
  }
  
  // Check if route exists
  return routeExists(normalizedPath);
}
