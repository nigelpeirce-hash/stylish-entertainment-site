"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Calendar, CheckCircle } from "lucide-react";
import Link from "next/link";

interface SuspiciousBooking {
  id: string;
  name: string;
  email: string;
  eventType: string;
  eventDateRaw: string;
  eventDateFormatted: string;
  venueName: string;
  status: string;
  flags: {
    isBefore2000: boolean;
    isOldPast: boolean;
  };
}

export default function FixDatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [suspiciousBookings, setSuspiciousBookings] = useState<SuspiciousBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchSuspiciousBookings();
    }
  }, [status, session]);

  const fetchSuspiciousBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings/check-dates");
      if (response.ok) {
        const data = await response.json();
        setSuspiciousBookings(data.suspiciousBookings || []);
      }
    } catch (error) {
      console.error("Error fetching suspicious bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDate = async (bookingId: string) => {
    const dateValue = newDate[bookingId];
    if (!dateValue) {
      alert("Please enter a date");
      return;
    }

    setUpdating(bookingId);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventDate: dateValue }),
      });

      if (response.ok) {
        // Refresh the list
        await fetchSuspiciousBookings();
        // Clear the input
        setNewDate((prev) => {
          const updated = { ...prev };
          delete updated[bookingId];
          return updated;
        });
        alert("Date updated successfully!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update date");
      }
    } catch (error) {
      console.error("Error updating date:", error);
      alert("Failed to update date");
    } finally {
      setUpdating(null);
    }
  };

  if ((status !== "authenticated" && status !== "unauthenticated") || loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/admin/bookings">
            <Button variant="outline" className="mb-4">
              ← Back to Bookings
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Fix Booking Dates</h1>
          <p className="text-gray-400">
            Review and fix bookings with suspicious dates (before 2000 or very old past dates)
          </p>
        </div>

        {suspiciousBookings.length === 0 ? (
          <Card className="bg-gray-800 border-green-500/50">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <p className="text-lg text-gray-300">No suspicious dates found!</p>
              <p className="text-sm text-gray-400 mt-2">All booking dates appear to be correct.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="bg-yellow-900/20 border-yellow-500/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">
                    Found {suspiciousBookings.length} booking(s) with suspicious dates
                  </span>
                </div>
              </CardContent>
            </Card>

            {suspiciousBookings.map((booking) => (
              <Card key={booking.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-champagne-gold" />
                    {booking.name} - {booking.eventType}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Email:</span>{" "}
                      <span className="text-white">{booking.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Venue:</span>{" "}
                      <span className="text-white">{booking.venueName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>{" "}
                      <span className="text-white capitalize">{booking.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Current Date:</span>{" "}
                      <span className="text-red-400 font-semibold">
                        {booking.eventDateFormatted}
                      </span>
                    </div>
                  </div>

                  {booking.flags.isBefore2000 && (
                    <div className="p-3 bg-red-900/20 border border-red-500/30 rounded">
                      <p className="text-red-400 text-sm">
                        ⚠️ This date is before 2000 - likely incorrect
                      </p>
                    </div>
                  )}

                  {booking.flags.isOldPast && (
                    <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                      <p className="text-yellow-400 text-sm">
                        ⚠️ This date is more than 5 years in the past
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4 items-end pt-2 border-t border-gray-700">
                    <div className="flex-1">
                      <Label htmlFor={`date-${booking.id}`} className="text-gray-300 mb-2 block">
                        New Event Date
                      </Label>
                      <Input
                        id={`date-${booking.id}`}
                        type="date"
                        value={newDate[booking.id] || ""}
                        onChange={(e) =>
                          setNewDate((prev) => ({
                            ...prev,
                            [booking.id]: e.target.value,
                          }))
                        }
                        className="bg-gray-900 text-white border-gray-600"
                      />
                    </div>
                    <Button
                      onClick={() => handleUpdateDate(booking.id)}
                      disabled={updating === booking.id || !newDate[booking.id]}
                      className="bg-champagne-gold text-black hover:bg-gold-light"
                    >
                      {updating === booking.id ? "Updating..." : "Update Date"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
