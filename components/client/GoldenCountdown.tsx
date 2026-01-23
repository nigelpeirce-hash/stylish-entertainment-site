"use client";

import { useState, useEffect } from "react";

interface GoldenCountdownProps {
  ceremonyTime?: Date | string | null;
  eventDate: Date | string;
  greetingName?: string;
}

export default function GoldenCountdown({
  ceremonyTime,
  eventDate,
  greetingName,
}: GoldenCountdownProps) {
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    hasPassed: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, hasPassed: false });
  const [isShimmering, setIsShimmering] = useState(false);

  useEffect(() => {
    const calculateCountdown = () => {
      // Determine target date: use ceremonyTime if available, otherwise eventDate at 14:00
      let targetDate: Date;

      if (ceremonyTime) {
        targetDate = typeof ceremonyTime === "string" 
          ? new Date(ceremonyTime) 
          : ceremonyTime;
      } else {
        // Fallback to eventDate at 14:00 (2 PM)
        const eventDateObj = typeof eventDate === "string" 
          ? new Date(eventDate) 
          : eventDate;
        
        // Create a new date with the event date but set time to 14:00
        targetDate = new Date(eventDateObj);
        targetDate.setHours(14, 0, 0, 0);
      }

      // Get current time
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, hasPassed: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds, hasPassed: false });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [ceremonyTime, eventDate]);

  // Shimmer animation every 10 seconds
  useEffect(() => {
    const shimmerInterval = setInterval(() => {
      setIsShimmering(true);
      setTimeout(() => setIsShimmering(false), 1000); // Shimmer for 1 second
    }, 10000); // Every 10 seconds

    return () => clearInterval(shimmerInterval);
  }, []);

  if (countdown.hasPassed) {
    return null; // Don't show countdown if event has passed
  }

  return (
    <div className="w-full">
      {/* WEDDING Badge Header */}
      <div className="text-center mb-8">
        <span className="border border-amber-500/40 text-amber-500 text-[10px] uppercase tracking-[0.4em] px-4 py-1 rounded-full inline-block">
          WEDDING
        </span>
      </div>

      {/* 4-Column Grid Countdown */}
      <div className="grid grid-cols-4 gap-0 relative">
        {/* Days */}
        <div className="relative">
          <div className="text-center">
            <div className={`text-amber-500 font-extralight text-6xl md:text-8xl leading-none transition-all duration-1000 ${
              isShimmering ? 'animate-shimmer' : ''
            }`}>
              {countdown.days.toString().padStart(2, "0")}
            </div>
            <div className="text-white/30 text-[10px] uppercase tracking-[0.3em] mt-2">
              DAYS
            </div>
          </div>
          {/* Right separator */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-amber-500/20" />
        </div>

        {/* Hours */}
        <div className="relative">
          <div className="text-center">
            <div className={`text-amber-500 font-extralight text-6xl md:text-8xl leading-none transition-all duration-1000 ${
              isShimmering ? 'animate-shimmer' : ''
            }`}>
              {countdown.hours.toString().padStart(2, "0")}
            </div>
            <div className="text-white/30 text-[10px] uppercase tracking-[0.3em] mt-2">
              HOURS
            </div>
          </div>
          {/* Right separator */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-amber-500/20" />
        </div>

        {/* Minutes */}
        <div className="relative">
          <div className="text-center">
            <div className={`text-amber-500 font-extralight text-6xl md:text-8xl leading-none transition-all duration-1000 ${
              isShimmering ? 'animate-shimmer' : ''
            }`}>
              {countdown.minutes.toString().padStart(2, "0")}
            </div>
            <div className="text-white/30 text-[10px] uppercase tracking-[0.3em] mt-2">
              MINS
            </div>
          </div>
          {/* Right separator */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-amber-500/20" />
        </div>

        {/* Seconds */}
        <div className="text-center">
          <div className={`text-amber-500 font-extralight text-6xl md:text-8xl leading-none transition-all duration-1000 ${
            isShimmering ? 'animate-[shimmer_1s_ease-in-out]' : ''
          }`}>
            {countdown.seconds.toString().padStart(2, "0")}
          </div>
          <div className="text-white/30 text-[10px] uppercase tracking-[0.3em] mt-2">
            SECS
          </div>
        </div>
      </div>

      {/* Greeting Text */}
      {greetingName && (
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm md:text-base italic font-serif">
            Until the celebration of {greetingName}
          </p>
        </div>
      )}
    </div>
  );
}
