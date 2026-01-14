"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Users, UserPlus, UserCheck, TrendingUp } from "lucide-react";

interface GuestCountTrackerProps {
  bookingId: string;
  initialCount?: number;
  onUpdate?: (count: number) => Promise<void>;
}

export default function GuestCountTracker({
  bookingId,
  initialCount,
  onUpdate,
}: GuestCountTrackerProps) {
  const [expectedGuests, setExpectedGuests] = useState(initialCount || 0);
  const [confirmedGuests, setConfirmedGuests] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialCount) {
      setExpectedGuests(initialCount);
    }
  }, [initialCount]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onUpdate) {
        await onUpdate(expectedGuests);
      } else {
        // Fallback: update via API
        const response = await fetch(`/api/client/bookings/${bookingId}/guests`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedGuests, confirmedGuests }),
        });

        if (!response.ok) {
          throw new Error("Failed to update guest count");
        }
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating guest count:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const pendingCount = expectedGuests - confirmedGuests;
  const confirmationRate = expectedGuests > 0 
    ? Math.round((confirmedGuests / expectedGuests) * 100) 
    : 0;

  return (
    <Card className="bg-gray-800 border-champagne-gold/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-champagne-gold" />
            Guest Count Tracker
          </CardTitle>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Update
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expected" className="text-white">
                Expected Guests
              </Label>
              <Input
                id="expected"
                type="number"
                value={expectedGuests}
                onChange={(e) => setExpectedGuests(parseInt(e.target.value) || 0)}
                min="0"
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmed" className="text-white">
                Confirmed Guests (RSVPs)
              </Label>
              <Input
                id="confirmed"
                type="number"
                value={confirmedGuests}
                onChange={(e) => setConfirmedGuests(parseInt(e.target.value) || 0)}
                min="0"
                max={expectedGuests}
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t border-gray-700">
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-champagne-gold text-black hover:bg-gold-light"
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-gray-900 rounded-lg border border-gray-700"
              >
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="w-5 h-5 text-champagne-gold" />
                  <span className="text-sm text-gray-400">Expected</span>
                </div>
                <div className="text-3xl font-bold text-white">{expectedGuests}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="p-4 bg-gray-900 rounded-lg border border-gray-700"
              >
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-400">Confirmed</span>
                </div>
                <div className="text-3xl font-bold text-green-400">{confirmedGuests}</div>
              </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">RSVP Progress</span>
                <span className="text-champagne-gold font-semibold">{confirmationRate}%</span>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confirmationRate}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-champagne-gold to-yellow-500"
                />
              </div>
            </div>

            {/* Pending Count */}
            {pendingCount > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-yellow-400 font-semibold">
                      {pendingCount} {pendingCount === 1 ? "guest" : "guests"} pending
                    </div>
                    <div className="text-sm text-gray-400">
                      Waiting for RSVP confirmation
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {pendingCount === 0 && expectedGuests > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-green-400" />
                  <div className="text-green-400 font-semibold">
                    All guests confirmed! 🎉
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
