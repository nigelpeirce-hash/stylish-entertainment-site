"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Calendar, Clock, AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface StatusToggles {
  depositVerified: boolean;
  djWorksheetDispatched: boolean;
  finalPaymentReceived: boolean;
  siteVisitDone: boolean;
}

interface Booking {
  id: string;
  name: string;
  venueName: string;
  eventDate: string;
  eventType: string;
  status: string;
  daysRemaining: number;
  statusToggles: StatusToggles;
}

export default function NinetyDayCommandCentre() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "within30" | "needsAttention">("all");

  useEffect(() => {
    // Check for dev bypass first (development only)
    const devBypass = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
      sessionStorage.getItem("dev_admin_bypass") === "true";

    if (devBypass) {
      // Dev bypass active, allow access
      fetchBookings();
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
    } else if (
      status === "authenticated" &&
      (session?.user as any)?.role !== "admin"
    ) {
      router.push("/client/dashboard");
    } else if (status === "authenticated") {
      fetchBookings();
    }
  }, [status, session, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/bookings/90-day-command");
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUpdate = async (
    bookingId: string,
    toggleName: keyof StatusToggles,
    currentValue: boolean
  ) => {
    setUpdating(bookingId);
    try {
      const updatedToggles = {
        ...bookings.find((b) => b.id === bookingId)?.statusToggles,
        [toggleName]: !currentValue,
      };

      const response = await fetch("/api/admin/bookings/90-day-command", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          statusToggles: updatedToggles,
        }),
      });

      if (response.ok) {
        // Update local state
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingId
              ? { ...booking, statusToggles: updatedToggles as StatusToggles }
              : booking
          )
        );
      }
    } catch (error) {
      console.error("Error updating toggle:", error);
    } finally {
      setUpdating(null);
    }
  };

  const formatDaysRemaining = (days: number): string => {
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 0) return `${Math.abs(days)} Days Ago`;
    return `${days} Days to Go`;
  };

  const calculateProgress = (daysRemaining: number): number => {
    // Progress from 0% (90 days away) to 100% (event day)
    const progress = Math.max(0, Math.min(100, ((90 - daysRemaining) / 90) * 100));
    return progress;
  };

  const shouldHighlightAlert = (booking: Booking): boolean => {
    return booking.daysRemaining <= 30 && !booking.statusToggles.finalPaymentReceived;
  };

  // Filter bookings based on selected filter
  const filteredBookings = bookings.filter((booking) => {
    if (filter === "within30") {
      return booking.daysRemaining <= 30;
    }
    if (filter === "needsAttention") {
      return shouldHighlightAlert(booking);
    }
    return true; // "all"
  });

  // Get attention reasons for a booking
  const getAttentionReasons = (booking: Booking): string[] => {
    const reasons: string[] = [];
    if (booking.daysRemaining <= 30 && !booking.statusToggles.finalPaymentReceived) {
      reasons.push("Final payment not received");
    }
    if (booking.daysRemaining <= 14 && !booking.statusToggles.djWorksheetDispatched) {
      reasons.push("DJ Worksheet not dispatched");
    }
    if (booking.daysRemaining <= 7 && !booking.statusToggles.siteVisitDone) {
      reasons.push("Site visit/call not completed");
    }
    return reasons;
  };

  // Check for dev bypass (development only)
  const devBypass = typeof window !== "undefined" && 
    (process.env.NODE_ENV === "development" || window.location.hostname === "localhost") &&
    sessionStorage.getItem("dev_admin_bypass") === "true";

  const isAdmin = session && (session?.user as any)?.role === "admin";

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAdmin && !devBypass) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
                <Calendar className="w-8 h-8 text-champagne-gold" />
                90-Day Command Centre
              </h1>
              <p className="text-gray-400">
                Upcoming events within the next 90 days
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={fetchBookings}
                variant="outline"
                className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card 
              className={`bg-gray-900 border-champagne-gold/30 cursor-pointer transition-all hover:border-champagne-gold/60 ${
                filter === "all" ? "border-champagne-gold/60 ring-2 ring-champagne-gold/30" : ""
              }`}
              onClick={() => setFilter("all")}
            >
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 mb-1">Total Events</p>
                <p className="text-2xl font-bold text-white">{bookings.length}</p>
              </CardContent>
            </Card>
            <Card 
              className={`bg-gray-900 border-yellow-400/30 cursor-pointer transition-all hover:border-yellow-400/60 ${
                filter === "within30" ? "border-yellow-400/60 ring-2 ring-yellow-400/30" : ""
              }`}
              onClick={() => setFilter("within30")}
            >
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 mb-1">Within 30 Days</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {bookings.filter((b) => b.daysRemaining <= 30).length}
                </p>
                {filter === "within30" && (
                  <p className="text-xs text-yellow-400/70 mt-1">Showing filtered view</p>
                )}
              </CardContent>
            </Card>
            <Card 
              className={`bg-gray-900 border-red-400/30 cursor-pointer transition-all hover:border-red-400/60 ${
                filter === "needsAttention" ? "border-red-400/60 ring-2 ring-red-400/30" : ""
              }`}
              onClick={() => setFilter("needsAttention")}
            >
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 mb-1">Needs Attention</p>
                <p className="text-2xl font-bold text-red-400">
                  {bookings.filter(shouldHighlightAlert).length}
                </p>
                {filter === "needsAttention" && (
                  <p className="text-xs text-red-400/70 mt-1">Final payment pending</p>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Filter Active Notice */}
        {filter !== "all" && (
          <div className="mb-4 p-3 bg-champagne-gold/10 border border-champagne-gold/30 rounded-lg">
            <p className="text-sm text-champagne-gold">
              <strong>Filter Active:</strong> Showing {filter === "within30" ? "events within 30 days" : "events needing attention"} ({filteredBookings.length} of {bookings.length})
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilter("all")}
                className="ml-2 text-champagne-gold hover:text-white underline"
              >
                Clear filter
              </Button>
            </p>
          </div>
        )}

        {/* Flight Board Style List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {filteredBookings.length === 0 ? (
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  No events scheduled within the next 90 days
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking, index) => {
              const progress = calculateProgress(booking.daysRemaining);
              const isAlert = shouldHighlightAlert(booking);

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`bg-gray-900 border transition-all ${
                      isAlert
                        ? "border-red-500/50 shadow-lg shadow-red-500/20"
                        : "border-gray-700 hover:border-champagne-gold/50"
                    }`}
                  >
                    <CardContent className="p-6">
                      {/* Header Row */}
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-champagne-gold" />
                              <span className="font-bold text-champagne-gold text-lg">
                                {formatDaysRemaining(booking.daysRemaining)}
                              </span>
                            </div>
                            {isAlert && (
                              <div className="flex flex-col gap-1">
                                {getAttentionReasons(booking).map((reason, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-red-400 text-sm">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                    <span>{reason}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {booking.name} @ {booking.venueName}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {new Date(booking.eventDate).toLocaleDateString("en-GB", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Link href={`/admin/bookings/${booking.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-champagne-gold to-yellow-600"
                          />
                        </div>
                      </div>

                      {/* Status Toggles */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
                        {/* Deposit Verified - Blue */}
                        <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                          <Checkbox
                            checked={booking.statusToggles.depositVerified}
                            onCheckedChange={() =>
                              handleToggleUpdate(
                                booking.id,
                                "depositVerified",
                                booking.statusToggles.depositVerified
                              )
                            }
                            disabled={updating === booking.id}
                            className="border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                          />
                          <span className="text-sm text-gray-300">
                            Deposit Verified
                          </span>
                        </label>

                        {/* DJ Brief Dispatched - Purple */}
                        <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                          <Checkbox
                            checked={booking.statusToggles.djWorksheetDispatched}
                            onCheckedChange={() =>
                              handleToggleUpdate(
                                booking.id,
                                "djWorksheetDispatched",
                                booking.statusToggles.djWorksheetDispatched
                              )
                            }
                            disabled={updating === booking.id}
                            className="border-purple-400 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                          />
                          <span className="text-sm text-gray-300">
                            DJ Worksheet Dispatched
                          </span>
                        </label>

                        {/* Final Payment Received - Green */}
                        <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                          <Checkbox
                            checked={booking.statusToggles.finalPaymentReceived}
                            onCheckedChange={() =>
                              handleToggleUpdate(
                                booking.id,
                                "finalPaymentReceived",
                                booking.statusToggles.finalPaymentReceived
                              )
                            }
                            disabled={updating === booking.id}
                            className="border-green-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                          />
                          <span className="text-sm text-gray-300">
                            Final Payment Received
                          </span>
                        </label>

                        {/* Site Visit/Call Done - Orange */}
                        <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                          <Checkbox
                            checked={booking.statusToggles.siteVisitDone}
                            onCheckedChange={() =>
                              handleToggleUpdate(
                                booking.id,
                                "siteVisitDone",
                                booking.statusToggles.siteVisitDone
                              )
                            }
                            disabled={updating === booking.id}
                            className="border-orange-400 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                          />
                          <span className="text-sm text-gray-300">
                            Site Visit/Call Done
                          </span>
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
