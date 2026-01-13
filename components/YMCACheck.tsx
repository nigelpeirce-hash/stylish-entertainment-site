"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, X, CheckCircle, Sparkles } from "lucide-react";
import { isBanned } from "@/lib/bannedSongs";
import { motion } from "framer-motion";

const STORAGE_KEY_YMCA_CHECKED = "stylishentertainment_ymca_checked";
const STORAGE_KEY_YMCA_BLOCKED = "stylishentertainment_ymca_blocked";
const STORAGE_KEY_WELCOME_SHOWN = "stylishentertainment_welcome_shown";

// Demo mode - set to true to disable actual blocking (users can still see the site)
const DEMO_MODE = true;

export default function YMCACheck() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showBlockMessage, setShowBlockMessage] = useState(false);
  const [songInput, setSongInput] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // In demo mode, clear any existing blocks
    if (DEMO_MODE) {
      localStorage.removeItem(STORAGE_KEY_YMCA_BLOCKED);
    }

    // Check if prompt has been shown before
    const checked = localStorage.getItem(STORAGE_KEY_YMCA_CHECKED);
    if (checked === "true") {
      return;
    }

    // Show prompt after 7 seconds
    const timer = setTimeout(() => {
      setShowPrompt(true);
      setIsOpen(true);
    }, 7000); // 7 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSongChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSongInput(e.target.value);
  };

  const handleSubmit = () => {
    const song = songInput.trim();
    
    // Check if the song/artist is on the banned list
    if (isBanned(song)) {
      localStorage.setItem(STORAGE_KEY_YMCA_CHECKED, "true");
      setIsOpen(false);
      
      if (DEMO_MODE) {
        // In demo mode, just show a message but don't block
        setShowBlockMessage(true);
        setTimeout(() => {
          setShowBlockMessage(false);
        }, 5000);
      } else {
        // In production mode, actually block them
        localStorage.setItem(STORAGE_KEY_YMCA_BLOCKED, "true");
        setIsBlocked(true);
      }
    } else {
      // They passed! Welcome them
      localStorage.setItem(STORAGE_KEY_YMCA_CHECKED, "true");
      localStorage.setItem(STORAGE_KEY_WELCOME_SHOWN, "true");
      setIsOpen(false);
      setShowWelcome(true);
      // Hide welcome after 5 seconds
      setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY_YMCA_CHECKED, "true");
    setIsOpen(false);
  };

  // Show block message (demo mode - non-blocking)
  if (showBlockMessage) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gray-900/95 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="max-w-2xl mx-auto text-center space-y-4 bg-gray-800/95 border-2 border-red-500/50 rounded-lg p-8 shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-red-400 mb-2">
            Oops! That Song is Banned
          </h2>
          <p className="text-xl md:text-2xl text-gray-300">
            You may have been blocked if you entered the wrong track/artist.
          </p>
          <p className="text-gray-400 mt-4">
            (Demo mode: You can still browse the site)
          </p>
        </motion.div>
      </div>
    );
  }

  // If blocked (production mode only), show the block screen
  if (isBlocked && !DEMO_MODE) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-champagne-gold mb-4">
              Sorry, We're Permanently Booked
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Unfortunately, we're fully booked until you develop better musical taste.
            </p>
            <p className="text-lg text-gray-400 mt-6">
              You may have been banned if you entered the wrong track/artist.
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-champagne-gold/20">
            <p className="text-sm text-gray-500">
              In all seriousness, we're always happy to discuss your event. 
              Just maybe reconsider your musical choices? 😉
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show welcome message with celebration animation if they passed
  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gray-900/95 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-none overflow-hidden">
        {/* Confetti/Sparkle Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {typeof window !== 'undefined' && [...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                y: -20,
                opacity: 1,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
                opacity: [1, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                delay: Math.random() * 0.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 1,
              }}
            >
              <Sparkles className="w-4 h-4 text-champagne-gold" />
            </motion.div>
          ))}
        </div>

        {/* Main Welcome Card */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            duration: 0.8,
          }}
          className="max-w-2xl mx-auto text-center space-y-4 bg-gray-800/95 border-2 border-champagne-gold/50 rounded-lg p-8 shadow-2xl relative z-10"
        >
          {/* Pulsing glow effect */}
          <motion.div
            className="absolute inset-0 rounded-lg bg-champagne-gold/20"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="relative z-10"
          >
            <CheckCircle className="w-20 h-20 text-champagne-gold mx-auto mb-4 drop-shadow-lg" />
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-champagne-gold mb-2 relative z-10"
          >
            Welcome to Stylish Entertainment
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-2xl md:text-3xl text-white font-semibold relative z-10"
          >
            You're part of us now! 🎉
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-gray-300 mt-4 text-lg relative z-10"
          >
            Great musical taste! We'd love to work with you.
          </motion.p>

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-champagne-gold rounded-full"
              initial={{
                x: "50%",
                y: "50%",
                opacity: 0,
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 100}%`,
                y: `${50 + (Math.random() - 0.5) * 100}%`,
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 1,
                repeat: Infinity,
                repeatDelay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  // Show prompt dialog
  if (!showPrompt) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !localStorage.getItem(STORAGE_KEY_YMCA_CHECKED)) {
        handleSkip();
      }
      setIsOpen(open);
    }}>
      <DialogContent className="bg-gray-800 border-champagne-gold/30 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-champagne-gold">
            <Music className="w-5 h-5" />
            Quick Question
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            What's your favourite song to request at events?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="favourite-song" className="text-gray-200">
              Favourite Song
            </Label>
            <Input
              id="favourite-song"
              type="text"
              value={songInput}
              onChange={handleSongChange}
              placeholder="Enter song name..."
              className="bg-gray-700 border-gray-600 text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter" && songInput.trim()) {
                  handleSubmit();
                }
              }}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!songInput.trim()}
              className="bg-champagne-gold hover:bg-champagne-gold/90 text-gray-900"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
