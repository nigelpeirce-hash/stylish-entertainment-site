"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, MapPin, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface EnquiryCardProps {
  enquiry: {
    id: string;
    name: string;
    eventDate: string;
    venueName: string;
    venuePostcode: string | null;
    venueAddress: string | null;
    conflictStatus: string | null;
    priority: string;
    services: string[];
    numberOfGuests: number | null;
    isConflict?: boolean; // From NewEnquiry
    source?: string; // "booking" or "new_enquiry"
  };
  onClick: () => void;
  isDragging?: boolean;
}

export function EnquiryCard({
  enquiry,
  onClick,
  isDragging = false,
}: EnquiryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: enquiry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const getDaysUntilEvent = () => {
    try {
      const eventDate = new Date(enquiry.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      const days = differenceInDays(eventDate, today);
      return days;
    } catch {
      return null;
    }
  };

  const daysUntil = getDaysUntilEvent();
  const isUrgent = daysUntil !== null && daysUntil <= 14 && daysUntil >= 0;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMM yyyy");
    } catch {
      return dateString;
    }
  };

  const getVenueDisplay = () => {
    if (enquiry.venuePostcode) {
      return `${enquiry.venueName}, ${enquiry.venuePostcode}`;
    }
    if (enquiry.venueAddress) {
      return `${enquiry.venueName}, ${enquiry.venueAddress}`;
    }
    return enquiry.venueName;
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`
        bg-gray-800 border-gray-700 hover:border-champagne-gold/50 
        cursor-pointer transition-all hover:shadow-lg
        ${isDragging ? "shadow-2xl scale-105" : ""}
        ${isUrgent ? "border-orange-500/50 bg-orange-900/10" : ""}
      `}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header with Conflict Icon */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm mb-1 truncate">
                {enquiry.name}
              </h3>
              {(enquiry.conflictStatus || enquiry.isConflict) && (
                <div className="flex items-center gap-1 text-orange-400 text-xs">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Conflict Detected</span>
                </div>
              )}
              {enquiry.source === "new_enquiry" && (
                <div className="flex items-center gap-1 text-blue-400 text-xs mt-1">
                  <span className="px-1.5 py-0.5 bg-blue-600/20 rounded text-[10px]">New Inquiry</span>
                </div>
              )}
            </div>
          {enquiry.priority === "urgent" && (
            <Badge className="bg-red-600 text-white text-xs">Urgent</Badge>
          )}
        </div>

        {/* Event Date with Countdown */}
        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-4 h-4 text-champagne-gold flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium">{formatDate(enquiry.eventDate)}</p>
            {daysUntil !== null && (
              <p className={`text-xs mt-0.5 ${
                daysUntil < 0 
                  ? "text-gray-500" 
                  : daysUntil <= 7 
                  ? "text-red-400 font-semibold" 
                  : daysUntil <= 14 
                  ? "text-orange-400" 
                  : "text-gray-400"
              }`}>
                {daysUntil < 0 
                  ? `${Math.abs(daysUntil)} days ago` 
                  : daysUntil === 0 
                  ? "Today!" 
                  : daysUntil === 1 
                  ? "Tomorrow" 
                  : `In ${daysUntil} days`}
              </p>
            )}
          </div>
        </div>

        {/* Venue */}
        <div className="flex items-start gap-2 text-xs">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-gray-300 line-clamp-2">{getVenueDisplay()}</p>
        </div>

        {/* Services */}
        {enquiry.services && enquiry.services.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {enquiry.services.slice(0, 3).map((service, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs bg-gray-700/50 text-gray-300 border-gray-600"
              >
                {service}
              </Badge>
            ))}
            {enquiry.services.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs bg-gray-700/50 text-gray-300 border-gray-600"
              >
                +{enquiry.services.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Guests Count */}
        {enquiry.numberOfGuests && (
          <div className="text-xs text-gray-400">
            {enquiry.numberOfGuests} guests
          </div>
        )}
      </CardContent>
    </Card>
  );
}
