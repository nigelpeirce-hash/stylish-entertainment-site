"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import {
  TERMS_LAST_UPDATED,
  TERMS_INTRO,
  getTermsSectionsForDisplay,
  PRIVACY_LINK_PLACEHOLDER,
} from "@/lib/terms-content";
import {
  generateQuoteSummaryPdf,
  type QuoteSummaryData,
} from "@/lib/quote-summary-pdf";
import { SafeText } from "@/components/SafeText";

export interface AcceptTermsModuleProps {
  /** Whether the user has accepted T&Cs */
  accepted: boolean;
  /** Called when checkbox is toggled */
  onAcceptChange: (accepted: boolean) => void;
  /** Disable checkbox (e.g. while submitting) */
  disabled?: boolean;
  /** Show "Download quote summary PDF" button; requires quoteSummary */
  showDownloadPdf?: boolean;
  /** Data for the quote summary PDF (date, event, venue, Artist) */
  quoteSummary?: QuoteSummaryData;
  /** Validation error message (e.g. "You must accept the Terms & Conditions") */
  error?: string;
  /** Optional class for the wrapper */
  className?: string;
  /** Checkbox/label variant: dark (default) or light */
  variant?: "dark" | "light";
  /** Optional client-specific booking summary to display in T&C dialog (venue, date, fee, talent) */
  bookingSummary?: {
    venueName?: string | null;
    eventDate?: string | Date | null;
    fee?: string | number | null;
    talent?: Array<{ name: string; role?: string }>;
  };
}

function formatDateSafe(d: string | Date | null | undefined): string {
  if (d == null) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function formatFeeSafe(f: string | number | object | null | undefined): string {
  if (f == null) return "";
  if (typeof f === "number") return `£${f}`;
  if (typeof f === "object") {
    const o = f as Record<string, unknown>;
    if ("fee" in o && o.fee != null) return formatFeeSafe(o.fee);
    if ("amount" in o && o.amount != null) return formatFeeSafe(o.amount);
    if ("value" in o && o.value != null) return formatFeeSafe(o.value);
    return "";
  }
  const s = String(f).trim();
  return s ? (s.startsWith("£") ? s : `£${s}`) : "";
}

export function AcceptTermsModule({
  accepted,
  onAcceptChange,
  disabled = false,
  showDownloadPdf = false,
  quoteSummary,
  error,
  className,
  variant = "dark",
  bookingSummary,
}: AcceptTermsModuleProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = () => {
    if (!quoteSummary) return;
    setDownloading(true);
    try {
      generateQuoteSummaryPdf(quoteSummary);
    } finally {
      setDownloading(false);
    }
  };

  const isLight = variant === "light";
  const labelClass = isLight
    ? "text-gray-700 cursor-pointer"
    : "text-gray-300 cursor-pointer";
  const linkClass = isLight
    ? "text-champagne-gold hover:text-champagne-gold/80 underline"
    : "text-champagne-gold hover:text-champagne-gold/80 underline";

  return (
    <div className={className}>
      {showDownloadPdf && quoteSummary && (
        <div className="mb-4">
          <p className={`text-sm mb-2 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            Optionally download a PDF summary (date, venue, artist) for your records. This is not required to accept or submit.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
          >
            <Download className="w-4 h-4 mr-2" />
            {downloading ? "Generating…" : "Download quote summary (PDF)"}
          </Button>
        </div>
      )}

      <div className="flex items-start gap-3">
        <Checkbox
          id="accept-terms"
          checked={accepted}
          onCheckedChange={(c) => onAcceptChange(c === true)}
          disabled={disabled}
          className="mt-1 border-champagne-gold/50 data-[state=checked]:bg-champagne-gold data-[state=checked]:border-champagne-gold"
          aria-invalid={!!error}
          aria-describedby={error ? "accept-terms-error" : undefined}
        />
        <div className="flex-1">
          <Label htmlFor="accept-terms" className={labelClass}>
            I accept the{" "}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className={linkClass}
                  onClick={(e) => {
                    e.preventDefault();
                    setDialogOpen(true);
                  }}
                >
                  Terms & Conditions.
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl flex items-center gap-2 text-white">
                    <FileText className="w-5 h-5 text-champagne-gold" />
                    Terms and Conditions
                  </DialogTitle>
                  <p className="text-gray-400 text-sm mt-1">
                    Last updated:{" "}
                    {TERMS_LAST_UPDATED.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </DialogHeader>
                <p className="mt-4 text-gray-300 leading-relaxed">{TERMS_INTRO}</p>
                {bookingSummary && (bookingSummary.venueName || bookingSummary.eventDate || bookingSummary.fee != null || (bookingSummary.talent?.length ?? 0) > 0) && (
                  <div className="mt-4 p-4 rounded-lg bg-gray-800/80 border border-gray-700">
                    <p className="text-sm font-semibold text-champagne-gold mb-3">Your booking summary</p>
                    <div className="space-y-1 text-sm text-gray-300">
                      {bookingSummary.venueName && <p><strong>Venue:</strong> <SafeText>{bookingSummary.venueName}</SafeText></p>}
                      {bookingSummary.eventDate && <p><strong>Date:</strong> {formatDateSafe(bookingSummary.eventDate)}</p>}
                      {(bookingSummary.fee != null && bookingSummary.fee !== "") && <p><strong>Fee:</strong> <SafeText>{bookingSummary.fee}</SafeText></p>}
                      {bookingSummary.talent && bookingSummary.talent.length > 0 && (
                        <div>
                          <strong>Talent:</strong>
                          <ul className="list-disc pl-5 mt-1">
                            {bookingSummary.talent.map((t, i) => (
                              <li key={i}><SafeText>{t.name}</SafeText>{t.role != null && t.role !== "" ? <> (<SafeText>{t.role}</SafeText>)</> : ""}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="mt-4 space-y-6 text-gray-300">
                  {getTermsSectionsForDisplay(true).map((section) => (
                    <div key={section.id}>
                      <h2 className="text-lg font-bold text-champagne-gold mt-4 mb-2">
                        {section.heading}
                      </h2>
                      {section.id === "data" &&
                      section.body.includes(PRIVACY_LINK_PLACEHOLDER) ? (
                        <p className="leading-relaxed">
                          {section.body
                            .split(PRIVACY_LINK_PLACEHOLDER)[0]
                            .trim()}{" "}
                          <Link
                            href="/privacy-policy"
                            className="text-champagne-gold hover:text-champagne-gold/80 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Privacy Policy
                          </Link>{" "}
                          for more details.
                        </p>
                      ) : (
                        <p className="leading-relaxed">{section.body}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700 space-y-2">
                  <p className="text-sm text-gray-400">
                    <strong className="text-champagne-gold">Questions?</strong>{" "}
                    Contact us at{" "}
                    <a
                      href="tel:+447970793177"
                      className="text-champagne-gold hover:underline"
                    >
                      07970793177
                    </a>{" "}
                    or{" "}
                    <Link
                      href="/contact-us/"
                      className="text-champagne-gold hover:underline"
                    >
                      use our contact form
                    </Link>
                    .
                  </p>
                  <Link
                    href="/terms-and-conditions/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-champagne-gold hover:underline"
                  >
                    View full terms (opens in new tab)
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          </Label>
          {error && (
            <p
              id="accept-terms-error"
              className="text-sm text-red-400 mt-1"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
