"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
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
  HelpCircle,
  MessageSquare,
  Sparkles,
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
import { getWorkflowBadgeClass, PHASE_STEPS, getPhaseStepIndex } from "@/lib/workflow-stage";
import { AdminFooter } from "@/components/admin/AdminFooter";
import { TeamAssignment } from "@/components/admin/TeamAssignment";
import { TechnicalEquipment } from "@/components/admin/TechnicalEquipment";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { deduplicateName, getDisplayName } from "@/lib/utils/name-helpers";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { debug } from "@/lib/debug";
import { SanitizedBooking, toDisplayFee } from "@/lib/transformers/booking-transformer";
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
  const quoteBuilderSectionRef = useRef<HTMLDivElement>(null);
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
      const response = await fetch(`/api/admin/bookings/${booking.id}/handoff/`, {
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

  const handleDelete = async () => {
    if (!booking) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}/`, {
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

  // Normalize so agreedFee is always a number (never { fee }) to avoid "Objects are not valid as a React child"
  const staffAssignments = (booking.staffAssignments ?? []).map((a) => ({
    ...a,
    agreedFee: toDisplayFee((a as { agreedFee?: unknown }).agreedFee),
  }));

  const phoneNumber = getPhoneNumber();
  const googleMapsUrl = getGoogleMapsUrl();

  // Phase-based Command Center: Enquiry vs Confirmed/Paid
  const depositReceived = !!(booking.depositReceived || (booking as { depositReceivedManual?: boolean })?.depositReceivedManual);
  const isEnquiry = booking.status === "pending" || !depositReceived;
  const isConfirmedOrPaid = booking.status === "confirmed" || depositReceived;

  const scrollToQuoteBuilder = () => quoteBuilderSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const isNewEnquiry = booking.workflowStage === "new_enquiry";
  const phaseStepIndex = getPhaseStepIndex(booking);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Safe Mode Warning Banner */}
      {isFallbackMode && (
        <div className="sticky top-0 z-[60] bg-amber-100 border-b border-amber-400 shadow-sm">
          <div className="container mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="flex-1 text-center">
                <p className="text-amber-900 font-semibold text-sm">
                  Safe Mode Active: Limited data loaded due to database sync issues
                </p>
                <p className="text-amber-800/80 text-xs mt-1">
                  Staff assignments and other relation data will appear once the database push succeeds
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Sticky Header: Client Names + Event Date */}
      <div className={`sticky ${isFallbackMode ? "top-[72px]" : "top-0"} z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 shadow-sm`}>
        <div className="container mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/admin/bookings">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>

            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white">
                  {isEnquiry ? `Enquiry: ${deduplicateName(getDisplayName(booking.name) || booking.name)}` : deduplicateName(getDisplayName(booking.name) || booking.name)}
                </h1>
                {isNewEnquiry && (
                  <span className="inline-flex h-3 w-3 rounded-full bg-amber-500 animate-pulse" title="Booking Request Received" aria-hidden />
                )}
                {booking.eventType && (
                  <span className="border border-amber-400/60 text-amber-200 text-xs uppercase tracking-widest px-2 py-1 rounded bg-amber-500/20">
                    {booking.eventType}
                  </span>
                )}
                {booking.confirmedViaBookFromQuote && (
                  <span className="border border-emerald-400 bg-emerald-500/20 text-emerald-200 text-xs uppercase tracking-widest px-2 py-1 rounded font-semibold">
                    Confirmed via Book-from-Quote
                  </span>
                )}
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="font-bold text-gray-200 text-lg">
                    {formatEventDate(booking.eventDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-600 px-4">
                  <span className="text-lg">📍</span>
                  <span className="font-semibold text-gray-400">{booking.venueName || "TBD"}</span>
                  {booking.venuePostcode && (
                    <span className="font-bold text-amber-400 ml-2">{booking.venuePostcode}</span>
                  )}
                </div>
              </div>
              {/* Quick Actions bar */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-600">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-amber-400 text-amber-200 hover:bg-amber-500/20"
                  onClick={scrollToQuoteBuilder}
                >
                  Send Quote
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-amber-400 text-amber-200 hover:bg-amber-500/20"
                  onClick={async () => {
                    if (!booking?.email) return;
                    setSendingDepositInvoice(true);
                    try {
                      const res = await fetch(`/api/admin/bookings/${booking.id}/send-deposit-invoice/`, { method: "POST" });
                      const data = await res.json();
                      if (res.ok) {
                        await handleBookingUpdate();
                        toast({ title: "Deposit invoice sent", description: `Email sent to ${deduplicateName(getDisplayName(booking.name) || booking.name)}` });
                      } else throw new Error(data?.error ?? "Failed to send");
                    } catch (e: unknown) {
                      toast({ title: "Error", description: (e as Error)?.message ?? "Failed to send", variant: "destructive" });
                    } finally {
                      setSendingDepositInvoice(false);
                    }
                  }}
                  disabled={sendingDepositInvoice || !booking?.email}
                >
                  {sendingDepositInvoice ? "Sending…" : "Send Deposit Invoice"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-emerald-400 text-emerald-200 hover:bg-emerald-500/20"
                  onClick={async () => {
                    if (!booking?.email) return;
                    setSendingFinalizeInvite(true);
                    try {
                      const res = await fetch(`/api/admin/bookings/${booking.id}/finalize-and-invite/`, { method: "POST" });
                      const data = await res.json();
                      if (res.ok) {
                        await handleBookingUpdate();
                        if (data.skipped) toast({ title: "Portal invite not sent", description: data.message || "Deposit already confirmed." });
                        else toast({ title: "Portal invite sent", description: `Sign-in link sent to ${deduplicateName(getDisplayName(booking.name) || booking.name)}.` });
                      } else throw new Error(data?.error || "Failed to send");
                    } catch (e: unknown) {
                      toast({ title: "Error", description: (e as Error)?.message ?? "Failed to send", variant: "destructive" });
                    } finally {
                      setSendingFinalizeInvite(false);
                    }
                  }}
                  disabled={sendingFinalizeInvite || !booking?.email}
                >
                  {sendingFinalizeInvite ? "Sending…" : "Portal Link"}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowEditModal(true)}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 font-semibold"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit booking
              </Button>
              <Button
                onClick={() => router.push(`/admin/bookings/${booking.id}/brief`)}
                variant="outline"
                size="sm"
                className="border-amber-400 text-amber-700 hover:bg-amber-50 font-semibold"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Master Brief
              </Button>
              <Button
                onClick={() => handleHandoff("ali")}
                variant={booking.assignedTo === "ali" || booking.assignedTo === "wife" ? "default" : "outline"}
                size="sm"
                className={booking.assignedTo === "ali" || booking.assignedTo === "wife" ? "bg-blue-600 hover:bg-blue-700 text-white" : "border-blue-400 text-blue-700 hover:bg-blue-50"}
              >
                🙋‍♀️ {wifeName}
              </Button>
              <Button
                onClick={() => handleHandoff("husband")}
                variant={booking.assignedTo === "husband" ? "default" : "outline"}
                size="sm"
                className={booking.assignedTo === "husband" ? "bg-purple-600 hover:bg-purple-700 text-white" : "border-purple-400 text-purple-700 hover:bg-purple-50"}
              >
                🛠️ {yourName}
              </Button>
              <Button
                onClick={() => setIsSidebarOpen(true)}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            {staffAssignments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 border-t border-gray-200 pt-2">
                {staffAssignments.map((assignment) => (
                  <span key={assignment.id} className="text-xs font-bold text-amber-700">
                    {assignment.role?.toLowerCase().includes("dj") ? "🎧" : "💡"} {assignment.staff.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Phase Tracker: hairline, current step muted gold/charcoal */}
        <div className="border-t border-gray-700 bg-gray-800/80">
          <div className="container mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center justify-center gap-0 flex-wrap" aria-label="Phase progress">
              {PHASE_STEPS.map((label, i) => {
                const isCurrent = i === phaseStepIndex;
                const isPast = i < phaseStepIndex;
                return (
                  <span key={label} className="flex items-center">
                    <span
                      className={`px-2 sm:px-3 py-1 text-xs font-medium rounded transition-colors ${
                        isCurrent ? "bg-amber-500/20 text-amber-200 border border-amber-400/60" : isPast ? "text-gray-400 bg-gray-700 border border-gray-600" : "text-gray-500 border border-transparent"
                      }`}
                    >
                      {label}
                    </span>
                    {i < PHASE_STEPS.length - 1 && (
                      <span className="w-3 sm:w-4 h-px bg-gray-600 mx-0.5" aria-hidden />
                    )}
                  </span>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* 2-Column Layout: Left = Booking/Production, Right = Sticky sidebar (What they want + Client Details + Emails) */}
      <div className="container mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Booking & Production Details */}
          <div className="lg:col-span-8 space-y-4">
            {/* Confirmed/Paid: Team Assignment & Artist Worksheet at top */}
            {isConfirmedOrPaid && (
              <>
                <TeamAssignment
                  bookingId={booking.id}
                  staffAssignments={staffAssignments}
                  onUpdate={handleBookingUpdate}
                />
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
              </>
            )}

            {/* Lead Insight – highlighted when Enquiry */}
            {(booking.message?.trim() || (booking.preferredDJ && booking.preferredDJ.trim()) || (Array.isArray(booking.services) && booking.services.length > 0) || (Array.isArray(booking.upsellItems) && booking.upsellItems.length > 0)) && (
              <Card className={`bg-slate-800/40 border-slate-600/50 shadow-sm ${isEnquiry ? "ring-2 ring-champagne-gold/50" : ""}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-champagne-gold" />
                    Lead Insight
                  </CardTitle>
                  <p className="text-xs text-gray-400">Add these to the quote below</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preferred DJ / Artist – prominent (applies to DJs and musicians) */}
                  {booking.preferredDJ && booking.preferredDJ.trim() && (
                    <div>
                      <p className="text-xs font-semibold text-champagne-gold uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Radio className="w-3.5 h-3.5" />
                        Preferred DJ / Artist
                      </p>
                      <div className="p-4 rounded-lg bg-champagne-gold/15 border-2 border-champagne-gold/50 text-white text-lg font-medium">
                        {booking.preferredDJ.trim()}
                      </div>
                    </div>
                  )}
                  {/* Message – always shown so you see what they asked for */}
                  <div>
                    <p className="text-xs font-semibold text-champagne-gold uppercase tracking-wider mb-2 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message
                    </p>
                    <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white whitespace-pre-wrap text-sm leading-relaxed">
                      {booking.message?.trim() ? booking.message.trim() : "—"}
                    </div>
                  </div>
                  {((Array.isArray(booking.services) && booking.services.length > 0) || (Array.isArray(booking.upsellItems) && booking.upsellItems.length > 0)) && (
                    <div>
                      <p className="text-xs font-semibold text-champagne-gold uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" />
                        Items they’re interested in
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(booking.services) && booking.services.map((s) => {
                          const label = typeof s === "string" ? (s === "dj" ? "DJ" : s === "lighting" ? "Lighting" : s === "musicians" ? "Live musicians" : s.charAt(0).toUpperCase() + s.slice(1)) : String(s);
                          return (
                            <button
                              key={`service-${label}`}
                              type="button"
                              onClick={scrollToQuoteBuilder}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-champagne-gold/25 text-champagne-gold border border-champagne-gold/40 hover:bg-champagne-gold/40 transition-colors cursor-pointer"
                            >
                              {label === "DJ" && "🎧 "}
                              {label === "Lighting" && "💡 "}
                              {label === "Live musicians" && "🎵 "}
                              {label}
                            </button>
                          );
                        })}
                        {Array.isArray(booking.upsellItems) && booking.upsellItems.map((u) => {
                          const label = typeof u === "string"
                            ? (u === "lighting" ? "Lighting" : u === "musicians" ? "Musicians" : u === "fire-pits" ? "Fire pits" : u === "venue-styling" ? "Venue styling" : u.charAt(0).toUpperCase() + u.slice(1).replace(/-/g, " "))
                            : String(u);
                          return (
                            <button
                              key={`upsell-${label}`}
                              type="button"
                              onClick={scrollToQuoteBuilder}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors cursor-pointer"
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* No message/items yet – prompt to add so you know what to quote */}
            {(!booking.message?.trim() && !(booking.preferredDJ && booking.preferredDJ.trim()) && (!Array.isArray(booking.services) || booking.services.length === 0) && (!Array.isArray(booking.upsellItems) || booking.upsellItems.length === 0)) && (
              <Card className="bg-gray-800/80 border border-dashed border-gray-600">
                <CardContent className="py-4">
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    No message or items yet.{" "}
                    <button
                      type="button"
                      onClick={() => setShowEditModal(true)}
                      className="text-champagne-gold hover:text-champagne-gold/80 font-medium underline"
                    >
                      Add in Edit
                    </button>{" "}
                    (Additional message, services & upsells) so you know what to build the quote for.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quote Builder – scroll target; highlighted when Enquiry */}
            <Card ref={quoteBuilderSectionRef} className={`bg-gray-800 border-champagne-gold/30 ${getSectionBgColor()} transition-colors ${isEnquiry ? "ring-2 ring-champagne-gold/50" : ""}`}>
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
                  quoteSentAt={booking.artistQuoteSentAt ?? undefined}
                  onSend={handleBookingUpdate}
                />
              </CardContent>
            </Card>

            {/* Send booking deposit — priority action */}
            <Card className={`bg-gray-800 border-amber-500/20 ${getSectionBgColor()} transition-colors`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-amber-500" />
                    Send booking deposit
                  </CardTitle>
                  {booking.workflowStage && booking.workflowLabel && (
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getWorkflowBadgeClass(booking.workflowStage)}`}
                      title="Workflow stage"
                    >
                      {booking.workflowLabel}
                    </span>
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-amber-500 rounded-full"
                        aria-label="Workflow help"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4 text-sm text-gray-200 border-amber-500/30" align="start">
                      <p className="font-medium text-amber-200/90 mb-2">Workflow</p>
                      <p>
                        Send deposit invoice → Mark deposit received (sends confirmation) → Invite to portal (sends sign-in link). Reminder sent if they don&apos;t open within 3 days.
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
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
                        const res = await fetch(`/api/admin/bookings/${booking.id}/send-deposit-invoice/`, { method: "POST" });
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

                {/* Deposit Received Toggle – flashing red when client reported, static green when manually confirmed */}
                {(() => {
                  const needsConfirmation = !!booking.depositPaidClickedAt && !booking.depositReceivedManual;
                  const confirmed = !!booking.depositReceivedManual;
                  return (
                    <div
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        needsConfirmation
                          ? "bg-gray-900/70 border-red-500/60 hover:border-red-500/80"
                          : confirmed
                            ? "bg-gray-900/70 border-emerald-500/40 hover:border-emerald-500/50"
                            : "bg-gray-900/70 border-gray-600 hover:border-amber-500/30"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-block h-3 w-3 rounded-full shrink-0 ${
                            confirmed
                              ? "bg-emerald-500"
                              : needsConfirmation
                                ? "bg-red-500 animate-pulse"
                                : "bg-amber-500/70"
                          }`}
                          title={confirmed ? "Deposit confirmed" : needsConfirmation ? "Client reported paid – confirm when bank checked" : "Pending"}
                          aria-hidden
                        />
                        <Checkbox
                          id="depositReceivedManual"
                          checked={booking.depositReceivedManual || false}
                          onCheckedChange={async (checked) => {
                            try {
                              const response = await fetch(`/api/admin/bookings/${booking.id}/flexible-update/`, {
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
                          className="h-6 w-6 border-2 border-amber-500/50 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <label htmlFor="depositReceivedManual" className="text-white font-bold text-base cursor-pointer">
                          Deposit Received
                        </label>
                      </div>
                      <Badge
                        className={
                          confirmed
                            ? "bg-emerald-500/30 text-emerald-400 border-2 border-emerald-500/50 font-bold"
                            : needsConfirmation
                              ? "bg-red-500/30 text-red-400 border-2 border-red-500/50 font-bold"
                              : "bg-amber-500/30 text-amber-400 border-2 border-amber-500/50 font-bold"
                        }
                      >
                        {confirmed ? "Paid" : needsConfirmation ? "Client reported – confirm" : "Pending"}
                      </Badge>
                    </div>
                  );
                })()}

                {/* Client reported paid (from "I've paid" in email) – flash until admin confirms deposit received */}
                {booking.depositPaidClickedAt && (
                  <p className="text-xs text-amber-400/90 mt-1">
                    Client reported paid: {new Date(booking.depositPaidClickedAt).toLocaleString("en-GB", {
                      weekday: "short", day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                    {!booking.depositReceivedManual && " — confirm when bank checked."}
                  </p>
                )}

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
                    Send portal invite (sign-in link) before deposit is confirmed. Once deposit is confirmed, the client already gets the portal link in the Deposit confirmed email — no need to send this.
                  </p>
                  <Button
                    onClick={async () => {
                      if (!booking?.email) return;
                      setSendingFinalizeInvite(true);
                      try {
                        const res = await fetch(`/api/admin/bookings/${booking.id}/finalize-and-invite/`, { method: "POST" });
                        const data = await res.json();
                        if (res.ok) {
                          await handleBookingUpdate();
                          if (data.skipped) {
                            toast({
                              title: "Portal invite not sent",
                              description: data.message || "Deposit already confirmed; client already has portal access from that email.",
                            });
                          } else {
                            const clientName = deduplicateName(getDisplayName(booking.name) || booking.name);
                            toast({
                              title: "Portal invite sent",
                              description: `Sign-in link sent to ${clientName}. They can sign in with their credentials to open their portal.`,
                            });
                          }
                        } else {
                          throw new Error(data?.error || "Failed to send portal invite");
                        }
                      } catch (e: any) {
                        toast({
                          title: "Error",
                          description: e?.message || "Failed to send portal invite",
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
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send portal invite (sign-in link)
                      </>
                    )}
                  </Button>
                  {(booking.depositReceivedManual || false) && (
                    <p className="text-xs text-amber-400/90 mt-2">Deposit already confirmed — client has portal link from that email. Use &quot;Send portal link&quot; below only to resend a sign-in link.</p>
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

          {/* Right Column: Client Info & Emails */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-4">
              {/* Client Info – name, email, phone, contact pref */}
              <Card className="bg-gray-800 border-champagne-gold/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-white">Client Info</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEditModal(true)}
                      className="text-gray-400 hover:text-champagne-gold"
                      title="Edit client & venue"
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
                    <a href={`mailto:${booking.email}`} className="text-champagne-gold hover:text-champagne-gold/80 flex items-center gap-2">
                      {booking.email}
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                  {phoneNumber && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Phone</p>
                      <a href={`tel:${phoneNumber}`} className="text-champagne-gold hover:text-champagne-gold/80 flex items-center gap-2">
                        {phoneNumber}
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                  {booking.contactPreference && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Preferred Contact</p>
                      <p className="text-white text-sm">{booking.contactPreference}</p>
                    </div>
                  )}
                  {booking.preferredDJ && booking.preferredDJ.trim() && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Preferred DJ / Artist</p>
                      <p className="text-champagne-gold font-medium">{booking.preferredDJ.trim()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

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

              {/* Production: accordion when Enquiry, expanded when Confirmed/Paid */}
              {isEnquiry ? (
                <Accordion type="single" defaultValue="" className="border border-gray-700 rounded-lg bg-gray-800/50">
                  <AccordionItem value="production">
                    <AccordionTrigger className="px-4 py-3 text-base font-semibold text-white hover:no-underline">
                      Production
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 space-y-4">
                      {hasDJService && (
                        <>
                          <Card className="bg-gray-800/80 border-champagne-gold/20">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base font-semibold text-white">Artist Worksheet</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ArtistDispatch bookingId={booking.id} booking={booking} onUpdate={handleBookingUpdate} />
                            </CardContent>
                          </Card>
                          <Card className="bg-gray-800/80 border-champagne-gold/20">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base font-semibold text-white">DJ Worksheet</CardTitle>
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
                        </>
                      )}
                      <Card className="bg-gray-800/80 border-champagne-gold/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                            <Package className="w-4 h-4 text-amber-500" />
                            Technical Equipment
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <TechnicalEquipment bookingId={booking.id} onUpdate={handleBookingUpdate} />
                        </CardContent>
                      </Card>
                      <TeamAssignment
                        bookingId={booking.id}
                        staffAssignments={staffAssignments}
                        onUpdate={handleBookingUpdate}
                      />
                      <CrewAssignments
                        bookingId={booking.id}
                        venueName={booking.venueName}
                        eventDate={booking.eventDate}
                        djArrivalTime={booking.djArrivalTime}
                        djStartTime={booking.djStartTime}
                        staffAssignments={staffAssignments}
                        onUpdate={handleBookingUpdate}
                      />
                      <Card className="bg-gray-800/80 border-champagne-gold/20">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold text-white">Team</CardTitle>
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
                            <div className="space-y-2">
                              {staffAssignments.map((a) => (
                                <div key={a.id} className="flex items-center gap-2 text-sm text-white">
                                  <span>{a.role?.toLowerCase().includes("dj") ? "🎧" : "💡"}</span>
                                  {a.staff.name}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-sm">No staff assigned yet</p>
                          )}
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <>
                  {/* Confirmed/Paid: Production sections visible (no accordion); Artist Worksheet is on left at top */}
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
                  <TeamAssignment
                    bookingId={booking.id}
                    staffAssignments={staffAssignments}
                    onUpdate={handleBookingUpdate}
                  />
                  <CrewAssignments
                    bookingId={booking.id}
                    venueName={booking.venueName}
                    eventDate={booking.eventDate}
                    djArrivalTime={booking.djArrivalTime}
                    djStartTime={booking.djStartTime}
                    staffAssignments={staffAssignments}
                    onUpdate={handleBookingUpdate}
                  />
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
                </CardContent>
              </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin footer: thin line + Last updated from booking */}
      <AdminFooter updatedAt={booking.updatedAt ?? undefined} />

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-champagne-gold/30" aria-describedby="edit-booking-desc">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Edit Booking Details</DialogTitle>
            <DialogDescription id="edit-booking-desc" className="text-base text-gray-400 font-normal mt-1">
              Update client, venue, timings, and message. Venue name and postcode are free text—type anything or use Quick select. Click <strong className="text-champagne-gold">Save Changes</strong> when done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">Client Name</label>
                <input
                  id="edit-name"
                  type="text"
                  defaultValue={booking.name}
                  className="w-full px-4 py-3 text-base bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">Email</label>
                <input
                  id="edit-email"
                  type="email"
                  defaultValue={booking.email}
                  className="w-full px-4 py-3 text-base bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">Phone Area Code</label>
                <input
                  id="edit-phoneAreaCode"
                  type="text"
                  defaultValue={booking.phoneAreaCode || ""}
                  className="w-full px-4 py-3 text-base bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  id="edit-phoneNumber"
                  type="text"
                  defaultValue={booking.phoneNumber || ""}
                  className="w-full px-4 py-3 text-base bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
              <div className="col-span-2">
                <h4 className="text-base font-semibold text-amber-500/90 mb-2">Client home address</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Address</label>
                    <input
                      id="edit-clientAddress"
                      type="text"
                      defaultValue={(booking as any).clientAddress || ""}
                      className="w-full px-4 py-3 text-base bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Address 2</label>
                    <input
                      id="edit-clientAddress2"
                      type="text"
                      defaultValue={(booking as any).clientAddress2 || ""}
                      className="w-full px-4 py-3 text-base bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Town</label>
                    <input
                      id="edit-clientTown"
                      type="text"
                      defaultValue={(booking as any).clientTown || ""}
                      className="w-full px-4 py-3 text-base bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">County</label>
                    <input
                      id="edit-clientCounty"
                      type="text"
                      defaultValue={(booking as any).clientCounty || ""}
                      className="w-full px-4 py-3 text-base bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Postcode</label>
                    <input
                      id="edit-clientPostcode"
                      type="text"
                      defaultValue={(booking as any).clientPostcode || ""}
                      className="w-full px-4 py-3 text-base bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">Event Date</label>
                <input
                  id="edit-eventDate"
                  type="datetime-local"
                  defaultValue={new Date(booking.eventDate).toISOString().slice(0, 16)}
                  className="w-full px-4 py-3 text-base bg-gray-900 border border-amber-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">Quick select venue</label>
                <select
                  id="edit-venueSelect"
                  className="w-full px-4 py-3 text-base bg-gray-900 border border-amber-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  onChange={async (e) => {
                    const v = e.target.value;
                    if (!v) return;
                    const [name, postcode] = v.includes("\t") ? v.split("\t") : [v, ""];
                    const vn = document.getElementById("edit-venueName") as HTMLInputElement;
                    const vp = document.getElementById("edit-venuePostcode") as HTMLInputElement;
                    if (vn) vn.value = name;
                    if (vp) vp.value = postcode;
                    try {
                      const res = await fetch(`/api/admin/venues/?name=${encodeURIComponent(name)}`);
                      const data = await res.json();
                      const list: { venueName?: string; defaultCeremonyTime?: string; defaultFinishTime?: string; venueNotes?: string }[] = data.venues || [];
                      const match = list.find((x) => (x.venueName || "").toLowerCase() === name.toLowerCase()) || list[0];
                      if (!match) return;
                      if (match.venueName) {
                        const nameEl = document.getElementById("edit-venueName") as HTMLInputElement;
                        if (nameEl) nameEl.value = match.venueName;
                      }
                      if (match.defaultCeremonyTime) {
                        const ceremonyEl = document.getElementById("edit-ceremonyTime") as HTMLInputElement;
                        if (ceremonyEl) ceremonyEl.value = match.defaultCeremonyTime;
                      }
                      if (match.defaultFinishTime) {
                        const finishEl = document.getElementById("edit-djFinishTime") as HTMLInputElement;
                        if (finishEl) finishEl.value = match.defaultFinishTime;
                      }
                      if (match.venueNotes) {
                        const msgEl = document.getElementById("edit-message") as HTMLTextAreaElement;
                        if (msgEl) msgEl.value = match.venueNotes;
                      }
                    } catch {
                      /* ignore */
                    }
                  }}
                >
                  <option value="">Select venue</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.venuePostcode ? `${v.venueName}\t${v.venuePostcode}` : v.venueName}>
                      {v.venuePostcode ? `${v.venueName}, ${v.venuePostcode}` : v.venueName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">Venue Name</label>
                <input
                  id="edit-venueName"
                  type="text"
                  defaultValue={booking.venueName ?? ""}
                  className="w-full px-4 py-3 text-base bg-gray-900 border border-amber-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">Venue Postcode</label>
                <input
                  id="edit-venuePostcode"
                  type="text"
                  defaultValue={booking.venuePostcode ?? ""}
                  className="w-full px-4 py-3 text-base bg-gray-900 border border-amber-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                      if (venueMatch.venueName) {
                        const nameEl = document.getElementById("edit-venueName") as HTMLInputElement;
                        if (nameEl) nameEl.value = venueMatch.venueName;
                      }
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
                      const det = detailsData?.venue as { venuePostcode?: string; venueLoadInNotes?: string } | undefined;
                      if (det?.venuePostcode || det?.venueLoadInNotes) {
                        if (det.venuePostcode) {
                          const postcodeEl = document.getElementById("edit-venuePostcode") as HTMLInputElement;
                          if (postcodeEl) postcodeEl.value = det.venuePostcode;
                        }
                        if (det.venueLoadInNotes) {
                          const msgEl = document.getElementById("edit-message") as HTMLTextAreaElement;
                          if (msgEl) msgEl.value = det.venueLoadInNotes;
                        }
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
                <label className="block text-base font-medium text-gray-300 mb-2">Ceremony start</label>
                <input
                  id="edit-ceremonyTime"
                  type="time"
                  defaultValue={booking.ceremonyTime ? new Date(booking.ceremonyTime).toISOString().slice(11, 16) : ""}
                  className="w-full px-4 py-3 text-base bg-gray-900 border border-amber-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">Artist start</label>
                <input
                  id="edit-djStartTime"
                  type="time"
                  defaultValue={booking.djStartTime || ""}
                  className="w-full px-4 py-3 text-base bg-gray-900 border border-amber-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">Artist end</label>
                <input
                  id="edit-djFinishTime"
                  type="time"
                  defaultValue={booking.djFinishTime || ""}
                  className="w-full px-4 py-3 text-base bg-gray-900 border border-amber-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">Number of Guests</label>
                <input
                  id="edit-numberOfGuests"
                  type="number"
                  defaultValue={booking.numberOfGuests || ""}
                  className="w-full px-4 py-3 text-base bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
                />
              </div>
            </div>
            <div>
              <label className="block text-base font-medium text-gray-300 mb-2">Additional Message</label>
              <textarea
                id="edit-message"
                defaultValue={booking.message || ""}
                rows={4}
                className="w-full px-4 py-3 text-base bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold"
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
                    const numberOfGuestsRaw = get("edit-numberOfGuests");
                    const numberOfGuests = numberOfGuestsRaw === "" ? null : parseInt(numberOfGuestsRaw, 10);
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
                      if (numberOfGuests !== null && !isNaN(numberOfGuests)) clientPayload.numberOfGuests = numberOfGuests;
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
            bookingFee: (booking as any).bookingFee ?? null,
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
