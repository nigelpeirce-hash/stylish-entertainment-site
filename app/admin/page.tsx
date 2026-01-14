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
} from "lucide-react";
import Link from "next/link";

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
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchStats();
    }
  }, [status, session]);

  const fetchStats = async () => {
    try {
      // Fetch unread threads
      const threadsRes = await fetch("/api/admin/threads?isRead=false");
      const threadsData = await threadsRes.json();
      
      // Fetch pending bookings
      const bookingsRes = await fetch("/api/admin/bookings?status=pending");
      const bookingsData = await bookingsRes.json();

      setStats({
        unreadEmails: threadsData.threads?.length || 0,
        totalThreads: threadsData.threads?.length || 0,
        pendingBookings: bookingsData.bookings?.length || 0,
        todayEvents: 0, // TODO: Calculate today's events
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

  if (!session || (session?.user as any)?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
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
              <p className="text-gray-400">Welcome back, {session.user?.name}</p>
            </div>
            <div className="flex flex-wrap gap-3">
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

          <Link href="/admin/bookings">
            <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Pending Bookings</p>
                    <p className="text-3xl font-bold text-white">{stats.pendingBookings}</p>
                  </div>
                  <div className="p-3 bg-champagne-gold/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-champagne-gold" />
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
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

          <Link href="/admin/bookings">
            <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-champagne-gold/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-champagne-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Bookings</h3>
                  <p className="text-sm text-gray-400">Manage all bookings</p>
                </div>
              </CardContent>
            </Card>
          </Link>

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
        </motion.div>
      </div>
    </div>
  );
}
