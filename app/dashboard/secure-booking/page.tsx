"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useClientStatus } from "@/hooks/useClientStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Calendar, MapPin, Music, Lightbulb, Shield, MessageCircle, FileText, Lock, X, Copy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function SecureBookingPageContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const { clientName } = useClientStatus();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [userIpAddress, setUserIpAddress] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [booking, setBooking] = useState<{
    id: string;
    venueName: string;
    eventDate: string;
    eventType: string;
    preferredDJ?: string | null;
    services?: string[];
    finalBalance?: string | null;
    bookingFee?: string | null;
  } | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Resolve bookingId: URL param, sessionStorage (from IP recognition), or first user booking
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fromUrl = searchParams.get("bookingId");
    const fromStorage = typeof window !== "undefined" ? sessionStorage.getItem("stylish_booking_id") : null;
    setBookingId(fromUrl || fromStorage || null);
  }, [searchParams]);

  useEffect(() => {
    if (!session?.user || !bookingId) return;
    const fetchBooking = async () => {
      try {
        const res = await fetch("/api/client/bookings");
        if (!res.ok) {
          setBookingError("Could not load your booking");
          return;
        }
        const data = await res.json();
        const list = data.bookings || [];
        const found = list.find((b: { id: string }) => b.id === bookingId);
        if (found) {
          setBooking({
            id: found.id,
            venueName: found.venueName || "Venue TBC",
            eventDate: found.eventDate ? new Date(found.eventDate).toISOString().slice(0, 10) : "",
            eventType: found.eventType || "Event",
            preferredDJ: found.preferredDJ,
            services: found.services,
            finalBalance: found.finalBalance,
            bookingFee: found.bookingFee,
          });
          setBookingError(null);
        } else {
          setBookingError("Booking not found or you do not have access");
        }
      } catch {
        setBookingError("Could not load your booking");
      }
    };
    fetchBooking();
  }, [session, bookingId]);

  // If logged in but no bookingId, try to use first booking
  useEffect(() => {
    if (session?.user && !bookingId && !booking) {
      const fetchFirst = async () => {
        try {
          const res = await fetch("/api/client/bookings");
          if (!res.ok) return;
          const data = await res.json();
          const list = data.bookings || [];
          const first = list[0];
          if (first) {
            setBookingId(first.id);
          }
        } catch {
          /* ignore */
        }
      };
      fetchFirst();
    }
  }, [session, bookingId, booking]);

  // Fetch user IP address (optional, for future use)
  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setUserIpAddress(data.ip);
      } catch {
        try {
          const fallbackResponse = await fetch("https://api64.ipify.org?format=json");
          const fallbackData = await fallbackResponse.json();
          setUserIpAddress(fallbackData.ip);
        } catch {
          /* ignore */
        }
      }
    };
    fetchIpAddress();
  }, []);

  const bookingData = booking
    ? {
        venueName: booking.venueName,
        eventDate: booking.eventDate,
        eventType: booking.eventType,
        djArtists: booking.preferredDJ ? [booking.preferredDJ] : [],
        lightingAddOns: [] as string[],
        totalAmount: parseFloat(String(booking.finalBalance || "0").replace(/[^0-9.-]/g, "")) || 0,
        depositAmount: parseFloat(String(booking.bookingFee || "0").replace(/[^0-9.-]/g, "")) || 0,
      }
    : {
        venueName: "…",
        eventDate: "",
        eventType: "…",
        djArtists: [] as string[],
        lightingAddOns: [] as string[],
        totalAmount: 0,
        depositAmount: 0,
      };

  const remainingBalance = Math.max(0, bookingData.totalAmount - bookingData.depositAmount);
  const paymentReference = bookingData.venueName && bookingData.eventDate
    ? `STYLISH-${bookingData.venueName.substring(0, 3).toUpperCase()}-${bookingData.eventDate.replace(/-/g, "")}`
    : "STYLISH-TBC";

  // Copy to clipboard function
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const formattedDate = bookingData.eventDate
    ? new Date(bookingData.eventDate).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Date to be confirmed';

  const handlePayDeposit = async () => {
    if (!termsAccepted) {
      alert("Please accept the Terms & Conditions to proceed.");
      return;
    }
    if (!booking?.id) {
      alert("Please wait for your booking to load, or log in to access your booking.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bookings/accept-terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert("Terms accepted. Payment integration will follow.");
          // NOTE: Payment gateway integration will be implemented here
        } else {
          throw new Error("Failed to accept terms");
        }
      } else {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to accept terms");
      }
    } catch (error) {
      console.error("Error submitting terms acceptance:", error);
      alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = status === "loading";
  const needsLogin = status === "unauthenticated";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (needsLogin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md border border-champagne-gold/30">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in required</h2>
            <p className="text-gray-600 mb-4">
              Please log in to view your booking and accept terms.
            </p>
            <Link href="/login">
              <Button className="bg-champagne-gold text-black hover:bg-champagne-gold/90">
                Log in
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (bookingError && !booking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md border border-champagne-gold/30">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking not found</h2>
            <p className="text-gray-600 mb-4">{bookingError}</p>
            <Link href="/client/dashboard">
              <Button variant="outline" className="border-champagne-gold text-champagne-gold">
                Back to dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="border-b border-champagne-gold/30 bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {clientName && (
              <p className="text-champagne-gold font-medium text-sm md:text-base mb-4">
                Welcome back, {clientName}
              </p>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold mb-2">
              Your Celebration at {bookingData.venueName}
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mt-4">
              Secure your date with a deposit to confirm your booking
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Left Column - Booking Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white border border-champagne-gold/30 shadow-lg">
                <CardHeader className="border-b border-champagne-gold/20 pb-4">
                  <CardTitle className="text-2xl md:text-3xl font-serif text-gray-900">
                    Booking Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Event Date */}
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-champagne-gold/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-champagne-gold" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Event Date</h3>
                      <p className="text-gray-700">{formattedDate}</p>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-champagne-gold/10 rounded-lg">
                      <MapPin className="w-5 h-5 text-champagne-gold" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Venue</h3>
                      <p className="text-gray-700">{bookingData.venueName}</p>
                    </div>
                  </div>

                  {/* DJ/Artists */}
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-champagne-gold/10 rounded-lg">
                      <Music className="w-5 h-5 text-champagne-gold" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">DJ/Artists</h3>
                      <p className="text-gray-700">
                        {bookingData.djArtists?.length ? bookingData.djArtists.join(", ") : "TBC"}
                      </p>
                    </div>
                  </div>

                  {/* Lighting Add-ons */}
                  {bookingData.lightingAddOns && bookingData.lightingAddOns.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-champagne-gold/10 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-champagne-gold" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">Lighting Add-ons</h3>
                        <ul className="text-gray-700 space-y-1">
                          {bookingData.lightingAddOns.map((addon, index) => (
                            <li key={index}>• {addon}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* High-quality Image */}
                  <div className="mt-8 rounded-lg overflow-hidden border border-champagne-gold/20">
                    <Image
                      src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto,dpr_auto/v1768733254/Babington-House-in-Green_oms0ws.jpg"
                      alt={`${bookingData.venueName} - Elegant wedding venue`}
                      width={600}
                      height={400}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Deposit Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Deposit Summary Card */}
              <Card className="bg-white border border-champagne-gold/30 shadow-lg">
                <CardHeader className="border-b border-champagne-gold/20 pb-4">
                  <CardTitle className="text-2xl md:text-3xl font-serif text-gray-900">
                    Deposit Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Total Amount */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">
                      £{bookingData.totalAmount.toLocaleString('en-GB')}
                    </span>
                  </div>

                  {/* Deposit Required */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Deposit Required</span>
                    <span className="text-2xl font-bold text-champagne-gold">
                      £{bookingData.depositAmount.toLocaleString('en-GB')}
                    </span>
                  </div>

                  {/* Remaining Balance */}
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-700 font-medium">Remaining Balance</span>
                    <span className="text-xl font-semibold text-gray-600">
                      £{remainingBalance.toLocaleString('en-GB')}
                    </span>
                  </div>

                  {/* Payment Reference */}
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 mt-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase mb-1">Payment Reference</p>
                      <p className="font-mono font-bold text-gray-900 text-sm">{paymentReference}</p>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(paymentReference)}
                      variant="ghost"
                      size="sm"
                      className="ml-2 hover:bg-gray-200"
                      aria-label="Copy payment reference"
                    >
                      {copiedRef ? (
                        <span className="text-xs text-champagne-gold font-medium">Copied!</span>
                      ) : (
                        <Copy className="h-4 w-4 text-champagne-gold" />
                      )}
                    </Button>
                  </div>

                  {/* Our Promise Trust Factor */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-champagne-gold/5 to-champagne-gold/10 border border-champagne-gold/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-champagne-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Our Promise</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Genuine guidance, flawless execution, and a 20-year reputation for excellence.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Acceptance Section */}
              <Card className="bg-white border border-champagne-gold/30 shadow-lg">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Terms & Conditions Checkbox */}
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                        className="mt-1 border-champagne-gold/50 data-[state=checked]:bg-champagne-gold data-[state=checked]:border-champagne-gold"
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-gray-700 leading-relaxed cursor-pointer flex-1"
                      >
                        I have read and agree to the{" "}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <button
                              type="button"
                              className="text-champagne-gold hover:text-champagne-gold/80 underline decoration-champagne-gold/50 underline-offset-4 font-medium"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsDialogOpen(true);
                              }}
                            >
                              Terms & Conditions
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-champagne-gold/30 shadow-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-serif text-gray-900 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-champagne-gold" />
                                Terms and Conditions
                              </DialogTitle>
                              <p className="text-gray-600 text-sm mt-2">
                                Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            </DialogHeader>
                            <div className="mt-4 space-y-6 text-gray-700">
                              <div>
                                <h2 className="text-xl font-bold text-champagne-gold mt-6 mb-3">1. Booking Confirmation</h2>
                                <p className="leading-relaxed">
                                  This booking form serves as an invitation only. Submission of this form does not constitute a confirmation of artist performance. 
                                  Once we have final confirmation from your chosen DJ, we will email a booking invoice with full terms and conditions.
                                </p>
                              </div>

                              <div>
                                <h2 className="text-xl font-bold text-champagne-gold mt-6 mb-3">2. Payment Terms</h2>
                                <p className="leading-relaxed">
                                  A deposit is required upon booking confirmation. The final balance is due in the weeks before your event, or on the night in cash 
                                  once the artist has set up. If the DJ is not paid in full at the start of the evening, they may refuse to play.
                                </p>
                              </div>

                              <div>
                                <h2 className="text-xl font-bold text-champagne-gold mt-6 mb-3">3. Cancellation Policy</h2>
                                <p className="leading-relaxed">
                                  Cancellations must be made in writing. The deposit is non-refundable. Cancellations made within 30 days of the event date 
                                  may incur additional charges as outlined in your booking confirmation.
                                </p>
                              </div>

                              <div>
                                <h2 className="text-xl font-bold text-champagne-gold mt-6 mb-3">4. Artist Availability</h2>
                                <p className="leading-relaxed">
                                  We will confirm artist availability before finalising your booking. In the unlikely event that your chosen artist becomes unavailable, 
                                  we will offer a suitable replacement or provide a full refund of your deposit.
                                </p>
                              </div>

                              <div>
                                <h2 className="text-xl font-bold text-champagne-gold mt-6 mb-3">5. Setup and Access</h2>
                                <p className="leading-relaxed">
                                  Our artists require adequate setup time and access to the venue. Early setup may be available for an additional fee. 
                                  Please ensure the venue provides suitable access and parking arrangements.
                                </p>
                              </div>

                              <div>
                                <h2 className="text-xl font-bold text-champagne-gold mt-6 mb-3">6. Venue Requirements</h2>
                                <p className="leading-relaxed">
                                  You must seek permission from your venue before booking our services. Some venues have specific requirements or restrictions. 
                                  We are always respectful of venue policies and will work within their guidelines.
                                </p>
                              </div>

                              <div>
                                <h2 className="text-xl font-bold text-champagne-gold mt-6 mb-3">7. Equipment and Safety</h2>
                                <p className="leading-relaxed">
                                  All equipment is PAT tested and we have public liability insurance. Certificates can be provided to your venue upon request.
                                </p>
                              </div>

                              <div>
                                <h2 className="text-xl font-bold text-champagne-gold mt-6 mb-3">8. Music and Requests</h2>
                                <p className="leading-relaxed">
                                  We actively encourage music requests and will create a bespoke set for your event. Our DJs use their professional judgement 
                                  to ensure the dance floor stays full. Please provide any must-play or do-not-play lists in advance.
                                </p>
                              </div>

                              <div>
                                <h2 className="text-xl font-bold text-champagne-gold mt-6 mb-3">9. Liability</h2>
                                <p className="leading-relaxed">
                                  While we take every care to provide an excellent service, Stylish Entertainment Ltd accepts no liability for delays or cancellations 
                                  due to circumstances beyond our control, including but not limited to severe weather, venue closure, or government restrictions.
                                </p>
                              </div>

                              <div>
                                <h2 className="text-xl font-bold text-champagne-gold mt-6 mb-3">10. Data Protection</h2>
                                <p className="leading-relaxed">
                                  Your personal information will be stored securely and used only for the purposes of managing your booking. 
                                  Please see our <Link href="/privacy-policy" className="text-champagne-gold hover:text-champagne-gold/80 underline">Privacy Policy</Link> for more details.
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        .
                      </label>
                    </div>

                    {/* Trust Indicator */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 pt-2 border-t border-gray-200">
                      <Lock className="w-4 h-4 text-champagne-gold flex-shrink-0" />
                      <span>
                        Secure digital signature will be recorded with your IP for contract validation.
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-4">
                {/* Pay Secure Deposit Button */}
                <Button
                  size="lg"
                  onClick={handlePayDeposit}
                  disabled={!termsAccepted || !booking?.id || isSubmitting}
                  className="w-full bg-champagne-gold text-black hover:bg-champagne-gold/90 font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Pay Secure Deposit"}
                </Button>

                {/* Message Ali or Nigel Button */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-champagne-gold/50 text-gray-900 hover:bg-champagne-gold/10 font-medium"
                  asChild
                >
                  <Link href="/contact-us/" className="flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Message Ali or Nigel
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SecureBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SecureBookingPageContent />
    </Suspense>
  );
}
