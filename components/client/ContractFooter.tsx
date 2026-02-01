"use client";

/**
 * ContractFooter – turns booking data into a contract section with T&Cs and optional PDF download.
 *
 * - UI title: "Contract & agreement"
 * - PDF title: "Booking Agreement" (generated via lib/booking-agreement-pdf.ts, using lib/terms-content.ts)
 * - Includes digital signature block when terms are accepted (status, date/time, IP if available)
 *
 * Used in: client dashboard (SingleEventHero) and portal booking view (PortalView).
 */

import { useState } from "react";
import Link from "next/link";
import { FileText, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateBookingAgreementPdf } from "@/lib/booking-agreement-pdf";

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
}

interface ContractFooterProps {
  booking: ContractFooterBooking;
}

export function ContractFooter({ booking }: ContractFooterProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const termsAccepted =
    booking.termsAccepted === true || booking.terms_accepted === true;
  const acceptanceTimestamp =
    booking.termsAcceptedAt ?? booking.acceptance_timestamp ?? null;

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-champagne-gold/80 shrink-0" />
          <div>
            <h3 className="text-base font-semibold text-white">
              Contract & agreement
            </h3>
            <p className="text-sm text-gray-400">
              Terms and booking details
            </p>
          </div>
        </div>
        {termsAccepted && acceptanceTimestamp ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-500/40 text-green-400 rounded-full text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Confirmed
            </span>
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
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">Terms acceptance pending</p>
            <Link
              href="/terms-and-conditions/"
              className="text-sm text-champagne-gold hover:text-champagne-gold/80 underline"
            >
              View Terms & Conditions
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
