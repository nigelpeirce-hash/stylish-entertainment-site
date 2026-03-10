"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import UpdateEnquiryForm from "./UpdateEnquiryForm";
import { trackEnquiryComplete } from "@/lib/analytics";

export default function ThankYouClient() {
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    // Check sessionStorage for recent booking
    const storedBookingId = sessionStorage.getItem("recentBookingId");
    const storedEmail = sessionStorage.getItem("recentBookingEmail");
    const storedTimestamp = sessionStorage.getItem("recentBookingTimestamp");
    const storedEventType = sessionStorage.getItem("recentEventType");

    // Debug: log state so we can diagnose conversion issues
    console.log("[ThankYou] sessionStorage state:", {
      hasTimestamp: !!storedTimestamp,
      hasBookingId: !!storedBookingId,
      eventType: storedEventType,
      conversionFired: sessionStorage.getItem("thank_you_conversion_fired"),
      analyticsDisabled: localStorage.getItem("disable_analytics"),
      gtagAvailable: typeof window !== "undefined" && !!window.gtag,
    });

    // Fire conversion once when landing from form submit
    const conversionFired = sessionStorage.getItem("thank_you_conversion_fired");
    const justSubmitted = storedTimestamp && !conversionFired;
    if (justSubmitted) {
      const timestamp = parseInt(storedTimestamp, 10);
      const secondsAgo = (Date.now() - timestamp) / 1000;
      console.log("[ThankYou] Seconds since form submit:", secondsAgo);
      if (secondsAgo < 300) {
        console.log("[ThankYou] Firing conversion event:", storedEventType || "general");
        trackEnquiryComplete({ eventType: storedEventType || "general", source: "contact_form" });
        sessionStorage.setItem("thank_you_conversion_fired", "1");
      } else {
        console.warn("[ThankYou] Conversion NOT fired – too long since submit:", secondsAgo, "seconds");
      }
    } else {
      console.log("[ThankYou] No conversion to fire:", { justSubmitted, hasTimestamp: !!storedTimestamp, conversionFired });
    }

    // Only show update form if booking was submitted within last 24 hours
    if (storedBookingId && storedEmail && storedTimestamp) {
      const timestamp = parseInt(storedTimestamp, 10);
      const hoursSinceSubmission = (Date.now() - timestamp) / (1000 * 60 * 60);
      
      // Show update form if submitted within 24 hours
      if (hoursSinceSubmission < 24) {
        setBookingId(storedBookingId);
        setEmail(storedEmail);
        setShowUpdateForm(true);
      }
    }
  }, []);

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 py-20 relative"
      style={{
        background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
      }}
    >
      <div className="container mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border-champagne-gold/30 rounded-2xl p-8 md:p-12 shadow-2xl"
        >
          <CheckCircle className="w-20 h-20 md:w-24 md:h-24 text-champagne-gold mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Thank You!
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            We&apos;ve received your enquiry and will get back to you as soon as possible.
          </p>
          <p className="text-base text-gray-300 mb-8">
            We typically respond within 24-48 hours. If you have any urgent questions, please call us at{" "}
            <a href="tel:+447970793177" className="text-champagne-gold hover:underline">
              +44 7970 793177
            </a>
            .
          </p>

          {/* Update Enquiry Form - Only show if recent booking exists */}
          {showUpdateForm && bookingId && email && (
            <UpdateEnquiryForm bookingId={bookingId} email={email} />
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              asChild
              size="lg"
              className="bg-champagne-gold text-black hover:bg-gold-light"
            >
              <Link href="/">Return to Home</Link>
            </Button>
            {!showUpdateForm && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-champagne-gold/30 text-white hover:bg-champagne-gold/10"
              >
                <Link href="/contact-us/">Send Another Message</Link>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
