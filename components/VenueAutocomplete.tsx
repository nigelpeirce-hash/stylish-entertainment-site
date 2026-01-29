"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface VenueAutocompleteProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export function VenueAutocomplete({
  id,
  value,
  onChange,
  onBlur,
  placeholder = "Start typing venue name...",
  className,
  error,
}: VenueAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Search venues when input changes (with debounce)
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If input is too short, clear suggestions
    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce the API call
    setIsLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/venues/search/?q=${encodeURIComponent(value)}`);
        const data = await response.json();
        
        const raw = (data.venues || []) as string[];
        const filtered = raw
          .filter((venue) => venue.toLowerCase() !== value.trim().toLowerCase())
          .slice(0, 8);
        
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        setIsLoading(false);
      } catch (error) {
        console.error("Error searching venues:", error);
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click on suggestion
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
    onBlur?.();
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Enter venue name and/or postcode (e.g., Babington House, BA3 3RW)"}
        className={cn(
          "mt-2 bg-white/5 backdrop-blur-md border-champagne-gold/30 text-white placeholder:text-gray-400 focus:border-champagne-gold focus:ring-1 focus:ring-champagne-gold/50",
          className
        )}
        autoComplete="off"
      />
      
      {isLoading && value.length >= 2 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-champagne-gold/30 border-t-champagne-gold rounded-full animate-spin" />
        </div>
      )}

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-gray-800 border border-champagne-gold/30 rounded-lg shadow-xl max-h-60 overflow-auto"
          >
            <ul className="py-1">
              {suggestions.map((suggestion, index) => {
                // Check if suggestion contains postcode (has comma and postcode pattern)
                const hasPostcode = /,\s?[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}/i.test(suggestion);
                const [venueName, postcode] = hasPostcode 
                  ? suggestion.split(/,\s*/)
                  : [suggestion, null];

                return (
                  <li
                    key={suggestion}
                    className={cn(
                      "px-4 py-2 cursor-pointer text-sm transition-colors",
                      index === selectedIndex 
                        ? "bg-champagne-gold/20 text-white" 
                        : "text-gray-200 hover:bg-champagne-gold/10"
                    )}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{venueName}</span>
                      {postcode && (
                        <span className="text-xs text-champagne-gold ml-2 font-mono">
                          {postcode.trim()}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="px-4 py-2 border-t border-champagne-gold/20 bg-gray-900/50">
              <p className="text-xs text-gray-400">
                💡 You can enter your own venue details or select from suggestions
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-sm text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
