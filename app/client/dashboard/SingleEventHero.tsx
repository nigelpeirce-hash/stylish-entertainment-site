"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import CountdownClock from "@/components/CountdownClock";
import WeddingPlanningChecklist from "@/components/WeddingPlanningChecklist";
import MusicPlaylistManager from "@/components/MusicPlaylistManager";
import EventTimeline from "@/components/EventTimeline";
import GuestCountTracker from "@/components/GuestCountTracker";
import BudgetTracker from "@/components/BudgetTracker";

interface SingleEventHeroProps {
  booking: any;
  onTaskToggle: (taskId: string, completed: boolean) => Promise<void>;
}

export function SingleEventHero({ booking, onTaskToggle }: SingleEventHeroProps) {
  return (
    <Card className="bg-gray-800/50 backdrop-blur-md border-champagne-gold/50">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-3xl md:text-4xl text-white mb-2">
              {booking.eventType}
            </CardTitle>
            <p className="text-gray-200 mb-1">
              <strong>Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}
            </p>
            <p className="text-gray-200 mb-1">
              <strong>Venue:</strong> {booking.venueName}
            </p>
            <p className="text-gray-200">
              <strong>Status:</strong>{" "}
              <span
                className={`capitalize ${
                  booking.status === "confirmed"
                    ? "text-green-400"
                    : booking.status === "pending"
                    ? "text-yellow-400"
                    : "text-gray-400"
                }`}
              >
                {booking.status}
              </span>
            </p>
          </div>
          {/* Countdown Clock with border and pulse */}
          <div className="border-2 border-champagne-gold/50 rounded-lg p-4 animate-pulse">
            <CountdownClock targetDate={new Date(booking.eventDate)} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            {/* Guest Count Tracker */}
            <GuestCountTracker
              bookingId={booking.id}
              initialCount={booking.numberOfGuests || 0}
            />
            {/* Event Timeline */}
            <EventTimeline
              bookingId={booking.id}
              eventDate={new Date(booking.eventDate)}
            />
          </TabsContent>

          <TabsContent value="planning" className="mt-6">
            {booking.eventType === "Wedding" && (
              <WeddingPlanningChecklist
                eventDate={new Date(booking.eventDate)}
                eventType={booking.eventType}
                completedTasks={booking.completedTasks || []}
                onTaskToggle={onTaskToggle}
              />
            )}
          </TabsContent>

          <TabsContent value="music" className="mt-6">
            <MusicPlaylistManager
              bookingId={booking.id}
              initialData={{
                musicRequests: booking.musicRequests,
                musicDislikes: booking.musicDislikes,
                firstDance: booking.firstDance,
                lastSong: booking.lastSong,
                musicNotesToDJ: booking.musicNotesToDJ,
              }}
            />
          </TabsContent>

          <TabsContent value="budget" className="mt-6">
            <BudgetTracker
              bookingId={booking.id}
              totalBudget={booking.budget}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
