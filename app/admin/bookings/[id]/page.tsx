"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Music,
  Clock,
  Settings,
  Edit,
  X,
  Send,
  Download,
  ChevronDown,
  ExternalLink,
  Radio,
  Lightbulb,
  Mic,
  BookOpen,
  FileText,
  MoreVertical,
  Trash2,
  DollarSign,
  Package,
} from "lucide-react";
import Link from "next/link";
import { ArtistDispatch } from "@/components/ArtistDispatch";
import { SendResources } from "@/components/SendResources";
import { QuickStaffConfirm } from "@/components/QuickStaffConfirm";
import { AddBasicStaff } from "@/components/AddBasicStaff";
import { DJInquiryReply } from "@/components/DJInquiryReply";
import { EmailCompositionCenter } from "@/components/EmailCompositionCenter";
import { FlexibleOperatorSidebar } from "@/components/FlexibleOperatorSidebar";
// import { WhatsAppThread } from "@/components/WhatsAppThread"; // TEMPORARILY HIDDEN
import { CrewAssignments } from "@/components/CrewAssignments";
import { SafetyDeleteButton } from "@/components/SafetyDeleteButton";
import { TeamAssignment } from "@/components/admin/TeamAssignment";
import { TechnicalEquipment } from "@/components/admin/TechnicalEquipment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deduplicateName, getDisplayName } from "@/lib/utils/name-helpers";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  name: string;
  email: string;
  phoneAreaCode: string | null;
  phoneNumber: string | null;
  eventType: string;
  eventDate: string;
  ceremonyTime?: string | null;
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
  bookingReference: string | null;
  priority: string;
  conflictStatus: string | null;
  assignedTo?: string | null;
  handoffStatus?: string | null;
  handoffNote?: string | null;
  finalBalance: string | null;
  adminNotes?: string | null;
  feeBreakdown?: Array<{
    id: string;
    description: string;
    amount: number;
  }> | null;
  taxInclusive?: boolean | null;
  taxRate?: number | null;
  selectedTemplate?: string | null;
  depositReceived?: boolean | null;
  depositReceivedManual?: boolean | null;
  updatedAt?: string;
  lastEmailSentAt?: string | null;
  finalDetailsConfirmed?: boolean | null;
  finalDetailsConfirmedManual?: boolean | null;
  djWorksheetApproved?: boolean | null;
  djWorksheetApprovedManual?: boolean | null;
  /** Matches API include; Prisma returns `User` */
  User?: { id: string; name: string; email: string } | null;
  /** Many-to-many via BookingStaffAssignment; always default to [] when undefined. */
  staffAssignments?: Array<{
    id: string;
    role: string;
    agreedFee: number;
    status: string;
    confirmationEmailSent: boolean;
    confirmationSentAt?: Date | null;
    staff: {
      id: string;
      name: string;
      email: string | null;
      phone?: string | null;
      roles?: string[];
    };
  }>;
  bookingItems?: Array<{
    id: string;
    quantity: number;
    status: string;
    HireItem: { id: string; name: string; price: number; category: string | null };
  }>;
  warehouseItems?: Array<{
    id: string;
    quantity: number;
    WarehouseItem: {
      id: string;
      name: string;
      category: string;
      weight: number | null;
      size: string | null;
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
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sendingAction, setSendingAction] = useState<string | null>(null);
  const [showTechNoteBox, setShowTechNoteBox] = useState(false);
  const [techNote, setTechNote] = useState("");
  const [wifeName, setWifeName] = useState("Ali");
  const [yourName, setYourName] = useState("Nigel");
  const [deleting, setDeleting] = useState(false);
  const [sendingPortalLink, setSendingPortalLink] = useState(false);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [sendingDepositEmail, setSendingDepositEmail] = useState(false);
  const [sendingFinalizeInvite, setSendingFinalizeInvite] = useState(false);
  const [venues, setVenues] = useState<{ id: string; venueName: string; defaultCeremonyTime?: string | null; defaultFinishTime?: string | null; venueNotes?: string | null }[]>([]);
  const { toast, toastState } = useToast();

  useEffect(() => {
    const isLocalhost = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" || 
       window.location.hostname === "127.0.0.1" ||
       window.location.hostname.startsWith("192.168.") ||
       window.location.hostname.startsWith("10."));

    if (isLocalhost) {
      sessionStorage.setItem("dev_admin_bypass", "true");
      sessionStorage.setItem("dev_admin_role", "admin");
      sessionStorage.setItem("dev_admin_name", "Local Admin");
      if (bookingId) {
        fetchBooking();
      }
      return;
    }

    const devBypass = typeof window !== "undefined" && 
      sessionStorage.getItem("dev_admin_bypass") === "true";

    if (devBypass) {
      if (bookingId) {
        fetchBooking();
      }
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, bookingId]);

  useEffect(() => {
    if (!showEditModal) return;
    fetch("/api/admin/venues")
      .then((r) => r.json())
      .then((d) => setVenues(d.venues || []))
      .catch(() => setVenues([]));
  }, [showEditModal]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      // Use a more aggressive cache-busting approach
      const timestamp = Date.now();
      const response = await fetch(`/api/admin/bookings/${bookingId}?t=${timestamp}&_=${Math.random()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Log to debug staff assignments
        console.log("Fetched booking data:", {
          id: data.booking?.id,
          staffAssignmentsCount: data.booking?.staffAssignments?.length || 0,
          staffAssignments: data.booking?.staffAssignments,
          fallback: data.fallback,
        });
        setBooking(data.booking);
        setIsFallbackMode(data.fallback === true);
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getGoogleMapsUrl = () => {
    if (!booking) return "";
    const parts = [];
    if (booking.venueName) parts.push(booking.venueName);
    if (booking.venueAddress) parts.push(booking.venueAddress);
    if (booking.venueTown) parts.push(booking.venueTown);
    if (booking.venuePostcode) parts.push(booking.venuePostcode);
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(", "))}`;
  };

  const getPhoneNumber = () => {
    if (!booking) return "";
    const areaCode = booking.phoneAreaCode || "";
    const number = booking.phoneNumber || "";
    return `${areaCode}${number}`.replace(/\s/g, "");
  };

  const handleHandoff = async (assignTo: "ali" | "husband") => {
    if (!booking) return;
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}/handoff`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assign",
          assignedTo: assignTo === "ali" ? "ali" : "husband",
          handoffStatus: assignTo === "ali" ? "action_needed" : "tech_review",
          assignedBy: assignTo === "ali" ? "Nigel" : undefined, // Track who assigned for notifications
        }),
      });
      if (!response.ok) throw new Error("Failed to update handoff");
      await fetchBooking();
    } catch (error: any) {
      alert(error.message || "Failed to update handoff");
    }
  };

  const handleSendResource = async (resourceType: "brochure" | "quote" | "other") => {
    if (!booking) return;
    setSendingAction(resourceType);
    try {
      if (resourceType === "brochure") {
        const response = await fetch("/api/admin/send-resource", {
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
      } else if (resourceType === "quote") {
        window.location.href = `/admin/email-templates?bookingId=${booking.id}&category=quote`;
      }
    } catch (error: any) {
      alert(error.message || `Failed to send ${resourceType}`);
    } finally {
      setSendingAction(null);
    }
  };

  const handleDelete = async () => {
    if (!booking) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete booking");
      }
      alert("Booking permanently deleted");
      router.push("/admin/bookings");
    } catch (error: any) {
      alert(error.message || "Failed to delete booking");
    } finally {
      setDeleting(false);
    }
  };

  // Get section background color based on assignedTo
  const getSectionBgColor = () => {
    if (!booking) return "";
    return booking.assignedTo === "ali" || booking.assignedTo === "wife" 
      ? "bg-blue-900/20 border-blue-500/30" 
      : booking.assignedTo === "husband" 
      ? "bg-purple-900/20 border-purple-500/30" 
      : "";
  };

  // Check if DJ service is selected
  const hasDJService = booking?.services?.includes("DJs") || false;

  if ((status !== "authenticated" && status !== "unauthenticated") || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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

  if (!hasAccess) {
    return null;
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Booking not found</div>
      </div>
    );
  }

  const staffAssignments = booking.staffAssignments ?? [];

  const phoneNumber = getPhoneNumber();
  const googleMapsUrl = getGoogleMapsUrl();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Safe Mode Warning Banner */}
      {isFallbackMode && (
        <div className="sticky top-0 z-[60] bg-amber-600/90 backdrop-blur-sm border-b-2 border-amber-500 shadow-lg">
          <div className="container mx-auto max-w-[1920px] px-6 py-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1 text-center">
                <p className="text-white font-semibold text-sm">
                  Safe Mode Active: Limited data loaded due to database sync issues
                </p>
                <p className="text-white/80 text-xs mt-1">
                  Staff assignments and other relation data will appear once the database push succeeds
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Sticky Header */}
      <div className={`sticky ${isFallbackMode ? 'top-[72px]' : 'top-0'} z-50 bg-gray-900/95 backdrop-blur-sm border-b-2 border-champagne-gold/30 shadow-lg`}>
        <div className="container mx-auto max-w-[1920px] px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back Button */}
            <Link href="/admin/bookings">
              <Button variant="outline" size="sm" className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>

            {/* Center: Name, Date, Venue */}
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">
                  {deduplicateName(getDisplayName(booking.name) || booking.name)}
                </h1>
                {booking.eventType && (
                  <span className="border border-amber-500/30 text-amber-500 text-xs uppercase tracking-widest px-2 py-1 rounded">
                    {booking.eventType}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-white/70 text-lg">
                    {formatEventDate(booking.eventDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-700/50 px-4">
                  <span className="text-lg">📍</span>
                  <span className="font-semibold text-gray-300">{booking.venueName || "TBD"}</span>
                  {booking.venuePostcode && (
                    <span className="font-bold text-amber-500 ml-2">{booking.venuePostcode}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Send Portal Link, Internal Brief & Hand-off Buttons */}
            <div className="flex items-center gap-2">
              {/* Master Internal Brief Button */}
              <Button
                onClick={() => {
                  router.push(`/admin/bookings/${booking.id}/brief`);
                }}
                variant="outline"
                size="sm"
                className="border-amber-500 text-amber-500 hover:bg-amber-500/10 font-semibold"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Master Brief
              </Button>
              <Button
                onClick={async () => {
                  if (!booking) return;
                  setSendingPortalLink(true);
                  try {
                    const response = await fetch(`/api/admin/bookings/${booking.id}/send-portal-link`, {
                      method: "POST",
                    });
                    const data = await response.json();
                    if (response.ok) {
                      toast({
                        title: "Portal link sent",
                        description: "The portal access link has been sent to the client.",
                      });
                    } else {
                      toast({
                        title: "Error",
                        description: data.error || "Failed to send portal link",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to send portal link",
                      variant: "destructive",
                    });
                  } finally {
                    setSendingPortalLink(false);
                  }
                }}
                disabled={sendingPortalLink || !booking?.email}
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                {sendingPortalLink ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Portal Access
                  </>
                )}
              </Button>
              <Button
                onClick={async () => {
                  if (!booking) return;
                  setSendingTestEmail(true);
                  try {
                    const response = await fetch(`/api/admin/bookings/${booking.id}/send-test-email`, {
                      method: "POST",
                    });
                    const data = await response.json();
                    if (response.ok) {
                      toast({
                        title: "Test email sent",
                        description: data.message || "Deposit confirmation preview sent to Nigel for visual check.",
                      });
                    } else {
                      toast({
                        title: "Error",
                        description: data.error || "Failed to send test email",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to send test email",
                      variant: "destructive",
                    });
                  } finally {
                    setSendingTestEmail(false);
                  }
                }}
                disabled={sendingTestEmail}
                size="sm"
                variant="outline"
                className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
              >
                {sendingTestEmail ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Test Email
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleHandoff("ali")}
                variant={booking.assignedTo === "ali" || booking.assignedTo === "wife" ? "default" : "outline"}
                size="sm"
                className={booking.assignedTo === "ali" || booking.assignedTo === "wife" 
                  ? "bg-blue-500 hover:bg-blue-600 text-white" 
                  : "border-blue-500 text-blue-400 hover:bg-blue-900/20"
                }
              >
                🙋‍♀️ {wifeName}
              </Button>
              <Button
                onClick={() => handleHandoff("husband")}
                variant={booking.assignedTo === "husband" ? "default" : "outline"}
                size="sm"
                className={booking.assignedTo === "husband" 
                  ? "bg-purple-500 hover:bg-purple-600 text-white" 
                  : "border-purple-500 text-purple-400 hover:bg-purple-900/20"
                }
              >
                🛠️ {yourName}
              </Button>
              <Button
                onClick={() => setIsSidebarOpen(true)}
                variant="outline"
                size="sm"
                className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            {staffAssignments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 border-t border-gray-800 pt-2">
                {staffAssignments.map((assignment) => (
                  <span key={assignment.id} className="text-xs font-bold text-champagne-gold">
                    {assignment.role?.toLowerCase().includes('dj') ? '🎧' : '💡'} {assignment.staff.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* 3-Column Layout */}
      <div className="container mx-auto max-w-[1920px] px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: WhatsApp Conversation (The Inbox) - TEMPORARILY HIDDEN */}
          {/* <div className="lg:col-span-4">
            <div className="sticky top-24">
              {(booking.phoneNumber || booking.phoneAreaCode) ? (
                <WhatsAppThread
                  bookingId={booking.id}
                  phoneNumber={phoneNumber || null}
                  eventDate={booking.eventDate}
                  clientName={booking.name}
                />
              ) : (
                <Card className="bg-gray-800 border-champagne-gold/30">
                  <CardContent className="p-8 text-center text-gray-400">
                    <Phone className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-white">No phone number available</p>
                    <p className="text-sm mt-2 text-gray-400">WhatsApp conversation will appear here</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div> */}

          {/* Middle Column: The Logistics */}
          <div className="lg:col-span-6 space-y-4">
            {/* Client Details */}
            <Card className={`bg-gray-800 border-champagne-gold/30 ${getSectionBgColor()} transition-colors`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white">Client Details</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEditModal(true)}
                    className="text-gray-400 hover:text-champagne-gold"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Name</p>
                  <p className="text-white font-medium">{deduplicateName(getDisplayName(booking.name) || booking.name)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  <a
                    href={`mailto:${booking.email}`}
                    className="text-champagne-gold hover:text-champagne-gold/80 flex items-center gap-2"
                  >
                    {booking.email}
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
                {phoneNumber && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Phone</p>
                    <a
                      href={`tel:${phoneNumber}`}
                      className="text-champagne-gold hover:text-champagne-gold/80 flex items-center gap-2"
                    >
                      {phoneNumber}
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                )}
                {booking.contactPreference && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Preferred Contact</p>
                    <p className="text-white">{booking.contactPreference}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timings (booking guaranteed; data from API) */}
            <Card className={`bg-gray-800 border-champagne-gold/30 ${getSectionBgColor()} transition-colors`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-champagne-gold" />
                  Timings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Ceremony Start */}
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="ceremonyTime" className="text-gray-400 text-sm shrink-0">Ceremony Start:</label>
                  <input
                    id="ceremonyTime"
                    type="datetime-local"
                    defaultValue={booking.ceremonyTime ? new Date(booking.ceremonyTime).toISOString().slice(0, 16) : ""}
                    onChange={async (e) => {
                      const value = e.target.value;
                      try {
                        const response = await fetch(`/api/admin/bookings/${booking.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            ceremonyTime: value ? new Date(value).toISOString() : null,
                          }),
                        });
                        if (response.ok) {
                          fetchBooking();
                          toast({
                            title: "Updated",
                            description: "Ceremony start updated",
                          });
                        }
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to update ceremony start",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="flex-1 min-w-0 px-3 py-1.5 bg-gray-900 border border-amber-500/50 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                {/* Ceremony / DJ Finish */}
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="djFinishTime" className="text-gray-400 text-sm shrink-0">Ceremony / DJ Finish:</label>
                  <input
                    id="djFinishTime"
                    type="time"
                    defaultValue={booking.djFinishTime || ""}
                    onChange={async (e) => {
                      const value = e.target.value || null;
                      try {
                        const response = await fetch(`/api/admin/bookings/${booking.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ djFinishTime: value }),
                        });
                        if (response.ok) {
                          fetchBooking();
                          toast({
                            title: "Updated",
                            description: "Finish time updated",
                          });
                        }
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to update finish time",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="flex-1 min-w-0 px-3 py-1.5 bg-gray-900 border border-amber-500/50 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                
                {booking.djArrivalTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Arrival:</span>
                    <span className="text-white font-medium">{booking.djArrivalTime}</span>
                  </div>
                )}
                {booking.djStartTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Start:</span>
                    <span className="text-white font-medium">{booking.djStartTime}</span>
                  </div>
                )}
                {booking.djFinishTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Finish:</span>
                    <span className="text-white font-medium">{booking.djFinishTime}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Venue Info (booking guaranteed; data from API) */}
            <Card className={`bg-gray-800 border-champagne-gold/30 ${getSectionBgColor()} transition-colors`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-champagne-gold" />
                  Venue Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Venue Name</p>
                  <input
                    key={`venue-${String(booking.venueName)}-${String(booking.updatedAt ?? "")}`}
                    type="text"
                    defaultValue={booking.venueName}
                    onBlur={async (e) => {
                      const value = e.target.value.trim();
                      if (value === booking.venueName) return;
                      try {
                        const response = await fetch(`/api/admin/bookings/${booking.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ venueName: value }),
                        });
                        if (response.ok) {
                          fetchBooking();
                          toast({
                            title: "Updated",
                            description: "Venue name updated",
                          });
                        }
                      } catch (error) {
                        toast({
                          title: "Error",
                          description: "Failed to update venue name",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-900 border border-amber-500/50 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                {booking.venueAddress && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Address</p>
                    <p className="text-gray-300">{booking.venueAddress}</p>
                  </div>
                )}
                {(booking.venueTown || booking.venuePostcode) && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Location</p>
                    <p className="text-gray-300">
                      {booking.venueTown}
                      {booking.venueTown && booking.venuePostcode && ", "}
                      {booking.venuePostcode && (
                        <span className="font-bold text-champagne-gold">{booking.venuePostcode}</span>
                      )}
                    </p>
                  </div>
                )}
                {googleMapsUrl && (
                  <div className="pt-2">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-champagne-gold hover:text-champagne-gold/80 flex items-center gap-2 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in Google Maps
                    </a>
                  </div>
                )}
                {(booking.djSetupLocation || booking.djParking || booking.soundLimiter !== null) && (
                  <div className="pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">Technical Setup</p>
                    <div className="space-y-1.5 text-sm">
                      {booking.djSetupLocation && (
                        <div>
                          <span className="text-gray-400">Setup: </span>
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
                          <span className={booking.soundLimiter ? "text-red-400" : "text-green-400"}>
                            {booking.soundLimiter ? "Yes" : "No"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financials & Status Section */}
            <Card className={`bg-gray-800 border-champagne-gold/30 ${getSectionBgColor()} transition-colors`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-champagne-gold" />
                  Financials & Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Deposit Received Toggle - High Contrast */}
                <div className="flex items-center justify-between p-4 bg-gray-900/70 rounded-lg border-2 border-gray-600 hover:border-champagne-gold/50 transition-all">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      id="depositReceived"
                      checked={booking.depositReceivedManual || false}
                      onCheckedChange={async (checked) => {
                        try {
                          const response = await fetch(`/api/admin/bookings/${booking.id}/flexible-update`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              depositReceivedManual: checked,
                            }),
                          });
                          if (response.ok) {
                            await fetchBooking();
                            toast({
                              title: "Updated",
                              description: checked ? "Deposit marked as received" : "Deposit marked as pending",
                            });
                          } else {
                            throw new Error("Failed to update deposit status");
                          }
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Failed to update deposit status",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="h-6 w-6 border-2 border-champagne-gold/50 data-[state=checked]:bg-champagne-gold data-[state=checked]:border-champagne-gold"
                    />
                    <label htmlFor="depositReceived" className="text-white font-bold text-base cursor-pointer">
                      Deposit Received
                    </label>
                  </div>
                  <Badge
                    className={
                      booking.depositReceivedManual
                        ? "bg-emerald-500/30 text-emerald-400 border-2 border-emerald-500/50 font-bold"
                        : "bg-amber-500/30 text-amber-400 border-2 border-amber-500/50 font-bold"
                    }
                  >
                    {booking.depositReceivedManual ? "Paid" : "Pending"}
                  </Badge>
                </div>

                {/* Date Tracking */}
                {booking.depositReceivedManual && booking.updatedAt && (
                  <div className="text-xs text-gray-400 italic">
                    Confirmed on: {new Date(booking.updatedAt).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}

                {/* Final Balance Display (if exists) */}
                {booking.finalBalance && (
                  <div className="pt-3 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Final Balance</span>
                      <span className="text-white font-semibold text-lg">
                        £{parseFloat(booking.finalBalance).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Hire Shop — Pending Approval */}
                {booking.bookingItems && booking.bookingItems.length > 0 && (
                  <div className="pt-3 border-t border-gray-700">
                    <p className="text-amber-400 font-medium text-sm mb-2">Pending Approval</p>
                    <p className="text-gray-400 text-xs mb-2">Requested via Hire Shop (client portal)</p>
                    <ul className="space-y-1">
                      {booking.bookingItems.map((row) => (
                        <li key={row.id} className="flex justify-between text-sm">
                          <span className="text-gray-300">
                            {row.HireItem.name} × {row.quantity}
                          </span>
                          <span className="text-amber-500">
                            £{(row.HireItem.price * row.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-500 text-xs mt-2">
                      Total: £
                      {booking.bookingItems
                        .reduce((s, r) => s + r.HireItem.price * r.quantity, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Communication — priority action */}
            <Card className={`bg-gray-800 border-amber-500/20 ${getSectionBgColor()} transition-colors`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-500" />
                  Manual Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Deposit Received Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-900/70 rounded-lg border-2 border-gray-600 hover:border-amber-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      id="depositReceivedManual"
                      checked={booking.depositReceivedManual || false}
                      onCheckedChange={async (checked) => {
                        try {
                          const response = await fetch(`/api/admin/bookings/${booking.id}/flexible-update`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ depositReceivedManual: checked }),
                          });
                          if (response.ok) {
                            await fetchBooking();
                            toast({
                              title: "Updated",
                              description: checked ? "Deposit marked as received" : "Deposit marked as pending",
                            });
                          } else {
                            throw new Error("Failed to update deposit status");
                          }
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Failed to update deposit status",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="h-6 w-6 border-2 border-amber-500/50 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                    />
                    <label htmlFor="depositReceivedManual" className="text-white font-bold text-base cursor-pointer">
                      Deposit Received
                    </label>
                  </div>
                  <Badge
                    className={
                      booking.depositReceivedManual
                        ? "bg-emerald-500/30 text-emerald-400 border-2 border-emerald-500/50 font-bold"
                        : "bg-amber-500/30 text-amber-400 border-2 border-amber-500/50 font-bold"
                    }
                  >
                    {booking.depositReceivedManual ? "Paid" : "Pending"}
                  </Badge>
                </div>

                {/* Send Deposit Confirmation Email */}
                <Button
                  onClick={async () => {
                    if (!booking?.email) return;
                    setSendingDepositEmail(true);
                    try {
                      const response = await fetch(`/api/admin/bookings/${booking.id}/send-deposit-email`, {
                        method: "POST",
                      });
                      const data = await response.json();
                      if (response.ok) {
                        await fetchBooking();
                        const clientName = deduplicateName(getDisplayName(booking.name) || booking.name);
                        toast({
                          title: "Email sent",
                          description: `Email sent to ${clientName}`,
                        });
                      } else {
                        throw new Error(data?.error || "Failed to send email");
                      }
                    } catch (error: any) {
                      toast({
                        title: "Error",
                        description: error?.message || "Failed to send deposit confirmation email",
                        variant: "destructive",
                      });
                    } finally {
                      setSendingDepositEmail(false);
                    }
                  }}
                  disabled={!(booking.depositReceivedManual || false) || sendingDepositEmail || !booking?.email}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold disabled:opacity-50 disabled:pointer-events-none"
                >
                  {sendingDepositEmail ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Deposit Confirmation Email
                    </>
                  )}
                </Button>

                {booking.lastEmailSentAt && (
                  <p className="text-xs text-gray-400 italic">
                    Last Sent: {new Date(booking.lastEmailSentAt).toLocaleString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Finalize & Invite — set ACTIVE, magic link, send PORTAL_INVITATION */}
            <Card className={`bg-gray-800 border-amber-500/20 ${getSectionBgColor()} transition-colors`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-amber-500" />
                  Finalize & Invite
                </CardTitle>
                <p className="text-sm text-gray-400">
                  Set booking to active, generate magic link, and send &quot;Welcome to Your [Venue] Wedding Portal&quot; invite.
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={async () => {
                    if (!booking?.email) return;
                    setSendingFinalizeInvite(true);
                    try {
                      const res = await fetch(`/api/admin/bookings/${booking.id}/finalize-and-invite`, { method: "POST" });
                      const data = await res.json();
                      if (res.ok) {
                        await fetchBooking();
                        const clientName = deduplicateName(getDisplayName(booking.name) || booking.name);
                        toast({
                          title: "Finalized & invite sent",
                          description: `Status set to active, portal invite sent to ${clientName}`,
                        });
                      } else {
                        throw new Error(data?.error || "Failed to finalize and send invite");
                      }
                    } catch (e: any) {
                      toast({
                        title: "Error",
                        description: e?.message || "Failed to finalize and send invite",
                        variant: "destructive",
                      });
                    } finally {
                      setSendingFinalizeInvite(false);
                    }
                  }}
                  disabled={sendingFinalizeInvite || !booking?.email}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold disabled:opacity-50 disabled:pointer-events-none"
                >
                  {sendingFinalizeInvite ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Finalizing &amp; sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Finalize &amp; Send Invite
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Resources Dropdown */}
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardContent className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10">
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Resources
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-champagne-gold/30">
                    <DropdownMenuItem 
                      onSelect={() => handleSendResource("brochure")}
                      className="cursor-pointer text-white hover:bg-gray-700"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Send Brochure
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => handleSendResource("quote")}
                      className="cursor-pointer text-white hover:bg-gray-700"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Send Quote
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => {
                        // Open SendResources in Flexible Operator sidebar or modal
                        setIsSidebarOpen(true);
                      }}
                      className="cursor-pointer text-white hover:bg-gray-700"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      More Resources
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: The Artist Wing */}
          <div className="lg:col-span-6">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-4">
              {/* Artist Dispatch - Only show if DJ service */}
              {hasDJService && (
                <Card className={`bg-gray-800 border-champagne-gold/30 ${getSectionBgColor()} transition-colors`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-white">Artist Dispatch</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ArtistDispatch
                      bookingId={booking.id}
                      booking={booking}
                      onUpdate={fetchBooking}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Email Composition Center */}
              <Card className={`bg-gray-800 border-champagne-gold/30 ${getSectionBgColor()} transition-colors`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-white">Email Composition Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmailCompositionCenter
                    bookingId={booking.id}
                    clientEmail={booking.email}
                    clientName={booking.name}
                    venueName={booking.venueName}
                    venueAddress={booking.venueAddress || undefined}
                    venuePostcode={booking.venuePostcode || undefined}
                    eventDate={booking.eventDate}
                    onSend={fetchBooking}
                  />
                </CardContent>
              </Card>

              {/* Technical Equipment - Warehouse Pick List */}
              <Card className={`bg-gray-800 border-champagne-gold/30 ${getSectionBgColor()} transition-colors`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-500" />
                    Technical Equipment
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">
                    Add warehouse items to the pick list. These will appear in the Artist Dispatch and Master Internal Brief.
                  </p>
                </CardHeader>
                <CardContent>
                  <TechnicalEquipment bookingId={booking.id} onUpdate={fetchBooking} />
                </CardContent>
              </Card>

              {/* DJ Worksheet - Only show if DJ service */}
              {hasDJService && (
                <Card className={`bg-gray-800 border-champagne-gold/30 ${getSectionBgColor()} transition-colors`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-white">DJ Worksheet</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>
              )}

              {/* Team Assignment - New Searchable Section */}
              <TeamAssignment
                bookingId={booking.id}
                staffAssignments={staffAssignments}
                onUpdate={fetchBooking}
              />

              {/* Crew Assignments (Venue + Timings: venueName, eventDate, djArrivalTime, djStartTime from booking) */}
              <CrewAssignments
                bookingId={booking.id}
                venueName={booking.venueName}
                eventDate={booking.eventDate}
                djArrivalTime={booking.djArrivalTime}
                djStartTime={booking.djStartTime}
                staffAssignments={staffAssignments}
                onUpdate={fetchBooking}
              />

              {/* Legacy Quick Staff (for backward compatibility) */}
              <Card className="bg-gray-800 border-champagne-gold/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-white">Team</CardTitle>
                    <div className="flex gap-2">
                      <AddBasicStaff onAdd={fetchBooking} />
                      <QuickStaffConfirm
                        bookingId={booking.id}
                        venueName={booking.venueName}
                        eventDate={booking.eventDate}
                        onConfirm={fetchBooking}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {staffAssignments.length > 0 ? (
                    <div className="space-y-3">
                      {staffAssignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="p-3 bg-gray-900/50 rounded-lg border border-gray-700"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[20px]">
                                {assignment.role?.toLowerCase().includes('dj') ? '🎧' : '💡'}
                              </span>
                              <p className="text-white font-semibold">{assignment.staff.name}</p>
                            </div>
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
                          <p className="text-gray-400 text-xs mb-1">Role: {assignment.role}</p>
                          {assignment.staff.email && (
                            <p className="text-gray-400 text-xs">
                              Email: <span className="text-champagne-gold">{assignment.staff.email}</span>
                            </p>
                          )}
                          {assignment.staff.phone && (
                            <p className="text-gray-400 text-xs">
                              Phone: <span className="text-champagne-gold">{assignment.staff.phone}</span>
                            </p>
                          )}
                          {!assignment.staff.email && !assignment.staff.phone && (
                            <p className="text-xs text-yellow-400 mt-1">⚠️ No contact info available</p>
                          )}
                          <p className="text-gray-400 text-xs">
                            Fee: £{assignment.agreedFee.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-champagne-gold/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Edit Booking Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Client Name</label>
                <input
                  type="text"
                  defaultValue={booking.name}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={booking.email}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Area Code</label>
                <input
                  type="text"
                  defaultValue={booking.phoneAreaCode || ""}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  defaultValue={booking.phoneNumber || ""}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Event Date</label>
                <input
                  id="edit-eventDate"
                  type="datetime-local"
                  defaultValue={new Date(booking.eventDate).toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 bg-gray-900 border border-amber-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Quick select venue</label>
                <select
                  id="edit-venueSelect"
                  className="w-full px-3 py-2 bg-gray-900 border border-amber-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  onChange={(e) => {
                    const v = e.target.value;
                    if (!v) return;
                    const vn = document.getElementById("edit-venueName") as HTMLInputElement;
                    if (vn) vn.value = v;
                    const venue = venues.find((x) => x.venueName === v);
                    if (!venue) return;
                    const ev = document.getElementById("edit-eventDate") as HTMLInputElement;
                    const eventVal = ev?.value;
                    if (venue.defaultCeremonyTime && eventVal) {
                      const [d] = eventVal.split("T");
                      const ceremonyEl = document.getElementById("edit-ceremonyTime") as HTMLInputElement;
                      if (ceremonyEl) ceremonyEl.value = `${d}T${venue.defaultCeremonyTime}`;
                    }
                    if (venue.defaultFinishTime) {
                      const finishEl = document.getElementById("edit-djFinishTime") as HTMLInputElement;
                      if (finishEl) finishEl.value = venue.defaultFinishTime;
                    }
                    if (venue.venueNotes) {
                      const msgEl = document.getElementById("edit-message") as HTMLTextAreaElement;
                      if (msgEl) msgEl.value = venue.venueNotes;
                    }
                  }}
                >
                  <option value="">— Select venue to pre-fill —</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.venueName}>{v.venueName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Venue Name</label>
                <input
                  id="edit-venueName"
                  type="text"
                  defaultValue={booking.venueName}
                  className="w-full px-3 py-2 bg-gray-900 border border-amber-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div className="col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                  onClick={async () => {
                    const vn = (document.getElementById("edit-venueName") as HTMLInputElement)?.value?.trim();
                    if (!vn) {
                      toast({ title: "Enter venue name", description: "Type or select a venue first.", variant: "destructive" });
                      return;
                    }
                    const res = await fetch(`/api/admin/venues?name=${encodeURIComponent(vn)}`);
                    const data = await res.json();
                    const list = data.venues || [];
                    const venue = list.find((x: { venueName: string }) => x.venueName.toLowerCase() === vn.toLowerCase()) || list[0];
                    if (!venue) {
                      toast({ title: "Venue not found", description: `No defaults for "${vn}".`, variant: "destructive" });
                      return;
                    }
                    const ev = document.getElementById("edit-eventDate") as HTMLInputElement;
                    const eventVal = ev?.value;
                    if (venue.defaultCeremonyTime && eventVal) {
                      const [d] = eventVal.split("T");
                      const ceremonyEl = document.getElementById("edit-ceremonyTime") as HTMLInputElement;
                      if (ceremonyEl) ceremonyEl.value = `${d}T${venue.defaultCeremonyTime}`;
                    }
                    if (venue.defaultFinishTime) {
                      const finishEl = document.getElementById("edit-djFinishTime") as HTMLInputElement;
                      if (finishEl) finishEl.value = venue.defaultFinishTime;
                    }
                    if (venue.venueNotes) {
                      const msgEl = document.getElementById("edit-message") as HTMLTextAreaElement;
                      if (msgEl) msgEl.value = venue.venueNotes;
                    }
                    toast({ title: "Defaults applied", description: `Pre-filled from ${venue.venueName}.` });
                  }}
                >
                  Apply venue defaults
                </Button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Venue Postcode</label>
                <input
                  id="edit-venuePostcode"
                  type="text"
                  defaultValue={booking.venuePostcode || ""}
                  className="w-full px-3 py-2 bg-gray-900 border border-amber-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ceremony Start</label>
                <input
                  id="edit-ceremonyTime"
                  type="datetime-local"
                  defaultValue={booking.ceremonyTime ? new Date(booking.ceremonyTime).toISOString().slice(0, 16) : ""}
                  className="w-full px-3 py-2 bg-gray-900 border border-amber-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ceremony / DJ Finish</label>
                <input
                  id="edit-djFinishTime"
                  type="time"
                  defaultValue={booking.djFinishTime || ""}
                  className="w-full px-3 py-2 bg-gray-900 border border-amber-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Number of Guests</label>
                <input
                  type="number"
                  defaultValue={booking.numberOfGuests || ""}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Additional Message</label>
              <textarea
                id="edit-message"
                defaultValue={booking.message || ""}
                rows={4}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <Button variant="outline" onClick={() => setShowEditModal(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Cancel
              </Button>
              <Button 
                  onClick={async () => {
                    const venueName = (document.getElementById("edit-venueName") as HTMLInputElement)?.value?.trim();
                    const venuePostcode = (document.getElementById("edit-venuePostcode") as HTMLInputElement)?.value?.trim() || null;
                    const eventDateRaw = (document.getElementById("edit-eventDate") as HTMLInputElement)?.value;
                    const ceremonyTimeRaw = (document.getElementById("edit-ceremonyTime") as HTMLInputElement)?.value;
                    const djFinishTimeRaw = (document.getElementById("edit-djFinishTime") as HTMLInputElement)?.value || null;
                    const messageRaw = (document.getElementById("edit-message") as HTMLTextAreaElement)?.value?.trim() || null;
                    try {
                      const payload: Record<string, unknown> = {
                        venueName: venueName ?? booking.venueName,
                        venuePostcode: (venuePostcode ?? booking.venuePostcode) || null,
                        ceremonyTime: ceremonyTimeRaw ? new Date(ceremonyTimeRaw).toISOString() : null,
                        djFinishTime: djFinishTimeRaw || null,
                        message: messageRaw,
                      };
                      if (eventDateRaw) {
                        payload.overrideMode = true;
                        payload.overrideReason = "Updated via Edit booking details";
                        payload.eventDate = new Date(eventDateRaw).toISOString();
                      }
                      const response = await fetch(`/api/admin/bookings/${booking.id}/flexible-update`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    if (response.ok) {
                      await fetchBooking();
                      setShowEditModal(false);
                      toast({
                        title: "Saved",
                        description: "Venue, timing and ceremony details updated",
                      });
                    } else {
                      const err = await response.json().catch(() => ({}));
                      throw new Error(err?.error || "Update failed");
                    }
                  } catch (e: any) {
                    toast({
                      title: "Error",
                      description: e?.message || "Failed to save changes",
                      variant: "destructive",
                    });
                  }
                }}
                className="bg-champagne-gold hover:bg-champagne-gold/90 text-black"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* James Bond Style Safety Delete Button - Bottom Right */}
      <div className="fixed bottom-8 right-8 z-50">
        <SafetyDeleteButton
          onDelete={handleDelete}
          deleting={deleting}
          itemName={`Booking: ${deduplicateName(getDisplayName(booking.name) || booking.name)}`}
          itemDetails={`Event: ${formatEventDate(booking.eventDate)} at ${booking.venueName}`}
        />
      </div>
      
      {/* Toast Notification */}
      <Toast 
        toast={toastState} 
        onClose={() => {
          // Clear toast state manually if needed (auto-dismiss is handled by the hook)
        }} 
      />
    </div>
  );
}
