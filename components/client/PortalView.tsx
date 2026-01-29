"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Mail, Phone, Users, AlertCircle, Headphones, Sparkles, CheckCircle2, ShieldCheck, Mic, ChevronDown, Banknote, FileText, Music, Link2, Upload } from "lucide-react";
import { getGreetingName, deduplicateName, getDisplayName } from "@/lib/utils/name-helpers";
import Image from "next/image";
import confetti from "canvas-confetti";
import HireShop from "@/components/client/HireShop";
import GuestRequestsView from "@/components/client/GuestRequestsView";

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

interface HireItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  category: string | null;
  slug: string | null;
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

export default function PortalView({ booking: initialBooking, isPreview = false, baseUrl = "", eventPassed = false }: PortalViewProps) {
  const [booking, setBooking] = useState<Booking>(initialBooking);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    hasPassed: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, hasPassed: false });
  const [isAnimating, setIsAnimating] = useState(false);
  const [hireItems, setHireItems] = useState<HireItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const confettiTriggered = useRef(false);
  const [paymentDetails, setPaymentDetails] = useState<{ staff: PaymentDetailsStaff[] } | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [submittingFinalDetails, setSubmittingFinalDetails] = useState(false);
  const [submittingPaymentSent, setSubmittingPaymentSent] = useState(false);
  const [finalDetailsNotes, setFinalDetailsNotes] = useState(stripReferralFromMessage(initialBooking.message) || "");
  const [clientPhone, setClientPhone] = useState(formatClientPhone(initialBooking.phoneAreaCode, initialBooking.phoneNumber));
  const [venueWhat3Words, setVenueWhat3Words] = useState(initialBooking.venueWhat3Words ?? "");
  const [venueLoadInNotes, setVenueLoadInNotes] = useState(initialBooking.venueLoadInNotes ?? "");
  const [clientAddress, setClientAddress] = useState(initialBooking.clientAddress ?? "");
  const [clientAddress2, setClientAddress2] = useState(initialBooking.clientAddress2 ?? "");
  const [clientTown, setClientTown] = useState(initialBooking.clientTown ?? "");
  const [clientCounty, setClientCounty] = useState(initialBooking.clientCounty ?? "");
  const [clientPostcode, setClientPostcode] = useState(initialBooking.clientPostcode ?? "");
  const [firstDance, setFirstDance] = useState(initialBooking.firstDance ?? "");
  const [lastSong, setLastSong] = useState(initialBooking.lastSong ?? "");
  const [musicRequests, setMusicRequests] = useState(initialBooking.musicRequests ?? "");
  const [musicDislikes, setMusicDislikes] = useState(initialBooking.musicDislikes ?? "");
  const [musicNotesToDJ, setMusicNotesToDJ] = useState(initialBooking.musicNotesToDJ ?? "");
  const [musicFileUrl, setMusicFileUrl] = useState(initialBooking.musicFileUrl ?? "");
  const [uploadingMusicFile, setUploadingMusicFile] = useState(false);
  const [musicFileUploadError, setMusicFileUploadError] = useState<string | null>(null);
  const musicFileInputRef = useRef<HTMLInputElement>(null);
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
    setFirstDance(initialBooking.firstDance ?? "");
    setLastSong(initialBooking.lastSong ?? "");
    setMusicRequests(initialBooking.musicRequests ?? "");
    setMusicDislikes(initialBooking.musicDislikes ?? "");
    setMusicNotesToDJ(initialBooking.musicNotesToDJ ?? "");
    setMusicFileUrl(initialBooking.musicFileUrl ?? "");
    setMusicFileUploadError(null);
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

  // Calculate countdown to event date with seconds
  // Use ceremonyTime if it exists, otherwise fall back to eventDate
  useEffect(() => {
    const calculateCountdown = () => {
      const targetDate = booking.ceremonyTime
        ? new Date(booking.ceremonyTime as string | Date)
        : new Date(booking.eventDate as string | Date);
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, hasPassed: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds, hasPassed: false });
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [booking.eventDate, booking.ceremonyTime]);

  // Fetch hire items for upsell section
  useEffect(() => {
    const fetchHireItems = async () => {
      try {
        setLoadingItems(true);
        const response = await fetch("/api/hire-items?isActive=true");
        if (response.ok) {
          const data = await response.json();
          setHireItems(data.items || []);
        }
      } catch (error) {
        console.error("Error fetching hire items:", error);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchHireItems();
  }, []);

  // One-time confetti burst when deposit is received (toggle sets depositReceivedManual; either flag counts)
  const isSecured = !!(booking.depositReceived || booking.depositReceivedManual);
  useEffect(() => {
    if (isSecured && !confettiTriggered.current) {
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
  }, [isSecured, booking.id]);

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
    fetch(`/api/client/bookings/${booking.id}/payment-details`)
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
  }, [unlockThreeWeek, booking.id]);

  const evType = (booking.eventType || "").toLowerCase();

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
    // Only show client-facing roles (exclude Riggers, Technicians, Crew)
    return (
      role.includes('dj') ||
      role.includes('musician') ||
      role.includes('band') ||
      role.includes('host') ||
      role.includes('performer')
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
      <div className="container mx-auto max-w-6xl">
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
          <p className="text-amber-500/70 text-base font-light mb-6">
            {evType.includes("wedding")
              ? "Your big day is getting closer!"
              : evType.includes("party") || evType.includes("corporate")
                ? "Something special's around the corner!"
                : "We're so excited for you!"}
          </p>
        </div>

        {/* Golden Grid Countdown Clock */}
        {!countdown.hasPassed && (
          <div className="mb-8">
            <div className="grid grid-cols-4 gap-3 md:gap-4 mb-4">
              {[
                { value: countdown.days, label: "Days" },
                { value: countdown.hours, label: "Hours" },
                { value: countdown.minutes, label: "Mins" },
                { value: countdown.seconds, label: "Secs" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="countdown-tile bg-gray-900/50 border border-amber-500/20 rounded-xl p-4 text-center cursor-default transition-all duration-300 hover:border-amber-500/40"
                >
                  <div
                    className={`text-amber-500 font-light text-5xl transition-all duration-300 ${
                      isAnimating ? "animate-pulse" : ""
                    }`}
                  >
                    {value.toString().padStart(2, "0")}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">
                    {label}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Ceremony Detail */}
            {ceremonyTimeDisplay && (
              <p className="text-sm text-amber-500/80 text-center font-light">
                Ceremony begins at {ceremonyTimeDisplay}
              </p>
            )}
          </div>
        )}

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
                        ? `${formatTime24h(booking.djStartTime)} – TBC`
                        : "TBC"}
                    </p>
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
                                  src={assignment.staff.imageUrl}
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Staff Assigned Yet */}
          {(!booking.staffAssignments || booking.staffAssignments.length === 0) && (
            <Card className="portal-card bg-white/[0.02] backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  Your Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-400">Details coming soon.</p>
                <p className="text-sm text-gray-500">
                  We&apos;ll assign your DJ or musician shortly. When they&apos;re confirmed, they&apos;ll appear here. Your music preferences and final details from this portal are shared with them as part of their confirmation.
                </p>
                <p className="text-sm text-amber-400/90">
                  If we&apos;ve just assigned your DJ or musician, refresh the page to see them.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.refresh()}
                  className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                >
                  Refresh page
                </Button>
              </CardContent>
            </Card>
          )}

          {/* 3-week window: Final Details form + Artist Payment card + Confirm payment button */}
          {unlockThreeWeek && (
            <>
              <Card className="portal-card bg-white/[0.02] backdrop-blur-md border border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" />
                    Final Details
                  </CardTitle>
                  <p className="text-sm text-gray-400">Complete your music details first, then notes and logistics. This form is your final document—we’ll add it all to your booking and notify the team. Ready to dispatch once you confirm.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-b border-white/10 pb-6">
                    <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      Music details (required)
                    </h4>
                    <p className="text-xs text-gray-500 mb-4">We need your music details before we can confirm. Add at least one of the below.</p>
                    <div className="space-y-4">
                      {(booking.eventType || "").toLowerCase() === "wedding" && (
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">First dance</label>
                          <input
                            type="text"
                            value={firstDance}
                            onChange={(e) => setFirstDance(e.target.value)}
                            placeholder="Artist – Song"
                            className="w-full px-4 py-2 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Music requests / must-plays</label>
                        <textarea
                          value={musicRequests}
                          onChange={(e) => setMusicRequests(e.target.value)}
                          placeholder="Songs or styles you’d like"
                          rows={2}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Last song</label>
                        <input
                          type="text"
                          value={lastSong}
                          onChange={(e) => setLastSong(e.target.value)}
                          placeholder="Optional"
                          className="w-full px-4 py-2 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Music dislikes / do-not-plays</label>
                        <textarea
                          value={musicDislikes}
                          onChange={(e) => setMusicDislikes(e.target.value)}
                          placeholder="Songs or genres to avoid"
                          rows={2}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Notes for your DJ / musician</label>
                        <textarea
                          value={musicNotesToDJ}
                          onChange={(e) => setMusicNotesToDJ(e.target.value)}
                          placeholder="Volume, vibe, announcements, etc."
                          rows={2}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
                          <Link2 className="w-4 h-4" />
                          Spotify playlist, or link to PDF / Word music list
                        </label>
                        <input
                          type="url"
                          value={musicFileUrl}
                          onChange={(e) => {
                            setMusicFileUrl(e.target.value);
                            setMusicFileUploadError(null);
                          }}
                          placeholder="https://open.spotify.com/playlist/... or link to your PDF/Word document"
                          className="w-full px-4 py-2 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Paste a Spotify playlist link, or a link to your music list (PDF/Word). Your artist will use this with your other preferences.
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <input
                            ref={musicFileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            className="hidden"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              setMusicFileUploadError(null);
                              setUploadingMusicFile(true);
                              try {
                                const fd = new FormData();
                                fd.append("file", f);
                                const res = await fetch(`/api/client/bookings/${booking.id}/upload-music-file/`, {
                                  method: "POST",
                                  body: fd,
                                });
                                const data = await res.json();
                                if (res.ok && typeof data?.url === "string") {
                                  setMusicFileUrl(data.url);
                                  setMusicFileUploadError(null);
                                } else {
                                  setMusicFileUploadError(data?.error ?? "Upload failed");
                                }
                              } catch {
                                setMusicFileUploadError("Upload failed");
                              } finally {
                                setUploadingMusicFile(false);
                                e.target.value = "";
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => musicFileInputRef.current?.click()}
                            disabled={uploadingMusicFile}
                            className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                          >
                            <Upload className="w-4 h-4 mr-1.5" />
                            {uploadingMusicFile ? "Uploading…" : "Choose file to upload (PDF, Word)"}
                          </Button>
                          {musicFileUploadError && (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm text-red-400">{musicFileUploadError}</span>
                              {musicFileUploadError.toLowerCase().includes("not configured") && (
                                <span className="text-xs text-gray-400">You can paste a link to your file above instead.</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-amber-500 uppercase tracking-wider pt-2">Notes & logistics</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">General notes</label>
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
                      Your phone (in case of emergency on the day)
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
                      const hasMusic = [
                        firstDance.trim(),
                        musicRequests.trim(),
                        lastSong.trim(),
                        musicDislikes.trim(),
                        musicNotesToDJ.trim(),
                        musicFileUrl.trim(),
                      ].some((s) => s.length > 0);
                      if (!hasMusic) {
                        setFinalDetailsFeedback({
                          type: "error",
                          msg: "We need your music details before we can confirm. Please add at least one of: first dance, must-plays, do-not-plays, notes for your DJ, or a playlist/link.",
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
                          firstDance: firstDance.trim() || null,
                          lastSong: lastSong.trim() || null,
                          musicRequests: musicRequests.trim() || null,
                          musicDislikes: musicDislikes.trim() || null,
                          musicNotesToDJ: musicNotesToDJ.trim() || null,
                          musicFileUrl: musicFileUrl.trim() || null,
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
                          setFinalDetailsFeedback({ type: "success", msg: "Final details confirmed. We've added everything to your booking and notified the team—ready to dispatch." });
                          setPaymentSent(true);
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
                            firstDance: firstDance || null,
                            lastSong: lastSong || null,
                            musicRequests: musicRequests || null,
                            musicDislikes: musicDislikes || null,
                            musicNotesToDJ: musicNotesToDJ || null,
                            musicFileUrl: musicFileUrl.trim() || null,
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
                    {submittingFinalDetails ? "Sending…" : "Confirm & send final details"}
                  </Button>
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

          {/* Enhance Your Event Section - Using Original Component Style */}
          <Card className="portal-card bg-white/[0.02] backdrop-blur-md border border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-champagne-gold" />
                <CardTitle className="text-champagne-gold">
                  Enhance Your Event
                </CardTitle>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Items you've selected for your event
              </p>
            </CardHeader>
            <CardContent>
              {booking.upsellItems && booking.upsellItems.length > 0 ? (
                <div className="space-y-3">
                  {booking.upsellItems.map((itemId, index) => {
                    // Try to find the item in hireItems, otherwise display the ID/name
                    const hireItem = hireItems.find(item => item.id === itemId);
                    const itemName = hireItem?.name || itemId;
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-3 rounded bg-champagne-gold/10 border border-white/10 hover:border-amber-500/40 transition-all duration-300 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-champagne-gold flex-shrink-0" />
                        <span className="text-sm text-champagne-gold font-medium flex-1">
                          {itemName}
                        </span>
                        {hireItem && (
                          <span className="text-xs text-gray-400">
                            £{hireItem.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  <div className="mt-4 p-3 bg-champagne-gold/10 border border-champagne-gold/30 rounded-lg">
                    <p className="text-sm text-champagne-gold font-medium">
                      {booking.upsellItems.length} item{booking.upsellItems.length !== 1 ? "s" : ""} confirmed
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      All items are confirmed for your event
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 text-sm text-gray-400">
                  No additional items selected. Contact us if you'd like to add enhancements to your event.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hire Shop — add to booking, confirm request (no payment) */}
          <HireShop
            bookingId={booking.id}
            venueName={booking.venueName}
            eventType={booking.eventType}
          />

          {/* Guest Song Requests - Enhanced with Spotify integration */}
          <GuestRequestsView
            bookingId={booking.id}
            guestRequestToken={booking.guestRequestToken || null}
            guestRequestsEnabled={booking.guestRequestsEnabled ?? true}
            eventDate={new Date(booking.eventDate)}
            baseUrl={baseUrl}
            eventPassed={eventPassed}
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
        </div>
      </div>
    </div>
  );
}
