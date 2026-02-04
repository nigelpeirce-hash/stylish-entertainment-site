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
import { Calendar, Clock, Mail, FileText, Send, Lightbulb, Users, X, Plus, Loader2 } from "lucide-react";
import { createBooking } from "@/lib/actions/booking-actions";
import { Select } from "@/components/ui/select";
import { VenueAutocomplete } from "@/components/VenueAutocomplete";
import { getNameFormatSuggestions, isValidNameFormat, getDisplayName } from "@/lib/utils/name-helpers";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import Image from "next/image";
import { sanitizeCloudinaryUrl } from "@/lib/cloudinary-utils";
import { toSafeReactChild } from "@/lib/transformers/booking-transformer";

interface TeamMember {
  id: string;
  name: string;
  imageUrl?: string | null;
  role?: string;
}

interface AssignedMember {
  id: string;
  name: string;
  imageUrl?: string | null;
  role: string;
  fee?: string;
}

interface AddBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddBookingModal({ open, onOpenChange, onSuccess }: AddBookingModalProps) {
  const { toast, toastState } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTeam, setAvailableTeam] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [assignedMembers, setAssignedMembers] = useState<AssignedMember[]>([]);
  const [prefillVenueLoading, setPrefillVenueLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    clientAddress2: "",
    clientTown: "",
    clientCounty: "",
    clientPostcode: "",
    venue: "",
    startDate: "",
    startTime: "",
    endTime: "",
    eventType: "wedding" as "wedding" | "party" | "corporate",
    serviceTypes: [] as string[],
    notes: "",
    sendPortalInvite: false,
    earlySetup: false,
  });

  const eventTypeOptions = [
    { value: "wedding", label: "Wedding", description: "Wedding-specific content & messaging" },
    { value: "party", label: "Party", description: "Birthday, anniversary, celebration" },
    { value: "corporate", label: "Corporate", description: "Business events, conferences" },
  ];

  const serviceTypeOptions = [
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

  // Generate time options in 15-minute increments starting from midday (12:00)
  const generateTimeOptions = () => {
    const options = [];
    // Start from 12:00 (midday) and go to 23:45, then 00:00 to 03:00 for late nights
    for (let hour = 12; hour < 24; hour++) {
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
    // Add early morning hours for late-night events (00:00 - 03:00)
    for (let hour = 0; hour < 4; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        options.push({ value: timeString, label: `${displayTime} (next day)` });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const parseVenue = (v: string) => {
    const t = (v || "").trim();
    const m = t.match(/,?\s*([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})$/i);
    const name = m ? t.slice(0, t.indexOf(m[1])).replace(/,\s*$/, "").trim() : t;
    const postcode = m ? m[1].replace(/\s+/g, " ").trim() : null;
    return { venueName: name, venuePostcode: postcode };
  };

  const handlePrefillFromVenue = async () => {
    const { venueName } = parseVenue(formData.venue);
    if (!venueName || venueName.length < 2) return;
    setPrefillVenueLoading(true);
    try {
      const params = new URLSearchParams({ venueName });
      const { venuePostcode } = parseVenue(formData.venue);
      if (venuePostcode) params.set("venuePostcode", venuePostcode);
      const res = await fetch(`/api/admin/venues/details/?${params.toString()}`);
      const data = await res.json().catch(() => ({}));
      const venue = data?.venue;
      if (venue && (venue.venuePostcode || venue.venueContact || venue.venueAddress)) {
        const name = venueName;
        const pc = (venue.venuePostcode || "").trim();
        setFormData((prev) => ({
          ...prev,
          venue: pc ? `${name}, ${pc}` : name,
        }));
      }
    } catch {
      /* no-op */
    } finally {
      setPrefillVenueLoading(false);
    }
  };

  const toggleServiceType = (value: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(value)
        ? prev.serviceTypes.filter(t => t !== value)
        : [...prev.serviceTypes, value],
    }));
  };

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        clientEmail: "",
        clientPhone: "",
        clientAddress: "",
        clientAddress2: "",
        clientTown: "",
        clientCounty: "",
        clientPostcode: "",
        venue: "",
        startDate: "",
        startTime: "",
        endTime: "",
        eventType: "wedding",
        serviceTypes: [],
        notes: "",
        sendPortalInvite: false,
        earlySetup: false,
      });
      setAssignedMembers([]);
      setAvailableTeam([]);
      setError(null);
    }
  }, [open]);

  // Fetch available team when service types change
  useEffect(() => {
    const fetchTeam = async () => {
      if (formData.serviceTypes.length === 0) {
        setAvailableTeam([]);
        return;
      }

      setLoadingTeam(true);
      try {
        const allMembers: TeamMember[] = [];
        
        // Fetch DJs if selected
        if (formData.serviceTypes.includes("DJs")) {
          const response = await fetch("/api/admin/djs/");
          if (response.ok) {
            const data = await response.json();
            const djs = (data.djs || []).map((m: any) => ({
              id: m.id,
              name: m.name,
              imageUrl: m.imageUrl,
              role: "DJ",
            }));
            allMembers.push(...djs);
          }
        }
        
        // Fetch Musicians if selected
        if (formData.serviceTypes.includes("Musicians")) {
          const response = await fetch("/api/admin/musicians/");
          if (response.ok) {
            const data = await response.json();
            const musicians = (data.musicians || []).map((m: any) => ({
              id: m.id,
              name: m.name,
              imageUrl: m.imageUrl,
              role: m.instrument || "Musician",
            }));
            allMembers.push(...musicians);
          }
        }
        
        // Fetch Freelance Crew for production roles
        const crewRoles = ["Lighting Design", "Venue Styling", "Production", "Event Production"];
        const selectedCrewRoles = formData.serviceTypes.filter(t => crewRoles.includes(t));
        if (selectedCrewRoles.length > 0) {
          const response = await fetch("/api/admin/freelance-crew/");
          if (response.ok) {
            const data = await response.json();
            const crew = (data.crew || []).map((m: any) => ({
              id: m.id,
              name: m.name,
              imageUrl: null,
              role: m.roles?.[0] || "Crew",
            }));
            allMembers.push(...crew);
          }
        }

        setAvailableTeam(allMembers);
      } catch (err) {
        console.error("Error fetching team:", err);
        setAvailableTeam([]);
      } finally {
        setLoadingTeam(false);
      }
    };

    fetchTeam();
  }, [formData.serviceTypes]);

  const addTeamMember = (member: TeamMember) => {
    if (assignedMembers.find(m => m.id === member.id)) return;
    setAssignedMembers([
      ...assignedMembers,
      {
        id: member.id,
        name: member.name,
        imageUrl: member.imageUrl,
        role: member.role || (formData.serviceTypes[0] ?? "Crew"),
        fee: "",
      },
    ]);
  };

  const removeTeamMember = (id: string) => {
    setAssignedMembers(assignedMembers.filter(m => m.id !== id));
  };

  const updateMemberFee = (id: string, fee: string) => {
    setAssignedMembers(assignedMembers.map(m => 
      m.id === id ? { ...m, fee } : m
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.clientEmail || !formData.startDate || !formData.startTime || !formData.endTime || formData.serviceTypes.length === 0) {
        setError("Please fill in all required fields including at least one service type");
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

      const { venueName, venuePostcode } = parseVenue(formData.venue);

      // Combine date and time for startTime
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      
      // For endTime, check if it's an early morning time (00:00-03:45) which means next day
      const endHour = parseInt(formData.endTime.split(":")[0]);
      const isNextDayEndTime = endHour >= 0 && endHour < 4;
      
      let endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);
      if (isNextDayEndTime) {
        // Add one day for early morning end times
        endDateTime.setDate(endDateTime.getDate() + 1);
      }

      // Validate dates
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        setError("Please enter valid date and time values");
        setLoading(false);
        return;
      }

      // Validate end time is after start time
      if (endDateTime <= startDateTime) {
        setError("End time must be after start time. For late-night events ending after midnight, select an early morning time.");
        setLoading(false);
        return;
      }

      // Call the server action
      const result = await createBooking({
        title: formData.title,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone?.trim() || undefined,
        clientAddress: formData.clientAddress?.trim() || undefined,
        clientAddress2: formData.clientAddress2?.trim() || undefined,
        clientTown: formData.clientTown?.trim() || undefined,
        clientCounty: formData.clientCounty?.trim() || undefined,
        clientPostcode: formData.clientPostcode?.trim() || undefined,
        venueName: venueName || undefined,
        venuePostcode: venuePostcode ?? undefined,
        startTime: startDateTime,
        endTime: endDateTime,
        eventType: formData.eventType,
        serviceTypes: formData.serviceTypes,
        notes: formData.notes || undefined,
        sendPortalInvite: formData.sendPortalInvite,
        earlySetup: formData.earlySetup,
        assignedTeam: assignedMembers.length > 0 ? assignedMembers.map(m => ({
          id: m.id,
          name: m.name,
          role: m.role,
          fee: m.fee ? parseFloat(m.fee) : undefined,
        })) : undefined,
      });

      if (result.success) {
        // Reset form
        setFormData({
          title: "",
          clientEmail: "",
          clientPhone: "",
          clientAddress: "",
          clientAddress2: "",
          clientTown: "",
          clientCounty: "",
          clientPostcode: "",
          venue: "",
          startDate: "",
          startTime: "",
          endTime: "",
          eventType: "wedding",
          serviceTypes: [],
          notes: "",
          sendPortalInvite: false,
          earlySetup: false,
        });
        setAssignedMembers([]);
        setAvailableTeam([]);
        
        // Close modal and trigger success callback
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }

        // Show feedback for portal invite when checkbox was ticked
        if (formData.sendPortalInvite) {
          if ((result as { portalInviteSent?: boolean; portalInviteError?: string }).portalInviteSent) {
            toast({
              title: "Booking created",
              description: `Portal invite sent to ${formData.clientEmail}`,
            });
          } else {
            const err = (result as { portalInviteError?: string }).portalInviteError;
            toast({
              title: "Booking created",
              description: err ? `Portal invite could not be sent: ${err}` : "Portal invite could not be sent.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Booking created",
            description: "You can invite the client to the portal from the booking page.",
          });
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
        clientPhone: "",
        clientAddress: "",
        clientAddress2: "",
        clientTown: "",
        clientCounty: "",
        clientPostcode: "",
        venue: "",
        startDate: "",
        startTime: "",
        endTime: "",
        eventType: "wedding",
        serviceTypes: [],
        notes: "",
        sendPortalInvite: false,
        earlySetup: false,
      });
      setAssignedMembers([]);
      setAvailableTeam([]);
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <>
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
                <div className="space-y-2">
                  <Label htmlFor="clientPhone" className="text-sm font-medium text-gray-300">
                    Client Phone
                  </Label>
                  <Input
                    id="clientPhone"
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    placeholder="e.g. 07700 900000 or 020 7946 0958"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Client home address */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold text-amber-500/90 uppercase tracking-wider">Client home address</h4>
                <p className="text-xs text-gray-400">Optional. Required for book-from-quote; client can add it there or you can enter here.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="clientAddress" className="text-sm font-medium text-gray-300">Address</Label>
                    <Input
                      id="clientAddress"
                      value={formData.clientAddress}
                      onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                      placeholder="Line 1"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-500"
                      disabled={loading}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="clientAddress2" className="text-sm font-medium text-gray-300">Address 2</Label>
                    <Input
                      id="clientAddress2"
                      value={formData.clientAddress2}
                      onChange={(e) => setFormData({ ...formData, clientAddress2: e.target.value })}
                      placeholder="Line 2"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-500"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientTown" className="text-sm font-medium text-gray-300">Town</Label>
                    <Input
                      id="clientTown"
                      value={formData.clientTown}
                      onChange={(e) => setFormData({ ...formData, clientTown: e.target.value })}
                      placeholder="Town"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-500"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientCounty" className="text-sm font-medium text-gray-300">County</Label>
                    <Input
                      id="clientCounty"
                      value={formData.clientCounty}
                      onChange={(e) => setFormData({ ...formData, clientCounty: e.target.value })}
                      placeholder="County"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-500"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPostcode" className="text-sm font-medium text-gray-300">Postcode</Label>
                    <Input
                      id="clientPostcode"
                      value={formData.clientPostcode}
                      onChange={(e) => setFormData({ ...formData, clientPostcode: e.target.value })}
                      placeholder="Postcode"
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-500"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Event Type */}
              <div className="space-y-2 pt-2">
                <Label className="text-sm font-medium text-gray-300">
                  Event Type <span className="text-red-400">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {eventTypeOptions.map((option) => {
                    const isSelected = formData.eventType === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, eventType: option.value as "wedding" | "party" | "corporate" })}
                        disabled={loading}
                        className={`p-3 rounded-lg text-left transition-all border ${
                          isSelected
                            ? "bg-amber-500/20 border-amber-500 ring-1 ring-amber-500"
                            : "bg-white/5 border-white/10 hover:border-amber-500/50"
                        }`}
                      >
                        <div className={`text-sm font-medium ${isSelected ? "text-amber-400" : "text-white"}`}>
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {option.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 2: Logistics */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/5 space-y-4">
              <h3 className="text-xs font-semibold text-amber-500 uppercase tracking-widest">Event Logistics</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="venue" className="text-sm font-medium text-gray-300">
                    Venue
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={!formData.venue.trim() || formData.venue.trim().length < 2 || prefillVenueLoading || loading}
                    onClick={handlePrefillFromVenue}
                    className="text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                  >
                    {prefillVenueLoading ? "Checking…" : "Pre-fill from past booking"}
                  </Button>
                </div>
                <VenueAutocomplete
                  id="venue"
                  value={formData.venue}
                  onChange={(value) => setFormData({ ...formData, venue: value })}
                  placeholder="Type venue name or select from suggestions (e.g. Babington House, BA11 3RW)"
                  className="w-full mt-0 bg-white/10 border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                <p className="text-xs text-gray-400">Optional. Stored on the booking; use Pre-fill to add postcode from a past booking, or add full address later on the booking detail page.</p>
              </div>
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
              
              {/* Service Types - Multi-select */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">
                  Service Types <span className="text-red-400">*</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {serviceTypeOptions.map((option) => {
                    const isSelected = formData.serviceTypes.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleServiceType(option.value)}
                        disabled={loading}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-amber-500 text-black border border-amber-500"
                            : "bg-white/5 text-gray-300 border border-white/10 hover:border-amber-500/50"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                {formData.serviceTypes.length > 0 && (
                  <p className="text-xs text-gray-400">
                    Selected: {formData.serviceTypes.join(", ")}
                  </p>
                )}
              </div>

              {/* Early Setup Checkbox - Show when DJs or Musicians selected */}
              {(formData.serviceTypes.includes("DJs") || formData.serviceTypes.includes("Musicians")) && (
                <div className="flex items-center space-x-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <Checkbox
                    id="earlySetup"
                    checked={formData.earlySetup}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, earlySetup: checked === true })
                    }
                    disabled={loading}
                    className="border-amber-500/50 data-[state=checked]:bg-amber-500"
                  />
                  <Label
                    htmlFor="earlySetup"
                    className="text-sm text-amber-200 cursor-pointer"
                  >
                    Early Setup Required (artist arrives earlier in the day)
                  </Label>
                </div>
              )}

              {/* Team Assignment */}
              {formData.serviceTypes.length > 0 && (formData.serviceTypes.includes("DJs") || formData.serviceTypes.includes("Musicians") || formData.serviceTypes.includes("Lighting Design") || formData.serviceTypes.includes("Venue Styling") || formData.serviceTypes.includes("Production") || formData.serviceTypes.includes("Event Production")) && (
                <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-500" />
                    <Label className="text-sm font-medium text-gray-300">
                      Assign Team
                    </Label>
                  </div>

                  {/* Available Team Members */}
                  {loadingTeam ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                    </div>
                  ) : availableTeam.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {availableTeam.map((member) => {
                        const isAssigned = assignedMembers.some(m => m.id === member.id);
                        return (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => !isAssigned && addTeamMember(member)}
                            disabled={isAssigned || loading}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                              isAssigned
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : "bg-white/5 text-gray-300 border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10"
                            }`}
                          >
                            {member.imageUrl && (
                              <Image
                                src={sanitizeCloudinaryUrl(member.imageUrl) || member.imageUrl}
                                alt={member.name}
                                width={20}
                                height={20}
                                className="rounded-full"
                              />
                            )}
                            <span>{member.name}</span>
                            {!isAssigned && <Plus className="w-3 h-3" />}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No team members available for this service type</p>
                  )}

                  {/* Assigned Members with Fee */}
                  {assignedMembers.length > 0 && (
                    <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
                      <Label className="text-xs text-gray-400">Assigned ({assignedMembers.length})</Label>
                      {assignedMembers.map((member) => (
                        <div key={member.id} className="flex items-center gap-3 bg-white/5 rounded-lg p-2">
                          {member.imageUrl && (
                            <Image
                              src={sanitizeCloudinaryUrl(member.imageUrl) || member.imageUrl}
                              alt={member.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{member.name}</p>
                            <p className="text-xs text-gray-400">{member.role}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="Fee £"
                              value={toSafeReactChild(member.fee ?? "")}
                              onChange={(e) => updateMemberFee(member.id, e.target.value)}
                              className="w-24 bg-white/10 border-none text-white text-sm p-2 h-8"
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() => removeTeamMember(member.id)}
                              className="text-gray-400 hover:text-red-400 transition-colors"
                              disabled={loading}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
      <Toast toast={toastState} onClose={() => {}} />
    </>
  );
}
