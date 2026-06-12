"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "@/lib/motion";
import confetti from "canvas-confetti";
import { 
  Music, 
  Plus, 
  Trash2, 
  Loader2, 
  Heart,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

// Confetti burst function
const fireConfetti = () => {
  // Left side burst
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { x: 0.1, y: 0.6 },
    colors: ['#D4AF37', '#FFD700', '#FFF8DC', '#FFFFFF', '#F5DEB3'],
  });
  
  // Right side burst
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { x: 0.9, y: 0.6 },
    colors: ['#D4AF37', '#FFD700', '#FFF8DC', '#FFFFFF', '#F5DEB3'],
  });
  
  // Center top cascade
  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 100,
      origin: { x: 0.5, y: 0.3 },
      colors: ['#D4AF37', '#FFD700', '#FFF8DC', '#FFFFFF'],
    });
  }, 200);
};

interface MyRequest {
  id: string;
  trackName: string;
  artistName: string;
  albumArtUrl: string | null;
  guestName: string | null;
  note: string | null;
}

interface BookingInfo {
  coupleName: string;
  eventDate: string;
  eventType: string;
  venueName: string;
  totalRequests: number;
  myRequests: MyRequest[];
}

const MAX_SONGS = 3;

export default function GuestRequestPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const confettiFired = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  
  // Manual entry state
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch booking info
  useEffect(() => {
    async function fetchBookingInfo() {
      try {
        const res = await fetch(`/api/guest-requests/${token}/`);
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.error || "Something went wrong");
          return;
        }
        
        setBookingInfo(data);
        
        // Fire confetti on successful load (only once)
        if (!confettiFired.current) {
          confettiFired.current = true;
          setTimeout(() => fireConfetti(), 300);
        }
      } catch (err) {
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    if (token) {
      fetchBookingInfo();
    }
  }, [token]);

  // Submit request
  const submitRequest = async () => {
    if (!songName.trim() || !artistName.trim() || !bookingInfo) {
      alert("Please enter both the song name and artist.");
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/guest-requests/${token}/songs/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackName: songName.trim(),
          artistName: artistName.trim(),
          guestName: guestName.trim() || null,
          note: note.trim() || null,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || "Failed to add song");
        return;
      }
      
      // Update local state
      setBookingInfo({
        ...bookingInfo,
        myRequests: [data.request, ...bookingInfo.myRequests],
        totalRequests: bookingInfo.totalRequests + 1,
      });
      
      // Reset form
      setSongName("");
      setArtistName("");
      setGuestName("");
      setNote("");
      
      // Redirect to thank you page if all slots used
      if (bookingInfo.myRequests.length + 1 >= MAX_SONGS) {
        router.push(`/requests/${token}/thank-you/`);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Remove request
  const removeRequest = async (requestId: string) => {
    if (!bookingInfo) return;
    
    try {
      const res = await fetch(`/api/guest-requests/${token}/songs/?id=${requestId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setBookingInfo({
          ...bookingInfo,
          myRequests: bookingInfo.myRequests.filter(r => r.id !== requestId),
          totalRequests: bookingInfo.totalRequests - 1,
        });
      }
    } catch (err) {
      console.error("Failed to remove request:", err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-champagne-gold animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md bg-gray-800/50 border-red-500/30">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-white mb-2">Oops!</h1>
            <p className="text-gray-400">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bookingInfo) return null;

  const remainingSlots = MAX_SONGS - bookingInfo.myRequests.length;
  const canAddMore = remainingSlots > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="pt-8 pb-6 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music className="w-6 h-6 text-champagne-gold" />
            <span className="text-champagne-gold text-sm font-medium tracking-wider uppercase">
              Song Requests
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {bookingInfo.coupleName}&apos;s {bookingInfo.eventType}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {bookingInfo.eventDate}
            </span>
            {bookingInfo.venueName && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {bookingInfo.venueName}
              </span>
            )}
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pb-8">
        {/* My Requests */}
        {bookingInfo.myRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-champagne-gold" />
              Your Requests ({bookingInfo.myRequests.length}/{MAX_SONGS})
            </h2>
            <div className="space-y-2">
              {bookingInfo.myRequests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-champagne-gold/20"
                >
                  <div className="w-12 h-12 rounded bg-champagne-gold/20 flex items-center justify-center flex-shrink-0">
                    <Music className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{req.trackName}</p>
                    <p className="text-gray-400 text-sm truncate">{req.artistName}</p>
                    {req.note && (
                      <p className="text-champagne-gold text-xs mt-1 truncate">
                        &quot;{req.note}&quot;
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRequest(req.id)}
                    className="text-gray-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Add Song Section */}
        {canAddMore ? (
          <Card className="bg-gray-800/50 border-champagne-gold/30">
            <CardContent className="p-6">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-champagne-gold" />
                Add a Song ({remainingSlots} remaining)
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="songName" className="text-gray-300 text-sm">
                    Song Name *
                  </Label>
                  <Input
                    id="songName"
                    placeholder="e.g. Blinding Lights"
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                    className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="artistName" className="text-gray-300 text-sm">
                    Artist *
                  </Label>
                  <Input
                    id="artistName"
                    placeholder="e.g. The Weeknd"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    maxLength={100}
                  />
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <Label htmlFor="guestName" className="text-gray-300 text-sm">
                    Your Name (optional)
                  </Label>
                  <Input
                    id="guestName"
                    placeholder="e.g. Uncle Frank"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    maxLength={50}
                  />
                </div>

                <div>
                  <Label htmlFor="note" className="text-gray-300 text-sm">
                    Note for the DJ (optional)
                  </Label>
                  <Input
                    id="note"
                    placeholder="e.g. Play this for the bride's dad!"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                    maxLength={100}
                  />
                </div>

                <Button
                  onClick={submitRequest}
                  disabled={submitting || !songName.trim() || !artistName.trim()}
                  className="w-full bg-champagne-gold text-black hover:bg-gold-light font-semibold disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Add to Playlist
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* All slots used */
          <Card className="bg-green-900/20 border-green-500/30">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h2 className="text-white font-semibold mb-2">All Done!</h2>
              <p className="text-gray-400 text-sm mb-4">
                You&apos;ve added your {MAX_SONGS} song requests.
              </p>
              <Button
                onClick={() => router.push(`/requests/${token}/thank-you/`)}
                className="bg-champagne-gold text-black hover:bg-gold-light"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            {bookingInfo.totalRequests} song{bookingInfo.totalRequests !== 1 ? "s" : ""} requested so far
          </p>
        </div>
      </main>

      {/* Brand Footer */}
      <footer className="border-t border-champagne-gold/30 py-12 px-4 mt-8 bg-black">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-champagne-gold text-sm uppercase tracking-widest mb-5 flex items-center justify-center gap-2 font-medium">
            <Sparkles className="w-4 h-4" />
            Powered by
            <Sparkles className="w-4 h-4" />
          </p>
          <Link href="/" className="inline-block mb-6 text-center">
            <span className="block font-serif text-2xl font-bold text-champagne-gold">Stylish</span>
            <span className="block font-sans text-lg font-medium text-white/90 mt-0.5 tracking-wide">Entertainment</span>
          </Link>
          <h3 className="text-white text-xl font-bold mb-3">
            Professional Wedding DJs & Lighting Design
          </h3>
          <p className="text-champagne-gold text-lg font-medium mb-6">
            South West • London • UK-wide
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact-us/"
              className="bg-champagne-gold text-black px-6 py-3 rounded-full text-base font-semibold hover:bg-gold-light transition-colors"
            >
              Planning your own event?
            </Link>
            <Link
              href="/galleries/"
              className="bg-white text-black px-6 py-3 rounded-full text-base font-semibold hover:bg-gray-200 transition-colors"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
