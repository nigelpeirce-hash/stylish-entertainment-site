"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Music, Plus, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const MAX_REQUESTS = 3;
const STORAGE_KEY_PREFIX = "guest_requests_";

export default function GuestRequestPage() {
  const params = useParams();
  const token = params.token as string;
  const { toast } = useToast();
  const [songInput, setSongInput] = useState("");
  const [guestName, setGuestName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingInfo, setBookingInfo] = useState<{ name: string; venueName: string | null } | null>(null);
  const [submissionCount, setSubmissionCount] = useState(0);

  // Get storage key for this token
  const storageKey = token ? `${STORAGE_KEY_PREFIX}${token}` : null;

  // Load from localStorage and fetch booking info
  useEffect(() => {
    if (!token) return;

    // Load from localStorage
    if (storageKey && typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSubmissionCount(parsed.count || 0);
          setGuestName(parsed.guestName || "");
        } catch (e) {
          console.error("Failed to parse localStorage", e);
        }
      }
    }

    // Fetch booking info
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/guest/music/${token}`);
        const data = await res.json();
        if (res.ok) {
          setBookingInfo(data.booking);
        } else {
          setError(data.error || "Invalid link");
        }
      } catch (err) {
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, storageKey]);

  // Save to localStorage whenever count or guestName changes
  useEffect(() => {
    if (storageKey && typeof window !== "undefined") {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          count: submissionCount,
          guestName,
        })
      );
    }
  }, [submissionCount, guestName, storageKey]);

  const canSubmit = submissionCount < MAX_REQUESTS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songInput.trim()) {
      setError("Please enter a song");
      return;
    }
    if (!canSubmit) {
      setError("You've already submitted 3 songs");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/public/bookings/${token}/guest-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          songInput: songInput.trim(),
          guestName: guestName.trim() || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Increment count
        const newCount = submissionCount + 1;
        setSubmissionCount(newCount);

        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#FFD700", "#FFA500"],
        });

        // Show toast
        toast({
          title: "Nice choice!",
          description: "Nigel has been notified.",
          className: "bg-amber-500/10 border-amber-500/30",
        });

        // Clear form
        setSongInput("");
      } else {
        setError(data.error || "Failed to submit request");
      }
    } catch (err) {
      setError("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error && !bookingInfo) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <Card className="bg-gray-800 border-red-500/30 max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h1 className="text-xl font-bold text-white mb-2">Invalid Link</h1>
            <p className="text-gray-400">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-white mb-2">
              Join the Party
            </h1>
            {bookingInfo && (
              <p className="text-2xl text-amber-500 font-semibold">
                {bookingInfo.name}'s Wedding
              </p>
            )}
          </div>

          {/* Search Card */}
          <Card className="bg-white/[0.02] backdrop-blur-md border-white/10 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center">
                  <Music className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              <CardTitle className="text-2xl font-light text-white">
                Request Your Song
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Request Form or Completion Message */}
              {canSubmit ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="songInput" className="text-white mb-2 block">
                      Song Artist & Title *
                    </Label>
                    <Input
                      id="songInput"
                      value={songInput}
                      onChange={(e) => setSongInput(e.target.value)}
                      placeholder="e.g., ABBA - Dancing Queen"
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="guestName" className="text-white mb-2 block">
                      Your Name
                    </Label>
                    <Input
                      id="guestName"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="So the couple knows who to thank"
                      className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500"
                      disabled={submitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting || !songInput.trim()}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-6 text-lg focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-2" />
                        Add to the Party
                      </>
                    )}
                  </Button>

                  {/* Counter Display */}
                  {submissionCount > 0 && (
                    <p className="text-center text-sm text-gray-400">
                      {submissionCount} of {MAX_REQUESTS} songs submitted
                    </p>
                  )}
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 bg-gray-800/50 border-2 border-amber-500/50 rounded-lg text-center"
                >
                  <Sparkles className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-amber-300 mb-2">
                    Vibe Received!
                  </h2>
                  <p className="text-gray-300 text-lg">
                    You've added your 3 tracks. See you on the dancefloor!
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
