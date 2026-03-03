"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  X,
  Link2,
  Copy,
  CheckCircle2,
  User,
  Mail,
  Calendar,
  MapPin,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface ExistingBooking {
  id: string;
  bookingReference: string | null;
  email: string;
  name: string;
  eventDate: string;
  venueName: string;
  venuePostcode: string | null;
  authorizedSenders: string[];
  phoneAreaCode?: string | null;
  phoneNumber?: string | null;
  eventType?: string;
  message?: string | null;
}

interface NewBooking {
  email: string;
  name: string;
  eventDate: string;
  venueName: string;
  venuePostcode: string | null;
  phoneAreaCode?: string | null;
  phoneNumber?: string | null;
  eventType?: string;
  message?: string | null;
}

interface ConflictResolverProps {
  conflictStatus: "POTENTIAL_DUPLICATE" | "NAME_MATCH_WARNING";
  existingBooking: ExistingBooking;
  newBooking: NewBooking;
  newBookingId?: string;
  nameSimilarity?: number;
  onResolve: (action: "linked" | "kept_separate") => void;
  onDismiss?: () => void;
}

export function ConflictResolver({
  conflictStatus,
  existingBooking,
  newBooking,
  newBookingId,
  nameSimilarity,
  onResolve,
  onDismiss,
}: ConflictResolverProps) {
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState<string | null>(null);

  const handleLinkEmail = async () => {
    setResolving(true);
    try {
      const response = await fetch(`/api/admin/bookings/${existingBooking.id}/link-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newEmail: newBooking.email,
          newBookingId: newBookingId,
        }),
      });

      if (response.ok) {
        setResolved("linked");
        onResolve("linked");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to link email");
        setResolving(false);
      }
    } catch (error) {
      console.error("Error linking email:", error);
      alert("An error occurred");
      setResolving(false);
    }
  };

  const handleKeepSeparate = async () => {
    setResolving(true);
    try {
      const response = await fetch(`/api/admin/bookings/${newBookingId}/resolve-conflict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "keep_separate",
        }),
      });

      if (response.ok) {
        setResolved("kept_separate");
        onResolve("kept_separate");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to resolve conflict");
        setResolving(false);
      }
    } catch (error) {
      console.error("Error resolving conflict:", error);
      alert("An error occurred");
      setResolving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPhone = (areaCode: string | null | undefined, number: string | null | undefined) => {
    if (areaCode && number) {
      return `${areaCode} ${number}`;
    }
    return "Not provided";
  };

  if (resolved) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6"
      >
        <Card className="bg-green-900/30 border-green-500/50">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Conflict Resolved
            </h3>
            <p className="text-gray-300">
              {resolved === "linked"
                ? "Email has been linked to the existing booking."
                : "Booking has been marked as separate."}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mb-6"
    >
      <Card className="bg-yellow-900/30 border-yellow-500/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              <CardTitle className="text-yellow-200">
                {conflictStatus === "POTENTIAL_DUPLICATE"
                  ? "Potential Duplicate Booking Detected"
                  : "Name Match Warning"}
              </CardTitle>
            </div>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="text-yellow-300 hover:text-white hover:bg-yellow-800/50"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {nameSimilarity && (
            <p className="text-sm text-yellow-300 mt-2">
              Name similarity: {Math.round(nameSimilarity * 100)}%
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Existing Booking */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-blue-300">Existing Booking</h3>
                {existingBooking.bookingReference && (
                  <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded border border-blue-500/50 font-mono">
                    {existingBooking.bookingReference}
                  </span>
                )}
              </div>
              
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-400 uppercase font-semibold">Name</p>
                    <p className="text-white font-medium">{existingBooking.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-400 uppercase font-semibold">Email</p>
                    <p className="text-white">{existingBooking.email}</p>
                    {existingBooking.authorizedSenders && existingBooking.authorizedSenders.length > 0 && (
                      <div className="mt-1">
                        <p className="text-xs text-blue-300">Authorized senders:</p>
                        <ul className="text-xs text-gray-300 list-disc list-inside">
                          {existingBooking.authorizedSenders.map((email, idx) => (
                            <li key={idx}>{email}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-400 uppercase font-semibold">Event Date</p>
                    <p className="text-white">{formatDate(existingBooking.eventDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-400 uppercase font-semibold">Venue</p>
                    <p className="text-white">{existingBooking.venueName}</p>
                    {existingBooking.venuePostcode && (
                      <p className="text-gray-300 text-sm">{existingBooking.venuePostcode}</p>
                    )}
                  </div>
                </div>

                {existingBooking.phoneAreaCode && existingBooking.phoneNumber && (
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-blue-400 uppercase font-semibold">Phone</p>
                      <p className="text-white">
                        {formatPhone(existingBooking.phoneAreaCode, existingBooking.phoneNumber)}
                      </p>
                    </div>
                  </div>
                )}

                {existingBooking.eventType && (
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-blue-400 uppercase font-semibold">Event Type</p>
                      <p className="text-white capitalize">{existingBooking.eventType}</p>
                    </div>
                  </div>
                )}
              </div>

              <Link href={`/admin/bookings/${existingBooking.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-blue-500 text-blue-300 hover:bg-blue-900/30"
                >
                  View Full Booking Details
                </Button>
              </Link>
            </div>

            {/* New Booking */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-yellow-300">New Incoming Data</h3>
                {newBookingId && (
                  <span className="px-2 py-1 bg-yellow-900/50 text-yellow-300 text-xs rounded border border-yellow-500/50 font-mono">
                    New
                  </span>
                )}
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-yellow-400 uppercase font-semibold">Name</p>
                    <p className="text-white font-medium">{newBooking.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-yellow-400 uppercase font-semibold">Email</p>
                    <p className="text-white">{newBooking.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-yellow-400 uppercase font-semibold">Event Date</p>
                    <p className="text-white">{formatDate(newBooking.eventDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-yellow-400 uppercase font-semibold">Venue</p>
                    <p className="text-white">{newBooking.venueName}</p>
                    {newBooking.venuePostcode && (
                      <p className="text-gray-300 text-sm">{newBooking.venuePostcode}</p>
                    )}
                  </div>
                </div>

                {newBooking.phoneAreaCode && newBooking.phoneNumber && (
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-yellow-400 uppercase font-semibold">Phone</p>
                      <p className="text-white">
                        {formatPhone(newBooking.phoneAreaCode, newBooking.phoneNumber)}
                      </p>
                    </div>
                  </div>
                )}

                {newBooking.eventType && (
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-yellow-400 uppercase font-semibold">Event Type</p>
                      <p className="text-white capitalize">{newBooking.eventType}</p>
                    </div>
                  </div>
                )}
              </div>

              {newBookingId && (
                <Link href={`/admin/bookings/${newBookingId}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-yellow-500 text-yellow-300 hover:bg-yellow-900/30"
                  >
                    View New Booking Details
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-yellow-700/50 pt-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleLinkEmail}
                disabled={resolving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {resolving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Linking...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Link Email to Booking
                  </>
                )}
              </Button>

              <Button
                onClick={handleKeepSeparate}
                disabled={resolving}
                variant="outline"
                className="border-gray-500 text-gray-300 hover:bg-gray-800/50"
              >
                {resolving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Keep Separate
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-yellow-300 mt-4 text-center">
              <strong>Link Email:</strong> Adds the new email to authorized senders for the existing booking.
              <br />
              <strong>Keep Separate:</strong> Acknowledges this is a different event and keeps bookings separate.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
