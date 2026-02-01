"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Music, 
  Plus, 
  Trash2, 
  Heart,
  Calendar,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface MyRequest {
  id: string;
  trackName: string;
  artistName: string;
  guestName: string | null;
  note: string | null;
}

const MAX_SONGS = 3;

// Demo data
const DEMO_BOOKING = {
  coupleName: "Sarah & James",
  eventDate: "Saturday, 15th March 2025",
  eventType: "Wedding",
  venueName: "Babington House",
};

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

export default function DemoGuestRequestPage() {
  const [myRequests, setMyRequests] = useState<MyRequest[]>([]);
  const [totalRequests, setTotalRequests] = useState(7); // Simulate other guests have added songs
  
  // Manual entry state
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [note, setNote] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  // Fire confetti on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      fireConfetti();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Submit request (demo - just adds to local state)
  const submitRequest = () => {
    if (!songName.trim() || !artistName.trim()) {
      alert("Please enter both the song name and artist.");
      return;
    }
    
    const newRequest: MyRequest = {
      id: `demo-${Date.now()}`,
      trackName: songName.trim(),
      artistName: artistName.trim(),
      guestName: guestName.trim() || null,
      note: note.trim() || null,
    };
    
    setMyRequests([newRequest, ...myRequests]);
    setTotalRequests(totalRequests + 1);
    
    // Reset form
    setSongName("");
    setArtistName("");
    setGuestName("");
    setNote("");
    
    // Show thank you if all slots used
    if (myRequests.length + 1 >= MAX_SONGS) {
      setShowThankYou(true);
    }
  };

  // Remove request
  const removeRequest = (requestId: string) => {
    setMyRequests(myRequests.filter(r => r.id !== requestId));
    setTotalRequests(totalRequests - 1);
    setShowThankYou(false);
  };

  const remainingSlots = MAX_SONGS - myRequests.length;
  const canAddMore = remainingSlots > 0;

  // Thank You View
  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Demo Banner */}
        <div className="bg-champagne-gold text-black text-center py-2 px-4 text-sm font-medium">
          🎭 DEMO MODE - This is a preview of the guest song request feature
        </div>

        <header className="pt-12 pb-8 px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-champagne-gold to-yellow-500 flex items-center justify-center"
          >
            <CheckCircle2 className="w-10 h-10 text-black" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Thank You!
            </h1>
            <p className="text-gray-300 text-lg max-w-md mx-auto">
              Your song requests have been added to {DEMO_BOOKING.coupleName}&apos;s playlist.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex items-center justify-center gap-2 text-champagne-gold"
          >
            <Heart className="w-4 h-4" />
            <span className="text-sm">We can&apos;t wait to play them!</span>
            <Heart className="w-4 h-4" />
          </motion.div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-2">
              Planning Your Own Celebration?
            </h2>
            <p className="text-gray-400">
              We&apos;d love to help make it unforgettable.
            </p>
          </motion.div>

          <div className="space-y-4">
            <Link href="/artists/djs">
              <Card className="bg-gradient-to-r from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:scale-[1.02] transition-transform cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-900/50 flex items-center justify-center flex-shrink-0">
                    <Music className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold">Professional DJs</h3>
                    <p className="text-gray-400 text-sm">Expert DJs who read the room and keep the dance floor packed.</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/services/lighting-design">
              <Card className="bg-gradient-to-r from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:scale-[1.02] transition-transform cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-900/50 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold">Lighting Design</h3>
                    <p className="text-gray-400 text-sm">Transform any venue with stunning lighting.</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/contact-us">
              <Button className="w-full bg-champagne-gold text-black hover:bg-gold-light font-semibold py-6 text-lg mt-4">
                Get a Free Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowThankYou(false)}
              className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
            >
              ← Back to song requests
            </button>
          </div>
        </main>

        {/* Brand Footer */}
        <footer className="border-t border-gray-800 py-8 px-4 mt-8">
          <div className="max-w-lg mx-auto text-center">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png"
                alt="Stylish Entertainment Ltd"
                width={180}
                height={56}
                className="mx-auto brightness-[1.2]"
              />
            </Link>
            <p className="text-gray-400 text-sm mb-2">
              Professional Wedding DJs, Lighting Design & Venue Styling
            </p>
            <p className="text-gray-500 text-xs">
              South West • London • UK-wide
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Demo Banner */}
      <div className="bg-champagne-gold text-black text-center py-2 px-4 text-sm font-medium">
        🎭 DEMO MODE - This is a preview of the guest song request feature
      </div>

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
            {DEMO_BOOKING.coupleName}&apos;s {DEMO_BOOKING.eventType}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {DEMO_BOOKING.eventDate}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {DEMO_BOOKING.venueName}
            </span>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pb-8">
        {/* My Requests */}
        {myRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-champagne-gold" />
              Your Requests ({myRequests.length}/{MAX_SONGS})
            </h2>
            <div className="space-y-2">
              {myRequests.map((req) => (
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
                  disabled={!songName.trim() || !artistName.trim()}
                  className="w-full bg-champagne-gold text-black hover:bg-gold-light font-semibold disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
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
                onClick={() => setShowThankYou(true)}
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
            {totalRequests} song{totalRequests !== 1 ? "s" : ""} requested so far
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
          <Link href="/" className="inline-block mb-6">
            <Image
              src="https://res.cloudinary.com/drtwveoqo/image/upload/f_auto,q_auto/v1768162584/Rev-New-SE-Logo0_ow03mn.png"
              alt="Stylish Entertainment Ltd"
              width={200}
              height={62}
              className="mx-auto brightness-[1.2]"
            />
          </Link>
          <h3 className="text-white text-xl font-bold mb-3">
            Professional Wedding DJs & Lighting Design
          </h3>
          <p className="text-champagne-gold text-lg font-medium mb-6">
            South West • London • UK-wide
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact-us"
              className="bg-champagne-gold text-black px-6 py-3 rounded-full text-base font-semibold hover:bg-gold-light transition-colors"
            >
              Planning your own event?
            </Link>
            <Link
              href="/galleries"
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
