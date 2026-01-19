"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Loader2, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface RescueResponse {
  success: boolean;
  message?: string;
  error?: string;
  booking?: {
    name: string;
    eventDate: string;
    venueName: string;
  };
}

export default function LeadRescuePage() {
  const params = useParams();
  const router = useRouter();
  const rescueId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingInfo, setBookingInfo] = useState<{ name: string; eventDate: string; venueName: string } | null>(null);

  useEffect(() => {
    const extendRetention = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/rescue/${rescueId}/extend-retention`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data: RescueResponse = await response.json();

        if (response.ok && data.success) {
          setSuccess(true);
          if (data.booking) {
            setBookingInfo(data.booking);
          }
        } else {
          setError(data.error || "Failed to extend retention period. Please contact us directly.");
        }
      } catch (err: any) {
        console.error("Error extending retention:", err);
        setError("An error occurred. Please contact us directly at office@stylishentertainment.co.uk");
      } finally {
        setLoading(false);
      }
    };

    if (rescueId) {
      extendRetention();
    }
  }, [rescueId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center"
        >
          {loading && (
            <div className="space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mx-auto w-16 h-16"
              >
                <Loader2 className="w-16 h-16 text-champagne-gold mx-auto" />
              </motion.div>
              <div>
                <h1 className="text-2xl md:text-3xl font-serif text-gray-900 mb-2">
                  Processing Your Request
                </h1>
                <p className="text-gray-600">
                  Please wait while we extend your inquiry retention period...
                </p>
              </div>
            </div>
          )}

          {success && !loading && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="space-y-6"
            >
              <div className="relative mx-auto w-20 h-20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                  className="absolute inset-0 bg-green-100 rounded-full"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                  className="relative"
                >
                  <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
                </motion.div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-serif text-gray-900">
                  No Problem, We've Got You!
                </h1>
                
                <div className="flex items-center justify-center gap-2 text-champagne-gold mb-4">
                  <Calendar className="w-6 h-6" />
                  <p className="text-sm font-semibold">30 Days Extended</p>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed max-w-xl mx-auto">
                  We have paused the cleanup and will keep your inquiry active for another 30 days. 
                  One of our team will reach out shortly to see if there is anything specific we can help with during this time.
                </p>

                {bookingInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="text-sm text-gray-600 mb-1">
                      <strong className="text-gray-900">{bookingInfo.name}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(bookingInfo.eventDate)} at {bookingInfo.venueName}
                    </p>
                  </motion.div>
                )}

                <div className="pt-6 space-y-3">
                  <Link
                    href="/contact-us"
                    className="inline-block px-6 py-3 bg-champagne-gold text-black font-semibold rounded-lg hover:bg-champagne-gold/90 transition-colors"
                  >
                    Contact Us
                  </Link>
                  <p className="text-sm text-gray-500">
                    or email us at{" "}
                    <a
                      href="mailto:office@stylishentertainment.co.uk"
                      className="text-champagne-gold hover:underline"
                    >
                      office@stylishentertainment.co.uk
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="mx-auto w-16 h-16">
                <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              </div>

              <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-serif text-gray-900">
                  Unable to Process Request
                </h1>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>

                <div className="pt-4 space-y-3">
                  <Link
                    href="/contact-us"
                    className="inline-block px-6 py-3 bg-champagne-gold text-black font-semibold rounded-lg hover:bg-champagne-gold/90 transition-colors"
                  >
                    Contact Us Instead
                  </Link>
                  <p className="text-sm text-gray-500">
                    Email us at{" "}
                    <a
                      href="mailto:office@stylishentertainment.co.uk"
                      className="text-champagne-gold hover:underline"
                    >
                      office@stylishentertainment.co.uk
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <Link
            href="/"
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            ← Back to STYLISH Entertainment
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
