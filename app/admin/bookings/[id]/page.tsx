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
} from "lucide-react";
import Link from "next/link";
import { ArtistDispatch } from "@/components/ArtistDispatch";
import { SendResources } from "@/components/SendResources";
import { QuickStaffConfirm } from "@/components/QuickStaffConfirm";
import { AddBasicStaff } from "@/components/AddBasicStaff";
import { DJInquiryReply } from "@/components/DJInquiryReply";
import { FlexibleOperatorSidebar } from "@/components/FlexibleOperatorSidebar";
import { WhatsAppThread } from "@/components/WhatsAppThread";
import { CrewAssignments } from "@/components/CrewAssignments";
import { SafetyDeleteButton } from "@/components/SafetyDeleteButton";
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
  bookingReference?: string | null;
  priority?: string;
  conflictStatus?: string | null;
  assignedTo?: string | null;
  handoffStatus?: string | null;
  handoffNote?: string | null;
  adminNotes?: string | null;
  user: { id: string; name: string; email: string } | null;
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [sendingAction, setSendingAction] = useState<string | null>(null);
  const [showTechNoteBox, setShowTechNoteBox] = useState(false);
  const [techNote, setTechNote] = useState("");
  const [wifeName, setWifeName] = useState("Ali");
  const [yourName, setYourName] = useState("Nigel");
  const [deleting, setDeleting] = useState(false);

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
        });
        setBooking(data.booking);
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

  if (status === "loading" || loading) {
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

  const phoneNumber = getPhoneNumber();
  const googleMapsUrl = getGoogleMapsUrl();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b-2 border-champagne-gold/30 shadow-lg">
        <div className="container mx-auto max-w-[1920px] px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back Button */}
            <Link href="/admin/bookings">
              <Button variant="outline" size="sm" className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>

            {/* Center: Name, Date, Venue */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-white mb-1">{booking.name}</h1>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-champagne-gold" />
                  <span className="font-bold text-white text-lg">
                    {formatEventDate(booking.eventDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-champagne-gold" />
                  <span className="font-semibold text-gray-300">{booking.venueName}</span>
                  {booking.venuePostcode && (
                    <span className="font-bold text-champagne-gold">{booking.venuePostcode}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Hand-off Buttons */}
            <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>


      {/* 3-Column Layout */}
      <div className="container mx-auto max-w-[1920px] px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: WhatsApp Conversation (The Inbox) */}
          <div className="lg:col-span-4">
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
          </div>

          {/* Middle Column: The Logistics */}
          <div className="lg:col-span-4 space-y-4">
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
                  <p className="text-white font-medium">{booking.name}</p>
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

            {/* Timings */}
            {(booking.djArrivalTime || booking.djStartTime || booking.djFinishTime) && (
              <Card className={`bg-gray-800 border-champagne-gold/30 ${getSectionBgColor()} transition-colors`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-champagne-gold" />
                    Timings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
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
            )}

            {/* Venue Info */}
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
                  <p className="text-white font-medium">{booking.venueName}</p>
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
          <div className="lg:col-span-4">
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

              {/* Crew Assignments */}
              <CrewAssignments
                bookingId={booking.id}
                venueName={booking.venueName}
                eventDate={booking.eventDate}
                djArrivalTime={booking.djArrivalTime}
                djStartTime={booking.djStartTime}
                staffAssignments={booking.staffAssignments || []}
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
                  {booking.staffAssignments && booking.staffAssignments.length > 0 ? (
                    <div className="space-y-3">
                      {booking.staffAssignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="p-3 bg-gray-900/50 rounded-lg border border-gray-700"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-white font-semibold">{assignment.staff.name}</p>
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
                  type="datetime-local"
                  defaultValue={new Date(booking.eventDate).toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Venue Name</label>
                <input
                  type="text"
                  defaultValue={booking.venueName}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Venue Postcode</label>
                <input
                  type="text"
                  defaultValue={booking.venuePostcode || ""}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold font-bold"
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
                  // Save logic would go here
                  alert("Save functionality to be implemented");
                  setShowEditModal(false);
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
          itemName={`Booking: ${booking.name}`}
          itemDetails={`Event: ${formatEventDate(booking.eventDate)} at ${booking.venueName}`}
        />
      </div>
    </div>
  );
}
