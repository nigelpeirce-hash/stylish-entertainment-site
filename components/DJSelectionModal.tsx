"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Music, X } from "lucide-react";
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

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-gray-800 border-champagne-gold/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 text-champagne-gold">
            <Music className="w-6 h-6" />
            Select Your Preferred DJ
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a specific DJ or select "Any DJ" if you have no preference
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Any DJ Option */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => handleSelect(null)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedDJ === null
                ? "border-champagne-gold bg-champagne-gold/20"
                : "border-gray-700 hover:border-champagne-gold/50 bg-gray-900/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                  <Music className="w-6 h-6 text-champagne-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">Any DJ</h3>
                  <p className="text-sm text-gray-400">
                    We'll assign the best available DJ for your event
                  </p>
                </div>
              </div>
              {selectedDJ === null && (
                <div className="w-5 h-5 rounded-full bg-champagne-gold border-2 border-champagne-gold"></div>
              )}
            </div>
          </motion.div>

          {/* DJ List */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Our DJs
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {djList.map((dj) => (
                <motion.div
                  key={dj}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSelect(dj)}
                  onMouseEnter={() => setHoveredDJ(dj)}
                  onMouseLeave={() => setHoveredDJ(null)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedDJ === dj
                      ? "border-champagne-gold bg-champagne-gold/20"
                      : hoveredDJ === dj
                      ? "border-champagne-gold/50 bg-gray-900/50"
                      : "border-gray-700 bg-gray-900/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-champagne-gold/20 flex items-center justify-center">
                        <Music className="w-5 h-5 text-champagne-gold" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{dj}</h3>
                        <p className="text-xs text-gray-400">We'll check availability</p>
                      </div>
                    </div>
                    {selectedDJ === dj && (
                      <div className="w-5 h-5 rounded-full bg-champagne-gold border-2 border-champagne-gold"></div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
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
