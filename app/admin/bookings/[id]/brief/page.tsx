"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Printer, FileText, MapPin, Users, Package, Music } from "lucide-react";
import Link from "next/link";

interface BriefData {
  booking: {
    id: string;
    name: string;
    eventDate: string;
    venueName: string | null;
    venueAddress: string | null;
    venuePostcode: string | null;
    ceremonyTime: string | null;
    finishTime: string | null;
  };
  venue: {
    venueNotes: string | null;
    defaultCeremonyTime: string | null;
    defaultFinishTime: string | null;
  } | null;
  warehouseItems: Record<string, Array<{
    quantity: number;
    WarehouseItem: {
      name: string;
      category: string;
      size: string | null;
      weight: number | null;
    };
  }>>;
  totalItems: number;
  talent: Array<{
    id: string;
    role: string | null;
    staff: {
      id: string;
      name: string;
      email: string | null;
      phone: string | null;
      bio: string | null;
    };
  }>;
  assignedCrew: Array<{
    id: string;
    role: string | null;
    staff: {
      id: string;
      name: string;
      email: string | null;
    };
  }>;
  guestRequests: Array<{
    songTitle: string;
    artist: string | null;
    guestName: string | null;
    status: string;
  }>;
}

export default function MasterBriefPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [briefData, setBriefData] = useState<BriefData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login/");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard/");
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchBrief = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/bookings/${bookingId}/internal-brief/`);
        const data = await res.json();
        if (res.ok) {
          setBriefData(data);
        } else {
          setError(data.error || "Failed to load brief");
        }
      } catch (err) {
        setError("Failed to load brief");
      } finally {
        setLoading(false);
      }
    };

    const devBypass = typeof window !== "undefined" && 
      sessionStorage.getItem("dev_admin_bypass") === "true";

    if ((status === "authenticated" && (session?.user as any)?.role === "admin") || devBypass) {
      fetchBrief();
    }
  }, [bookingId, status, session]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !briefData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <Card className="bg-gray-800 border-red-500/30 max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h1 className="text-xl font-bold text-white mb-2">Error</h1>
            <p className="text-gray-400">{error || "Failed to load brief"}</p>
            <Button
              onClick={() => router.push(`/admin/bookings/${bookingId}/`)}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Booking
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getGoogleMapsUrl = () => {
    const parts = [];
    if (briefData.booking.venueName) parts.push(briefData.booking.venueName);
    if (briefData.booking.venuePostcode) parts.push(briefData.booking.venuePostcode);
    return parts.length > 0
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(", "))}`
      : null;
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .brief-content {
            max-width: 100%;
            padding: 0;
          }
          .section-card {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header - Hidden on Print */}
        <div className="no-print sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto max-w-4xl px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href={`/admin/bookings/${bookingId}/`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Booking
                </Button>
              </Link>
              <Button
                onClick={handlePrint}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print / Save as PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Brief Content */}
        <div className="container mx-auto max-w-4xl px-6 py-8 brief-content">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-500 mb-2">MASTER INTERNAL BRIEF</h1>
            <p className="text-gray-400 text-sm">
              Generated: {new Date().toLocaleString("en-GB")}
            </p>
          </div>

          {/* Logistics Section */}
          <Card className="mb-6 section-card bg-white/[0.02] border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                Logistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">Booking</p>
                <p className="text-white font-semibold">{briefData.booking.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Event Date</p>
                <p className="text-white">{briefData.booking.eventDate}</p>
              </div>
              {briefData.booking.venueName && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Venue</p>
                  <p className="text-white font-semibold">{briefData.booking.venueName}</p>
                </div>
              )}
              {briefData.booking.venueAddress && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Address</p>
                  <p className="text-white">{briefData.booking.venueAddress}</p>
                </div>
              )}
              {briefData.booking.venuePostcode && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Postcode</p>
                  <p className="text-white">{briefData.booking.venuePostcode}</p>
                  {getGoogleMapsUrl() && (
                    <a
                      href={getGoogleMapsUrl() || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-500 hover:text-amber-400 text-sm underline"
                    >
                      View on Google Maps
                    </a>
                  )}
                </div>
              )}
              {(briefData.booking.ceremonyTime || briefData.venue?.defaultCeremonyTime) && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Load-in Time</p>
                  <p className="text-white">
                    {briefData.booking.ceremonyTime
                      ? new Date(briefData.booking.ceremonyTime).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : briefData.venue?.defaultCeremonyTime || "TBC"}
                  </p>
                </div>
              )}
              {briefData.venue?.venueNotes && (
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Venue Notes</p>
                  <p className="text-white whitespace-pre-wrap">{briefData.venue.venueNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Talent Section */}
          {briefData.talent.length > 0 && (
            <Card className="mb-6 section-card bg-white/[0.02] border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  Talent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {briefData.talent.map((assignment) => (
                  <div key={assignment.id} className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold text-lg">{assignment.staff.name}</p>
                        <p className="text-amber-500 text-sm uppercase">{assignment.role}</p>
                      </div>
                    </div>
                    {assignment.staff.email && (
                      <p className="text-gray-400 text-sm mb-1">Email: {assignment.staff.email}</p>
                    )}
                    {assignment.staff.phone && (
                      <p className="text-gray-400 text-sm mb-1">Phone: {assignment.staff.phone}</p>
                    )}
                    {assignment.staff.bio && (
                      <div className="mt-2">
                        <p className="text-gray-400 text-sm mb-1">Bio:</p>
                        <p className="text-white text-sm">{assignment.staff.bio}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Warehouse Pick List */}
          {briefData.totalItems > 0 && (
            <Card className="mb-6 section-card bg-white/[0.02] border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-500" />
                  Warehouse Pick List ({briefData.totalItems} items)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(briefData.warehouseItems).map(([category, items]) => (
                  <div key={category} className="p-4 bg-gray-900/50 rounded-lg">
                    <h3 className="text-amber-500 font-semibold uppercase mb-3">{category}</h3>
                    <ul className="space-y-2">
                      {items.map((item, idx) => (
                        <li key={idx} className="text-white text-sm">
                          <span className="font-semibold">{item.quantity}x</span> {item.WarehouseItem.name}
                          {item.WarehouseItem.size && (
                            <span className="text-gray-400"> ({item.WarehouseItem.size})</span>
                          )}
                          {item.WarehouseItem.weight && (
                            <span className="text-gray-400"> - {item.WarehouseItem.weight}kg</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Assigned Crew */}
          {briefData.assignedCrew.length > 0 && (
            <Card className="mb-6 section-card bg-white/[0.02] border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  Assigned Crew
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {briefData.assignedCrew.map((assignment) => (
                    <li key={assignment.id} className="text-white">
                      <span className="font-semibold">{assignment.staff.name}</span> -{" "}
                      <span className="text-amber-500">{assignment.role}</span>
                      {assignment.staff.email && (
                        <span className="text-gray-400 text-sm ml-2">({assignment.staff.email})</span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Guest Requests - Top 10 */}
          {briefData.guestRequests.length > 0 && (
            <Card className="mb-6 section-card bg-white/[0.02] border-white/10">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Music className="w-5 h-5 text-amber-500" />
                  The Crowd - Top {briefData.guestRequests.length} Guest Requests
                </CardTitle>
                <p className="text-sm text-gray-400">
                  So the team knows the vibe
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {briefData.guestRequests.map((req, idx) => (
                    <li key={idx} className="text-white p-2 bg-gray-900/50 rounded">
                      <span className="font-semibold">{req.songTitle}</span>
                      {req.artist && <span className="text-gray-400"> by {req.artist}</span>}
                      {req.guestName && (
                        <span className="text-amber-500 text-sm ml-2">({req.guestName})</span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
