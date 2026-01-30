"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Database,
  Server,
  Settings,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { isSuperAdmin } from "@/lib/admin-permissions";

interface AuditResult {
  inboxId: string;
  inboxName: string;
  email: string;
  configuration: {
    hasImapHost: boolean;
    hasImapUsername: boolean;
    hasImapPassword: boolean;
    hasImapPort: boolean;
    imapHost: string | null;
    imapPort: number | null;
    imapSecure: boolean | null;
    imapUsername: string | null;
  };
  connection: {
    status: "success" | "error" | "not_configured";
    message: string;
    error?: string;
  };
  serverStats: {
    totalMessages: number | null;
    unreadMessages: number | null;
    recentMessages: number | null;
  };
  databaseStats: {
    totalEmails: number;
    totalThreads: number;
    lastSyncedAt: string | null;
  };
  syncStatus: {
    enabled: boolean;
    interval: number;
    isActive: boolean;
  };
}

interface AuditSummary {
  totalInboxes: number;
  configured: number;
  connected: number;
  totalServerEmails: number;
  totalDatabaseEmails: number;
}

export default function EmailAuditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Check for dev bypass first (development only)
    const devBypass = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
      sessionStorage.getItem("dev_admin_bypass") === "true";

    // Don't redirect while session is loading
    if (status !== "authenticated" && status !== "unauthenticated") {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      const userRole = (session?.user as any)?.role;
      const userEmail = session?.user?.email;
      
      if (userRole !== "admin") {
        router.push("/client/dashboard");
        return;
      } else if (!isSuperAdmin(userEmail) && !devBypass) {
        // Not SuperAdmin - redirect to dashboard
        router.push("/admin");
        return;
      }
    }

    if (devBypass) {
      // Dev bypass active, allow access
      return;
    }

    // Don't redirect while session is loading
    if (status !== "authenticated" && status !== "unauthenticated") {
      return;
    }

    if ((status as string) === "unauthenticated") {
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
      runAudit();
    }
  }, [status, session]);

  const runAudit = async () => {
    try {
      setLoading(true);
      // Check for dev bypass and add header
      const devBypass = typeof window !== "undefined" && 
        (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
        sessionStorage.getItem("dev_admin_bypass") === "true";
      
      const headers: HeadersInit = {};
      if (devBypass) {
        headers["x-dev-bypass"] = "true";
      }
      
      const response = await fetch("/api/admin/email/audit/", { headers });
      if (response.ok) {
        const data = await response.json();
        setAuditResults(data.audit || []);
        setSummary(data.summary || null);
      } else {
        const error = await response.json();
        alert(`Audit failed: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error running audit:", error);
      alert("Failed to run email audit");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await runAudit();
  };

  const handleSync = async (inboxId: string) => {
    try {
      const response = await fetch("/api/admin/email/sync/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inboxId }),
      });

      const result = await response.json();
      if (result.success) {
        alert(`Sync completed! ${result.count || 0} emails synced.`);
        await runAudit(); // Refresh audit
      } else {
        alert(`Sync failed: ${result.error || result.details || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Error syncing:", error);
      alert(`Failed to sync: ${error?.message || "Unknown error"}`);
    }
  };

  // Check for dev bypass
  const devBypass = typeof window !== "undefined" && 
    (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
    sessionStorage.getItem("dev_admin_bypass") === "true";

  // Show loading state while session is loading or audit is running
  if (((status !== "authenticated" && status !== "unauthenticated") || (loading && status !== "authenticated")) && !devBypass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated or not admin (redirect will happen) - unless dev bypass
  if (!devBypass && (status === "unauthenticated" || (status === "authenticated" && (session?.user as any)?.role !== "admin"))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Redirecting...</div>
      </div>
    );
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Email Setup Audit</h1>
              <p className="text-gray-400">Comprehensive email connection and sync diagnostics</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Refresh Audit
              </Button>
              <Link href="/admin/settings">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Inboxes
                </Button>
              </Link>
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

          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gray-800 border-champagne-gold/30">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400 mb-1">Total Inboxes</p>
                  <p className="text-2xl font-bold text-white">{summary.totalInboxes}</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-blue-500/30">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400 mb-1">Configured</p>
                  <p className="text-2xl font-bold text-blue-400">{summary.configured}</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-green-500/30">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400 mb-1">Connected</p>
                  <p className="text-2xl font-bold text-green-400">{summary.connected}</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-purple-500/30">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400 mb-1">Server vs Database</p>
                  <p className="text-lg font-bold text-purple-400">
                    {summary.totalServerEmails} → {summary.totalDatabaseEmails}
                  </p>
                  {summary.totalServerEmails > summary.totalDatabaseEmails && (
                    <p className="text-xs text-yellow-400 mt-1">
                      ⚠️ {summary.totalServerEmails - summary.totalDatabaseEmails} emails not synced
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>

        {/* Audit Results */}
        <div className="space-y-4">
          {auditResults.length === 0 ? (
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardContent className="p-12 text-center">
                <Mail className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-lg">No email inboxes configured</p>
                <p className="text-gray-500 text-sm mt-2">
                  Go to Settings to add your first email inbox
                </p>
              </CardContent>
            </Card>
          ) : (
            auditResults.map((result, index) => (
              <motion.div
                key={result.inboxId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`bg-gray-800 border ${
                    result.connection.status === "success"
                      ? "border-green-500/50"
                      : result.connection.status === "error"
                      ? "border-red-500/50"
                      : "border-yellow-500/50"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-6 h-6 text-champagne-gold" />
                        <div>
                          <CardTitle className="text-xl">{result.inboxName}</CardTitle>
                          <p className="text-sm text-gray-400">{result.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.connection.status === "success" && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-500/50 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-green-400">Connected</span>
                          </div>
                        )}
                        {result.connection.status === "error" && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-red-900/30 border border-red-500/50 rounded-full">
                            <XCircle className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-red-400">Connection Failed</span>
                          </div>
                        )}
                        {result.connection.status === "not_configured" && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-900/30 border border-yellow-500/50 rounded-full">
                            <AlertCircle className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-yellow-400">Not Configured</span>
                          </div>
                        )}
                        {result.connection.status === "success" && (
                          <Button
                            onClick={() => handleSync(result.inboxId)}
                            size="sm"
                            className="bg-champagne-gold text-black hover:bg-champagne-gold/90"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sync Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Configuration Status */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Configuration</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div className={`p-2 rounded ${result.configuration.hasImapHost ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"}`}>
                          Host: {result.configuration.hasImapHost ? "✓" : "✗"} {result.configuration.imapHost || "Not set"}
                        </div>
                        <div className={`p-2 rounded ${result.configuration.hasImapUsername ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"}`}>
                          Username: {result.configuration.hasImapUsername ? "✓" : "✗"}
                        </div>
                        <div className={`p-2 rounded ${result.configuration.hasImapPassword ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"}`}>
                          Password: {result.configuration.hasImapPassword ? "✓" : "✗"}
                        </div>
                        <div className={`p-2 rounded ${result.configuration.hasImapPort ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"}`}>
                          Port: {result.configuration.imapPort || "Not set"}
                        </div>
                      </div>
                    </div>

                    {/* Connection Status */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Connection Status</h4>
                      <div className="p-3 bg-gray-900/50 rounded-lg">
                        <p className={`text-sm ${
                          result.connection.status === "success" ? "text-green-400" :
                          result.connection.status === "error" ? "text-red-400" :
                          "text-yellow-400"
                        }`}>
                          {result.connection.message}
                        </p>
                        {result.connection.error && (
                          <p className="text-xs text-red-400 mt-2 font-mono">
                            Error: {result.connection.error}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Server Stats */}
                    {result.connection.status === "success" && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                          <Server className="w-4 h-4" />
                          Mail Server Statistics
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                            <p className="text-xs text-gray-400 mb-1">Total Messages</p>
                            <p className="text-xl font-bold text-blue-400">
                              {result.serverStats.totalMessages?.toLocaleString() || "N/A"}
                            </p>
                          </div>
                          <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                            <p className="text-xs text-gray-400 mb-1">Unread</p>
                            <p className="text-xl font-bold text-yellow-400">
                              {result.serverStats.unreadMessages?.toLocaleString() || "N/A"}
                            </p>
                          </div>
                          <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                            <p className="text-xs text-gray-400 mb-1">Recent</p>
                            <p className="text-xl font-bold text-green-400">
                              {result.serverStats.recentMessages?.toLocaleString() || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Database Stats */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Database Statistics
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                          <p className="text-xs text-gray-400 mb-1">Synced Emails</p>
                          <p className="text-xl font-bold text-purple-400">
                            {result.databaseStats.totalEmails.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
                          <p className="text-xs text-gray-400 mb-1">Threads</p>
                          <p className="text-xl font-bold text-indigo-400">
                            {result.databaseStats.totalThreads.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 bg-gray-700/50 border border-gray-600 rounded-lg">
                          <p className="text-xs text-gray-400 mb-1">Last Synced</p>
                          <p className="text-sm font-bold text-gray-300">
                            {result.databaseStats.lastSyncedAt
                              ? new Date(result.databaseStats.lastSyncedAt).toLocaleString()
                              : "Never"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sync Gap Warning */}
                    {result.connection.status === "success" &&
                      result.serverStats.totalMessages !== null &&
                      result.serverStats.totalMessages > result.databaseStats.totalEmails && (
                        <div className="p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                            <h4 className="text-sm font-semibold text-yellow-400">Sync Gap Detected</h4>
                          </div>
                          <p className="text-sm text-yellow-300">
                            Server has <strong>{result.serverStats.totalMessages.toLocaleString()}</strong> messages,
                            but only <strong>{result.databaseStats.totalEmails.toLocaleString()}</strong> are synced.
                          </p>
                          <p className="text-xs text-yellow-400/70 mt-2">
                            Missing: <strong>{(result.serverStats.totalMessages - result.databaseStats.totalEmails).toLocaleString()}</strong> emails
                          </p>
                          <Button
                            onClick={() => handleSync(result.inboxId)}
                            size="sm"
                            className="mt-3 bg-yellow-600 text-white hover:bg-yellow-700"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sync Missing Emails
                          </Button>
                        </div>
                      )}

                    {/* Sync Status */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Sync Settings</h4>
                      <div className="flex gap-4 text-sm">
                        <div className={`px-3 py-1 rounded ${result.syncStatus.enabled ? "bg-green-900/30 text-green-400" : "bg-gray-700 text-gray-400"}`}>
                          Auto Sync: {result.syncStatus.enabled ? "Enabled" : "Disabled"}
                        </div>
                        <div className="px-3 py-1 rounded bg-gray-700 text-gray-300">
                          Interval: {result.syncStatus.interval} minutes
                        </div>
                        <div className={`px-3 py-1 rounded ${result.syncStatus.isActive ? "bg-green-900/30 text-green-400" : "bg-gray-700 text-gray-400"}`}>
                          Status: {result.syncStatus.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
