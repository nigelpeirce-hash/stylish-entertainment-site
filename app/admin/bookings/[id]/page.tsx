"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import useSWR from "swr";
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
  PoundSterling,
  Package,
} from "lucide-react";
import Link from "next/link";
import { ArtistDispatch } from "@/components/ArtistDispatch";
import ClientEmailsCard from "@/components/ClientEmailsCard";
import { SendResources } from "@/components/SendResources";
import { QuickStaffConfirm } from "@/components/QuickStaffConfirm";
import { AddBasicStaff } from "@/components/AddBasicStaff";
import { DJInquiryReply } from "@/components/DJInquiryReply";
import { EmailCompositionCenter } from "@/components/EmailCompositionCenter";
import { MultiArtistReply } from "@/components/MultiArtistReply";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { deduplicateName, getDisplayName } from "@/lib/utils/name-helpers";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { debug } from "@/lib/debug";
import { SanitizedBooking } from "@/lib/transformers/booking-transformer";
import { useBookingUpdates } from "@/lib/hooks/useBookingUpdates";

// Use the sanitized booking interface from transformer
// All data sanitization now happens in the API layer (lib/transformers/booking-transformer.ts)
type Booking = SanitizedBooking;

// SWR fetcher function with timeout and error handling
type BookingFetcherResult = { booking: SanitizedBooking; fallback?: boolean } | { booking: null; notFound: true };

const bookingFetcher = async (url: string): Promise<BookingFetcherResult> => {
  const endTimer = debug.time('fetchBooking');
  let timeoutId: NodeJS.Timeout | null = null;
  try {
    debug.log('Fetching booking', { url });

    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });

    if (timeoutId) clearTimeout(timeoutId);

    debug.api('GET', url, { status: response.status });

    if (response.status === 404) {
      endTimer();
      debug.log('Booking not found (404)', { url });
      return { booking: null, notFound: true };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = (errorData?.error || errorData?.message || `Failed to fetch booking: ${response.status} ${response.statusText}`) as string;
      const lower = String(msg).toLowerCase();
      if (lower.includes('booking not found') || lower.includes('not found')) {
        endTimer();
        debug.log('Booking not found (server message)', { url, status: response.status });
        return { booking: null, notFound: true };
      }
      throw new Error(msg);
    }

    const data = await response.json();

    if (data?.booking == null && data?.notFound === true) {
      endTimer();
      debug.log('Booking not found (response body)', { url });
      return { booking: null, notFound: true };
    }

    debug.log("Fetched booking data", {
      id: data.booking?.id,
      staffAssignmentsCount: data.booking?.staffAssignments?.length || 0,
      fallback: data.fallback,
    });

    endTimer();
    return data;
  } catch (error: any) {
    if (timeoutId) clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      debug.error("Request timed out", error, { url });
      throw new Error("Request timed out after 15 seconds. Please check your connection and try again.");
    }
    debug.error("Error fetching booking", error, { url });
    throw error;
  }
};

export default function BookingDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sendingAction, setSendingAction] = useState<string | null>(null);
  const [showTechNoteBox, setShowTechNoteBox] = useState(false);
  const [techNote, setTechNote] = useState("");
  const [wifeName, setWifeName] = useState("Ali");
  const [yourName, setYourName] = useState("Nigel");
  const [deleting, setDeleting] = useState(false);
  const [sendingDepositInvoice, setSendingDepositInvoice] = useState(false);
  const [sendingFinalizeInvite, setSendingFinalizeInvite] = useState(false);
  const [venues, setVenues] = useState<{ id: string; venueName: string; venuePostcode?: string | null; defaultCeremonyTime?: string | null; defaultFinishTime?: string | null; venueNotes?: string | null }[]>([]);
  const { toast, toastState } = useToast();

  // Determine if we should fetch (authorization check)
  const isAuthorizedForSWR = useMemo(() => {
    return status === "authenticated" && (session?.user as any)?.role === "admin";
  }, [status, session?.user]);

  const devBypassForSWR = useMemo(() => {
    const isLocalhost = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" || 
       window.location.hostname === "127.0.0.1" ||
       window.location.hostname.startsWith("192.168.") ||
       window.location.hostname.startsWith("10."));
    return isLocalhost || 
      (typeof window !== "undefined" && sessionStorage.getItem("dev_admin_bypass") === "true");
  }, []); // Empty deps - window.location and sessionStorage don't change
  
  const shouldFetch = useMemo(() => {
    return bookingId && (isAuthorizedForSWR || devBypassForSWR);
  }, [bookingId, isAuthorizedForSWR, devBypassForSWR]);

  // Use SWR for data fetching with caching and background refresh
  const { data, error, isLoading, mutate } = useSWR<BookingFetcherResult>(
    shouldFetch ? `/api/admin/bookings/${bookingId}/` : null,
    bookingFetcher,
    {
      refreshInterval: 0, // Don't auto-refresh (user can manually refresh)
      revalidateOnFocus: false, // Prevents fetch every time you click the window
      revalidateOnReconnect: false, // Prevents fetch when your Wi-Fi flickers
      dedupingInterval: 30000, // Ignores duplicate requests within 30 seconds
      keepPreviousData: true, // Keep previous data while fetching new data
      loadingTimeout: 10000, // Timeout after 10 seconds
      errorRetryCount: 2, // Max retries
      errorRetryInterval: 3000, // Retry after 3 seconds
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Don't retry on 401/403 errors
        if (error.status === 401 || error.status === 403) return;
        // Retry up to 2 times
        if (retryCount >= 2) {
          toast({
            title: "Error",
            description: "Failed to load booking after retries",
            variant: "destructive",
          });
          return;
        }
        // Retry after 3 seconds
        setTimeout(() => revalidate({ retryCount }), 3000);
      },
      onError: () => {
        // Error state is shown inline (error UI with Retry + Back to bookings); skip toast to avoid duplicate.
      },
    }
  );

  // Extract booking data and fallback mode from SWR response
  const booking = data?.booking ?? null;
  const isNotFound = data?.notFound === true;
  const isFallbackMode = !isNotFound && data?.fallback === true;
  const loading = isLoading;
  
  // Centralized update system with optimistic updates
  const { updateBooking } = useBookingUpdates(bookingId, booking, mutate);
  
  // Wrapper function for child components that expect onUpdate: () => void
  // This decouples child components from parent's fetching logic
  // Child components can call onUpdate() after making their own API requests
  // and the hook will handle revalidation
  const handleBookingUpdate = useCallback(async () => {
    // Trigger SWR revalidation to get latest data from server
    await mutate();
  }, [mutate]);

  // Handle authentication and redirects
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
      return;
    }

    const devBypass = typeof window !== "undefined" && 
      sessionStorage.getItem("dev_admin_bypass") === "true";

    if (devBypass) {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router]);

  useEffect(() => {
    if (!showEditModal) return;
    fetch("/api/admin/venues/")
      .then((r) => r.json())
      .then((d) => setVenues(d.venues || []))
      .catch(() => setVenues([]));
  }, [showEditModal]);

  // All booking updates now go through useBookingUpdates hook
  // Child components use handleBookingUpdate() callback to trigger revalidation

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
      await handleBookingUpdate();
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

  if (error && !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-900 px-4">
        <div className="text-center space-y-2">
          <p className="text-xl font-medium text-white">Error loading booking</p>
          <p className="text-gray-400 text-sm max-w-md">{error.message}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={() => mutate()} className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10">
            Try again
          </Button>
          <Link href="/admin/bookings/">
            <Button variant="outline" size="lg" className="border-gray-500 text-gray-400 hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to bookings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!booking || isNotFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-900 px-4">
        <div className="text-center space-y-2">
          <p className="text-xl font-medium text-white">Booking not found</p>
          <p className="text-gray-400 text-sm max-w-md">
            This booking may have been deleted or the link is invalid. Go back to the list or try again.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={() => mutate()} className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10">
            Try again
          </Button>
          <Link href="/admin/bookings/">
            <Button variant="outline" size="lg" className="border-gray-500 text-gray-400 hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to bookings
            </Button>
          </Link>
        </div>
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
              <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white">
                  {deduplicateName(getDisplayName(booking.name) || booking.name)}
                </h1>
                {booking.eventType && (
                  <span className="border border-amber-500/30 text-amber-500 text-xs uppercase tracking-widest px-2 py-1 rounded">
                    {booking.eventType}
                  </span>
                )}
                {booking.confirmedViaBookFromQuote && (
                  <span className="border border-emerald-500/50 bg-emerald-500/20 text-emerald-400 text-xs uppercase tracking-widest px-2 py-1 rounded font-semibold">
                    Confirmed via Book-from-Quote
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

            {/* Right: Edit, Internal Brief, Hand-off & Settings */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowEditModal(true)}
                variant="outline"
                size="sm"
                className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 font-semibold"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit booking
              </Button>
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
                    title="Edit client, venue, timings & details"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
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
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-champagne-gold" />
                    Timings
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEditModal(true)}
                    className="text-gray-400 hover:text-champagne-gold"
                    title="Edit venue, timings & details"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Ceremony start:</span>
                  <span className="text-white font-medium">
                    {booking.ceremonyTime
                      ? new Date(booking.ceremonyTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Artist start:</span>
                  <span className="text-white font-medium">{booking.djStartTime || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Artist end:</span>
                  <span className="text-white font-medium">{booking.djFinishTime || "—"}</span>
                </div>
                {booking.djArrivalTime && (
                  <div className="flex justify-between pt-1 border-t border-gray-700/50">
                    <span className="text-gray-400 text-sm">Arrival:</span>
                    <span className="text-white font-medium text-sm">{booking.djArrivalTime}</span>
                  </div>
                )}
                <p className="text-xs text-gray-500 pt-1">Click Edit to change timings, then Save Changes</p>
              </CardContent>
            </Card>

            {/* Venue Info (booking guaranteed; data from API) */}
            <Card className={`bg-gray-800 border-champagne-gold/30 ${getSectionBgColor()} transition-colors`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-champagne-gold" />
                    Venue Info
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEditModal(true)}
                    className="text-gray-400 hover:text-champagne-gold"
                    title="Edit venue, timings & details"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Venue Name</p>
                  <p className="text-white font-medium">{booking.venueName || "—"}</p>
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
                {(booking.venueIsPrivateHouse || booking.venueWhat3Words || booking.venueLoadInNotes) && (
                  <div className="pt-3 border-t border-gray-700 border-l-4 border-l-amber-500/80">
                    <p className="text-xs text-amber-400 mb-2 font-semibold">Finding the venue / Load-in</p>
                    <div className="space-y-1.5 text-sm">
                      {booking.venueIsPrivateHouse && (
                        <div>
                          <span className="text-gray-400">Private house: </span>
                          <span className="text-white">Yes</span>
                        </div>
                      )}
                      {booking.venueWhat3Words && (
                        <div>
                          <span className="text-gray-400">What3words: </span>
                          <a
                            href={`https://what3words.com/${booking.venueWhat3Words.trim().replace(/\s+/g, ".")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-champagne-gold hover:underline"
                          >
                            {booking.venueWhat3Words}
                          </a>
                        </div>
                      )}
                      {booking.venueLoadInNotes && (
                        <div>
                          <span className="text-gray-400">Load-in / access: </span>
                          <span className="text-white whitespace-pre-wrap">{booking.venueLoadInNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quote Builder - Multi-Service (below Venue Info) */}
            <Card className={`bg-gray-800 border-champagne-gold/30 ${getSectionBgColor()} transition-colors`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-white">Quote Builder</CardTitle>
                <p className="text-xs text-gray-400">Build and send quotes for DJs, musicians, lighting, styling & more</p>
              </CardHeader>
              <CardContent>
                <MultiArtistReply
                  bookingId={booking.id}
                  clientEmail={booking.email}
                  clientName={booking.name}
                  venueName={booking.venueName}
                  venueAddress={booking.venueAddress || undefined}
                  eventDate={booking.eventDate}
                  onSend={handleBookingUpdate}
                />
              </CardContent>
            </Card>

            {/* Manual Communication — priority action */}
            <Card className={`bg-gray-800 border-amber-500/20 ${getSectionBgColor()} transition-colors`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-500" />
                  Manual Communication
                </CardTitle>
                <p className="text-sm text-amber-200/90 mt-1">
                  Workflow: Send deposit invoice → Mark deposit received (sends confirmation) → Invite to portal (sends magic link). Reminder sent if they don&apos;t open within 3 days.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Send Deposit Invoice (before payment) */}
                <div className="p-4 bg-gray-900/70 rounded-lg border border-amber-500/30">
                  <p className="text-sm text-gray-300 mb-2">
                    Send &quot;please pay&quot; deposit invoice. Use before client pays.
                  </p>
                  <Button
                    onClick={async () => {
                      if (!booking?.email) return;
                      setSendingDepositInvoice(true);
                      try {
                        const res = await fetch(`/api/admin/bookings/${booking.id}/send-deposit-invoice`, { method: "POST" });
                        const data = await res.json();
                        if (res.ok) {
                          await handleBookingUpdate();
                          toast({
                            title: "Deposit invoice sent",
                            description: `Email sent to ${deduplicateName(getDisplayName(booking.name) || booking.name)}`,
                          });
                        } else {
                          throw new Error(data?.error ?? "Failed to send");
                        }
                      } catch (e: unknown) {
                        toast({
                          title: "Error",
                          description: (e as Error)?.message ?? "Failed to send deposit invoice",
                          variant: "destructive",
                        });
                      } finally {
                        setSendingDepositInvoice(false);
                      }
                    }}
                    disabled={sendingDepositInvoice || !booking?.email}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold disabled:opacity-50"
                  >
                    {sendingDepositInvoice ? (
                      <><span className="animate-spin mr-2">⏳</span> Sending…</>
                    ) : (
                      <><PoundSterling className="w-4 h-4 mr-2" /> Send Deposit Invoice</>
                    )}
                  </Button>
                  {booking.depositInvoiceSentAt && (
                    <p className="text-xs text-gray-400 italic mt-2">
                      Last sent: {new Date(booking.depositInvoiceSentAt).toLocaleString("en-GB", {
                        weekday: "short", day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>

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
                            await handleBookingUpdate();
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

                <p className="text-sm text-gray-400">
                  Checking &quot;Deposit received&quot; sends the payment-confirmation email. Then use the action below to invite them to the portal.
                </p>

                {/* Invite to portal — workflow step after deposit received */}
                <div className="p-4 bg-gray-900/70 rounded-lg border-2 border-amber-500/30">
                  <p className="text-sm text-gray-300 mb-2">
                    Send confirmation of payment received and invite to portal (magic link). Do this after marking deposit received.
                  </p>
                  <Button
                    onClick={async () => {
                      if (!booking?.email) return;
                      setSendingFinalizeInvite(true);
                      try {
                        const res = await fetch(`/api/admin/bookings/${booking.id}/finalize-and-invite`, { method: "POST" });
                        const data = await res.json();
                        if (res.ok) {
                          await handleBookingUpdate();
                          const clientName = deduplicateName(getDisplayName(booking.name) || booking.name);
                          toast({
                            title: "Confirm payment & invite sent",
                            description: `Portal invite sent to ${clientName}. Reminder goes automatically if they don&apos;t open within 3 days.`,
                          });
                        } else {
                          throw new Error(data?.error || "Failed to confirm and send invite");
                        }
                      } catch (e: any) {
                        toast({
                          title: "Error",
                          description: e?.message || "Failed to confirm and send invite",
                          variant: "destructive",
                        });
                      } finally {
                        setSendingFinalizeInvite(false);
                      }
                    }}
                    disabled={!(booking.depositReceivedManual || false) || sendingFinalizeInvite || !booking?.email}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {sendingFinalizeInvite ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Confirm payment &amp; invite to portal
                      </>
                    )}
                  </Button>
                  {!(booking.depositReceivedManual || false) && (
                    <p className="text-xs text-amber-400/90 mt-2">Mark deposit received first.</p>
                  )}
                </div>
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
              {/* Artist Worksheet - Only show if DJ service */}
              {hasDJService && (
                <Card className={`bg-gray-800 border-champagne-gold/30 ${getSectionBgColor()} transition-colors`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-white">Artist Worksheet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ArtistDispatch
                      bookingId={booking.id}
                      booking={booking}
                      onUpdate={handleBookingUpdate}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Client emails (bookings + 1st touch) */}
              <ClientEmailsCard
                bookingId={booking.id}
                clientName={booking.name}
                clientEmail={booking.email}
                getSectionBgColor={getSectionBgColor}
              />

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
                    onSend={handleBookingUpdate}
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
                    Add warehouse items to the pick list. These will appear in the Artist Worksheet and Master Internal Brief.
                  </p>
                </CardHeader>
                <CardContent>
                  <TechnicalEquipment bookingId={booking.id} onUpdate={handleBookingUpdate} />
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
                      onSend={handleBookingUpdate}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Team Assignment - New Searchable Section */}
              <TeamAssignment
                bookingId={booking.id}
                staffAssignments={staffAssignments}
                onUpdate={handleBookingUpdate}
              />

              {/* Crew Assignments (Venue + Timings: venueName, eventDate, djArrivalTime, djStartTime from booking) */}
              <CrewAssignments
                bookingId={booking.id}
                venueName={booking.venueName}
                eventDate={booking.eventDate}
                djArrivalTime={booking.djArrivalTime}
                djStartTime={booking.djStartTime}
                staffAssignments={staffAssignments}
                onUpdate={handleBookingUpdate}
              />

              {/* Legacy Quick Staff (for backward compatibility) */}
              <Card className="bg-gray-800 border-champagne-gold/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-white">Team</CardTitle>
                    <div className="flex gap-2">
                      <AddBasicStaff onAdd={handleBookingUpdate} />
                      <QuickStaffConfirm
                        bookingId={booking.id}
                        venueName={booking.venueName}
                        eventDate={booking.eventDate}
                        onConfirm={handleBookingUpdate}
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
                            Fee: £{(() => {
                              const fee = assignment.agreedFee;
                              // Ensure we always return a number, never an object
                              if (typeof fee === 'number' && !isNaN(fee)) {
                                return fee;
                              }
                              if (typeof fee === 'object' && fee !== null) {
                                // Extract numeric value from object
                                const obj = fee as any;
                                const extracted = Number(obj.fee) || Number(obj.amount) || Number(obj.value) || 0;
                                return isNaN(extracted) ? 0 : extracted;
                              }
                              if (typeof fee === 'string') {
                                const parsed = parseFloat(fee);
                                return isNaN(parsed) ? 0 : parsed;
                              }
                              return 0;
                            })().toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-champagne-gold/30" aria-describedby="edit-booking-desc">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Edit Booking Details</DialogTitle>
            <DialogDescription id="edit-booking-desc" className="text-sm text-gray-400 font-normal mt-1">
              Update client, venue, timings, and message. Venue name and postcode are free text—type anything or use Quick select. Click <strong className="text-champagne-gold">Save Changes</strong> when done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Client Name</label>
                <input
                  id="edit-name"
                  type="text"
                  defaultValue={booking.name}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  id="edit-email"
                  type="email"
                  defaultValue={booking.email}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Area Code</label>
                <input
                  id="edit-phoneAreaCode"
                  type="text"
                  defaultValue={booking.phoneAreaCode || ""}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input
                  id="edit-phoneNumber"
                  type="text"
                  defaultValue={booking.phoneNumber || ""}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-semibold text-amber-500/90 mb-2">Client home address</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">Address</label>
                    <input
                      id="edit-clientAddress"
                      type="text"
                      defaultValue={(booking as any).clientAddress || ""}
                      placeholder="Line 1"
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">Address 2</label>
                    <input
                      id="edit-clientAddress2"
                      type="text"
                      defaultValue={(booking as any).clientAddress2 || ""}
                      placeholder="Line 2"
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Town</label>
                    <input
                      id="edit-clientTown"
                      type="text"
                      defaultValue={(booking as any).clientTown || ""}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">County</label>
                    <input
                      id="edit-clientCounty"
                      type="text"
                      defaultValue={(booking as any).clientCounty || ""}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Postcode</label>
                    <input
                      id="edit-clientPostcode"
                      type="text"
                      defaultValue={(booking as any).clientPostcode || ""}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    />
                  </div>
                </div>
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
                    const [name, postcode] = v.includes("\t") ? v.split("\t") : [v, ""];
                    const vn = document.getElementById("edit-venueName") as HTMLInputElement;
                    const vp = document.getElementById("edit-venuePostcode") as HTMLInputElement;
                    if (vn) vn.value = name;
                    if (vp) vp.value = postcode;
                    const venue = venues.find((x) => x.venueName === name);
                    if (!venue) return;
                    if ("defaultCeremonyTime" in venue && venue.defaultCeremonyTime) {
                      const ceremonyEl = document.getElementById("edit-ceremonyTime") as HTMLInputElement;
                      if (ceremonyEl) ceremonyEl.value = venue.defaultCeremonyTime;
                    }
                    if ("defaultFinishTime" in venue && venue.defaultFinishTime) {
                      const finishEl = document.getElementById("edit-djFinishTime") as HTMLInputElement;
                      if (finishEl) finishEl.value = venue.defaultFinishTime;
                    }
                    if ("venueNotes" in venue && venue.venueNotes) {
                      const msgEl = document.getElementById("edit-message") as HTMLTextAreaElement;
                      if (msgEl) msgEl.value = venue.venueNotes;
                    }
                  }}
                >
                  <option value="">— Select venue to pre-fill name &amp; postcode —</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.venuePostcode ? `${v.venueName}\t${v.venuePostcode}` : v.venueName}>
                      {v.venuePostcode ? `${v.venueName}, ${v.venuePostcode}` : v.venueName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Venue Name</label>
                <input
                  id="edit-venueName"
                  type="text"
                  defaultValue={booking.venueName ?? ""}
                  placeholder="e.g. Babington House — type freely or use Quick select"
                  className="w-full px-3 py-2 bg-gray-900 border border-amber-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Venue Postcode</label>
                <input
                  id="edit-venuePostcode"
                  type="text"
                  defaultValue={booking.venuePostcode ?? ""}
                  placeholder="e.g. BA11 3RW"
                  className="w-full px-3 py-2 bg-gray-900 border border-amber-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  autoComplete="off"
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
                    const vp = (document.getElementById("edit-venuePostcode") as HTMLInputElement)?.value?.trim() || null;
                    let applied = false;
                    let source: "venue" | "booking" | null = null;
                    const res = await fetch(`/api/admin/venues/?name=${encodeURIComponent(vn)}`);
                    const data = await res.json();
                    const list = data.venues || [];
                    const venueMatch = list.find((x: { venueName?: string }) => (x.venueName || "").toLowerCase() === vn.toLowerCase()) || list[0];
                    if (venueMatch?.defaultCeremonyTime || venueMatch?.defaultFinishTime || venueMatch?.venueNotes) {
                      if (venueMatch.defaultCeremonyTime) {
                        const ceremonyEl = document.getElementById("edit-ceremonyTime") as HTMLInputElement;
                        if (ceremonyEl) ceremonyEl.value = venueMatch.defaultCeremonyTime;
                      }
                      if (venueMatch.defaultFinishTime) {
                        const finishEl = document.getElementById("edit-djFinishTime") as HTMLInputElement;
                        if (finishEl) finishEl.value = venueMatch.defaultFinishTime;
                      }
                      if (venueMatch.venueNotes) {
                        const msgEl = document.getElementById("edit-message") as HTMLTextAreaElement;
                        if (msgEl) msgEl.value = venueMatch.venueNotes;
                      }
                      applied = true;
                      source = "venue";
                    }
                    if (!applied) {
                      const detailsRes = await fetch(`/api/admin/venues/details/?venueName=${encodeURIComponent(vn)}${vp ? `&venuePostcode=${encodeURIComponent(vp)}` : ""}`);
                      const detailsData = await detailsRes.json();
                      const det = detailsData?.venue;
                      if (det?.venuePostcode) {
                        const postcodeEl = document.getElementById("edit-venuePostcode") as HTMLInputElement;
                        if (postcodeEl) postcodeEl.value = det.venuePostcode;
                        applied = true;
                        source = "booking";
                      }
                    }
                    if (applied) {
                      toast({
                        title: "Defaults applied",
                        description: source === "venue"
                          ? `Pre-filled from venue "${venueMatch?.venueName ?? vn}".`
                          : "Pre-filled from recent booking.",
                      });
                    } else {
                      toast({ title: "No defaults found", description: `No stored defaults for "${vn}". You can still type freely and save.`, variant: "destructive" });
                    }
                  }}
                >
                  Apply venue defaults
                </Button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ceremony start</label>
                <input
                  id="edit-ceremonyTime"
                  type="time"
                  defaultValue={booking.ceremonyTime ? new Date(booking.ceremonyTime).toISOString().slice(11, 16) : ""}
                  className="w-full px-3 py-2 bg-gray-900 border border-amber-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Artist start</label>
                <input
                  id="edit-djStartTime"
                  type="time"
                  defaultValue={booking.djStartTime || ""}
                  className="w-full px-3 py-2 bg-gray-900 border border-amber-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Artist end</label>
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
                    const get = (id: string) => ((document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? "").trim();
                    const venueName = get("edit-venueName");
                    const venuePostcode = get("edit-venuePostcode") || null;
                    const eventDateRaw = get("edit-eventDate");
                    const ceremonyTimeRaw = get("edit-ceremonyTime");
                    const djStartTimeRaw = get("edit-djStartTime") || null;
                    const djFinishTimeRaw = get("edit-djFinishTime") || null;
                    const messageRaw = get("edit-message") || null;
                    const name = get("edit-name");
                    const email = get("edit-email");
                    const phoneAreaCode = get("edit-phoneAreaCode") || null;
                    const phoneNumber = get("edit-phoneNumber") || null;
                    const clientAddress = get("edit-clientAddress") || null;
                    const clientAddress2 = get("edit-clientAddress2") || null;
                    const clientTown = get("edit-clientTown") || null;
                    const clientCounty = get("edit-clientCounty") || null;
                    const clientPostcode = get("edit-clientPostcode") || null;
                    try {
                      const ceremonyDateTime = ceremonyTimeRaw && eventDateRaw
                        ? `${eventDateRaw.slice(0, 10)}T${ceremonyTimeRaw}`
                        : null;
                      const flexPayload: Record<string, unknown> = {
                        venueName: venueName ?? booking.venueName,
                        venuePostcode: venuePostcode ?? booking.venuePostcode ?? null,
                        ceremonyTime: ceremonyDateTime ? new Date(ceremonyDateTime).toISOString() : null,
                        djStartTime: djStartTimeRaw || null,
                        djFinishTime: djFinishTimeRaw || null,
                        message: messageRaw,
                      };
                      if (eventDateRaw) {
                        flexPayload.overrideMode = true;
                        flexPayload.overrideReason = "Updated via Edit booking details";
                        flexPayload.eventDate = new Date(eventDateRaw).toISOString();
                      }
                      const flexRes = await fetch(`/api/admin/bookings/${booking.id}/flexible-update/`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(flexPayload),
                      });
                      if (!flexRes.ok) {
                        const err = await flexRes.json().catch(() => ({}));
                        throw new Error(err?.error || "Update failed");
                      }
                      const clientPayload: Record<string, unknown> = {};
                      if (name) clientPayload.name = name;
                      if (email) clientPayload.email = email;
                      if (phoneAreaCode !== null) clientPayload.phoneAreaCode = phoneAreaCode || null;
                      if (phoneNumber !== null) clientPayload.phoneNumber = phoneNumber || null;
                      if (clientAddress !== null) clientPayload.clientAddress = clientAddress || null;
                      if (clientAddress2 !== null) clientPayload.clientAddress2 = clientAddress2 || null;
                      if (clientTown !== null) clientPayload.clientTown = clientTown || null;
                      if (clientCounty !== null) clientPayload.clientCounty = clientCounty || null;
                      if (clientPostcode !== null) clientPayload.clientPostcode = clientPostcode || null;
                      if (Object.keys(clientPayload).length > 0) {
                        const clientRes = await fetch(`/api/admin/bookings/${booking.id}/`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(clientPayload),
                        });
                        if (!clientRes.ok) {
                          const err = await clientRes.json().catch(() => ({}));
                          throw new Error(err?.error || "Failed to save client details");
                        }
                      }
                      await handleBookingUpdate();
                      setShowEditModal(false);
                      toast({
                        title: "Saved",
                        description: "Booking details updated",
                      });
                    } catch (e: any) {
                      toast({
                        title: "Error",
                        description: e?.message || "Failed to save changes",
                        variant: "destructive",
                      });
                    }
                  }}
                className="bg-champagne-gold hover:bg-champagne-gold/90 text-black font-semibold px-6"
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
            services: Array.isArray(booking.services) 
              ? booking.services.map((s: any) => typeof s === 'string' ? s : String(s?.name || s?.type || 'Service'))
              : [],
            adminNotes: booking.adminNotes || null,
            feeBreakdown: Array.isArray(booking.feeBreakdown) 
              ? booking.feeBreakdown
                  .filter((item: any) => item !== null && item !== undefined)
                  .map((item: any) => {
                    // Safely extract amount - handle objects with {fee} or {amount} keys
                    let amount = 0;
                    if (item?.amount !== undefined) {
                      if (typeof item.amount === 'number') {
                        amount = item.amount;
                      } else if (typeof item.amount === 'object' && item.amount !== null) {
                        amount = Number((item.amount as any).fee) || Number((item.amount as any).amount) || Number((item.amount as any).value) || 0;
                      } else {
                        amount = Number(item.amount) || 0;
                      }
                    }
                    if (amount === 0 && item?.fee !== undefined) {
                      if (typeof item.fee === 'number') {
                        amount = item.fee;
                      } else if (typeof item.fee === 'object' && item.fee !== null) {
                        amount = Number((item.fee as any).fee) || Number((item.fee as any).amount) || Number((item.fee as any).value) || 0;
                      } else {
                        amount = Number(item.fee) || 0;
                      }
                    }
                    return {
                      id: String(item?.id || `item-${Math.random()}`),
                      description: String(item?.description || item?.name || 'Service'),
                      amount: amount, // Always a number, never an object
                    };
                  })
              : null,
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
          onUpdate={handleBookingUpdate}
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
