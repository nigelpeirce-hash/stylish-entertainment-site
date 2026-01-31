"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, ImagePlus, Trash2 } from "lucide-react";
import PortalCountdownClock from "@/components/client/PortalCountdownClock";
import confetti from "canvas-confetti";

const STORAGE_KEY = "portal-hero-demo-photo";
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const EVENT_TIPS: Record<string, string> = {
  wedding: "Don't forget to break in your wedding shoes!",
  party: "Have a backup plan for outdoor photos.",
  corporate: "Assign someone to coordinate vendor arrivals.",
};

const UPLOAD_COPY: Record<string, string> = {
  wedding: "Add a photo of you both or your venue",
  party: "Add a venue photo or a photo of your event",
  corporate: "Add a venue photo or a photo of your event",
};

export default function ClientPortalHeroDemoPage() {
  const { status } = useSession();
  const router = useRouter();
  const confettiTriggered = useRef(false);
  const [eventType, setEventType] = useState<"wedding" | "party" | "corporate">("wedding");
  const [heroPhoto, setHeroPhoto] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
  });
  const [simulateSecured, setSimulateSecured] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
  }, [status, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (heroPhoto) {
      localStorage.setItem(STORAGE_KEY, heroPhoto);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [heroPhoto]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Please upload a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      alert("Image must be under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setHeroPhoto(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const handleRemovePhoto = useCallback(() => setHeroPhoto(null), []);

  // Confetti: Wedding only, when simulate secured
  useEffect(() => {
    if (
      eventType === "wedding" &&
      simulateSecured &&
      !confettiTriggered.current
    ) {
      const confettiKey = "confetti_shown_portal_hero_demo";
      if (sessionStorage.getItem(confettiKey)) {
        confettiTriggered.current = true;
        return;
      }
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#d4af37", "#f4cf6d", "#ffffff"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#d4af37", "#f4cf6d", "#ffffff"],
        });
      }, 250);
      sessionStorage.setItem(confettiKey, "true");
      confettiTriggered.current = true;
    }
  }, [eventType, simulateSecured]);

  const eventDate = new Date("2025-06-15");

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-champagne-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-6 px-4 sm:px-6"
      style={{
        background:
          "radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)",
      }}
    >
      <div className="container mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-champagne-gold hover:underline text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to admin
        </Link>

        <div className="mb-4 p-3 bg-gray-800/50 border border-champagne-gold/30 rounded-xl">
          <h2 className="text-base font-semibold text-white mb-2">Demo controls</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <span className="text-gray-400 text-sm mr-2">Event type:</span>
              <select
                value={eventType}
                onChange={(e) =>
                  setEventType(e.target.value as "wedding" | "party" | "corporate")
                }
                className="px-3 py-2 bg-gray-900 border border-champagne-gold/40 rounded-lg text-white text-sm"
              >
                <option value="wedding">Wedding</option>
                <option value="party">Party</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-gray-400 text-sm">
              <input
                type="checkbox"
                checked={simulateSecured}
                onChange={(e) => setSimulateSecured(e.target.checked)}
              />
              Simulate deposit secured (wedding-only confetti)
            </label>
          </div>
        </div>

        {/* Unified Countdown + Hero Card – same width, cohesive unit */}
        <section className="max-w-5xl mx-auto rounded-xl border border-champagne-gold/40 bg-gray-800/80 backdrop-blur-md overflow-hidden">
          {/* Countdown – same width as hero, directly above */}
          <div className="w-full px-5 py-6 border-b border-champagne-gold/20 bg-gray-800/60">
            <PortalCountdownClock targetDate={eventDate} className="w-full" />
          </div>

          {/* Hero content – same width, matching styles */}
          <div className="relative w-full p-5 bg-gray-800/40">
          {heroPhoto && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm"
              style={{ backgroundImage: `url(${heroPhoto})` }}
            />
          )}
          {!heroPhoto && (
            <div className="absolute top-0 right-0 w-64 h-64 bg-champagne-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          )}
          <div className="relative">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-champagne-gold" />
                <span className="text-champagne-gold/80 text-sm font-medium uppercase tracking-wider">
                  {eventType.charAt(0).toUpperCase() + eventType.slice(1)}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-1">
                {eventType.charAt(0).toUpperCase() + eventType.slice(1)}
              </h2>
              <p className="text-gray-300 mb-1">
                <strong className="text-gray-400">Date:</strong>{" "}
                {eventDate.toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-gray-300 mb-1">
                <strong className="text-gray-400">Venue:</strong> Priston Mill
              </p>
              <p className="text-gray-300 mb-1">
                <strong className="text-gray-400">Status:</strong>{" "}
                <span className="capitalize font-medium text-green-400">
                  confirmed
                </span>
              </p>
                <p className="text-sm text-champagne-gold mt-1.5 italic">
                {EVENT_TIPS[eventType]}
              </p>
            </div>

            {/* Upload / Remove photo */}
            <div className="relative mt-4 pt-3 border-t border-champagne-gold/20">
              {heroPhoto ? (
                <div className="w-full">
                  <div className="w-64 h-64 rounded-lg overflow-hidden border border-champagne-gold/40 bg-gray-900/50 flex-shrink-0">
                    <img
                      src={heroPhoto}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemovePhoto}
                    className="mt-3 border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove photo
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400 text-sm mb-2">
                    {UPLOAD_COPY[eventType]}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
                  >
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Upload photo
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        </section>

        <p className="text-center text-gray-500 text-xs mt-4">
          Client Portal Hero Demo – Sarah & Tim at Priston Mill
        </p>
      </div>
    </div>
  );
}
