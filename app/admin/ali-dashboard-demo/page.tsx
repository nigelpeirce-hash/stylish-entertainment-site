"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "@/lib/motion";
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

export default function AliDashboardDemo() {
  // Demo stats data
  const stats = {
    unreadEmails: 12,
    totalThreads: 47,
    pendingBookings: 3,
    todayEvents: 2,
  };

  const priorityStats = {
    urgent: 2,
    medium: 1,
  };

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
              <h1 className="text-4xl font-bold mb-2">Ali's Desk</h1>
              <p className="text-gray-400">Welcome back, Ali</p>
              <p className="text-xs text-blue-400 mt-1">📋 Demo Mode - Sample Data</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10 whitespace-nowrap"
                onClick={() => alert("This is a demo. In the real dashboard, this would link to the 90-Day Command Centre.")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                90-Day Command Centre
              </Button>
              <Button
                className="bg-champagne-gold text-black hover:bg-gold-light"
                disabled
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Emails
              </Button>
              <Button
                variant="outline"
                className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 whitespace-nowrap"
                disabled
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
          <Card 
            className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              alert("This is a demo. In the real dashboard, this would link to your email inbox.");
            }}
          >
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

          <Card 
            className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              alert("This is a demo. In the real dashboard, this would link to your email inbox.");
            }}
          >
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

          <Card 
            className={
              stats.pendingBookings > 0 
                ? "bg-gray-800 border-red-500 ring-4 ring-red-500/70 bg-red-950/30 animate-pulse hover:border-champagne-gold/60 transition-all cursor-pointer relative overflow-hidden"
                : priorityStats.urgent > 0 
                ? "bg-gray-800 border-champagne-gold/30 ring-2 ring-red-500/50 animate-pulse hover:border-champagne-gold/60 transition-all cursor-pointer relative overflow-hidden"
                : "bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer relative overflow-hidden"
            }
            onClick={(e) => {
              e.preventDefault();
              alert("This is a demo. In the real dashboard, this would link to pending bookings.");
            }}
          >
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
            <Card 
              className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full"
              onClick={() => alert("This is a demo. In the real dashboard, this would link to the 90-Day Command Centre.")}
            >
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

            <Card 
              className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full"
              onClick={() => alert("This is a demo. In the real dashboard, this would link to all bookings.")}
            >
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

            <Card 
              className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full"
              onClick={() => alert("This is a demo. In the real dashboard, this would link to hire orders.")}
            >
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

            <Card 
              className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full"
              onClick={() => alert("This is a demo. In the real dashboard, this would link to staff management.")}
            >
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

            <Card 
              className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full"
              onClick={() => window.location.href = "/admin/ali-inbox-demo"}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-champagne-gold/20 rounded-lg">
                  <Inbox className="w-6 h-6 text-champagne-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">Email Inbox</h3>
                  <p className="text-sm text-gray-400">View and manage emails</p>
                  <p className="text-xs text-yellow-400 mt-1">
                    📋 Click to see inbox demo
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full"
              onClick={() => alert("This is a demo. In the real dashboard, this would link to hire shop items.")}
            >
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
            <Card 
              className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full"
              onClick={() => alert("This is a demo. In the real dashboard, this would link to email templates.")}
            >
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

            <Card 
              className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full"
              onClick={() => alert("This is a demo. In the real dashboard, this would link to the email journey.")}
            >
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

            <Card 
              className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full"
              onClick={() => alert("This is a demo. In the real dashboard, this would link to DJ management.")}
            >
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

            <Card 
              className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full"
              onClick={() => alert("This is a demo. In the real dashboard, this would link to musician management.")}
            >
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
          </div>
        </motion.div>

        {/* Demo Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-blue-900/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Demo Mode</h3>
                  <p className="text-sm text-gray-300">
                    This is a preview of Ali's Dashboard with sample data. In the actual dashboard, 
                    all stats and numbers will reflect real-time data from your database.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    The "New Enquiries" card will pulse red when there are bookings that need attention.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
