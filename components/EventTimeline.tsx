"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Clock, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useState } from "react";

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
}

interface EventTimelineProps {
  bookingId: string;
  eventDate: Date;
  initialEvents?: TimelineEvent[];
  onUpdate?: (events: TimelineEvent[]) => Promise<void>;
}

export default function EventTimeline({
  bookingId,
  eventDate,
  initialEvents = [],
  onUpdate,
}: EventTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ time: "", title: "", description: "" });

  const defaultEvents: TimelineEvent[] = [
    { id: "1", time: "14:00", title: "Guests Arrive", description: "Welcome drinks" },
    { id: "2", time: "15:00", title: "Ceremony", description: "Main ceremony begins" },
    { id: "3", time: "16:00", title: "Photos & Cocktails", description: "Photography session" },
    { id: "4", time: "18:00", title: "Reception & Dinner", description: "Main meal service" },
    { id: "5", time: "19:30", title: "Speeches", description: "Toasts and speeches" },
    { id: "6", time: "20:00", title: "First Dance", description: "Couple's first dance" },
    { id: "7", time: "20:30", title: "Party Begins", description: "DJ starts, dance floor opens" },
    { id: "8", time: "23:30", title: "Last Song", description: "Final song of the night" },
    { id: "9", time: "00:00", title: "Event Ends", description: "Guests depart" },
  ];

  const handleAddEvent = () => {
    if (newEvent.time && newEvent.title) {
      const event: TimelineEvent = {
        id: Date.now().toString(),
        time: newEvent.time,
        title: newEvent.title,
        description: newEvent.description || undefined,
      };
      setEvents([...events, event].sort((a, b) => a.time.localeCompare(b.time)));
      setNewEvent({ time: "", title: "", description: "" });
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleSave = async () => {
    if (onUpdate) {
      await onUpdate(events);
    } else {
      // Fallback: save via API
      const response = await fetch(`/api/client/bookings/${bookingId}/timeline`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        alert("Failed to save timeline");
      }
    }
    setIsEditing(false);
  };

  const loadDefaults = () => {
    if (events.length === 0) {
      setEvents(defaultEvents);
    }
  };

  const displayEvents = events.length > 0 ? events : defaultEvents;

  return (
    <Card className="bg-gray-800 border-champagne-gold/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-champagne-gold" />
            Event Day Timeline
          </CardTitle>
          {!isEditing && (
            <Button
              onClick={() => {
                loadDefaults();
                setIsEditing(true);
              }}
              variant="outline"
              size="sm"
              className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Customize
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            {/* Existing Events */}
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 bg-gray-900 rounded border border-gray-700"
                >
                  <div className="flex-1 grid grid-cols-12 gap-2">
                    <Input
                      value={event.time}
                      onChange={(ev) =>
                        setEvents(
                          events.map((evt) =>
                            evt.id === event.id ? { ...evt, time: ev.target.value } : evt
                          )
                        )
                      }
                      placeholder="HH:MM"
                      className="col-span-3 bg-gray-800 text-white border-gray-600"
                    />
                    <Input
                      value={event.title}
                      onChange={(ev) =>
                        setEvents(
                          events.map((evt) =>
                            evt.id === event.id ? { ...evt, title: ev.target.value } : evt
                          )
                        )
                      }
                      placeholder="Event title"
                      className="col-span-9 bg-gray-800 text-white border-gray-600"
                    />
                  </div>
                  <Button
                    onClick={() => handleDeleteEvent(event.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add New Event */}
            <div className="p-4 bg-gray-900 rounded border border-dashed border-gray-700">
              <Label className="text-white mb-3 block">Add New Event</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2">
                  <Input
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    placeholder="HH:MM"
                    className="col-span-3 bg-gray-800 text-white border-gray-600"
                  />
                  <Input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Event title"
                    className="col-span-9 bg-gray-800 text-white border-gray-600"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddEvent}
                    size="sm"
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              </div>
            </div>

            {/* Save/Cancel */}
            <div className="flex gap-2 justify-end pt-2 border-t border-gray-700">
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-champagne-gold text-black hover:bg-gold-light"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Timeline
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 relative"
              >
                {/* Timeline Line */}
                {index < displayEvents.length - 1 && (
                  <div className="absolute left-3 top-12 bottom-0 w-0.5 bg-champagne-gold/30" />
                )}

                {/* Time Badge */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-champagne-gold/20 border-2 border-champagne-gold flex items-center justify-center">
                    <span className="text-xs font-bold text-champagne-gold">
                      {event.time}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="flex-1 pb-6">
                  <h4 className="text-lg font-semibold text-white mb-1">{event.title}</h4>
                  {event.description && (
                    <p className="text-sm text-gray-400">{event.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
