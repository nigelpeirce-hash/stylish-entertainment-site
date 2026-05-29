"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "@/lib/motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SafetyDeleteButtonProps {
  onDelete: () => void;
  deleting?: boolean;
  itemName?: string;
  itemDetails?: string;
}

export function SafetyDeleteButton({
  onDelete,
  deleting = false,
  itemName = "item",
  itemDetails,
}: SafetyDeleteButtonProps) {
  const [isFlapOpen, setIsFlapOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleFlapClick = () => {
    setIsFlapOpen(true);
  };

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowConfirmDialog(false);
    setIsFlapOpen(false);
  };

  return (
    <>
      <div className="relative w-32" style={{ perspective: "1000px", perspectiveOrigin: "center center" }}>
        {/* Container for 3D effect */}
        <div style={{ transformStyle: "preserve-3d" }}>
          {/* Safety Flap */}
          <motion.div
            initial={false}
            animate={{
              rotateX: isFlapOpen ? -110 : 0,
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "bottom center",
            }}
            className="relative z-10 cursor-pointer"
            onClick={handleFlapClick}
          >
            <div
              className="bg-red-800 border-2 border-red-600 rounded-sm px-3 py-1.5 shadow-lg"
              style={{
                backfaceVisibility: "hidden",
              }}
            >
              <span className="text-[8px] font-black text-red-100 tracking-widest uppercase">
                DANGER
              </span>
            </div>
          </motion.div>

          {/* Red Delete Button (revealed under flap) */}
          <AnimatePresence>
            {isFlapOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="absolute top-0 left-0 right-0 z-0"
              >
                <Button
                  onClick={handleDeleteClick}
                  disabled={deleting}
                  className="w-full h-10 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-red-400"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold">DELETE</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Final Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-gray-900 border-2 border-red-600 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400 text-xl font-bold">
              ⚠️ CONFIRM DESTRUCT?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-red-950/30 border-2 border-red-600 rounded-lg p-4">
              <p className="text-white font-semibold mb-2">
                This action cannot be undone.
              </p>
              <p className="text-gray-300 text-sm">
                You are about to permanently delete: <strong>{itemName}</strong>
              </p>
              {itemDetails && (
                <p className="text-gray-400 text-xs mt-2">{itemDetails}</p>
              )}
              <p className="text-red-300 text-xs mt-3 font-bold">
                ⚠️ All associated data will be permanently removed.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmDialog(false);
                  setIsFlapOpen(false);
                }}
                disabled={deleting}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                ABORT
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white font-bold border-2 border-red-400"
              >
                {deleting ? "DESTROYING..." : "CONFIRM DESTRUCT"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
