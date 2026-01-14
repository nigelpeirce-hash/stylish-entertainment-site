"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
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
};

// Paths that should not be linked (they don't have actual pages)
const nonLinkablePaths: string[] = [];

// Paths that should link to a specific route instead of the generated path
const customRoutes: Record<string, string> = {
  "client": "/client/dashboard", // /client doesn't exist, link to dashboard instead
  "dashboard": "/client/dashboard",
  "profile": "/client/profile",
  "bookings": "/client/dashboard", // /client/bookings doesn't exist, link to dashboard
  "new": "/client/bookings/new",
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

  // Don't show breadcrumbs on homepage
  if (pathname === "/") {
    return null;
  }

  // Generate breadcrumb items
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
  ];

  // Build breadcrumb path incrementally
  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = formatLabel(segment);
    
    // Check if this path should be linkable
    const isLinkable = !nonLinkablePaths.includes(segment);
    
    // Use custom route if available, otherwise use the generated path
    let href = customRoutes[segment] || currentPath;
    
    // For the last segment, always use the current pathname
    if (index === pathSegments.length - 1) {
      href = pathname;
    }
    
    breadcrumbs.push({
      label,
      href: isLinkable ? href : "#",
    });
  });

  return (
    <nav
      className="bg-gray-900/25 border-b border-champagne-gold/20 py-3 px-4"
      aria-label="Breadcrumb"
    >
      <div className="container mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center">
                {index === 0 ? (
                  <Link
                    href={crumb.href}
                    className="text-white hover:text-champagne-gold transition-colors flex items-center"
                  >
                    <Home className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <ChevronRight className="w-4 h-4 text-white mx-2" />
                    {isLast ? (
                      <span className="text-champagne-gold font-medium">
                        {crumb.label}
                      </span>
                    ) : crumb.href === "#" ? (
                      <span className="text-gray-500 cursor-default">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="text-white hover:text-champagne-gold transition-colors"
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
