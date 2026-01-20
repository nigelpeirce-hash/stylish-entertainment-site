"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Users,
  Music,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
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
  venuePostcode: string | null;
  venueTown: string | null;
  status: string;
  priority: string;
  assignedTo: string | null;
  handoffStatus: string | null;
  handoffNote: string | null;
  isTechReady: boolean | null;
  venueFingerprint: string | null;
  conflictStatus: string | null;
  numberOfGuests: number | null;
  services: string[];
  finalBalance: string | null;
  assignedDJName: string | null;
  staffAssignments?: Array<{
    id: string;
    role: string;
    status: string;
    staff: {
      name: string;
      email: string | null;
    };
  }>;
}

function ViceVersaContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"her-desk" | "his-ops">("her-desk");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [handoffNote, setHandoffNote] = useState("");
  const [showHandoffNote, setShowHandoffNote] = useState(false);
  const [handoffTo, setHandoffTo] = useState<"ali" | "husband" | null>(null);

  // Check for conflicts (bookings with same venueFingerprint)
  const checkConflicts = (booking: Booking) => {
    if (!booking.venueFingerprint) return false;
    return bookings.some(
      (b) =>
        b.id !== booking.id &&
        b.venueFingerprint === booking.venueFingerprint &&
        b.eventDate === booking.eventDate
    );
  };

  useEffect(() => {
    const isLocalhost = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" || 
       window.location.hostname === "127.0.0.1" ||
       window.location.hostname.startsWith("192.168.") ||
       window.location.hostname.startsWith("10."));

    if (isLocalhost) {
      sessionStorage.setItem("dev_admin_bypass", "true");
      sessionStorage.setItem("dev_admin_role", "admin");
      sessionStorage.setItem("dev_admin_name", "Local Admin");
      fetchBookings();
      return;
    }

    const devBypass = typeof window !== "undefined" && 
      sessionStorage.getItem("dev_admin_bypass") === "true";

    if (devBypass) {
      fetchBookings();
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    const isLocalhostCheck = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" || 
       window.location.hostname === "127.0.0.1" ||
       window.location.hostname.startsWith("192.168.") ||
       window.location.hostname.startsWith("10."));
    const devBypassCheck = isLocalhostCheck || 
      (typeof window !== "undefined" && sessionStorage.getItem("dev_admin_bypass") === "true");
    const isAdminCheck = session && (session?.user as any)?.role === "admin";

    if ((isAdminCheck || devBypassCheck) && status !== "loading") {
      fetchBookings();
    }
  }, [status, session, activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/bookings");
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

  const handleHandoff = async (bookingId: string, to: "ali" | "husband", note?: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/handoff`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assign",
          assignedTo: to,
          handoffNote: note || null,
        }),
      });

      if (response.ok) {
        await fetchBookings();
        setSelectedBooking(null);
        setHandoffNote("");
        setShowHandoffNote(false);
        setHandoffTo(null);
        alert(`Booking passed to ${to === "ali" ? "Ali" : "Husband"}!`);
      }
    } catch (error) {
      console.error("Error handling handoff:", error);
      alert("Failed to hand off booking");
    }
  };

  const handleMarkTechReady = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTechReady: true }),
      });

      if (response.ok) {
        await fetchBookings();
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, isTechReady: true });
        }
        alert("Tech marked as ready! Ali has been notified.");
      }
    } catch (error) {
      console.error("Error marking tech ready:", error);
      alert("Failed to mark tech as ready");
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isLocalhost = typeof window !== "undefined" && 
    (process.env.NODE_ENV === "development" || 
     window.location.hostname === "localhost" || 
     window.location.hostname === "127.0.0.1" ||
     window.location.hostname.startsWith("192.168.") ||
     window.location.hostname.startsWith("10."));
  const devBypass = isLocalhost || 
    (typeof window !== "undefined" && sessionStorage.getItem("dev_admin_bypass") === "true");
  const isAdmin = session && (session?.user as any)?.role === "admin";

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin && !devBypass) {
    return null;
  }

  // Filter bookings by tab
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "her-desk") {
      return booking.assignedTo === "ali" || booking.assignedTo === "wife";
    } else {
      return booking.assignedTo === "husband";
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold font-serif">Vice Versa Dashboard</h1>
            <Link href="/admin">
              <Button variant="outline" size="lg" className="border-champagne-gold text-champagne-gold text-lg">
                Main Dashboard
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("her-desk")}
              className={`px-8 py-4 text-2xl font-semibold rounded-lg transition-all ${
                activeTab === "her-desk"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-750"
              }`}
            >
              📋 Her Desk
            </button>
            <button
              onClick={() => setActiveTab("his-ops")}
              className={`px-8 py-4 text-2xl font-semibold rounded-lg transition-all ${
                activeTab === "his-ops"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-750"
              }`}
            >
              🛠️ His Ops
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredBookings.length === 0 ? (
              <Card className="bg-gray-800 border-champagne-gold/30 p-12 text-center">
                <p className="text-2xl text-gray-400">
                  No bookings assigned to {activeTab === "her-desk" ? "Her Desk" : "His Ops"}
                </p>
              </Card>
            ) : (
              filteredBookings.map((booking) => {
                const hasConflict = checkConflicts(booking);
                
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {/* Conflict Alert */}
                    {hasConflict && (
                      <Card className="bg-red-900/50 border-red-500 border-4 mb-4">
                        <CardContent className="p-6 text-center">
                          <div className="text-5xl mb-4">⚠️</div>
                          <h2 className="text-3xl font-bold text-red-400 mb-2">
                            DUPLICATE DETECTED
                          </h2>
                          <p className="text-xl text-red-300">
                            This date and venue are already in the system!
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Booking Card */}
                    <Card
                      className={`cursor-pointer transition-all ${
                        selectedBooking?.id === booking.id
                          ? "bg-gray-800 border-champagne-gold border-2"
                          : "bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/60"
                      }`}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <CardContent className="p-6">
                        {/* Her Desk View */}
                        {activeTab === "her-desk" && (
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-3xl font-bold text-white mb-2">
                                  {booking.name}
                                </h3>
                                <div className="flex items-center gap-4 text-xl text-gray-300">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-6 h-6 text-champagne-gold" />
                                    <span>{formatShortDate(booking.eventDate)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-6 h-6 text-champagne-gold" />
                                    <span>{booking.venueName}</span>
                                    {booking.venuePostcode && (
                                      <span className="text-gray-500">({booking.venuePostcode})</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {!booking.isTechReady && (
                                <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 text-center">
                                  <div className="text-3xl mb-2">🛠️</div>
                                  <p className="text-amber-300 font-semibold text-lg">
                                    Husband is still reviewing<br />technical details...
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Quote/Contract Buttons (only if tech ready) */}
                            {booking.isTechReady ? (
                              <div className="flex gap-3 pt-4 border-t border-gray-700">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `/admin/email-templates?bookingId=${booking.id}&category=quote`;
                                  }}
                                  className="flex-1 h-14 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold"
                                >
                                  <Mail className="w-6 h-6 mr-2" />
                                  Send Quote
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `/admin/email-templates?bookingId=${booking.id}&category=contract`;
                                  }}
                                  className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold"
                                >
                                  <FileText className="w-6 h-6 mr-2" />
                                  Send Contract
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        )}

                        {/* His Ops View */}
                        {activeTab === "his-ops" && (
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                  {booking.name}
                                </h3>
                                <p className="text-lg text-gray-300 mb-3">
                                  {formatEventDate(booking.eventDate)}
                                </p>
                                <div className="space-y-2 text-gray-400">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    <span className="text-lg">{booking.venueName}</span>
                                  </div>
                                  {booking.services.length > 0 && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Music className="w-5 h-5" />
                                      {booking.services.map((service, idx) => (
                                        <span
                                          key={idx}
                                          className="px-3 py-1 bg-champagne-gold/20 text-champagne-gold text-sm rounded border border-champagne-gold/30"
                                        >
                                          {service}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Staff Assignments */}
                            {booking.staffAssignments && booking.staffAssignments.length > 0 && (
                              <div className="pt-4 border-t border-gray-700">
                                <h4 className="text-lg font-semibold text-white mb-3">Staff Assignments</h4>
                                <div className="space-y-2">
                                  {booking.staffAssignments.map((assignment) => (
                                    <div
                                      key={assignment.id}
                                      className="p-3 bg-gray-900/50 rounded border border-gray-700"
                                    >
                                      <p className="text-white font-medium">{assignment.staff.name}</p>
                                      <p className="text-gray-400 text-sm">Role: {assignment.role}</p>
                                      <p className="text-gray-400 text-sm">Status: {assignment.status}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Tech Note */}
                            {booking.handoffNote && (
                              <div className="pt-4 border-t border-gray-700">
                                <h4 className="text-lg font-semibold text-white mb-2">Technical Note</h4>
                                <p className="text-gray-300 bg-amber-900/20 border border-amber-500/30 rounded p-3">
                                  {booking.handoffNote}
                                </p>
                              </div>
                            )}

                            {/* Mark Tech as Ready Button */}
                            {!booking.isTechReady && (
                              <div className="pt-4 border-t border-gray-700">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkTechReady(booking.id);
                                  }}
                                  className="w-full h-14 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold"
                                >
                                  <CheckCircle className="w-6 h-6 mr-2" />
                                  Mark Tech as Ready
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Sidebar */}
          {selectedBooking && (
            <div className="lg:col-span-1">
              <Card className="bg-gray-800 border-champagne-gold/30 sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Hand-off Booking</h3>
                    <p className="text-lg text-gray-300 mb-2">{selectedBooking.name}</p>
                    <p className="text-gray-400">{formatShortDate(selectedBooking.eventDate)}</p>
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={() => {
                        setHandoffTo("ali");
                        setShowHandoffNote(false);
                        setHandoffNote("");
                        handleHandoff(selectedBooking.id, "ali");
                      }}
                      className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold"
                    >
                      🙋‍♀️ Pass to Ali
                    </Button>

                    <Button
                      onClick={() => {
                        setHandoffTo("husband");
                        setShowHandoffNote(!showHandoffNote);
                      }}
                      className="w-full h-16 bg-purple-600 hover:bg-purple-700 text-white text-xl font-semibold"
                    >
                      🛠️ Pass to Husband
                    </Button>

                    {showHandoffNote && handoffTo === "husband" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3"
                      >
                        <label className="block text-sm font-medium text-gray-300">
                          Technical Notes (e.g., "Check lighting requirements")
                        </label>
                        <Textarea
                          value={handoffNote}
                          onChange={(e) => setHandoffNote(e.target.value)}
                          placeholder="Enter technical notes..."
                          className="w-full min-h-[100px] bg-gray-900 border-gray-700 text-white text-lg"
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              handleHandoff(selectedBooking.id, "husband", handoffNote);
                            }}
                            className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                          >
                            Send
                          </Button>
                          <Button
                            onClick={() => {
                              setShowHandoffNote(false);
                              setHandoffNote("");
                            }}
                            variant="outline"
                            className="border-gray-600 text-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <Link href={`/admin/bookings/${selectedBooking.id}`}>
                      <Button
                        variant="outline"
                        className="w-full border-champagne-gold text-champagne-gold text-lg h-12"
                      >
                        View Full Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ViceVersaDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <ViceVersaContent />
    </Suspense>
  );
}
