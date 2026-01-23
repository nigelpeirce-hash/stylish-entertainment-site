"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, Mail, FileText, Send, Lightbulb } from "lucide-react";
import { createBooking } from "@/lib/actions/booking-actions";
import { Select } from "@/components/ui/select";
import { getNameFormatSuggestions, isValidNameFormat, getDisplayName } from "@/lib/utils/name-helpers";

interface AddBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddBookingModal({ open, onOpenChange, onSuccess }: AddBookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    clientEmail: "",
    startDate: "",
    startTime: "",
    endTime: "",
    serviceType: "",
    notes: "",
    sendPortalInvite: false,
  });

  const serviceTypeOptions = [
    { value: "", label: "Select service type..." },
    { value: "DJs", label: "DJs" },
    { value: "Musicians", label: "Musicians" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Lighting Design", label: "Lighting Design" },
    { value: "Venue Styling", label: "Venue Styling" },
    { value: "Production", label: "Production" },
    { value: "Event Production", label: "Event Production" },
    { value: "Kit Hire", label: "Kit Hire" },
    { value: "Other", label: "Other" },
  ];

  // Generate time options in 15-minute increments
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        options.push({ value: timeString, label: displayTime });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        clientEmail: "",
        startDate: "",
        startTime: "",
        endTime: "",
        serviceType: "",
        notes: "",
        sendPortalInvite: false,
      });
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.clientEmail || !formData.startDate || !formData.startTime || !formData.endTime || !formData.serviceType) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Validate name format
      if (!isValidNameFormat(formData.title)) {
        setError("Please enter a valid event title (e.g., 'Sarah & Mike', 'Nigel Peirce', or 'TBC')");
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.clientEmail)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Combine date and time for startTime
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      // For endTime, use the same date with the end time
      const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);

      // Validate dates
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        setError("Please enter valid date and time values");
        setLoading(false);
        return;
      }

      // Validate end time is after start time
      if (endDateTime <= startDateTime) {
        setError("End time must be after start time");
        setLoading(false);
        return;
      }

      // Call the server action
      const result = await createBooking({
        title: formData.title,
        clientEmail: formData.clientEmail,
        startTime: startDateTime,
        endTime: endDateTime,
        serviceType: formData.serviceType,
        notes: formData.notes || undefined,
        sendPortalInvite: formData.sendPortalInvite,
      });

      if (result.success) {
        // Reset form
        setFormData({
          title: "",
          clientEmail: "",
          startDate: "",
          startTime: "",
          endTime: "",
          serviceType: "",
          notes: "",
          sendPortalInvite: false,
        });
        
        // Close modal and trigger success callback
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: "",
        clientEmail: "",
        startDate: "",
        startTime: "",
        endTime: "",
        serviceType: "",
        notes: "",
        sendPortalInvite: false,
      });
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] bg-[#111827] border-white/10 shadow-2xl p-0">
        <div className="p-6 text-white">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">
              New Booking
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400 mt-1">
              Enter client details and event logistics below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Client Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-widest">Client Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-300">
                    Event Title <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Sarah & Mike, Nigel Peirce, or TBC"
                    autoComplete="off"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                    required
                    disabled={loading}
                  />
                  <div className="flex items-start gap-2 text-xs text-gray-400 bg-gray-800/50 p-2 rounded border border-gray-700/50">
                    <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-500" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-300 mb-1">Format examples:</p>
                      <ul className="space-y-0.5 text-gray-400">
                        <li>• Couples: <span className="text-amber-400">Sarah & Mike</span> or <span className="text-amber-400">Sarah and Mike</span></li>
                        <li>• Individuals: <span className="text-amber-400">Nigel Peirce</span></li>
                        <li>• Companies: <span className="text-amber-400">Stylish Ambience Ltd</span></li>
                        <li>• Pending: <span className="text-amber-400">TBC</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail" className="text-sm font-medium text-gray-300">
                    Client Email <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="hello@client.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Logistics */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/5 space-y-4">
              <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-widest">Event Logistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-300">
                    Date <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-white/10 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm font-medium text-gray-300">
                    Start <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    id="startTime"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-white/10 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 transition-all outline-none [&>option]:bg-gray-800 [&>option]:text-white"
                    required
                    disabled={loading}
                  >
                    <option value="">Select time...</option>
                    {timeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-sm font-medium text-gray-300">
                    End <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    id="endTime"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-white/10 border-none rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 transition-all outline-none [&>option]:bg-gray-800 [&>option]:text-white"
                    required
                    disabled={loading}
                  >
                    <option value="">Select time...</option>
                    {timeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 3: Service & Notes */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-widest">Service Details</h3>
              
              {/* Service Type */}
              <div className="space-y-2">
                <Label htmlFor="serviceType" className="text-sm font-medium text-gray-300">
                  Service Type <span className="text-red-400">*</span>
                </Label>
                <Select
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none [&>option]:bg-gray-800 [&>option]:text-white"
                  required
                  disabled={loading}
                >
                  {serviceTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-300">
                  Internal Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Add any specific requirements..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-500 resize-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                  disabled={loading}
                />
              </div>
              
              {/* Send Portal Invite Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendPortalInvite"
                  checked={formData.sendPortalInvite}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, sendPortalInvite: checked === true })
                  }
                  disabled={loading}
                />
                <Label
                  htmlFor="sendPortalInvite"
                  className="text-sm text-gray-400 cursor-pointer"
                >
                  Send Portal Invite to client automatically
                </Label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-amber-500/20 transition-all transform active:scale-95 flex items-center gap-2"
              >
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Create Booking</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
