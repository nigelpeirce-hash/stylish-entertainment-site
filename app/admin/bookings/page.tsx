"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Calendar,
  Search,
  Flag,
  Mail,
  User,
  MapPin,
} from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  name: string;
  email: string;
  eventType: string;
  eventDate: string;
  venueName: string;
  venuePostcode: string | null;
  status: string;
  priority: string;
  conflictStatus: string | null;
  flaggedFor: string | null; // "user1" or "user2"
  assignedTo: string | null; // "ali", "husband", "none"
  handoffStatus: string | null; // "action_needed", "tech_review", "tech_alert", "awaiting_quote"
  handoffNote: string | null;
  numberOfGuests: number | null;
  services: string[];
  user: { id: string; name: string; email: string } | null;
}

// Helper function to get initials from name
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// Helper function to get color for initials circle
function getInitialsColor(name: string): string {
  const colors = [
    "bg-blue-600",
    "bg-purple-600",
    "bg-green-600",
    "bg-yellow-600",
    "bg-pink-600",
    "bg-indigo-600",
    "bg-red-600",
    "bg-teal-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function AdminBookingsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  // Priority flag names - can be customized
  const [user1Name, setUser1Name] = useState("Nigel");
  const [user2Name, setUser2Name] = useState("Ali");
  // Handoff names
  const [wifeName, setWifeName] = useState("Ali");
  const [yourName, setYourName] = useState("Nigel");

  // Use refs to track previous values and prevent unnecessary fetches
  const prevFilterRef = useRef<string>("all");
  const prevSearchRef = useRef<string>("");
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);
  const isFetchingRef = useRef(false);
  const lastStatusRef = useRef<string | null>(null);
  const lastSessionIdRef = useRef<string | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const isPageVisibleRef = useRef<boolean>(true);

  // Define fetchBookings as a stable function using refs
  const fetchBookingsRef = useRef<() => Promise<void>>();
  
  fetchBookingsRef.current = async () => {
    // Don't fetch if page is not visible
    if (!isPageVisibleRef.current) {
      console.log("Page not visible, skipping fetch");
      return;
    }
    
    // Aggressive throttle: prevent concurrent fetches and rapid successive fetches (2 seconds minimum)
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    
    if (isFetchingRef.current) {
      console.log("Fetch already in progress, skipping");
      return;
    }
    
    if (timeSinceLastFetch < 2000) {
      console.log(`Throttled: only ${timeSinceLastFetch}ms since last fetch`);
      return;
    }
    
    isFetchingRef.current = true;
    lastFetchTimeRef.current = now;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const currentFilter = prevFilterRef.current;
      const currentSearch = prevSearchRef.current;
      
      if (currentFilter !== "all") params.append("status", currentFilter);
      if (currentSearch) params.append("search", currentSearch);

      console.log("Fetching bookings:", params.toString());
      const response = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Page Visibility API: Pause fetching when tab is hidden
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      isPageVisibleRef.current = isVisible;
      
      if (isVisible && hasInitializedRef.current) {
        // Page became visible - fetch fresh data after a short delay
        console.log("Page became visible, fetching fresh data");
        setTimeout(() => {
          fetchBookingsRef.current?.();
        }, 500);
      }
    };

    // Set initial visibility state
    isPageVisibleRef.current = !document.hidden;

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Authentication check
  useEffect(() => {
    // Auto-enable dev bypass on localhost (development only)
    const isLocalhost = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" || 
       window.location.hostname === "127.0.0.1" ||
       window.location.hostname.startsWith("192.168.") ||
       window.location.hostname.startsWith("10."));

    if (isLocalhost) {
      sessionStorage.setItem("dev_admin_bypass", "true");
      sessionStorage.setItem("dev_admin_role", "admin");
      sessionStorage.setItem("dev_admin_name", "Local Admin");
    }

    const devBypass = typeof window !== "undefined" && 
      sessionStorage.getItem("dev_admin_bypass") === "true";
    const isAdmin = session && (session?.user as any)?.role === "admin";

    if (status === "unauthenticated" && !devBypass && !isLocalhost) {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && !isAdmin && !devBypass && !isLocalhost) {
      router.push("/client/dashboard");
      return;
    }
  }, [status, session, router]);

  // Initial fetch only (separate from filter/search changes)
  useEffect(() => {
    const isLocalhost = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" || 
       window.location.hostname === "127.0.0.1" ||
       window.location.hostname.startsWith("192.168.") ||
       window.location.hostname.startsWith("10."));
    const devBypass = typeof window !== "undefined" && 
      sessionStorage.getItem("dev_admin_bypass") === "true";
    const isAdmin = session && (session?.user as any)?.role === "admin";

    // Wait for session to load
    if (status !== "authenticated" && status !== "unauthenticated") return;
    
    // Check if we should allow access
    if (!isAdmin && !devBypass && !isLocalhost) return;

    // Only fetch once on mount (check if already initialized)
    if (hasInitializedRef.current) return;
    
    // Mark as initialized
    hasInitializedRef.current = true;
    lastStatusRef.current = status;
    lastSessionIdRef.current = session?.user?.id || null;
    prevFilterRef.current = filter;
    prevSearchRef.current = search;
    
    // Fetch bookings - use a small delay to ensure everything is ready
    setTimeout(() => {
      fetchBookingsRef.current?.();
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.id]); // Depend on status and session ID only

  // Separate effect for filter/search changes (debounced)
  useEffect(() => {
    // Don't run until initialized
    if (!hasInitializedRef.current) return;

    // Only fetch if filter or search has actually changed
    const filterChanged = prevFilterRef.current !== filter;
    const searchChanged = prevSearchRef.current !== search;
    
    if (!filterChanged && !searchChanged) return;

    // Prevent if already fetching
    if (isFetchingRef.current) return;
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // Clear any existing timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    // Debounce the fetch (increased to 500ms to reduce calls)
    fetchTimeoutRef.current = setTimeout(() => {
      // Double check we're still initialized and not already fetching
      if (isFetchingRef.current) return;
      prevFilterRef.current = filter;
      prevSearchRef.current = search;
      fetchBookingsRef.current?.();
    }, 500); // Increased debounce time

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [filter, search]); // Only depend on filter and search

  const handleToggleFlag = async (bookingId: string, currentFlag: string | null) => {
    try {
      // Cycle through: null -> user1 -> user2 -> null
      let newFlag: string | null = null;
      if (!currentFlag) {
        newFlag = "user1";
      } else if (currentFlag === "user1") {
        newFlag = "user2";
      } else {
        newFlag = null;
      }

      const response = await fetch(`/api/admin/bookings/${bookingId}/flag`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flaggedFor: newFlag }),
      });

      if (response.ok) {
        await fetchBookingsRef.current?.();
      }
    } catch (error) {
      console.error("Error toggling flag:", error);
    }
  };

  const handleAssign = async (bookingId: string, assignedTo: string) => {
    try {
      // Map "ali" to the correct value and track who assigned
      const assignValue = assignedTo === "ali" ? "ali" : assignedTo;
      const response = await fetch(`/api/admin/bookings/${bookingId}/handoff`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "assign",
          assignedTo: assignValue,
          assignedBy: assignValue === "ali" ? "Nigel" : undefined, // Track if Nigel is assigning to Ali
        }),
      });

      if (response.ok) {
        await fetchBookingsRef.current?.();
      }
    } catch (error) {
      console.error("Error assigning booking:", error);
    }
  };

  const getFlagColor = (flag: string | null) => {
    if (flag === "user1") return "bg-blue-50 hover:bg-blue-100";
    if (flag === "user2") return "bg-purple-50 hover:bg-purple-100";
    return "bg-gray-800 hover:bg-gray-750";
  };

  const getFlagIconColor = (flag: string | null) => {
    if (flag === "user1") return "text-blue-600";
    if (flag === "user2") return "text-purple-600";
    return "text-gray-400";
  };

  const getBorderColor = (flag: string | null) => {
    if (flag === "user1") return "border-blue-500";
    if (flag === "user2") return "border-purple-500";
    return "border-transparent";
  };

  const getHandoffColor = (assignedTo: string | null, handoffStatus: string | null) => {
    if (!assignedTo) return "border-transparent bg-gray-800 hover:bg-gray-750";
    // Support both "ali" and legacy "wife" values
    if (assignedTo === "ali" || assignedTo === "wife") {
      if (handoffStatus === "action_needed") return "border-yellow-500 bg-yellow-950/20";
      if (handoffStatus === "tech_review") return "border-blue-500 bg-blue-950/20";
      if (handoffStatus === "tech_alert") return "border-orange-500 bg-orange-950/20";
      if (handoffStatus === "awaiting_quote") return "border-purple-500 bg-purple-950/20";
      return "border-gray-500 bg-gray-800 hover:bg-gray-750";
    }
    if (assignedTo === "husband" || assignedTo === "you" || assignedTo === "nigel") {
      if (handoffStatus === "action_needed") return "border-yellow-500 bg-yellow-950/20";
      if (handoffStatus === "tech_review") return "border-blue-500 bg-blue-950/20";
      if (handoffStatus === "tech_alert") return "border-orange-500 bg-orange-950/20";
      if (handoffStatus === "awaiting_quote") return "border-purple-500 bg-purple-950/20";
      return "border-gray-500 bg-gray-800 hover:bg-gray-750";
    }
    return "border-transparent bg-gray-800 hover:bg-gray-750";
  };

  const getHandoffBadge = (assignedTo: string | null, handoffStatus: string | null) => {
    if (!assignedTo || !handoffStatus) return null;
    const statusMap: { [key: string]: string } = {
      action_needed: "Action Needed",
      tech_review: "Tech Review",
      tech_alert: "Tech Alert",
      awaiting_quote: "Awaiting Quote",
    };
    return statusMap[handoffStatus] || null;
  };

  // Check for dev bypass
  const isLocalhost = typeof window !== "undefined" && 
    (process.env.NODE_ENV === "development" || 
     window.location.hostname === "localhost" || 
     window.location.hostname === "127.0.0.1" ||
     window.location.hostname.startsWith("192.168.") ||
     window.location.hostname.startsWith("10."));
  const devBypass = isLocalhost || 
    (typeof window !== "undefined" && sessionStorage.getItem("dev_admin_bypass") === "true");
  const isAdmin = session && (session?.user as any)?.role === "admin";

  if (status !== "authenticated" && status !== "unauthenticated" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAdmin && !devBypass) {
    return null;
  }

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">
              {session?.user?.name?.toLowerCase().includes("ali") ? "Ali's Desk" : "Inbox"}
            </h1>
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-champagne-gold text-champagne-gold">
                {session?.user?.name?.toLowerCase().includes("ali") ? "Ali's Desk" : "Dashboard"}
              </Button>
            </Link>
          </div>
          
          {/* Search and Filters */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  // Debouncing is handled by useEffect
                }}
                placeholder="Search bookings..."
                className="bg-gray-800 text-white border-gray-700 pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setFilter("all")}
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
              >
                All
              </Button>
              <Button
                onClick={() => setFilter("pending")}
                variant={filter === "pending" ? "default" : "outline"}
                size="sm"
              >
                Pending
              </Button>
              <Button
                onClick={() => setFilter("confirmed")}
                variant={filter === "confirmed" ? "default" : "outline"}
                size="sm"
              >
                Confirmed
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Inbox List */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        {bookings.length === 0 ? (
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardContent className="p-12 text-center">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">No bookings found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-1">
            {bookings.map((booking) => {
              const initials = getInitials(booking.name);
              const initialsColor = getInitialsColor(booking.name);
              const flagColor = getFlagColor(booking.flaggedFor);
              const flagIconColor = getFlagIconColor(booking.flaggedFor);
              
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div
                    className={`flex flex-col gap-2 p-4 rounded-lg transition-all border-l-4 ${
                      booking.conflictStatus === "pending"
                        ? "border-red-500 bg-red-950/20"
                        : booking.assignedTo
                        ? getHandoffColor(booking.assignedTo, booking.handoffStatus)
                        : booking.flaggedFor === "user1"
                        ? `${getFlagColor(booking.flaggedFor)} ${getBorderColor(booking.flaggedFor)}`
                        : booking.flaggedFor === "user2"
                        ? `${getFlagColor(booking.flaggedFor)} ${getBorderColor(booking.flaggedFor)}`
                        : "border-transparent bg-gray-800 hover:bg-gray-750"
                    }`}
                  >
                    <Link href={`/admin/bookings/${booking.id}`}>
                      <div className="flex items-center gap-4 cursor-pointer">
                      {/* Left: Initials Circle */}
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full ${initialsColor} flex items-center justify-center text-white font-bold text-lg`}>
                          {initials}
                        </div>
                      </div>

                        {/* Center: Client Name, Date, Venue */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-bold text-white text-lg truncate">
                              {booking.name}
                            </h3>
                            {getHandoffBadge(booking.assignedTo, booking.handoffStatus) && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-700 text-white border border-gray-600">
                                {getHandoffBadge(booking.assignedTo, booking.handoffStatus)}
                              </span>
                            )}
                            <span className="text-champagne-gold font-medium text-sm whitespace-nowrap">
                              {formatEventDate(booking.eventDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-gray-200 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{booking.venueName}</span>
                            {booking.venuePostcode && (
                              <span className="text-gray-300 font-semibold">({booking.venuePostcode})</span>
                            )}
                          </div>
                        </div>

                        {/* Right: Priority Flag */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleToggleFlag(booking.id, booking.flaggedFor);
                            }}
                            className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${flagIconColor}`}
                            title={
                              booking.flaggedFor === "user1"
                                ? `Flagged for ${user1Name}`
                                : booking.flaggedFor === "user2"
                                ? `Flagged for ${user2Name}`
                                : `Flag for ${user1Name}`
                            }
                          >
                            <Flag
                              className={`w-5 h-5 ${
                                booking.flaggedFor ? "fill-current" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </Link>

                    {/* Assignment Buttons */}
                    <div className="flex gap-2 mt-2 pt-2 border-t border-gray-700">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAssign(booking.id, "ali");
                        }}
                        size="sm"
                        className={`flex-1 ${
                          booking.assignedTo === "ali" || booking.assignedTo === "wife"
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-900/30 hover:bg-blue-900/50 text-black border border-blue-500/50 font-medium"
                        }`}
                      >
                        🙋‍♀️ For {wifeName}
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAssign(booking.id, "you");
                        }}
                        size="sm"
                        className={`flex-1 ${
                          booking.assignedTo === "you"
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-purple-900/30 hover:bg-purple-900/50 text-black border border-purple-500/50 font-medium"
                        }`}
                      >
                        🛠️ For {yourName}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminBookings() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <AdminBookingsContent />
    </Suspense>
  );
}
