/**
 * Breadcrumb Configuration - Single Source of Truth
 * Centralized route labels, patterns, and styling for the breadcrumb system
 */

// ============================================================================
// ROUTE LABELS - All routes and their display names
// ============================================================================

export const BREADCRUMB_ROUTE_LABELS: Record<string, string> = {
  // Core routes
  "/": "Home",
  
  // Public routes
  "/about": "About Us",
  "/blog": "Journal",
  "/artists": "Artists",
  "/djs": "DJs",
  "/musicians": "Musicians",
  "/party-djs": "Party DJs",
  "/weddings": "Weddings",
  "/wedding-lighting": "Wedding Lighting",
  "/wedding-entertainment": "Wedding Entertainment",
  "/parties": "Parties",
  "/party-lighting": "Party Lighting",
  "/private-parties": "Private Parties",
  "/corporate-events": "Corporate Events",
  "/corporate": "Corporate",
  "/christmas": "Christmas",
  "/what-we-do": "What We Do",
  "/venue-decoration": "Venue Styling",
  "/lighting": "Lighting",
  "/equipment-dj-band-sound-kit": "Sound Equipment",
  "/fire-pit-html": "Fire Pit Hire",
  "/services": "Services",
  "/kit-hire": "Kit Hire",
  "/fire-pit-hire": "Fire Pit Hire",
  "/lighting-design": "Lighting Design",
  "/venue-styling": "Venue Styling",
  "/galleries": "Galleries",
  "/contact": "Contact",
  "/contact-us": "Contact Us",
  "/contact-us/": "Contact Us",
  "/venues": "Venues",
  "/testi": "Testimonials",
  "/faq": "FAQ",
  "/party-planning-and-organising": "Party Planning",
  "/party-planning-and-organising/": "Party Planning",
  
  // Blog posts (examples)
  "/five-ways-to-totally-transform-a-venue-1-lighting": "Five Ways to Transform a Venue #1 Lighting",
  "/five-ways-to-totally-transform-a-venue-2-decor": "Five Ways to Transform a Venue #2 Decor",
  "/bristol-university-spring-ball": "Bristol University Spring Ball",
  
  // Client area routes
  "/client": "Client Portal",
  "/client/dashboard": "Dashboard",
  "/client/profile": "Profile",
  "/client/bookings": "Bookings",
  "/client/bookings/new": "New Booking",
  "/client/messages": "Messages",
  
  // Admin routes
  "/admin": "Admin Dashboard",
  "/admin/bookings": "Bookings",
  "/admin/settings": "Settings",
  "/admin/users": "User Management",
  "/admin/hire-items": "Hire Shop Items",
  "/admin/hire-items/seed": "Seed Hire Items",
  "/admin/email-audit": "Email Setup Audit",
  "/admin/db-audit": "Database Audit",
  "/admin/dev-bypass-toggle": "Dev Bypass Toggle",
  "/admin/90-day-command": "90-Day Command Centre",
  "/admin/orders": "Hire Orders",
  "/admin/inbox": "Email Inbox",
  "/admin/email-templates": "Email Templates",
  "/admin/email-templates/create-default": "Create Default Templates",
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
  "/admin/email-previews": "Email Template Previews",
  "/admin/sandbox/footer-demo": "Footer Demo",
  "/admin/sandbox/terms-portal-demo": "Terms Portal Demo",
  
  // Password reset routes (public but accessed from admin)
  "/reset-password": "Password Reset",
  "/forgot-password": "Forgot Password",
};

// ============================================================================
// PATH SEGMENT LABELS - For building breadcrumbs from URL segments
// ============================================================================

export const PATH_SEGMENT_LABELS: Record<string, string> = {
  // Extract just the segment part (without slashes) for URL parsing
  "about": "About Us",
  "blog": "Journal",
  "artists": "Artists",
  "djs": "DJs",
  "musicians": "Musicians",
  "party-djs": "Party DJs",
  "weddings": "Weddings",
  "wedding-lighting": "Wedding Lighting",
  "wedding-entertainment": "Wedding Entertainment",
  "parties": "Parties",
  "party-lighting": "Party Lighting",
  "private-parties": "Private Parties",
  "corporate-events": "Corporate Events",
  "corporate": "Corporate",
  "christmas": "Christmas",
  "what-we-do": "What We Do",
  "venue-decoration": "Venue Styling",
  "lighting": "Lighting",
  "equipment-dj-band-sound-kit": "Sound Equipment",
  "fire-pit-html": "Fire Pit Hire",
  "services": "Services",
  "kit-hire": "Kit Hire",
  "fire-pit-hire": "Fire Pit Hire",
  "lighting-design": "Lighting Design",
  "venue-styling": "Venue Styling",
  "galleries": "Galleries",
  "contact": "Contact",
  "contact-us": "Contact Us",
  "venues": "Venues",
  "testi": "Testimonials",
  "faq": "FAQ",
  "party-planning-and-organising": "Party Planning",
  "five-ways-to-totally-transform-a-venue-1-lighting": "Five Ways to Transform a Venue #1 Lighting",
  "five-ways-to-totally-transform-a-venue-2-decor": "Five Ways to Transform a Venue #2 Decor",
  "bristol-university-spring-ball": "Bristol University Spring Ball",

  // DJ profile slugs — override the auto-titlecased fallback so "dj-nige"
  // renders as "DJ Nige" rather than "Dj Nige".
  "dj-nige": "DJ Nige",
  "dj-james": "DJ James",
  "james-h": "James H",
  "rich-s": "Rich S",

  // Client area
  "client": "Client Portal",
  "dashboard": "Dashboard",
  "profile": "Profile",
  "bookings": "Bookings",
  "new": "New Booking",
  "messages": "Messages",
  
  // Admin area
  "admin": "Admin Dashboard",
  "settings": "Settings",
  "users": "User Management",
  "hire-items": "Hire Shop Items",
  "email-audit": "Email Setup Audit",
  "db-audit": "Database Audit",
  "dev-bypass-toggle": "Dev Bypass Toggle",
  "90-day-command": "90-Day Command Centre",
  "orders": "Hire Orders",
  "inbox": "Email Inbox",
  "email-templates": "Email Templates",
  "emails": "Email Journey",
  "freelance-crew": "Freelance Crew",
  "enquiries": "Enquiries",
  "new-enquiries": "New Enquiries",
  "seed": "Seed Hire Items",
  "reset-password": "Password Reset",
  "forgot-password": "Forgot Password",
  "vice-versa": "Vice Versa Dashboard",
  "setup": "Setup",
  "dev-entry": "Dev Entry",
  "fix-dates": "Fix Dates",
  "create-default": "Create Default Templates",
  "email-previews": "Email Template Previews",
  "sandbox": "Sandbox",
  "footer-demo": "Footer Demo",
  "terms-portal-demo": "Terms Portal Demo",
};

// ============================================================================
// DYNAMIC ROUTE CONFIGURATION
// ============================================================================

export interface DynamicRouteConfig {
  pattern: string;
  type: "booking" | "enquiry" | "template" | "thread" | "order";
  paramIndex: number;
}

export const DYNAMIC_ROUTE_PATTERNS: DynamicRouteConfig[] = [
  { pattern: "/admin/bookings/[id]", type: "booking", paramIndex: 2 },
  { pattern: "/admin/new-enquiries/[id]", type: "enquiry", paramIndex: 2 },
  { pattern: "/admin/email-templates/[id]", type: "template", paramIndex: 2 },
  { pattern: "/admin/inbox/[id]", type: "thread", paramIndex: 2 },
  { pattern: "/admin/orders/[id]", type: "order", paramIndex: 2 },
];

// ============================================================================
// CUSTOM ROUTE REDIRECTS
// ============================================================================

// Paths that should redirect to a different route in breadcrumbs
export const CUSTOM_ROUTE_REDIRECTS: Record<string, string> = {
  "client": "/client/dashboard", // /client doesn't exist, link to dashboard instead
  "dashboard": "/client/dashboard", // Always link dashboard back to /client/dashboard
  "profile": "/client/profile",
  "bookings": "/client/dashboard", // /client/bookings doesn't exist, link to dashboard
  "new": "/client/bookings/new",
  "messages": "/client/messages",
};

// ============================================================================
// NON-LINKABLE PATHS
// ============================================================================

// Path segments that should not be linked (they don't have actual pages)
export const NON_LINKABLE_SEGMENTS: string[] = [
  "weddings", // Parent category, no actual page
];

// ============================================================================
// VISUAL STYLING
// ============================================================================

export const BREADCRUMB_STYLES = {
  separator: ">",
  separatorIcon: "ChevronRight",
  colors: {
    active: "text-white font-medium",
    inactive: "text-gray-400",
    hover: "hover:text-champagne-gold transition-colors",
    disabled: "text-gray-500 cursor-default",
  },
  spacing: {
    container: "py-3 px-4",
    item: "space-x-1",
    separator: "mx-2",
  },
  background: "bg-gray-900/25 border-b border-champagne-gold/20",
};

// ============================================================================
// UTILITY CONSTANTS
// ============================================================================

export const DYNAMIC_ID_MIN_LENGTH = 15; // Minimum length to consider a segment as an ID
export const DYNAMIC_ID_REGEX = /^[a-z0-9]+$/; // Pattern for valid dynamic IDs
export const BREADCRUMB_API_ENDPOINT = "/api/admin/breadcrumb-data";

// Routes that should show admin context (even if not under /admin)
export const ADMIN_CONTEXT_ROUTES = ["/reset-password", "/forgot-password"];
