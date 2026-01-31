"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Download, CheckCircle2, Music, Banknote, ExternalLink, Sparkles } from "lucide-react";
import { jsPDF } from "jspdf";
import Link from "next/link";
import { motion } from "framer-motion";
import PortalCountdownClock from "@/components/client/PortalCountdownClock";
import MusicPlaylistManager from "@/components/MusicPlaylistManager";
import GuestCountTracker from "@/components/GuestCountTracker";
import BudgetTracker from "@/components/BudgetTracker";
import AddOnConcierge from "@/components/AddOnConcierge";
import CommunicationHistory from "@/components/client/CommunicationHistory";
import HeroPhotoSection from "@/components/client/HeroPhotoSection";
import { getLabel } from "@/lib/eventLabels";

interface SingleEventHeroProps {
  booking: any;
  onHeroUploaded?: () => void;
}

export function SingleEventHero({ booking, onHeroUploaded }: SingleEventHeroProps) {
  const eventDate = booking.eventDate ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "Date not set";

  return (
    <div className="space-y-6">
      {/* Hero header + countdown */}
      <Card className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border-champagne-gold/40 overflow-hidden">
        {booking.portalHeroImageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm"
            style={{
              backgroundImage: `url(${booking.portalHeroImageUrl})`,
            }}
          />
        )}
        {!booking.portalHeroImageUrl && (
          <div className="absolute top-0 right-0 w-64 h-64 bg-champagne-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        )}
        <CardHeader className="relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-champagne-gold" />
                <span className="text-champagne-gold/80 text-sm font-medium uppercase tracking-wider">{booking.eventType}</span>
              </div>
              <CardTitle className="text-3xl md:text-4xl text-white mb-2">
                {booking.eventType}
              </CardTitle>
              <p className="text-gray-300 mb-1">
                <strong className="text-gray-400">Date:</strong> {eventDate}
              </p>
              <p className="text-gray-300 mb-1">
                <strong className="text-gray-400">Venue:</strong> {booking.venueName}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-400">Status:</strong>{" "}
                <span
                  className={`capitalize font-medium ${
                    booking.status === "confirmed"
                      ? "text-green-400"
                      : booking.status === "pending"
                      ? "text-amber-400"
                      : "text-gray-400"
                  }`}
                >
                  {booking.status}
                </span>
              </p>
            </div>
            <div>
              <PortalCountdownClock
                targetDate={
                  (booking.eventType || "").toLowerCase().includes("wedding") &&
                  booking.ceremonyTime
                    ? new Date(booking.ceremonyTime)
                    : new Date(booking.eventDate)
                }
              />
            </div>
          </div>
          <Link
            href={`/client/bookings/${booking.id}`}
            className="inline-flex items-center gap-2 mt-4 text-champagne-gold hover:text-champagne-gold/80 text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            View full booking portal
          </Link>
          <div className="mt-6 pt-4 border-t border-champagne-gold/20">
            <HeroPhotoSection
              heroImageUrl={booking.portalHeroImageUrl}
              eventType={booking.eventType}
              bookingId={booking.id}
              onUploaded={(url) => onHeroUploaded?.()}
            />
          </div>
        </CardHeader>
      </Card>

      {/* 1. Music – first, fun section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="rounded-2xl overflow-hidden border border-champagne-gold/30 bg-gradient-to-b from-gray-800/90 to-gray-900/90">
          <div className="px-6 py-4 bg-champagne-gold/10 border-b border-champagne-gold/30">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Music className="w-6 h-6 text-champagne-gold" />
              Your playlist
            </h2>
            <p className="text-gray-400 text-sm mt-1">Must-plays, first dance, last song – help your DJ nail the vibe</p>
          </div>
          <div className="p-6">
            <MusicPlaylistManager
              bookingId={booking.id}
              eventType={booking.eventType}
              initialData={{
                musicRequests: booking.musicRequests,
                musicDislikes: booking.musicDislikes,
                firstDance: booking.firstDance,
                lastSong: booking.lastSong,
                musicNotesToDJ: booking.musicNotesToDJ,
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* 2. Budget */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/30">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Banknote className="w-5 h-5 text-champagne-gold" />
              Budget & payments
            </CardTitle>
            <p className="text-gray-400 text-sm">Deposit, balance and payment details</p>
          </CardHeader>
          <CardContent>
            <BudgetTracker
              bookingId={booking.id}
              totalBudget={booking.budget}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* 3. Guest count + add-ons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <GuestCountTracker
          bookingId={booking.id}
          initialCount={booking.numberOfGuests || 0}
        />
        <AddOnConcierge
          bookingId={booking.id}
          eventType={booking.eventType}
          eventDate={booking.eventDate}
        />
      </motion.div>

      {/* 4. Messages – email thread */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
      >
        <CommunicationHistory bookingId={booking.id} />
      </motion.div>

      {/* 5. Contract – footer-style at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
      >
        <ContractFooter booking={booking} />
      </motion.div>
    </div>
  );
}

function ContractFooter({ booking }: { booking: any }) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const termsAccepted = booking.terms_accepted === true;
  const acceptanceTimestamp = booking.acceptance_timestamp;
  const acceptanceIp = booking.acceptance_ip;

  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const margin = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = margin;

      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("STYLISH Entertainment", margin, yPosition);
      yPosition += 10;

      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(20);
      pdf.text("Booking Agreement", margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      const eventDate = booking.eventDate
        ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Date not set";

      pdf.text(`Event Type: ${booking.eventType || "Not specified"}`, margin, yPosition);
      yPosition += 7;
      pdf.text(`Event Date: ${eventDate}`, margin, yPosition);
      yPosition += 7;
      pdf.text(`Venue: ${booking.venueName || "Not specified"}`, margin, yPosition);
      yPosition += 7;
      pdf.text(`Client Name: ${booking.name || "Not specified"}`, margin, yPosition);
      yPosition += 7;
      if (booking.numberOfGuests) {
        pdf.text(`Number of Guests: ${booking.numberOfGuests}`, margin, yPosition);
        yPosition += 7;
      }
      yPosition += 5;

      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      if (termsAccepted && acceptanceTimestamp && acceptanceIp) {
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Digital Signature Confirmation", margin, yPosition);
        yPosition += 8;
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        const acceptanceDate = new Date(acceptanceTimestamp);
        const formattedDate = acceptanceDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const formattedTime = acceptanceDate.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });
        pdf.text(`Status: Confirmed`, margin, yPosition);
        yPosition += 6;
        pdf.text(`Terms accepted on ${formattedDate} at ${formattedTime}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`IP Address: ${acceptanceIp}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`This document serves as proof of digital signature and contract acceptance.`, margin, yPosition);
      } else {
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(128, 128, 128);
        pdf.text("Terms acceptance pending", margin, yPosition);
      }

      const footerY = pageHeight - 20;
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        `Generated on ${new Date().toLocaleDateString("en-GB")} | Stylish Entertainment Ltd`,
        margin,
        footerY
      );

      pdf.save(`Booking-Agreement-${booking.id || "contract"}.pdf`);
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
            <h3 className="text-base font-semibold text-white">Contract & agreement</h3>
            <p className="text-sm text-gray-400">Terms and booking details</p>
          </div>
        </div>
        {termsAccepted && acceptanceTimestamp && acceptanceIp ? (
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
          <p className="text-sm text-gray-500">Terms acceptance pending</p>
        )}
      </div>
    </div>
  );
}
