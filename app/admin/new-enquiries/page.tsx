"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Clock, User, Mail, Phone, Calendar, MapPin, ExternalLink, RefreshCw, Package, FileText, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";

interface SelectedHireItem {
  hireItemId: string;
  quantity: number;
  name?: string;
}

interface NewEnquiry {
  id: string;
  name: string;
  email: string;
  phoneAreaCode: string | null;
  phoneNumber: string | null;
  eventDate: string;
  venuePostcode: string;
  venueName: string | null;
  enquiryType?: string | null;
  selectedHireItems?: SelectedHireItem[] | null;
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
}

function NewEnquiriesContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<NewEnquiry[]>([]);
  const [hireEnquiries, setHireEnquiries] = useState<NewEnquiry[]>([]);
  const [quoteRequestEnquiries, setQuoteRequestEnquiries] = useState<NewEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const removeEnquiryFromState = (id: string) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    setHireEnquiries((prev) => prev.filter((e) => e.id !== id));
    setQuoteRequestEnquiries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleDelete = async (enquiry: NewEnquiry) => {
    if (
      !confirm(
        `Delete enquiry from ${enquiry.name} (${enquiry.email})?\n\nThis cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(enquiry.id);
    try {
      const response = await fetch(`/api/admin/new-enquiries/${enquiry.id}/`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        alert(typeof data.error === "string" ? data.error : "Failed to delete enquiry");
        return;
      }
      removeEnquiryFromState(enquiry.id);
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      alert("Failed to delete enquiry. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const EnquiryActions = ({ enquiry, reviewClassName }: { enquiry: NewEnquiry; reviewClassName?: string }) => (
    <div className="flex flex-col gap-2 flex-shrink-0">
      <Link href={`/admin/new-enquiries/${enquiry.id}/`}>
        <Button
          variant="outline"
          size="sm"
          className={reviewClassName ?? "border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10 w-full"}
        >
          Review
        </Button>
      </Link>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={deletingId === enquiry.id}
        onClick={() => handleDelete(enquiry)}
        className="border-red-500/50 text-red-400 hover:bg-red-950/30 w-full"
      >
        <Trash2 className="w-3.5 h-3.5 mr-1" />
        {deletingId === enquiry.id ? "Deleting…" : "Delete"}
      </Button>
    </div>
  );

  useEffect(() => {
    // Auto-enable dev bypass on localhost
    const isLocalhost = typeof window !== "undefined" && 
      (process.env.NODE_ENV === "development" || 
       window.location.hostname === "localhost" || 
       window.location.hostname === "127.0.0.1");

    if (isLocalhost) {
      sessionStorage.setItem("dev_admin_bypass", "true");
      sessionStorage.setItem("dev_admin_role", "admin");
      sessionStorage.setItem("dev_admin_name", "Local Admin");
      fetchEnquiries();
      return;
    }

    const devBypass = typeof window !== "undefined" && 
      sessionStorage.getItem("dev_admin_bypass") === "true";

    if (status === "unauthenticated" && !devBypass) {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin" && !devBypass) {
      router.push("/client/dashboard");
    } else {
      fetchEnquiries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router]);

  const fetchEnquiries = async () => {
    if (refreshing) return;
    setLoading(true);
    setRefreshing(true);

    try {
      const response = await fetch("/api/admin/new-enquiries/?t=" + Date.now(), {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setEnquiries(data.enquiries || []);
        setHireEnquiries(data.hireEnquiries || []);
        setQuoteRequestEnquiries(data.quoteRequestEnquiries || []);
      } else {
        console.error("Failed to load new enquiries:", response.status);
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, d MMMM yyyy");
    } catch {
      return dateString;
    }
  };

  const isLocalhost = typeof window !== "undefined" && 
    (process.env.NODE_ENV === "development" || 
     window.location.hostname === "localhost" || 
     window.location.hostname === "127.0.0.1");

  const devBypass = typeof window !== "undefined" && 
    sessionStorage.getItem("dev_admin_bypass") === "true";

  const isAdmin = session && (session?.user as any)?.role === "admin";
  const hasAccess = isAdmin || devBypass || isLocalhost;

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  const conflictEnquiries = enquiries.filter(e => e.isConflict);
  const newEnquiries = enquiries.filter(e => !e.isConflict);
  const nonHireEnquiries = newEnquiries.filter(e => e.enquiryType !== "hire_only" && e.enquiryType !== "quote_request");

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-serif">
              New Enquiries
            </h1>
            <p className="text-gray-400 mt-1">
              {enquiries.length > 0
                ? `${enquiries.length} awaiting review (Enquire, contact & hire forms)`
                : "Review and manage new enquiries"}
            </p>
          </div>
          <Button
            onClick={fetchEnquiries}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Conflict Warning Panel */}
        {conflictEnquiries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-900/30 border-4 border-amber-500 rounded-lg p-6"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-amber-400 mb-2">
                  POSSIBLE DUPLICATES DETECTED
                </h2>
                <p className="text-amber-300 mb-4">
                  {conflictEnquiries.length} {conflictEnquiries.length === 1 ? "enquiry has" : "enquiries have"} been flagged as potential conflicts.
                </p>
                <div className="space-y-3">
                  {conflictEnquiries.map((enquiry) => (
                    <div
                      key={enquiry.id}
                      className="bg-gray-900/50 border border-amber-500/50 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white font-semibold text-lg mb-1">
                            {enquiry.name} - {formatDate(enquiry.eventDate)}
                          </p>
                          <p className="text-amber-300 text-sm mb-2">
                            Venue Postcode: {enquiry.venuePostcode}
                          </p>
                          {enquiry.originalBooking && (
                            <div className="bg-red-900/30 border border-red-500/50 rounded p-3 mt-2">
                              <p className="text-red-300 font-semibold text-sm mb-1">
                                ⚠️ CONFLICTING WITH EXISTING BOOKING:
                              </p>
                              <p className="text-white">
                                This date and venue are already locked for{" "}
                                <span className="font-bold">{enquiry.originalBooking.name}</span>
                              </p>
                              <p className="text-gray-300 text-sm mt-1">
                                Venue: {enquiry.originalBooking.venueName} ({enquiry.originalBooking.venuePostcode})
                              </p>
                              <Link
                                href={`/admin/bookings/${enquiry.originalBooking.id}`}
                                className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm mt-2"
                              >
                                View Original Booking
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          )}
                        </div>
                        <EnquiryActions
                          enquiry={enquiry}
                          reviewClassName="border-amber-500 text-amber-400 hover:bg-amber-900/30 w-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quote requests (Request a quote page) */}
        {quoteRequestEnquiries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-champagne-gold" />
              Quote Requests ({quoteRequestEnquiries.length})
            </h2>
            <p className="text-gray-400 text-sm">Request a quote (lighting, DJ, production, hire, combination).</p>
            <div className="space-y-3">
              {quoteRequestEnquiries.map((enquiry) => (
                <Card key={enquiry.id} className="bg-gray-800 border-champagne-gold/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold">{enquiry.name}</p>
                        <p className="text-gray-400 text-sm">{enquiry.email}</p>
                        <p className="text-gray-400 text-sm mt-1">
                          {formatDate(enquiry.eventDate)} · {enquiry.venueName || enquiry.venuePostcode}
                        </p>
                      </div>
                      <EnquiryActions enquiry={enquiry} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Hire Enquiries */}
        {hireEnquiries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-champagne-gold" />
              Hire Enquiries ({hireEnquiries.length})
            </h2>
            <p className="text-gray-400 text-sm">Request Quote submissions from the public hire page.</p>
            <div className="space-y-3">
              {hireEnquiries.map((enquiry) => {
                const items = (enquiry.selectedHireItems as SelectedHireItem[]) || [];
                return (
                  <Card
                    key={enquiry.id}
                    className="bg-gray-800 border-champagne-gold/30 hover:border-champagne-gold/50 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{enquiry.name}</h3>
                            {enquiry.status === "new" && (
                              <Badge className="bg-champagne-gold/20 text-champagne-gold border border-champagne-gold/40">New</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-300">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-champagne-gold" />
                              {enquiry.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-champagne-gold" />
                              {formatDate(enquiry.eventDate)}
                            </span>
                            {(enquiry.venueName && enquiry.venueName !== "TBC") && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-champagne-gold" />
                                {enquiry.venueName}
                              </span>
                            )}
                          </div>
                          {items.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-700">
                              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Requested items</p>
                              <ul className="text-sm text-gray-300 space-y-0.5">
                                {items.map((row, idx) => (
                                  <li key={idx}>
                                    {(row as any).name || row.hireItemId} × {row.quantity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <p className="text-gray-500 text-xs mt-2">
                            Received {format(new Date(enquiry.createdAt), "d MMM yyyy 'at' HH:mm")}
                          </p>
                        </div>
                        <EnquiryActions enquiry={enquiry} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* New Enquiries List – contact & general (quote/hire shown above) */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Contact &amp; general ({nonHireEnquiries.length})
          </h2>
          {enquiries.length === 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No new enquiries</p>
                <p className="text-gray-500 text-sm mt-2">
                  All caught up! Check back later for new enquiries.
                </p>
              </CardContent>
            </Card>
          )}
          {nonHireEnquiries.map((enquiry) => (
            <Card
              key={enquiry.id}
              className="bg-gray-800 border-gray-700 hover:border-champagne-gold/50 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-white">{enquiry.name}</h3>
                      {enquiry.status === "new" && (
                        <Badge className="bg-blue-600 text-white">New</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Mail className="w-4 h-4 text-champagne-gold" />
                        {enquiry.email}
                      </div>
                      {(enquiry.phoneAreaCode || enquiry.phoneNumber) && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone className="w-4 h-4 text-champagne-gold" />
                          {enquiry.phoneAreaCode} {enquiry.phoneNumber}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4 text-champagne-gold" />
                        {formatDate(enquiry.eventDate)}
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-4 h-4 text-champagne-gold" />
                        {enquiry.venuePostcode}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs mt-3">
                      <Clock className="w-3 h-3" />
                      Received {format(new Date(enquiry.createdAt), "d MMM yyyy 'at' HH:mm")}
                    </div>
                  </div>
                  <EnquiryActions enquiry={enquiry} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function NewEnquiriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <NewEnquiriesContent />
    </Suspense>
  );
}
