"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowLeft, User, Mail, Phone, Calendar, MapPin, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";

interface NewEnquiry {
  id: string;
  name: string;
  email: string;
  phoneAreaCode: string | null;
  phoneNumber: string | null;
  eventDate: string;
  venuePostcode: string;
  venueName: string | null;
  isConflict: boolean;
  originalBookingId: string | null;
  originalBooking: {
    id: string;
    name: string;
    eventDate: string;
    venueName: string;
    venuePostcode: string | null;
  } | null;
  status: string;
  createdAt: string;
  conflictDetectedAt: string | null;
  firstTouchEmailSent: boolean;
  notificationSent: boolean;
}

export default function NewEnquiryDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const enquiryId = params.id as string;

  const [enquiry, setEnquiry] = useState<NewEnquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLocalhost = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" || 
       window.location.hostname === "127.0.0.1");

    if (isLocalhost) {
      sessionStorage.setItem("dev_admin_bypass", "true");
      fetchEnquiry();
      return;
    }

    const devBypass = typeof window !== "undefined" && 
      sessionStorage.getItem("dev_admin_bypass") === "true";

    if (status === "unauthenticated" && !devBypass) {
      router.push("/login");
    } else {
      fetchEnquiry();
    }
  }, [status, router, enquiryId]);

  const fetchEnquiry = async () => {
    try {
      const response = await fetch(`/api/admin/new-enquiries/${enquiryId}`);
      if (response.ok) {
        const data = await response.json();
        setEnquiry(data.enquiry);
      }
    } catch (error) {
      console.error("Error fetching enquiry:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, d MMMM yyyy");
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Enquiry not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Back Button */}
        <Link href="/admin/new-enquiries">
          <Button
            variant="outline"
            size="sm"
            className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Enquiries
          </Button>
        </Link>

        {/* Conflict Warning Banner */}
        {enquiry.isConflict && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-900/30 border-4 border-amber-500 rounded-lg p-6"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-amber-400 mb-2">
                  ⚠️ POSSIBLE DUPLICATE DETECTED
                </h2>
                <p className="text-amber-300 mb-4">
                  This date and venue are already locked for{" "}
                  <span className="font-bold text-white">
                    {enquiry.originalBooking?.name || "an existing client"}
                  </span>
                  .
                </p>
                {enquiry.originalBooking && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded p-4 mt-4">
                    <p className="text-red-300 font-semibold text-sm mb-2">
                      Conflicting Booking Details:
                    </p>
                    <div className="text-white space-y-1">
                      <p>
                        <span className="font-semibold">Client:</span> {enquiry.originalBooking.name}
                      </p>
                      <p>
                        <span className="font-semibold">Date:</span> {formatDate(enquiry.originalBooking.eventDate)}
                      </p>
                      <p>
                        <span className="font-semibold">Venue:</span> {enquiry.originalBooking.venueName} ({enquiry.originalBooking.venuePostcode})
                      </p>
                    </div>
                    <Link href={`/admin/bookings/${enquiry.originalBooking.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 border-red-500 text-red-400 hover:bg-red-900/30"
                      >
                        View Original Booking
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Enquiry Details */}
        <Card className="bg-gray-800 border-champagne-gold/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-white font-serif">
                {enquiry.name}
              </CardTitle>
              <Badge className={enquiry.isConflict ? "bg-amber-600 text-white" : "bg-blue-600 text-white"}>
                {enquiry.isConflict ? "Conflict" : "New"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-champagne-gold" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <Mail className="w-5 h-5 text-champagne-gold" />
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <a
                      href={`mailto:${enquiry.email}`}
                      className="text-white hover:text-champagne-gold"
                    >
                      {enquiry.email}
                    </a>
                  </div>
                </div>
                {(enquiry.phoneAreaCode || enquiry.phoneNumber) && (
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <Phone className="w-5 h-5 text-champagne-gold" />
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <a
                        href={`tel:${enquiry.phoneAreaCode || ""}${enquiry.phoneNumber || ""}`}
                        className="text-white hover:text-champagne-gold"
                      >
                        {enquiry.phoneAreaCode} {enquiry.phoneNumber}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-champagne-gold" />
                Event Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Event Date</p>
                  <p className="text-white font-semibold">{formatDate(enquiry.eventDate)}</p>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Venue Postcode
                  </p>
                  <p className="text-white font-semibold">{enquiry.venuePostcode}</p>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-champagne-gold" />
                Status Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <Badge className={enquiry.status === "new" ? "bg-blue-600" : "bg-green-600"}>
                    {enquiry.status}
                  </Badge>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Received</p>
                  <p className="text-white text-sm">
                    {format(new Date(enquiry.createdAt), "d MMM yyyy 'at' HH:mm")}
                  </p>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">First Touch Email</p>
                  <div className="flex items-center gap-2">
                    {enquiry.firstTouchEmailSent ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">Sent</span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm">Not sent</span>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Mobile Notification</p>
                  <div className="flex items-center gap-2">
                    {enquiry.notificationSent ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">Sent</span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm">Not sent</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-700">
              <Button
                onClick={async () => {
                  // Convert to booking
                  try {
                    const response = await fetch(`/api/admin/new-enquiries/${enquiry.id}/convert`, {
                      method: "POST",
                    });
                    if (response.ok) {
                      const data = await response.json();
                      router.push(`/admin/bookings/${data.bookingId}`);
                    } else {
                      alert("Failed to convert enquiry to booking");
                    }
                  } catch (error) {
                    console.error("Error converting enquiry:", error);
                    alert("Failed to convert enquiry to booking");
                  }
                }}
                className="bg-champagne-gold text-black hover:bg-champagne-gold/90"
              >
                Convert to Booking
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  // Mark as reviewed
                  try {
                    const response = await fetch(`/api/admin/new-enquiries/${enquiry.id}/review`, {
                      method: "PATCH",
                    });
                    if (response.ok) {
                      router.push("/admin/new-enquiries");
                    } else {
                      alert("Failed to update enquiry status");
                    }
                  } catch (error) {
                    console.error("Error updating enquiry:", error);
                    alert("Failed to update enquiry status");
                  }
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Mark as Reviewed
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
