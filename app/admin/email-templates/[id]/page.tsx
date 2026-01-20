"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Save,
  Send,
  ArrowLeft,
  FileText,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/radix-select";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText: string | null;
  category: string | null;
  isActive: boolean;
}

interface Booking {
  id: string;
  name: string;
  email: string;
  status: string;
  venueName?: string;
}

interface LockedEventData {
  isLocked: boolean;
  status: string;
  contractData: {
    date: string | null;
    formattedVenue: string;
    fee: string;
    talentType: string;
    eventTimings: string;
  };
  booking: {
    id: string;
    name: string;
    email: string;
    venueName: string;
    termsAccepted: boolean;
    termsAcceptedAt: Date | null;
  };
}

export default function EmailTemplateEditor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [lockedEventData, setLockedEventData] = useState<LockedEventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [showStatusWarning, setShowStatusWarning] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState<string>("");

  const [formData, setFormData] = useState({
    subject: "",
    bodyHtml: "",
    bodyText: "",
  });

  useEffect(() => {
    // Check for dev bypass
    const devBypass = typeof window !== "undefined" && 
      sessionStorage.getItem("dev_admin_bypass") === "true";
    
    const isLocalhost = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" || 
       window.location.hostname === "127.0.0.1");

    const isAdmin = session && (session?.user as any)?.role === "admin";
    const hasAccess = isAdmin || devBypass || isLocalhost;

    if (status === "unauthenticated" && !hasAccess) {
      router.push("/login");
    } else if (status === "authenticated" && !hasAccess) {
      router.push("/admin");
    }

    if (hasAccess && templateId) {
      fetchTemplate();
      fetchBookings();
    }
  }, [status, session, router, templateId]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/email-templates/${templateId}`);
      if (response.ok) {
        const data = await response.json();
        setTemplate(data.template);
        setFormData({
          subject: data.template.subject,
          bodyHtml: data.template.bodyHtml,
          bodyText: data.template.bodyText || "",
        });
      }
    } catch (error) {
      console.error("Error fetching template:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings?status=all");
      if (response.ok) {
        const data = await response.json();
        // Filter for confirmed/locked bookings
        const relevantBookings = (data.bookings || []).filter(
          (b: Booking) => b.status === "confirmed" || b.status === "locked" || b.status === "pending"
        );
        setBookings(relevantBookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchLockedData = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/locked-event-data`);
      if (response.ok) {
        const data = await response.json();
        setLockedEventData(data);
        setRecipientEmail(data.booking.email);
        // Generate preview after state is set
        setTimeout(() => {
          generatePreview(data);
        }, 100);
      }
    } catch (error) {
      console.error("Error fetching locked event data:", error);
      alert("Failed to fetch event data");
    }
  };

  const generatePreview = async (eventData: LockedEventData) => {
    try {
      const response = await fetch(`/api/admin/email-templates/${templateId}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: eventData.booking.id,
          templateHtml: formData.bodyHtml,
          templateSubject: formData.subject,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewHtml(data.previewHtml);
      }
    } catch (error) {
      console.error("Error generating preview:", error);
    }
  };

  const handleBookingSelect = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    if (bookingId) {
      fetchLockedData(bookingId);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/email-templates/${templateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: formData.subject,
          bodyHtml: formData.bodyHtml,
          bodyText: formData.bodyText,
        }),
      });

      if (response.ok) {
        await fetchTemplate();
        alert("Template saved successfully");
      } else {
        alert("Failed to save template");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      alert("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    if (!selectedBookingId || !recipientEmail) {
      alert("Please select a booking and recipient email");
      return;
    }

    if (!lockedEventData) {
      alert("Please load event data first");
      return;
    }

    // Validate event status
    if (!lockedEventData.isLocked) {
      const confirmed = confirm(
        `Event status is "${lockedEventData.status}" (not "Locked" or "Confirmed"). ` +
        `This email may contain preliminary data. Proceed anyway?`
      );
      if (!confirmed) {
        return;
      }
    }

    try {
      setSending(true);
      const response = await fetch(`/api/admin/email-templates/${templateId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBookingId,
          recipientEmail,
          overrideSubject: formData.subject,
          overrideHtml: formData.bodyHtml,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.requiresConfirmation) {
          const confirmed = confirm(data.warning + "\n\nProceed anyway?");
          if (confirmed) {
            // Retry with force flag
            await handleSendWithForce();
          }
        } else {
          alert("Email sent successfully!");
        }
      } else {
        const error = await response.json();
        alert(error.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred");
    } finally {
      setSending(false);
    }
  };

  const handleSendWithForce = async () => {
    // Force send even if status is not locked
    // This would require updating the API to accept a force flag
    // For now, just show a message
    alert("Please confirm the send in the API");
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    // Could show a toast notification here
  };

  if (status !== "authenticated" && status !== "unauthenticated" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Template not found</div>
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
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin/email-templates">
              <Button
                variant="outline"
                size="sm"
                className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold mb-2">Email Template Editor</h1>
              <p className="text-gray-400">{template.name}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Booking Selection */}
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-champagne-gold" />
                  Select Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Booking</Label>
                  <Select value={selectedBookingId} onValueChange={handleBookingSelect}>
                    <SelectTrigger className="bg-gray-900 text-white border-gray-600">
                      <SelectValue placeholder="Select a booking to load locked data" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookings.map((booking) => (
                        <SelectItem key={booking.id} value={booking.id}>
                          {booking.name} - {booking.status} - {booking.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {lockedEventData && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border ${
                        lockedEventData.isLocked
                          ? "bg-green-900/20 border-green-500/50"
                          : "bg-yellow-900/20 border-yellow-500/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {lockedEventData.isLocked ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        )}
                        <span className="font-semibold">
                          {lockedEventData.isLocked ? "Event Locked" : `Event Status: ${lockedEventData.status}`}
                        </span>
                      </div>
                      {!lockedEventData.isLocked && (
                        <p className="text-xs text-yellow-300 mt-2">
                          ⚠️ Event is not locked/confirmed. Data may be preliminary.
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}

                {lockedEventData && (
                  <div className="space-y-2">
                    <Label>Recipient Email</Label>
                    <Input
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="bg-gray-900 text-white border-gray-600"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Template Editor */}
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-champagne-gold" />
                  Template Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Email subject with {{variables}}"
                    className="bg-gray-900 text-white border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Body HTML</Label>
                  <Textarea
                    value={formData.bodyHtml}
                    onChange={(e) => {
                      const newBodyHtml = e.target.value;
                      setFormData({ ...formData, bodyHtml: newBodyHtml });
                      // Regenerate preview if locked data is available
                      if (lockedEventData) {
                        setTimeout(() => {
                          generatePreview(lockedEventData);
                        }, 300);
                      }
                    }}
                    rows={20}
                    placeholder="Enter your email template HTML here. Use variables like {{clientName}}, {{eventDate}}, etc."
                    className="bg-gray-900 text-white border-gray-600 font-mono text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    variant="outline"
                    className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Template
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleSend}
                    disabled={sending || !selectedBookingId || !lockedEventData}
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Email
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar (1 column) - Locked Variables */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-champagne-gold/30 sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Lock className="w-4 h-4 text-champagne-gold" />
                  Contract Data Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-gray-400 mb-4">
                  These values are pulled directly from the signed contract and cannot be changed here.
                </p>

                {lockedEventData ? (
                  <div className="space-y-4">
                    {/* Contract Data Section */}
                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                        Locked Contract Data
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-gray-500">Event Date</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 bg-gray-900 px-2 py-1 rounded text-xs text-champagne-gold">
                              {"{{contractDate}}"}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToken("{{contractDate}}")}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {lockedEventData.contractData.date || "Not set"}
                          </p>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500">Formatted Venue</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 bg-gray-900 px-2 py-1 rounded text-xs text-champagne-gold">
                              {"{{formattedVenue}}"}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToken("{{formattedVenue}}")}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {lockedEventData.contractData.formattedVenue || "Not set"}
                          </p>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500">Contract Fee</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 bg-gray-900 px-2 py-1 rounded text-xs text-champagne-gold">
                              {"{{contractFee}}"}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToken("{{contractFee}}")}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {lockedEventData.contractData.fee || "Not set"}
                          </p>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500">Talent Type</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 bg-gray-900 px-2 py-1 rounded text-xs text-champagne-gold">
                              {"{{talentType}}"}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToken("{{talentType}}")}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {lockedEventData.contractData.talentType || "Not set"}
                          </p>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-500">Event Timings</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="flex-1 bg-gray-900 px-2 py-1 rounded text-xs text-champagne-gold">
                              {"{{eventTimings}}"}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToken("{{eventTimings}}")}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {lockedEventData.contractData.eventTimings || "Not set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* T&C Link Section */}
                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                        Terms & Conditions
                      </h4>
                      <div>
                        <Label className="text-xs text-gray-500">T&C Link (Conditional)</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 bg-gray-900 px-2 py-1 rounded text-xs text-champagne-gold">
                            {"{{tc_link}}"}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToken("{{tc_link}}")}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {lockedEventData.booking.termsAccepted
                            ? `✅ Terms accepted on ${new Date(lockedEventData.booking.termsAcceptedAt!).toLocaleDateString("en-GB")}`
                            : "❌ Terms not accepted - link will be empty"}
                        </p>
                      </div>
                    </div>

                    {/* Standard Variables */}
                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                        Standard Variables
                      </h4>
                      <div className="space-y-2">
                        {[
                          { token: "{{clientName}}", value: lockedEventData.booking.name },
                          { token: "{{clientEmail}}", value: lockedEventData.booking.email },
                          { token: "{{eventDate}}", value: lockedEventData.contractData.date },
                          { token: "{{venueName}}", value: lockedEventData.booking.venueName || "Not set" },
                          { token: "{{djFee}}", value: lockedEventData.contractData.fee },
                          { token: "{{djName}}", value: lockedEventData.contractData.talentType },
                        ].map(({ token, value }) => (
                          <div key={token}>
                            <div className="flex items-center gap-2">
                              <code className="flex-1 bg-gray-900 px-2 py-1 rounded text-xs text-champagne-gold">
                                {token}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToken(token)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {value || "Not set"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Select a booking to load contract data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
