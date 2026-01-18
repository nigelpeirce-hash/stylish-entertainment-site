"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Download, CheckCircle2 } from "lucide-react";
import { jsPDF } from "jspdf";
import CountdownClock from "@/components/CountdownClock";
import MusicPlaylistManager from "@/components/MusicPlaylistManager";
import GuestCountTracker from "@/components/GuestCountTracker";
import BudgetTracker from "@/components/BudgetTracker";
import AddOnConcierge from "@/components/AddOnConcierge";
import { getLabel } from "@/lib/eventLabels";

interface SingleEventHeroProps {
  booking: any;
}

export function SingleEventHero({ booking }: SingleEventHeroProps) {
  return (
    <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-3xl md:text-4xl text-white mb-2">
              {booking.eventType}
            </CardTitle>
            <p className="text-gray-200 mb-1">
              <strong>Date:</strong> {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Date not set'}
            </p>
            <p className="text-gray-200 mb-1">
              <strong>Venue:</strong> {booking.venueName}
            </p>
            <p className="text-gray-200">
              <strong>Status:</strong>{" "}
              <span
                className={`capitalize ${
                  booking.status === "confirmed"
                    ? "text-green-400"
                    : booking.status === "pending"
                    ? "text-yellow-400"
                    : "text-gray-400"
                }`}
              >
                {booking.status}
              </span>
            </p>
          </div>
          {/* Countdown Clock with border and pulse */}
          <div className="border-2 border-champagne-gold/50 rounded-lg p-4 animate-pulse">
            <CountdownClock targetDate={new Date(booking.eventDate)} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            {/* Guest Count Tracker */}
            <GuestCountTracker
              bookingId={booking.id}
              initialCount={booking.numberOfGuests || 0}
            />
            {/* Add-On Concierge */}
            <AddOnConcierge
              bookingId={booking.id}
              eventType={booking.eventType}
              eventDate={booking.eventDate}
            />
            {/* Event Timeline - Removed for now (see TIMELINE_TASKS_BACKUP.md) */}
            {/* Wedding Planning Checklist - Removed for now (see TIMELINE_TASKS_BACKUP.md) */}
          </TabsContent>

          <TabsContent value="music" className="mt-6">
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
          </TabsContent>

          <TabsContent value="budget" className="mt-6">
            <BudgetTracker
              bookingId={booking.id}
              totalBudget={booking.budget}
            />
          </TabsContent>

          <TabsContent value="contract" className="mt-6">
            <ContractSection booking={booking} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Contract Section Component
function ContractSection({ booking }: { booking: any }) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Check if terms were accepted
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

      // Header with logo/company name
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("STYLISH Entertainment", margin, yPosition);
      yPosition += 10;

      // Divider line
      pdf.setDrawColor(212, 175, 55); // Champagne gold
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Title
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("Booking Agreement", margin, yPosition);
      yPosition += 10;

      // Booking Details
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      
      const eventDate = booking.eventDate
        ? new Date(booking.eventDate).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'Date not set';

      pdf.text(`Event Type: ${booking.eventType || 'Not specified'}`, margin, yPosition);
      yPosition += 7;
      pdf.text(`Event Date: ${eventDate}`, margin, yPosition);
      yPosition += 7;
      pdf.text(`Venue: ${booking.venueName || 'Not specified'}`, margin, yPosition);
      yPosition += 7;
      pdf.text(`Client Name: ${booking.name || 'Not specified'}`, margin, yPosition);
      yPosition += 7;
      if (booking.numberOfGuests) {
        pdf.text(`Number of Guests: ${booking.numberOfGuests}`, margin, yPosition);
        yPosition += 7;
      }
      yPosition += 5;

      // Divider
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Digital Signature Section
      if (termsAccepted && acceptanceTimestamp && acceptanceIp) {
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Digital Signature Confirmation", margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        
        const acceptanceDate = new Date(acceptanceTimestamp);
        const formattedDate = acceptanceDate.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        const formattedTime = acceptanceDate.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
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

      // Footer
      const footerY = pageHeight - 20;
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(128, 128, 128);
      pdf.text(
        `Generated on ${new Date().toLocaleDateString('en-GB')} | Stylish Entertainment Ltd`,
        margin,
        footerY
      );

      // Save PDF
      const fileName = `Booking-Agreement-${booking.id || 'contract'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-champagne-gold" />
          Contract & Agreement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {termsAccepted && acceptanceTimestamp && acceptanceIp ? (
          <>
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-champagne-gold" />
              <span className="px-3 py-1 bg-champagne-gold/20 border border-champagne-gold/50 text-champagne-gold font-semibold rounded-full text-sm">
                Status: Confirmed
              </span>
            </div>

            {/* Acceptance Metadata */}
            <div className="bg-gray-900/50 border border-champagne-gold/30 rounded-lg p-4 space-y-2">
              {(() => {
                const acceptanceDate = new Date(acceptanceTimestamp);
                const formattedDate = acceptanceDate.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });
                const formattedTime = acceptanceDate.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Terms accepted on <span className="font-semibold text-white">{formattedDate}</span> at{" "}
                    <span className="font-semibold text-white">{formattedTime}</span> from IP:{" "}
                    <span className="font-mono text-champagne-gold">{acceptanceIp}</span>
                  </p>
                );
              })()}
            </div>

            {/* Download PDF Button */}
            <Button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="w-full bg-champagne-gold text-black hover:bg-champagne-gold/90 font-semibold"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingPDF ? "Generating PDF..." : "Download PDF Agreement"}
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Contract acceptance pending</p>
            <p className="text-sm text-gray-500">
              Terms and conditions acceptance will be recorded here once you complete the secure booking process.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
