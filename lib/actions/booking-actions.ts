"use server";

import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { sendEmailFromCRM } from "@/lib/email-send";
import { auth } from "@/auth";
import { cleanName, getDisplayName } from "@/lib/utils/name-helpers";
import { SIGNATURE_BLOCK_HTML_DARK, CLIENT_SIGNOFF_TEXT, EMAIL_LOGO_HTML_DARK } from "@/lib/email-signature";

interface AssignedTeamMember {
  id: string;
  name: string;
  role: string;
  fee?: number;
}

function parseClientPhone(phone: string | undefined): { phoneAreaCode: string | null; phoneNumber: string | null } {
  const cleaned = phone?.replace(/\D/g, "").trim();
  if (!cleaned) return { phoneAreaCode: null, phoneNumber: null };
  if (/^0?7\d{9}$/.test(cleaned)) {
    const digits = cleaned.replace(/^0/, "");
    return { phoneAreaCode: digits.slice(0, 4), phoneNumber: digits.slice(4) || null };
  }
  if (/^0?1\d{8,9}$/.test(cleaned) || /^0?2\d{9}$/.test(cleaned)) {
    const digits = cleaned.replace(/^0/, "");
    return { phoneAreaCode: digits.slice(0, 3), phoneNumber: digits.slice(3) || null };
  }
  return { phoneAreaCode: null, phoneNumber: cleaned };
}

interface CreateBookingInput {
  title: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  clientAddress2?: string;
  clientTown?: string;
  clientCounty?: string;
  clientPostcode?: string;
  venueName?: string;
  venuePostcode?: string;
  startTime: Date;
  endTime: Date;
  eventType: "wedding" | "party" | "corporate";
  serviceTypes: string[];
  notes?: string;
  earlySetup?: boolean;
  assignedTeam?: AssignedTeamMember[];
}

export async function createBooking(input: CreateBookingInput) {
  try {
    // Get current user for sentByUserId
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    const userId = (session.user as any).id || (session.user as any).sub;

    // Generate booking reference
    const bookingReference = `BK-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Format endTime as string for djFinishTime field (since it's String? in schema)
    const endTimeString = input.endTime.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Clean and normalize the name
    const cleanedName = cleanName(input.title);
    const displayName = getDisplayName(input.title);
    const { phoneAreaCode, phoneNumber } = parseClientPhone(input.clientPhone);

    const booking = await prisma.booking.create({
      data: {
        id: randomUUID(),
        name: cleanedName,
        displayName: displayName,
        email: input.clientEmail.toLowerCase(),
        phoneAreaCode: phoneAreaCode ?? undefined,
        phoneNumber: phoneNumber ?? undefined,
        clientAddress: input.clientAddress || undefined,
        clientAddress2: input.clientAddress2 || undefined,
        clientTown: input.clientTown || undefined,
        clientCounty: input.clientCounty || undefined,
        clientPostcode: input.clientPostcode || undefined,
        eventDate: input.startTime,
        djFinishTime: endTimeString,
        eventType: input.eventType,
        venueName: (input.venueName?.trim()) || "TBD",
        venuePostcode: input.venuePostcode?.trim() || null,
        status: "pending",
        services: input.serviceTypes,
        adminNotes: input.notes ? `${input.earlySetup ? '[EARLY SETUP REQUIRED] ' : ''}${input.notes}` : (input.earlySetup ? '[EARLY SETUP REQUIRED]' : null),
        bookingReference,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create staff assignments if team was assigned
    if (input.assignedTeam && input.assignedTeam.length > 0) {
      // Separate crew (FreelanceCrew) from DJs/Musicians
      // BookingStaffAssignment.staffId references FreelanceCrew table only
      const crewRoles = ["Lighting", "Stylist", "Production", "Crew", "Lighting Design", "Venue Styling", "Event Production"];
      
      const crewMembers = input.assignedTeam.filter(m => 
        crewRoles.some(role => m.role.toLowerCase().includes(role.toLowerCase()))
      );
      const artistMembers = input.assignedTeam.filter(m => 
        !crewRoles.some(role => m.role.toLowerCase().includes(role.toLowerCase()))
      );
      
      // Create BookingStaffAssignment only for FreelanceCrew members
      if (crewMembers.length > 0) {
        await Promise.all(
          crewMembers.map((member) =>
            prisma.bookingStaffAssignment.create({
              data: {
                bookingId: booking.id,
                staffId: member.id,
                role: member.role,
                agreedFee: member.fee || 0,
                status: "held",
              },
            })
          )
        );
      }
      
      // Store DJ/Musician assignments in booking metadata (they're in separate tables)
      if (artistMembers.length > 0) {
        const artistAssignments = artistMembers.map(m => ({
          id: m.id,
          name: m.name,
          role: m.role,
          fee: m.fee || 0,
        }));
        
        // Update booking with artist assignments in adminNotes or a JSON field
        const artistInfo = artistMembers.map(m => 
          `${m.role}: ${m.name}${m.fee ? ` (£${m.fee})` : ''}`
        ).join(', ');
        
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            // Store in preferredDJ field if it's a DJ, otherwise append to notes
            preferredDJ: artistMembers.find(m => m.role === 'DJ')?.name || booking.preferredDJ,
            adminNotes: booking.adminNotes 
              ? `${booking.adminNotes}\n[ASSIGNED ARTISTS: ${artistInfo}]`
              : `[ASSIGNED ARTISTS: ${artistInfo}]`,
          },
        });
        
        // Send confirmation emails to assigned artists
        // Note: Requires email field on DJ/Musician models - run `npx prisma db push` after schema update
        try {
          // Get email addresses for DJs
          const djIds = artistMembers.filter(m => m.role === 'DJ').map(m => m.id);
          const musicianIds = artistMembers.filter(m => m.role !== 'DJ').map(m => m.id);
          
          // Fetch full records (email field added to schema)
          const djs = djIds.length > 0 ? await prisma.dJ.findMany({
            where: { id: { in: djIds } },
          }) : [];
          
          const musicians = musicianIds.length > 0 ? await prisma.musician.findMany({
            where: { id: { in: musicianIds } },
          }) : [];
          
          // Combine and map with fees - cast to access email field
          type ArtistWithEmail = { id: string; name: string; email?: string | null; role: string; fee: number };
          
          const artistsWithEmails: ArtistWithEmail[] = [
            ...djs.map(dj => ({
              id: dj.id,
              name: dj.name,
              email: (dj as any).email as string | null,
              role: 'DJ',
              fee: artistMembers.find(m => m.id === dj.id)?.fee || 0,
            })),
            ...musicians.map(m => ({
              id: m.id,
              name: m.name,
              email: (m as any).email as string | null,
              role: artistMembers.find(am => am.id === m.id)?.role || 'Musician',
              fee: artistMembers.find(am => am.id === m.id)?.fee || 0,
            })),
          ].filter(a => a.email); // Only those with emails
          
          // Send confirmation emails
          const inbox = await prisma.emailInbox.findFirst({
            where: { isActive: true, syncEnabled: true },
          });
          
          if (inbox && artistsWithEmails.length > 0) {
            const eventDate = input.startTime.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
            const startTime = input.startTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
            const endTime = input.endTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
            const isWedding = input.eventType === "wedding";
            
            for (const artist of artistsWithEmails) {
              const artistConfirmationHtml = generateArtistConfirmationEmail({
                artistName: artist.name,
                role: artist.role,
                fee: artist.fee,
                eventTitle: input.title,
                eventDate,
                startTime,
                endTime,
                venueName: "TBD", // Venue is set as TBD in new bookings
                isWedding,
                earlySetup: input.earlySetup || false,
                bookingReference,
              });
              
              await sendEmailFromCRM({
                inboxId: inbox.id,
                to: artist.email!,
                subject: `Booking Confirmation - ${input.title} - ${eventDate}`,
                html: artistConfirmationHtml.html,
                text: artistConfirmationHtml.text,
                sentByUserId: userId,
              });
            }
          }
        } catch (emailError) {
          console.error("Error sending artist confirmation emails:", emailError);
          // Don't fail booking creation if emails fail
        }
      }
    }

    // Auto-link EmailThreads: Find threads with matching client email
    const emailThreads = await prisma.emailThread.findMany({
      where: {
        OR: [
          { fromEmail: input.clientEmail.toLowerCase() },
          { toEmail: input.clientEmail.toLowerCase() },
        ],
        bookingId: null, // Only link unlinked threads
      },
    });

    if (emailThreads.length > 0) {
      // Update all matching threads to link to this booking
      await prisma.emailThread.updateMany({
        where: {
          id: { in: emailThreads.map((t) => t.id) },
        },
        data: {
          bookingId: booking.id,
        },
      });
    }

    return {
      success: true,
      booking,
      linkedThreads: emailThreads.length,
    };
  } catch (error: any) {
    console.error("Error creating booking:", error);
    throw new Error(error.message || "Failed to create booking");
  }
}

/**
 * Generate artist confirmation email HTML and text
 */
function generateArtistConfirmationEmail(params: {
  artistName: string;
  role: string;
  fee: number;
  eventTitle: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venueName: string;
  isWedding: boolean;
  earlySetup: boolean;
  bookingReference: string;
}): { html: string; text: string } {
  const {
    artistName,
    role,
    fee,
    eventTitle,
    eventDate,
    startTime,
    endTime,
    venueName,
    isWedding,
    earlySetup,
    bookingReference,
  } = params;

  const eventType = isWedding ? "Wedding" : "Event";
  const firstName = artistName.split(" ")[0];

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        /* Prevent dark mode from inverting colors */
        @media (prefers-color-scheme: dark) {
          .email-container { background-color: #ffffff !important; }
          .email-text { color: #1a1a1a !important; }
          .email-footer { background-color: #1a1a1a !important; }
          .email-footer-text { color: #ffffff !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f8f8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff !important; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" class="email-container">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px 40px; text-align: center;">
                  ${EMAIL_LOGO_HTML_DARK}
                </td>
              </tr>
              
              <!-- Gold Accent -->
              <tr>
                <td style="background-color: #D4AF37; height: 4px;"></td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  
                  <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a !important; margin: 0 0 24px 0; text-align: center;" class="email-text">
                    Booking Confirmation
                  </h1>
                  
                  <p style="font-size: 16px; color: #333333 !important; line-height: 1.8; margin: 0 0 16px 0;" class="email-text">
                    Hi ${firstName},
                  </p>
                  
                  <p style="font-size: 16px; color: #333333 !important; line-height: 1.8; margin: 0 0 24px 0;" class="email-text">
                    Great news! You've been booked for the following ${eventType.toLowerCase()}. Please review the details below and let us know if you have any questions.
                  </p>
                  
                  <!-- Event Details Card -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 8px; margin: 24px 0; border: 1px solid #e5e5e5;">
                    <tr>
                      <td style="padding: 24px;">
                        <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF37; margin: 0 0 16px 0; font-weight: 600;">Event Details</p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="100" style="font-size: 14px; color: #666666 !important; padding: 8px 0; vertical-align: top;">Event</td>
                            <td style="font-size: 16px; color: #1a1a1a !important; font-weight: 600; padding: 8px 0;">${eventTitle}</td>
                          </tr>
                          <tr>
                            <td width="100" style="font-size: 14px; color: #666666 !important; padding: 8px 0; vertical-align: top;">Type</td>
                            <td style="font-size: 16px; color: #1a1a1a !important; font-weight: 600; padding: 8px 0;">${eventType}</td>
                          </tr>
                          <tr>
                            <td width="100" style="font-size: 14px; color: #666666 !important; padding: 8px 0; vertical-align: top;">Date</td>
                            <td style="font-size: 16px; color: #1a1a1a !important; font-weight: 600; padding: 8px 0;">${eventDate}</td>
                          </tr>
                          <tr>
                            <td width="100" style="font-size: 14px; color: #666666 !important; padding: 8px 0; vertical-align: top;">Time</td>
                            <td style="font-size: 16px; color: #1a1a1a !important; font-weight: 600; padding: 8px 0;">${startTime} - ${endTime}</td>
                          </tr>
                          <tr>
                            <td width="100" style="font-size: 14px; color: #666666 !important; padding: 8px 0; vertical-align: top;">Venue</td>
                            <td style="font-size: 16px; color: #1a1a1a !important; font-weight: 600; padding: 8px 0;">${venueName || "To be confirmed"}</td>
                          </tr>
                          <tr>
                            <td width="100" style="font-size: 14px; color: #666666 !important; padding: 8px 0; vertical-align: top;">Reference</td>
                            <td style="font-size: 16px; color: #1a1a1a !important; font-weight: 600; padding: 8px 0;">${bookingReference}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Your Assignment Card -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fdfbf7 0%, #f9f5ed 100%); border-radius: 8px; margin: 24px 0; border: 1px solid #D4AF37;">
                    <tr>
                      <td style="padding: 24px;">
                        <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF37; margin: 0 0 16px 0; font-weight: 600;">Your Assignment</p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="100" style="font-size: 14px; color: #666666 !important; padding: 8px 0; vertical-align: top;">Role</td>
                            <td style="font-size: 16px; color: #1a1a1a !important; font-weight: 600; padding: 8px 0;">${role}</td>
                          </tr>
                          <tr>
                            <td width="100" style="font-size: 14px; color: #666666 !important; padding: 8px 0; vertical-align: top;">Fee</td>
                            <td style="font-size: 20px; color: #D4AF37 !important; font-weight: 700; padding: 8px 0;">£${fee.toFixed(2)}</td>
                          </tr>
                          ${earlySetup ? `
                          <tr>
                            <td colspan="2" style="padding: 12px 0 0 0;">
                              <div style="background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 4px; padding: 12px; color: #92400E; font-size: 14px;">
                                <strong>⚠️ Early Setup Required</strong> - Please arrive earlier than the event start time. We'll confirm exact timings closer to the date.
                              </div>
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Next Steps -->
                  <div style="background-color: #f0f9ff; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #bae6fd;">
                    <p style="font-size: 14px; font-weight: 600; color: #0369a1; margin: 0 0 12px 0;">What happens next?</p>
                    <ul style="font-size: 14px; color: #0c4a6e; line-height: 1.8; margin: 0; padding-left: 20px;">
                      <li>Add this date to your calendar</li>
                      <li>We'll send you the full event brief closer to the date</li>
                      <li>If anything changes, we'll let you know right away</li>
                    </ul>
                  </div>
                  
                  <p style="font-size: 14px; color: #666666 !important; line-height: 1.6; margin: 24px 0 0 0;" class="email-text">
                    If you have any questions or need to discuss anything about this booking, please reply to this email or give us a call.
                  </p>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #1a1a1a !important; padding: 30px 40px;" class="email-footer">
                  ${SIGNATURE_BLOCK_HTML_DARK}
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const text = `
BOOKING CONFIRMATION

Hi ${firstName},

Great news! You've been booked for the following ${eventType.toLowerCase()}. Please review the details below.

EVENT DETAILS
-------------
Event: ${eventTitle}
Type: ${eventType}
Date: ${eventDate}
Time: ${startTime} - ${endTime}
Venue: ${venueName || "To be confirmed"}
Reference: ${bookingReference}

YOUR ASSIGNMENT
---------------
Role: ${role}
Fee: £${fee.toFixed(2)}
${earlySetup ? '\n⚠️ EARLY SETUP REQUIRED - Please arrive earlier than the event start time.\n' : ''}

WHAT HAPPENS NEXT
-----------------
• Add this date to your calendar
• We'll send you the full event brief closer to the date
• If anything changes, we'll let you know right away

If you have any questions, please reply to this email or give us a call.

${CLIENT_SIGNOFF_TEXT}
  `;

  return { html, text };
}
