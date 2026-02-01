"use client";

/**
 * PortalDemoModal
 *
 * Demo-only implementation of the wedding client portal.
 * Shown as a full-screen modal from /wedding-dj to help couples understand
 * how organised and stress-free the service is.
 *
 * In production, real data would come from authenticated API calls
 * (booking, playlist, guest requests) tied to the logged-in client.
 * This version uses hardcoded mock data and is read-only.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Clock, Music, Users, Calendar, MapPin, FileText, Download } from "lucide-react";
import Link from "next/link";
import {
  TERMS_SECTIONS,
  TERMS_ABRIDGED,
  DEPOSIT_CLAUSE,
  COMPANY_NAME,
  COMPANY_ADDRESS,
  COMPANY_SIGNATORIES,
  TERMS_LAST_UPDATED,
  PRIVACY_LINK_PLACEHOLDER,
} from "@/lib/terms-content";
import { generateBookingAgreementPdf } from "@/lib/booking-agreement-pdf";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// -----------------------------------------------------------------------------
// Mock data (hardcoded for demo only)
// -----------------------------------------------------------------------------

const DEMO_BOOKING = {
  couple: { name1: "Sarah", name2: "James" },
  weddingDate: new Date("2026-06-14T18:30:00"),
  venue: { name: "North Cadbury Court", location: "Somerset" },
  dj: "DJ Nige",
  startTime: "6:30pm",
  endTime: "Midnight",
  equipment: "Premium sound system, wireless mic, uplighting included",
  status: "Confirmed",
};

const DEMO_MUST_PLAY = [
  { label: "First Dance", song: "At Last", artist: "Etta James" },
  { label: "Father/Daughter", song: "The Way You Look Tonight", artist: "Frank Sinatra" },
  { label: "Mother/Son", song: "What A Wonderful World", artist: "Louis Armstrong" },
  { song: "Golden", artist: "Harry Styles" },
  { song: "Don't Stop Me Now", artist: "Queen" },
  { song: "Mr Brightside", artist: "The Killers" },
  { song: "Crazy In Love", artist: "Beyoncé" },
  { song: "September", artist: "Earth, Wind & Fire" },
];

const DEMO_DO_NOT_PLAY = [
  { song: "YMCA", artist: "Village People" },
  { song: "Agadoo", artist: "Black Lace" },
  { song: "The Macarena", artist: "Los Del Rio" },
  { song: "Gangnam Style", artist: "PSY" },
  { song: "Baby Shark", artist: "Pinkfong" },
];

const DEMO_REQUESTS = [
  { song: "Uptown Funk", guest: "Uncle Mike", status: "approved" as const },
  { song: "Dancing Queen", guest: "Aunt Sue", status: "approved" as const },
  { song: "Wonderwall", guest: "Best Man Tom", status: "pending" as const },
  { song: "Sweet Caroline", guest: "Cousin Emma", status: "approved" as const },
  { song: "Bohemian Rhapsody", guest: "Dad", status: "approved" as const },
  { song: "Cotton Eye Joe", guest: "Cousin Dave", status: "declined" as const },
];

const DEMO_TIMELINE = [
  { time: "6:30pm", label: "DJ Arrival & Setup" },
  { time: "7:30pm", label: "Background music during dinner" },
  { time: "9:00pm", label: "First Dance: At Last" },
  { time: "9:05pm", label: "Father/Daughter Dance" },
  { time: "9:10pm", label: "Open the floor" },
  { time: "11:45pm", label: "Last Song: Don't Stop Believin'" },
  { time: "12:00am", label: "End" },
];

// -----------------------------------------------------------------------------
// Countdown hook
// -----------------------------------------------------------------------------

function useCountdown(targetDate: Date) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const target = targetDate.getTime();
      const diff = Math.max(0, target - now);

      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setRemaining({ days, hours, minutes, seconds });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return remaining;
}

// -----------------------------------------------------------------------------
// Contract tab – personalised T&Cs + acceptance (demo)
// -----------------------------------------------------------------------------

function normalizeName(s: string) {
  return String(s || "")
    .trim()
    .replace(/[\s\u00A0\u200B-\u200D\uFEFF]+/g, " ") // collapse spaces, nbsp, zero-width
    .replace(/&|＆|﹠/g, " and ")                       // normalise ampersand variants
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function nameMatchesBooking(name: string): boolean {
  const n = normalizeName(name);
  return n === "sarah and james"; // accepts "Sarah & James" or "Sarah and James"
}

function ContractTabContent() {
  const [accepted, setAccepted] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [signName, setSignName] = useState("");
  const [nameError, setNameError] = useState("");
  const [acceptDate, setAcceptDate] = useState("");
  const [acceptTime, setAcceptTime] = useState("");
  const [signedName, setSignedName] = useState("");
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleAccept = useCallback(() => {
    setNameError("");
    const enteredNorm = normalizeName(signName);

    if (!checkbox) {
      setNameError("Please tick the checkbox to confirm you have read and accept the terms.");
      return;
    }
    if (!nameMatchesBooking(signName)) {
      setNameError("Name must match booking (Sarah & James or Sarah and James)");
      return;
    }

    setAccepted(true);
    setSignedName(signName.trim());
    const now = new Date();
    setAcceptDate(now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
    setAcceptTime(now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
  }, [checkbox, signName]);

  const handleDownloadPdf = useCallback(() => {
    setGeneratingPdf(true);
    try {
      const demoBooking = {
        name: `${DEMO_BOOKING.couple.name1} & ${DEMO_BOOKING.couple.name2}`,
        eventDate: DEMO_BOOKING.weddingDate,
        venueName: DEMO_BOOKING.venue.name,
        eventType: "wedding",
        termsAccepted: accepted,
        termsAcceptedAt: accepted ? new Date() : null,
      };
      generateBookingAgreementPdf(demoBooking);
    } finally {
      setGeneratingPdf(false);
    }
  }, [accepted]);

  const renderSectionBody = (section: { id: string; body: string }) => {
    if (section.id === "data" && section.body.includes(PRIVACY_LINK_PLACEHOLDER)) {
      const [before, after] = section.body.split(PRIVACY_LINK_PLACEHOLDER);
      return (
        <>
          {before.trim()}{" "}
          <Link href="/privacy-policy" className="text-champagne-gold hover:underline">
            Privacy Policy
          </Link>{" "}
          {after?.trim() || ""}
        </>
      );
    }
    return section.body;
  };

  const eventDateStr = DEMO_BOOKING.weddingDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Contract & agreement</h2>
      <p className="text-gray-400 mb-6">
        Your booking agreement and terms. Read, accept and sign below.
      </p>

      {!accepted ? (
        <>
          <div className="bg-gray-900/60 rounded-lg border border-white/10 p-6 mb-6 max-h-[360px] overflow-y-auto text-sm leading-relaxed">
            <h3 className="text-base font-semibold text-champagne-gold mb-2">
              Booking Agreement – Personalised for {DEMO_BOOKING.couple.name1} & {DEMO_BOOKING.couple.name2}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Last updated: {TERMS_LAST_UPDATED.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="mb-4">
              <strong className="text-white">{COMPANY_NAME}</strong>
              <br />
              <span className="text-gray-400">{COMPANY_ADDRESS}</span>
            </p>
            <p className="mb-4">
              <strong className="text-white">Client</strong>
              <br />
              {DEMO_BOOKING.couple.name1} & {DEMO_BOOKING.couple.name2}
            </p>
            <p className="mb-4">
              <strong className="text-white">Booking Details</strong>
              <br />
              This agreement is for the provision of <strong>{DEMO_BOOKING.dj}</strong> at{" "}
              <strong>{DEMO_BOOKING.venue.name}</strong> on <strong>{eventDateStr}</strong>.
            </p>
            <p className="mb-4 text-gray-400 whitespace-pre-line text-xs">{TERMS_ABRIDGED}</p>
            <p className="mb-4 text-sm">
              Full terms at{" "}
              <Link href="/terms-and-conditions" className="text-champagne-gold hover:underline">
                stylishentertainment.co.uk/terms-and-conditions
              </Link>
            </p>
            {TERMS_SECTIONS.slice(0, 4).map((s) => (
              <div key={s.id} className="mb-4">
                <strong className="text-white">{s.heading}</strong>
                <p className="mt-1 text-gray-400">{renderSectionBody(s)}</p>
              </div>
            ))}
            <p className="mb-4">
              <strong>{DEPOSIT_CLAUSE.heading}</strong>
              <br />
              <span className="text-gray-400">{DEPOSIT_CLAUSE.body}</span>
            </p>
            <p className="border-t border-gray-600 pt-4 mt-4 text-xs text-gray-500">
              For {COMPANY_NAME}, {COMPANY_ADDRESS}. Signed: {COMPANY_SIGNATORIES} (pre-signed)
            </p>
          </div>

          <div className="p-4 bg-black/30 rounded-lg border border-white/5">
            <label className="block mb-4">
              <input
                type="checkbox"
                checked={checkbox}
                onChange={(e) => setCheckbox(e.target.checked)}
                className="mr-2 rounded"
              />
              <span className="text-gray-300 text-sm">
                I have read and accept the Terms & Conditions. I agree that typing my name below constitutes my electronic signature.
              </span>
            </label>
            <label className="block mb-2 text-sm text-gray-400">Type your full name to confirm:</label>
            <input
              type="text"
              value={signName}
              onChange={(e) => setSignName(e.target.value)}
              placeholder="Sarah & James"
              className={`w-full px-3 py-2.5 bg-gray-900 border rounded-lg text-white text-sm mb-2 ${nameError ? "border-red-500" : "border-gray-600"}`}
            />
            {nameError && <p className="text-red-400 text-xs mb-2">{nameError}</p>}
            <button
              type="button"
              onClick={handleAccept}
              className="px-6 py-3 bg-champagne-gold text-black font-semibold rounded-lg text-sm hover:bg-champagne-gold/90 transition-colors"
            >
              Accept & Sign
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="p-4 mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/40">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Confirmed
            </span>
            <p className="text-gray-300 text-sm">
              Terms accepted on <strong>{acceptDate}</strong> at <strong>{acceptTime}</strong>
            </p>
            <p className="text-champagne-gold text-xs font-mono mt-2">Signed as: {signedName}</p>
          </div>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-champagne-gold border border-champagne-gold/50 rounded-lg text-sm hover:bg-champagne-gold/20 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {generatingPdf ? "Generating…" : "Download PDF"}
          </button>
        </>
      )}

      {/* Contract footer – company details */}
      <div className="mt-8 pt-6 border-t border-champagne-gold/20">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-5 h-5 text-champagne-gold/80 shrink-0" />
          <h3 className="text-base font-semibold text-white">Contract & agreement</h3>
        </div>
        <p className="text-sm text-gray-400">
          {COMPANY_NAME} · {COMPANY_ADDRESS}
        </p>
        <p className="text-xs text-gray-500 mt-1">Signed: {COMPANY_SIGNATORIES}</p>
      </div>
    </>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

interface PortalDemoModalProps {
  open?: boolean;
  onClose?: () => void;
  /** When true, renders as embeddable content (no modal overlay, no close button) */
  embedded?: boolean;
}

export default function PortalDemoModal({ open = true, onClose, embedded = false }: PortalDemoModalProps) {
  const countdown = useCountdown(DEMO_BOOKING.weddingDate);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!embedded && open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      if (!embedded) document.body.style.overflow = "";
    };
  }, [open, handleEscape, embedded]);

  const content = (
    <div
      className={
        embedded
          ? "flex flex-col min-h-[600px] bg-gray-950"
          : "fixed inset-0 z-[100] flex flex-col min-h-screen bg-gray-950"
      }
    >
      {/* Header */}
      <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-white/10 bg-gray-950/95 backdrop-blur px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-white">
            {DEMO_BOOKING.couple.name1} & {DEMO_BOOKING.couple.name2}&apos;s Wedding
          </span>
          {!embedded && (
            <Badge
              variant="secondary"
              className="border-amber-500/40 bg-amber-500/10 text-amber-200 text-xs font-medium"
            >
              Demo
            </Badge>
          )}
        </div>
        {!embedded && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-champagne-gold -m-1"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </header>

          {/* Tab navigation + content */}
          <div className="flex-1 flex flex-col min-h-0 border-b border-white/10">
            <Tabs defaultValue="welcome" className="flex flex-col flex-1 min-h-0 w-full">
              <div className="shrink-0 px-4 py-2 md:px-6 bg-gray-900/50 -mx-4 md:mx-0 overflow-x-auto overflow-y-hidden touch-pan-x overscroll-x-contain" style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
                <TabsList className="h-auto w-max min-w-full justify-start gap-1 flex-nowrap bg-transparent p-0 border-0">
                  <TabsTrigger value="welcome" className="shrink-0 py-3 px-4 min-h-[44px]">Your Day</TabsTrigger>
                  <TabsTrigger value="music" className="shrink-0 py-3 px-4 min-h-[44px]">Your Soundtrack</TabsTrigger>
                  <TabsTrigger value="requests" className="shrink-0 py-3 px-4 min-h-[44px]">Guest Requests</TabsTrigger>
                  <TabsTrigger value="timeline" className="shrink-0 py-3 px-4 min-h-[44px]">Your Evening</TabsTrigger>
                  <TabsTrigger value="booking" className="shrink-0 py-3 px-4 min-h-[44px]">All Confirmed</TabsTrigger>
                  <TabsTrigger value="contract" className="shrink-0 py-3 px-4 min-h-[44px]">Contract</TabsTrigger>
                </TabsList>
              </div>

              {/* Content area - scrollable */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 md:px-6 md:py-8">
                <TabsContent value="welcome" className="mt-0 max-w-3xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    So, {DEMO_BOOKING.couple.name1} & {DEMO_BOOKING.couple.name2} — your big day is coming
                  </h2>
                  <p className="text-gray-400 mb-8">
                    Wedding planning, without the stress. Everything in one place.
                  </p>

                  {/* Countdown */}
                  <div className="flex flex-col items-center py-8 mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-champagne-gold/10 rounded-full blur-3xl scale-150 opacity-60" />
                      <svg className="relative w-48 h-48 md:w-56 md:h-56 -rotate-90 mx-auto" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                        <motion.circle
                          cx="100"
                          cy="100"
                          r="90"
                          fill="none"
                          stroke="url(#demo-countdown-gradient)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 90}
                          initial={{ strokeDashoffset: 2 * Math.PI * 90 * 0.5 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 90 * (1 - Math.min(1, countdown.days / 365)) }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="demo-countdown-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#f4cf6d" stopOpacity="0.6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          key={countdown.days}
                          initial={{ scale: 0.92, opacity: 0.6 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="text-5xl md:text-6xl font-extralight text-white tabular-nums"
                        >
                          {countdown.days}
                        </motion.span>
                        <span className="text-xs uppercase tracking-widest text-white/40 mt-1">days</span>
                      </div>
                    </div>
                    <p className="mt-6 text-lg font-light text-white/90">Until you say &ldquo;I do&rdquo;</p>
                    <p className="mt-2 text-sm text-white/40">{countdown.hours}h {countdown.minutes}m to go</p>
                    <p className="mt-4 text-xs uppercase tracking-widest text-champagne-gold/70">
                      {countdown.days > 60 ? "Plenty of time — enjoy planning" : "Everything's on track"}
                    </p>
                  </div>

                  {/* Progress indicator */}
                  <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    <p className="text-sm text-emerald-200/90">You&apos;re on track. Music chosen, venue confirmed, DJ assigned.</p>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-white/5 border-champagne-gold/20">
                      <CardContent className="p-4 flex items-center gap-3">
                        <CheckCircle2 className="h-8 w-8 text-champagne-gold shrink-0" />
                        <div>
                          <p className="text-sm text-gray-400">Your DJ</p>
                          <p className="font-semibold text-white">{DEMO_BOOKING.dj}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-champagne-gold/20">
                      <CardContent className="p-4 flex items-center gap-3">
                        <MapPin className="h-8 w-8 text-champagne-gold shrink-0" />
                        <div>
                          <p className="text-sm text-gray-400">Where it&apos;s happening</p>
                          <p className="font-semibold text-white">{DEMO_BOOKING.venue.name}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-champagne-gold/20">
                      <CardContent className="p-4 flex items-center gap-3">
                        <Music className="h-8 w-8 text-champagne-gold shrink-0" />
                        <div>
                          <p className="text-sm text-gray-400">Your soundtrack</p>
                          <p className="font-semibold text-white">8 must-plays · 5 vetoes</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="music" className="mt-0 max-w-3xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">The songs that matter</h2>
                  <p className="text-gray-400 mb-6">
                    Moments you&apos;ve chosen. Add, tweak, or reorder anytime — your DJ will follow your list.
                  </p>

                  <Accordion type="multiple" defaultValue={["must", "donot"]} className="space-y-2">
                    <AccordionItem value="must" className="border border-white/10 rounded-lg px-4 bg-white/5">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="text-champagne-gold font-semibold">Definitely play these</span>
                        <span className="text-gray-400 text-sm font-normal ml-2">({DEMO_MUST_PLAY.length})</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-2">
                          {DEMO_MUST_PLAY.map((t, i) => (
                            <li key={i} className="flex items-baseline gap-2 text-gray-200">
                              {t.label && (
                                <span className="text-xs text-gray-500 shrink-0 w-24">{t.label}:</span>
                              )}
                              <span>&ldquo;{t.song}&rdquo; — {t.artist}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="donot" className="border border-white/10 rounded-lg px-4 bg-white/5">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="text-red-400/90 font-semibold">The sacred veto — absolutely not</span>
                        <span className="text-gray-400 text-sm font-normal ml-2">({DEMO_DO_NOT_PLAY.length})</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pt-2">
                          {DEMO_DO_NOT_PLAY.map((t, i) => (
                            <li key={i} className="text-gray-200">
                              &ldquo;{t.song}&rdquo; — {t.artist}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <p className="text-sm text-gray-500 mt-6">
                    A real DJ reviews your choices. Everything double-checked before the day.
                  </p>
                </TabsContent>

                <TabsContent value="requests" className="mt-0 max-w-3xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">What your guests want to hear</h2>
                  <p className="text-gray-400 mb-4">
                    You&apos;re in charge. Approve the ones you like, decline the rest. Nothing plays without your tick.
                  </p>

                  <div className="space-y-2 mb-4 p-3 rounded-lg bg-gray-900/50 border border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">What the labels mean</p>
                    <p className="text-sm text-gray-300"><span className="text-emerald-400">Approved</span> — On the list. Your DJ will play it.</p>
                    <p className="text-sm text-gray-300"><span className="text-amber-400">Pending</span> — Waiting for your say.</p>
                    <p className="text-sm text-gray-300"><span className="text-red-400/90">Declined</span> — Thanks, but no. Won&apos;t be played.</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {DEMO_REQUESTS.map((r, i) => (
                      <Card key={i} className="bg-white/5 border-white/10">
                        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="font-medium text-white">&ldquo;{r.song}&rdquo;</p>
                            <p className="text-sm text-gray-500">{r.guest}</p>
                          </div>
                          <Badge
                            className={
                              r.status === "approved"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : r.status === "pending"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : "bg-red-500/20 text-red-300 border-red-500/40"
                            }
                          >
                            {r.status === "approved" ? "On the list" : r.status === "pending" ? "Your call" : "Declined"}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <p className="text-sm text-champagne-gold/90 font-medium">
                    Your DJ follows your choices. Nothing sneaks onto the playlist.
                  </p>
                </TabsContent>

                <TabsContent value="timeline" className="mt-0 max-w-3xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Your evening, in order</h2>
                  <p className="text-gray-400 mb-6">
                    All agreed in advance. No surprises on the night.
                  </p>

                  <div className="relative pl-6 border-l-2 border-champagne-gold/30 space-y-6">
                    {DEMO_TIMELINE.map((item, i) => (
                      <div key={i} className="relative -left-6">
                        <div className="absolute left-0 w-3 h-3 rounded-full bg-champagne-gold -translate-x-[7px] translate-y-1.5" />
                        <div className="pl-4">
                          <p className="font-semibold text-champagne-gold">{item.time}</p>
                          <p className="text-gray-200">{item.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="booking" className="mt-0 max-w-3xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">All locked in</h2>
                  <p className="text-gray-400 mb-6">
                    Your DJ has everything. We&apos;ll double-check before the day.
                  </p>

                  <Card className="bg-white/5 border-champagne-gold/30">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-champagne-gold shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">You</p>
                          <p className="font-semibold text-white">{DEMO_BOOKING.couple.name1} & {DEMO_BOOKING.couple.name2}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-champagne-gold shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-semibold text-white">Saturday 14 June 2026</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-champagne-gold shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Venue</p>
                          <p className="font-semibold text-white">{DEMO_BOOKING.venue.name}, {DEMO_BOOKING.venue.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Music className="h-5 w-5 text-champagne-gold shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">DJ</p>
                          <p className="font-semibold text-white">{DEMO_BOOKING.dj}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-champagne-gold shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-semibold text-white">{DEMO_BOOKING.startTime} – {DEMO_BOOKING.endTime}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-sm text-gray-500">What&apos;s included</p>
                        <p className="font-semibold text-white">{DEMO_BOOKING.equipment}</p>
                      </div>
                      <div className="pt-2">
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          All confirmed
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <p className="text-gray-400 text-sm mt-6">
                    No last-minute surprises. We&apos;ve got you.
                  </p>
                </TabsContent>

                <TabsContent value="contract" className="mt-0 max-w-3xl mx-auto">
                  <ContractTabContent />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
