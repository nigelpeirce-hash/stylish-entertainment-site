"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "@/lib/motion";
import PortalCountdownClock from "@/components/client/PortalCountdownClock";
import ClientMusicModule from "@/components/client/ClientMusicModule";
import CommunicationHistory from "@/components/client/CommunicationHistory";
import HeroPhotoSection from "@/components/client/HeroPhotoSection";
import { ContractFooter } from "@/components/client/ContractFooter";
import { DashboardPlanningWidgets } from "@/components/client/DashboardPlanningWidgets";
import { clientBookingPath } from "@/lib/portal-paths";

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
            href={clientBookingPath(booking.id)}
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
            <ClientMusicModule
              bookingId={booking.id}
              eventType={booking.eventType}
              initialData={{
                musicRequests: booking.musicRequests,
                musicDislikes: booking.musicDislikes,
                firstDance: booking.firstDance,
                lastSong: booking.lastSong,
                musicNotesToDJ: booking.musicNotesToDJ,
                musicFileUrl: booking.musicFileUrl,
              }}
              variant="card"
            />
          </div>
        </div>
      </motion.div>

      <DashboardPlanningWidgets booking={booking} layout="single" />

      {/* Messages – email thread */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
      >
        <CommunicationHistory bookingId={booking.id} />
      </motion.div>

      {/* Contract – footer-style at bottom (ContractFooter: Booking Agreement PDF + T&Cs) */}
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
