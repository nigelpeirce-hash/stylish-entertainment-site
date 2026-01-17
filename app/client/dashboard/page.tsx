"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MessageSquare, User, Plus } from "lucide-react";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { SingleEventHero } from "./SingleEventHero";
import WeddingPlanningChecklist from "@/components/WeddingPlanningChecklist";
import CountdownClock from "@/components/CountdownClock";
import MusicPlaylistManager from "@/components/MusicPlaylistManager";
import EventTimeline from "@/components/EventTimeline";
import GuestCountTracker from "@/components/GuestCountTracker";
import BudgetTracker from "@/components/BudgetTracker";

// Wedding Planning Tips
const WEDDING_TIPS = [
  "Don't forget to break in your wedding shoes!",
  "Have a backup plan for outdoor photos.",
  "Assign someone to coordinate vendor arrivals.",
  "Pack an emergency kit with safety pins and stain remover.",
  "Schedule time to eat during your reception.",
  "Test your makeup in natural lighting before the big day.",
];

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [randomTip] = useState(() => WEDDING_TIPS[Math.floor(Math.random() * WEDDING_TIPS.length)]);

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

  const createTestBooking = async () => {
    setIsCreatingTest(true);
    try {
      const response = await fetch("/api/test/create-test-booking", {
        method: "POST",
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh bookings to show the new test booking
        await fetchBookings();
        alert("Test booking created successfully! Scroll down to see it.");
      } else {
        alert(result.error || "Failed to create test booking");
      }
    } catch (error) {
      console.error("Error creating test booking:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsCreatingTest(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div
        className="min-h-screen py-12 px-4"
        style={{
          background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
        }}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="space-y-8">
            <Skeleton className="h-16 w-64" />
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div
      className="min-h-screen text-white py-12 px-4"
      style={{
        background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
      }}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                Welcome back, {session.user?.name || "Client"}
              </h1>
              <p className="text-gray-200">{session.user?.email}</p>
              <p className="text-sm text-champagne-gold mt-2 italic">💡 {randomTip}</p>
            </div>
            <ProfileDropdown userName={session.user?.name} userEmail={session.user?.email} />
          </div>
        </motion.div>

        {/* Quick Actions - Mobile: 3-column icon row, Desktop: Full cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-6 mb-8"
        >
          <Link href="/client/bookings/new" className="block">
            <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50 hover:border-champagne-gold/80 transition-all cursor-pointer h-full">
              <CardContent className="p-3 md:p-6 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-3 md:gap-4 text-center md:text-left">
                <div className="p-2 md:p-3 bg-champagne-gold/20 rounded-lg">
                  <Plus className="w-5 h-5 md:w-6 md:h-6 text-champagne-gold" />
                </div>
                <div className="hidden md:block">
                  <h3 className="text-lg font-semibold text-white">New Booking</h3>
                  <p className="text-sm text-gray-200">Submit a new inquiry</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/profile" className="block">
            <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50 hover:border-champagne-gold/80 transition-all cursor-pointer h-full">
              <CardContent className="p-3 md:p-6 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-3 md:gap-4 text-center md:text-left">
                <div className="p-2 md:p-3 bg-champagne-gold/20 rounded-lg">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-champagne-gold" />
                </div>
                <div className="hidden md:block">
                  <h3 className="text-lg font-semibold text-white">Profile</h3>
                  <p className="text-sm text-gray-200">View your profile & event dates</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/client/messages" className="block">
            <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50 hover:border-champagne-gold/80 transition-all cursor-pointer h-full">
              <CardContent className="p-3 md:p-6 flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-3 md:gap-4 text-center md:text-left">
                <div className="p-2 md:p-3 bg-champagne-gold/20 rounded-lg">
                  <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-champagne-gold" />
                </div>
                <div className="hidden md:block">
                  <h3 className="text-lg font-semibold text-white">Messages</h3>
                  <p className="text-sm text-gray-200">View conversations</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Bookings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50">
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
                  <div className="flex gap-3 justify-center">
                    <Link href="/client/bookings/new">
                      <Button className="bg-champagne-gold text-black hover:bg-gold-light">
                        Create Your First Booking
                      </Button>
                    </Link>
                    <Button
                      onClick={createTestBooking}
                      disabled={isCreatingTest}
                      variant="outline"
                      className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
                    >
                      {isCreatingTest ? "Creating..." : "Create Test Booking"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Use "Create Test Booking" to quickly test dashboard features
                  </p>
                </div>
              ) : bookings.length === 1 ? (
                // Single Event Hero View
                <SingleEventHero
                  booking={bookings[0]}
                  onTaskToggle={handleTaskToggle(bookings[0].id)}
                />
              ) : (
                // Multiple Bookings List View
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="space-y-4">
                      <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold text-white mb-2">
                                {booking.eventType}
                              </h3>
                              <p className="text-gray-200 mb-1">
                                <strong>Date:</strong>{" "}
                                {new Date(booking.eventDate).toLocaleDateString()}
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
                          </div>
                        </CardContent>
                      </Card>

                      {/* Countdown Clock - Hidden for admins */}
                      {session?.user && (session.user as any)?.role !== "admin" && (
                        <Card className="bg-gray-800/50 backdrop-blur-md border-2 border-champagne-gold/50 animate-pulse">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                              <Calendar className="w-5 h-5 text-champagne-gold" />
                              Countdown to Your {booking.eventType === "Wedding" ? "Wedding" : booking.eventType}
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
                          onTaskToggle={handleTaskToggle(booking.id)}
                        />
                      )}

                      {/* Music Playlist Manager */}
                      <MusicPlaylistManager
                        bookingId={booking.id}
                        initialData={{
                          musicRequests: booking.musicRequests,
                          musicDislikes: booking.musicDislikes,
                          firstDance: booking.firstDance,
                          lastSong: booking.lastSong,
                          musicNotesToDJ: booking.musicNotesToDJ,
                        }}
                      />

                      {/* Event Timeline */}
                      <div className="min-w-0 overflow-x-auto">
                        <EventTimeline
                          bookingId={booking.id}
                          eventDate={new Date(booking.eventDate)}
                        />
                      </div>

                      {/* Guest Count Tracker */}
                      <GuestCountTracker
                        bookingId={booking.id}
                        initialCount={booking.numberOfGuests || 0}
                      />

                      {/* Budget Tracker */}
                      <div className="min-w-0 overflow-x-auto">
                        <BudgetTracker
                          bookingId={booking.id}
                          totalBudget={booking.budget}
                        />
                      </div>
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