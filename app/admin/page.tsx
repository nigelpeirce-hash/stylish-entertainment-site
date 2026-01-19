"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import AdminHelp from "@/components/AdminHelp";
import VenueAssetUploader from "@/components/VenueAssetUploader";
import { NewSubmissionNotifier } from "@/components/NewSubmissionNotifier";
import { BookingIntegrityWarning } from "@/components/BookingIntegrityWarning";
import { ConflictCountBadge } from "@/components/ConflictCountBadge";

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

  useEffect(() => {
    // Check for dev bypass first (development only)
    const devBypass = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
      sessionStorage.getItem("dev_admin_bypass") === "true";

    if (devBypass) {
      // Dev bypass active, allow access
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    // Check for dev bypass
    const devBypass = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
      sessionStorage.getItem("dev_admin_bypass") === "true";

    if ((status === "authenticated" && (session?.user as any)?.role === "admin") || devBypass) {
      fetchStats();
    }
  }, [status, session]);

  const [priorityStats, setPriorityStats] = useState({
    urgent: 0,
    medium: 0,
  });

  const fetchStats = async () => {
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
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncEmails = async () => {
    try {
      const response = await fetch("/api/admin/email/sync", {
        method: "POST",
      });
      const result = await response.json();
      if (result.success) {
        alert(`Email sync completed! ${result.count || result.successful} emails synced.`);
        fetchStats();
      }
    } catch (error) {
      console.error("Error syncing emails:", error);
      alert("Failed to sync emails");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Check for dev bypass (development only)
  const devBypass = typeof window !== "undefined" && 
    (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
    sessionStorage.getItem("dev_admin_bypass") === "true";

  const isAdmin = session && (session?.user as any)?.role === "admin";
  const displayName = isAdmin ? session.user?.name : sessionStorage.getItem("dev_admin_name") || "Dev Admin";

  if (!isAdmin && !devBypass) {
    return null;
  }

  return (
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
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Welcome back, {displayName}</p>
              {devBypass && (
                <p className="text-xs text-yellow-400 mt-1">⚠️ Development Mode - Auth Bypassed</p>
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
                ? "border-red-500 ring-4 ring-red-500/70 bg-red-950/30 animate-pulse" 
                : priorityStats.urgent > 0 
                ? "ring-2 ring-red-500/50 animate-pulse" 
                : ""
            }`}>
              {/* Red flashing overlay for new enquiries */}
              {stats.pendingBookings > 0 && (
                <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
              )}
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-gray-400">New Enquiries</p>
                      {stats.pendingBookings > 0 && (
                        <span className="px-2 py-0.5 bg-red-900/60 border border-red-500 rounded text-xs font-bold text-red-300 animate-pulse">
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
                        <div className="text-red-400 animate-pulse">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    {stats.pendingBookings > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {priorityStats.urgent > 0 && (
                          <span className="px-2 py-0.5 bg-red-900/60 border border-red-500/70 rounded text-xs font-bold text-red-300 animate-pulse">
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
                      <p className="text-xs text-red-300 mt-2 font-bold animate-pulse">
                        ⚠️ No action taken yet - Send first reply
                      </p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    stats.pendingBookings > 0 
                      ? "bg-red-900/40 animate-pulse" 
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

            <Link href="/admin/inbox">
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Inbox className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email Inbox</h3>
                    <p className="text-sm text-gray-400">View and manage emails</p>
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
            <Link href="/admin/settings">
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Settings className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Settings</h3>
                    <p className="text-sm text-gray-400">Configure email inboxes</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

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

        {/* Utility Tools */}
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

            <Link href="/demo-booking-form">
              <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Booking Form Demo</h3>
                    <p className="text-sm text-gray-400">Test DJ selection & upsells</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>

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
  );
}
