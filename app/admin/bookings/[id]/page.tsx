"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Music,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  name: string;
  email: string;
  phoneAreaCode: string | null;
  phoneNumber: string | null;
  eventType: string;
  eventDate: string;
  venueName: string;
  venueAddress: string | null;
  venueTown: string | null;
  venuePostcode: string | null;
  numberOfGuests: number | null;
  services: string[];
  upsellItems: string[];
  preferredDJ: string | null;
  message: string | null;
  budget: string | null;
  status: string;
  contactPreference: string | null;
  user: { id: string; name: string; email: string } | null;
  emailThreads: Array<{
    id: string;
    subject: string;
    fromEmail: string;
    lastMessageAt: string;
    isRead: boolean;
  }>;
}

export default function BookingDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin" && bookingId) {
      fetchBooking();
    }
  }, [status, session, bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-400 bg-green-900/30 border-green-500/30";
      case "pending":
        return "text-yellow-400 bg-yellow-900/30 border-yellow-500/30";
      case "completed":
        return "text-blue-400 bg-blue-900/30 border-blue-500/30";
      case "cancelled":
        return "text-red-400 bg-red-900/30 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-900/30 border-gray-500/30";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session || (session?.user as any)?.role !== "admin" || !booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6">
          <Link href="/admin/bookings">
            <Button variant="outline" className="border-champagne-gold text-champagne-gold mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Bookings
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{booking.eventType}</CardTitle>
                  <p className="text-gray-400">
                    Booking ID: {booking.id}
                  </p>
                </div>
                <div className="flex gap-3">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium border ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                  <Button
                    onClick={() => {
                      window.location.href = `/api/admin/calendar/export?bookingId=${booking.id}`;
                    }}
                    variant="outline"
                    size="sm"
                    className="border-champagne-gold text-champagne-gold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export iCal
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Information */}
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-champagne-gold" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="w-4 h-4" />
                  <span>{booking.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${booking.email}`} className="text-champagne-gold hover:text-gold-light">
                    {booking.email}
                  </a>
                </div>
                {(booking.phoneAreaCode || booking.phoneNumber) && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4" />
                    <span>
                      {booking.phoneAreaCode} {booking.phoneNumber}
                    </span>
                  </div>
                )}
                {booking.contactPreference && (
                  <div className="text-sm text-gray-400">
                    Preferred contact: {booking.contactPreference}
                  </div>
                )}
                {booking.user && (
                  <div className="pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">Linked Account</p>
                    <p className="text-sm text-gray-300">{booking.user.name} ({booking.user.email})</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-champagne-gold" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(booking.eventDate).toLocaleDateString("en-GB", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {booking.numberOfGuests && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="w-4 h-4" />
                    <span>{booking.numberOfGuests} guests</span>
                  </div>
                )}
                {booking.budget && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <DollarSign className="w-4 h-4" />
                    <span>{booking.budget}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Venue Information */}
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-champagne-gold" />
                Venue Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-lg font-semibold text-white">{booking.venueName}</p>
              {booking.venueAddress && (
                <p className="text-gray-300">{booking.venueAddress}</p>
              )}
              {booking.venueTown && (
                <p className="text-gray-300">{booking.venueTown}</p>
              )}
              {booking.venuePostcode && (
                <p className="text-gray-300">{booking.venuePostcode}</p>
              )}
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-champagne-gold" />
                Services & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Main Services</h4>
                <div className="flex flex-wrap gap-2">
                  {booking.services.map((service, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-champagne-gold/20 text-champagne-gold text-sm rounded border border-champagne-gold/30"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {booking.services.includes("DJs") && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Preferred DJ</h4>
                  <p className="text-white">
                    {booking.preferredDJ || "Any DJ"}
                  </p>
                </div>
              )}

              {booking.upsellItems && booking.upsellItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Upsell Items ({booking.upsellItems.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {booking.upsellItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-900/30 text-blue-400 text-sm rounded border border-blue-500/30"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Message */}
          {booking.message && (
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-champagne-gold" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 whitespace-pre-wrap">{booking.message}</p>
              </CardContent>
            </Card>
          )}

          {/* Email Threads */}
          {booking.emailThreads && booking.emailThreads.length > 0 && (
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-champagne-gold" />
                  Recent Email Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {booking.emailThreads.map((thread) => (
                    <Link
                      key={thread.id}
                      href={`/admin/inbox/${thread.id}`}
                      className="block p-3 rounded bg-gray-900/50 hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{thread.subject}</p>
                          <p className="text-sm text-gray-400">{thread.fromEmail}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(thread.lastMessageAt).toLocaleDateString()}
                          </p>
                          {!thread.isRead && (
                            <span className="inline-block w-2 h-2 bg-champagne-gold rounded-full mt-1"></span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href={`/admin/inbox?bookingId=${booking.id}`}>
                  <Button variant="outline" className="mt-4 border-champagne-gold text-champagne-gold">
                    View All Emails
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
