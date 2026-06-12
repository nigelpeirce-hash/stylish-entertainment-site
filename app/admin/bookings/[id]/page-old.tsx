"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "@/lib/motion";
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Music,
  PoundSterling,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Sparkles,
  Settings,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Radio,
  Lightbulb,
  Mic,
  X,
  Send,
  Receipt,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { ArtistDispatch } from "@/components/ArtistDispatch";
import { SendResources } from "@/components/SendResources";
import { QuickStaffConfirm } from "@/components/QuickStaffConfirm";
import { AddBasicStaff } from "@/components/AddBasicStaff";
import { DJInquiryReply } from "@/components/DJInquiryReply";
import { FlexibleOperatorSidebar } from "@/components/FlexibleOperatorSidebar";
import { WhatsAppThread } from "@/components/WhatsAppThread";
import { toDisplayFee, toSafeReactChild } from "@/lib/transformers/booking-transformer";

interface Booking {
  id: string;
  name: string;
  email: string;
  phoneAreaCode: string | null;
  phoneNumber: string | null;
  eventType: string;
  eventDate: string;
  venueName: string;
  venueAddress: string | null;
  venueTown: string | null;
  venuePostcode: string | null;
  numberOfGuests: number | null;
  services: string[];
  upsellItems: string[];
  preferredDJ: string | null;
  message: string | null;
  budget: string | null;
  status: string;
  contactPreference: string | null;
  djArrivalTime?: string | null;
  djStartTime?: string | null;
  djFinishTime?: string | null;
  djSetupLocation?: string | null;
  djParking?: string | null;
  soundLimiter?: boolean | null;
  firstDance?: string | null;
  lastSong?: string | null;
  musicDislikes?: string | null;
  musicRequests?: string | null;
  musicNotesToDJ?: string | null;
  musicFileUrl?: string | null;
  venueContact?: string | null;
  venueAddress2?: string | null;
  venueCounty?: string | null;
  venuePhoneAreaCode?: string | null;
  venuePhoneNumber?: string | null;
  assignedDJEmail?: string | null;
  assignedDJName?: string | null;
  reviewComplete?: boolean;
  dispatchedAt?: string | null;
  dispatchedBy?: string | null;
  bookingReference?: string | null;
  priority?: string;
  conflictStatus?: string | null;
  assignedTo?: string | null;
  handoffStatus?: string | null;
  handoffNote?: string | null;
  adminNotes?: string | null;
  feeBreakdown?: any;
  taxInclusive?: boolean | null;
  taxRate?: number | null;
  overrideReason?: string | null;
  selectedTemplate?: string | null;
  user: { id: string; name: string; email: string } | null;
  emailThreads: Array<{
    id: string;
    subject: string;
    fromEmail: string;
    lastMessageAt: string;
    isRead: boolean;
  }>;
  staffAssignments?: Array<{
    id: string;
    role: string;
    agreedFee: number;
    status: string;
    confirmationEmailSent: boolean;
    staff: {
      id: string;
      name: string;
      email: string | null;
    };
  }>;
}

export default function BookingDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [sendingAction, setSendingAction] = useState<string | null>(null);
  const [showTechNoteBox, setShowTechNoteBox] = useState(false);
  const [techNote, setTechNote] = useState("");
  // Handoff names
  const [wifeName, setWifeName] = useState("Sarah");
  const [yourName, setYourName] = useState("Nigel");

  useEffect(() => {
    // Auto-enable dev bypass on localhost (development only)
    const isLocalhost = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" || 
       window.location.hostname === "127.0.0.1" ||
       window.location.hostname.startsWith("192.168.") ||
       window.location.hostname.startsWith("10."));

    if (isLocalhost) {
      // Automatically set bypass flag for localhost
      sessionStorage.setItem("dev_admin_bypass", "true");
      sessionStorage.setItem("dev_admin_role", "admin");
      sessionStorage.setItem("dev_admin_name", "Local Admin");
      // Allow access immediately
      if (bookingId) {
        fetchBooking();
      }
      return;
    }

    // Check for existing dev bypass (for production dev environments)
    const devBypass = typeof window !== "undefined" && 
      sessionStorage.getItem("dev_admin_bypass") === "true";

    if (devBypass) {
      // Dev bypass active, allow access
      if (bookingId) {
        fetchBooking();
      }
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login/");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard/");
    }
  }, [status, session, router, bookingId]);

  useEffect(() => {
    const devBypass = typeof window !== "undefined" && 
      sessionStorage.getItem("dev_admin_bypass") === "true";
    
    const isLocalhost = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" || 
       window.location.hostname === "127.0.0.1" ||
       window.location.hostname.startsWith("192.168.") ||
       window.location.hostname.startsWith("10."));

    if ((status === "authenticated" && (session?.user as any)?.role === "admin") || devBypass || isLocalhost) {
      if (bookingId) {
        fetchBooking();
      }
    }
  }, [status, session, bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true); // Show loading state when refreshing
      const response = await fetch(`/api/admin/bookings/${bookingId}/?t=${Date.now()}`, {
        cache: 'no-store', // Prevent caching to ensure fresh data
      });
      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "locked":
        return "text-green-400 bg-green-900/30 border-green-500/50";
      case "pending":
        return "text-yellow-400 bg-yellow-900/30 border-yellow-500/50";
      case "completed":
        return "text-blue-400 bg-blue-900/30 border-blue-500/50";
      case "cancelled":
        return "text-red-400 bg-red-900/30 border-red-500/50";
      default:
        return "text-gray-400 bg-gray-900/30 border-gray-500/50";
    }
  };

  // Format date for hero section
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get Google Maps URL for venue
  const getGoogleMapsUrl = () => {
    if (!booking) return "";
    const parts = [];
    if (booking.venueName) parts.push(booking.venueName);
    if (booking.venueAddress) parts.push(booking.venueAddress);
    if (booking.venueTown) parts.push(booking.venueTown);
    if (booking.venuePostcode) parts.push(booking.venuePostcode);
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(", "))}`;
  };

  // Get phone number for call link
  const getPhoneNumber = () => {
    if (!booking) return "";
    const areaCode = booking.phoneAreaCode || "";
    const number = booking.phoneNumber || "";
    return `${areaCode}${number}`.replace(/\s/g, "");
  };

  // Get service icons
  const getServiceIcons = () => {
    if (!booking) return [];
    const icons = [];
    if (booking.services?.includes("DJs")) {
      icons.push({ icon: Radio, label: "DJ", color: "text-champagne-gold" });
    }
    if (booking.services?.includes("Lighting Design")) {
      icons.push({ icon: Lightbulb, label: "Lighting", color: "text-yellow-400" });
    }
    if (booking.services?.includes("Musicians")) {
      icons.push({ icon: Mic, label: "Musician", color: "text-blue-400" });
    }
    return icons;
  };

  // Handle quick actions
  const handleQuickAction = async (action: "brochure" | "quote" | "cancel") => {
    if (!booking) return;

    setSendingAction(action);

    try {
      if (action === "brochure") {
        const response = await fetch("/api/admin/send-resource/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: booking.id,
            clientEmail: booking.email,
            clientName: booking.name,
            venueName: booking.venueName,
            sendBrochure: true,
          }),
        });
        if (!response.ok) throw new Error("Failed to send brochure");
        alert("Brochure sent successfully!");
      } else if (action === "quote") {
        // Navigate to email templates with quote category or create quote
        window.location.href = `/admin/email-templates/?bookingId=${booking.id}&category=quote`;
      } else if (action === "cancel") {
        const confirmed = window.confirm(`Are you sure you want to mark "${booking.name}" booking as cancelled?`);
        if (!confirmed) return;
        const response = await fetch(`/api/admin/bookings/${booking.id}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "cancelled" }),
        });
        if (!response.ok) throw new Error("Failed to cancel booking");
        await fetchBooking();
        alert("Booking marked as cancelled");
      }
    } catch (error: any) {
      alert(error.message || `Failed to ${action}`);
    } finally {
      setSendingAction(null);
    }
  };

  // Handle date change
  const handleDateChange = async (newDate: string) => {
    if (!booking) return;
    
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventDate: newDate }),
      });
      if (!response.ok) throw new Error("Failed to update date");
      await fetchBooking();
      alert("Date updated successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to update date");
    }
  };

  // Handle handoff assignment
  const handleHandoff = async (action: "assign" | "tech_alert" | "tech_done", assignTo?: string) => {
    if (!booking) return;

    try {
      let updateData: any = {};

      if (action === "assign" && assignTo) {
        updateData.assignedTo = assignTo;
        updateData.handoffStatus = assignTo === "wife" ? "action_needed" : "tech_review";
      } else if (action === "tech_alert") {
        updateData.assignedTo = "you";
        updateData.handoffStatus = "tech_alert";
        updateData.handoffNote = techNote;
        setShowTechNoteBox(false);
        setTechNote("");
      } else if (action === "tech_done") {
        updateData.assignedTo = "wife";
        updateData.handoffStatus = "awaiting_quote";
        updateData.isTechReady = true;
      }

      const response = await fetch(`/api/admin/bookings/${booking.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update handoff");
      await fetchBooking();
    } catch (error: any) {
      alert(error.message || "Failed to update handoff");
    }
  };

  // Check if notes should be collapsible (more than 3 lines)
  const shouldCollapseNotes = booking?.message && booking.message.split("\n").length > 3;

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Check for dev bypass
  const devBypass = typeof window !== "undefined" && 
    sessionStorage.getItem("dev_admin_bypass") === "true";
  
  const isLocalhost = typeof window !== "undefined" && 
    (process.env.NODE_ENV === "development" || 
     window.location.hostname === "localhost" || 
     window.location.hostname === "127.0.0.1" ||
     window.location.hostname.startsWith("192.168.") ||
     window.location.hostname.startsWith("10."));

  const isAdmin = session && (session?.user as any)?.role === "admin";
  const hasAccess = isAdmin || devBypass || isLocalhost;

  // Show loading while checking access or fetching booking
  if (loading && !hasAccess && !isLocalhost && !devBypass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Deny access if not admin and no bypass
  if (!hasAccess) {
    return null;
  }

  // Show loading while booking is being fetched
  if (!booking && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading booking...</div>
      </div>
    );
  }

  // If booking not found after loading, show error
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Booking not found</div>
      </div>
    );
  }

  const serviceIcons = getServiceIcons();
  const phoneNumber = getPhoneNumber();
  const googleMapsUrl = getGoogleMapsUrl();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sticky Hero Section */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-champagne-gold/30 shadow-lg">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Back Button */}
            <Link href="/admin/bookings/">
              <Button variant="outline" size="sm" className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>

            {/* Main Hero Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl md:text-4xl font-bold font-serif text-white mb-2 break-words">
                    {booking.name} - {formatEventDate(booking.eventDate)}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-lg text-gray-300">
                      <MapPin className="w-5 h-5 text-champagne-gold" />
                      <span className="font-medium">{booking.venueName}</span>
                      {booking.venuePostcode && (
                        <span className="text-gray-400">({booking.venuePostcode})</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Badge & Service Icons */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-4 py-2 rounded-lg text-base font-semibold border-2 whitespace-nowrap ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                  {serviceIcons.length > 0 && (
                    <div className="flex items-center gap-2">
                      {serviceIcons.map(({ icon: Icon, label, color }, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-gray-800 rounded border border-gray-700">
                          <Icon className={`w-4 h-4 ${color}`} />
                          <span className="text-xs text-gray-300">{label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto mt-4 md:mt-0">
              <Button
                onClick={() => handleQuickAction("brochure")}
                disabled={sendingAction !== null}
                size="sm"
                className="bg-champagne-gold text-black hover:bg-champagne-gold/90 disabled:opacity-50"
              >
                {sendingAction === "brochure" ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Send Brochure
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleQuickAction("quote")}
                disabled={sendingAction !== null}
                size="sm"
                variant="outline"
                className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
              >
                <Receipt className="w-4 h-4 mr-2" />
                Send Quote
              </Button>
              <Button
                onClick={() => handleQuickAction("cancel")}
                disabled={sendingAction !== null || booking.status.toLowerCase() === "cancelled"}
                size="sm"
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-900/20 disabled:opacity-50"
              >
                {sendingAction === "cancel" ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Mark as Cancelled
                  </>
                )}
              </Button>
              <Button
                onClick={() => setIsSidebarOpen(true)}
                variant="outline"
                size="sm"
                className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                Flexible Operator
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* No-Scroll: 5 Key Fields at Top */}
          <Card className="bg-gray-800 border-champagne-gold/30 sticky top-20 z-20">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1 uppercase">Client Name</p>
                <p className="text-white font-bold text-lg">{booking.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1 uppercase">Date</p>
                <p className="text-white font-semibold">
                  {formatEventDate(booking.eventDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1 uppercase">Venue</p>
                <p className="text-white font-semibold">
                  {booking.venueAddress || booking.venueName}
                  {booking.venuePostcode && `, ${booking.venuePostcode}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1 uppercase">Total Fee</p>
                <p className="text-white font-semibold">
                  {(() => {
                    const v = (booking as any).finalBalance;
                    if (v == null || v === "") return "Not set";
                    if (typeof v === "object" && "fee" in v) return `£${(v as { fee?: unknown }).fee ?? "—"}`;
                    if (typeof v === "object" && "amount" in v) return `£${(v as { amount?: unknown }).amount ?? "—"}`;
                    return `£${v}`;
                  })()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1 uppercase">DJ Assigned</p>
                <p className="text-white font-semibold">
                  {booking.assignedDJName || "Not assigned"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reciprocal Hand-off Section */}
          <Card className="bg-gray-800 border-champagne-gold/30 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-champagne-gold" />
                Hand-off Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* For Wife Button */}
                <Button
                  onClick={() => handleHandoff("assign", "wife")}
                  className={`h-16 text-lg font-semibold ${
                    booking.assignedTo === "wife"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 border border-blue-500/50"
                  }`}
                  size="lg"
                >
                  🙋‍♀️ For {wifeName}
                </Button>

                {/* For You Button */}
                <Button
                  onClick={() => handleHandoff("assign", "you")}
                  className={`h-16 text-lg font-semibold ${
                    booking.assignedTo === "you"
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 border border-purple-500/50"
                  }`}
                  size="lg"
                >
                  🛠️ For {yourName}
                </Button>
              </div>

              {/* Status Badge */}
              {booking.assignedTo && (
                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Current Status:</p>
                  <p className="text-white font-semibold">
                    {booking.assignedTo === "wife" && booking.handoffStatus === "action_needed"
                      ? "She is working on this"
                      : booking.assignedTo === "wife" && booking.handoffStatus === "awaiting_quote"
                      ? "She is sending quote"
                      : booking.assignedTo === "you" && booking.handoffStatus === "tech_review"
                      ? "He is reviewing tech"
                      : booking.assignedTo === "you" && booking.handoffStatus === "tech_alert"
                      ? "Tech alert - needs review"
                      : "Status unknown"}
                  </p>
                  {booking.handoffNote && (
                    <div className="mt-2 p-2 bg-amber-900/20 border border-amber-500/30 rounded">
                      <p className="text-xs text-amber-300 font-medium mb-1">Technical Note:</p>
                      <p className="text-sm text-amber-200">{booking.handoffNote}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Technical Alert Button (for wife) */}
              {booking.assignedTo === "wife" && (
                <div className="space-y-2">
                  {!showTechNoteBox ? (
                    <Button
                      onClick={() => setShowTechNoteBox(true)}
                      className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white text-lg font-semibold"
                      size="lg"
                    >
                      ⚠️ Too Technical - Send to {yourName}
                    </Button>
                  ) : (
                    <Card className="bg-amber-900/20 border-amber-500/50">
                      <CardContent className="p-4 space-y-3">
                        <label className="block text-sm font-medium text-amber-300">
                          Quick Message (e.g., "Client wants 4 moving heads—can we do this?")
                        </label>
                        <textarea
                          value={techNote}
                          onChange={(e) => setTechNote(e.target.value)}
                          placeholder="Type your message here..."
                          className="w-full min-h-[80px] bg-gray-900 border border-gray-700 text-white rounded p-2 text-sm"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleHandoff("tech_alert")}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            Send Alert & Notify
                          </Button>
                          <Button
                            onClick={() => {
                              setShowTechNoteBox(false);
                              setTechNote("");
                            }}
                            variant="outline"
                            className="border-gray-600 text-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Tech Done Button (for you) */}
              {booking.assignedTo === "you" && (
                <Button
                  onClick={() => handleHandoff("tech_done")}
                  className="w-full h-14 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold"
                  size="lg"
                >
                  ✅ Tech Done - Send to {wifeName} for Quote
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Safe Actions: Big Buttons or Conflict Warning */}
          {booking.conflictStatus === "pending" ? (
            <Card className="bg-red-900/30 border-red-500 border-4">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-3xl font-bold text-red-400 mb-2">
                  DUPLICATE DETECTED
                </h2>
                <p className="text-xl text-red-300 mb-4">
                  ASK NIGEL
                </p>
                <p className="text-gray-300">
                  This booking may be a duplicate. Please consult before making any changes.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Send Reply Button (Green) */}
              <Button
                onClick={() => {
                  window.location.href = `/admin/email-templates/?bookingId=${booking.id}`;
                }}
                className="h-20 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold"
                size="lg"
              >
                <Mail className="w-6 h-6 mr-3" />
                Send Reply
              </Button>

              {/* Change Date Button (Yellow) */}
              <Button
                onClick={() => {
                  const newDate = prompt("Enter new date (YYYY-MM-DD):");
                  if (newDate) {
                    handleDateChange(newDate);
                  }
                }}
                className="h-20 bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-semibold"
                size="lg"
              >
                <Calendar className="w-6 h-6 mr-3" />
                Change Date
              </Button>

              {/* Client Backed Out Button (Red) */}
              <Button
                onClick={() => {
                  const confirmed = window.confirm(
                    `Are you sure ${booking.name} has backed out? This will mark the booking as cancelled.`
                  );
                  if (confirmed) {
                    handleQuickAction("cancel");
                  }
                }}
                className="h-20 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold"
                size="lg"
              >
                <X className="w-6 h-6 mr-3" />
                Client Backed Out
              </Button>
            </div>
          )}

          {/* Three-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: The Client */}
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-champagne-gold" />
                  The Client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Name</p>
                  <p className="text-white font-medium">{booking.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <a
                    href={`mailto:${booking.email}`}
                    className="text-champagne-gold hover:text-champagne-gold/80 flex items-center gap-1"
                  >
                    {booking.email}
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
                {phoneNumber && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Phone</p>
                    <a
                      href={`tel:${phoneNumber}`}
                      className="inline-flex items-center gap-2 text-champagne-gold hover:text-champagne-gold/80"
                    >
                      {booking.phoneAreaCode} {booking.phoneNumber}
                      <Button
                        size="sm"
                        className="ml-2 bg-green-600 hover:bg-green-700 text-white h-7 px-3"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `tel:${phoneNumber}`;
                        }}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                    </a>
                  </div>
                )}
                {booking.contactPreference && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Preferred Contact</p>
                    <p className="text-white">{booking.contactPreference}</p>
                  </div>
                )}
                {booking.user && (
                  <div className="pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">Linked Account</p>
                    <p className="text-sm text-gray-300">{booking.user.name}</p>
                    <p className="text-xs text-gray-400">{booking.user.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Center Column: The Logistics */}
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-champagne-gold" />
                  The Logistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Venue</p>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white font-medium flex-1">{booking.venueName}</p>
                    {googleMapsUrl && (
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-champagne-gold hover:text-champagne-gold/80 flex items-center gap-1 shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Maps
                      </a>
                    )}
                  </div>
                  {booking.venueAddress && (
                    <p className="text-gray-300 text-sm mt-1">{booking.venueAddress}</p>
                  )}
                  {(booking.venueTown || booking.venuePostcode) && (
                    <p className="text-gray-300 text-sm">
                      {booking.venueTown}
                      {booking.venueTown && booking.venuePostcode && ", "}
                      {booking.venuePostcode}
                    </p>
                  )}
                </div>

                {(booking.djArrivalTime || booking.djStartTime || booking.djFinishTime) && (
                  <div className="pt-3 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Timings</p>
                    <div className="space-y-1.5 text-sm">
                      {booking.djArrivalTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Arrival:</span>
                          <span className="text-white">{booking.djArrivalTime}</span>
                        </div>
                      )}
                      {booking.djStartTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Start:</span>
                          <span className="text-white">{booking.djStartTime}</span>
                        </div>
                      )}
                      {booking.djFinishTime && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Finish:</span>
                          <span className="text-white">{booking.djFinishTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(booking.djSetupLocation || booking.djParking || booking.soundLimiter !== null) && (
                  <div className="pt-3 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Technical Setup</p>
                    <div className="space-y-1.5 text-sm">
                      {booking.djSetupLocation && (
                        <div>
                          <span className="text-gray-400">Setup Location: </span>
                          <span className="text-white">{booking.djSetupLocation}</span>
                        </div>
                      )}
                      {booking.djParking && (
                        <div>
                          <span className="text-gray-400">Parking: </span>
                          <span className="text-white">{booking.djParking}</span>
                        </div>
                      )}
                      {booking.soundLimiter !== null && (
                        <div>
                          <span className="text-gray-400">Sound Limiter: </span>
                          <span className={`${booking.soundLimiter ? "text-red-400" : "text-green-400"}`}>
                            {booking.soundLimiter ? "Yes" : "No"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {booking.numberOfGuests && (
                  <div className="pt-3 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-1">Number of Guests</p>
                    <p className="text-white">{booking.numberOfGuests}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right Column: The Team */}
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-champagne-gold" />
                  The Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <AddBasicStaff onAdd={fetchBooking} />
                  <QuickStaffConfirm
                    bookingId={booking.id}
                    venueName={booking.venueName}
                    eventDate={booking.eventDate}
                    onConfirm={fetchBooking}
                  />
                </div>
                {booking.staffAssignments && booking.staffAssignments.length > 0 ? (
                  <div className="space-y-3">
                    {booking.staffAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="p-3 bg-gray-900/50 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-white font-semibold">{toSafeReactChild(assignment.staff?.name)}</p>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              assignment.status === "held"
                                ? "bg-blue-900/30 text-blue-400 border border-blue-500/30"
                                : assignment.status === "dispatched"
                                ? "bg-green-900/30 text-green-400 border border-green-500/30"
                                : "bg-gray-700 text-gray-300 border border-gray-600"
                            }`}
                          >
                            {assignment.status === "held" ? "Date Held" : assignment.status === "dispatched" ? "Dispatched" : assignment.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mb-1">Role: {toSafeReactChild(assignment.role)}</p>
                        <p className="text-gray-400 text-xs">
                          Fee: £{toDisplayFee(assignment.agreedFee).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {assignment.confirmationEmailSent && (
                          <p className="text-xs text-green-400 mt-1">✓ Confirmation sent</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No staff assigned yet</p>
                )}
                <div className="pt-3 border-t border-gray-700">
                  <ArtistDispatch
                    bookingId={booking.id}
                    booking={booking}
                    onUpdate={fetchBooking}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Sections */}
          {booking.message && (
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-champagne-gold" />
                    Additional Information
                  </CardTitle>
                  {shouldCollapseNotes && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                      className="text-gray-400 hover:text-white"
                    >
                      {isNotesExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Collapse
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Expand
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-gray-300 whitespace-pre-wrap ${shouldCollapseNotes && !isNotesExpanded ? "line-clamp-3" : ""}`}>
                  {booking.message}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Services & Preferences */}
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-champagne-gold" />
                Services & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Main Services</h4>
                <div className="flex flex-wrap gap-2">
                  {booking.services.map((service, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-champagne-gold/20 text-champagne-gold text-sm rounded border border-champagne-gold/30"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {booking.services.includes("DJs") && booking.preferredDJ && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Preferred DJ</h4>
                  <p className="text-white">{booking.preferredDJ}</p>
                </div>
              )}

              {booking.upsellItems && booking.upsellItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Upsell Items ({booking.upsellItems.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {booking.upsellItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-900/30 text-blue-400 text-sm rounded border border-blue-500/30"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(booking.firstDance || booking.lastSong || booking.musicDislikes || booking.musicRequests) && (
                <div className="pt-3 border-t border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Music Preferences</h4>
                  <div className="space-y-2 text-sm">
                    {booking.firstDance && (
                      <div>
                        <span className="text-gray-400">First Dance: </span>
                        <span className="text-white">{booking.firstDance}</span>
                      </div>
                    )}
                    {booking.lastSong && (
                      <div>
                        <span className="text-gray-400">Last Song: </span>
                        <span className="text-white">{booking.lastSong}</span>
                      </div>
                    )}
                    {booking.musicDislikes && (
                      <div>
                        <span className="text-gray-400">Dislikes: </span>
                        <span className="text-white">{booking.musicDislikes}</span>
                      </div>
                    )}
                    {booking.musicRequests && (
                      <div>
                        <span className="text-gray-400">Requests: </span>
                        <span className="text-white">{booking.musicRequests}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Send Resources */}
          <SendResources
            bookingId={booking.id}
            clientEmail={booking.email}
            clientName={booking.name}
            venueName={booking.venueName}
          />

          {/* DJ Inquiry Reply - Only show if booking includes DJ services */}
          {booking.services && booking.services.includes("DJs") && (
            <DJInquiryReply
              bookingId={booking.id}
              clientEmail={booking.email}
              clientName={booking.name}
              venueName={booking.venueName}
              venueAddress={booking.venueAddress || undefined}
              venuePostcode={booking.venuePostcode || undefined}
              eventDate={booking.eventDate}
              djName={booking.preferredDJ || undefined}
              onSend={fetchBooking}
            />
          )}

          {/* WhatsApp Thread */}
          {(booking.phoneNumber || booking.phoneAreaCode) && (
            <WhatsAppThread
              bookingId={booking.id}
              phoneNumber={`${booking.phoneAreaCode || ""}${booking.phoneNumber || ""}`.trim() || null}
              eventDate={booking.eventDate}
              clientName={booking.name}
            />
          )}

          {/* WhatsApp Thread */}
          {(booking.phoneNumber || booking.phoneAreaCode) && (
            <WhatsAppThread
              bookingId={booking.id}
              phoneNumber={`${booking.phoneAreaCode || ""}${booking.phoneNumber || ""}`.trim() || null}
              eventDate={booking.eventDate}
              clientName={booking.name}
            />
          )}

          {/* Email Threads */}
          {booking.emailThreads && booking.emailThreads.length > 0 && (
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-champagne-gold" />
                  Recent Email Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {booking.emailThreads.map((thread) => (
                    <Link
                      key={thread.id}
                      href={`/admin/inbox/${thread.id}/`}
                      className="block p-3 rounded bg-gray-900/50 hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{thread.subject}</p>
                          <p className="text-sm text-gray-400">{thread.fromEmail}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(thread.lastMessageAt).toLocaleDateString()}
                          </p>
                          {!thread.isRead && (
                            <span className="inline-block w-2 h-2 bg-champagne-gold rounded-full mt-1"></span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href={`/admin/inbox/?bookingId=${booking.id}`}>
                  <Button variant="outline" className="mt-4 border-champagne-gold text-champagne-gold">
                    View All Emails
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Flexible Operator Sidebar */}
      {booking && (
        <FlexibleOperatorSidebar
          booking={{
            id: booking.id,
            bookingReference: booking.bookingReference || null,
            name: booking.name,
            email: booking.email,
            eventDate: booking.eventDate,
            venueName: booking.venueName,
            venuePostcode: booking.venuePostcode || null,
            status: booking.status,
            priority: booking.priority || "medium",
            conflictStatus: booking.conflictStatus || null,
            finalBalance: (booking as any).finalBalance || null,
            services: booking.services || [],
            adminNotes: booking.adminNotes || null,
            feeBreakdown: booking.feeBreakdown || null,
            taxInclusive: booking.taxInclusive || null,
            taxRate: booking.taxRate || null,
            selectedTemplate: booking.selectedTemplate || null,
            depositReceived: (booking as any).depositReceived || null,
            depositReceivedManual: (booking as any).depositReceivedManual || null,
            finalDetailsConfirmed: (booking as any).finalDetailsConfirmed || null,
            finalDetailsConfirmedManual: (booking as any).finalDetailsConfirmedManual || null,
            djWorksheetApproved: (booking as any).djWorksheetApproved || null,
            djWorksheetApprovedManual: (booking as any).djWorksheetApprovedManual || null,
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onUpdate={fetchBooking}
        />
      )}
    </div>
  );
}
