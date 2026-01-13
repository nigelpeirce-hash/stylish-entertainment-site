"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MessageSquare, User, LogOut, Plus } from "lucide-react";
import WeddingPlanningChecklist from "@/components/WeddingPlanningChecklist";
import CountdownClock from "@/components/CountdownClock";

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchBookings();
    }
  }, [session]);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/client/bookings");
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

  const handleTaskToggle = (bookingId: string) => {
    return async (taskId: string, completed: boolean) => {
      try {
        const response = await fetch(`/api/client/bookings/${bookingId}/tasks`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId, completed }),
        });
        
        if (response.ok) {
          // Refresh bookings to get updated task status
          fetchBookings();
        }
      } catch (error) {
        console.error("Error updating task:", error);
      }
    };
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome, {session.user?.name || "Client"}
              </h1>
              <p className="text-gray-400">{session.user?.email}</p>
            </div>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="outline"
              className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Link href="/client/bookings/new">
            <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-champagne-gold/20 rounded-lg">
                  <Plus className="w-6 h-6 text-champagne-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">New Booking</h3>
                  <p className="text-sm text-gray-400">Submit a new inquiry</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/profile">
            <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all cursor-pointer h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-champagne-gold/20 rounded-lg">
                  <User className="w-6 h-6 text-champagne-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Profile</h3>
                  <p className="text-sm text-gray-400">View your profile & event dates</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-gray-800 border-champagne-gold/30 h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-champagne-gold/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-champagne-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Messages</h3>
                <p className="text-sm text-gray-400">View conversations</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bookings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-champagne-gold" />
                Your Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No bookings yet</p>
                  <Link href="/client/bookings/new">
                    <Button className="bg-champagne-gold text-black hover:bg-gold-light">
                      Create Your First Booking
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="space-y-4">
                      <Card className="bg-gray-900 border-gray-700">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold text-white mb-2">
                                {booking.eventType}
                              </h3>
                              <p className="text-gray-400 mb-1">
                                <strong>Date:</strong>{" "}
                                {new Date(booking.eventDate).toLocaleDateString()}
                              </p>
                              <p className="text-gray-400 mb-1">
                                <strong>Venue:</strong> {booking.venueName}
                              </p>
                              <p className="text-gray-400">
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
                          </div>
                        </CardContent>
                      </Card>

                      {/* Countdown Clock */}
                      {booking.eventType === "Wedding" && (
                        <Card className="bg-gray-800 border-champagne-gold/30">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-champagne-gold" />
                              Countdown to Your Wedding
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CountdownClock targetDate={new Date(booking.eventDate)} />
                          </CardContent>
                        </Card>
                      )}

                      {/* Wedding Planning Checklist */}
                      {booking.eventType === "Wedding" && (
                        <WeddingPlanningChecklist
                          eventDate={new Date(booking.eventDate)}
                          eventType={booking.eventType}
                          completedTasks={booking.completedTasks || []}
                          onTaskToggle={(taskId, completed) =>
                            handleTaskToggle(booking.id, taskId, completed)
                          }
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
