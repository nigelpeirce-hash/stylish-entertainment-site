"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import {
  generateBreadcrumbs,
  findDynamicRouteConfig,
  shouldShowAdminContext,
  type BreadcrumbItem,
} from "@/lib/breadcrumb-utils";
import {
  BREADCRUMB_STYLES,
  BREADCRUMB_API_ENDPOINT,
} from "@/lib/breadcrumb-config";

/**
 * Breadcrumbs Component
 * 
 * Displays navigation breadcrumbs based on current pathname.
 * Supports dynamic routes with database lookups for contextual labels.
 * 
 * Features:
 * - Auto-generates breadcrumbs from URL structure
 * - Fetches contextual labels for dynamic IDs (bookings, enquiries, etc.)
 * - Handles admin and client portal routes
 * - Shows Home icon for public routes, "Admin Dashboard" for admin routes
 */
export default function Breadcrumbs() {
  const pathname = usePathname();
  const [dynamicLabels, setDynamicLabels] = useState<Record<string, string>>({});
  const [loadingDynamic, setLoadingDynamic] = useState(false);

  // Fetch dynamic labels for routes like /admin/bookings/[id]
  useEffect(() => {
    const fetchDynamicLabels = async () => {
      const dynamicRoute = findDynamicRouteConfig(pathname);
      
      if (dynamicRoute) {
        const { config, dynamicId } = dynamicRoute;
        
        setLoadingDynamic(true);
        try {
          const response = await fetch(
            `${BREADCRUMB_API_ENDPOINT}?type=${config.type}&id=${dynamicId}`
          );
          
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
    };

    fetchDynamicLabels();
  }, [pathname]);

  // Don't show breadcrumbs on homepage
  if (pathname === "/") {
    return null;
  }

  // Generate breadcrumb items using utility function
  const breadcrumbs = generateBreadcrumbs(pathname, dynamicLabels, loadingDynamic);

  // If no breadcrumbs generated, don't render
  if (breadcrumbs.length === 0) {
    return null;
  }

  const showAdminContext = shouldShowAdminContext(pathname);

  return (
    <nav
      className={BREADCRUMB_STYLES.background}
      aria-label="Breadcrumb"
    >
      <div className={`container mx-auto ${BREADCRUMB_STYLES.spacing.container}`}>
        <ol className={`flex items-center ${BREADCRUMB_STYLES.spacing.item} text-sm`}>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const isFirst = index === 0;
            
            return (
              <li key={`${crumb.href}-${index}`} className="flex items-center">
                {isFirst && !showAdminContext ? (
                  // Show home icon for first breadcrumb on public routes
                  <Link
                    href={crumb.href}
                    className={`${BREADCRUMB_STYLES.colors.inactive} ${BREADCRUMB_STYLES.colors.hover} flex items-center min-h-[44px] min-w-[44px] items-center justify-center`}
                    aria-label="Home"
                  >
                    <Home className="w-4 h-4" aria-hidden />
                  </Link>
                ) : (
                  <>
                    {!isFirst && (
                      <span className={`text-gray-500 ${BREADCRUMB_STYLES.spacing.separator}`}>
                        {BREADCRUMB_STYLES.separator}
                      </span>
                    )}
                    {isLast || !crumb.isClickable ? (
                      // Current page or non-clickable item
                      <span className={isLast ? BREADCRUMB_STYLES.colors.active : BREADCRUMB_STYLES.colors.disabled}>
                        {crumb.label}
                      </span>
                    ) : (
                      // Clickable breadcrumb link
                      <Link
                        href={crumb.href}
                        className={`${BREADCRUMB_STYLES.colors.inactive} ${BREADCRUMB_STYLES.colors.hover}`}
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
