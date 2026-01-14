"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import CountdownClock from "@/components/CountdownClock";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY_EVENT_DATE = "stylishentertainment_event_date";

export default function HeaderCountdown() {
  const { data: session } = useSession();
  const [eventDate, setEventDate] = useState<string | null>(null);
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  // Hide countdown for admin users
  const isAdmin = (session?.user as any)?.role === "admin";

  useEffect(() => {
    const loadEventDate = () => {
      const storedDate = localStorage.getItem(STORAGE_KEY_EVENT_DATE);
      if (storedDate) {
        const date = new Date(storedDate);
        if (!isNaN(date.getTime()) && date > new Date()) {
          setEventDate(storedDate);
          setTargetDate(date);
        } else {
          // Date is in the past, clear it
          localStorage.removeItem(STORAGE_KEY_EVENT_DATE);
          setEventDate(null);
          setTargetDate(null);
        }
      } else {
        setEventDate(null);
        setTargetDate(null);
      }
    };

    // Load on mount
    loadEventDate();

    // Listen for storage events (when date is set/cleared)
    const handleStorageChange = () => {
      loadEventDate();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY_EVENT_DATE);
    setEventDate(null);
    setTargetDate(null);
    window.dispatchEvent(new Event("storage"));
  };

  // Hide countdown for admin users or if no target date
  if (isAdmin || !targetDate) {
    return null;
  }

  return (
    <div className="bg-gray-900/95 border-b border-champagne-gold/20 py-3 px-4">
      <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Countdown to Your Event</p>
            <div className="scale-75 md:scale-100 origin-center">
              <CountdownClock targetDate={targetDate} />
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8 p-0"
          aria-label="Clear countdown"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
