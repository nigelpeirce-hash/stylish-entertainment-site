"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Home } from "lucide-react";
import { adminRoutes, isRouteClickable } from "@/lib/breadcrumb-routes";

interface BreadcrumbItem {
  label: string;
  href: string;
  isClickable: boolean;
}

// Map of path segments to readable labels
const pathLabels: Record<string, string> = {
  "about": "About Us",
  "blog": "Blog",
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
  "lighting-hire-2": "Lighting Hire",
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
  // Client area labels
  "client": "Client Portal",
  "dashboard": "Dashboard",
  "profile": "Profile",
  "bookings": "Bookings",
  "new": "New Booking",
  // Admin area labels - must match page titles exactly
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
  "djs": "DJs",
  "musicians": "Musicians",
  "vice-versa": "Vice Versa Dashboard",
  "setup": "Setup",
  "dev-entry": "Dev Entry",
  "fix-dates": "Fix Dates",
  "create-default": "Create Default Templates",
  "email-previews": "Email Template Previews",
};

// Paths that should not be linked (they don't have actual pages)
const nonLinkablePaths: string[] = ["weddings"];

// Dynamic route patterns that need data fetching
const dynamicRoutePatterns: Record<string, { type: string; paramIndex: number }> = {
  "/admin/bookings/[id]": { type: "booking", paramIndex: 2 },
  "/admin/new-enquiries/[id]": { type: "enquiry", paramIndex: 2 },
  "/admin/email-templates/[id]": { type: "template", paramIndex: 2 },
  "/admin/inbox/[id]": { type: "thread", paramIndex: 2 },
  "/admin/orders/[id]": { type: "order", paramIndex: 2 },
};

// Paths that should link to a specific route instead of the generated path
const customRoutes: Record<string, string> = {
  "client": "/client/dashboard", // /client doesn't exist, link to dashboard instead
  "dashboard": "/client/dashboard", // Always link dashboard back to /client/dashboard
  "profile": "/client/profile",
  "bookings": "/client/dashboard", // /client/bookings doesn't exist, link to dashboard
  "new": "/client/bookings/new",
  "messages": "/client/messages",
};

// Function to format slug to readable label
function formatLabel(slug: string): string {
  // Check if we have a custom label
  if (pathLabels[slug]) {
    return pathLabels[slug];
  }
  // Otherwise, format the slug
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const [dynamicLabels, setDynamicLabels] = useState<Record<string, string>>({});
  const [loadingDynamic, setLoadingDynamic] = useState(false);

  // Fetch dynamic labels for dynamic routes
  useEffect(() => {
    const fetchDynamicLabels = async () => {
      // Check if this is a dynamic route that needs data
      const dynamicPattern = Object.keys(dynamicRoutePatterns).find(pattern => {
        const patternSegments = pattern.split("/").filter(Boolean);
        const pathSegments = pathname.split("/").filter(Boolean);
        
        if (patternSegments.length !== pathSegments.length) return false;
        
        return patternSegments.every((seg, idx) => {
          if (seg.startsWith("[") && seg.endsWith("]")) return true; // Dynamic segment
          return seg === pathSegments[idx];
        });
      });

      if (dynamicPattern) {
        const { type, paramIndex } = dynamicRoutePatterns[dynamicPattern];
        const dynamicId = pathSegments[paramIndex];
        
        if (dynamicId && dynamicId.length > 10) { // Likely an ID (cuid is ~25 chars)
          setLoadingDynamic(true);
          try {
            const response = await fetch(`/api/admin/breadcrumb-data?type=${type}&id=${dynamicId}`);
            if (response.ok) {
              const data = await response.json();
              setDynamicLabels({ [dynamicId]: data.label });
            }
          } catch (error) {
            console.error("Error fetching breadcrumb data:", error);
          } finally {
            setLoadingDynamic(false);
          }
        }
      }
    };

    fetchDynamicLabels();
  }, [pathname]);

  // Don't show breadcrumbs on homepage
  if (pathname === "/") {
    return null;
  }

  // Check if we're in the admin area
  const isAdminRoute = pathname.startsWith("/admin");
  
  // Password reset routes should show admin context
  const isPasswordResetRoute = pathname === "/reset-password" || pathname === "/forgot-password";
  
  // Generate breadcrumb items
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // For admin routes, ALWAYS start with "Admin Dashboard" instead of "Home"
  // Also handle password reset routes that should show admin context
  if (isAdminRoute || isPasswordResetRoute) {
    // If we're on /admin itself, only show "Admin Dashboard"
    if (pathname === "/admin") {
      breadcrumbs.push({ 
        label: "Admin Dashboard", 
        href: "/admin",
        isClickable: false, // Current page
      });
    } else {
      // For other admin routes, start with "Admin Dashboard" (clickable)
      breadcrumbs.push({ 
        label: "Admin Dashboard", 
        href: "/admin",
        isClickable: true,
      });
      
      // For password reset routes, add Settings as parent
      if (isPasswordResetRoute) {
        breadcrumbs.push({
          label: "Settings",
          href: "/admin/settings",
          isClickable: true,
        });
      }
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
  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // For admin routes, skip adding "admin" as a breadcrumb since we already have "Admin Dashboard"
    if (isAdminRoute && segment === "admin" && index === 0) {
      return; // Skip the "admin" segment
    }
    
    // For password reset routes, we've already added Settings, so skip it if it appears
    if (isPasswordResetRoute && segment === "settings") {
      return; // Skip settings segment for password reset routes
    }
    
    // Check if this is a dynamic segment (likely an ID)
    const isDynamicId = segment.length > 15 && /^[a-z0-9]+$/.test(segment);
    let label: string;
    
    if (isDynamicId && dynamicLabels[segment]) {
      // Use fetched dynamic label
      label = dynamicLabels[segment];
    } else if (isDynamicId) {
      // Fallback: try to format as "Booking" or use segment
      const parentSegment = index > 0 ? pathSegments[index - 1] : "";
      if (parentSegment === "bookings") {
        label = loadingDynamic ? "Loading..." : `Booking ${segment.substring(0, 8)}`;
      } else if (parentSegment === "new-enquiries") {
        label = loadingDynamic ? "Loading..." : `Enquiry ${segment.substring(0, 8)}`;
      } else if (parentSegment === "email-templates") {
        label = loadingDynamic ? "Loading..." : `Template ${segment.substring(0, 8)}`;
      } else if (parentSegment === "inbox") {
        label = loadingDynamic ? "Loading..." : `Thread ${segment.substring(0, 8)}`;
      } else if (parentSegment === "orders") {
        label = loadingDynamic ? "Loading..." : `Order ${segment.substring(0, 8)}`;
      } else {
        label = formatLabel(segment);
      }
    } else {
      label = formatLabel(segment);
    }
    
    // Check if this path should be linkable
    const isLinkable = !nonLinkablePaths.includes(segment);
    
    // Use custom route if available, otherwise use the generated path
    const isLast = index === pathSegments.length - 1;
    let href: string;
    let isClickable = false;
    
    if (isLast) {
      // Last segment - current page, not clickable
      href = pathname;
      isClickable = false;
    } else {
      // Not last segment - check if route exists
      href = customRoutes[segment] || currentPath;
      
      // CRITICAL: Never allow admin routes to point to root "/"
      if ((isAdminRoute || isPasswordResetRoute) && href === "/") {
        href = "/admin";
        isClickable = true;
      } else {
        // For admin routes, verify the route exists and is clickable
        if (isAdminRoute || isPasswordResetRoute) {
          isClickable = isRouteClickable(href) && isLinkable && href !== "/";
        } else {
          isClickable = isLinkable;
        }
      }
    }
    
    breadcrumbs.push({
      label,
      href: isClickable ? href : "#",
      isClickable,
    });
  });

  return (
    <nav
      className="bg-gray-900/25 border-b border-champagne-gold/20 py-3 px-4"
      aria-label="Breadcrumb"
    >
      <div className="container mx-auto">
        <ol className="flex items-center space-x-1 text-sm">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const isFirst = index === 0;
            
            return (
              <li key={`${crumb.href}-${index}`} className="flex items-center">
                {isFirst && !isAdminRoute && !isPasswordResetRoute ? (
                  <Link
                    href={crumb.href}
                    className="text-gray-400 hover:text-champagne-gold transition-colors flex items-center"
                  >
                    <Home className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    {!isFirst && (
                      <span className="text-gray-500 mx-2">&gt;</span>
                    )}
                    {isLast || !crumb.isClickable ? (
                      <span className="text-white font-medium">
                        {crumb.label}
                      </span>
                    ) : crumb.href === "#" ? (
                      <span className="text-gray-500 cursor-default">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="text-gray-400 hover:text-champagne-gold transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
