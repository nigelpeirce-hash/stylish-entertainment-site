"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "@/lib/motion";
import {
  Mail,
  Inbox,
  Users,
  Calendar,
  Settings,
  RefreshCw,
  Clock,
  LogOut,
  Package,
  Music,
  AlertCircle,
  Database,
  FileText,
  Plus,
  Send,
  Loader2,
  Calculator,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeveloperSettings } from "@/components/admin/DeveloperSettings";
import AdminHelp from "@/components/AdminHelp";
import VenueAssetUploader from "@/components/VenueAssetUploader";
import { NewSubmissionNotifier } from "@/components/NewSubmissionNotifier";
import { BookingIntegrityWarning } from "@/components/BookingIntegrityWarning";
import { ConflictCountBadge } from "@/components/ConflictCountBadge";
import { isSuperAdmin } from "@/lib/admin-permissions";
import { AddBookingModal } from "@/components/admin/bookings/add-booking-modal";
import RecentActivityFeed from "@/components/admin/RecentActivityFeed";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    unreadEmails: 0,
    totalThreads: 0,
    pendingBookings: 0,
    pendingNewEnquiries: 0,
    todayEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [priorityStats, setPriorityStats] = useState({
    urgent: 0,
    medium: 0,
  });
  /** New Enquiries breakdown: urgent (event < 180 days OR created > 24h ago, no first touch) vs standard */
  const [enquiryUrgentCount, setEnquiryUrgentCount] = useState(0);
  /** Pending bookings with no first touch yet (for Send First Touch modal) */
  const [newEnquiryBookings, setNewEnquiryBookings] = useState<any[]>([]);
  const [unreadThreads, setUnreadThreads] = useState<any[]>([]);
  const [recentThreads, setRecentThreads] = useState<any[]>([]);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showFirstTouchModal, setShowFirstTouchModal] = useState(false);
  const [sendingFirstTouchId, setSendingFirstTouchId] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Track redirect to prevent multiple redirects
  const redirectAttemptedRef = useRef(false);
  // Use ref to track if we've already fetched to prevent loops
  const hasFetchedRef = useRef(false);
  // Use ref to prevent concurrent fetches
  const isFetchingRef = useRef(false);

  // Single dashboard-summary API: unread threads, recent threads, pending bookings, conflict count
  const fetchStats = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard-summary", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Dashboard summary error:", data.error || res.statusText);
        return;
      }
      const unread = data.unreadThreads || [];
      const recent = data.recentThreads || [];
      const bookings = data.pendingBookings || [];
      const urgent = bookings.filter((b: any) => b.priority === "urgent").length;
      const medium = bookings.filter((b: any) => b.priority === "medium").length;
      const newEnquiries = bookings.filter((b: any) => !b.lastEmailSentAt);
      const now = new Date();
      const twentyFourHoursMs = 24 * 60 * 60 * 1000;
      const urgentCount = newEnquiries.filter((b: any) => {
        const eventDate = b.eventDate ? new Date(b.eventDate) : null;
        const createdAt = b.createdAt ? new Date(b.createdAt) : null;
        const daysToEvent = eventDate ? (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) : 9999;
        const createdMoreThan24hAgo = createdAt ? (now.getTime() - createdAt.getTime()) > twentyFourHoursMs : false;
        const noFirstTouch = !b.lastEmailSentAt;
        return daysToEvent < 180 || (createdMoreThan24hAgo && noFirstTouch);
      }).length;

      setStats({
        unreadEmails: unread.length,
        totalThreads: unread.length,
        pendingBookings: newEnquiries.length,
        pendingNewEnquiries: data.pendingNewEnquiries ?? 0,
        todayEvents: 0,
      });
      setPriorityStats({ urgent, medium });
      setEnquiryUrgentCount(urgentCount);
      setNewEnquiryBookings(newEnquiries);
      setUnreadThreads(unread.slice(0, 5));
      setRecentThreads(recent.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Wait for session to load - don't redirect while loading
    if (status === "loading") {
      return;
    }

    // Prevent multiple redirect attempts
    if (redirectAttemptedRef.current) {
      return;
    }

    // Check for dev bypass (development only)
    const isDev = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" ||
       window.location.hostname === "127.0.0.1" ||
       window.location.hostname.startsWith("192.168."));
    
    const devBypass = isDev && (
      sessionStorage.getItem("dev_admin_bypass") === "true" ||
      // Auto-allow in dev mode if no session (for easier development)
      (!session && isDev)
    );

    // Allow access if authenticated as admin OR dev bypass is active
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      // Authenticated admin - allow access
      return;
    }

    if (devBypass) {
      // Dev bypass active - allow access
      return;
    }

    // Not authenticated and no dev bypass - redirect to login (only once)
    redirectAttemptedRef.current = true;
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]); // Only depend on specific values, not entire session

  useEffect(() => {
    // Wait for session to load - don't do anything while loading
    if (status === "loading") {
      return;
    }

    // Check for dev bypass
    const isDev = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" ||
       window.location.hostname === "127.0.0.1" ||
       window.location.hostname.startsWith("192.168."));
    
    const devBypass = isDev && (
      sessionStorage.getItem("dev_admin_bypass") === "true" ||
      (!session && isDev) // Auto-allow in dev mode
    );

    const isAuthorized = (status === "authenticated" && (session?.user as any)?.role === "admin") || devBypass;
    
    // Only fetch once when authorized, and not already fetched
    if (isAuthorized && !hasFetchedRef.current && !isFetchingRef.current) {
      hasFetchedRef.current = true;
      fetchStats();
    }
  }, [status, session, fetchStats]); // Removed 'loading' from dependencies to prevent re-runs

  const handleSyncEmails = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch("/api/admin/sync-emails/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        const syncTime = new Date();
        setLastSynced(syncTime);
        // Store in localStorage for persistence
        if (typeof window !== "undefined") {
          localStorage.setItem("email-sync-last-synced", syncTime.toISOString());
        }
        const message = result.count 
          ? `Email sync completed! ${result.count} emails synced.`
          : result.successful 
          ? `Email sync completed! ${result.successful} inbox(es) synced successfully.`
          : "Email sync completed!";
        alert(message);
        fetchStats();
      } else {
        alert(`Email sync failed: ${result.error || result.details || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Error syncing emails:", error);
      alert(`Failed to sync emails: ${error?.message || "Please check your email inbox configuration in Settings"}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Track if component is mounted to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load last synced time from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("email-sync-last-synced");
      if (stored) {
        try {
          setLastSynced(new Date(stored));
        } catch (e) {
          console.error("Error parsing last synced time:", e);
        }
      }
    }
  }, []);

  // Check for dev bypass (development only) - allow access automatically in dev mode
  // Only check on client side to prevent hydration mismatch
  const isDev = mounted && typeof window !== "undefined" && 
    (process.env.NODE_ENV === "development" || 
     window.location.hostname === "localhost" ||
     window.location.hostname === "127.0.0.1" ||
     window.location.hostname.startsWith("192.168."));
  
  const devBypass = mounted && isDev && (
    (typeof window !== "undefined" && sessionStorage.getItem("dev_admin_bypass") === "true") ||
    (!session && isDev) // Auto-allow in dev mode even without session
  );

  const isAdmin = session && (session?.user as any)?.role === "admin";
  
  // Check for "View as" demo mode from query parameter
  const [viewAs, setViewAs] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const view = params.get("view");
      if (view === "ali" || view === "nigel") {
        setViewAs(view);
      }
    }
  }, []);
  
  const displayName = viewAs === "ali" 
    ? "Ali Peirce"
    : viewAs === "nigel"
    ? "Nigel Peirce"
    : isAdmin 
    ? session.user?.name 
    : (mounted && typeof window !== "undefined" ? sessionStorage.getItem("dev_admin_name") : null) || "Dev Admin";
  const userEmail = viewAs === "ali" 
    ? "ali@stylishentertainment.co.uk"
    : session?.user?.email || null;
  const isSuperAdminUser = isSuperAdmin(userEmail);

  const [greetingText, setGreetingText] = useState("Welcome back");
  useEffect(() => {
    if (!mounted) return;
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
    const firstName = (displayName || "").split(/\s+/)[0] || displayName || "there";
    setGreetingText(`${timeGreeting}, ${firstName}`);
  }, [mounted, displayName]);

  // Show loading state - ensure consistent rendering between server and client
  if (!mounted || (status === "loading" || loading) && !devBypass) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin && !devBypass) {
    return null;
  }

  return (
    <>
      <AddBookingModal
        open={showNewBookingModal}
        onOpenChange={setShowNewBookingModal}
        onSuccess={() => {
          // Refresh stats after booking creation
          fetchStats();
        }}
      />
      <Dialog open={showFirstTouchModal} onOpenChange={setShowFirstTouchModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Send First Touch</DialogTitle>
            <DialogDescription>
              Choose a booking to send the First Touch thank-you email. This will mark the enquiry as contacted and stop the red pulse on the dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {newEnquiryBookings.length === 0 ? (
              <p className="text-gray-400 text-sm">No enquiries waiting for first touch.</p>
            ) : (
              newEnquiryBookings.map((b: any) => {
                const eventDate = b.eventDate ? new Date(b.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-800/80 border border-gray-700"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white truncate">{b.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {b.venueName || "Venue TBC"} · {eventDate}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={async (e) => {
                        e.preventDefault();
                        setSendingFirstTouchId(b.id);
                        try {
                          const res = await fetch(`/api/admin/bookings/${b.id}/send-first-touch`, {
                            method: "POST",
                            credentials: "include",
                          });
                          const data = await res.json().catch(() => ({}));
                          if (res.ok && data.success) {
                            setNewEnquiryBookings((prev) => prev.filter((x: any) => x.id !== b.id));
                            fetchStats();
                            if (newEnquiryBookings.length <= 1) setShowFirstTouchModal(false);
                          } else {
                            alert(data.error || "Failed to send First Touch email");
                          }
                        } catch (err) {
                          alert("Failed to send First Touch email");
                        } finally {
                          setSendingFirstTouchId(null);
                        }
                      }}
                      disabled={sendingFirstTouchId !== null}
                      className="bg-champagne-gold text-black hover:bg-gold-light shrink-0"
                    >
                      {sendingFirstTouchId === b.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-1" />
                          Send
                        </>
                      )}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        {/* Booking Integrity Warning */}
        <BookingIntegrityWarning />
      
      {/* New Submission Notifier */}
      <NewSubmissionNotifier />
      
      {/* Conflict Count Badge */}
      <ConflictCountBadge />
      
      <div className="container mx-auto max-w-7xl">
        {/* Header – clean greeting only; dev warning moved to DeveloperSettings */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-serif text-4xl font-bold text-white tracking-tight">
                {displayName?.toLowerCase().includes("ali") || viewAs === "ali" ? "Ali's Desk" : "Admin Dashboard"}
              </h1>
              <p className="font-serif text-gray-400 mt-1">{greetingText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <AdminHelp />
              <Link href="/admin/90-day-command">
                <Button
                  variant="outline"
                  className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10 whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  90-Day Command Centre
                </Button>
              </Link>
              <Button
                onClick={handleSyncEmails}
                disabled={isSyncing}
                className="bg-champagne-gold text-black hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Syncing..." : "Sync Emails"}
              </Button>
              {lastSynced && (
                <p className="text-xs text-gray-400 self-center hidden sm:block">Last synced: {lastSynced.toLocaleTimeString()}</p>
              )}
              <Button
                onClick={() => signOut({ callbackUrl: "/login" })}
                variant="outline"
                className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 whitespace-nowrap"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </motion.div>

        {/* KPI row – 90-Day Command Centre: only these 3 high-end cards; pulse on New Enquiries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Link href="/admin/inbox" className="block">
            <Card className="bg-gray-800/90 border border-gray-600 hover:border-champagne-gold/40 transition-all cursor-pointer h-full shadow-lg">
              <CardContent className="p-8 flex items-center justify-between">
                <div>
                  <p className="font-serif text-sm uppercase tracking-widest text-gray-400 mb-2">Unread Emails</p>
                  <p className="text-5xl font-bold text-white tabular-nums tracking-tight">{stats.unreadEmails}</p>
                </div>
                <Mail className="w-10 h-10 text-champagne-gold/80" />
              </CardContent>
            </Card>
          </Link>
          <div className="block relative" title="Review new form submissions (Enquire, contact, quote request)">
            <Link href="/admin/bookings/" className="block">
              <Card className={`h-full transition-all cursor-pointer relative overflow-hidden shadow-lg ${
                stats.pendingNewEnquiries > 0
                  ? "bg-red-950/50 border-red-500/50 ring-2 ring-red-500/20 animate-pulse"
                  : stats.pendingBookings > 0
                  ? "bg-gray-800/90 border border-gray-600 hover:border-champagne-gold/40"
                  : "bg-gray-800/90 border border-gray-600 hover:border-champagne-gold/40"
              }`}>
                {(stats.pendingNewEnquiries > 0 || stats.pendingBookings > 0) && (
                  <div className="absolute inset-0 bg-red-500/5 pointer-events-none animate-pulse" />
                )}
                <CardContent className="p-8 relative z-10 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <p className="font-serif text-sm uppercase tracking-widest text-gray-400">New Enquiries</p>
                        {enquiryUrgentCount > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-600/80 text-red-100 border border-red-400/50 animate-pulse">
                            !! {enquiryUrgentCount} URGENT
                          </span>
                        )}
                      </div>
                      <p className={`font-serif text-5xl font-bold tabular-nums tracking-tight ${stats.pendingNewEnquiries > 0 ? "text-red-200" : stats.pendingBookings > 0 ? "text-red-200" : "text-white"}`}>
                        {stats.pendingNewEnquiries}
                      </p>
                      <p className="font-serif text-sm text-gray-400 mt-2">
                        {stats.pendingNewEnquiries > 0
                          ? "From Enquire & contact forms — open Inbox to review"
                          : `${stats.pendingBookings} pending bookings awaiting first touch`}
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="mt-3 border-champagne-gold/60 text-champagne-gold hover:bg-champagne-gold/10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowFirstTouchModal(true);
                        }}
                      >
                        <Send className="w-4 h-4 mr-1.5" />
                        Send First Touch
                      </Button>
                    </div>
                    <AlertCircle className={`w-10 h-10 flex-shrink-0 ${stats.pendingBookings > 0 ? "text-red-400/90" : "text-champagne-gold/80"}`} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
          <div>
            <Card className="bg-gray-800/90 border border-gray-600 h-full shadow-lg">
              <CardContent className="p-8 flex items-center justify-between">
                <div>
                  <p className="font-serif text-sm uppercase tracking-widest text-gray-400 mb-2">Today&apos;s Events</p>
                  <p className="text-5xl font-bold text-white tabular-nums tracking-tight">{stats.todayEvents}</p>
                </div>
                <Clock className="w-10 h-10 text-champagne-gold/80" />
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Recent Activity – unified timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mb-12"
        >
          <RecentActivityFeed />
        </motion.div>

        {/* Main Actions – three strategic columns: Daily Ops, The Talent, Inventory & Assets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
        >
          {/* Daily Ops */}
          <div>
            <h2 className="font-serif text-lg font-semibold text-gray-300 uppercase tracking-widest mb-4">Daily Ops</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewBookingModal(true)}
              className="w-full mb-3 border-amber-500/50 text-amber-200/90 hover:bg-amber-500/10 hover:border-amber-400/60 hover:text-amber-100 font-medium transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Quick Action: New Booking
            </Button>
            <div className="space-y-3">
              <Link href="/admin/bookings/">
                <Card className="bg-gray-800/80 border border-gray-700 hover:border-champagne-gold/50 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-champagne-gold/80" />
                    <div>
                      <h3 className="font-medium text-white">Inbox</h3>
                      <p className="text-xs text-gray-400">New enquiries &amp; bookings</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/new-enquiries/">
                <Card className="bg-gray-800/80 border border-gray-700 hover:border-champagne-gold/50 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-champagne-gold/80" />
                    <div>
                      <h3 className="font-medium text-white">Review Enquiries</h3>
                      <p className="text-xs text-gray-400">
                        {stats.pendingNewEnquiries > 0
                          ? `${stats.pendingNewEnquiries} awaiting review`
                          : "Enquire & quote requests"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/inbox/">
                <Card className="bg-gray-800/80 border border-gray-700 hover:border-champagne-gold/50 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Inbox className="w-5 h-5 text-champagne-gold/80" />
                    <div>
                      <h3 className="font-medium text-white">Email Inbox</h3>
                      <p className="text-xs text-gray-400">{stats.unreadEmails} unread</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Card
                className="bg-gray-800/80 border border-gray-700 hover:border-champagne-gold/50 transition-all cursor-pointer"
                onClick={() => setShowNewBookingModal(true)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-champagne-gold/80" />
                  <div>
                    <h3 className="font-medium text-white">New Booking</h3>
                    <p className="text-xs text-gray-400">Create a new booking entry</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* The Talent */}
          <div>
            <h2 className="font-serif text-lg font-semibold text-gray-300 uppercase tracking-widest mb-4">The Talent</h2>
            <div className="space-y-3">
              <Link href="/admin/djs">
                <Card className="bg-gray-800/80 border border-gray-700 hover:border-champagne-gold/50 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Music className="w-5 h-5 text-champagne-gold/80" />
                    <div>
                      <h3 className="font-medium text-white">DJs</h3>
                      <p className="text-xs text-gray-400">Manage DJ profiles</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/musicians">
                <Card className="bg-gray-800/80 border border-gray-700 hover:border-champagne-gold/50 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Music className="w-5 h-5 text-champagne-gold/80" />
                    <div>
                      <h3 className="font-medium text-white">Musicians</h3>
                      <p className="text-xs text-gray-400">Manage musician profiles</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/staff-management">
                <Card className="bg-gray-800/80 border border-gray-700 hover:border-champagne-gold/50 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Users className="w-5 h-5 text-champagne-gold/80" />
                    <div>
                      <h3 className="font-medium text-white">Staff Management</h3>
                      <p className="text-xs text-gray-400">Team directory and contact info</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Inventory & Assets – Hire Shop, Venue Brochures, Email Templates; Venue Upload at bottom */}
          <div>
            <h2 className="font-serif text-lg font-semibold text-gray-300 uppercase tracking-widest mb-4">Inventory & Assets</h2>
            <div className="space-y-3">
              <Link href="/admin/hire-items">
                <Card className="bg-gray-800/80 border border-gray-700 hover:border-champagne-gold/50 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Package className="w-5 h-5 text-champagne-gold/80" />
                    <div>
                      <h3 className="font-medium text-white">Hire Shop</h3>
                      <p className="text-xs text-gray-400">Manage products and pricing</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/service-quote-items">
                <Card className="bg-gray-800/80 border border-gray-700 hover:border-champagne-gold/50 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Calculator className="w-5 h-5 text-champagne-gold/80" />
                    <div>
                      <h3 className="font-medium text-white">Lighting & Styling Quote Items</h3>
                      <p className="text-xs text-gray-400">Fairy lights, festoon, lanterns – for quote generator</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/email-templates">
                <Card className="bg-gray-800/80 border border-gray-700 hover:border-champagne-gold/50 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-champagne-gold/80" />
                    <div>
                      <h3 className="font-medium text-white">Email Templates</h3>
                      <p className="text-xs text-gray-400">Manage email templates</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/orders">
                <Card className="bg-gray-800/80 border border-gray-700 hover:border-champagne-gold/50 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Package className="w-5 h-5 text-champagne-gold/80" />
                    <div>
                      <h3 className="font-medium text-white">Hire Orders</h3>
                      <p className="text-xs text-gray-400">View and manage orders</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
            {/* Venue Upload at bottom of column so it doesn't dominate the center */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="font-serif text-sm font-medium text-gray-400 uppercase tracking-widest mb-3">Upload Venue Brochure</p>
              <Card className="bg-gray-800/80 border border-gray-700">
                <CardContent className="p-4">
                  <VenueAssetUploader />
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>

        {/* DeveloperSettings – Auth Bypassed warning + dev tools; hidden unless toggled */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <DeveloperSettings authBypassed={!!devBypass}>
            {isSuperAdminUser && (
              <>
                <Link href="/admin/db-audit">
                  <Card className="bg-gray-800 border border-gray-600 hover:border-gray-500 transition-all cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Database className="w-5 h-5 text-indigo-400" />
                      <div>
                        <h3 className="font-medium text-white text-sm">Database Audit</h3>
                        <p className="text-xs text-gray-400">Compare schema with Supabase</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/admin/email-audit">
                  <Card className="bg-gray-800 border border-gray-600 hover:border-gray-500 transition-all cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Mail className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="font-medium text-white text-sm">Email Audit</h3>
                        <p className="text-xs text-gray-400">Diagnose email sync issues</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                {(process.env.NODE_ENV === "development" || (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))) && (
                  <Link href="/admin/dev-bypass-toggle">
                    <Card className="bg-gray-800 border border-gray-600 hover:border-gray-500 transition-all cursor-pointer h-full">
                      <CardContent className="p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                        <div>
                          <h3 className="font-medium text-white text-sm">Dev Bypass</h3>
                          <p className="text-xs text-gray-400">Enable or disable auth bypass</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )}
                <Link href="/admin/hire-items/seed">
                  <Card className="bg-gray-800 border border-gray-600 hover:border-gray-500 transition-all cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Package className="w-5 h-5 text-champagne-gold/80" />
                      <div>
                        <h3 className="font-medium text-white text-sm">Seed Hire Items</h3>
                        <p className="text-xs text-gray-400">Create initial hire items</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/admin/users">
                  <Card className="bg-gray-800 border border-gray-600 hover:border-gray-500 transition-all cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Users className="w-5 h-5 text-champagne-gold/80" />
                      <div>
                        <h3 className="font-medium text-white text-sm">User Management</h3>
                        <p className="text-xs text-gray-400">Manage users and roles</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/admin/settings">
                  <Card className="bg-gray-800 border border-gray-600 hover:border-gray-500 transition-all cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Settings className="w-5 h-5 text-champagne-gold/80" />
                      <div>
                        <h3 className="font-medium text-white text-sm">Settings</h3>
                        <p className="text-xs text-gray-400">Configure email inboxes</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </>
            )}
          </DeveloperSettings>
        </motion.div>
      </div>
    </div>
    </>
  );
}
