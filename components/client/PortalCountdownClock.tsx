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

const MS_PER_SEC = 1000;
const MS_PER_MIN = MS_PER_SEC * 60;
const MS_PER_HOUR = MS_PER_MIN * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const MS_PER_MONTH = MS_PER_DAY * 30.44; // ~avg days per month
const MS_PER_YEAR = MS_PER_DAY * 365.25; // leap-year adjusted

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
      remaining -= minutes * MS_PER_MIN;
      const seconds = Math.floor(remaining / MS_PER_SEC);

      setTime({ years, months, days, hours, minutes, seconds, total: diff });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const pad = (n: number, len = 2) => n.toString().padStart(len, "0");

  const units: { key: string; value: number; label: string }[] = [
    { key: "y", value: time.years, label: "YRS" },
    { key: "mo", value: time.months, label: "MTH" },
    { key: "d", value: time.days, label: "DAYS" },
    { key: "h", value: time.hours, label: "HRS" },
    { key: "m", value: time.minutes, label: "MIN" },
    { key: "s", value: time.seconds, label: "SEC" },
  ];

  if (time.total <= 0) {
    return (
      <div className={`portal-countdown-retro ${className}`}>
        <div className="portal-countdown-retro__bezel">
          <div className="portal-countdown-retro__scanlines" />
          <div className="portal-countdown-retro__label">TIME REMAINING</div>
          <div className="portal-countdown-retro__display portal-countdown-retro__display--expired">
            {units.flatMap((u, i) => [
              <span key={u.key} className="portal-countdown-retro__digit">00</span>,
              ...(i < units.length - 1 ? [<span key={`${u.key}-col`} className="portal-countdown-retro__colon">:</span>] : []),
            ])}
          </div>
          <div className="portal-countdown-retro__message">TODAY IS THE DAY</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`portal-countdown-retro ${className}`}>
      <div className="portal-countdown-retro__bezel">
        <div className="portal-countdown-retro__scanlines" />
        <div className="portal-countdown-retro__label">TIME REMAINING</div>
        <div className="portal-countdown-retro__display" data-units={units.length}>
          {units.flatMap((u, i) => [
            <div key={u.key} className="portal-countdown-retro__unit">
              <motion.span
                key={`${u.key}-${u.value}`}
                className="portal-countdown-retro__digit"
                initial={{ scale: 1.05, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {u.value < 100 ? pad(u.value) : pad(u.value, 3)}
              </motion.span>
              <span className="portal-countdown-retro__unit-label">{u.label}</span>
            </div>,
            ...(i < units.length - 1 ? [<span key={`${u.key}-col`} className="portal-countdown-retro__colon">:</span>] : []),
          ])}
        </div>
      </div>
    </div>
  );
}
