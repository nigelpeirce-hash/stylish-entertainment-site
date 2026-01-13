"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownClockProps {
  targetDate: Date;
}

interface TimeRemaining {
  years: number;
  halfYears: number; // 0 or 0.5
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export default function CountdownClock({ targetDate }: CountdownClockProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    years: 0,
    halfYears: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const totalDays = difference / (1000 * 60 * 60 * 24);
        const years = Math.floor(totalDays / 365);
        const remainingDaysAfterYears = totalDays % 365;
        const halfYears = remainingDaysAfterYears >= 182.5 ? 0.5 : 0; // 0.5 if more than half a year remains
        
        const days = Math.floor(totalDays % 365);
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({
          years,
          halfYears,
          days,
          hours,
          minutes,
          seconds,
          total: difference,
        });
      } else {
        setTimeRemaining({
          years: 0,
          halfYears: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
        });
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  if (timeRemaining.total <= 0) {
    return (
      <div className="countdown-clock expired">
        <div className="digital-display">
          <div className="digit-group">
            <span className="digit">0</span>
            <span className="digit">0</span>
          </div>
          <span className="separator">:</span>
          <div className="digit-group">
            <span className="digit">0</span>
            <span className="digit">0</span>
          </div>
          <span className="separator">:</span>
          <div className="digit-group">
            <span className="digit">0</span>
            <span className="digit">0</span>
          </div>
          <span className="separator">:</span>
          <div className="digit-group">
            <span className="digit">0</span>
            <span className="digit">0</span>
          </div>
        </div>
        <div className="countdown-label">Today is the day! 🎉</div>
      </div>
    );
  }

  const showYears = timeRemaining.years > 0 || timeRemaining.halfYears > 0;

  return (
    <div className="countdown-clock">
      <div className="digital-display">
        {/* Years - Only show if more than a year away */}
        {showYears && (
          <>
            <div className="time-unit">
              <div className="digit-group large">
                <motion.span
                  className="digit"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  {timeRemaining.years}
                </motion.span>
                {timeRemaining.halfYears > 0 && (
                  <>
                    <span className="digit-separator">.</span>
                    <motion.span
                      className="digit"
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      5
                    </motion.span>
                  </>
                )}
              </div>
              <div className="unit-label">YEAR{timeRemaining.years === 1 && timeRemaining.halfYears === 0 ? "" : "S"}</div>
            </div>

            <span className="separator large">:</span>
          </>
        )}

        {/* Days */}
        <div className="time-unit">
          <div className="digit-group large">
            {formatNumber(timeRemaining.days).split("").map((digit, index) => (
              <motion.span
                key={`day-${index}`}
                className="digit"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
              >
                {digit}
              </motion.span>
            ))}
          </div>
          <div className="unit-label">DAYS</div>
        </div>

        <span className="separator large">:</span>

        {/* Hours */}
        <div className="time-unit">
          <div className="digit-group">
            {formatNumber(timeRemaining.hours).split("").map((digit, index) => (
              <motion.span
                key={`hour-${index}`}
                className="digit"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
              >
                {digit}
              </motion.span>
            ))}
          </div>
          <div className="unit-label">HOURS</div>
        </div>

        <span className="separator">:</span>

        {/* Minutes */}
        <div className="time-unit">
          <div className="digit-group">
            {formatNumber(timeRemaining.minutes).split("").map((digit, index) => (
              <motion.span
                key={`minute-${index}`}
                className="digit"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
              >
                {digit}
              </motion.span>
            ))}
          </div>
          <div className="unit-label">MINUTES</div>
        </div>

        <span className="separator">:</span>

        {/* Seconds */}
        <div className="time-unit">
          <div className="digit-group">
            {formatNumber(timeRemaining.seconds).split("").map((digit, index) => (
              <motion.span
                key={`second-${index}`}
                className="digit"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {digit}
              </motion.span>
            ))}
          </div>
          <div className="unit-label">SECONDS</div>
        </div>
      </div>
    </div>
  );
}
