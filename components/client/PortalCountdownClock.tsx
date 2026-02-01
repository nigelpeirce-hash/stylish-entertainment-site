"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface PortalCountdownClockProps {
  targetDate: Date;
  className?: string;
}

interface TimeRemaining {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const MS_PER_MIN = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MIN;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const MS_PER_MONTH = MS_PER_DAY * 30.44;
const MS_PER_YEAR = MS_PER_DAY * 365.25;

export default function PortalCountdownClock({ targetDate, className = "" }: PortalCountdownClockProps) {
  const [time, setTime] = useState<TimeRemaining>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTime({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        return;
      }

      let remaining = diff;
      const years = Math.floor(remaining / MS_PER_YEAR);
      remaining -= years * MS_PER_YEAR;
      const months = Math.floor(remaining / MS_PER_MONTH);
      remaining -= months * MS_PER_MONTH;
      const days = Math.floor(remaining / MS_PER_DAY);
      remaining -= days * MS_PER_DAY;
      const hours = Math.floor(remaining / MS_PER_HOUR);
      remaining -= hours * MS_PER_HOUR;
      const minutes = Math.floor(remaining / MS_PER_MIN);

      setTime({ years, months, days, hours, minutes, seconds: 0, total: diff });
    };

    tick();
    const interval = setInterval(tick, MS_PER_MIN);
    return () => clearInterval(interval);
  }, [targetDate]);

  const totalDays = time.years * 365 + time.months * 30 + time.days;
  const journeyProgress = Math.min(1, 1 - totalDays / 365);
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference * (1 - journeyProgress);

  // Milestone copy — playful, celebratory
  const getMilestoneCopy = () => {
    if (totalDays >= 60) return { headline: "Your playlist is nearly ready 🎶", sub: "Plenty of time — enjoy planning" };
    if (totalDays >= 30) return { headline: "Your playlist is taking shape 🎶", sub: "Almost a month to go" };
    if (totalDays >= 7) return { headline: "1 week to go — let the dance floor prep begin 💃", sub: "Everything's on track" };
    if (totalDays >= 2) return { headline: "Just days away — almost time to dance! ✨", sub: "Final countdown" };
    if (totalDays === 1) return { headline: "1 day to go — tomorrow's the big day! 🎉", sub: "Get some rest" };
    return { headline: "Today is the day 🎊", sub: "Let's go!" };
  };
  const milestone = totalDays > 0 ? getMilestoneCopy() : null;

  if (time.total <= 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`flex flex-col items-center justify-center py-8 px-4 ${className}`}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-champagne-gold/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-48 h-48 rounded-full border-2 border-champagne-gold/50 flex items-center justify-center bg-gradient-to-br from-champagne-gold/5 to-transparent">
            <span className="text-4xl md:text-5xl font-light text-champagne-gold tracking-tight">Today</span>
          </div>
        </div>
        <p className="mt-6 text-xl md:text-2xl font-light text-white/90">Today is the day</p>
        <p className="mt-2 text-sm text-white/50">Enjoy every moment</p>
      </motion.div>
    );
  }

  const displayDays = totalDays > 999 ? 999 : totalDays;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex flex-col items-center justify-center py-6 px-4 ${className}`}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-champagne-gold/10 rounded-full blur-3xl scale-150 opacity-60" />
        <svg className="relative w-56 h-56 md:w-64 md:h-64 -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white/5"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#countdown-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="countdown-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#d4af37" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f4cf6d" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={displayDays}
            initial={{ scale: 0.92, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-6xl md:text-7xl lg:text-8xl font-extralight text-white tabular-nums tracking-tight"
          >
            {displayDays}
          </motion.span>
          <span className="text-xs uppercase tracking-[0.35em] text-white/40 font-medium mt-1">
            {displayDays === 1 ? "day" : "days"}
          </span>
        </div>
      </div>

      <motion.p
        key={milestone?.headline ?? "default"}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6 text-lg md:text-xl font-light text-white/90 tracking-wide text-center"
      >
        {milestone?.headline ?? "Until you say I do"}
      </motion.p>

      <p className="mt-3 text-sm text-white/40 font-light">
        {time.hours}h {time.minutes}m to go
      </p>

      {milestone?.sub && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 text-xs uppercase tracking-widest text-champagne-gold/70"
        >
          {milestone.sub}
        </motion.p>
      )}
    </motion.div>
  );
}
