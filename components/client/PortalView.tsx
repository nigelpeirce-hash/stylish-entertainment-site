"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Mail, Phone, Users, AlertCircle, Headphones, Sparkles, CheckCircle2, ShieldCheck, Mic, ChevronDown, Banknote, FileText, Music, HelpCircle } from "lucide-react";
import { getGreetingName, deduplicateName, getDisplayName } from "@/lib/utils/name-helpers";
import Image from "next/image";
import Link from "next/link";
import { sanitizeCloudinaryUrl } from "@/lib/cloudinary-utils";
import confetti from "canvas-confetti";
import GuestRequestsView from "@/components/client/GuestRequestsView";
import { AcceptTermsModule } from "@/components/AcceptTermsModule";
import { toSafeDisplayString, toSafeReactChild } from "@/lib/transformers/booking-transformer";
import { ContractFooter } from "@/components/client/ContractFooter";
import PortalCountdownClock from "@/components/client/PortalCountdownClock";
import HeroPhotoSection from "@/components/client/HeroPhotoSection";
import ClientMusicModule from "@/components/client/ClientMusicModule";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function stripReferralFromMessage(msg: string | null | undefined): string {
  if (!msg || typeof msg !== "string") return "";
  return msg.replace(/\n\nHow did you hear about us: [^\n]+/i, "").trim();
}

function formatClientPhone(area: string | null | undefined, num: string | null | undefined): string {
  if (!area && !num) return "";
  return [area, num].filter(Boolean).join(" ").trim();
}

function parsePhone(value: string): { phoneAreaCode: string | null; phoneNumber: string | null } {
  const cleaned = value.replace(/\s+/g, "").trim();
  if (!cleaned) return { phoneAreaCode: null, phoneNumber: null };
  if (cleaned.startsWith("0")) {
    if (cleaned.startsWith("07")) {
      return { phoneAreaCode: cleaned.slice(0, 4), phoneNumber: cleaned.slice(4) || null };
    }
    return { phoneAreaCode: cleaned.slice(0, 3), phoneNumber: cleaned.slice(3) || null };
  }
  return { phoneAreaCode: null, phoneNumber: cleaned };
}

interface StaffAssignment {
  id: string;
  role: string;
  status: string;
  staff: {
    id: string;
    name: string;
    email: string | null;
    imageUrl?: string | null; // Profile photo URL (Cloudinary/S3)
    bio?: string | null; // Optional bio field if added to schema
  };
}

interface Booking {
  id: string;
  name: string;
  email: string;
  phoneAreaCode?: string | null;
  phoneNumber?: string | null;
  eventDate: Date;
  ceremonyTime?: Date | null;
  venueName: string | null;
  venuePostcode: string | null;
  venueNotes?: string | null;
  googleMapsUrl?: string | null;
  status: string;
  depositReceived?: boolean | null;
  depositReceivedManual?: boolean | null;
  finalDetailsConfirmed?: boolean | null;
  message?: string | null;
  eventType: string | null;
  numberOfGuests: number | null;
  services: string[];
  upsellItems?: string[];
  djStartTime: string | null;
  djFinishTime: string | null;
  musicRequests?: string | null;
  musicDislikes?: string | null;
  firstDance?: string | null;
  lastSong?: string | null;
  musicNotesToDJ?: string | null;
  musicFileUrl?: string | null;
  portalHeroImageUrl?: string | null;
  venueWhat3Words?: string | null;
  venueLoadInNotes?: string | null;
  clientAddress?: string | null;
  clientAddress2?: string | null;
  clientTown?: string | null;
  clientCounty?: string | null;
  clientPostcode?: string | null;
  staffAssignments?: StaffAssignment[];
  guestRequestToken?: string | null;
  guestRequestsEnabled?: boolean;
  termsAccepted?: boolean;
  termsAcceptedAt?: Date | string | null;
  guestRequests?: Array<{
    id: string;
    songTitle?: string | null;
    artist?: string | null;
    trackName?: string;
    artistName?: string;
    albumArtUrl?: string | null;
    spotifyUrl?: string | null;
    guestName: string | null;
    note?: string | null;
    status: string;
  }>;
  User?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface PaymentDetailsStaff {
  id: string;
  name: string;
  email: string | null;
  role: string;
  accountNumber: string | null;
  sortCode: string | null;
}

interface PortalViewProps {
  booking: Booking;
  isPreview?: boolean;
  baseUrl?: string;
  eventPassed?: boolean;
}

// Bio truncation component with Read More toggle
function BioSection({ bio }: { bio: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxChars = 100;
  const shouldTruncate = bio.length > maxChars;

  return (
    <div className="mt-3 w-full">
      <div
        className={`text-xs text-gray-400 leading-relaxed transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[500px]' : 'max-h-[3rem]'
        }`}
      >
        <p className={isExpanded ? '' : 'line-clamp-2'}>
          {bio}
        </p>
      </div>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-amber-500/80 hover:text-amber-500 transition-colors duration-200 flex items-center gap-1 text-xs font-medium mx-auto"
        >
          {isExpanded ? (
            <>
              Show Less
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 rotate-180`} />
            </>
          ) : (
            <>
              Read More
              <ChevronDown className={`w-3 h-3 transition-transform duration-300`} />
            </>
          )}
        </button>
      )}
    </div>
  );
}

const POLL_INTERVAL_MS = 25_000;
const STORAGE_KEY_EVENT_DATE = "stylishentertainment_event_date";

export default function PortalView({ booking: initialBooking, isPreview = false, baseUrl = "", eventPassed = false }: PortalViewProps) {
  const [booking, setBooking] = useState<Booking>(initialBooking);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const confettiTriggered = useRef(false);
  const [paymentDetails, setPaymentDetails] = useState<{ staff: PaymentDetailsStaff[] } | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [submittingFinalDetails, setSubmittingFinalDetails] = useState(false);
  const [submittingPaymentSent, setSubmittingPaymentSent] = useState(false);
  const [portalTermsAccepted, setPortalTermsAccepted] = useState(false);
  const [acceptingTerms, setAcceptingTerms] = useState(false);
  const [finalDetailsNotes, setFinalDetailsNotes] = useState(stripReferralFromMessage(initialBooking.message) || "");
  const [clientPhone, setClientPhone] = useState(formatClientPhone(initialBooking.phoneAreaCode, initialBooking.phoneNumber));
  const [venueWhat3Words, setVenueWhat3Words] = useState(initialBooking.venueWhat3Words ?? "");
  const [venueLoadInNotes, setVenueLoadInNotes] = useState(initialBooking.venueLoadInNotes ?? "");
  const [clientAddress, setClientAddress] = useState(initialBooking.clientAddress ?? "");
  const [clientAddress2, setClientAddress2] = useState(initialBooking.clientAddress2 ?? "");
  const [clientTown, setClientTown] = useState(initialBooking.clientTown ?? "");
  const [clientCounty, setClientCounty] = useState(initialBooking.clientCounty ?? "");
  const [clientPostcode, setClientPostcode] = useState(initialBooking.clientPostcode ?? "");
  const [numberOfGuests, setNumberOfGuests] = useState<string>(initialBooking.numberOfGuests != null ? String(initialBooking.numberOfGuests) : "");
  const [paymentSent, setPaymentSent] = useState(!!initialBooking.finalDetailsConfirmed);
  const [finalDetailsFeedback, setFinalDetailsFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [paymentFeedback, setPaymentFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [threads, setThreads] = useState<Array<{
    id: string;
    subject: string;
    lastMessageAt: string;
    emails: Array<{
      id: string;
      fromEmail: string;
      fromName: string | null;
      textContent: string | null;
      htmlContent: string | null;
      direction: string;
      receivedAt: string;
    }>;
  }>>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);

  // Sync from initial props when navigating to another booking or after refresh (e.g. staff assigned)
  useEffect(() => {
    setBooking(initialBooking);
    setFinalDetailsNotes(stripReferralFromMessage(initialBooking.message) || "");
    setClientPhone(formatClientPhone(initialBooking.phoneAreaCode, initialBooking.phoneNumber));
    setVenueWhat3Words(initialBooking.venueWhat3Words ?? "");
    setVenueLoadInNotes(initialBooking.venueLoadInNotes ?? "");
    setClientAddress(initialBooking.clientAddress ?? "");
    setClientAddress2(initialBooking.clientAddress2 ?? "");
    setClientTown(initialBooking.clientTown ?? "");
    setClientCounty(initialBooking.clientCounty ?? "");
    setClientPostcode(initialBooking.clientPostcode ?? "");
    setNumberOfGuests(initialBooking.numberOfGuests != null ? String(initialBooking.numberOfGuests) : "");
    setPaymentSent(!!initialBooking.finalDetailsConfirmed);
  }, [initialBooking.id, initialBooking.staffAssignments?.length]);

  // Fetch guest requests on mount and when booking changes
  useEffect(() => {
    if (!booking.id) return;
    const fetchGuestRequests = async () => {
      try {
        const url = token
          ? `/api/client/bookings/${booking.id}?token=${encodeURIComponent(token)}`
          : `/api/client/bookings/${booking.id}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data?.booking?.guestRequests) {
            setBooking((prev) => ({ ...prev, guestRequests: data.booking.guestRequests }));
          }
        }
      } catch {
        /* ignore */
      }
    };
    fetchGuestRequests();
  }, [booking.id, token]);

  // Fetch communication history (threads) for this booking
  useEffect(() => {
    if (!booking.id) return;
    const url = token
      ? `/api/client/bookings/${booking.id}/threads?token=${encodeURIComponent(token)}`
      : `/api/client/bookings/${booking.id}/threads`;
    setLoadingThreads(true);
    fetch(url)
      .then((res) => (res.ok ? res.json() : { threads: [] }))
      .then((data) => setThreads(data.threads || []))
      .catch(() => setThreads([]))
      .finally(() => setLoadingThreads(false));
  }, [booking.id, token]);

  // Live sync: poll booking so Golden Countdown updates when admin edits venue/ceremony/finish
  useEffect(() => {
    const url = token
      ? `/api/client/bookings/${booking.id}?token=${encodeURIComponent(token)}`
      : `/api/client/bookings/${booking.id}`;

    const poll = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data?.booking) setBooking(data.booking as Booking);
        }
      } catch {
        /* ignore */
      }
    };

    poll(); // immediate fetch so countdown reflects latest admin edits
    const t = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, [booking.id, token]);

  const handleAcceptTerms = async () => {
    if (!portalTermsAccepted || acceptingTerms) return;
    setAcceptingTerms(true);
    try {
      const url = token
        ? `/api/client/bookings/${booking.id}/accept-terms?token=${encodeURIComponent(token)}`
        : `/api/client/bookings/${booking.id}/accept-terms`;
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        setBooking((prev) => ({ ...prev, termsAccepted: true, termsAcceptedAt: new Date() }));
      } else {
        alert(data?.error || "Failed to accept terms. Please try again.");
      }
    } catch {
      alert("Failed to accept terms. Please try again.");
    } finally {
      setAcceptingTerms(false);
    }
  };

  // Sync header countdown from this booking so "Countdown to Your Event" shows in client layout
  useEffect(() => {
    if (isPreview || !booking?.eventDate) return;
    const date = new Date(booking.eventDate);
    if (isNaN(date.getTime()) || date <= new Date()) return;
    const iso = typeof booking.eventDate === "string" ? booking.eventDate : date.toISOString();
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY_EVENT_DATE, iso);
      window.dispatchEvent(new Event("storage"));
    }
  }, [booking?.eventDate, isPreview]);

  // One-time confetti burst when deposit is received (wedding only; Party/Corporate: no confetti)
  const isSecured = !!(booking.depositReceived || booking.depositReceivedManual);
  const evType = (booking.eventType || "").toLowerCase();
  const isWedding = evType.includes("wedding");
  useEffect(() => {
    if (isWedding && isSecured && !confettiTriggered.current) {
      // Check sessionStorage to see if confetti has been shown for this booking
      const confettiKey = `confetti_shown_${booking.id}`;
      const hasShownConfetti = sessionStorage.getItem(confettiKey);
      
      if (!hasShownConfetti) {
        // Trigger canvas-confetti with champagne gold colors
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min: number, max: number) {
          return Math.random() * (max - min) + min;
        }

        const interval: NodeJS.Timeout = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          
          // Champagne gold confetti
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#d4af37', '#f4cf6d', '#ffffff'],
          });
          
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#d4af37', '#f4cf6d', '#ffffff'],
          });
        }, 250);

        // Mark as shown in sessionStorage
        sessionStorage.setItem(confettiKey, 'true');
        confettiTriggered.current = true;
      }
    }
  }, [isWedding, isSecured, booking.id]);

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const eventDate = new Date(booking.eventDate);
  const now = new Date();
  const daysUntilEvent = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const unlockThreeWeek = daysUntilEvent >= 0 && daysUntilEvent < 21;
  const isEmergencyWindow = daysUntilEvent >= 0 && daysUntilEvent <= 3; // 3 days or less

  useEffect(() => {
    if (!unlockThreeWeek || !booking.id) return;
    let done = false;
    setLoadingPayment(true);
    const url = token
      ? `/api/client/bookings/${booking.id}/payment-details?token=${encodeURIComponent(token)}`
      : `/api/client/bookings/${booking.id}/payment-details`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (!done && data.withinWindow && Array.isArray(data.staff)) {
          setPaymentDetails({ staff: data.staff });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!done) setLoadingPayment(false);
      });
    return () => { done = true; };
  }, [unlockThreeWeek, booking.id, token]);

  // Get greeting name with proper deduplication and formatting
  // Handles cases like "Tim & SarahTim & Sarah" → "Tim & Sarah"
  const greetingName = (() => {
    // First, deduplicate the name to remove any repeated patterns
    const deduplicated = deduplicateName(booking.name);
    // Then extract the greeting name (for couples, uses both names)
    const name = getGreetingName(deduplicated);
    // Capitalize first letter of each word for proper display
    // "MIKE & JOHN" -> "Mike & John"
    return name
      .split(/\s+/)
      .map(word => {
        // Preserve "&" and other special characters
        if (word === "&" || word === "and") return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  })();

  // Get all client-facing team members (DJs, Musicians, Band, Performer)
  // Talent Firewall: Musicians are treated exactly like DJs - both visible to clients
  const teamMembers = (booking.staffAssignments || []).filter((assignment) => {
    const role = assignment.role?.toLowerCase() || '';
    const isCrew = ['rigger', 'technician', 'crew', 'sound tech', 'lighting', 'production', 'styling'].some((c) => role.includes(c));
    if (isCrew) return false;
    return (
      role.includes('dj') ||
      role.includes('musician') ||
      role.includes('band') ||
      role.includes('host') ||
      role.includes('performer') ||
      role.includes('sax') ||
      role.includes('pianist') ||
      role.includes('guitarist') ||
      role.includes('harpist') ||
      role.includes('violinist')
    );
  });
  
  // Find DJ assignment for special handling if needed
  const djAssignment = teamMembers.find(
    (assignment) => assignment.role?.toLowerCase().includes('dj')
  );
  
  // Detect artist type for dynamic icon/badge display
  const getArtistType = (role: string) => {
    const r = role?.toLowerCase() || '';
    if (r.includes('dj')) return 'dj';
    if (r.includes('musician') || r.includes('sax') || r.includes('pianist') || r.includes('guitarist') || r.includes('harpist') || r.includes('violinist')) return 'musician';
    if (r.includes('band')) return 'band';
    return 'other';
  };

  const briefRecipientLabel = (() => {
    if (teamMembers.length === 0) return "your artist";
    const types = new Set(teamMembers.map((a) => getArtistType(a.role || "")));
    if (types.size > 1 || types.has("other")) return "your artist";
    if (types.has("dj")) return "your DJ";
    if (types.has("musician")) return "your musician";
    if (types.has("band")) return "your band";
    return "your artist";
  })();

  const briefRecipientLabelCapitalized = briefRecipientLabel.replace(/^your /, "Your ");

  const hasMusic = [
    (booking.firstDance ?? "").trim(),
    (booking.musicRequests ?? "").trim(),
    (booking.lastSong ?? "").trim(),
    (booking.musicDislikes ?? "").trim(),
    (booking.musicNotesToDJ ?? "").trim(),
    (booking.musicFileUrl ?? "").trim(),
  ].some((s) => s.length > 0);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  // Format time to 24-hour format with high-contrast gold
  const formatTime24h = (timeString: string | null): string => {
    if (!timeString) return "";
    
    // If already in 24-hour format (HH:MM), return as is
    const time24Pattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (time24Pattern.test(timeString)) {
      return timeString;
    }
    
    // If in 12-hour format (HH:MM AM/PM), convert to 24-hour
    const time12Pattern = /^([0-1]?[0-9]):([0-5][0-9])\s*(AM|PM)$/i;
    const match = timeString.match(time12Pattern);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const ampm = match[3].toUpperCase();
      
      if (ampm === "PM" && hours !== 12) {
        hours += 12;
      } else if (ampm === "AM" && hours === 12) {
        hours = 0;
      }
      
      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    }
    
    // If format is unknown, return as is
    return timeString;
  };

  // Format ceremony time for display
  const formatCeremonyTime = () => {
    // @ts-ignore - ceremonyTime may not exist until migration is run
    if (!booking.ceremonyTime) return null;
    // @ts-ignore
    const ceremonyDate = new Date(booking.ceremonyTime);
    return ceremonyDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const ceremonyTimeDisplay = formatCeremonyTime();

  return (
    <div className="portal-ui min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl relative">
        {/* User guide – ? help button top-right */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="absolute top-0 right-0 p-2 rounded-full text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
              aria-label="Portal guide"
            >
              <HelpCircle className="w-6 h-6" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                Client portal guide
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 text-gray-300 text-sm">
              <section>
                <h3 className="font-semibold text-amber-500/90 mb-2">Music</h3>
                <p className="mb-2">Add your must-plays, do-not-plays, first dance, last song, Spotify links, or upload a PDF/Word music list. Your DJ or musician sees everything you save once they&apos;re assigned. Update anytime.</p>
              </section>
              <section>
                <h3 className="font-semibold text-amber-500/90 mb-2">21-day Final Details</h3>
                <p className="mb-2">Within 21 days of your event, the &quot;Lock it in&quot; form appears. Complete your music first, then add any last notes and day-of contact number. When you submit, our team reviews everything and sends your full brief to your artist. You&apos;ll get a quick confirmation.</p>
              </section>
              <section>
                <h3 className="font-semibold text-amber-500/90 mb-2">Guest requests</h3>
                <p className="mb-2">Share the guest-request link so your guests can suggest songs. You control what gets played — approve or leave pending. Nothing goes live without your stamp of approval.</p>
              </section>
              <section>
                <h3 className="font-semibold text-amber-500/90 mb-2">Contract</h3>
                <p className="mb-2">View your booking agreement and terms at the bottom of this page. If you&apos;ve accepted terms, you can download a PDF. Otherwise, use the link to view the full Terms & Conditions.</p>
              </section>
            </div>
          </DialogContent>
        </Dialog>

        {/* Header Section */}
        <div className="mb-8 text-center">
          {/* Event Type Badge + subtle sparkles */}
          {booking.eventType && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-[portal-float_3s_ease-in-out_infinite]" />
              <span className="text-amber-500 text-xs uppercase tracking-[0.2em] font-medium">
                {booking.eventType}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-[portal-float_3s_ease-in-out_infinite]" style={{ animationDelay: "1.5s" }} />
            </div>
          )}
          
          {/* Milestone alert — 7 days out (subtle) */}
        {daysUntilEvent > 3 && daysUntilEvent <= 7 && !(booking.finalDetailsConfirmed || paymentSent) && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-amber-200 text-sm font-medium">
              Final tweaks are due this week — double-check your music and final details below ✨
            </p>
          </div>
        )}

          {/* Emergency Header - 3 Days Out (hide once final details submitted) */}
        {isEmergencyWindow && !(booking.finalDetailsConfirmed || paymentSent) && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-600/20 via-amber-600/20 to-red-600/20 border-2 border-red-500/50 rounded-lg animate-pulse">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 animate-pulse" />
              <div className="flex-1">
                <p className="text-red-300 font-bold text-lg mb-1">
                  Final Details Needed – Your Event Is in {daysUntilEvent} {daysUntilEvent === 1 ? "Day" : "Days"}
                </p>
                <p className="text-amber-200 text-sm">
                  Please confirm any last-minute changes, timings, or special requests. Use the form below or check your email for your magic link to access the portal.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Greeting + friendly tagline */}
          <h1 className="text-3xl mb-1">
            <span className="text-white font-light">Hello </span>
            <span className="text-amber-500 font-extralight tracking-[0.1em]">
              {greetingName || "there"}
            </span>
          </h1>
          <p className="text-amber-500/70 text-base font-light mb-2">
            {evType.includes("wedding")
              ? "Your big day is getting closer!"
              : evType.includes("party") || evType.includes("corporate")
                ? "Something special's around the corner!"
                : "We're so excited for you!"}
          </p>
          <p className="text-gray-400 text-sm font-light mb-6">
            Everything you need — stress-free 🎉
          </p>
        </div>

        {/* Retro Digital Countdown Clock */}
        <div className="mb-8 flex flex-col items-center gap-4 relative overflow-hidden rounded-xl">
          {booking.portalHeroImageUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25 blur-md -z-10"
              style={{ backgroundImage: `url(${booking.portalHeroImageUrl})` }}
            />
          )}
          <div className="w-full max-w-md">
            <PortalCountdownClock
              targetDate={
                isWedding && booking.ceremonyTime
                  ? new Date(booking.ceremonyTime as string | Date)
                  : new Date(booking.eventDate as string | Date)
              }
            />
          </div>
          {isWedding && ceremonyTimeDisplay && (
            <p className="text-sm text-amber-500/80 text-center font-light">
              Ceremony begins at {ceremonyTimeDisplay}
            </p>
          )}

          {/* Timeline visualisation */}
          {(ceremonyTimeDisplay || booking.djStartTime || booking.djFinishTime) && (
            <div className="mt-6 w-full max-w-md mx-auto">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 text-center">Your day</p>
              <div className="flex items-center gap-2">
                {ceremonyTimeDisplay && (
                  <div className="flex-1 min-w-0 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                    <p className="text-[10px] text-amber-500/70 uppercase">Ceremony</p>
                    <p className="text-sm font-medium text-white">{ceremonyTimeDisplay}</p>
                  </div>
                )}
                {(ceremonyTimeDisplay && booking.djStartTime) && (
                  <div className="w-4 h-0.5 bg-amber-500/30 flex-shrink-0" />
                )}
                {booking.djStartTime && (
                  <div className="flex-1 min-w-0 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                    <p className="text-[10px] text-amber-500/70 uppercase">{isWedding ? "First dance / party" : "Party"}</p>
                    <p className="text-sm font-medium text-white">{formatTime24h(booking.djStartTime)}</p>
                  </div>
                )}
                {(booking.djStartTime && booking.djFinishTime) && (
                  <div className="w-4 h-0.5 bg-amber-500/30 flex-shrink-0" />
                )}
                {booking.djFinishTime && (
                  <div className="flex-1 min-w-0 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                    <p className="text-[10px] text-amber-500/70 uppercase">Last song</p>
                    <p className="text-sm font-medium text-white">{formatTime24h(booking.djFinishTime)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Booking Overview Card */}
          <Card className="portal-card bg-white/[0.02] backdrop-blur-md border border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-amber-500 tracking-tight font-light">
                  {deduplicateName(getDisplayName(booking.name) || booking.name)}
                </CardTitle>
                {isSecured ? (
                  <div className="inline-block shadow-[0_0_20px_rgba(212,175,55,0.4)] rounded-full animate-[glowPulse_3s_ease-in-out_infinite]">
                    <Badge className="border-2 border-[#d4af37] bg-[#d4af37]/20 text-[#f4cf6d] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 opacity-0 animate-[fadeIn_1s_ease-in-out_forwards] animate-pulse shadow-[0_0_12px_rgba(212,175,55,0.5)]">
                      <ShieldCheck className="w-4 h-4 opacity-0 animate-[fadeIn_1s_ease-in-out_0.3s_forwards] transition-opacity duration-1000" />
                      Officially Secured
                    </Badge>
                  </div>
                ) : (
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Event Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Event Date</p>
                    <p className="text-white font-semibold">{formatDate(booking.eventDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Artist start & end</p>
                    <p className="text-amber-500 font-semibold text-lg">
                      {booking.djStartTime && booking.djFinishTime
                        ? `${formatTime24h(booking.djStartTime)} – ${formatTime24h(booking.djFinishTime)}`
                        : booking.djStartTime
                        ? `${formatTime24h(booking.djStartTime)} – to be confirmed`
                        : "To be confirmed"}
                    </p>
                    {(!booking.djStartTime || !booking.djFinishTime) && (
                      <p className="text-xs text-gray-500 mt-1">Times will appear here once confirmed</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Venue</p>
                  <p className="text-white font-semibold">
                    {booking.venueName || "Details coming soon"}
                  </p>
                  {booking.venuePostcode && (
                    <p className="text-gray-400 text-sm">{booking.venuePostcode}</p>
                  )}
                  {booking.googleMapsUrl && (
                    <a
                      href={booking.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      View on Google Maps
                    </a>
                  )}
                  {booking.venueNotes && (
                    <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1.5">
                        Load-in Instructions
                      </p>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {booking.venueNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Type & Guests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {booking.eventType && (
                  <div>
                    <p className="text-sm text-gray-400">Event Type</p>
                    <p className="text-white font-semibold">{booking.eventType}</p>
                  </div>
                )}
                {booking.numberOfGuests ? (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-400">Number of Guests</p>
                      <p className="text-white font-semibold">{booking.numberOfGuests}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-400">Number of Guests</p>
                    <p className="text-gray-400 italic">Details coming soon</p>
                  </div>
                )}
              </div>

              {/* Services */}
              {booking.services && booking.services.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.services.map((service, index) => (
                      <Badge
                        key={index}
                        className="bg-amber-500/20 text-amber-500 border-amber-500/30"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Hero photo upload */}
              <div className="pt-4 border-t border-white/10">
                <HeroPhotoSection
                  heroImageUrl={booking.portalHeroImageUrl ?? null}
                  eventType={booking.eventType}
                  bookingId={booking.id}
                  onUploaded={(url) =>
                    setBooking((prev) => ({
                      ...prev,
                      portalHeroImageUrl: url ?? undefined,
                    }))
                  }
                  portalToken={token}
                />
              </div>
            </CardContent>
          </Card>

          {/* Expert Talent Gallery - Unified Team Section */}
          {teamMembers.length > 0 && (
            <Card className="portal-card bg-white/[0.02] backdrop-blur-md border border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-500" />
                    {teamMembers.length === 1 ? "Your Expert Talent" : "Your Wedding Team"}
                  </CardTitle>
                  <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/40 px-3 py-1 text-xs uppercase tracking-wider">
                    {teamMembers.length} {teamMembers.length === 1 ? "Expert" : "Experts"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Grid Layout for Multiple Team Members */}
                <div className={`grid gap-6 ${
                  teamMembers.length === 1 
                    ? "grid-cols-1" 
                    : teamMembers.length === 2 
                    ? "grid-cols-1 md:grid-cols-2" 
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}>
                  {teamMembers.map((assignment) => {
                    const artistType = getArtistType(assignment.role || '');
                    const isDJ = artistType === 'dj';
                    const isMusician = artistType === 'musician';
                    const isBand = artistType === 'band';
                    
                    // Dynamic title based on artist type
                    const artistTitle = isDJ 
                      ? "Your Expert DJ" 
                      : isMusician 
                      ? "Your Live Musician" 
                      : isBand 
                      ? "Your Live Band" 
                      : "Your Expert Talent";
                    
                    return (
                      <div
                        key={assignment.id}
                        className="relative flex flex-col items-center text-center p-6 bg-gray-800/30 rounded-lg border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300"
                      >
                        {/* EXPERT ARTIST Badge - Pinned to Top (doesn't move when bio expands) */}
                        <div className="absolute top-3 right-3 z-10">
                          <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/40 px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold">
                            EXPERT ARTIST
                          </Badge>
                        </div>

                        {/* Gold-Ringed Profile Photo */}
                        <div className="relative flex-shrink-0 mb-4 mt-2">
                          <div className="w-24 h-24 rounded-full border-2 border-amber-500/60 p-0.5 bg-gradient-to-br from-amber-500/20 to-amber-600/20">
                            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                              {assignment.staff.imageUrl ? (
                                <Image
                                  src={sanitizeCloudinaryUrl(assignment.staff.imageUrl) || assignment.staff.imageUrl}
                                  alt={assignment.staff.name || "Team member"}
                                  fill
                                  className="object-cover rounded-full"
                                  sizes="96px"
                                />
                              ) : assignment.staff.name ? (
                                <span className="text-3xl font-bold text-amber-500">
                                  {assignment.staff.name
                                    .split(" ")
                                    .map(n => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </span>
                              ) : (
                                isDJ ? (
                                  <Headphones className="w-10 h-10 text-amber-500/50" />
                                ) : isMusician ? (
                                  <Mic className="w-10 h-10 text-amber-500/50" />
                                ) : isBand ? (
                                  <Sparkles className="w-10 h-10 text-amber-500/50" />
                                ) : (
                                  <Mic className="w-10 h-10 text-amber-500/50" />
                                )
                              )}
                            </div>
                          </div>
                          {/* Gold ring glow effect */}
                          <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-pulse"></div>
                          
                          {/* Role Icon Badge - Dynamic based on artist type */}
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-500/90 border-2 border-gray-900 flex items-center justify-center">
                            {isDJ ? (
                              <Headphones className="w-4 h-4 text-gray-900" />
                            ) : isMusician ? (
                              <Mic className="w-4 h-4 text-gray-900" />
                            ) : isBand ? (
                              <Sparkles className="w-4 h-4 text-gray-900" />
                            ) : (
                              <Mic className="w-4 h-4 text-gray-900" />
                            )}
                          </div>
                        </div>
                        
                        {/* Artist Type Title */}
                        <h3 className="text-lg font-semibold text-white mb-1">{artistTitle}</h3>
                        
                        {/* Staff Info - Content that can expand */}
                        <div className="w-full flex-1 flex flex-col">
                          <p className="text-amber-500 font-semibold text-lg mb-1">
                            {assignment.staff.name}
                          </p>
                          <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider">
                            {assignment.role}
                          </p>
                          {assignment.staff.email && (
                            <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mb-2">
                              <Mail className="w-3 h-3" /> {assignment.staff.email}
                            </p>
                          )}
                          {/* Bio with Read More toggle (if bio exists) */}
                          {assignment.staff.bio && (
                            <div className="flex-1">
                              <BioSection bio={assignment.staff.bio} />
                            </div>
                          )}
                          {isDJ && (
                            <div className="mt-3 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                              <p className="text-[10px] uppercase tracking-wider text-amber-500/70 mb-1">Quick tip</p>
                              <p className="text-xs text-gray-300 italic">
                                &ldquo;I always check in with couples about volume for the first dance — it&apos;s your moment, not the party&apos;s yet.&rdquo;
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No client-facing staff assigned yet (DJ/Musician/Band) */}
          {teamMembers.length === 0 && (
            <Card className="portal-card bg-white/[0.02] backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  Your Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-400">
                  Your DJ or musician will appear here once they&apos;re confirmed. We&apos;re matching you with the perfect fit.
                </p>
                <p className="text-sm text-gray-500">
                  In the meantime, your music preferences and details from this portal are saved and ready to share with your artist when they&apos;re assigned.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.refresh()}
                  className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                >
                  Refresh to check
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Your Music – unified module (must-plays, do-not-plays, Spotify, PDF/Word upload) */}
          <ClientMusicModule
            bookingId={booking.id}
            eventType={booking.eventType}
            portalToken={token}
            initialData={{
              musicRequests: booking.musicRequests ?? "",
              musicDislikes: booking.musicDislikes ?? "",
              musicFileUrl: booking.musicFileUrl ?? "",
              firstDance: booking.firstDance ?? "",
              lastSong: booking.lastSong ?? "",
              musicNotesToDJ: booking.musicNotesToDJ ?? "",
            }}
            onSave={() => {
              router.refresh();
              const url = token
                ? `/api/client/bookings/${booking.id}?token=${encodeURIComponent(token)}`
                : `/api/client/bookings/${booking.id}`;
              fetch(url)
                .then((r) => r.ok ? r.json() : null)
                .then((d) => d?.booking && setBooking(d.booking as Booking));
            }}
            variant="portal"
          />

          {/* Guest Song Requests — you're the DJ-in-chief */}
          <GuestRequestsView
            bookingId={booking.id}
            guestRequestToken={booking.guestRequestToken || null}
            guestRequestsEnabled={booking.guestRequestsEnabled ?? true}
            eventDate={new Date(booking.eventDate)}
            baseUrl={baseUrl}
            eventPassed={eventPassed}
            portalToken={token}
            venueName={booking.venueName}
            coupleName={greetingName}
            eventType={booking.eventType}
            onToggleEnabled={async (enabled) => {
              const url = token
                ? `/api/client/bookings/${booking.id}/guest-requests/?token=${encodeURIComponent(token)}`
                : `/api/client/bookings/${booking.id}/guest-requests/`;
              const res = await fetch(url, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled }),
              });
              if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error ?? "Failed to update");
              }
              setBooking((prev) => ({ ...prev, guestRequestsEnabled: enabled }));
            }}
          />

          {/* 3-week window: Final Details form + Artist Payment card + Confirm payment button */}
          {unlockThreeWeek && (
            <>
              <Card className="portal-card bg-white/[0.02] backdrop-blur-md border border-white/10">
                <CardHeader>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-500" />
                      Lock it in — you&apos;re almost there
                    </CardTitle>
                    <span className="text-[10px] uppercase tracking-wider text-amber-500/80 font-medium">Final step</span>
                  </div>
                  <p className="text-sm text-gray-400">A few details so we can hand everything to {briefRecipientLabel}. Music is already saved above; add any last notes and we&apos;ll pull it all together.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {hasMusic ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                      <p className="text-sm text-emerald-200/90">You&apos;re on track. One last step and {briefRecipientLabel} has everything they need.</p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-gray-900/50 border border-white/5">
                      <p className="text-sm text-gray-400">{daysUntilEvent} days to go — final checklist</p>
                    </div>
                  )}

                  {hasMusic && !(booking.finalDetailsConfirmed || paymentSent) && (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400">Your booking — 95% complete</p>
                      <div className="h-1.5 rounded-full bg-gray-700 overflow-hidden">
                        <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-emerald-500 to-amber-500/80" />
                      </div>
                    </div>
                  )}

                  <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-wider pt-2">A few final details</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Last-minute notes for {briefRecipientLabel}</label>
                    <textarea
                      value={finalDetailsNotes}
                      onChange={(e) => setFinalDetailsNotes(e.target.value)}
                      placeholder="Dietary requirements, special requests, timings, load-in instructions, etc."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Day-of contact number
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="e.g. 07700 900123"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Number of guests
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={numberOfGuests}
                      onChange={(e) => setNumberOfGuests(e.target.value)}
                      placeholder="e.g. 80"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  {(booking.eventType || "").toLowerCase() !== "wedding" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Your home address</label>
                      <p className="text-xs text-gray-500 mb-2">Optional. Update if anything has changed.</p>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={clientAddress}
                          onChange={(e) => setClientAddress(e.target.value)}
                          placeholder="Address line 1"
                          className="w-full px-4 py-2 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <input
                          type="text"
                          value={clientAddress2}
                          onChange={(e) => setClientAddress2(e.target.value)}
                          placeholder="Address line 2"
                          className="w-full px-4 py-2 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={clientTown}
                            onChange={(e) => setClientTown(e.target.value)}
                            placeholder="Town"
                            className="w-full px-4 py-2 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <input
                            type="text"
                            value={clientPostcode}
                            onChange={(e) => setClientPostcode(e.target.value)}
                            placeholder="Postcode"
                            className="w-full px-4 py-2 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                        <input
                          type="text"
                          value={clientCounty}
                          onChange={(e) => setClientCounty(e.target.value)}
                          placeholder="County"
                          className="w-full px-4 py-2 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      What3words (optional)
                    </label>
                    <input
                      type="text"
                      value={venueWhat3Words}
                      onChange={(e) => setVenueWhat3Words(e.target.value)}
                      placeholder="e.g. filled.count.soap – helps artists find the exact spot"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Load-in / access notes (optional)
                    </label>
                    <textarea
                      value={venueLoadInNotes}
                      onChange={(e) => setVenueLoadInNotes(e.target.value)}
                      placeholder="e.g. 163 steps to the beach, no vehicle access, load-in difficult"
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <Button
                    onClick={async () => {
                      setFinalDetailsFeedback(null);
                      const musicFromBooking = [
                        (booking.firstDance ?? "").trim(),
                        (booking.musicRequests ?? "").trim(),
                        (booking.lastSong ?? "").trim(),
                        (booking.musicDislikes ?? "").trim(),
                        (booking.musicNotesToDJ ?? "").trim(),
                        (booking.musicFileUrl ?? "").trim(),
                      ];
                      const hasMusic = musicFromBooking.some((s) => s.length > 0);
                      if (!hasMusic) {
                        setFinalDetailsFeedback({
                          type: "error",
                          msg: `Add your music in Your Music above first — then we can lock everything in for ${briefRecipientLabel}.`,
                        });
                        return;
                      }
                      setSubmittingFinalDetails(true);
                      try {
                        const phoneTrim = clientPhone.trim() || null;
                        const parsed = phoneTrim ? parsePhone(clientPhone) : { phoneAreaCode: null, phoneNumber: null };
                        const isWedding = (booking.eventType || "").toLowerCase() === "wedding";
                        const guestsNum = numberOfGuests.trim() ? parseInt(numberOfGuests.trim(), 10) : null;
                        const guestsVal = guestsNum != null && !Number.isNaN(guestsNum) && guestsNum >= 0 ? guestsNum : null;
                        const payload: Record<string, unknown> = {
                          notes: finalDetailsNotes.trim() || null,
                          phone: phoneTrim,
                          numberOfGuests: guestsVal,
                          venueWhat3Words: venueWhat3Words.trim() || null,
                          venueLoadInNotes: venueLoadInNotes.trim() || null,
                          firstDance: (booking.firstDance ?? "").trim() || null,
                          lastSong: (booking.lastSong ?? "").trim() || null,
                          musicRequests: (booking.musicRequests ?? "").trim() || null,
                          musicDislikes: (booking.musicDislikes ?? "").trim() || null,
                          musicNotesToDJ: (booking.musicNotesToDJ ?? "").trim() || null,
                          musicFileUrl: (booking.musicFileUrl ?? "").trim() || null,
                        };
                        if (!isWedding) {
                          payload.clientAddress = clientAddress.trim() || null;
                          payload.clientAddress2 = clientAddress2.trim() || null;
                          payload.clientTown = clientTown.trim() || null;
                          payload.clientCounty = clientCounty.trim() || null;
                          payload.clientPostcode = clientPostcode.trim() || null;
                        }
                        const finalDetailsUrl = token
                          ? `/api/client/bookings/${booking.id}/final-details?token=${encodeURIComponent(token)}`
                          : `/api/client/bookings/${booking.id}/final-details/`;
                        const res = await fetch(finalDetailsUrl, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(payload),
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setFinalDetailsFeedback({ type: "success", msg: `All set. ${briefRecipientLabelCapitalized} has everything — see you on the day.` });
                          setPaymentSent(true);
                          const confettiKey = `final_details_confetti_${booking.id}`;
                          if (typeof window !== "undefined" && !sessionStorage.getItem(confettiKey)) {
                            sessionStorage.setItem(confettiKey, "true");
                            const duration = 2000;
                            const animationEnd = Date.now() + duration;
                            const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 9999 };
                            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
                            const interval = setInterval(() => {
                              if (Date.now() > animationEnd) return clearInterval(interval);
                              const particleCount = 40 * ((animationEnd - Date.now()) / duration);
                              confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.2, 0.4), y: Math.random() - 0.2 }, colors: ["#d4af37", "#f4cf6d", "#ffffff"] });
                              confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.6, 0.8), y: Math.random() - 0.2 }, colors: ["#d4af37", "#f4cf6d", "#ffffff"] });
                            }, 200);
                          }
                          router.refresh();
                          setBooking((prev) => ({
                            ...prev,
                            finalDetailsConfirmed: true,
                            message: finalDetailsNotes || null,
                            phoneAreaCode: parsed.phoneAreaCode,
                            phoneNumber: parsed.phoneNumber,
                            numberOfGuests: guestsVal,
                            ...(isWedding ? {} : {
                              clientAddress: clientAddress.trim() || null,
                              clientAddress2: clientAddress2.trim() || null,
                              clientTown: clientTown.trim() || null,
                              clientCounty: clientCounty.trim() || null,
                              clientPostcode: clientPostcode.trim() || null,
                            }),
                            venueWhat3Words: venueWhat3Words.trim() || null,
                            venueLoadInNotes: venueLoadInNotes.trim() || null,
                          }));
                        } else {
                          setFinalDetailsFeedback({ type: "error", msg: data?.error || "Failed to send." });
                        }
                      } catch {
                        setFinalDetailsFeedback({ type: "error", msg: "Failed to send." });
                      } finally {
                        setSubmittingFinalDetails(false);
                      }
                    }}
                    disabled={submittingFinalDetails}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
                  >
                    {submittingFinalDetails ? "Sending…" : "Lock it in & send to our team"}
                  </Button>
                  <p className="text-xs text-gray-500">
                    We&apos;ll double-check everything, then send your full brief to {briefRecipientLabel}. You&apos;ll receive a quick confirmation.
                  </p>
                  <p className="text-xs text-gray-500">
                    What happens next: Our team reviews your details, then passes your full playlist and notes to {briefRecipientLabel}. Nothing is sent until we&apos;ve checked everything.
                  </p>
                  {finalDetailsFeedback && (
                    <p className={finalDetailsFeedback.type === "success" ? "text-emerald-400 text-sm" : "text-red-400 text-sm"}>
                      {finalDetailsFeedback.msg}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-amber-500/20 backdrop-blur-md border-amber-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-amber-500" />
                    Artist Payment
                  </CardTitle>
                  <p className="text-sm text-gray-400">
                    Final balance is due before your event. Pay your artist(s) using the details below. This section is only shown within 21 days of your event.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loadingPayment ? (
                    <p className="text-gray-400">Loading payment details…</p>
                  ) : paymentDetails?.staff && paymentDetails.staff.length > 0 ? (
                    <div className="space-y-4">
                      {paymentDetails.staff.map((s) => (
                        <div key={s.id} className="p-4 rounded-lg bg-gray-900/50 border border-amber-500/20">
                          <p className="text-amber-500 font-semibold">{s.name}</p>
                          <p className="text-gray-400 text-sm uppercase tracking-wider">{s.role}</p>
                          {(s.sortCode || s.accountNumber) && (
                            <div className="mt-2 text-sm text-white space-y-1">
                              {s.sortCode && <p><span className="text-gray-500">Sort code:</span> {s.sortCode}</p>}
                              {s.accountNumber && <p><span className="text-gray-500">Account number:</span> {s.accountNumber}</p>}
                            </div>
                          )}
                          {!s.sortCode && !s.accountNumber && (
                            <p className="text-gray-500 text-sm mt-2">Bank details not yet added. We&apos;ll show them here when your artist has added them.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-gray-900/30 border border-amber-500/10 space-y-1">
                      <p className="text-gray-400">
                        {teamMembers.length > 0
                          ? "Your artist(s) haven't added their bank details yet. We'll display them here when they're ready."
                          : "No assigned artist yet. Payment details will appear here once your DJ or musician is confirmed (within 21 days of your event)."}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    Only confirm below after you&apos;ve actually sent the final payment to your artist(s).
                  </p>
                  <Button
                    onClick={async () => {
                      setSubmittingPaymentSent(true);
                      setPaymentFeedback(null);
                      try {
                        const res = await fetch(`/api/client/bookings/${booking.id}/final-payment-sent`, {
                          method: "POST",
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setPaymentSent(true);
                          setPaymentFeedback({ type: "success", msg: "Thanks! We’ve notified your artist(s). They may confirm receipt separately." });
                        } else {
                          setPaymentFeedback({ type: "error", msg: data?.error || "Something went wrong." });
                        }
                      } catch {
                        setPaymentFeedback({ type: "error", msg: "Something went wrong." });
                      } finally {
                        setSubmittingPaymentSent(false);
                      }
                    }}
                    disabled={paymentSent || submittingPaymentSent}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold disabled:opacity-50 disabled:pointer-events-none transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:hover:scale-100"
                  >
                    {submittingPaymentSent ? "Sending…" : paymentSent ? "Final payment confirmed" : "I have sent the final payment"}
                  </Button>
                  {paymentFeedback && (
                    <p className={paymentFeedback.type === "success" ? "text-emerald-400 text-sm" : "text-red-400 text-sm"}>
                      {paymentFeedback.msg}
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Communication history — record of all comms for this booking */}
          <Card className="portal-card bg-white/[0.02] backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-500" />
                Communication history
              </CardTitle>
              <p className="text-sm text-gray-400">
                Quotes, confirmations, reminders and replies we&apos;ve exchanged about this booking. Your record of all comms.
              </p>
            </CardHeader>
            <CardContent>
              {loadingThreads ? (
                <p className="text-sm text-gray-500">Loading…</p>
              ) : threads.length === 0 ? (
                <div className="py-8 text-center">
                  <Mail className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-60" />
                  <p className="text-gray-400 font-medium">No messages yet</p>
                  <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                    Emails we send about this booking (quotes, confirmations, reminders) will appear here. You can always reply to those emails as usual.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {threads.map((thread) => (
                    <div key={thread.id} className="space-y-3">
                      <p className="text-sm font-medium text-amber-500/90">{thread.subject}</p>
                      <div className="space-y-3">
                        {thread.emails.map((email) => (
                          <div
                            key={email.id}
                            className={`rounded-lg p-4 ${
                              email.direction === "outbound"
                                ? "bg-amber-500/10 border border-amber-500/30"
                                : "bg-gray-800/50 border border-gray-700"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="font-medium text-white text-sm">
                                {email.direction === "outbound" ? "You" : email.fromName || email.fromEmail}
                              </p>
                              <p className="text-xs text-gray-500 shrink-0">
                                {new Date(email.receivedAt).toLocaleString("en-GB", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })}
                              </p>
                            </div>
                            {email.htmlContent ? (
                              <div
                                className="prose prose-invert prose-sm max-w-none text-gray-300"
                                dangerouslySetInnerHTML={{ __html: email.htmlContent }}
                              />
                            ) : (
                              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                                {email.textContent || "—"}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="portal-card bg-white/[0.02] backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{booking.email}</p>
                </div>
              </div>
              {booking.User && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm text-gray-400">Account</p>
                    <p className="text-white">{booking.User.name}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Terms acceptance – when not yet accepted. Hide for existing confirmed/deposit-received bookings (treat as already accepted). */}
          {!booking.termsAccepted &&
            !(
              booking.status === "confirmed" ||
              booking.depositReceived === true ||
              booking.depositReceivedManual === true
            ) && (
            <Card className="bg-gray-800/80 backdrop-blur border-amber-500/40">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  Accept terms to complete your booking
                </CardTitle>
                <p className="text-sm text-gray-400">
                  Please read and accept our Terms & Conditions below. This forms part of your booking agreement.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <AcceptTermsModule
                  accepted={portalTermsAccepted}
                  onAcceptChange={setPortalTermsAccepted}
                  disabled={acceptingTerms}
                  variant="dark"
                  bookingSummary={{
                    venueName: booking.venueName ?? undefined,
                    eventDate: booking.eventDate ?? undefined,
                    fee: (() => {
                      const raw = (booking as { bookingFee?: unknown }).bookingFee ?? (booking as { finalBalance?: unknown }).finalBalance;
                      if (raw == null) return undefined;
                      const s = toSafeDisplayString(raw);
                      return s || undefined;
                    })(),
                    talent: (booking.staffAssignments ?? [])
                      .filter((a) => a?.staff?.name != null)
                      .map((a) => ({ name: toSafeReactChild(a.staff!.name), role: a.role != null && a.role !== "" ? toSafeReactChild(a.role) : undefined })),
                  }}
                />
                <Button
                  onClick={handleAcceptTerms}
                  disabled={!portalTermsAccepted || acceptingTerms}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                >
                  {acceptingTerms ? "Accepting…" : "Accept terms"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Contract & agreement – existing ContractFooter from dashboard */}
          <ContractFooter booking={booking} />

          {/* Terms & Privacy – visible at bottom of portal */}
          <div className="pt-8 pb-4 border-t border-white/10 mt-8">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <Link href="/terms-and-conditions/" className="text-amber-500/90 hover:text-amber-400 transition-colors">
                Terms and Conditions
              </Link>
              <span className="text-white/30">·</span>
              <Link href="/privacy-policy/" className="text-amber-500/90 hover:text-amber-400 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
