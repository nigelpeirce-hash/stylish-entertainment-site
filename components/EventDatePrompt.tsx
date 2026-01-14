"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

const STORAGE_KEY_EVENT_DATE = "stylishentertainment_event_date";
const STORAGE_KEY_PROMPT_SHOWN = "stylishentertainment_prompt_shown";

export default function EventDatePrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [hasDate, setHasDate] = useState(false);

  useEffect(() => {
    // Check if prompt has been shown before
    const promptShown = localStorage.getItem(STORAGE_KEY_PROMPT_SHOWN);
    const storedDate = localStorage.getItem(STORAGE_KEY_EVENT_DATE);
    
    if (storedDate) {
      setHasDate(true);
      setEventDate(storedDate);
      setIsOpen(false);
    } else if (!promptShown) {
      // Show prompt for new visitors after 6 seconds (to allow page to fully display)
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventDate(e.target.value);
  };

  const handleSubmit = () => {
    if (eventDate) {
      const date = new Date(eventDate);
      if (!isNaN(date.getTime()) && date > new Date()) {
        localStorage.setItem(STORAGE_KEY_EVENT_DATE, eventDate);
        localStorage.setItem(STORAGE_KEY_PROMPT_SHOWN, "true");
        setHasDate(true);
        setIsOpen(false);
        // Trigger storage event so HeaderCountdown can update
        window.dispatchEvent(new Event("storage"));
      }
    }
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY_PROMPT_SHOWN, "true");
    setIsOpen(false);
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY_EVENT_DATE);
    setHasDate(false);
    setEventDate("");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-800 border-champagne-gold/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-champagne-gold">
              <Calendar className="w-5 h-5" />
              When is your event?
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Enter your event date to see a countdown on our site. You can always change this later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-date" className="text-gray-200">
                Event Date
              </Label>
              <Input
                id="event-date"
                type="date"
                value={eventDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split("T")[0]}
                className="bg-gray-700 border-gray-600 text-white"
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
                disabled={!eventDate}
                className="bg-champagne-gold hover:bg-champagne-gold/90 text-gray-900"
              >
                Set Countdown
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Export function to clear event date (can be called from other components)
export function clearEventDate() {
  localStorage.removeItem(STORAGE_KEY_EVENT_DATE);
  window.dispatchEvent(new Event("storage"));
}

// Export function to get event date
export function getEventDate(): string | null {
  return localStorage.getItem(STORAGE_KEY_EVENT_DATE);
}
