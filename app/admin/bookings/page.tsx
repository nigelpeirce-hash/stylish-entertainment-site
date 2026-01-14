"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Calendar,
  Search,
  Filter,
  Download,
  Mail,
  User,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  name: string;
  email: string;
  eventType: string;
  eventDate: string;
  venueName: string;
  status: string;
  numberOfGuests: number | null;
  services: string[];
  user: { id: string; name: string; email: string } | null;
}

export default function AdminBookings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchBookings();
    }
  }, [status, session, filter, search]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("status", filter);
      if (search) params.append("search", search);

      const response = await fetch(`/api/admin/bookings?${params.toString()}`);
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

  const handleExportCalendar = async () => {
    try {
      const response = await fetch("/api/admin/calendar/export");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bookings-${new Date().toISOString().split("T")[0]}.ics`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error exporting calendar:", error);
      alert("Failed to export calendar");
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

  if (!session || (session?.user as any)?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Bookings Management</h1>
              <p className="text-gray-400">View and manage all bookings</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleExportCalendar}
                variant="outline"
                className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export to iCal
              </Button>
              <Link href="/admin">
                <Button variant="outline" className="border-champagne-gold text-champagne-gold">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setTimeout(() => fetchBookings(), 500);
                  }}
                  placeholder="Search bookings..."
                  className="bg-gray-800 text-white border-gray-700 pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setFilter("all")}
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
              >
                All
              </Button>
              <Button
                onClick={() => setFilter("pending")}
                variant={filter === "pending" ? "default" : "outline"}
                size="sm"
              >
                Pending
              </Button>
              <Button
                onClick={() => setFilter("confirmed")}
                variant={filter === "confirmed" ? "default" : "outline"}
                size="sm"
              >
                Confirmed
              </Button>
              <Button
                onClick={() => setFilter("completed")}
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
              >
                Completed
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.length === 0 ? (
            <Card className="bg-gray-800 border-champagne-gold/30 md:col-span-2 lg:col-span-3">
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-lg">No bookings found</p>
              </CardContent>
            </Card>
          ) : (
            bookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60 transition-all h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{booking.eventType}</CardTitle>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{booking.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(booking.eventDate).toLocaleDateString("en-GB", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{booking.venueName}</span>
                    </div>
                    {booking.numberOfGuests && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <User className="w-4 h-4" />
                        <span className="text-sm">{booking.numberOfGuests} guests</span>
                      </div>
                    )}
                    {booking.services.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {booking.services.map((service, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-champagne-gold/20 text-champagne-gold text-xs rounded border border-champagne-gold/30"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 pt-2 border-t border-gray-700">
                      <Link href={`/admin/bookings/${booking.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
                        >
                          View Details
                        </Button>
                      </Link>
                      <Button
                        onClick={() => {
                          window.location.href = `/api/admin/calendar/export?bookingId=${booking.id}`;
                        }}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300"
                        title="Export to iCal"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
