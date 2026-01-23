"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Mail, Phone, Users, AlertCircle, Headphones, Sparkles, CheckCircle2, ShieldCheck, Mic, ChevronDown, Banknote, FileText, Music } from "lucide-react";
import { getGreetingName, deduplicateName, getDisplayName } from "@/lib/utils/name-helpers";
import Image from "next/image";
import confetti from "canvas-confetti";
import HireShop from "@/components/client/HireShop";

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
  staffAssignments?: StaffAssignment[];
  guestRequests?: Array<{
    id: string;
    songTitle: string;
    artist: string | null;
    guestName: string | null;
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

export default function PortalView({ booking: initialBooking, isPreview = false }: PortalViewProps) {
  const [booking, setBooking] = useState<Booking>(initialBooking);
  const searchParams = useSearchParams();
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
  const [finalDetailsNotes, setFinalDetailsNotes] = useState(initialBooking.message ?? "");
  const [paymentSent, setPaymentSent] = useState(!!initialBooking.finalDetailsConfirmed);
  const [finalDetailsFeedback, setFinalDetailsFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [paymentFeedback, setPaymentFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Sync from initial props when navigating to another booking
  useEffect(() => {
    setBooking(initialBooking);
    setFinalDetailsNotes(initialBooking.message ?? "");
    setPaymentSent(!!initialBooking.finalDetailsConfirmed);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reset on booking id change
  }, [initialBooking.id]);

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
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          {/* Event Type Badge */}
          {booking.eventType && (
            <div className="mb-3">
              <span className="text-amber-500 text-xs uppercase tracking-[0.2em] font-light">
                {booking.eventType}
              </span>
            </div>
          )}
          
          {/* Emergency Header - 3 Days Out */}
        {isEmergencyWindow && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-600/20 via-amber-600/20 to-red-600/20 border-2 border-red-500/50 rounded-lg animate-pulse">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 animate-pulse" />
              <div className="flex-1">
                <p className="text-red-300 font-bold text-lg mb-1">
                  Final Details Needed – Your Event Is in {daysUntilEvent} {daysUntilEvent === 1 ? 'Day' : 'Days'}
                </p>
                <p className="text-amber-200 text-sm">
                  Please confirm any last-minute changes, timings, or special requests. Check your email for your magic link to access the portal instantly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Greeting */}
          <h1 className="text-3xl mb-6">
            <span className="text-white font-light">Hello </span>
            <span className="text-amber-500 font-extralight tracking-[0.1em]">
              {greetingName || 'there'}
            </span>
          </h1>
        </div>

        {/* Golden Grid Countdown Clock */}
        {!countdown.hasPassed && (
          <div className="mb-8">
            <div className="grid grid-cols-4 gap-3 md:gap-4 mb-4">
              {/* Days */}
              <div className="bg-gray-900/50 border border-amber-500/20 rounded-lg p-4 text-center">
                <div 
                  className={`text-amber-500 font-light text-5xl transition-all duration-300 ${
                    isAnimating ? 'animate-pulse' : ''
                  }`}
                >
                  {countdown.days.toString().padStart(2, '0')}
                </div>
                <div className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">
                  Days
                </div>
              </div>
              
              {/* Hours */}
              <div className="bg-gray-900/50 border border-amber-500/20 rounded-lg p-4 text-center">
                <div 
                  className={`text-amber-500 font-light text-5xl transition-all duration-300 ${
                    isAnimating ? 'animate-pulse' : ''
                  }`}
                >
                  {countdown.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">
                  Hours
                </div>
              </div>
              
              {/* Minutes */}
              <div className="bg-gray-900/50 border border-amber-500/20 rounded-lg p-4 text-center">
                <div 
                  className={`text-amber-500 font-light text-5xl transition-all duration-300 ${
                    isAnimating ? 'animate-pulse' : ''
                  }`}
                >
                  {countdown.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">
                  Mins
                </div>
              </div>
              
              {/* Seconds */}
              <div className="bg-gray-900/50 border border-amber-500/20 rounded-lg p-4 text-center">
                <div 
                  className={`text-amber-500 font-light text-5xl transition-all duration-300 ${
                    isAnimating ? 'animate-pulse' : ''
                  }`}
                >
                  {countdown.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">
                  Secs
                </div>
              </div>
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
          <Card className="bg-white/[0.02] backdrop-blur-md border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-amber-500 tracking-tight font-light">
                  {deduplicateName(getDisplayName(booking.name) || booking.name)}
                </CardTitle>
                {isSecured ? (
                  <div className="inline-block shadow-[0_0_20px_rgba(212,175,55,0.4)] rounded-full animate-[glowPulse_3s_ease-in-out_infinite]">
                    <Badge className="border-2 border-amber-400 bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 opacity-0 animate-[fadeIn_1s_ease-in-out_forwards] animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.3)]">
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
                    <p className="text-sm text-gray-400">Time</p>
                    <p className="text-amber-500 font-semibold text-lg">
                      {booking.djStartTime && booking.djFinishTime
                        ? `${formatTime24h(booking.djStartTime)} – ${formatTime24h(booking.djFinishTime)}`
                        : booking.djStartTime
                        ? `${formatTime24h(booking.djStartTime)} – TBC`
                        : formatTime(booking.eventDate)}
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
            <Card className="bg-white/[0.02] backdrop-blur-md border-white/10">
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
            <Card className="bg-white/[0.02] backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white">Your Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 italic">Details coming soon</p>
              </CardContent>
            </Card>
          )}

          {/* 3-week window: Final Details form + Artist Payment card + Confirm payment button */}
          {unlockThreeWeek && (
            <>
              <Card className="bg-white/[0.02] backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" />
                    Final Details
                  </CardTitle>
                  <p className="text-sm text-gray-400">You can update your notes within 21 days of your event.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    value={finalDetailsNotes}
                    onChange={(e) => setFinalDetailsNotes(e.target.value)}
                    placeholder="Dietary requirements, special requests, timings, etc."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  <Button
                    onClick={async () => {
                      setSubmittingFinalDetails(true);
                      setFinalDetailsFeedback(null);
                      try {
                        const res = await fetch(`/api/client/bookings/${booking.id}/final-details`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ notes: finalDetailsNotes }),
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setFinalDetailsFeedback({ type: "success", msg: "Final details saved." });
                        } else {
                          setFinalDetailsFeedback({ type: "error", msg: data?.error || "Failed to save." });
                        }
                      } catch {
                        setFinalDetailsFeedback({ type: "error", msg: "Failed to save." });
                      } finally {
                        setSubmittingFinalDetails(false);
                      }
                    }}
                    disabled={submittingFinalDetails}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                  >
                    {submittingFinalDetails ? "Saving…" : "Save final details"}
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
                  <p className="text-sm text-gray-400">Bank details for your assigned artists (shown only within 21 days of your event).</p>
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
                            <p className="text-gray-500 text-sm mt-2">Bank details not yet added.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No payment details available for your assigned artists.</p>
                  )}

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
                          setPaymentFeedback({ type: "success", msg: "Thanks! We’ve notified your artist(s)." });
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
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold disabled:opacity-50 disabled:pointer-events-none"
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
          <Card className="bg-white/[0.02] backdrop-blur-md border-white/10">
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

          {/* Guest Requests Card */}
          {booking.guestRequests && booking.guestRequests.length > 0 && (
            <Card className="bg-white/[0.02] backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Music className="w-5 h-5 text-amber-500" />
                  Guest Song Requests
                </CardTitle>
                <p className="text-sm text-gray-400">
                  Songs requested by your guests. Move them to your official list if you'd like the DJ to play them.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {booking.guestRequests
                  .filter((req) => req.status === "pending" || req.status === "approved")
                  .map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between py-2 px-3 bg-gray-900/50 rounded border border-gray-700"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium">
                          {req.songTitle}
                          {req.artist && <span className="text-gray-400"> by {req.artist}</span>}
                        </p>
                        {req.guestName && (
                          <p className="text-xs text-gray-500 mt-0.5">— {req.guestName}</p>
                        )}
                      </div>
                      {req.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={async () => {
                            try {
                              const res = await fetch(`/api/client/bookings/${booking.id}/guest-requests/${req.id}/move-to-official`, {
                                method: "POST",
                              });
                              if (res.ok) {
                                // Refresh booking data to get updated guest requests and musicRequests
                                const url = token
                                  ? `/api/client/bookings/${booking.id}?token=${encodeURIComponent(token)}`
                                  : `/api/client/bookings/${booking.id}`;
                                const refreshRes = await fetch(url);
                                if (refreshRes.ok) {
                                  const data = await refreshRes.json();
                                  if (data?.booking) {
                                    setBooking(data.booking);
                                  }
                                }
                              }
                            } catch (error) {
                              console.error("Error moving to official list:", error);
                            }
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs"
                        >
                          Move to Official List
                        </Button>
                      )}
                      {req.status === "moved_to_official" && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/40 text-[10px]">
                          Added to List
                        </Badge>
                      )}
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card className="bg-white/[0.02] backdrop-blur-md border-white/10">
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
