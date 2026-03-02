"use client";

/**
 * ContractFooter – contract section at bottom of portal: event summary, inline readable T&Cs, always-available PDF.
 *
 * - Event-populated summary header (client, event type, date, venue; optional fee).
 * - Inline viewer of TERMS_SECTIONS (from lib/terms-content.ts), collapsible "Read full terms".
 * - "Download PDF" always shown: draft wording when terms not accepted, "Accepted on {date}" when accepted.
 *
 * Used in: client dashboard (SingleEventHero) and portal booking view (PortalView).
 */

import { useState } from "react";
import Link from "next/link";
import { FileText, Download, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateBookingAgreementPdf } from "@/lib/booking-agreement-pdf";
import {
  TERMS_LAST_UPDATED,
  TERMS_INTRO,
  getTermsSectionsForDisplay,
  includesProductionServices,
  PRIVACY_LINK_PLACEHOLDER,
} from "@/lib/terms-content";

export interface ContractFooterBooking {
  id?: string;
  eventType?: string | null;
  eventDate?: Date | string | null;
  venueName?: string | null;
  name?: string | null;
  numberOfGuests?: number | null;
  termsAccepted?: boolean;
  termsAcceptedAt?: Date | string | null;
  termsAcceptedIp?: string | null;
  terms_accepted?: boolean;
  acceptance_timestamp?: Date | string | null;
  acceptance_ip?: string | null;
  /** Optional fee for event summary (e.g. "£150" or "£625") */
  bookingFee?: string | null;
  finalBalance?: string | null;
  /** Used to include Production clause 12 when booking includes lighting/styling/production */
  services?: string[] | null;
  upsellItems?: string[] | null;
}

interface ContractFooterProps {
  booking: ContractFooterBooking;
}

function formatEventDate(d: Date | string | null | undefined): string {
  if (d == null) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ContractFooter({ booking }: ContractFooterProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [fullTermsOpen, setFullTermsOpen] = useState(false);

  const termsAccepted =
    booking.termsAccepted === true || booking.terms_accepted === true;
  const acceptanceTimestamp =
    booking.termsAcceptedAt ?? booking.acceptance_timestamp ?? null;
  const displayFee =
    booking.bookingFee ?? booking.finalBalance ?? null;
  const eventDateStr = formatEventDate(booking.eventDate ?? null);
  const includeProduction = includesProductionServices({
    services: booking.services,
    upsellItems: booking.upsellItems,
  });
  const termsSections = getTermsSectionsForDisplay(includeProduction);

  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true);
    try {
      generateBookingAgreementPdf(booking);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="mt-8 rounded-xl border-t border-champagne-gold/20 bg-gray-900/60 py-6 px-6">
      {/* Event summary header */}
      <div className="mb-6 p-4 rounded-lg bg-gray-800/60 border border-white/10">
        <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-champagne-gold/80 shrink-0" />
          Contract & agreement
        </h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-500">Client</dt>
            <dd className="text-white font-medium">{booking.name || "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Event</dt>
            <dd className="text-white font-medium">{booking.eventType || "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Date</dt>
            <dd className="text-white">{eventDateStr}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Venue</dt>
            <dd className="text-white">{booking.venueName || "—"}</dd>
          </div>
          {displayFee && (
            <div>
              <dt className="text-gray-500">Package / fee</dt>
              <dd className="text-white">{displayFee}</dd>
            </div>
          )}
        </dl>
        {termsAccepted && acceptanceTimestamp && (
          <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-500/40 text-green-400 rounded-full text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Accepted on {formatEventDate(acceptanceTimestamp)}
            </span>
          </div>
        )}
      </div>

      {/* Inline readable terms – collapsible */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setFullTermsOpen((o) => !o)}
          className="flex items-center gap-2 text-champagne-gold hover:text-champagne-gold/80 font-medium text-sm"
        >
          {fullTermsOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          {fullTermsOpen ? "Hide full terms" : "Read full terms"}
        </button>
        {fullTermsOpen && (
          <div className="mt-4 p-4 rounded-lg bg-gray-800/40 border border-white/10 max-h-[60vh] overflow-y-auto space-y-4">
            <p className="text-xs text-gray-500">
              Last updated:{" "}
              {TERMS_LAST_UPDATED.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {TERMS_INTRO}
            </p>
            {termsSections.map((section) => (
              <div key={section.id}>
                <h4 className="text-sm font-semibold text-champagne-gold mb-1">
                  {section.heading}
                </h4>
                {section.id === "data" &&
                section.body.includes(PRIVACY_LINK_PLACEHOLDER) ? (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {section.body
                      .split(PRIVACY_LINK_PLACEHOLDER)[0]
                      .trim()}{" "}
                    <Link
                      href="/privacy-policy/"
                      className="text-champagne-gold hover:underline"
                    >
                      Privacy Policy
                    </Link>{" "}
                    for more details.
                  </p>
                ) : (
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    {section.body}
                  </p>
                )}
              </div>
            ))}
            <p className="text-xs text-gray-500 pt-2">
              Full terms also at{" "}
              <Link
                href="/terms-and-conditions/"
                className="text-champagne-gold hover:underline"
              >
                stylishentertainment.co.uk/terms-and-conditions
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Download PDF – always available */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-gray-400">
          {termsAccepted && acceptanceTimestamp
            ? "Download your booking agreement (with acceptance date)."
            : "Download a draft copy. The PDF will be marked as not yet accepted until you accept terms (e.g. when confirming your booking)."}
        </p>
        <Button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          variant="outline"
          size="sm"
          className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
        >
          <Download className="w-4 h-4 mr-2" />
          {isGeneratingPDF ? "Generating…" : "Download PDF"}
        </Button>
      </div>
    </div>
  );
}
