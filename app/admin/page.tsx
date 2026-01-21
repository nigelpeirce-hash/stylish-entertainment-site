"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Mail,
  Inbox,
  Send,
  Users,
  Calendar,
  Settings,
  RefreshCw,
  TrendingUp,
  Clock,
  LogOut,
  Package,
  Music,
  AlertCircle,
  Database,
} from "lucide-react";
import Link from "next/link";
import AdminHelp from "@/components/AdminHelp";
import VenueAssetUploader from "@/components/VenueAssetUploader";
import { NewSubmissionNotifier } from "@/components/NewSubmissionNotifier";
import { BookingIntegrityWarning } from "@/components/BookingIntegrityWarning";
import { ConflictCountBadge } from "@/components/ConflictCountBadge";
import { isSuperAdmin } from "@/lib/admin-permissions";
import { Badge } from "@/components/ui/badge";
import { AddBookingModal } from "@/components/admin/bookings/add-booking-modal";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    unreadEmails: 0,
    totalThreads: 0,
    pendingBookings: 0,
    todayEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [priorityStats, setPriorityStats] = useState({
    urgent: 0,
    medium: 0,
  });
  const [unreadThreads, setUnreadThreads] = useState<any[]>([]);
  const [recentThreads, setRecentThreads] = useState<any[]>([]);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);

  // Track redirect to prevent multiple redirects
  const redirectAttemptedRef = useRef(false);
  // Use ref to track if we've already fetched to prevent loops
  const hasFetchedRef = useRef(false);
  // Use ref to prevent concurrent fetches
  const isFetchingRef = useRef(false);

  // Memoize fetchStats to prevent recreation and dependency loops
  const fetchStats = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) {
      return;
    }
    
    isFetchingRef.current = true;
    setLoading(true);
    try {
      // Fetch unread threads
      const threadsRes = await fetch("/api/admin/threads?isRead=false");
      const threadsData = await threadsRes.json();
      
      // Fetch pending bookings
      const bookingsRes = await fetch("/api/admin/bookings?status=pending");
      const bookingsData = await bookingsRes.json();

      // Calculate priority breakdown and new enquiries (no action taken yet)
      const bookings = bookingsData.bookings || [];
      const urgent = bookings.filter((b: any) => b.priority === "urgent").length;
      const medium = bookings.filter((b: any) => b.priority === "medium").length;
      
      // Count new enquiries (no admin action taken yet - autoresponder doesn't count)
      const newEnquiries = bookings.filter((b: any) => {
        // If lastEmailSentAt is null, no admin action has been taken
        // Autoresponder emails don't count as "action taken"
        return !b.lastEmailSentAt;
      });

      setStats({
        unreadEmails: threadsData.threads?.length || 0,
        totalThreads: threadsData.threads?.length || 0,
        pendingBookings: newEnquiries.length, // Show count of new enquiries (no action yet)
        todayEvents: 0, // TODO: Calculate today's events
      });

      setPriorityStats({
        urgent,
        medium,
      });

      // Fetch unread threads for display (limit to 5)
      const unreadRes = await fetch("/api/admin/threads?isRead=false");
      const unreadData = await unreadRes.json();
      setUnreadThreads((unreadData.threads || []).slice(0, 5));

      // Fetch recent threads (limit to 5)
      const recentRes = await fetch("/api/admin/threads");
      const recentData = await recentRes.json();
      setRecentThreads((recentData.threads || []).slice(0, 5));
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []); // No dependencies - function is stable

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
    try {
      const response = await fetch("/api/admin/email/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (result.success) {
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
    }
  };

  // Track if component is mounted to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  // Show loading state - ensure consistent rendering between server and client
  if (!mounted || (status === "loading" || loading) && !devBypass) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
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
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
        {/* Booking Integrity Warning */}
        <BookingIntegrityWarning />
      
      {/* New Submission Notifier */}
      <NewSubmissionNotifier />
      
      {/* Conflict Count Badge */}
      <ConflictCountBadge />
      
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">
                  {displayName?.toLowerCase().includes("ali") || viewAs === "ali" ? "Ali's Desk" : "Admin Dashboard"}
                </h1>
                {viewAs && (
                  <div className="flex gap-2 items-center">
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
                      Viewing as: {viewAs === "ali" ? "Ali" : "Nigel"}
                    </span>
                    <Button
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.delete("view");
                        window.location.href = url.toString();
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6 px-2 text-gray-400 hover:text-white"
                    >
                      Exit Demo
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-gray-400">Welcome back, {displayName}</p>
              {devBypass && (
                <p className="text-xs text-yellow-400 mt-1">⚠️ Development Mode - Auth Bypassed</p>
              )}
              {!viewAs && isSuperAdminUser && (
                <div className="flex gap-2 mt-2">
                  <Link href="/admin?view=ali">
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-3 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                      👁️ View as Ali
                    </Button>
                  </Link>
                  <Link href="/admin?view=nigel">
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-3 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                      👁️ View as Nigel
                    </Button>
                  </Link>
                </div>
              )}
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
                className="bg-champagne-gold text-black hover:bg-gold-light"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Emails
              </Button>
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

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Link href="/admin/inbox">
            <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Unread Emails</p>
                    <p className="text-3xl font-bold text-white">{stats.unreadEmails}</p>
                  </div>
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Mail className="w-6 h-6 text-champagne-gold" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/inbox">
            <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Threads</p>
                    <p className="text-3xl font-bold text-white">{stats.totalThreads}</p>
                  </div>
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Inbox className="w-6 h-6 text-champagne-gold" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/bookings?status=pending">
            <Card className={`bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer relative overflow-hidden ${
              stats.pendingBookings > 0 
                ? "border-red-500 ring-4 ring-red-500/70 bg-red-950/30 animate-throb" 
                : priorityStats.urgent > 0 
                ? "ring-2 ring-red-500/50 animate-throb" 
                : ""
            }`}>
              {/* Red flashing overlay for new enquiries */}
              {stats.pendingBookings > 0 && (
                <div className="absolute inset-0 bg-red-500/10 animate-throb pointer-events-none" />
              )}
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-gray-400">New Enquiries</p>
                      {stats.pendingBookings > 0 && (
                        <span className="px-2 py-0.5 bg-red-900/60 border border-red-500 rounded text-xs font-bold text-red-300 animate-throb">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className={`text-3xl font-bold ${
                        stats.pendingBookings > 0 ? "text-red-300" : "text-white"
                      }`}>
                        {stats.pendingBookings}
                      </p>
                      {stats.pendingBookings > 0 && (
                        <div className="text-red-400 animate-throb">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    {stats.pendingBookings > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {priorityStats.urgent > 0 && (
                          <span className="px-2 py-0.5 bg-red-900/60 border border-red-500/70 rounded text-xs font-bold text-red-300 animate-throb">
                            {priorityStats.urgent} URGENT
                          </span>
                        )}
                        {priorityStats.medium > 0 && (
                          <span className="px-2 py-0.5 bg-yellow-900/40 border border-yellow-500/50 rounded text-xs font-bold text-yellow-400">
                            {priorityStats.medium} Medium
                          </span>
                        )}
                      </div>
                    )}
                    {stats.pendingBookings > 0 && (
                      <p className="text-xs text-red-300 mt-2 font-bold animate-throb">
                        ⚠️ No action taken yet - Send first reply
                      </p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    stats.pendingBookings > 0 
                      ? "bg-red-900/40 animate-throb" 
                      : "bg-champagne-gold/20"
                  }`}>
                    <Calendar className={`w-6 h-6 ${
                      stats.pendingBookings > 0 
                        ? "text-red-300" 
                        : "text-champagne-gold"
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Today's Events</p>
                  <p className="text-3xl font-bold text-white">{stats.todayEvents}</p>
                </div>
                <div className="p-3 bg-champagne-gold/20 rounded-lg">
                  <Clock className="w-6 h-6 text-champagne-gold" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Unread Emails & Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Unread Emails */}
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-champagne-gold" />
                  Unread Emails
                </CardTitle>
                <Link href="/admin/inbox?isRead=false">
                  <Button variant="ghost" size="sm" className="text-xs text-champagne-gold hover:text-champagne-gold/80">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {unreadThreads.length === 0 ? (
                <p className="text-gray-400 text-sm">No unread emails</p>
              ) : (
                <div className="space-y-3">
                  {unreadThreads.map((thread: any) => {
                    const inboxName = thread.EmailInbox?.name || "Unknown";
                    const inboxBadgeColor = inboxName.toLowerCase().includes("gmail") 
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      : inboxName.toLowerCase().includes("123") || inboxName.toLowerCase().includes("reg")
                      ? "bg-champagne-gold/20 text-champagne-gold border-champagne-gold/30"
                      : "bg-gray-700/50 text-gray-300 border-gray-600/30";
                    
                    const senderName = thread.fromName || thread.fromEmail || "Unknown";
                    const lastEmail = thread.Email?.[0];
                    const snippet = lastEmail?.textContent 
                      ? lastEmail.textContent.substring(0, 50).replace(/\s+/g, " ").trim() + (lastEmail.textContent.length > 50 ? "..." : "")
                      : "No preview available";

                    return (
                      <Link 
                        key={thread.id} 
                        href={`/admin/inbox?threadId=${thread.id}`}
                        className="block p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900/80 border border-gray-700/50 hover:border-champagne-gold/30 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-white text-sm truncate">{senderName}</span>
                              <Badge className={`text-xs ${inboxBadgeColor}`}>
                                {inboxName}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-gray-200 truncate">{thread.subject || "No subject"}</p>
                          </div>
                        </div>
                        {snippet && (
                          <p className="text-xs text-gray-400 line-clamp-2">{snippet}</p>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-champagne-gold" />
                  Recent Activity
                </CardTitle>
                <Link href="/admin/inbox">
                  <Button variant="ghost" size="sm" className="text-xs text-champagne-gold hover:text-champagne-gold/80">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentThreads.length === 0 ? (
                <p className="text-gray-400 text-sm">No recent activity</p>
              ) : (
                <div className="space-y-3">
                  {recentThreads.map((thread: any) => {
                    const inboxName = thread.EmailInbox?.name || "Unknown";
                    const inboxBadgeColor = inboxName.toLowerCase().includes("gmail") 
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      : inboxName.toLowerCase().includes("123") || inboxName.toLowerCase().includes("reg")
                      ? "bg-champagne-gold/20 text-champagne-gold border-champagne-gold/30"
                      : "bg-gray-700/50 text-gray-300 border-gray-600/30";
                    
                    const senderName = thread.fromName || thread.fromEmail || "Unknown";
                    const lastEmail = thread.Email?.[0];
                    const snippet = lastEmail?.textContent 
                      ? lastEmail.textContent.substring(0, 50).replace(/\s+/g, " ").trim() + (lastEmail.textContent.length > 50 ? "..." : "")
                      : "No preview available";

                    return (
                      <Link 
                        key={thread.id} 
                        href={`/admin/inbox?threadId=${thread.id}`}
                        className="block p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900/80 border border-gray-700/50 hover:border-champagne-gold/30 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-white text-sm truncate">{senderName}</span>
                              <Badge className={`text-xs ${inboxBadgeColor}`}>
                                {inboxName}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-gray-200 truncate">{thread.subject || "No subject"}</p>
                          </div>
                        </div>
                        {snippet && (
                          <p className="text-xs text-gray-400 line-clamp-2">{snippet}</p>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Main Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/admin/90-day-command">
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">90-Day Command Centre</h3>
                    <p className="text-sm text-gray-400">Upcoming events & status tracking</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/bookings">
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Manage Bookings</h3>
                    <p className="text-sm text-gray-400">View and manage all bookings</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/orders">
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Package className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Hire Orders</h3>
                    <p className="text-sm text-gray-400">View and manage orders</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/staff-management">
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Users className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Staff Management</h3>
                    <p className="text-sm text-gray-400">Team directory & contact info</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/email-demo">
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Mail className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email Templates</h3>
                    <p className="text-sm text-gray-400">Preview all email templates</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {isSuperAdminUser && (
              <Link href="/admin/users">
                <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-champagne-gold/20 rounded-lg">
                      <Users className="w-6 h-6 text-champagne-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">User Management</h3>
                      <p className="text-sm text-gray-400">Manage users and roles</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}

            <Link href="/admin/inbox">
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Inbox className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">Email Inbox</h3>
                    <p className="text-sm text-gray-400">View and manage emails</p>
                    <p className="text-xs text-yellow-400 mt-1">
                      💡 Configure inboxes in Settings first
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/hire-items">
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Package className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Hire Shop Items</h3>
                    <p className="text-sm text-gray-400">Manage products & pricing</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>

        {/* Additional Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Additional Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isSuperAdminUser && (
              <>
                <Link href="/admin/settings">
                  <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 bg-champagne-gold/20 rounded-lg">
                        <Settings className="w-6 h-6 text-champagne-gold" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">Settings</h3>
                        <p className="text-sm text-gray-400">Configure email inboxes</p>
                        <p className="text-xs text-blue-400 mt-1">
                          ⚙️ Test connections & sync emails
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/admin/email-audit">
                  <Card className="bg-gray-800 border-purple-500/30 hover:border-purple-500/60 transition-all cursor-pointer h-full">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <Mail className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">Email Audit</h3>
                        <p className="text-sm text-gray-400">Diagnose email sync issues</p>
                        <p className="text-xs text-purple-400 mt-1">
                          🔍 Check server vs database stats
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/admin/db-audit">
                  <Card className="bg-gray-800 border-indigo-500/30 hover:border-indigo-500/60 transition-all cursor-pointer h-full">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 bg-indigo-500/20 rounded-lg">
                        <Database className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">Database Audit</h3>
                        <p className="text-sm text-gray-400">Compare schema with Supabase</p>
                        <p className="text-xs text-indigo-400 mt-1">
                          🔍 Verify all fields exist
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                {(process.env.NODE_ENV === "development" || typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) && (
                  <Link href="/admin/dev-bypass-toggle">
                    <Card className="bg-gray-800 border-yellow-500/30 hover:border-yellow-500/60 transition-all cursor-pointer h-full">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/20 rounded-lg">
                          <AlertCircle className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">Dev Bypass Toggle</h3>
                          <p className="text-sm text-gray-400">Enable/disable auth bypass</p>
                          <p className="text-xs text-yellow-400 mt-1">
                            ⚠️ Development only
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )}
              </>
            )}

            <Link href="/admin/email-templates">
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Mail className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email Templates</h3>
                    <p className="text-sm text-gray-400">Manage email templates</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/emails">
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Send className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email Journey</h3>
                    <p className="text-sm text-gray-400">Preview customer lifecycle emails</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/djs">
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Music className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">DJs</h3>
                    <p className="text-sm text-gray-400">Manage DJ profiles</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/musicians">
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Music className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Musicians</h3>
                    <p className="text-sm text-gray-400">Manage musician profiles</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>

        {/* Utility Tools - SuperAdmin Only */}
        {isSuperAdminUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">Utility Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/admin/hire-items/seed">
                <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-champagne-gold/20 rounded-lg">
                      <Package className="w-6 h-6 text-champagne-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Seed Hire Items</h3>
                      <p className="text-sm text-gray-400">Create initial hire items</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Card 
                className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full"
                onClick={() => setShowNewBookingModal(true)}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">New Booking</h3>
                    <p className="text-sm text-gray-400">Create a new booking entry</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Venue Asset Uploader */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Venue Assets</h2>
          <div className="max-w-xl">
            <VenueAssetUploader />
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
