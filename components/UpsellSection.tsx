"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Package, ChevronDown, ChevronUp } from "lucide-react";

interface UpsellSectionProps {
  selectedServices: string[];
  selectedUpsells: string[];
  onUpsellChange: (upsells: string[]) => void;
}

// Upsell items organized by category
const upsellItems = {
  "Lighting & Decor": [
    "Uplighting (per fixture)",
    "Fairy Light Installation",
    "LED Dance Floor",
    "Festoon Lighting",
  ],
  "Sound & Equipment": [
    "Additional PA System",
    "Wireless Microphones",
    "DJ Booth Upgrade",
  ],
  "Hire Items": [
    "Photo Booth",
    "Smoke Machine",
    "Mirror Ball",
  ],
  "Additional Services": [
    "Early Setup (before event)",
    "Late Finish Extension",
    "Live Musician Add-on",
  ],
  "Fire & Atmosphere": [
    "Fire Pit Hire (per pit)",
    "Fire Pit Fuel Package",
  ],
};

export default function UpsellSection({
  selectedServices,
  selectedUpsells,
  onUpsellChange,
}: UpsellSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show upsell section if they've selected a main service
  if (selectedServices.length === 0) {
    return null;
  }

  const toggleUpsell = (item: string) => {
    if (selectedUpsells.includes(item)) {
      onUpsellChange(selectedUpsells.filter((i) => i !== item));
    } else {
      onUpsellChange([...selectedUpsells, item]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="bg-gray-800 border-champagne-gold/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-champagne-gold" />
              <CardTitle className="text-champagne-gold">
                Enhance Your Event
              </CardTitle>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-champagne-gold hover:text-gold-light hover:bg-champagne-gold/10"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Hide Options
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  View Options
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Select items you're interested in - we'll check availability and stock levels
          </p>
        </CardHeader>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="space-y-6">
          {Object.entries(upsellItems).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                <Package className="w-4 h-4" />
                {category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                {items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-900/50 transition-colors"
                  >
                    <Checkbox
                      id={`upsell-${item}`}
                      checked={selectedUpsells.includes(item)}
                      onCheckedChange={() => toggleUpsell(item)}
                      className="border-gray-600 data-[state=checked]:bg-champagne-gold data-[state=checked]:border-champagne-gold"
                    />
                    <Label
                      htmlFor={`upsell-${item}`}
                      className="cursor-pointer text-sm text-gray-300 flex-1"
                    >
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}

                {selectedUpsells.length > 0 && (
                  <div className="mt-4 p-3 bg-champagne-gold/10 border border-champagne-gold/30 rounded-lg">
                    <p className="text-sm text-champagne-gold font-medium">
                      {selectedUpsells.length} item{selectedUpsells.length !== 1 ? "s" : ""} of interest
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      We'll check availability and stock levels, then contact you with pricing
                    </p>
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
        {!isExpanded && (
          <CardContent className="pt-0">
            {selectedUpsells.length > 0 ? (
              <div className="p-3 bg-champagne-gold/10 border border-champagne-gold/30 rounded-lg">
                <p className="text-sm text-champagne-gold font-medium">
                  {selectedUpsells.length} item{selectedUpsells.length !== 1 ? "s" : ""} of interest
                </p>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="text-champagne-gold hover:text-gold-light p-0 h-auto mt-1"
                >
                  View items of interest
                </Button>
              </div>
            ) : (
              <div className="p-3 text-sm text-gray-400">
                Click "View Options" above to see available enhancements
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
