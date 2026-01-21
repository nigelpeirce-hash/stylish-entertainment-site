"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Settings, Plus, Trash2, Mail, Save, RefreshCw, Download, Upload, Activity, History } from "lucide-react";
import { HeartbeatGraph } from "@/components/HeartbeatGraph";
import { PasswordInput } from "@/components/PasswordInput";
import { SafetyDeleteButton } from "@/components/SafetyDeleteButton";
import { UserAvatar } from "@/components/UserAvatar";
import { getDevBypass, getDevBypassHeaders } from "@/lib/dev-bypass";
import { isSuperAdmin } from "@/lib/admin-permissions";

interface EmailInbox {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  syncEnabled: boolean;
  lastSyncedAt: string | null;
  syncInterval: number;
  assignedUsers?: string[];
  imapHost?: string;
  imapPort?: number;
  imapSecure?: boolean;
  imapUsername?: string;
  smtpHost?: string | null;
  smtpPort?: number | null;
  smtpSecure?: boolean | null;
  smtpUsername?: string | null;
}

// Admin users
const ADMIN_USERS = [
  { name: "Nigel Peirce", email: "nigel@stylishentertainment.co.uk" },
  { name: "Ali Peirce", email: "ali@stylishent.co.uk" },
];

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inboxes, setInboxes] = useState<EmailInbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingInboxId, setTestingInboxId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, { status: "success" | "error" | "testing" | null; message: string; latency?: number }>>({});
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, { imap: boolean; smtp: boolean }>>({});
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  
  // Helper function to get routing label
  const getRoutingLabel = (inbox: EmailInbox): string => {
    if (!inbox.assignedUsers || inbox.assignedUsers.length === 0) {
      return "Shared";
    }
    if (inbox.assignedUsers.length === 1) {
      const user = ADMIN_USERS.find(u => u.email === inbox.assignedUsers![0]);
      return user ? user.name.split(" ")[0] : "Custom";
    }
    return "Shared";
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    imapHost: "",
    imapPort: 993,
    imapSecure: true,
    imapUsername: "",
    imapPassword: "",
    smtpHost: "",
    smtpPort: 587,
    smtpSecure: true,
    smtpUsername: "",
    smtpPassword: "",
    syncEnabled: true,
    syncInterval: 5,
  });

  useEffect(() => {
    // Check for dev bypass first (development only)
    const devBypass = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
      sessionStorage.getItem("dev_admin_bypass") === "true";

    if (devBypass) {
      // Dev bypass active, allow access
      return;
    }

    // Don't redirect while session is loading
    if (status !== "authenticated" && status !== "unauthenticated") {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const userRole = (session?.user as any)?.role;
      const userEmail = session?.user?.email;
      
      if (userRole !== "admin") {
        router.push("/client/dashboard");
      } else if (!isSuperAdmin(userEmail)) {
        // Not SuperAdmin - redirect to dashboard
        router.push("/admin");
      }
    }
  }, [status, session, router]);

  useEffect(() => {
    // Check for dev bypass
    const devBypass = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
      sessionStorage.getItem("dev_admin_bypass") === "true";

    if ((status === "authenticated" && (session?.user as any)?.role === "admin") || devBypass) {
      fetchInboxes();
    }
  }, [status, session]);

  const fetchInboxes = async () => {
    try {
      const headers = { ...getDevBypassHeaders(), "Content-Type": "application/json" };
      const response = await fetch("/api/admin/inboxes", { headers });
      if (response.ok) {
        const data = await response.json();
        setInboxes(data.inboxes || []);
      } else {
        // Try to get error message, but don't fail if response isn't JSON
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Response isn't JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        console.error("Error fetching inboxes:", errorMessage);
        // Still set empty array to show the empty state
        setInboxes([]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching inboxes:", errorMessage);
      // Set empty array on error so user sees the empty state
      setInboxes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Only send password if it's been changed (not empty when editing)
      const dataToSend = { ...formData };
      if (editingId) {
        // If editing and password is empty, don't send it (keep existing)
        if (!dataToSend.imapPassword) {
          delete (dataToSend as any).imapPassword;
        }
        if (!dataToSend.smtpPassword) {
          delete (dataToSend as any).smtpPassword;
        }
      }

      if (editingId) {
        // Update existing
        const headers = { ...getDevBypassHeaders(), "Content-Type": "application/json" };
        const response = await fetch(`/api/admin/inboxes/${editingId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
          await fetchInboxes();
          setEditingId(null);
          resetForm();
        } else {
          alert("Failed to update inbox");
        }
      } else {
        // Create new
        const headers = { ...getDevBypassHeaders(), "Content-Type": "application/json" };
        const response = await fetch("/api/admin/inboxes", {
          method: "POST",
          headers,
          body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
          await fetchInboxes();
          setIsAdding(false);
          resetForm();
        } else {
          const error = await response.json();
          alert(error.error || "Failed to create inbox");
        }
      }
    } catch (error) {
      console.error("Error saving inbox:", error);
      alert("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inbox?")) return;

    try {
      const headers = getDevBypassHeaders();
      const response = await fetch(`/api/admin/inboxes/${id}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        await fetchInboxes();
      } else {
        alert("Failed to delete inbox");
      }
    } catch (error) {
      console.error("Error deleting inbox:", error);
      alert("An error occurred");
    }
  };

  const updateInboxAssignedUsers = async (inboxId: string, assignedUsers: string[]) => {
    try {
      const headers = { ...getDevBypassHeaders(), "Content-Type": "application/json" };
      const response = await fetch(`/api/admin/inboxes/${inboxId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ assignedUsers }),
      });

      if (response.ok) {
        await fetchInboxes();
      } else {
        alert("Failed to update user permissions");
      }
    } catch (error) {
      console.error("Error updating assigned users:", error);
      alert("An error occurred");
    }
  };

  const handleEdit = (inbox: EmailInbox) => {
    if (!inbox) return;
    
    setFormData({
      name: inbox?.name || "",
      email: inbox?.email || "",
      imapHost: inbox?.imapHost || "",
      imapPort: inbox?.imapPort || 993,
      imapSecure: inbox?.imapSecure ?? true,
      imapUsername: inbox?.imapUsername || "",
      imapPassword: "", // Never populate password fields for security
      smtpHost: inbox?.smtpHost || "",
      smtpPort: inbox?.smtpPort || 587,
      smtpSecure: inbox?.smtpSecure ?? true,
      smtpUsername: inbox?.smtpUsername || "",
      smtpPassword: "", // Never populate password fields for security
      syncEnabled: inbox?.syncEnabled ?? true,
      syncInterval: inbox?.syncInterval || 5,
    });
    setEditingId(inbox?.id || null);
    setIsAdding(true);
    // Set masked passwords to show they exist
    if (inbox?.id) {
      setRevealedPasswords(prev => ({
        ...prev,
        [inbox.id]: { imap: false, smtp: false }
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      imapHost: "",
      imapPort: 993,
      imapSecure: true,
      imapUsername: "",
      imapPassword: "",
      smtpHost: "",
      smtpPort: 587,
      smtpSecure: true,
      smtpUsername: "",
      smtpPassword: "",
      syncEnabled: true,
      syncInterval: 5,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSync = async (inboxId: string, deepSync: boolean = false) => {
    try {
      if (deepSync && !confirm(
        "Deep Sync will fetch 6 months of email history from all folders (INBOX, Sent, Archive). This may take several minutes. Continue?"
      )) {
        return;
      }

      // Clear any previous errors for this inbox
      setApiErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[inboxId];
        return newErrors;
      });

      const headers = { ...getDevBypassHeaders(), "Content-Type": "application/json" };
      const response = await fetch("/api/admin/email/sync", {
        method: "POST",
        headers,
        body: JSON.stringify({ inboxId, deepSync }),
      });

      // Handle 500 errors gracefully
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        setApiErrors(prev => ({
          ...prev,
          [inboxId]: errorData.error || `Sync failed with status ${response.status}`
        }));
        alert(errorData.error || "Failed to sync. Please check the console for details.");
        return;
      }

      const result = await response.json();
      if (result.success) {
        alert(
          deepSync
            ? `Deep sync completed: ${result.count || 0} emails synced (6 months of history from all folders)`
            : `Synced ${result.count || 0} emails`
        );
        await fetchInboxes();
      } else {
        setApiErrors(prev => ({
          ...prev,
          [inboxId]: result.error || "Failed to sync"
        }));
        alert(result.error || "Failed to sync");
      }
    } catch (error: any) {
      console.error("Error syncing:", error);
      setApiErrors(prev => ({
        ...prev,
        [inboxId]: error?.message || "An error occurred while syncing"
      }));
      alert("An error occurred while syncing. Please check the console for details.");
    }
  };

  const handleTestConnection = async (inboxId: string) => {
    try {
      setTestingInboxId(inboxId);
      setConnectionStatus(prev => ({ ...prev, [inboxId]: { status: "testing", message: "Testing connection..." } }));
      
      // Clear any previous errors for this inbox
      setApiErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[inboxId];
        return newErrors;
      });
      
      const headers = { ...getDevBypassHeaders(), "Content-Type": "application/json" };
      const response = await fetch("/api/admin/inboxes/test-connection", {
        method: "POST",
        headers,
        body: JSON.stringify({ inboxId }),
      });

      // Handle 500 errors gracefully
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = errorData.error || errorData.message || `Connection test failed with status ${response.status}`;
        setConnectionStatus(prev => ({ 
          ...prev, 
          [inboxId]: { 
            status: "error", 
            message: errorMessage
          } 
        }));
        setApiErrors(prev => ({
          ...prev,
          [inboxId]: errorMessage
        }));
        return;
      }

      const result = await response.json();

      if (result.success) {
        setConnectionStatus(prev => ({ 
          ...prev, 
          [inboxId]: { 
            status: "success", 
            message: result.message || "Connection successful!",
            latency: result.latency?.total || undefined,
          } 
        }));
        // Clear status after 5 seconds
        setTimeout(() => {
          setConnectionStatus(prev => {
            const newStatus = { ...prev };
            delete newStatus[inboxId];
            return newStatus;
          });
        }, 5000);
      } else {
        const errorMessage = result.error || result.message || "Connection failed. Check your IMAP settings.";
        setConnectionStatus(prev => ({ 
          ...prev, 
          [inboxId]: { 
            status: "error", 
            message: errorMessage
          } 
        }));
        setApiErrors(prev => ({
          ...prev,
          [inboxId]: errorMessage
        }));
      }
    } catch (error: any) {
      console.error("Error testing connection:", error);
      const errorMessage = error?.message || "An error occurred while testing the connection";
      setConnectionStatus(prev => ({ 
        ...prev, 
        [inboxId]: { 
          status: "error", 
          message: errorMessage
        } 
      }));
      setApiErrors(prev => ({
        ...prev,
        [inboxId]: errorMessage
      }));
    } finally {
      setTestingInboxId(null);
    }
  };

  if ((status !== "authenticated" && status !== "unauthenticated") || loading) {
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
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Email Inbox Settings</h1>
          <p className="text-gray-400">Configure your email inboxes for CRM</p>
        </motion.div>

        {/* Server Blade Rack View */}
        <div className="space-y-3 mb-8">
          {inboxes.length === 0 ? (
            <Card className="bg-slate-900/80 border-2 border-slate-700/50">
              <CardContent className="p-6 text-center">
                <Mail className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No email inboxes configured yet.</p>
                <Button
                  onClick={() => setIsAdding(true)}
                  className="bg-champagne-gold text-black hover:bg-gold-light"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Inbox
                </Button>
              </CardContent>
            </Card>
          ) : (
            inboxes.map((inbox, index) => {
            if (!inbox || !inbox.id) {
              return null; // Skip invalid inboxes
            }
            const status = connectionStatus[inbox.id];
            const isConnected = status?.status === "success";
            const stability: "high" | "medium" | "low" | "offline" = 
              isConnected && status?.latency 
                ? status.latency < 100 ? "high" : status.latency < 500 ? "medium" : "low"
                : "offline";
            
            return (
              <motion.div
                key={inbox.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Server Blade */}
                <Card className="bg-slate-900/80 border-2 border-slate-700/50 hover:border-slate-600/80 transition-all shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-6">
                      {/* Left: Blade Info & Status */}
                      <div className="flex-1 flex items-center gap-6">
                        {/* Heartbeat Graph with Routing Badge */}
                        <div className="flex-shrink-0 flex flex-col items-center gap-2">
                          <HeartbeatGraph 
                            isActive={inbox?.isActive && inbox?.syncEnabled}
                            stability={stability}
                          />
                          <span className="px-2 py-0.5 bg-slate-700/50 text-slate-300 text-[10px] rounded border border-slate-600/50 font-medium whitespace-nowrap">
                            Routed to: {inbox ? getRoutingLabel(inbox) : "Unknown"}
                          </span>
                        </div>

                        {/* Inbox Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Mail className="w-5 h-5 text-champagne-gold flex-shrink-0" />
                            <h3 className="text-xl font-semibold text-white truncate">{inbox?.name || "Unnamed Inbox"}</h3>
                            <span className="text-sm text-gray-400 truncate">({inbox?.email || "No email"})</span>
                            {inbox?.isActive && (
                              <span className="px-2 py-1 bg-green-900/40 text-green-400 text-xs rounded border border-green-500/50 font-semibold">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          
                          {/* Permissions Section */}
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs text-gray-400 font-medium">Permissions:</span>
                            <div className="flex items-center gap-2">
                              {ADMIN_USERS.map((user) => {
                                const isSelected = inbox?.assignedUsers?.includes(user.email) ?? false;
                                return (
                                  <UserAvatar
                                    key={user.email}
                                    name={user.name}
                                    email={user.email}
                                    isSelected={isSelected}
                                    onClick={() => {
                                      if (!inbox?.id) return;
                                      const currentUsers = inbox?.assignedUsers || [];
                                      const newUsers = isSelected
                                        ? currentUsers.filter(e => e !== user.email)
                                        : [...currentUsers, user.email];
                                      
                                      // Update via API
                                      updateInboxAssignedUsers(inbox.id, newUsers);
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>

                          {/* Connection Stats */}
                          <div className="flex items-center gap-6 text-xs">
                            {status?.latency && (
                              <div className="flex items-center gap-2">
                                <Activity className="w-3 h-3 text-blue-400" />
                                <span className="text-gray-300 font-mono">
                                  Latency: <span className="text-blue-400 font-bold">{status.latency}ms</span>
                                </span>
                              </div>
                            )}
                            <div className="text-gray-400">
                              Sync: <span className="text-gray-300 font-semibold">{inbox.syncInterval}m</span>
                            </div>
                            {inbox.lastSyncedAt ? (
                              <div className="text-gray-400">
                                Last: <span className="text-gray-300">
                                  {(() => {
                                    try {
                                      const date = new Date(inbox.lastSyncedAt);
                                      if (isNaN(date.getTime())) return "Invalid date";
                                      return date.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
                                    } catch {
                                      return "Invalid date";
                                    }
                                  })()}
                                </span>
                              </div>
                            ) : (
                              <span className="text-yellow-400">Never synced</span>
                            )}
                          </div>

                          {/* Configuration Status */}
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <div className={`flex items-center gap-1 ${
                              inbox?.imapHost && inbox?.imapUsername ? "text-green-400" : "text-red-400"
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                inbox?.imapHost && inbox?.imapUsername ? "bg-green-500" : "bg-red-500"
                              }`} />
                              <span>IMAP</span>
                            </div>
                            <div className={`flex items-center gap-1 ${
                              inbox?.smtpHost && inbox?.smtpUsername ? "text-green-400" : "text-gray-500"
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                inbox?.smtpHost && inbox?.smtpUsername ? "bg-green-500" : "bg-gray-500"
                              }`} />
                              <span>SMTP</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex-shrink-0">
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <Button
                            onClick={() => inbox?.id && handleSync(inbox.id, false)}
                            size="sm"
                            variant="outline"
                            className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sync
                          </Button>
                          <Button
                            onClick={() => inbox?.id && handleSync(inbox.id, true)}
                            size="sm"
                            variant="outline"
                            className="border-purple-500/50 text-purple-400 hover:bg-purple-900/20"
                            title="Deep Sync: Fetch 6 months of history from all folders"
                          >
                            <History className="w-4 h-4 mr-2" />
                            Deep Sync
                          </Button>
                          <Button
                            onClick={() => inbox?.id && handleTestConnection(inbox.id)}
                            size="sm"
                            variant="outline"
                            className={`border-blue-500/50 text-blue-400 hover:bg-blue-900/20 ${
                              status?.status === "success" ? "border-green-500/50 text-green-400" :
                              status?.status === "error" ? "border-red-500/50 text-red-400" : ""
                            }`}
                            disabled={testingInboxId === inbox?.id || !inbox?.imapHost || !inbox?.imapUsername}
                          >
                            <RefreshCw className={`w-4 h-4 mr-2 ${testingInboxId === inbox?.id ? "animate-spin" : ""}`} />
                            {testingInboxId === inbox?.id
                              ? "Testing..."
                              : status?.status === "success" 
                              ? "✓"
                              : status?.status === "error"
                              ? "✗"
                              : "Test"}
                          </Button>
                          <div className="col-span-2">
                            <SafetyDeleteButton
                              onDelete={() => inbox?.id && handleDelete(inbox.id)}
                              itemName={`Inbox: ${inbox?.name || "Unknown"}`}
                              itemDetails={`Email: ${inbox?.email || "No email"}`}
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => inbox && handleEdit(inbox)}
                          size="sm"
                          variant="outline"
                          className="border-gray-600/50 text-gray-300 hover:bg-gray-800 mt-2 w-full"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                      </div>
                    </div>

                    {/* Connection Status Message */}
                    {status && (
                      <div className={`mt-3 p-2 rounded text-xs border ${
                        status.status === "success" 
                          ? "bg-green-900/20 text-green-400 border-green-500/30"
                          : status.status === "error"
                          ? "bg-red-900/20 text-red-400 border-red-500/30"
                          : "bg-blue-900/20 text-blue-400 border-blue-500/30"
                      }`}>
                        {status.status === "testing" && "⏳ "}
                        {status.status === "success" && "✅ "}
                        {status.status === "error" && "❌ "}
                        {status.message}
                      </div>
                    )}
                    
                    {/* API Error Message */}
                    {apiErrors[inbox?.id || ""] && (
                      <div className="mt-3 p-2 rounded text-xs border bg-red-900/20 text-red-400 border-red-500/30">
                        ⚠️ {apiErrors[inbox.id]}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
            })
          )}
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle>
                  {editingId ? "Edit Inbox" : "Add New Email Inbox"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Inbox Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Main Inbox"
                      className="bg-gray-900 text-white border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="info@stylishentertainment.co.uk"
                      className="bg-gray-900 text-white border-gray-700"
                    />
                  </div>
                </div>

                {/* Incoming (IMAP) Section */}
                <div className="border-t border-gray-700 pt-6">
                  <div className="mb-4 pb-3 border-b border-gray-700/50">
                    <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-400" />
                      Incoming (IMAP)
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">Email receiving configuration</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>IMAP Host</Label>
                      <Input
                        value={formData.imapHost || ""}
                        onChange={(e) => setFormData({ ...formData, imapHost: e.target.value })}
                        placeholder="imap.gmail.com or mail.example.com"
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IMAP Port</Label>
                      <Input
                        type="number"
                        value={formData.imapPort || 993}
                        onChange={(e) => setFormData({ ...formData, imapPort: parseInt(e.target.value) || 993 })}
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IMAP Username</Label>
                      <Input
                        value={formData.imapUsername || ""}
                        onChange={(e) => setFormData({ ...formData, imapUsername: e.target.value })}
                        placeholder="Your email or username"
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IMAP Password</Label>
                      <PasswordInput
                        value={formData.imapPassword}
                        onChange={(value) => setFormData({ ...formData, imapPassword: value })}
                        placeholder={editingId ? "Leave blank to keep current password" : "App password or email password"}
                        className="bg-gray-900 text-white border-gray-700"
                        id="imapPassword"
                        maskedValue={editingId ? "••••••••" : undefined}
                      />
                    </div>
                    <div className="flex items-center space-x-2 md:col-span-2">
                      <Checkbox
                        id="imapSecure"
                        checked={formData.imapSecure}
                        onCheckedChange={(checked) => setFormData({ ...formData, imapSecure: checked as boolean })}
                      />
                      <Label htmlFor="imapSecure" className="text-sm">Use SSL/TLS (recommended)</Label>
                    </div>
                  </div>
                </div>

                {/* Outgoing (SMTP) Section */}
                <div className="border-t border-gray-700 pt-6">
                  <div className="mb-4 pb-3 border-b border-gray-700/50">
                    <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Mail className="w-5 h-5 text-green-400" />
                      Outgoing (SMTP)
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">Email sending configuration</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SMTP Host</Label>
                      <Input
                        value={formData.smtpHost || ""}
                        onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                        placeholder="smtp.gmail.com or smtp.example.com"
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Port</Label>
                      <Input
                        type="number"
                        value={formData.smtpPort || 587}
                        onChange={(e) => setFormData({ ...formData, smtpPort: parseInt(e.target.value) || 587 })}
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Username</Label>
                      <Input
                        value={formData.smtpUsername || ""}
                        onChange={(e) => setFormData({ ...formData, smtpUsername: e.target.value })}
                        placeholder="Your email or username"
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Password</Label>
                      <PasswordInput
                        value={formData.smtpPassword}
                        onChange={(value) => setFormData({ ...formData, smtpPassword: value })}
                        placeholder={editingId ? "Leave blank to keep current password" : "App password or email password"}
                        className="bg-gray-900 text-white border-gray-700"
                        id="smtpPassword"
                        maskedValue={editingId ? "••••••••" : undefined}
                      />
                    </div>
                    <div className="flex items-center space-x-2 md:col-span-2">
                      <Checkbox
                        id="smtpSecure"
                        checked={formData.smtpSecure}
                        onCheckedChange={(checked) => setFormData({ ...formData, smtpSecure: checked as boolean })}
                      />
                      <Label htmlFor="smtpSecure" className="text-sm">Use SSL/TLS (recommended)</Label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sync Interval (minutes)</Label>
                      <Input
                        type="number"
                        value={formData.syncInterval || 5}
                        onChange={(e) => setFormData({ ...formData, syncInterval: parseInt(e.target.value) || 5 })}
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id="syncEnabled"
                        checked={formData.syncEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, syncEnabled: checked as boolean })}
                      />
                      <Label htmlFor="syncEnabled">Enable Auto Sync</Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? "Update Inbox" : "Add Inbox"}
                  </Button>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-champagne-gold text-black hover:bg-gold-light"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Inbox
          </Button>
        )}

        {/* Calendar Import/Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-champagne-gold" />
                Calendar (iCal) Import/Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold mb-2">Export Bookings to iCal</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Export all your bookings to an iCal file that can be imported into Apple Calendar, Google Calendar, or any calendar app.
                </p>
                <Button
                  onClick={async () => {
                    try {
                      const response = await fetch("/api/admin/calendar/export");
                      if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `bookings-${new Date().toISOString().split("T")[0]}.ics`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        alert("Calendar exported successfully!");
                      } else {
                        alert("Failed to export calendar");
                      }
                    } catch (error) {
                      console.error("Error exporting calendar:", error);
                      alert("An error occurred");
                    }
                  }}
                  className="bg-champagne-gold text-black hover:bg-gold-light"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All Bookings to iCal
                </Button>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-lg font-semibold mb-2">Import iCal from URL</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Import events from an external calendar (e.g., Apple iCloud, Google Calendar) by providing a public iCal URL.
                </p>
                <div className="space-y-3">
                  <Input
                    id="icalUrl"
                    type="url"
                    placeholder="https://calendar.google.com/calendar/ical/..."
                    className="bg-gray-900 text-white border-gray-700"
                  />
                  <Button
                    onClick={async () => {
                      const urlInput = document.getElementById("icalUrl") as HTMLInputElement;
                      const url = urlInput?.value;
                      if (!url) {
                        alert("Please enter an iCal URL");
                        return;
                      }

                      try {
                        const response = await fetch("/api/admin/calendar/import", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ url }),
                        });

                        const result = await response.json();
                        if (response.ok) {
                          alert(`Imported ${result.events?.length || 0} events from calendar`);
                          urlInput.value = "";
                        } else {
                          alert(result.error || "Failed to import calendar");
                        }
                      } catch (error) {
                        console.error("Error importing calendar:", error);
                        alert("An error occurred");
                      }
                    }}
                    variant="outline"
                    className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import from URL
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-lg font-semibold mb-2">Import iCal from File</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Upload an .ics file from your computer to import events.
                </p>
                <div className="space-y-3">
                  <Input
                    id="icalFile"
                    type="file"
                    accept=".ics"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = async (event) => {
                        const fileContent = event.target?.result as string;
                        try {
                          const response = await fetch("/api/admin/calendar/import", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ fileContent }),
                          });

                          const result = await response.json();
                          if (response.ok) {
                            alert(`Imported ${result.events?.length || 0} events from file`);
                            e.target.value = "";
                          } else {
                            alert(result.error || "Failed to import calendar");
                          }
                        } catch (error) {
                          console.error("Error importing calendar:", error);
                          alert("An error occurred");
                        }
                      };
                      reader.readAsText(file);
                    }}
                    className="bg-gray-900 text-white border-gray-700"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
