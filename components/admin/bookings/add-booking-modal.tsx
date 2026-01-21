"use client";

import { useState } from "react";
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
import { Calendar, Clock, Mail, FileText, Send } from "lucide-react";
import { createBooking } from "@/lib/actions/booking-actions";
import { Select } from "@/components/ui/select";

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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            New Booking
          </DialogTitle>
          <DialogDescription>
            Create a new booking entry and optionally link it to existing email threads.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
              Event Title <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., John & Sarah's Wedding"
                className="pl-10 focus:outline-none focus:ring-0 focus:border-amber-500 transition-colors"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Client Email */}
          <div>
            <Label htmlFor="clientEmail" className="text-sm font-medium text-gray-700 mb-2 block">
              Client Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                placeholder="client@example.com"
                className="pl-10 focus:outline-none focus:ring-0 focus:border-amber-500 transition-colors"
                required
                disabled={loading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Existing email threads with this address will be automatically linked.
            </p>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Start Date */}
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-2 block">
                Event Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="pl-10 focus:outline-none focus:ring-0 focus:border-amber-500 transition-colors"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Start Time */}
            <div>
              <Label htmlFor="startTime" className="text-sm font-medium text-gray-700 mb-2 block">
                Start Time <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="pl-10 focus:outline-none focus:ring-0 focus:border-amber-500 transition-colors"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* End Time */}
            <div>
              <Label htmlFor="endTime" className="text-sm font-medium text-gray-700 mb-2 block">
                End Time <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="pl-10 focus:outline-none focus:ring-0 focus:border-amber-500 transition-colors"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-2 block">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this booking..."
              rows={4}
              className="focus:outline-none focus:ring-0 focus:border-amber-500 transition-colors resize-y"
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
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Send Portal Invite
            </Label>
            <p className="text-xs text-gray-500 ml-2">
              Email the client a link to manage their booking
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={loading}
              className="text-gray-700 hover:text-gray-900"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold"
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Create Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
