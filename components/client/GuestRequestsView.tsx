"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Music, 
  Copy, 
  Check, 
  MessageSquare,
  User,
  Loader2,
  Share2,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface GuestRequest {
  id: string;
  guestName: string | null;
  note: string | null;
  trackName: string;
  artistName: string;
  albumArtUrl: string | null;
  spotifyUrl: string | null;
  createdAt: string;
}

interface GuestRequestsViewProps {
  bookingId: string;
  guestRequestToken: string | null;
  guestRequestsEnabled: boolean;
  eventDate: Date;
  baseUrl: string;
  eventPassed: boolean;
  onToggleEnabled?: (enabled: boolean) => Promise<void>;
}

export default function GuestRequestsView({
  bookingId,
  guestRequestToken,
  guestRequestsEnabled,
  eventDate,
  baseUrl,
  eventPassed,
  onToggleEnabled,
}: GuestRequestsViewProps) {
  const [requests, setRequests] = useState<GuestRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [enabled, setEnabled] = useState(guestRequestsEnabled);
  const [toggling, setToggling] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Build shareable link (server-safe: use baseUrl prop, no window)
  const shareableLink = baseUrl && guestRequestToken
    ? `${baseUrl.replace(/\/$/, "")}/requests/${guestRequestToken}`
    : null;

  // Fetch guest requests
  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch(`/api/client/bookings/${bookingId}/guest-requests`);
        if (res.ok) {
          const data = await res.json();
          setRequests(data.requests || []);
        }
      } catch (err) {
        console.error("Failed to fetch guest requests:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [bookingId]);

  // Copy link to clipboard
  const copyLink = async () => {
    if (!shareableLink) return;
    
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = shareableLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Toggle guest requests
  const handleToggle = async () => {
    if (!onToggleEnabled) return;
    
    setToggling(true);
    try {
      await onToggleEnabled(!enabled);
      setEnabled(!enabled);
    } catch (err) {
      console.error("Failed to toggle guest requests:", err);
    } finally {
      setToggling(false);
    }
  };

  // Share via native share API (mobile)
  const shareLink = async () => {
    if (!shareableLink || !navigator.share) return;
    
    try {
      await navigator.share({
        title: "Add your song requests!",
        text: "Help us build the perfect playlist - add your song requests!",
        url: shareableLink,
      });
    } catch (err) {
      // User cancelled or not supported
      copyLink();
    }
  };

  return (
    <Card className="bg-gray-800 border-champagne-gold/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5 text-champagne-gold" />
            Guest Song Requests
          </CardTitle>
          <div className="flex items-center gap-2">
            {eventPassed ? (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Closed (event passed)
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <Label htmlFor="guest-toggle" className="text-sm text-gray-400">
                  {enabled ? "Open" : "Closed"}
                </Label>
                <Switch
                  id="guest-toggle"
                  checked={enabled}
                  onCheckedChange={handleToggle}
                  disabled={toggling || eventPassed}
                />
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Share Link Section - only after mount to avoid hydration mismatch (shareableLink, navigator.share) */}
        {mounted && shareableLink && enabled && !eventPassed && (
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-3">
              Share this link with your guests so they can request songs:
            </p>
            <div className="flex gap-2">
              <Input
                value={shareableLink}
                readOnly
                className="bg-gray-800 border-gray-700 text-white text-sm"
              />
              <Button
                onClick={copyLink}
                variant="outline"
                className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              {typeof navigator !== "undefined" && navigator.share && (
                <Button
                  onClick={shareLink}
                  variant="outline"
                  className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 flex-shrink-0"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Each guest can add up to 3 songs. The link will close automatically after your event.
            </p>
          </div>
        )}

        {/* Requests List */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <Music className="w-4 h-4" />
            {requests.length} request{requests.length !== 1 ? "s" : ""} from your guests
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-champagne-gold animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No song requests yet</p>
              <p className="text-sm">Share the link above with your guests!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              <AnimatePresence>
                {requests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700"
                  >
                    {/* Album Art or Music Icon */}
                    <div className="w-14 h-14 bg-champagne-gold/10 rounded flex items-center justify-center flex-shrink-0">
                      <Music className="w-6 h-6 text-champagne-gold" />
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">
                          {request.trackName}
                        </p>
                        <p className="text-gray-400 text-sm truncate">
                          {request.artistName}
                        </p>
                      </div>

                      {/* Guest Name */}
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 text-champagne-gold">
                          <User className="w-3 h-3" />
                          {request.guestName || "Anonymous"}
                        </span>

                        {/* Note */}
                        {request.note && (
                          <span className="flex items-center gap-1 text-gray-400">
                            <MessageSquare className="w-3 h-3" />
                            &quot;{request.note}&quot;
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
