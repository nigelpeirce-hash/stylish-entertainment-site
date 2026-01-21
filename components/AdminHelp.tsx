"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HelpCircle, Search, X, BookOpen, FileText, Mail, Calendar, Upload, Send, Inbox } from "lucide-react";
import { motion } from "framer-motion";

interface WorkflowDoc {
  id: string;
  title: string;
  category: string;
  icon: any;
  content: string;
  keywords: string[];
}

const workflows: WorkflowDoc[] = [
  {
    id: "90-day-command",
    title: "90-Day Command Centre",
    category: "Event Management",
    icon: Calendar,
    keywords: ["90 day", "command centre", "events", "timeline", "status", "toggles"],
    content: `
# 90-Day Command Centre

## Overview
Track all bookings within the next 90 days with a flight board-style interface.

## Features
- **Filter by Status**: Click stats cards to filter events (Total, Within 30 Days, Needs Attention)
- **Status Toggles**: For each event, track:
  - ✓ Deposit Verified (Blue)
  - ✓ DJ Worksheet Dispatched (Purple)
  - ✓ Final Payment Received (Green)
  - ✓ Site Visit/Call Done (Orange)
- **Auto-Alerts**: Events under 30 days without final payment are highlighted in red
- **Progress Bars**: Visual countdown showing days remaining

## Usage
1. Navigate to Admin Dashboard → "90-Day Command Centre"
2. Review upcoming events sorted by date (closest first)
3. Click status toggles to update completion status
4. Use filter cards at top to focus on specific event groups

## Tips
- Red alerts indicate urgent action needed (final payment pending)
- Progress bar fills as event date approaches
- All status changes are saved automatically
    `,
  },
  {
    id: "venue-asset-upload",
    title: "Upload Venue Brochures",
    category: "Asset Management",
    icon: Upload,
    keywords: ["venue", "upload", "pdf", "brochure", "cloudinary", "assets"],
    content: `
# Upload Venue Brochures

## Overview
Upload venue-specific PDF brochures using Cloudinary. Files are automatically saved to the database and linked to enquiry emails.

## Process
1. Select the **Venue** from dropdown (e.g., Babington House, Kin House)
2. Select the **Year** (current year + 4 years ahead)
3. Click the drag-and-drop zone to open Cloudinary upload widget
4. Upload your PDF file

## Naming Convention
Files are automatically named: \`{venue}-{year}.pdf\` (e.g., \`babington-2026.pdf\`)

## Folder Structure
All PDFs are stored in: \`brochures/\` folder in Cloudinary

## Database Sync
- PDF URL is automatically saved to \`venue_assets\` table
- Linked to enquiry emails based on client's selected venue
- Latest year for each venue is used automatically

## Usage
1. Go to Admin Dashboard → "Venue Assets" section
2. Fill in Venue and Year fields
3. Upload PDF via Cloudinary widget
4. System automatically saves URL to database
    `,
  },
  {
    id: "send-resources",
    title: "Send Resources to Clients",
    category: "Client Communication",
    icon: Send,
    keywords: ["resources", "pdf", "send", "client", "brochure", "master"],
    content: `
# Send Resources to Clients

## Overview
Send PDF resources directly to clients from their booking detail page.

## Available Resources
- General STYLISH Entertainment Brochure
- Wedding Planning Guide
- Music Request Template
- Lighting Design Portfolio
- Venue Styling Guide

## Process
1. Navigate to a booking detail page (\`/admin/bookings/[id]\`)
2. Find "Send Resources" card
3. Select a resource from dropdown
4. Click "Send Resource"
5. Client receives a styled email with download link

## Email Features
- Automatic tracking via download API
- Styled with Luxe Gatsby branding
- Personalised greeting using client's name
- Download tracked in booking metadata

## Usage Tips
- Resources are sent via Resend (info@stylishentertainment.co.uk)
- All sends are logged in booking \`emailsSent.resourceSends\` metadata
- Client receives email immediately upon send
    `,
  },
  {
    id: "enquiry-emails",
    title: "Automated Enquiry Emails",
    category: "Email Automation",
    icon: Mail,
    keywords: ["enquiry", "email", "autoresponder", "brochure", "venue", "automation"],
    content: `
# Automated Enquiry Emails

## Overview
When clients submit an enquiry through the contact form, they automatically receive a thank-you email with venue-specific brochure.

## Workflow
1. Client submits contact form with venue name
2. System queries \`venue_assets\` table for matching venue
3. If PDF exists: Venue-specific brochure link is included
4. If no match: General brochure link is included
5. Email sent with "Download Guide" button

## Email Features
- Luxe champagne-gold bordered button
- Serif font (Playfair Display) for heading
- Venue-specific messaging when PDF available
- Fallback to general brochure if venue not found

## Database Integration
- Fetches from \`venue_assets\` table: \`SELECT pdf_url WHERE venue_name = [venue] AND is_active = true\`
- Uses latest year for each venue automatically
- Falls back to static \`staticVenueAssets["General"]\` if database unavailable

## Manual Trigger
To manually send enquiry emails:
1. Go to Admin → Email Journey Manager
2. Select "Enquiry Auto-Responder" stage
3. Enter client email and booking data
4. Click "Send Email"
    `,
  },
  {
    id: "artist-dispatch",
    title: "DJ Worksheet Dispatch",
    category: "Event Management",
    icon: FileText,
    keywords: ["dj", "worksheet", "dispatch", "artist", "brief", "send"],
    content: `
# DJ Worksheet Dispatch

## Overview
Send event details to assigned DJ/Artist after reviewing final client submission.

## Process
1. Navigate to booking detail page
2. Review client's "Final Details" submission
3. Edit details if needed in "Editable Version"
4. Check "Review Complete" checkbox
5. Click "Send to Artist" button

## Email Features
- Sent to assigned DJ/Agent email address
- BCC to info@stylishentertainment.co.uk
- Includes: Venue, Timings, First Dance, Do-Not-Plays
- Professional summary format

## Dispatch Logging
- \`dispatched_at\`: Timestamp recorded
- \`dispatched_by\`: Admin name logged
- Status updated to "Dispatched" in booking

## Requirements
- "Review Complete" must be checked before dispatch
- Assigned DJ email must be present in booking
- Booking must have final details submitted

## Usage
1. Open booking → "Artist Dispatch" section
2. Review and edit details
3. Check "Review Complete"
4. Click "Send to Artist"
    `,
  },
  {
    id: "email-journey",
    title: "Email Journey Manager",
    category: "Email Automation",
    icon: Mail,
    keywords: ["journey", "emails", "lifecycle", "stages", "templates", "customer"],
    content: `
# Email Journey Manager

## Overview
Preview and send customer lifecycle emails across 5 key stages.

## Email Stages
1. **Enquiry Auto-Responder**: Immediate thank-you with brochure
2. **Booking Confirmation**: Sent after deposit, includes Client Admin link
3. **4-Week Check-in**: Final music preferences and logistics
4. **Week-of Excitement**: "We're ready" confirmation
5. **Post-Wedding Magic**: Feedback and review request

## Features
- Preview all email templates
- Download PDF versions
- Send test emails to clients
- View email content and styling

## Usage
1. Navigate to Admin → "Email Journey"
2. Select stage to preview
3. Enter client email and booking data
4. Preview or send email
5. Download PDF for records

## Manual Sending
Use \`/api/send-email\` endpoint with:
- \`stage\`: One of the 5 journey stages
- \`clientEmail\`: Recipient email
- \`bookingId\`: Optional, fetches booking data
- \`clientData\`: Optional manual data override
    `,
  },
  {
    id: "client-recognition",
    title: "Client Recognition System",
    category: "Client Experience",
    icon: BookOpen,
    keywords: ["returning", "client", "recognition", "ip", "secure", "welcome"],
    content: `
# Client Recognition System

## Overview
Automatically recognise returning clients via IP address or URL parameters.

## Detection Methods
1. **URL Parameters**: \`?client=returning&name=John\`
2. **Session Storage**: Persists across navigation
3. **IP Matching**: Queries provisional bookings for matching IP

## UI Updates
- **Navbar**: "Enquire" button changes to "Secure My Date" with pulse animation
- **Welcome Banner**: Slim top bar (40px) with client name and quote link
- **Direct Access**: Clicking "Secure My Date" skips login, goes to \`/dashboard/secure-booking\`

## Welcome Banner
- Shows: "Welcome back, [Name]. We have your date provisionally held. [View My Quote →]"
- Links directly to secure booking page
- Styled with gray-950 background, champagne-gold text

## Secure Booking Page
- Shows booking summary and deposit details
- Payment reference generator
- Terms & Conditions acceptance
- IP capture for contract validation

## Technical Details
- IP matching checks \`emailsSent.acceptance_ip\` and \`emailsSent.visitor_ip\`
- State persists in \`sessionStorage\` as \`stylish_returning_status\`
- Recognition works across all pages
    `,
  },
  {
    id: "new-enquiry-workflow",
    title: "New Enquiry Workflow",
    category: "Inbox Management",
    icon: Inbox,
    keywords: ["enquiry", "inbox", "new", "conflict", "detection", "first touch", "workflow", "booking"],
    content: `
# New Enquiry Workflow

## Overview
Complete workflow for handling new enquiries from the moment they arrive in your inbox.

## Step 1: Client Submits Contact Form
When a client fills out the contact form on your website:
- **Captures**: Name, Email, Phone, Event Date, Venue (Name/Postcode), Services, Message
- **Creates**: A new \`Booking\` record in the database
- **Generates**: Unique booking reference number

## Step 2: Automated First Touch Email
**Immediately** after submission, the system:
- Sends an automated "First Touch" email to the client
- Email subject: "Thanks for reaching out about [Event Date]!"
- Content: "We are currently checking our talent availability and will get back to you shortly."
- This email is logged in \`CommsLog\` for tracking

## Step 3: Conflict Detection Engine
The system automatically checks for potential duplicates:
- **Checks**: \`events\` table for matching **Date + Postcode**
- **If Match Found**:
  - Sets \`isConflict: true\` on the booking
  - Links \`originalBookingId\` to the existing booking
  - Sets \`conflictStatus: "pending"\`
  - Records \`conflictDetectedAt\` timestamp

## Step 4: Enquiry Appears in Admin Inbox
The new enquiry appears in multiple places:

### Admin Dashboard
- **"New Enquiries"** card shows count of bookings with no admin action
- Card flashes **red** if there are new enquiries
- Shows breakdown: **Urgent** vs **Medium** priority
- Click to view all pending bookings

### Bookings List Page (\`/admin/bookings\`)
- New bookings appear with **"Action Needed"** badge
- **Conflict Warning**: If conflict detected, booking card shows:
  - Red border and background
  - Amber/red banner: "POSSIBLE DUPLICATE: This date and venue are already locked for [Original Client Name]"
  - ⚠️ Conflict icon displayed prominently

### Enquiry Dashboard (\`/admin/enquiries\`)
- Kanban board view with columns: **New**, **Checking Availability**, **Quoted**, **Contract Sent**
- New enquiries appear in **"New"** column
- Automatically sorted by urgency (sooner dates at top)
- Conflict icon (⚠️) shown on enquiry cards

## Step 5: Admin Review & Response

### View Enquiry Details
1. Click on enquiry card in bookings list or enquiry dashboard
2. Opens booking detail page with full information
3. Review client details, venue, services requested

### Check for Conflicts
- If conflict detected, review original booking
- Decide: Merge, Keep Separate, or Resolve
- Update \`conflictStatus\` accordingly

### Send First Reply
1. Navigate to booking detail page
2. Use **Email Editor** (embedded in enquiry drawer)
3. Select appropriate email template
4. Customise and send quote/response
5. Email is logged to \`CommsLog\` and \`EmailThread\`

### Update Status
- Move enquiry through Kanban columns:
  - **New** → **Checking Availability** (when you start checking)
  - **Checking Availability** → **Quoted** (after sending quote)
  - **Quoted** → **Contract Sent** (after sending contract)

## Step 6: Mobile Notification (Optional)
If configured, you'll receive:
- **Pushover/WhatsApp/Slack** notification
- Includes: Client name, Event date, Venue
- **Deep link** back to admin dashboard
- **Quick Reply** button for fast response

## Key Features

### Conflict Detection
- **Automatic**: Runs on every new enquiry
- **Checks**: Date + Postcode combination
- **Visual Warning**: Red/amber banners in admin UI
- **Resolution**: Track resolution status in booking

### Email Tracking
- All emails logged to \`CommsLog\` table
- Threaded conversations in \`EmailThread\`
- Visible in booking detail page history
- Links to DJ Command Module for full audit trail

### Status Management
- **Kanban Board**: Drag-and-drop status updates
- **Auto-sorting**: New column sorted by urgency
- **Visual Indicators**: Conflict icons, priority badges
- **Real-time Updates**: Dashboard refreshes every 30 seconds

## Best Practices
1. **Check Dashboard Daily**: Review "New Enquiries" card first thing
2. **Resolve Conflicts Quickly**: Review duplicate warnings immediately
3. **Send First Reply Within 24 Hours**: Use enquiry dashboard email editor
4. **Update Status**: Move enquiries through workflow stages
5. **Track Everything**: All actions logged for audit trail

## Related Features
- **Enquiry Dashboard**: \`/admin/enquiries\` - Kanban board view
- **Booking Detail**: \`/admin/bookings/[id]\` - Full booking management
- **Email Editor**: Integrated in enquiry drawer for quick responses
- **Conflict Resolution**: Track and resolve duplicate enquiries
    `,
  },
];

export default function AdminHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<WorkflowDoc | null>(null);

  const filteredWorkflows = workflows.filter((workflow) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      workflow.title.toLowerCase().includes(query) ||
      workflow.category.toLowerCase().includes(query) ||
      workflow.keywords.some((kw) => kw.toLowerCase().includes(query)) ||
      workflow.content.toLowerCase().includes(query)
    );
  });

  const groupedByCategory = filteredWorkflows.reduce((acc, workflow) => {
    if (!acc[workflow.category]) {
      acc[workflow.category] = [];
    }
    acc[workflow.category].push(workflow);
    return acc;
  }, {} as Record<string, WorkflowDoc[]>);

  const formatContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("# ")) {
        return <h1 key={idx} className="text-2xl font-bold text-white mt-6 mb-4">{line.substring(2)}</h1>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={idx} className="text-xl font-semibold text-champagne-gold mt-4 mb-3">{line.substring(3)}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="text-lg font-semibold text-gray-300 mt-3 mb-2">{line.substring(4)}</h3>;
      }
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return <li key={idx} className="text-gray-300 ml-4 mb-1">{line.substring(2)}</li>;
      }
      if (line.trim() === "") {
        return <br key={idx} />;
      }
      if (line.includes("`")) {
        const parts = line.split(/`(.*?)`/g);
        return (
          <p key={idx} className="text-gray-300 mb-2">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <code key={i} className="bg-gray-800 px-2 py-1 rounded text-champagne-gold font-mono text-sm">
                  {part}
                </code>
              ) : (
                part
              )
            )}
          </p>
        );
      }
      return <p key={idx} className="text-gray-300 mb-2">{line}</p>;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10"
          title="Help & Documentation"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gray-900 border-champagne-gold/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-champagne-gold flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Admin Help & Workflows
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[calc(90vh-100px)]">
          {/* Search Box */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search workflows and features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-champagne-gold"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
            {/* Left Sidebar - Workflow List */}
            <div className="lg:col-span-1 overflow-y-auto pr-2 border-r border-gray-700">
              {Object.entries(groupedByCategory).map(([category, docs]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {docs.map((workflow) => {
                      const Icon = workflow.icon;
                      return (
                        <motion.button
                          key={workflow.id}
                          onClick={() => setSelectedDoc(workflow)}
                          className={`w-full text-left p-3 rounded-lg transition-all flex items-start gap-2 ${
                            selectedDoc?.id === workflow.id
                              ? "bg-champagne-gold/20 border border-champagne-gold/50"
                              : "bg-gray-800/50 border border-gray-700 hover:bg-gray-800 hover:border-gray-600"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-5 h-5 text-champagne-gold flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{workflow.title}</p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Content - Selected Documentation */}
            <div className="lg:col-span-2 overflow-y-auto pl-4">
              {selectedDoc ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="prose prose-invert max-w-none"
                >
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-700">
                    {(() => {
                      const Icon = selectedDoc.icon;
                      return <Icon className="w-6 h-6 text-champagne-gold" />;
                    })()}
                    <h1 className="text-2xl font-serif text-white mb-0">{selectedDoc.title}</h1>
                  </div>
                  <div className="text-gray-300">{formatContent(selectedDoc.content)}</div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Select a workflow from the list to view documentation</p>
                    <p className="text-sm mt-2">Or use the search box to find specific features</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
