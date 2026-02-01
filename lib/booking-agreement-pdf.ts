/**
 * Booking Agreement PDF – contract with T&Cs, booking details, and digital signature.
 * Uses shared T&C text from lib/terms-content.ts.
 * PDF title: "Booking Agreement". Used by ContractFooter component.
 */

import { jsPDF } from "jspdf";
import {
  TERMS_SECTIONS,
  TERMS_LAST_UPDATED,
  DEPOSIT_CLAUSE,
  COMPANY_NAME,
  PRIVACY_LINK_PLACEHOLDER,
  TERMS_QUESTIONS,
} from "@/lib/terms-content";

const MARGIN = 20;
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const LINE_HEIGHT = 6;
const SECTION_SPACING = 8;

export interface BookingAgreementData {
  id?: string;
  eventType?: string | null;
  eventDate?: Date | string | null;
  venueName?: string | null;
  name?: string | null;
  numberOfGuests?: number | null;
  /** Whether terms have been accepted (shows signature block) */
  termsAccepted?: boolean;
  termsAcceptedAt?: Date | string | null;
  termsAcceptedIp?: string | null;
  /** Backward compatibility */
  terms_accepted?: boolean;
  acceptance_timestamp?: Date | string | null;
  acceptance_ip?: string | null;
}

/**
 * Add wrapped text to the PDF, advancing y and adding new pages as needed.
 */
function addWrappedText(
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = pdf.splitTextToSize(text, maxWidth);
  for (const line of lines) {
    if (y > PAGE_HEIGHT_MM - MARGIN - 15) {
      pdf.addPage();
      y = MARGIN;
    }
    pdf.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

/**
 * Add a section heading and body, return new y position.
 */
function addSection(
  pdf: jsPDF,
  heading: string,
  body: string,
  x: number,
  y: number,
  maxWidth: number
): number {
  if (y > PAGE_HEIGHT_MM - MARGIN - 30) {
    pdf.addPage();
    y = MARGIN;
  }
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.text(heading, x, y);
  y += LINE_HEIGHT + 2;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  y = addWrappedText(pdf, body, x, y, maxWidth, LINE_HEIGHT);
  return y + SECTION_SPACING;
}

/**
 * Generate and save the Booking Agreement PDF (booking details + full T&Cs + signature block).
 */
export function generateBookingAgreementPdf(booking: BookingAgreementData): void {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const maxWidth = pageWidth - 2 * MARGIN;
  let y = MARGIN;

  // ----- Header -----
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text("STYLISH Entertainment", MARGIN, y);
  y += 10;

  pdf.setDrawColor(212, 175, 55);
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 10;

  // ----- PDF title -----
  pdf.setFontSize(20);
  pdf.text("Booking Agreement", MARGIN, y);
  y += 12;

  // ----- Booking details -----
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  const eventDate =
    booking.eventDate != null
      ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Date not set";

  pdf.text(`Event Type: ${booking.eventType || "Not specified"}`, MARGIN, y);
  y += 7;
  pdf.text(`Event Date: ${eventDate}`, MARGIN, y);
  y += 7;
  pdf.text(`Venue: ${booking.venueName || "Not specified"}`, MARGIN, y);
  y += 7;
  pdf.text(`Client Name: ${booking.name || "Not specified"}`, MARGIN, y);
  y += 7;
  if (booking.numberOfGuests != null && booking.numberOfGuests > 0) {
    pdf.text(`Number of Guests: ${booking.numberOfGuests}`, MARGIN, y);
    y += 7;
  }
  y += 5;

  pdf.setDrawColor(200, 200, 200);
  pdf.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 10;

  // ----- Terms sections (from lib/terms-content) -----
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Terms and Conditions", MARGIN, y);
  y += LINE_HEIGHT + 4;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(80, 80, 80);
  pdf.text(
    `Last updated: ${TERMS_LAST_UPDATED.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
    MARGIN,
    y
  );
  y += SECTION_SPACING;

  pdf.setTextColor(0, 0, 0);
  for (const section of TERMS_SECTIONS) {
    const body = section.body.replace(
      PRIVACY_LINK_PLACEHOLDER,
      "Privacy Policy at stylishentertainment.co.uk/privacy-policy"
    );
    y = addSection(pdf, section.heading, body, MARGIN, y, maxWidth);
  }

  // Deposit clause
  y = addSection(
    pdf,
    DEPOSIT_CLAUSE.heading,
    DEPOSIT_CLAUSE.body,
    MARGIN,
    y,
    maxWidth
  );

  // Questions
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(80, 80, 80);
  y = addWrappedText(pdf, TERMS_QUESTIONS, MARGIN, y, maxWidth, LINE_HEIGHT);
  y += SECTION_SPACING;

  // ----- Digital signature block -----
  const termsAccepted =
    booking.termsAccepted === true || booking.terms_accepted === true;
  const acceptanceTimestamp =
    booking.termsAcceptedAt ??
    booking.acceptance_timestamp ??
    null;
  const acceptanceIp =
    booking.termsAcceptedIp ?? booking.acceptance_ip ?? null;

  if (y > pageHeight - MARGIN - 40) {
    pdf.addPage();
    y = MARGIN;
  }

  pdf.setDrawColor(212, 175, 55);
  pdf.setLineWidth(0.3);
  pdf.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 10;

  if (termsAccepted && acceptanceTimestamp) {
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Digital Signature Confirmation", MARGIN, y);
    y += 8;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const acceptedAt = new Date(acceptanceTimestamp);
    const formattedDate = acceptedAt.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formattedTime = acceptedAt.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    pdf.text("Status: Confirmed", MARGIN, y);
    y += 6;
    pdf.text(`Terms accepted on ${formattedDate} at ${formattedTime}`, MARGIN, y);
    y += 6;
    if (acceptanceIp) {
      pdf.text(`IP Address: ${acceptanceIp}`, MARGIN, y);
      y += 6;
    }
    pdf.text(
      "This document serves as proof of digital signature and contract acceptance.",
      MARGIN,
      y
    );
  } else {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "italic");
    pdf.setTextColor(128, 128, 128);
    pdf.text("Terms acceptance pending", MARGIN, y);
  }

  // ----- Footer on each page -----
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      `Generated on ${new Date().toLocaleDateString("en-GB")} | ${COMPANY_NAME}`,
      MARGIN,
      pageHeight - 20
    );
  }

  const fileName = `Booking-Agreement-${booking.id ?? "contract"}.pdf`;
  pdf.save(fileName);
}
