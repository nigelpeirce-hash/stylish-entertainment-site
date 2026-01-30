"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2 } from "lucide-react";

interface AddBasicStaffProps {
  onAdd?: () => void;
}

export function AddBasicStaff({ onAdd }: AddBasicStaffProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!staffName.trim()) {
      setError("Please enter a staff member name");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/freelance-crew/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: staffName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add staff member");
      }

      setSuccess(true);
      
      // Call onAdd immediately to refresh the staff list (if callback provided)
      if (onAdd) {
        onAdd();
      }
      
      // Wait a moment to show success message, then close and reset
      setTimeout(() => {
        setIsOpen(false);
        setStaffName("");
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-gray-900 text-white border-champagne-gold/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-champagne-gold">Add Basic Staff Entry</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="staffName">Staff Name *</Label>
            <Input
              id="staffName"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="e.g., Kate, Lachlan"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              required
              autoFocus
            />
            <p className="text-xs text-gray-400">
              Add a basic staff entry. You can add more details later via Quick Staff Confirm.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-900/30 border border-green-500/50 rounded text-green-400 text-sm">
              Staff member added successfully!
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setStaffName("");
                setError("");
                setSuccess(false);
              }}
              className="flex-1 border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-champagne-gold text-black hover:bg-champagne-gold/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Staff"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
