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
import { Settings, Plus, Trash2, Mail, Save, RefreshCw, Download, Upload } from "lucide-react";

interface EmailInbox {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  syncEnabled: boolean;
  lastSyncedAt: string | null;
  syncInterval: number;
  imapHost?: string;
  imapPort?: number;
  imapSecure?: boolean;
  imapUsername?: string;
  smtpHost?: string | null;
  smtpPort?: number | null;
  smtpSecure?: boolean | null;
  smtpUsername?: string | null;
}

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inboxes, setInboxes] = useState<EmailInbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingInboxId, setTestingInboxId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchInboxes();
    }
  }, [status, session]);

  const fetchInboxes = async () => {
    try {
      const response = await fetch("/api/admin/inboxes");
      if (response.ok) {
        const data = await response.json();
        setInboxes(data.inboxes || []);
      }
    } catch (error) {
      console.error("Error fetching inboxes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        // Update existing
        const response = await fetch(`/api/admin/inboxes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
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
        const response = await fetch("/api/admin/inboxes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
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
      const response = await fetch(`/api/admin/inboxes/${id}`, {
        method: "DELETE",
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

  const handleEdit = (inbox: EmailInbox) => {
    setFormData({
      name: inbox.name,
      email: inbox.email,
      imapHost: inbox.imapHost || "",
      imapPort: inbox.imapPort || 993,
      imapSecure: inbox.imapSecure ?? true,
      imapUsername: inbox.imapUsername || "",
      imapPassword: "",
      smtpHost: inbox.smtpHost || "",
      smtpPort: inbox.smtpPort || 587,
      smtpSecure: inbox.smtpSecure ?? true,
      smtpUsername: inbox.smtpUsername || "",
      smtpPassword: "",
      syncEnabled: inbox.syncEnabled,
      syncInterval: inbox.syncInterval,
    });
    setEditingId(inbox.id);
    setIsAdding(true);
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

  const handleSync = async (inboxId: string) => {
    try {
      const response = await fetch("/api/admin/email/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inboxId }),
      });

      const result = await response.json();
      if (result.success) {
        alert(`Synced ${result.count || 0} emails`);
        await fetchInboxes();
      } else {
        alert(result.error || "Failed to sync");
      }
    } catch (error) {
      console.error("Error syncing:", error);
      alert("An error occurred");
    }
  };

  const handleTestConnection = async (inboxId: string) => {
    try {
      setTestingInboxId(inboxId);
      const response = await fetch("/api/admin/inboxes/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inboxId }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(result.message || "Connection successful.");
      } else {
        alert(
          `Connection failed: ${
            result.error || result.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      alert("An error occurred while testing the connection");
    } finally {
      setTestingInboxId(null);
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
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Email Inbox Settings</h1>
          <p className="text-gray-400">Configure your email inboxes for CRM</p>
        </motion.div>

        {/* Existing Inboxes */}
        <div className="space-y-4 mb-8">
          {inboxes.map((inbox) => (
            <Card key={inbox.id} className="bg-gray-800 border-champagne-gold/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-champagne-gold" />
                      <h3 className="text-xl font-semibold text-white">{inbox.name}</h3>
                      <span className="text-sm text-gray-400">({inbox.email})</span>
                      {inbox.isActive && (
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded border border-green-500/30">
                          Active
                        </span>
                      )}
                      {inbox.syncEnabled && (
                        <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-500/30">
                          Sync Enabled
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>Sync Interval: {inbox.syncInterval} minutes</p>
                      {inbox.lastSyncedAt && (
                        <p>Last Synced: {new Date(inbox.lastSyncedAt).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSync(inbox.id)}
                      size="sm"
                      variant="outline"
                      className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Now
                    </Button>
                    <Button
                      onClick={() => handleTestConnection(inbox.id)}
                      size="sm"
                      variant="outline"
                      className="border-blue-500 text-blue-400 hover:bg-blue-900/20"
                      disabled={testingInboxId === inbox.id}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {testingInboxId === inbox.id
                        ? "Testing..."
                        : "Test Connection"}
                    </Button>
                    <Button
                      onClick={() => handleEdit(inbox)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(inbox.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-lg font-semibold mb-4">IMAP Settings (Receiving)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>IMAP Host</Label>
                      <Input
                        value={formData.imapHost}
                        onChange={(e) => setFormData({ ...formData, imapHost: e.target.value })}
                        placeholder="imap.gmail.com or mail.example.com"
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IMAP Port</Label>
                      <Input
                        type="number"
                        value={formData.imapPort}
                        onChange={(e) => setFormData({ ...formData, imapPort: parseInt(e.target.value) || 993 })}
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IMAP Username</Label>
                      <Input
                        value={formData.imapUsername}
                        onChange={(e) => setFormData({ ...formData, imapUsername: e.target.value })}
                        placeholder="Your email or username"
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IMAP Password</Label>
                      <Input
                        type="password"
                        value={formData.imapPassword}
                        onChange={(e) => setFormData({ ...formData, imapPassword: e.target.value })}
                        placeholder="App password or email password"
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="imapSecure"
                        checked={formData.imapSecure}
                        onCheckedChange={(checked) => setFormData({ ...formData, imapSecure: checked as boolean })}
                      />
                      <Label htmlFor="imapSecure">Use SSL/TLS</Label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-lg font-semibold mb-4">SMTP Settings (Sending)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SMTP Host</Label>
                      <Input
                        value={formData.smtpHost}
                        onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                        placeholder="smtp.gmail.com or smtp.example.com"
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Port</Label>
                      <Input
                        type="number"
                        value={formData.smtpPort}
                        onChange={(e) => setFormData({ ...formData, smtpPort: parseInt(e.target.value) || 587 })}
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Username</Label>
                      <Input
                        value={formData.smtpUsername}
                        onChange={(e) => setFormData({ ...formData, smtpUsername: e.target.value })}
                        placeholder="Your email or username"
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP Password</Label>
                      <Input
                        type="password"
                        value={formData.smtpPassword}
                        onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                        placeholder="App password or email password"
                        className="bg-gray-900 text-white border-gray-700"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="smtpSecure"
                        checked={formData.smtpSecure}
                        onCheckedChange={(checked) => setFormData({ ...formData, smtpSecure: checked as boolean })}
                      />
                      <Label htmlFor="smtpSecure">Use SSL/TLS</Label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sync Interval (minutes)</Label>
                      <Input
                        type="number"
                        value={formData.syncInterval}
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
