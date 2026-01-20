/**
 * Admin Permissions Utility
 * Manages SuperAdmin vs Regular Admin access
 */

const SUPER_ADMIN_EMAIL = "nigel@stylishentertainment.co.uk";

/**
 * Check if a user is a SuperAdmin
 */
export function isSuperAdmin(userEmail: string | null | undefined): boolean {
  if (!userEmail) return false;
  return userEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

/**
 * Check if a route requires SuperAdmin access
 */
export function requiresSuperAdmin(route: string): boolean {
  const protectedRoutes = [
    "/admin/settings",
    "/admin/email-audit",
    "/admin/db-audit",
    "/admin/dev-bypass-toggle",
    "/admin/users",
    "/admin/hire-items/seed",
    "/demo-booking-form",
  ];

  return protectedRoutes.some((protectedRoute) => 
    route.startsWith(protectedRoute)
  );
}

/**
 * Get user's access level
 */
export function getUserAccessLevel(userEmail: string | null | undefined): "superadmin" | "admin" | "none" {
  if (!userEmail) return "none";
  if (isSuperAdmin(userEmail)) return "superadmin";
  return "admin";
}
