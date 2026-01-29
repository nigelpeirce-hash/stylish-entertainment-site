/**
 * Generate a downloadable Quote Summary PDF (date, event, venue, DJ/musician).
 * Offered before T&C acceptance so the client can keep a copy for easy reference.
 * Uses jsPDF – call from client-only code.
 */

import { jsPDF } from "jspdf";

export interface QuoteSummaryData {
  eventDate: string;
  eventType: string;
  venueName: string;
  artistName: string;
  clientName?: string;
  fee?: string;
}

const MARGIN = 20;
const LINE_HEIGHT = 7;

export function generateQuoteSummaryPdf(data: QuoteSummaryData): void {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let y = MARGIN;

  // Header
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text("STYLISH Entertainment", MARGIN, y);
  y += 10;

  pdf.setDrawColor(212, 175, 55);
  pdf.setLineWidth(0.5);
  pdf.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 10;

  // Title
  pdf.setFontSize(18);
  pdf.text("Quote Summary", MARGIN, y);
  y += 12;

  // Formatted date
  const eventDateFormatted = data.eventDate
    ? new Date(data.eventDate).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not set";

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Event type: ${data.eventType || "Not specified"}`, MARGIN, y);
  y += LINE_HEIGHT;
  pdf.text(`Event date: ${eventDateFormatted}`, MARGIN, y);
  y += LINE_HEIGHT;
  pdf.text(`Venue: ${data.venueName || "Not specified"}`, MARGIN, y);
  y += LINE_HEIGHT;
  pdf.text(`Artist: ${data.artistName || "Not specified"}`, MARGIN, y);
  y += LINE_HEIGHT;
  if (data.clientName) {
    pdf.text(`Client: ${data.clientName}`, MARGIN, y);
    y += LINE_HEIGHT;
  }
  if (data.fee) {
    pdf.text(`Fee: ${data.fee}`, MARGIN, y);
    y += LINE_HEIGHT;
  }
  y += 8;

  pdf.setDrawColor(200, 200, 200);
  pdf.line(MARGIN, y, pageWidth - MARGIN, y);
  y += 10;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "italic");
  pdf.setTextColor(100, 100, 100);
  pdf.text(
    "By confirming your booking you agree to our Terms & Conditions.",
    MARGIN,
    y
  );
  y += 6;
  pdf.setFont("helvetica", "normal");
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://stylishentertainment.co.uk";
  pdf.text(`View full terms: ${siteUrl}/terms-and-conditions`, MARGIN, y);

  // Footer
  const footerY = pageHeight - 20;
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(
    `Generated on ${new Date().toLocaleDateString("en-GB")} | Stylish Entertainment Ltd`,
    MARGIN,
    footerY
  );

  const venueSlug = (data.venueName || "venue").replace(/[^a-z0-9]/gi, "-").replace(/-+/g, "-").slice(0, 30);
  const dateSlug = data.eventDate ? new Date(data.eventDate).toISOString().slice(0, 10) : "";
  const fileName = `Quote-Summary-${venueSlug}${dateSlug ? `-${dateSlug}` : ""}.pdf`;
  pdf.save(fileName);
}
