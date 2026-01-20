"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  staffConfirmationEmail, 
  StaffConfirmationData 
} from "@/lib/email-staff-confirmation";
import { 
  staffCancellationEmail, 
  StaffCancellationData 
} from "@/lib/email-staff-cancellation";
import {
  inquiryAutoresponder,
  gentleReminder,
  bookingConfirmation,
  fourWeekCheckin,
  weekOfExcitement,
  postWeddingMagic,
  JourneyEmailData,
} from "@/lib/email-journey-templates";
import { Monitor, Smartphone, Mail, Info } from "lucide-react";
import { motion } from "framer-motion";

interface EmailTemplate {
  id: string;
  name: string;
  category: "client" | "staff" | "internal";
  trigger: string;
  generatePreview: () => { subject: string; html: string };
}

// Mock data generators
const mockStaffData: StaffConfirmationData = {
  staffName: "Sarah Johnson",
  eventDate: "Saturday, 15th June 2024",
  venueName: "Babington House",
  role: "Lighting Technician",
  agreedFee: 350,
  senderName: "Nigel",
};

const mockCancellationData: StaffCancellationData = {
  staffName: "Sarah Johnson",
  eventDate: "Saturday, 15th June 2024",
  venueName: "Babington House",
  role: "Lighting Technician",
  reason: "Client has changed their requirements and no longer requires lighting services.",
  senderName: "Nigel",
};

const mockJourneyData: JourneyEmailData = {
  clientName: "Emma & James",
  eventType: "Wedding",
  eventDate: "Saturday, 15th June 2024",
  venueName: "Babington House",
  clientAdminUrl: "https://stylishentertainment.co.uk/client/dashboard",
  brochureUrl: "https://stylishentertainment.co.uk/brochures/babington-house-2024.pdf",
};

// Final Brief mock HTML (from dispatch route)
const generateFinalBriefPreview = (): { subject: string; html: string } => {
  const eventDate = "Saturday, 15th June 2024";
  const booking = {
    name: "Emma & James",
    email: "emma.james@example.com",
    eventType: "Wedding",
    venueName: "Babington House",
    venueAddress: "Babington House",
    venueTown: "Frome",
    venueCounty: "Somerset",
    venuePostcode: "BA11 3RW",
    djArrivalTime: "14:00",
    djStartTime: "18:00",
    djFinishTime: "00:00",
    djSetupLocation: "Main marquee, near the dance floor",
    djParking: "Parking available at the rear of the venue",
    soundLimiter: true,
    firstDance: "At Last - Etta James",
    lastSong: "New York, New York - Frank Sinatra",
    musicRequests: "Jazz standards for cocktail hour, upbeat disco for reception",
    musicDislikes: "No heavy metal or rap",
    musicNotesToDJ: "Please keep volume moderate during dinner service",
    numberOfGuests: 120,
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #ffffff;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      text-align: center;
      padding: 30px 20px;
      border-bottom: 1px solid #D4AF37;
    }
    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: 1px;
    }
    .content {
      padding: 30px 20px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 10px;
      border-bottom: 1px solid #D4AF37;
      padding-bottom: 5px;
    }
    .detail-row {
      margin-bottom: 8px;
    }
    .detail-label {
      font-weight: 600;
      color: #666;
      display: inline-block;
      min-width: 120px;
    }
    .detail-value {
      color: #1a1a1a;
    }
    .footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #D4AF37;
      font-size: 12px;
      color: #666;
    }
    .confirm-button {
      text-align: center;
      padding: 30px 20px;
      margin-top: 30px;
      border-top: 1px solid #D4AF37;
    }
    .confirm-button a {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%);
      color: #1a1a1a;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">S</div>
    </div>
    <div class="content">
      <h1 style="font-size: 24px; margin-bottom: 20px; color: #1a1a1a;">Event Details</h1>
      
      <div class="section">
        <div class="section-title">Client Information</div>
        <div class="detail-row">
          <span class="detail-label">Client Name:</span>
          <span class="detail-value">${booking.name}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${booking.email}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Event Type:</span>
          <span class="detail-value">${booking.eventType}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Number of Guests:</span>
          <span class="detail-value">${booking.numberOfGuests}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Venue Information</div>
        <div class="detail-row">
          <span class="detail-label">Venue Name:</span>
          <span class="detail-value">${booking.venueName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Address:</span>
          <span class="detail-value">${booking.venueAddress}, ${booking.venueTown}, ${booking.venueCounty} ${booking.venuePostcode}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Event Timings</div>
        <div class="detail-row">
          <span class="detail-label">Event Date:</span>
          <span class="detail-value">${eventDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Arrival Time:</span>
          <span class="detail-value">${booking.djArrivalTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Start Time:</span>
          <span class="detail-value">${booking.djStartTime}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Finish Time:</span>
          <span class="detail-value">${booking.djFinishTime}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Technical Setup</div>
        <div class="detail-row">
          <span class="detail-label">Setup Location:</span>
          <span class="detail-value">${booking.djSetupLocation}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Parking Information:</span>
          <span class="detail-value">${booking.djParking}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Sound Limiter:</span>
          <span class="detail-value">${booking.soundLimiter ? "Yes" : "No"}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Music Preferences</div>
        <div class="detail-row">
          <span class="detail-label">First Dance:</span>
          <span class="detail-value">${booking.firstDance}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Last Song:</span>
          <span class="detail-value">${booking.lastSong}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Must-Plays / Requests:</span>
          <span class="detail-value">${booking.musicRequests}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Do-Not-Plays:</span>
          <span class="detail-value">${booking.musicDislikes}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Additional Notes:</span>
          <span class="detail-value">${booking.musicNotesToDJ}</span>
        </div>
      </div>
    </div>
    <div class="confirm-button">
      <p style="margin-bottom: 20px; color: #1a1a1a; font-weight: 500;">Please confirm that you have received and understood these final details:</p>
      <a href="#">I have received and understood the final details</a>
    </div>
    <div class="footer">
      <p>Stylish Entertainment</p>
      <p>This is an automated dispatch. Please confirm receipt.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return {
    subject: `Event Details - ${booking.eventType} at ${booking.venueName} - ${eventDate}`,
    html,
  };
};

// Define all email templates
const emailTemplates: EmailTemplate[] = [
  // Staff Templates
  {
    id: "staff-confirmation",
    name: "Staff Confirmation (Hold Date)",
    category: "staff",
    trigger: "Triggered when admin confirms a staff member for a booking via 'Confirm Job' button",
    generatePreview: () => staffConfirmationEmail(mockStaffData),
  },
  {
    id: "staff-cancellation",
    name: "Staff Cancellation",
    category: "staff",
    trigger: "Triggered when admin cancels a staff assignment via the cancellation route",
    generatePreview: () => staffCancellationEmail(mockCancellationData),
  },
  {
    id: "final-brief",
    name: "Final Brief (Staff Dispatch)",
    category: "staff",
    trigger: "Triggered when admin dispatches final details to staff member via /api/admin/bookings/[id]/dispatch with staffAssignmentId",
    generatePreview: generateFinalBriefPreview,
  },
  // Client Journey Templates
  {
    id: "inquiry-autoresponder",
    name: "New Enquiry Auto-Responder",
    category: "client",
    trigger: "Triggered immediately when a new enquiry is submitted via contact form or booking form",
    generatePreview: () => inquiryAutoresponder(mockJourneyData),
  },
  {
    id: "gentle-reminder",
    name: "Gentle Reminder (3-Day Follow-up)",
    category: "client",
    trigger: "Triggered 3 days after initial enquiry if booking status is still 'pending'",
    generatePreview: () => gentleReminder(mockJourneyData),
  },
  {
    id: "booking-confirmation",
    name: "Booking Confirmation",
    category: "client",
    trigger: "Triggered when booking status changes to 'confirmed' (after deposit received)",
    generatePreview: () => bookingConfirmation(mockJourneyData),
  },
  {
    id: "4-week-checkin",
    name: "4-Week Check-in",
    category: "client",
    trigger: "Triggered automatically 4 weeks before event date to request final music preferences",
    generatePreview: () => fourWeekCheckin(mockJourneyData),
  },
  {
    id: "week-of-excitement",
    name: "Week-of Excitement",
    category: "client",
    trigger: "Triggered automatically 7 days before event date as a 'we're ready' message",
    generatePreview: () => weekOfExcitement(mockJourneyData),
  },
  {
    id: "post-wedding-magic",
    name: "Post-Wedding Magic",
    category: "client",
    trigger: "Triggered automatically 3 days after event date to request feedback and reviews",
    generatePreview: () => postWeddingMagic(mockJourneyData),
  },
];

export default function EmailPreviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [previewData, setPreviewData] = useState<{ subject: string; html: string } | null>(null);

  useEffect(() => {
    // Dev bypass check
    if (typeof window !== "undefined") {
      const devBypass = sessionStorage.getItem("dev_admin_bypass") === "true";
      if (devBypass) {
        return;
      }
    }

    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (selectedTemplate) {
      const data = selectedTemplate.generatePreview();
      setPreviewData(data);
    }
  }, [selectedTemplate]);

  // Auto-select first template on load
  useEffect(() => {
    if (!selectedTemplate && emailTemplates.length > 0) {
      setSelectedTemplate(emailTemplates[0]);
    }
  }, [selectedTemplate]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "client":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "staff":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "internal":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto max-w-7xl py-6 px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Mail className="w-8 h-8 text-champagne-gold" />
            Email Template Previews
          </h1>
          <p className="text-gray-400">
            Preview and audit all CRM email templates with mock data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Template List & Triggers */}
          <div className="lg:col-span-1 space-y-4">
            {/* Template Gallery */}
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="text-lg">Template Gallery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                {emailTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTemplate?.id === template.id
                        ? "bg-champagne-gold/20 border-2 border-champagne-gold"
                        : "bg-gray-700/50 border-2 border-transparent hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white mb-1">
                          {template.name}
                        </p>
                        <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Trigger Audit List */}
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-champagne-gold" />
                  Email Triggers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {emailTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-lg border ${
                      selectedTemplate?.id === template.id
                        ? "bg-champagne-gold/10 border-champagne-gold/50"
                        : "bg-gray-700/30 border-gray-600/50"
                    }`}
                  >
                    <p className="text-xs font-semibold text-champagne-gold mb-1">
                      {template.name}
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {template.trigger}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Preview Area */}
          <div className="lg:col-span-3">
            {selectedTemplate && previewData ? (
              <Card className="bg-gray-800 border-champagne-gold/30">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {selectedTemplate.name}
                      </CardTitle>
                      <p className="text-sm text-gray-400">
                        Subject: <span className="text-white">{previewData.subject}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={viewMode === "desktop" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("desktop")}
                        className={
                          viewMode === "desktop"
                            ? "bg-champagne-gold text-black"
                            : "border-champagne-gold/50 text-champagne-gold"
                        }
                      >
                        <Monitor className="w-4 h-4 mr-2" />
                        Desktop
                      </Button>
                      <Button
                        variant={viewMode === "mobile" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("mobile")}
                        className={
                          viewMode === "mobile"
                            ? "bg-champagne-gold text-black"
                            : "border-champagne-gold/50 text-champagne-gold"
                        }
                      >
                        <Smartphone className="w-4 h-4 mr-2" />
                        Mobile
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className={`bg-white rounded-lg overflow-hidden border-2 border-gray-700 ${
                      viewMode === "mobile"
                        ? "max-w-sm mx-auto"
                        : "w-full"
                    }`}
                    style={{
                      height: viewMode === "mobile" ? "600px" : "800px",
                    }}
                  >
                    <iframe
                      srcDoc={previewData.html}
                      className="w-full h-full border-0"
                      title={`Preview: ${selectedTemplate.name}`}
                      sandbox="allow-same-origin"
                    />
                  </div>
                  {viewMode === "mobile" && (
                    <p className="text-xs text-gray-400 text-center mt-2">
                      Mobile view (375px width)
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-800 border-champagne-gold/30">
                <CardContent className="p-12 text-center">
                  <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Select a template from the gallery to preview
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
