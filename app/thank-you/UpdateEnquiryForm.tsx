"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, CheckCircle, X, Loader2 } from "lucide-react";

interface UpdateEnquiryFormProps {
  bookingId: string;
  email: string;
}

export default function UpdateEnquiryForm({ bookingId, email }: UpdateEnquiryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  
  const [eventDate, setEventDate] = useState("");
  const [preferredDJ, setPreferredDJ] = useState("");
  const [additionalMessage, setAdditionalMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    // Validate at least one field is filled
    if (!eventDate && !preferredDJ && !additionalMessage.trim()) {
      setError("Please provide at least one update");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/contact/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          email,
          updates: {
            ...(eventDate && { eventDate }),
            ...(preferredDJ.trim() !== "" && { preferredDJ: preferredDJ.trim() }),
            ...(additionalMessage.trim() && { additionalMessage: additionalMessage.trim() }),
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update enquiry");
      }

      setSuccess(true);
      setEventDate("");
      setPreferredDJ("");
      setAdditionalMessage("");
      
      // Close form after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Update error:", error);
      setError(error instanceof Error ? error.message : "Failed to update enquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <AnimatePresence>
        {!isOpen && !success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <Button
              type="button"
              onClick={() => setIsOpen(true)}
              variant="outline"
              size="lg"
              className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10 flex items-center gap-2 mx-auto"
            >
              <Edit3 className="w-4 h-4" />
              Update Your Enquiry
            </Button>
            <p className="text-xs text-gray-400 mt-2">
              Realised you have the wrong date? Want to change your DJ preference? Add an update here.
            </p>
          </motion.div>
        )}

        {isOpen && !success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <Card className="bg-white/5 backdrop-blur-md border-champagne-gold/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-champagne-gold" />
                    Update Your Enquiry
                  </CardTitle>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setError("");
                      setEventDate("");
                      setPreferredDJ("");
                      setAdditionalMessage("");
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-900/30 border border-red-500/50 rounded-md text-red-400 text-sm"
                    >
                      ⚠ {error}
                    </motion.div>
                  )}

                  <div>
                    <Label htmlFor="eventDate" className="text-gray-200">
                      Corrected Event Date
                    </Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="mt-2 bg-white/5 backdrop-blur-md border-champagne-gold/30 text-white placeholder:text-gray-400 focus:border-champagne-gold focus:ring-1 focus:ring-champagne-gold/50"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Update if you accidentally entered the wrong date
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="preferredDJ" className="text-gray-200">
                      DJ Preference
                    </Label>
                    <Input
                      id="preferredDJ"
                      type="text"
                      value={preferredDJ}
                      onChange={(e) => setPreferredDJ(e.target.value)}
                      placeholder="e.g., DJ Nige, James H DJ, Not sure yet"
                      className="mt-2 bg-white/5 backdrop-blur-md border-champagne-gold/30 text-white placeholder:text-gray-400 focus:border-champagne-gold focus:ring-1 focus:ring-champagne-gold/50"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Change or update your DJ preference
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="additionalMessage" className="text-gray-200">
                      Additional Message
                    </Label>
                    <Textarea
                      id="additionalMessage"
                      value={additionalMessage}
                      onChange={(e) => setAdditionalMessage(e.target.value)}
                      placeholder="Any other updates or clarifications..."
                      className="mt-2 min-h-[100px] bg-white/5 backdrop-blur-md border-champagne-gold/30 text-white placeholder:text-gray-400 focus:border-champagne-gold focus:ring-1 focus:ring-champagne-gold/50"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-champagne-gold text-black hover:bg-gold-light"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </span>
                      ) : (
                        "Submit Update"
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setError("");
                        setEventDate("");
                        setPreferredDJ("");
                        setAdditionalMessage("");
                      }}
                      variant="outline"
                      className="border-champagne-gold/30 text-white hover:bg-champagne-gold/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-center"
          >
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 font-medium">
              Your enquiry has been updated successfully!
            </p>
            <p className="text-sm text-gray-300 mt-1">
              We&apos;ll review your updates and get back to you soon.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
