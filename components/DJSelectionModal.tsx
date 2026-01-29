"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Music } from "lucide-react";
import { useState } from "react";

interface DJSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (djName: string | null) => void;
  selectedDJ: string | null;
}

// List of DJs
const djList = [
  "DJ Nige",
  "Rich S",
  "James H",
  "Brett",
];

export default function DJSelectionModal({
  open,
  onClose,
  onSelect,
  selectedDJ,
}: DJSelectionModalProps) {
  const [hoveredDJ, setHoveredDJ] = useState<string | null>(null);

  const handleSelect = (djName: string | null) => {
    onSelect(djName);
    onClose();
  };

  const tileBase = "rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center min-h-[100px] p-5 text-center";
  const selectedStyles = "border-champagne-gold bg-champagne-gold/20";
  const hoverStyles = "border-champagne-gold/50 bg-gray-900/50";
  const defaultStyles = "border-gray-700 bg-gray-900/30";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-gray-800 border-champagne-gold/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 text-champagne-gold">
            <Music className="w-6 h-6" />
            Select Your Preferred DJ
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a DJ or &quot;Not sure yet&quot; and we&apos;ll help you find the perfect match
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* "Not sure yet" - full-width tile */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => handleSelect("Not sure yet")}
            onMouseEnter={() => setHoveredDJ("Not sure yet")}
            onMouseLeave={() => setHoveredDJ(null)}
            className={`rounded-xl border-2 cursor-pointer transition-all w-full min-h-[80px] p-4 flex items-center ${
              selectedDJ === "Not sure yet" ? selectedStyles : hoveredDJ === "Not sure yet" ? hoverStyles : defaultStyles
            }`}
          >
            <div className="flex items-center justify-between w-full gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-600/40 flex items-center justify-center shrink-0">
                  <Music className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Not sure yet</h3>
                  <p className="text-xs text-gray-400">We&apos;ll help you choose</p>
                </div>
              </div>
              {selectedDJ === "Not sure yet" && (
                <div className="w-5 h-5 rounded-full bg-champagne-gold border-2 border-champagne-gold shrink-0" />
              )}
            </div>
          </motion.div>

          {/* 2x2 DJ grid: 2 on top, 2 below */}
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Our DJs
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {djList.map((dj) => (
              <motion.div
                key={dj}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(dj)}
                onMouseEnter={() => setHoveredDJ(dj)}
                onMouseLeave={() => setHoveredDJ(null)}
                className={`${tileBase} ${
                  selectedDJ === dj ? selectedStyles : hoveredDJ === dj ? hoverStyles : defaultStyles
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-champagne-gold/20 flex items-center justify-center mb-2">
                  <Music className="w-5 h-5 text-champagne-gold" />
                </div>
                <h3 className="font-semibold text-white text-base">{dj}</h3>
                <p className="text-xs text-gray-400 mt-0.5">We&apos;ll check availability</p>
                {selectedDJ === dj && (
                  <div className="w-4 h-4 rounded-full bg-champagne-gold border-2 border-champagne-gold mt-2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
