"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Search } from "lucide-react";

interface FreelanceCrew {
  id: string;
  name: string;
  email: string | null;
}

interface QuickStaffConfirmProps {
  bookingId: string;
  venueName: string;
  eventDate: string;
  onConfirm?: () => void;
}

export function QuickStaffConfirm({ bookingId, venueName, eventDate, onConfirm }: QuickStaffConfirmProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [role, setRole] = useState("");
  const [agreedFee, setAgreedFee] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [staffSuggestions, setStaffSuggestions] = useState<FreelanceCrew[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Search for staff by name
  useEffect(() => {
    if (staffName.length >= 2) {
      const searchStaff = async () => {
        try {
          const response = await fetch(`/api/admin/freelance-crew/search/?q=${encodeURIComponent(staffName)}`);
          if (response.ok) {
            const data = await response.json();
            setStaffSuggestions(data.crew || []);
            setShowSuggestions(true);
          }
        } catch (err) {
          // Silently fail - search is optional
        }
      };
      searchStaff();
    } else {
      setStaffSuggestions([]);
      setShowSuggestions(false);
    }
  }, [staffName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!staffName.trim() || !role.trim() || !agreedFee.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    const feeNumber = parseFloat(agreedFee);
    if (isNaN(feeNumber) || feeNumber <= 0) {
      setError("Please enter a valid fee amount");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/bookings/staff/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          staffName: staffName.trim(),
          role: role.trim(),
          agreedFee: feeNumber,
          sendEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to confirm staff");
      }

      setSuccess(true);
      
      // Wait a moment for database transaction to commit, then refresh
      setTimeout(() => {
        if (onConfirm) {
          onConfirm();
        }
      }, 300);
      
      // Wait a moment to show success message, then close and reset
      setTimeout(() => {
        setIsOpen(false);
        setStaffName("");
        setRole("");
        setAgreedFee("");
        setSendEmail(true);
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectStaff = (crew: FreelanceCrew) => {
    setStaffName(crew.name);
    setShowSuggestions(false);
  };

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10">
          <UserPlus className="w-4 h-4 mr-2" />
          Quick Staff Confirm
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-gray-900 text-white border-champagne-gold/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-champagne-gold">Quick Staff Confirm</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Staff Name - Searchable */}
          <div className="space-y-2">
            <Label htmlFor="staffName">Staff Name *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="staffName"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="Type to search or enter new name"
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                required
              />
              {showSuggestions && staffSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-champagne-gold/30 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {staffSuggestions.map((crew) => (
                    <button
                      key={crew.id}
                      type="button"
                      onClick={() => selectStaff(crew)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white text-sm"
                    >
                      {crew.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Lighting, Sound Engineer"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              required
            />
          </div>

          {/* Agreed Fee */}
          <div className="space-y-2">
            <Label htmlFor="agreedFee">Agreed Fee (£) *</Label>
            <Input
              id="agreedFee"
              type="number"
              step="0.01"
              min="0"
              value={agreedFee}
              onChange={(e) => setAgreedFee(e.target.value)}
              placeholder="0.00"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              required
            />
          </div>

          {/* Send Email Toggle */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="sendEmail"
              checked={sendEmail}
              onCheckedChange={(checked) => setSendEmail(checked === true)}
              className="border-champagne-gold/50 data-[state=checked]:bg-champagne-gold data-[state=checked]:border-champagne-gold"
            />
            <Label htmlFor="sendEmail" className="text-sm text-gray-300 cursor-pointer">
              Send confirmation email to staff member
            </Label>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-900/30 border border-green-500/50 rounded text-green-400 text-sm">
              Staff confirmed successfully! {sendEmail && "Confirmation email sent."}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-champagne-gold text-black hover:bg-champagne-gold/90"
            >
              {isSubmitting ? "Confirming..." : "Confirm Staff"}
            </Button>
          </div>

          {formattedDate && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Date: {formattedDate} at {venueName}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
