"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, Mail, CheckCircle2, AlertCircle, Clock, Calendar, MapPin, Music, Phone, Users, FileText, Car, Home } from "lucide-react";

interface Booking {
  id: string;
  name: string;
  email: string;
  phoneAreaCode?: string | null;
  phoneNumber?: string | null;
  eventType: string;
  eventDate: string;
  venueName: string;
  venueAddress: string | null;
  venueAddress2?: string | null;
  venueTown?: string | null;
  venueCounty?: string | null;
  venuePostcode: string | null;
  venueContact?: string | null;
  venuePhoneAreaCode?: string | null;
  venuePhoneNumber?: string | null;
  numberOfGuests?: number | null;
  djArrivalTime?: string | null;
  djStartTime?: string | null;
  djFinishTime?: string | null;
  djSetupLocation?: string | null;
  djParking?: string | null;
  soundLimiter?: boolean | null;
  preferredDJ: string | null;
  firstDance?: string | null;
  lastSong?: string | null;
  musicDislikes?: string | null;
  musicRequests?: string | null;
  musicNotesToDJ?: string | null;
  musicFileUrl?: string | null;
  assignedDJEmail?: string | null;
  assignedDJName?: string | null;
  reviewComplete?: boolean;
  dispatchedAt?: string | null;
  dispatchedBy?: string | null;
  emailsSent?: any; // JSON field that may contain dispatch metadata
}

interface ArtistDispatchProps {
  bookingId: string;
  booking: Booking;
  onUpdate?: () => void;
}

export function ArtistDispatch({ bookingId, booking, onUpdate }: ArtistDispatchProps) {
  // Extract dispatch metadata from emailsSent JSON field
  const dispatchData = (booking.emailsSent as any)?.artistDispatch || {};
  const dispatchedAt = booking.dispatchedAt || dispatchData.dispatchedAt || null;
  const dispatchedBy = booking.dispatchedBy || dispatchData.dispatchedBy || null;
  const assignedDJFromDispatch = dispatchData.assignedDJName || null;
  const assignedEmailFromDispatch = dispatchData.assignedDJEmail || null;

  const [reviewComplete, setReviewComplete] = useState(booking.reviewComplete || false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [assignedDJEmail, setAssignedDJEmail] = useState(
    booking.assignedDJEmail || assignedEmailFromDispatch || ""
  );
  const [assignedDJName, setAssignedDJName] = useState(
    booking.assignedDJName || assignedDJFromDispatch || booking.preferredDJ || ""
  );

  // Editable final details state - comprehensive worksheet fields
  const [editableDetails, setEditableDetails] = useState({
    // Client Information
    clientName: booking.name || "",
    clientEmail: booking.email || "",
    clientPhone: booking.phoneAreaCode && booking.phoneNumber 
      ? `${booking.phoneAreaCode} ${booking.phoneNumber}` 
      : "",
    
    // Event Information
    eventType: booking.eventType || "",
    eventDate: booking.eventDate || "",
    numberOfGuests: booking.numberOfGuests?.toString() || "",
    
    // Venue Information
    venueName: booking.venueName || "",
    venueAddress: booking.venueAddress || "",
    venueAddress2: booking.venueAddress2 || "",
    venueTown: booking.venueTown || "",
    venueCounty: booking.venueCounty || "",
    venuePostcode: booking.venuePostcode || "",
    venueContact: booking.venueContact || "",
    venuePhone: booking.venuePhoneAreaCode && booking.venuePhoneNumber
      ? `${booking.venuePhoneAreaCode} ${booking.venuePhoneNumber}`
      : "",
    
    // Timing
    djArrivalTime: booking.djArrivalTime || "",
    djStartTime: booking.djStartTime || "",
    djFinishTime: booking.djFinishTime || "",
    
    // Technical Setup
    djSetupLocation: booking.djSetupLocation || "",
    djParking: booking.djParking || "",
    soundLimiter: booking.soundLimiter ? "Yes" : "No",
    
    // Music Preferences
    firstDance: booking.firstDance || "",
    lastSong: booking.lastSong || "",
    musicRequests: booking.musicRequests || "",
    musicDislikes: booking.musicDislikes || "",
    musicNotesToDJ: booking.musicNotesToDJ || "",
  });

  // Update editableDetails when booking prop changes (e.g., after fetchBooking)
  useEffect(() => {
    setEditableDetails({
      // Client Information
      clientName: booking.name || "",
      clientEmail: booking.email || "",
      clientPhone: booking.phoneAreaCode && booking.phoneNumber 
        ? `${booking.phoneAreaCode} ${booking.phoneNumber}` 
        : "",
      
      // Event Information
      eventType: booking.eventType || "",
      eventDate: booking.eventDate || "",
      numberOfGuests: booking.numberOfGuests?.toString() || "",
      
      // Venue Information
      venueName: booking.venueName || "",
      venueAddress: booking.venueAddress || "",
      venueAddress2: booking.venueAddress2 || "",
      venueTown: booking.venueTown || "",
      venueCounty: booking.venueCounty || "",
      venuePostcode: booking.venuePostcode || "",
      venueContact: booking.venueContact || "",
      venuePhone: booking.venuePhoneAreaCode && booking.venuePhoneNumber
        ? `${booking.venuePhoneAreaCode} ${booking.venuePhoneNumber}`
        : "",
      
      // Timing
      djArrivalTime: booking.djArrivalTime || "",
      djStartTime: booking.djStartTime || "",
      djFinishTime: booking.djFinishTime || "",
      
      // Technical Setup
      djSetupLocation: booking.djSetupLocation || "",
      djParking: booking.djParking || "",
      soundLimiter: booking.soundLimiter ? "Yes" : "No",
      
      // Music Preferences
      firstDance: booking.firstDance || "",
      lastSong: booking.lastSong || "",
      musicRequests: booking.musicRequests || "",
      musicDislikes: booking.musicDislikes || "",
      musicNotesToDJ: booking.musicNotesToDJ || "",
    });
    
    // Update assigned DJ info when booking changes
    setAssignedDJEmail(booking.assignedDJEmail || assignedEmailFromDispatch || "");
    setAssignedDJName(booking.assignedDJName || assignedDJFromDispatch || booking.preferredDJ || "");
    setReviewComplete(booking.reviewComplete || false);
  }, [booking, assignedEmailFromDispatch, assignedDJFromDispatch]);

  const dispatchStatus = dispatchedAt ? "Dispatched" : reviewComplete ? "Reviewed" : "Draft";

  const handleDispatch = async () => {
    if (!reviewComplete) {
      alert("Please mark review as complete before dispatching.");
      return;
    }

    if (!assignedDJEmail || !assignedDJName) {
      alert("Please provide DJ/Agent name and email.");
      return;
    }

    setIsDispatching(true);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedDJName,
          assignedDJEmail,
          finalDetails: editableDetails,
        }),
      });

      if (response.ok) {
        alert("Event details dispatched to artist successfully!");
        if (onUpdate) onUpdate();
      } else {
        const error = await response.json();
        alert(`Failed to dispatch: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error dispatching:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsDispatching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Draft: "bg-gray-700 text-gray-300 border-gray-600",
      Reviewed: "bg-yellow-900/30 text-yellow-400 border-yellow-700",
      Dispatched: "bg-green-900/30 text-green-400 border-green-700",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-bold border ${styles[status as keyof typeof styles] || styles.Draft}`}>
        {status}
      </span>
    );
  };

  const formattedEventDate = booking.eventDate
    ? new Date(booking.eventDate).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not set";

  return (
    <Card className="bg-gray-800 border-2 border-gray-700">
      <CardHeader className="border-b border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-champagne-gold" />
            Artist Dispatch Module
          </CardTitle>
          {getStatusBadge(dispatchStatus)}
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Assigned DJ/Agent */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Assigned Artist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="djName" className="text-gray-300 text-sm">DJ/Agent Name</Label>
              <Input
                id="djName"
                value={assignedDJName}
                onChange={(e) => setAssignedDJName(e.target.value)}
                placeholder="DJ Name"
                className="bg-gray-800 text-white border-gray-600 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="djEmail" className="text-gray-300 text-sm">Email Address</Label>
              <Input
                id="djEmail"
                type="email"
                value={assignedDJEmail}
                onChange={(e) => setAssignedDJEmail(e.target.value)}
                placeholder="dj@example.com"
                className="bg-gray-800 text-white border-gray-600 mt-1"
              />
            </div>
          </div>
          {assignedDJName && assignedDJEmail && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-300">
              <User className="w-4 h-4 text-champagne-gold" />
              <span>{assignedDJName}</span>
              <Mail className="w-4 h-4 text-champagne-gold ml-2" />
              <span>{assignedDJEmail}</span>
            </div>
          )}
        </div>

        {/* Review Screen: Side-by-Side Comparison */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Final Details Review</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Submitted Details (Read-Only) */}
            <div className="space-y-4">
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                <h4 className="text-sm font-bold text-blue-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Client Submitted
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Venue:</span>
                    <p className="text-white font-medium">{booking.venueName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <p className="text-white font-medium">{formattedEventDate}</p>
                  </div>
                  {booking.djArrivalTime && (
                    <div>
                      <span className="text-gray-400">Arrival:</span>
                      <p className="text-white font-medium">{booking.djArrivalTime}</p>
                    </div>
                  )}
                  {booking.djStartTime && (
                    <div>
                      <span className="text-gray-400">Start:</span>
                      <p className="text-white font-medium">{booking.djStartTime}</p>
                    </div>
                  )}
                  {booking.djFinishTime && (
                    <div>
                      <span className="text-gray-400">Finish:</span>
                      <p className="text-white font-medium">{booking.djFinishTime}</p>
                    </div>
                  )}
                  {booking.firstDance && (
                    <div>
                      <span className="text-gray-400">First Dance:</span>
                      <p className="text-white font-medium">{booking.firstDance}</p>
                    </div>
                  )}
                  {booking.musicDislikes && (
                    <div>
                      <span className="text-gray-400">Do-Not-Plays:</span>
                      <p className="text-white font-medium whitespace-pre-wrap">{booking.musicDislikes}</p>
                    </div>
                  )}
                  {booking.musicNotesToDJ && (
                    <div>
                      <span className="text-gray-400">Notes:</span>
                      <p className="text-white font-medium whitespace-pre-wrap">{booking.musicNotesToDJ}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Editable Version */}
            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                <h4 className="text-sm font-bold text-green-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Editable Version (To Send)
                </h4>
                <div className="space-y-4 text-sm max-h-[700px] overflow-y-auto pr-2">
                  {/* Client Information */}
                  <div className="border-b border-green-700/30 pb-3">
                    <Label className="text-gray-400 text-xs uppercase mb-2 block">Client Details</Label>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-gray-300 text-xs">Client Name</Label>
                        <Input
                          value={editableDetails.clientName}
                          onChange={(e) => setEditableDetails({ ...editableDetails, clientName: e.target.value })}
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-gray-300 text-xs">Email</Label>
                          <Input
                            type="email"
                            value={editableDetails.clientEmail}
                            onChange={(e) => setEditableDetails({ ...editableDetails, clientEmail: e.target.value })}
                            className="bg-gray-800 text-white border-gray-600 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 text-xs">Phone</Label>
                          <Input
                            value={editableDetails.clientPhone}
                            onChange={(e) => setEditableDetails({ ...editableDetails, clientPhone: e.target.value })}
                            placeholder="01234 567890"
                            className="bg-gray-800 text-white border-gray-600 mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Event Information */}
                  <div className="border-b border-green-700/30 pb-3">
                    <Label className="text-gray-400 text-xs uppercase mb-2 block">Event Information</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-gray-300 text-xs">Event Type</Label>
                        <Input
                          value={editableDetails.eventType}
                          onChange={(e) => setEditableDetails({ ...editableDetails, eventType: e.target.value })}
                          placeholder="Wedding / Party / Corporate"
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-xs">Number of Guests</Label>
                        <Input
                          type="number"
                          value={editableDetails.numberOfGuests}
                          onChange={(e) => setEditableDetails({ ...editableDetails, numberOfGuests: e.target.value })}
                          placeholder="150"
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Venue Information */}
                  <div className="border-b border-green-700/30 pb-3">
                    <Label className="text-gray-400 text-xs uppercase mb-2 block flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Venue Details
                    </Label>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-gray-300 text-xs">Venue Name</Label>
                        <Input
                          value={editableDetails.venueName}
                          onChange={(e) => setEditableDetails({ ...editableDetails, venueName: e.target.value })}
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-xs">Address Line 1</Label>
                        <Input
                          value={editableDetails.venueAddress}
                          onChange={(e) => setEditableDetails({ ...editableDetails, venueAddress: e.target.value })}
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-xs">Address Line 2</Label>
                        <Input
                          value={editableDetails.venueAddress2}
                          onChange={(e) => setEditableDetails({ ...editableDetails, venueAddress2: e.target.value })}
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-gray-300 text-xs">Town</Label>
                          <Input
                            value={editableDetails.venueTown}
                            onChange={(e) => setEditableDetails({ ...editableDetails, venueTown: e.target.value })}
                            className="bg-gray-800 text-white border-gray-600 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 text-xs">County</Label>
                          <Input
                            value={editableDetails.venueCounty}
                            onChange={(e) => setEditableDetails({ ...editableDetails, venueCounty: e.target.value })}
                            className="bg-gray-800 text-white border-gray-600 mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300 text-xs">Postcode</Label>
                        <Input
                          value={editableDetails.venuePostcode}
                          onChange={(e) => setEditableDetails({ ...editableDetails, venuePostcode: e.target.value })}
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-gray-300 text-xs">Venue Contact Name</Label>
                          <Input
                            value={editableDetails.venueContact}
                            onChange={(e) => setEditableDetails({ ...editableDetails, venueContact: e.target.value })}
                            className="bg-gray-800 text-white border-gray-600 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 text-xs">Venue Phone</Label>
                          <Input
                            value={editableDetails.venuePhone}
                            onChange={(e) => setEditableDetails({ ...editableDetails, venuePhone: e.target.value })}
                            placeholder="01234 567890"
                            className="bg-gray-800 text-white border-gray-600 mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timing */}
                  <div className="border-b border-green-700/30 pb-3">
                    <Label className="text-gray-400 text-xs uppercase mb-2 block flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Timings
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-gray-300 text-xs">Arrival Time</Label>
                        <Input
                          value={editableDetails.djArrivalTime}
                          onChange={(e) => setEditableDetails({ ...editableDetails, djArrivalTime: e.target.value })}
                          placeholder="18:00"
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-xs">Start Time</Label>
                        <Input
                          value={editableDetails.djStartTime}
                          onChange={(e) => setEditableDetails({ ...editableDetails, djStartTime: e.target.value })}
                          placeholder="19:00"
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-xs">Finish Time</Label>
                        <Input
                          value={editableDetails.djFinishTime}
                          onChange={(e) => setEditableDetails({ ...editableDetails, djFinishTime: e.target.value })}
                          placeholder="00:00"
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Technical Setup */}
                  <div className="border-b border-green-700/30 pb-3">
                    <Label className="text-gray-400 text-xs uppercase mb-2 block flex items-center gap-1">
                      <Home className="w-3 h-3" /> Technical Setup
                    </Label>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-gray-300 text-xs">Setup Location</Label>
                        <Textarea
                          value={editableDetails.djSetupLocation}
                          onChange={(e) => setEditableDetails({ ...editableDetails, djSetupLocation: e.target.value })}
                          placeholder="Where to set up equipment (e.g., 'Main hall, left of stage')"
                          rows={2}
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-xs">Parking Information</Label>
                        <Textarea
                          value={editableDetails.djParking}
                          onChange={(e) => setEditableDetails({ ...editableDetails, djParking: e.target.value })}
                          placeholder="Parking location and access instructions"
                          rows={2}
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-xs">Sound Limiter</Label>
                        <select
                          value={editableDetails.soundLimiter}
                          onChange={(e) => setEditableDetails({ ...editableDetails, soundLimiter: e.target.value })}
                          className="bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-2 mt-1 w-full text-sm"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Music Preferences */}
                  <div className="border-b border-green-700/30 pb-3">
                    <Label className="text-gray-400 text-xs uppercase mb-2 block flex items-center gap-1">
                      <Music className="w-3 h-3" /> Music Preferences
                    </Label>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-gray-300 text-xs">First Dance</Label>
                        <Input
                          value={editableDetails.firstDance}
                          onChange={(e) => setEditableDetails({ ...editableDetails, firstDance: e.target.value })}
                          placeholder="Song title & artist"
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-xs">Last Song</Label>
                        <Input
                          value={editableDetails.lastSong}
                          onChange={(e) => setEditableDetails({ ...editableDetails, lastSong: e.target.value })}
                          placeholder="Song title & artist"
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-xs">Must-Plays / Requests</Label>
                        <Textarea
                          value={editableDetails.musicRequests}
                          onChange={(e) => setEditableDetails({ ...editableDetails, musicRequests: e.target.value })}
                          placeholder="List of songs/styles to include (one per line)"
                          rows={3}
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-xs">Do-Not-Plays</Label>
                        <Textarea
                          value={editableDetails.musicDislikes}
                          onChange={(e) => setEditableDetails({ ...editableDetails, musicDislikes: e.target.value })}
                          placeholder="List of songs/styles to avoid (one per line)"
                          rows={3}
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-xs">Additional Notes to DJ/Musician</Label>
                        <Textarea
                          value={editableDetails.musicNotesToDJ}
                          onChange={(e) => setEditableDetails({ ...editableDetails, musicNotesToDJ: e.target.value })}
                          placeholder="Any special instructions, announcements, or requests"
                          rows={3}
                          className="bg-gray-800 text-white border-gray-600 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Complete Checkbox & Dispatch Action */}
        <div className="border-t border-gray-700 pt-6 space-y-4">
          <div className="flex items-start gap-3 bg-gray-900/30 rounded-lg p-4">
            <Checkbox
              id="reviewComplete"
              checked={reviewComplete}
              onCheckedChange={(checked) => setReviewComplete(checked === true)}
              className="mt-1 border-gray-600 data-[state=checked]:bg-champagne-gold data-[state=checked]:border-champagne-gold"
            />
            <Label htmlFor="reviewComplete" className="text-gray-300 cursor-pointer flex-1">
              Review Complete - I have verified the final details and they are ready to send to the artist.
            </Label>
          </div>

          {dispatchedAt && (
            <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-300 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Dispatched on {new Date(dispatchedAt).toLocaleDateString("en-GB")} at{" "}
                  {new Date(dispatchedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  {dispatchedBy && ` by ${dispatchedBy}`}
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={handleDispatch}
            disabled={!reviewComplete || isDispatching || !!dispatchedAt}
            className="w-full bg-champagne-gold text-black hover:bg-gold-light font-bold text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDispatching ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Dispatching...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send to Artist
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
