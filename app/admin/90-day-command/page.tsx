"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, memo, useCallback, useRef } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Calendar, Clock, AlertTriangle, RefreshCw, ArrowLeft, MessageSquare, UserCheck, Activity } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SafetyDeleteButton } from "@/components/SafetyDeleteButton";
import { CommandMenu } from "@/components/admin/command-menu";

interface StaffAssignment {
  id: string;
  role: string;
  status: string;
  briefStatus: string | null;
  acknowledgedAt: string | null;
  staff: {
    id: string;
    name: string;
    email: string | null;
  };
}

interface Booking {
  id: string;
  name: string;
  venueName: string;
  eventDate: string;
  eventType: string;
  status: string;
  priority?: string;
  daysRemaining: number;
  depositReceived: boolean;
  depositReceivedManual: boolean;
  djWorksheetApproved: boolean;
  djWorksheetApprovedManual: boolean;
  finalDetailsConfirmed: boolean;
  finalDetailsConfirmedManual: boolean;
  services?: string[]; // To check if DJ service is selected
  staffAssignments?: StaffAssignment[]; // Staff assignments with brief status
  unreadPortalMessages?: boolean; // Whether there are unread portal messages
  staffPendingAction?: boolean; // True if staff has responded to hold but isn't yet confirmed
}

interface SystemHealth {
  loadTime: number;
  status: "fast" | "slow";
  lastUpdated: number;
}

// SWR fetcher function
const fetcher = async (url: string): Promise<{ bookings: Booking[] }> => {
  const startTime = performance.now();
  const response = await fetch(url);
  const endTime = performance.now();
  const loadTime = Math.round(endTime - startTime);
  
  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }
  
  const data = await response.json();
  
  // Store performance metrics
  if (typeof window !== "undefined") {
    const health: SystemHealth = {
      loadTime,
      status: loadTime < 200 ? "fast" : "slow",
      lastUpdated: Date.now(),
    };
    sessionStorage.setItem("90day-command-health", JSON.stringify(health));
  }
  
  return data;
};

// Memoized Booking Card Component
const BookingCard = memo(function BookingCard({
  booking,
  index,
  updating,
  onToggleUpdate,
  formatDaysRemaining,
  calculateProgress,
  shouldHighlightAlert,
  getAttentionReasons,
}: {
  booking: Booking;
  index: number;
  updating: string | null;
  onToggleUpdate: (bookingId: string, field: "depositReceived" | "djWorksheetApproved" | "finalDetailsConfirmed", currentValue: boolean) => void;
  formatDaysRemaining: (days: number) => string;
  calculateProgress: (daysRemaining: number) => number;
  shouldHighlightAlert: (booking: Booking) => boolean;
  getAttentionReasons: (booking: Booking) => string[];
}) {
  const progress = calculateProgress(booking.daysRemaining);
  const isAlert = shouldHighlightAlert(booking);

  return (
    <motion.div
      key={booking.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={`bg-gray-900 border transition-all ${
          booking.priority === "urgent" || (booking.daysRemaining <= 30 && !booking.finalDetailsConfirmed)
            ? "border-red-500/50 shadow-lg shadow-red-500/20"
            : booking.unreadPortalMessages
            ? "border-champagne-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
            : booking.staffPendingAction
            ? "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            : "border-gray-700 hover:border-champagne-gold/50"
        }`}
      >
        <CardContent className="p-6">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-champagne-gold" />
                  <span className="font-bold text-champagne-gold text-lg">
                    {formatDaysRemaining(booking.daysRemaining)}
                  </span>
                </div>
                {booking.priority === "urgent" && (
                  <span className="px-3 py-1 bg-red-900/40 border border-red-500/50 rounded-full text-xs font-bold text-red-400 animate-pulse flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    URGENT
                  </span>
                )}
                {booking.unreadPortalMessages && (
                  <span className="px-3 py-1 bg-champagne-gold/20 border border-champagne-gold/50 rounded-full text-xs font-bold text-champagne-gold animate-pulse flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    NEW MESSAGE
                  </span>
                )}
                {booking.staffPendingAction && (
                  <span className="px-3 py-1 bg-blue-900/40 border border-blue-500/50 rounded-full text-xs font-bold text-blue-400 animate-pulse flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    STAFF ACTION
                  </span>
                )}
                {isAlert && (
                  <div className="flex flex-col gap-1">
                    {getAttentionReasons(booking).map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-red-400 text-sm">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">
                {booking.name} @ {booking.venueName}
              </h3>
              <p className="text-sm text-gray-400">
                {new Date(booking.eventDate).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {/* Staff Brief Acknowledgments */}
              {booking.staffAssignments && booking.staffAssignments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {booking.staffAssignments
                    .filter((assignment) => assignment.status === "dispatched" || assignment.status === "confirmed")
                    .map((assignment) => (
                      <div
                        key={assignment.id}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          assignment.briefStatus === "acknowledged"
                            ? "bg-green-500/20 border border-green-500/50 text-green-400"
                            : "bg-yellow-500/20 border border-yellow-500/50 text-yellow-400"
                        }`}
                      >
                        {assignment.briefStatus === "acknowledged" ? (
                          <>
                            <span>✅</span>
                            <span>{assignment.staff.name} - Brief Acknowledged</span>
                          </>
                        ) : (
                          <>
                            <span>⏳</span>
                            <span>{assignment.staff.name} - Awaiting Brief Acknowledgment</span>
                          </>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div className="flex-shrink-0">
              <Link href={booking.unreadPortalMessages ? `/admin/bookings/${booking.id}#communications` : `/admin/bookings/${booking.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-champagne-gold to-yellow-600"
              />
            </div>
          </div>

          {/* Status Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
            {/* Deposit Received - Blue */}
            <label 
              className={`flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg transition-colors ${
                updating === booking.id ? "opacity-50 cursor-wait" : "cursor-pointer hover:bg-gray-800"
              }`}
              onClick={(e) => {
                if (updating === booking.id) {
                  e.preventDefault();
                  return;
                }
              }}
            >
              <Checkbox
                checked={booking.depositReceived || false}
                onCheckedChange={(checked) => {
                  if (updating !== booking.id) {
                    onToggleUpdate(
                      booking.id,
                      "depositReceived",
                      booking.depositReceived || false
                    );
                  }
                }}
                disabled={updating === booking.id}
                className="border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 disabled:opacity-50"
              />
              <div className="flex-1">
                <span className="text-sm text-gray-300 font-medium">
                  Deposit Received
                </span>
                {booking.depositReceivedManual && (
                  <p className="text-xs text-orange-400 mt-0.5">Manual override</p>
                )}
                {updating === booking.id && (
                  <p className="text-xs text-blue-400 mt-0.5">Updating...</p>
                )}
              </div>
            </label>

            {/* DJ Worksheet Approved - Purple (only show if DJ service) */}
            {(booking.services?.includes("DJs") || !booking.services || booking.services.length === 0) && (
              <label 
                className={`flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg transition-colors ${
                  updating === booking.id ? "opacity-50 cursor-wait" : "cursor-pointer hover:bg-gray-800"
                }`}
                onClick={(e) => {
                  if (updating === booking.id) {
                    e.preventDefault();
                    return;
                  }
                }}
              >
                <Checkbox
                  checked={booking.djWorksheetApproved || false}
                  onCheckedChange={(checked) => {
                    if (updating !== booking.id) {
                      onToggleUpdate(
                        booking.id,
                        "djWorksheetApproved",
                        booking.djWorksheetApproved || false
                      );
                    }
                  }}
                  disabled={updating === booking.id}
                  className="border-purple-400 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 disabled:opacity-50"
                />
                <div className="flex-1">
                  <span className="text-sm text-gray-300 font-medium">
                    DJ Worksheet Approved
                  </span>
                  {booking.djWorksheetApprovedManual && (
                    <p className="text-xs text-orange-400 mt-0.5">Manual override</p>
                  )}
                  {updating === booking.id && (
                    <p className="text-xs text-purple-400 mt-0.5">Updating...</p>
                  )}
                </div>
              </label>
            )}

            {/* Final Details Confirmed - Green */}
            <label 
              className={`flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg transition-colors ${
                updating === booking.id ? "opacity-50 cursor-wait" : "cursor-pointer hover:bg-gray-800"
              }`}
              onClick={(e) => {
                if (updating === booking.id) {
                  e.preventDefault();
                  return;
                }
              }}
            >
              <Checkbox
                checked={booking.finalDetailsConfirmed || false}
                onCheckedChange={(checked) => {
                  if (updating !== booking.id) {
                    onToggleUpdate(
                      booking.id,
                      "finalDetailsConfirmed",
                      booking.finalDetailsConfirmed || false
                    );
                  }
                }}
                disabled={updating === booking.id}
                className="border-green-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 disabled:opacity-50"
              />
              <div className="flex-1">
                <span className="text-sm text-gray-300 font-medium">
                  Final Details Confirmed
                </span>
                {booking.finalDetailsConfirmedManual && (
                  <p className="text-xs text-orange-400 mt-0.5">Manual override</p>
                )}
                {updating === booking.id && (
                  <p className="text-xs text-green-400 mt-0.5">Updating...</p>
                )}
              </div>
            </label>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default function NinetyDayCommandCentre() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "within30" | "needsAttention">("all");
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  // Use SWR for data fetching with caching and background refresh
  // Only enable SWR if user is authorized (prevents unnecessary fetches)
  const isAuthorizedForSWR = status === "authenticated" && (session?.user as any)?.role === "admin";
  const isLocalhostForSWR = typeof window !== "undefined" && 
    (process.env.NODE_ENV === "development" || 
     window.location.hostname === "localhost" || 
     window.location.hostname === "127.0.0.1" ||
     window.location.hostname.startsWith("192.168.") ||
     window.location.hostname.startsWith("10."));
  const devBypassForSWR = isLocalhostForSWR || 
    (typeof window !== "undefined" && sessionStorage.getItem("dev_admin_bypass") === "true");
  
  const shouldFetch = isAuthorizedForSWR || devBypassForSWR;

  const { data, error, isLoading, mutate } = useSWR<{ bookings: Booking[] }>(
    shouldFetch ? "/api/admin/bookings/90-day-command" : null, // null key prevents fetch
    fetcher,
    {
      revalidateOnFocus: false, // Disable to prevent loops on focus
      revalidateOnReconnect: true, // Refresh when network reconnects
      refreshInterval: shouldFetch ? 60000 : 0, // Refresh every 60 seconds (increased from 30), or 0 if not authorized
      dedupingInterval: 10000, // Dedupe requests within 10 seconds (increased from 5)
      keepPreviousData: true, // Keep previous data while fetching new data
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Don't retry on 401/403 errors
        if (error.status === 401 || error.status === 403) return;
        // Retry up to 3 times
        if (retryCount >= 3) return;
        // Retry after 5 seconds
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );

  const bookings = data?.bookings || [];

  // Load and update system health from sessionStorage (fetched by SWR fetcher)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("90day-command-health");
      if (stored) {
        try {
          setSystemHealth(JSON.parse(stored));
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, [data]); // Update when data changes (SWR fetcher updates sessionStorage)

  // Track redirect to prevent multiple redirects
  const redirectAttemptedRef = useRef(false);

  useEffect(() => {
    // Wait for session to load - don't redirect while loading
    if (status === "loading") {
      return;
    }

    // Prevent multiple redirect attempts
    if (redirectAttemptedRef.current) {
      return;
    }

    // Auto-enable dev bypass on localhost (development only)
    const isLocalhost = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" || 
       window.location.hostname === "127.0.0.1" ||
       window.location.hostname.startsWith("192.168.") ||
       window.location.hostname.startsWith("10."));

    if (isLocalhost) {
      // Automatically set bypass flag for localhost
      sessionStorage.setItem("dev_admin_bypass", "true");
      sessionStorage.setItem("dev_admin_role", "admin");
      sessionStorage.setItem("dev_admin_name", "Local Admin");
      return;
    }

    // Check for existing dev bypass (for production dev environments)
    const devBypass = typeof window !== "undefined" && 
      sessionStorage.getItem("dev_admin_bypass") === "true";

    if (devBypass) {
      return;
    }

    // Not authenticated and no dev bypass - redirect (only once)
    redirectAttemptedRef.current = true;
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (
      status === "authenticated" &&
      (session?.user as any)?.role !== "admin"
    ) {
      router.push("/client/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, (session?.user as any)?.role, router]); // Only depend on specific values

  const handleToggleUpdate = useCallback(async (
    bookingId: string,
    field: "depositReceived" | "djWorksheetApproved" | "finalDetailsConfirmed",
    currentValue: boolean
  ) => {
    // Optimistically update UI immediately using mutate
    const newValue = !currentValue;
    
    mutate(
      (current) => {
        if (!current) return current;
        return {
          ...current,
          bookings: current.bookings.map((booking) =>
            booking.id === bookingId
              ? {
                  ...booking,
                  [field]: newValue,
                  [`${field}Manual`]: true,
                }
              : booking
          ),
        };
      },
      false // Don't revalidate immediately
    );

    setUpdating(bookingId);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/manual-override`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          ...(typeof window !== "undefined" && sessionStorage.getItem("dev_admin_bypass") === "true"
            ? { "x-dev-bypass": "true" }
            : {}),
        },
        body: JSON.stringify({
          field,
          value: newValue,
          performedBy: (session?.user as any)?.name || "Admin",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error updating toggle - Response not OK:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        // Revert optimistic update on error
        mutate(
          (current) => {
            if (!current) return current;
            return {
              ...current,
              bookings: current.bookings.map((booking) =>
                booking.id === bookingId
                  ? {
                      ...booking,
                      [field]: currentValue,
                      [`${field}Manual`]: false,
                    }
                  : booking
              ),
            };
          },
          false
        );
        const errorMessage = errorData?.error || errorData?.details || `Failed to update ${field}. Please try again.`;
        alert(errorMessage);
        return;
      }

      // Revalidate to get latest data from server
      await mutate();
    } catch (error: any) {
      console.error("Error updating toggle - Exception:", {
        message: error?.message,
        stack: error?.stack,
        error: error,
        name: error?.name,
      });
      // Revert optimistic update on error
      mutate(
        (current) => {
          if (!current) return current;
          return {
            ...current,
            bookings: current.bookings.map((booking) =>
              booking.id === bookingId
                ? {
                    ...booking,
                    [field]: currentValue,
                    [`${field}Manual`]: false,
                  }
                : booking
            ),
          };
        },
        false
      );
      const errorMessage = error?.message || `Failed to update ${field}. Please check your connection and try again.`;
      alert(errorMessage);
    } finally {
      setUpdating(null);
    }
  }, [mutate, session]);

  const formatDaysRemaining = useCallback((days: number): string => {
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 0) return `${Math.abs(days)} Days Ago`;
    return `${days} Days to Go`;
  }, []);

  const calculateProgress = useCallback((daysRemaining: number): number => {
    // Progress from 0% (90 days away) to 100% (event day)
    const progress = Math.max(0, Math.min(100, ((90 - daysRemaining) / 90) * 100));
    return progress;
  }, []);

  const shouldHighlightAlert = useCallback((booking: Booking): boolean => {
    // Highlight if urgent priority OR if within 30 days without final details confirmed OR if there are unread portal messages OR if staff action is pending
    return booking.priority === "urgent" || 
           (booking.daysRemaining <= 30 && !booking.finalDetailsConfirmed) ||
           (booking.unreadPortalMessages === true) ||
           (booking.staffPendingAction === true);
  }, []);

  // Get attention reasons for a booking
  const getAttentionReasons = useCallback((booking: Booking): string[] => {
    const reasons: string[] = [];
    if (booking.priority === "urgent") {
      reasons.push("Event within 2 weeks of enquiry");
    }
    if (booking.daysRemaining <= 30 && !booking.finalDetailsConfirmed) {
      reasons.push("Final details not confirmed");
    }
    if (booking.daysRemaining <= 14 && booking.services?.includes("DJs") && !booking.djWorksheetApproved) {
      reasons.push("DJ Worksheet not approved");
    }
    if (booking.daysRemaining <= 30 && !booking.depositReceived) {
      reasons.push("Deposit not received");
    }
    if (booking.unreadPortalMessages) {
      reasons.push("Unread portal message");
    }
    if (booking.staffPendingAction) {
      reasons.push("Staff availability confirmed - Action required");
    }
    return reasons;
  }, []);

  // Check if event is today
  const isEventToday = useCallback((eventDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const event = new Date(eventDate);
    event.setHours(0, 0, 0, 0);
    return today.getTime() === event.getTime();
  }, []);

  // Check if event is tomorrow
  const isEventTomorrow = useCallback((daysRemaining: number): boolean => {
    return daysRemaining === 1;
  }, []);

  // Handle booking deletion
  const handleDeleteBooking = useCallback(async (bookingId: string, bookingName: string) => {
    if (!confirm(`Are you sure you want to delete the booking for ${bookingName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

      // Refresh the bookings list
      await mutate();
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking. Please try again.");
    }
  }, [mutate]);

  // Services that require staff assignments
  const SERVICES_REQUIRING_STAFF = ['Lighting', 'Styling', 'Production', 'Event Production', 'Lighting Design', 'Venue Styling'];

  // Helper function to check if a booking needs staff
  const needsStaffing = useCallback((booking: Booking): boolean => {
    if (!booking.services || booking.services.length === 0) {
      return false; // No services = no staff needed
    }
    // Check if any service requires staff
    return booking.services.some(service => 
      SERVICES_REQUIRING_STAFF.some(requiredService => 
        service.toLowerCase().includes(requiredService.toLowerCase())
      )
    );
  }, []);

  // Get status badge color
  const getStatusBadgeClass = useCallback((status: string): string => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-100 text-black";
      case "pending":
        return "bg-amber-100 text-black";
      case "cancelled":
        return "bg-gray-100 text-black";
      case "provisional":
        return "bg-blue-100 text-black";
      default:
        return "bg-gray-100 text-black";
    }
  }, []);

  // Filter bookings based on selected filter
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (filter === "within30") {
        return booking.daysRemaining <= 30;
      }
      if (filter === "needsAttention") {
        return shouldHighlightAlert(booking);
      }
      return true; // "all"
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings, filter, shouldHighlightAlert]);

  // Check for dev bypass (development only)
  const isLocalhost = typeof window !== "undefined" && 
    (process.env.NODE_ENV === "development" || 
     window.location.hostname === "localhost" || 
     window.location.hostname === "127.0.0.1" ||
     window.location.hostname.startsWith("192.168.") ||
     window.location.hostname.startsWith("10."));
  
  const devBypass = isLocalhost || 
    (typeof window !== "undefined" && sessionStorage.getItem("dev_admin_bypass") === "true");

  const isAdmin = session && (session?.user as any)?.role === "admin";

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAdmin && !devBypass) {
    return null;
  }

  // Keyboard shortcut handler for command menu (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandMenuOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <CommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />
      <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Dev Mode Banner */}
        {devBypass && (
          <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-600/50 rounded-lg">
            <p className="text-xs text-yellow-400">
              ⚠️ <strong>Development Mode:</strong> Authentication bypassed for localhost access
            </p>
          </div>
        )}
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
                <Calendar className="w-8 h-8 text-champagne-gold" />
                90-Day Command Centre
              </h1>
              <p className="text-gray-400">
                Upcoming events within the next 90 days
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex gap-2 border border-gray-700 rounded-lg p-1">
                <Button
                  onClick={() => setViewMode("table")}
                  variant="ghost"
                  size="sm"
                  className={`${viewMode === "table" ? "bg-champagne-gold/20 text-champagne-gold" : "text-gray-400"}`}
                >
                  Table
                </Button>
                <Button
                  onClick={() => setViewMode("cards")}
                  variant="ghost"
                  size="sm"
                  className={`${viewMode === "cards" ? "bg-champagne-gold/20 text-champagne-gold" : "text-gray-400"}`}
                >
                  Cards
                </Button>
              </div>
              <Button
                onClick={() => mutate()}
                variant="outline"
                className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card 
              className={`bg-gray-900 border-champagne-gold/30 cursor-pointer transition-all hover:border-champagne-gold/60 ${
                filter === "all" ? "border-champagne-gold/60 ring-2 ring-champagne-gold/30" : ""
              }`}
              onClick={() => setFilter("all")}
            >
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 mb-1">Total Events</p>
                <p className="text-2xl font-bold text-white">{bookings.length}</p>
              </CardContent>
            </Card>
            <Card 
              className={`bg-gray-900 border-yellow-400/30 cursor-pointer transition-all hover:border-yellow-400/60 ${
                filter === "within30" ? "border-yellow-400/60 ring-2 ring-yellow-400/30" : ""
              }`}
              onClick={() => setFilter("within30")}
            >
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 mb-1">Within 30 Days</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {bookings.filter((b) => b.daysRemaining <= 30).length}
                </p>
                {filter === "within30" && (
                  <p className="text-xs text-yellow-400/70 mt-1">Showing filtered view</p>
                )}
              </CardContent>
            </Card>
            <Card 
              className={`bg-gray-900 border-red-400/30 cursor-pointer transition-all hover:border-red-400/60 ${
                filter === "needsAttention" ? "border-red-400/60 ring-2 ring-red-400/30" : ""
              }`}
              onClick={() => setFilter("needsAttention")}
            >
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 mb-1">Needs Attention</p>
                <p className="text-2xl font-bold text-red-400">
                  {bookings.filter(shouldHighlightAlert).length}
                </p>
                {filter === "needsAttention" && (
                  <p className="text-xs text-red-400/70 mt-1">Final payment pending</p>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Filter Active Notice */}
        {filter !== "all" && (
          <div className="mb-4 p-3 bg-champagne-gold/10 border border-champagne-gold/30 rounded-lg">
            <p className="text-sm text-champagne-gold">
              <strong>Filter Active:</strong> Showing {filter === "within30" ? "events within 30 days" : "events needing attention"} ({filteredBookings.length} of {bookings.length})
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilter("all")}
                className="ml-2 text-champagne-gold hover:text-white underline"
              >
                Clear filter
              </Button>
            </p>
          </div>
        )}

        {/* Table or Card View */}
        {viewMode === "table" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {filteredBookings.length === 0 ? (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    No events scheduled within the next 90 days
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-900 border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-800 border-b border-gray-700">
                        <th className="text-left p-4 text-sm font-semibold text-gray-300">Event</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-300">Date</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-300">Days</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-300">Status</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-300">Staff</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking) => {
                        const isToday = isEventToday(booking.eventDate);
                        const isTomorrow = isEventTomorrow(booking.daysRemaining);
                        const isUnassigned = !booking.staffAssignments || booking.staffAssignments.length === 0;
                        const requiresStaff = needsStaffing(booking);
                        const shouldPulse = requiresStaff && isUnassigned && booking.daysRemaining <= 14;
                        
                        return (
                          <tr
                            key={booking.id}
                            className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors ${
                              isToday ? "bg-blue-50/10" : isTomorrow ? "bg-amber-50/50" : ""
                            }`}
                          >
                            <td className="p-4">
                              <div>
                                <div className="font-medium text-white">{booking.name}</div>
                                <div className="text-sm text-gray-400">{booking.venueName}</div>
                              </div>
                            </td>
                            <td className="p-4 text-gray-300">
                              {new Date(booking.eventDate).toLocaleDateString("en-GB", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td className="p-4">
                              <span className="text-champagne-gold font-semibold">
                                {formatDaysRemaining(booking.daysRemaining)}
                              </span>
                            </td>
                            <td className="p-4">
                              <Badge className={`${getStatusBadgeClass(booking.status)} rounded-full px-2 py-1 text-xs border`}>
                                {booking.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {requiresStaff ? (
                                  isUnassigned ? (
                                    <Badge 
                                      className={`bg-red-100 text-black border border-red-200 rounded-full px-2 py-1 text-xs ${
                                        shouldPulse ? "animate-pulse" : ""
                                      }`}
                                    >
                                      Unassigned
                                    </Badge>
                                  ) : (
                                    <div className="flex flex-col gap-1">
                                      {booking.staffAssignments?.map((assignment) => (
                                        <span key={assignment.id} className="text-sm text-gray-300">
                                          {assignment.staff.name}
                                        </span>
                                      ))}
                                    </div>
                                  )
                                ) : (
                                  <span className="text-sm text-gray-500 italic">No staff needed</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Link href={`/admin/bookings/${booking.id}`}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="border border-zinc-200 text-gray-300 hover:bg-gray-800"
                                  >
                                    View
                                  </Button>
                                </Link>
                                <div className="scale-75 origin-left">
                                  <SafetyDeleteButton
                                    onDelete={() => handleDeleteBooking(booking.id, booking.name)}
                                    itemName={booking.name}
                                    itemDetails={`${booking.venueName} - ${new Date(booking.eventDate).toLocaleDateString("en-GB")}`}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            {filteredBookings.length === 0 ? (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    No events scheduled within the next 90 days
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredBookings.map((booking, index) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  index={index}
                  updating={updating}
                  onToggleUpdate={handleToggleUpdate}
                  formatDaysRemaining={formatDaysRemaining}
                  calculateProgress={calculateProgress}
                  shouldHighlightAlert={shouldHighlightAlert}
                  getAttentionReasons={getAttentionReasons}
                />
              ))
            )}
          </motion.div>
        )}

        {/* System Health Indicator */}
        {systemHealth && (
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Activity className="w-3 h-3" />
              <span>System Health:</span>
              <span className={systemHealth.status === "fast" ? "text-green-400" : "text-amber-400"}>
                {systemHealth.loadTime}ms
              </span>
              <div className={`w-2 h-2 rounded-full ${systemHealth.status === "fast" ? "bg-green-400" : "bg-amber-400"}`} />
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
