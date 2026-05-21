/**
 * Unfinished client dashboard widgets (budget, guest count, add-ons).
 * Hidden in production by default — APIs and persistence are not wired yet.
 *
 * Re-enable locally or on staging for testing:
 *   NEXT_PUBLIC_ENABLE_DASHBOARD_WIDGETS=true
 */
export const showDashboardWidgets =
  process.env.NEXT_PUBLIC_ENABLE_DASHBOARD_WIDGETS === "true";
