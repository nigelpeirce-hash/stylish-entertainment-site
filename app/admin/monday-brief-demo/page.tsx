"use client";

import { generateMondayBriefEmail } from "@/lib/monday-brief-email";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Smartphone, Mail } from "lucide-react";
import { useState } from "react";

export default function MondayBriefDemo() {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:4000";

  // Sample brief data for demo
  const demoBrief = {
    weekOf: "Monday, 20 January 2026",
    redActions: [
      {
        id: "red-1",
        bookingId: "demo-booking-1",
        clientName: "Sarah & James",
        venueName: "Babington House",
        eventDate: "Saturday, 1 February 2026",
        daysRemaining: 12,
        reason: "Final details not confirmed",
        type: "red" as const,
        directLink: `${baseUrl}/admin/bookings/demo-booking-1`,
      },
      {
        id: "red-2",
        bookingId: "demo-booking-2",
        clientName: "Emma & Tom",
        venueName: "Mells Barn",
        eventDate: "Friday, 7 February 2026",
        daysRemaining: 18,
        reason: "Deposit not received",
        type: "red" as const,
        directLink: `${baseUrl}/admin/bookings/demo-booking-2`,
      },
    ],
    goldActions: [
      {
        id: "gold-1",
        bookingId: "demo-booking-3",
        clientName: "Sophie & Mark",
        venueName: "Pennard House",
        eventDate: "Saturday, 15 February 2026",
        daysRemaining: 26,
        reason: "2 unread portal messages",
        type: "gold" as const,
        directLink: `${baseUrl}/admin/bookings/demo-booking-3#communications`,
      },
    ],
    blueActions: [
      {
        id: "blue-1",
        bookingId: "demo-booking-4",
        clientName: "Lucy & David",
        venueName: "Kin House",
        eventDate: "Saturday, 22 February 2026",
        daysRemaining: 33,
        reason: "DJ Nige (DJ) - Availability confirmed, awaiting confirmation",
        type: "blue" as const,
        staffName: "DJ Nige",
        directLink: `${baseUrl}/admin/bookings/demo-booking-4`,
      },
    ],
    totalActions: 4,
  };

  // Generate email HTML
  const emailHtml = generateMondayBriefEmail(demoBrief, baseUrl);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Monday Morning Brief - Email Preview</h1>
          <p className="text-gray-400">See how the Monday Brief email will look when sent</p>
        </div>

        {/* Controls */}
        <Card className="bg-gray-800 border-champagne-gold/30 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">View Mode:</span>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("desktop")}
                    className={viewMode === "desktop" ? "bg-champagne-gold text-black" : ""}
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Desktop
                  </Button>
                  <Button
                    variant={viewMode === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("mobile")}
                    className={viewMode === "mobile" ? "bg-champagne-gold text-black" : ""}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Mobile
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                <Mail className="w-4 h-4 inline mr-2" />
                Sent to: info@stylishentertainment.co.uk
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Preview */}
        <Card className="bg-gray-800 border-champagne-gold/30">
          <CardHeader>
            <CardTitle>Email Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`bg-white rounded-lg overflow-hidden ${
                viewMode === "mobile" ? "max-w-md mx-auto" : "w-full"
              }`}
            >
              <iframe
                srcDoc={emailHtml}
                className="w-full border-0"
                style={{
                  height: viewMode === "mobile" ? "800px" : "1000px",
                  minHeight: "600px",
                }}
                title="Monday Brief Email Preview"
              />
            </div>
          </CardContent>
        </Card>

        {/* Demo Data Info */}
        <Card className="bg-gray-800 border-champagne-gold/30 mt-6">
          <CardHeader>
            <CardTitle>Demo Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">
                This preview uses sample data to demonstrate the email format:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                <li>
                  <span className="text-red-400">2 Red Actions</span> - Urgent items requiring attention
                </li>
                <li>
                  <span className="text-champagne-gold">1 Gold Action</span> - Unread portal messages
                </li>
                <li>
                  <span className="text-blue-400">1 Blue Action</span> - Staff availability confirmed
                </li>
              </ul>
              <p className="text-gray-400 mt-4">
                In production, the email will contain real booking data from your database.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
