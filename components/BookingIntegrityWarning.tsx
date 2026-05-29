"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "@/lib/motion";
import { AlertTriangle, X, Merge, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ConflictResolver } from "@/components/ConflictResolver";

interface ConflictData {
  status: "POTENTIAL_DUPLICATE" | "NAME_MATCH_WARNING";
  existingBooking: {
    id: string;
    bookingReference: string | null;
    email: string;
    name: string;
    eventDate: string;
    venueName: string;
    venuePostcode: string | null;
    authorizedSenders: string[];
  };
  nameSimilarity?: number;
  currentBooking?: any;
}

interface BookingIntegrityWarningProps {
  bookingId?: string;
  onDismiss?: () => void;
  onMerge?: (bookingId: string) => void;
}

export function BookingIntegrityWarning({
  bookingId,
  onDismiss,
  onMerge,
}: BookingIntegrityWarningProps) {
  const [conflicts, setConflicts] = useState<ConflictData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    fetchConflicts();
    // Poll for conflicts every 5 minutes (Chill Mode)
    const interval = setInterval(fetchConflicts, 300000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const fetchConflicts = async () => {
    try {
      setLoading(true);
      // Fetch all bookings to check for conflicts
      const response = await fetch("/api/admin/bookings/?status=all", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        const bookings = data.bookings || [];

        // Check each booking for conflicts
        const conflictChecks = await Promise.all(
          bookings
            .filter((b: any) => !dismissed.includes(b.id))
            .map(async (booking: any) => {
              if (!booking.eventDate || !booking.venuePostcode) {
                return null;
              }

              const checkResponse = await fetch(
                `/api/admin/bookings/check-conflicts?email=${encodeURIComponent(
                  booking.email
                )}&eventDate=${encodeURIComponent(booking.eventDate)}&venuePostcode=${encodeURIComponent(
                  booking.venuePostcode || ""
                )}`,
                { credentials: "include" }
              );

              if (checkResponse.ok) {
                const checkData = await checkResponse.json();
                if (checkData.status === "CONFLICT" && checkData.existingBooking) {
                  return {
                    ...checkData,
                    currentBooking: booking,
                  };
                }
              }
              return null;
            })
        );

        const foundConflicts = conflictChecks.filter(
          (c): c is ConflictData & { currentBooking: any } => c !== null
        );

        setConflicts(
          foundConflicts.map((c) => ({
            status: c.status,
            existingBooking: c.existingBooking,
            currentBooking: c.currentBooking,
            nameSimilarity: c.nameSimilarity,
          })) as any
        );
      }
    } catch (error) {
      console.error("Error fetching conflicts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (conflictId: string) => {
    setDismissed([...dismissed, conflictId]);
    const updatedConflicts = conflicts.filter(
      (c) => c.existingBooking.id !== conflictId
    );
    setConflicts(updatedConflicts);
    onDismiss?.();
  };

  const handleMerge = (existingBookingId: string) => {
    onMerge?.(existingBookingId);
  };

  if (loading || conflicts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <AnimatePresence>
        {conflicts.map((conflict, index) => {
          const currentBooking = conflict.currentBooking || {};
          return (
            <motion.div
              key={`${conflict.existingBooking.id}-${currentBooking.id || "new"}`}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <ConflictResolver
                conflictStatus={conflict.status}
                existingBooking={conflict.existingBooking}
                newBooking={{
                  email: currentBooking.email || "",
                  name: currentBooking.name || "",
                  eventDate: currentBooking.eventDate || "",
                  venueName: currentBooking.venueName || "",
                  venuePostcode: currentBooking.venuePostcode || null,
                  phoneAreaCode: currentBooking.phoneAreaCode,
                  phoneNumber: currentBooking.phoneNumber,
                  eventType: currentBooking.eventType,
                  message: currentBooking.message,
                }}
                newBookingId={currentBooking.id}
                nameSimilarity={conflict.nameSimilarity}
                onResolve={(action) => {
                  if (action === "linked" || action === "kept_separate") {
                    handleDismiss(conflict.existingBooking.id);
                  }
                }}
                onDismiss={() => handleDismiss(conflict.existingBooking.id)}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
