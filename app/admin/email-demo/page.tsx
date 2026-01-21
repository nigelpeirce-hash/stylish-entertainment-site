"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  enquiryAutoresponder,
  gentleReminder,
  bookingConfirmation,
  fourWeekCheckin,
  weekOfExcitement,
  postWeddingMagic,
} from "@/lib/email-journey-templates";
import { staffConfirmationEmail } from "@/lib/email-staff-confirmation";
import { staffCancellationEmail } from "@/lib/email-staff-cancellation";
import { generateMondayBriefEmail } from "@/lib/monday-brief-email";
import { Mail, Eye, Copy, Check } from "lucide-react";
import Link from "next/link";

// Demo data for email templates
const demoClientData = {
  clientName: "Sarah & Tom",
  eventType: "Wedding",
  eventDate: "Saturday, 15th March 2025",
  venueName: "Babington House",
  clientAdminUrl: "https://stylishentertainment.co.uk/client/dashboard",
  brochureUrl: "https://stylishentertainment.co.uk/brochure.pdf",
};

const demoStaffData = {
  staffName: "DJ Nige",
  eventDate: "Saturday, 15th March 2025",
  venueName: "Babington House",
  role: "DJ",
  agreedFee: 850,
  senderName: "Nigel",
};

const demoMondayBrief = {
  weekOf: "Monday, 20th January 2025",
  totalActions: 5,
  redActions: [
    {
      clientName: "Sarah & Tom",
      venueName: "Babington House",
      eventDate: "Saturday, 15th March 2025",
      daysRemaining: 14,
      reason: "Final details not confirmed",
      directLink: "/admin/bookings/123",
    },
  ],
  goldActions: [
    {
      clientName: "Emma & James",
      venueName: "Kin House",
      eventDate: "Saturday, 22nd March 2025",
      daysRemaining: 21,
      reason: "New portal message from client",
      directLink: "/admin/bookings/456",
    },
  ],
  blueActions: [
    {
      clientName: "Lucy & Mike",
      venueName: "Mells Barn",
      eventDate: "Saturday, 29th March 2025",
      daysRemaining: 28,
      reason: "Staff availability confirmed - awaiting confirmation",
      directLink: "/admin/bookings/789",
    },
  ],
};

export default function EmailDemoPage() {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const copyToClipboard = (html: string, emailId: string) => {
    navigator.clipboard.writeText(html);
    setCopiedEmail(emailId);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const openPreview = (html: string) => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    }
  };

  const journeyEmails = [
    {
      id: "enquiry",
      title: "Enquiry Auto-Responder",
      description: "Sent immediately after contact form submission",
      ...enquiryAutoresponder(demoClientData),
    },
    {
      id: "reminder",
      title: "Gentle Reminder",
      description: "Sent 3 days after enquiry if no booking confirmed",
      ...gentleReminder(demoClientData),
    },
    {
      id: "confirmation",
      title: "Booking Confirmation",
      description: "Sent after deposit received",
      ...bookingConfirmation(demoClientData),
    },
    {
      id: "4week",
      title: "4-Week Check-in",
      description: "Sent 4 weeks before event for final details",
      ...fourWeekCheckin(demoClientData),
    },
    {
      id: "weekof",
      title: "Week-of Excitement",
      description: "Sent the week before the event",
      ...weekOfExcitement(demoClientData),
    },
    {
      id: "postwedding",
      title: "Post-Wedding Magic",
      description: "Sent 3 days after event requesting feedback",
      ...postWeddingMagic(demoClientData),
    },
  ];

  const staffEmails = [
    {
      id: "staff-confirm",
      title: "Staff Confirmation",
      description: "Sent to staff when assigned to a booking",
      ...staffConfirmationEmail(demoStaffData),
    },
    {
      id: "staff-cancel",
      title: "Staff Cancellation",
      description: "Sent to staff when assignment is cancelled",
      ...staffCancellationEmail({
        ...demoStaffData,
        reason: "Client has changed their requirements",
      }),
    },
  ];

  const adminEmails = [
    {
      id: "monday-brief",
      title: "Monday Morning Brief",
      description: "Sent every Monday at 08:00 GMT with weekly actions",
      html: generateMondayBriefEmail(demoMondayBrief),
      subject: "Monday Morning Brief - STYLISH Entertainment",
    },
  ];

  const renderEmailCard = (email: {
    id: string;
    title: string;
    description: string;
    subject: string;
    html: string;
  }) => (
    <Card key={email.id} className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-champagne-gold" />
              {email.title}
            </CardTitle>
            <p className="text-sm text-gray-400 mt-2">{email.description}</p>
            <Badge variant="outline" className="mt-2">
              Subject: {email.subject}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openPreview(email.html)}
              className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(email.html, email.id)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              {copiedEmail === email.id ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy HTML
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800">
          <iframe
            srcDoc={email.html}
            className="w-full h-96 border-0"
            title={`Preview of ${email.title}`}
            sandbox="allow-same-origin"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
                <Mail className="w-8 h-8 text-champagne-gold" />
                Email Templates Demo
              </h1>
              <p className="text-gray-400">
                Preview all email templates that will be sent to clients and staff
              </p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="journey" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 border border-gray-700">
            <TabsTrigger value="journey">Customer Journey</TabsTrigger>
            <TabsTrigger value="staff">Staff Emails</TabsTrigger>
            <TabsTrigger value="admin">Admin Emails</TabsTrigger>
          </TabsList>

          <TabsContent value="journey" className="mt-6">
            <div className="mb-4 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Customer Journey Emails</h2>
              <p className="text-sm text-gray-400">
                Automated emails sent throughout the customer lifecycle, from initial enquiry to post-event feedback.
              </p>
            </div>
            {journeyEmails.map(renderEmailCard)}
          </TabsContent>

          <TabsContent value="staff" className="mt-6">
            <div className="mb-4 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Staff Communication Emails</h2>
              <p className="text-sm text-gray-400">
                Emails sent to freelance staff (DJs, musicians, etc.) for assignments and updates.
              </p>
            </div>
            {staffEmails.map(renderEmailCard)}
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
            <div className="mb-4 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Admin/Internal Emails</h2>
              <p className="text-sm text-gray-400">
                Automated emails sent to admin team for weekly briefings and notifications.
              </p>
            </div>
            {adminEmails.map(renderEmailCard)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
