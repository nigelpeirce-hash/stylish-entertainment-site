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
} from "lucide-react";
import Link from "next/link";
import { ArtistDispatch } from "@/components/ArtistDispatch";
import { SendResources } from "@/components/SendResources";
import { QuickStaffConfirm } from "@/components/QuickStaffConfirm";
import { AddBasicStaff } from "@/components/AddBasicStaff";
import { DJInquiryReply } from "@/components/DJInquiryReply";
import { FlexibleOperatorSidebar } from "@/components/FlexibleOperatorSidebar";
import { WhatsAppThread } from "@/components/WhatsAppThread";
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
  finalDetailsConfirmed?: boolean | null;
  finalDetailsConfirmedManual?: boolean | null;
  djWorksheetApproved?: boolean | null;
  djWorksheetApprovedManual?: boolean | null;
  user: { id: string; name: string; email: string } | null;
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [sendingAction, setSendingAction] = useState<string | null>(null);
  const [showTechNoteBox, setShowTechNoteBox] = useState(false);
  const [techNote, setTechNote] = useState("");
  const [wifeName, setWifeName] = useState("Sarah");
  const [yourName, setYourName] = useState("Nigel");

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
      const response = await fetch(`/api/admin/bookings/${bookingId}/?t=${Date.now()}`, {
        cache: 'no-store',
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

  const handleHandoff = async (assignTo: "wife" | "husband") => {
    if (!booking) return;
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedTo: assignTo,
          handoffStatus: assignTo === "wife" ? "action_needed" : "tech_review",
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
      } else if (resourceType === "quote") {
        window.location.href = `/admin/email-templates?bookingId=${booking.id}&category=quote`;
      }
    } catch (error: any) {
      alert(error.message || `Failed to send ${resourceType}`);
    } finally {
      setSendingAction(null);
    }
  };

  // Get section background color based on assignedTo
  const getSectionBgColor = () => {
    if (!booking) return "bg-white";
    return booking.assignedTo === "wife" 
      ? "bg-blue-50" 
      : booking.assignedTo === "husband" 
      ? "bg-purple-50" 
      : "bg-white";
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
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="container mx-auto max-w-[1920px] px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back Button */}
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>

            {/* Center: Name, Date, Venue */}
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{booking.name}</h1>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="font-bold text-gray-900 text-lg">
                    {formatEventDate(booking.eventDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-700">{booking.venueName}</span>
                  {booking.venuePostcode && (
                    <span className="font-bold text-gray-900">{booking.venuePostcode}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Hand-off Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleHandoff("wife")}
                variant={booking.assignedTo === "wife" ? "default" : "outline"}
                size="sm"
                className={booking.assignedTo === "wife" 
                  ? "bg-blue-500 hover:bg-blue-600 text-white" 
                  : "border-blue-500 text-blue-600 hover:bg-blue-50"
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
                  : "border-purple-500 text-purple-600 hover:bg-purple-50"
                }
              >
                🛠️ {yourName}
              </Button>
              <Button
                onClick={() => setIsSidebarOpen(true)}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
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
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-8 text-center text-gray-500">
                    <Phone className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No phone number available</p>
                    <p className="text-sm mt-2">WhatsApp conversation will appear here</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Middle Column: The Logistics */}
          <div className="lg:col-span-4 space-y-4">
            {/* Client Details */}
            <Card className={`bg-white border-gray-200 ${getSectionBgColor()}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">Client Details</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEditModal(true)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="text-gray-900 font-medium">{booking.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a
                    href={`mailto:${booking.email}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                  >
                    {booking.email}
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
                {phoneNumber && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <a
                      href={`tel:${phoneNumber}`}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                    >
                      {phoneNumber}
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                )}
                {booking.contactPreference && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Preferred Contact</p>
                    <p className="text-gray-900">{booking.contactPreference}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timings */}
            {(booking.djArrivalTime || booking.djStartTime || booking.djFinishTime) && (
              <Card className={`bg-white border-gray-200 ${getSectionBgColor()}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    Timings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {booking.djArrivalTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Arrival:</span>
                      <span className="text-gray-900 font-medium">{booking.djArrivalTime}</span>
                    </div>
                  )}
                  {booking.djStartTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start:</span>
                      <span className="text-gray-900 font-medium">{booking.djStartTime}</span>
                    </div>
                  )}
                  {booking.djFinishTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Finish:</span>
                      <span className="text-gray-900 font-medium">{booking.djFinishTime}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Venue Info */}
            <Card className={`bg-white border-gray-200 ${getSectionBgColor()}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  Venue Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Venue Name</p>
                  <p className="text-gray-900 font-medium">{booking.venueName}</p>
                </div>
                {booking.venueAddress && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <p className="text-gray-700">{booking.venueAddress}</p>
                  </div>
                )}
                {(booking.venueTown || booking.venuePostcode) && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-gray-700">
                      {booking.venueTown}
                      {booking.venueTown && booking.venuePostcode && ", "}
                      {booking.venuePostcode && (
                        <span className="font-bold text-gray-900">{booking.venuePostcode}</span>
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
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in Google Maps
                    </a>
                  </div>
                )}
                {(booking.djSetupLocation || booking.djParking || booking.soundLimiter !== null) && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Technical Setup</p>
                    <div className="space-y-1.5 text-sm">
                      {booking.djSetupLocation && (
                        <div>
                          <span className="text-gray-600">Setup: </span>
                          <span className="text-gray-900">{booking.djSetupLocation}</span>
                        </div>
                      )}
                      {booking.djParking && (
                        <div>
                          <span className="text-gray-600">Parking: </span>
                          <span className="text-gray-900">{booking.djParking}</span>
                        </div>
                      )}
                      {booking.soundLimiter !== null && (
                        <div>
                          <span className="text-gray-600">Sound Limiter: </span>
                          <span className={booking.soundLimiter ? "text-red-600" : "text-green-600"}>
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
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Resources
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200">
                    <DropdownMenuItem 
                      onSelect={() => handleSendResource("brochure")}
                      className="cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Send Brochure
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => handleSendResource("quote")}
                      className="cursor-pointer"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Send Quote
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={() => setIsSidebarOpen(true)}
                      className="cursor-pointer"
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
                <Card className={`bg-white border-gray-200 ${getSectionBgColor()}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900">Artist Dispatch</CardTitle>
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
                <Card className={`bg-white border-gray-200 ${getSectionBgColor()}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-gray-900">DJ Worksheet</CardTitle>
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

              {/* Staff Assignments */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">Team</CardTitle>
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
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-gray-900 font-semibold">{assignment.staff.name}</p>
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                assignment.status === "held"
                                  ? "bg-blue-100 text-blue-700"
                                  : assignment.status === "dispatched"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {assignment.status === "held" ? "Date Held" : assignment.status === "dispatched" ? "Dispatched" : assignment.status}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs mb-1">Role: {assignment.role}</p>
                          <p className="text-gray-600 text-xs">
                            Fee: £{assignment.agreedFee.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          {assignment.confirmationEmailSent && (
                            <p className="text-xs text-green-600 mt-1">✓ Confirmation sent</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No staff assigned yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Booking Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Full editable form would go here */}
            <p className="text-gray-600">Full editing form will be implemented here</p>
            <Button onClick={() => setShowEditModal(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Flexible Operator Sidebar */}
      {isSidebarOpen && booking && (
        <FlexibleOperatorSidebar
          booking={{
            ...booking,
            feeBreakdown: booking.feeBreakdown || null,
            taxInclusive: booking.taxInclusive ?? null,
            taxRate: booking.taxRate ?? null,
            selectedTemplate: booking.selectedTemplate || null,
            depositReceived: booking.depositReceived ?? null,
            depositReceivedManual: booking.depositReceivedManual ?? null,
            finalDetailsConfirmed: booking.finalDetailsConfirmed ?? null,
            finalDetailsConfirmedManual: booking.finalDetailsConfirmedManual ?? null,
            djWorksheetApproved: booking.djWorksheetApproved ?? null,
            djWorksheetApprovedManual: booking.djWorksheetApprovedManual ?? null,
          } as any}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onUpdate={fetchBooking}
        />
      )}
    </div>
  );
}
