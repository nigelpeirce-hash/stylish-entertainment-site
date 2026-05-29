"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "@/lib/motion";
import {
  Calendar,
  Search,
  Flag,
  Mail,
  User,
  MapPin,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deduplicateName, getDisplayName } from "@/lib/utils/name-helpers";
import { toSafeReactChild } from "@/lib/transformers/booking-transformer";
import { getWorkflowStage, getWorkflowLabel, getTrafficLightStyles } from "@/lib/workflow-stage";

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
  archivedAt: string | null;
  user: { id: string; name: string; email: string } | null;
  depositReceived?: boolean | null;
  depositReceivedManual?: boolean | null;
  NewEnquiry?: { id: string }[];
  /** ISO date of latest Options & Quote email sent; pulse stops when set */
  artistQuoteSentAt?: string | null;
  staffAssignments?: Array<{
    id: string;
    role: string;
    status: string;
    staff: {
      id: string;
      name: string;
      email: string | null;
    };
  }>;
}

interface PendingEnquiry {
  id: string;
  name: string;
  email: string;
  phoneAreaCode: string | null;
  phoneNumber: string | null;
  eventDate: string;
  venueName: string | null;
  venuePostcode: string;
  enquiryType: string | null;
  status: string;
  createdAt: string;
  isConflict: boolean;
}

function getEnquiryTypeLabel(type: string | null): string {
  switch (type) {
    case "quote_request":
      return "Quote Request";
    case "contact":
      return "Contact Form";
    case "hire_only":
      return "Hire Quote";
    default:
      return "New Enquiry";
  }
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
  const [pendingEnquiries, setPendingEnquiries] = useState<PendingEnquiry[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  // Priority flag names - can be customized
  const [user1Name, setUser1Name] = useState("Nigel");
  const [user2Name, setUser2Name] = useState("Ali");
  // Handoff names
  const [wifeName, setWifeName] = useState("Ali");
  const [yourName, setYourName] = useState("Nigel");
  // Clean slate: select and bulk delete
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Use refs to track previous values and prevent unnecessary fetches
  const prevFilterRef = useRef<string>("all");
  const prevSearchRef = useRef<string>("");
  const prevShowArchivedRef = useRef<boolean>(false);
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
      return;
    }
    
    // Aggressive throttle: prevent concurrent fetches and rapid successive fetches (2 seconds minimum)
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    
    if (isFetchingRef.current) {
      return;
    }
    
    if (timeSinceLastFetch < 2000) {
      return;
    }
    
    isFetchingRef.current = true;
    lastFetchTimeRef.current = now;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const currentFilter = prevFilterRef.current;
      const currentSearch = prevSearchRef.current;
      const currentShowArchived = prevShowArchivedRef.current;
      
      if (currentFilter !== "all") params.append("status", currentFilter);
      if (currentSearch) params.append("search", currentSearch);
      if (currentShowArchived) params.append("archivedOnly", "true");

      const response = await fetch(`/api/admin/bookings/?${params.toString()}`, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }

      if (!currentShowArchived) {
        const enquiryRes = await fetch("/api/admin/new-enquiries/?t=" + Date.now(), {
          credentials: "include",
        });
        if (enquiryRes.ok) {
          const enquiryData = await enquiryRes.json();
          const raw = (enquiryData.enquiries || []) as PendingEnquiry[];
          setPendingEnquiries(raw.filter((e) => e.status === "new"));
        }
      } else {
        setPendingEnquiries([]);
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

  // Separate effect for filter/search/archive changes (debounced)
  useEffect(() => {
    // Don't run until initialized
    if (!hasInitializedRef.current) return;

    // Only fetch if filter, search, or showArchived has actually changed
    const filterChanged = prevFilterRef.current !== filter;
    const searchChanged = prevSearchRef.current !== search;
    const archivedChanged = prevShowArchivedRef.current !== showArchived;
    
    if (!filterChanged && !searchChanged && !archivedChanged) return;

    // Clear selection when view changes
    setSelectedIds(new Set());

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
      prevShowArchivedRef.current = showArchived;
      fetchBookingsRef.current?.();
    }, 500); // Increased debounce time

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search, showArchived]); // Depend on filter, search, and showArchived

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
        credentials: "include",
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

  const handleRestore = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/restore`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Refresh the list
        await fetchBookingsRef.current?.();
      } else {
        console.error("Failed to restore booking");
      }
    } catch (error) {
      console.error("Error restoring booking:", error);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === bookings.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(bookings.map((b) => b.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    const msg = `Permanently delete ${selectedIds.size} selected booking${selectedIds.size > 1 ? "s" : ""}? This removes email threads and all related data.`;
    if (typeof window !== "undefined" && !window.confirm(msg)) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/bookings/bulk-delete", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setSelectedIds(new Set());
      await fetchBookingsRef.current?.();
    } catch (e) {
      console.error("Bulk delete error:", e);
      alert((e as Error).message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    setShowDeleteAllModal(false);
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/bookings/bulk-delete", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteAll: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setSelectedIds(new Set());
      await fetchBookingsRef.current?.();
    } catch (e) {
      console.error("Delete all error:", e);
      alert((e as Error).message || "Delete failed");
    } finally {
      setDeleting(false);
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

  const searchLower = search.trim().toLowerCase();
  const filteredPendingEnquiries = pendingEnquiries.filter((enquiry) => {
    if (!searchLower) return true;
    const phone =
      enquiry.phoneAreaCode && enquiry.phoneNumber
        ? `${enquiry.phoneAreaCode}${enquiry.phoneNumber}`
        : "";
    return [enquiry.name, enquiry.email, enquiry.venueName, enquiry.venuePostcode, phone]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(searchLower));
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
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
                onClick={() => { setFilter("all"); setShowArchived(false); }}
                variant={filter === "all" && !showArchived ? "default" : "outline"}
                size="sm"
              >
                All
              </Button>
              <Button
                onClick={() => { setFilter("pending"); setShowArchived(false); }}
                variant={filter === "pending" && !showArchived ? "default" : "outline"}
                size="sm"
              >
                Pending
              </Button>
              <Button
                onClick={() => { setFilter("confirmed"); setShowArchived(false); }}
                variant={filter === "confirmed" && !showArchived ? "default" : "outline"}
                size="sm"
              >
                Confirmed
              </Button>
              <Button
                onClick={() => { setFilter("all"); setShowArchived(true); }}
                variant={showArchived ? "default" : "outline"}
                size="sm"
                className={showArchived ? "bg-gray-600 hover:bg-gray-700" : ""}
              >
                Archived
              </Button>
            </div>
          </div>

          {/* Clean slate: select all, delete selected, delete all */}
          {bookings.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-gray-700">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={bookings.length > 0 && selectedIds.size === bookings.length}
                  onChange={selectAll}
                  className="rounded border-gray-600 bg-gray-800 text-champagne-gold focus:ring-champagne-gold"
                />
                Select all
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={selectedIds.size === 0 || deleting}
                className="border-red-500/50 text-red-400 hover:bg-red-950/30 hover:border-red-500"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete selected ({selectedIds.size})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteAllModal(true)}
                disabled={deleting}
                className="border-red-600 text-red-400 hover:bg-red-950/40 hover:border-red-600"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete all
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Delete all confirmation modal */}
      <Dialog open={showDeleteAllModal} onOpenChange={setShowDeleteAllModal}>
        <DialogContent className="bg-gray-900 border-red-500/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete all bookings?</DialogTitle>
            <DialogDescription className="text-gray-300">
              This will permanently delete every booking, their email threads, and all related data. Your admin login (nigel@stylishentertainment.co.uk) is not affected. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteAllModal(false)} className="border-gray-600">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAll}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? "Deleting…" : "Delete all"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inbox – tile grid */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {!showArchived && filteredPendingEnquiries.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-champagne-gold" />
                  New enquiries
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-champagne-gold text-black">
                    {filteredPendingEnquiries.length}
                  </span>
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  From Enquire / contact forms — review and convert to a booking when ready.
                </p>
              </div>
              <Link href="/admin/new-enquiries/">
                <Button variant="outline" size="sm" className="border-champagne-gold/50 text-champagne-gold">
                  View all
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPendingEnquiries.map((enquiry) => {
                const initials = getInitials(enquiry.name);
                const initialsColor = getInitialsColor(enquiry.name);
                return (
                  <motion.div
                    key={enquiry.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full"
                  >
                    <Link href={`/admin/new-enquiries/${enquiry.id}/`} className="block h-full group">
                      <div className="h-full flex flex-col rounded-xl border border-champagne-gold/40 overflow-hidden transition-all hover:shadow-xl hover:border-champagne-gold/70 shadow-lg border-t-4 border-t-champagne-gold animate-pulse bg-gray-800/80">
                        <div className="flex-1 flex flex-col p-4 min-w-0">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex-shrink-0 w-11 h-11 rounded-xl ${initialsColor} flex items-center justify-center text-white font-bold text-sm`}
                            >
                              {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white text-base truncate group-hover:text-champagne-gold transition-colors">
                                {deduplicateName(getDisplayName(enquiry.name) || enquiry.name)}
                              </h3>
                              <p className="text-champagne-gold font-medium text-sm mt-0.5">
                                {formatEventDate(enquiry.eventDate)}
                              </p>
                              <p className="text-xs text-amber-500/80 uppercase tracking-wide mt-1 truncate">
                                {enquiry.venueName || enquiry.venuePostcode || "Venue TBC"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-champagne-gold/20 text-champagne-gold border border-champagne-gold/40">
                              {getEnquiryTypeLabel(enquiry.enquiryType)}
                            </span>
                            {enquiry.isConflict && (
                              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-red-900/50 text-red-300 border border-red-500/50">
                                Conflict
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-3 pt-2 border-t border-champagne-gold/20 text-center">
                          <span className="text-xs font-medium text-champagne-gold">Review &amp; convert →</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {bookings.length === 0 && filteredPendingEnquiries.length === 0 ? (
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardContent className="p-12 text-center">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">No bookings found</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {bookings.length > 0 && filteredPendingEnquiries.length > 0 && (
              <h2 className="text-lg font-semibold text-gray-300 mb-4">Bookings</h2>
            )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bookings.map((booking) => {
              const initials = getInitials(booking.name);
              const initialsColor = getInitialsColor(booking.name);
              const flagIconColor = getFlagIconColor(booking.flaggedFor);
              const workflowStage = getWorkflowStage(booking);
              const trafficLightStyles = getTrafficLightStyles(workflowStage);
              const workflowLabel = getWorkflowLabel(workflowStage);
              const borderAccent =
                workflowStage === "deposit_received"
                  ? "border-t-4 border-t-emerald-500"
                  : workflowStage === "new_enquiry"
                    ? "border-t-4 border-t-red-500"
                    : "border-t-4 border-t-amber-500";
              const isNewEnquiryNoQuote =
                workflowStage !== "deposit_received" && !booking.artistQuoteSentAt;

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full"
                >
                  <div
                    className={`h-full flex flex-col rounded-xl border border-gray-700 overflow-hidden transition-all hover:shadow-xl hover:border-gray-600 shadow-lg ${borderAccent} ${trafficLightStyles} ${isNewEnquiryNoQuote ? "animate-pulse" : ""}`}
                  >
                    {/* Tile header: checkbox + flag */}
                    <div className="flex items-start justify-between p-3 pb-0">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(booking.id)}
                        onChange={() => toggleSelect(booking.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 rounded border-gray-600 bg-gray-800 text-champagne-gold focus:ring-champagne-gold"
                        aria-label={`Select ${booking.name}`}
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleFlag(booking.id, booking.flaggedFor);
                        }}
                        className={`p-1.5 rounded-lg hover:bg-gray-700 transition-colors ${flagIconColor}`}
                        title={
                          booking.flaggedFor === "user1"
                            ? `Flagged for ${user1Name}`
                            : booking.flaggedFor === "user2"
                              ? `Flagged for ${user2Name}`
                              : `Flag for ${user1Name}`
                        }
                      >
                        <Flag
                          className={`w-4 h-4 ${booking.flaggedFor ? "fill-current" : ""}`}
                        />
                      </button>
                    </div>

                    {/* Main content – clickable to open booking */}
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="flex-1 flex flex-col p-4 pt-2 min-w-0 group"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-11 h-11 rounded-xl ${initialsColor} flex items-center justify-center text-white font-bold text-sm`}
                        >
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-base truncate group-hover:text-champagne-gold transition-colors">
                            {deduplicateName(getDisplayName(booking.name) || booking.name)}
                          </h3>
                          <p className="text-champagne-gold font-medium text-sm mt-0.5">
                            {formatEventDate(booking.eventDate)}
                          </p>
                          <p className="text-xs text-amber-500/80 uppercase tracking-wide mt-1">
                            {booking.venueName || "Venue TBD"}
                          </p>
                          {booking.venuePostcode && (
                            <p className="text-xs text-gray-400 mt-0.5">{booking.venuePostcode}</p>
                          )}
                        </div>
                      </div>

                      {/* Badges row */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span
                          className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-700/80 text-gray-200 border border-gray-600"
                          title="Workflow stage"
                        >
                          {workflowLabel}
                        </span>
                        {getHandoffBadge(booking.assignedTo, booking.handoffStatus) && (
                          <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-700 text-white border border-gray-600">
                            {getHandoffBadge(booking.assignedTo, booking.handoffStatus)}
                          </span>
                        )}
                        {booking.conflictStatus === "pending" && (
                          <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-red-900/50 text-red-300 border border-red-500/50">
                            Conflict
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Staff assigned (if any) */}
                    {booking.staffAssignments && booking.staffAssignments.length > 0 && (
                      <div className="px-4 pb-2">
                        <div className="flex flex-wrap gap-2">
                          {booking.staffAssignments.map((assignment: any) => (
                            <span
                              key={assignment.id}
                              className="text-xs font-semibold text-champagne-gold flex items-center gap-1"
                            >
                              <span>{assignment.role?.toLowerCase().includes("dj") ? "🎧" : "💡"}</span>
                              {toSafeReactChild(assignment.staff?.name)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assignment buttons */}
                    {showArchived ? (
                      <div className="p-3 pt-2 border-t border-gray-700 flex flex-col gap-2">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRestore(booking.id);
                          }}
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          ↩️ Restore
                        </Button>
                        <span className="text-xs text-gray-500 text-center">
                          Archived {booking.archivedAt ? new Date(booking.archivedAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 pt-2 border-t border-gray-700 grid grid-cols-2 gap-2">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAssign(booking.id, "ali");
                          }}
                          size="sm"
                          className={`text-xs ${
                            booking.assignedTo === "ali" || booking.assignedTo === "wife"
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600"
                          }`}
                        >
                          🙋‍♀️ {wifeName}
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAssign(booking.id, "you");
                          }}
                          size="sm"
                          className={`text-xs ${
                            booking.assignedTo === "you"
                              ? "bg-purple-600 hover:bg-purple-700 text-white"
                              : "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600"
                          }`}
                        >
                          🛠️ {yourName}
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          </>
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
