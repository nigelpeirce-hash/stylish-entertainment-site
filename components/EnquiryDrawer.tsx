"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, MapPin, Mail, Clock, Users, Calendar, AlertTriangle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface EnquiryDrawerProps {
  enquiry: {
    id: string;
    name: string;
    email: string;
    eventDate: string;
    venueName: string;
    venuePostcode: string | null;
    venueAddress: string | null;
    venueTown: string | null;
    services?: string[];
    message?: string | null;
    numberOfGuests?: number | null;
    source?: string;
    [key: string]: any;
  };
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function EnquiryDrawer({ enquiry, isOpen, onClose, onUpdate }: EnquiryDrawerProps) {
  const [emailHistory, setEmailHistory] = useState<any[]>([]);
  const [talentStatus, setTalentStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    if (isOpen && enquiry) {
      fetchEmailHistory();
      fetchTalentStatus();
      generateMapUrl();
    }
  }, [isOpen, enquiry]);

  const fetchEmailHistory = async () => {
    try {
      const response = await fetch(`/api/admin/enquiries/${enquiry.id}/emails`);
      if (response.ok) {
        const data = await response.json();
        setEmailHistory(data.emails || []);
      }
    } catch (error) {
      console.error("Error fetching email history:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTalentStatus = async () => {
    // Only fetch talent status for bookings (not new enquiries)
    if (enquiry.source === "new_enquiry") {
      setTalentStatus({});
      return;
    }

    try {
      const response = await fetch(`/api/admin/enquiries/${enquiry.id}/talent-status`);
      if (response.ok) {
        const data = await response.json();
        setTalentStatus(data.talentStatus || {});
      }
    } catch (error) {
      console.error("Error fetching talent status:", error);
    }
  };

  const generateMapUrl = () => {
    if (!enquiry.venueName) return;
    
    const parts = [enquiry.venueName];
    if (enquiry.venueAddress) parts.push(enquiry.venueAddress);
    if (enquiry.venueTown) parts.push(enquiry.venueTown);
    if (enquiry.venuePostcode) parts.push(enquiry.venuePostcode);
    
    const query = encodeURIComponent(parts.join(", "));
    setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}&q=${query}`);
  };

  const handleTalentStatusChange = async (talentId: string, checked: boolean) => {
    // Only update talent status for bookings
    if (enquiry.source === "new_enquiry") {
      return;
    }

    const newStatus = { ...talentStatus, [talentId]: checked };
    setTalentStatus(newStatus);

    try {
      await fetch(`/api/admin/enquiries/${enquiry.id}/talent-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ talentId, contacted: checked }),
      });
    } catch (error) {
      console.error("Error updating talent status:", error);
      // Revert on error
      setTalentStatus(talentStatus);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMM yyyy 'at' HH:mm");
    } catch {
      return dateString;
    }
  };

  if (!enquiry) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl overflow-y-auto bg-gray-900 border-champagne-gold/30">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-white font-serif">
            {enquiry.name}
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            {enquiry.email} • {formatDate(enquiry.eventDate)}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="map" className="text-gray-300 data-[state=active]:text-white">
                Location
              </TabsTrigger>
              <TabsTrigger value="emails" className="text-gray-300 data-[state=active]:text-white">
                Emails
              </TabsTrigger>
              <TabsTrigger value="availability" className="text-gray-300 data-[state=active]:text-white">
                Availability
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <Calendar className="w-4 h-4" />
                      Event Date
                    </div>
                    <p className="text-white font-semibold">{formatDate(enquiry.eventDate)}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <Users className="w-4 h-4" />
                      Guests
                    </div>
                    <p className="text-white font-semibold">
                      {enquiry.numberOfGuests || "TBD"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-champagne-gold" />
                    Venue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white font-semibold text-lg">{enquiry.venueName}</p>
                  {enquiry.venueAddress && (
                    <p className="text-gray-300 mt-1">{enquiry.venueAddress}</p>
                  )}
                  {enquiry.venueTown && (
                    <p className="text-gray-300">{enquiry.venueTown}</p>
                  )}
                  {enquiry.venuePostcode && (
                    <p className="text-gray-300 font-medium">{enquiry.venuePostcode}</p>
                  )}
                </CardContent>
              </Card>

              {enquiry.services && enquiry.services.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {enquiry.services.map((service: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-champagne-gold/20 text-champagne-gold border-champagne-gold/50"
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {enquiry.message && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 whitespace-pre-wrap">{enquiry.message}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Map Tab */}
            <TabsContent value="map" className="mt-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-champagne-gold" />
                    Venue Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mapUrl ? (
                    <div className="w-full h-[400px] rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={mapUrl}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-[400px] rounded-lg bg-gray-700 flex items-center justify-center text-gray-400">
                      Map not available
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Emails Tab */}
            <TabsContent value="emails" className="mt-4 space-y-4">
              {/* Email Editor Integration */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-champagne-gold" />
                    Send Email / Quote
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-2">
                    Send quotes directly without leaving the dashboard
                  </p>
                </CardHeader>
                <CardContent>
                  {enquiry.source === "booking" ? (
                    <iframe
                      src={`/admin/email-templates?bookingId=${enquiry.id}&embed=true`}
                      className="w-full h-[600px] border-0 rounded-lg bg-gray-900"
                      title="Email Editor"
                    />
                  ) : (
                    <div className="p-8 text-center bg-gray-700/50 rounded-lg border border-gray-600">
                      <Mail className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">
                        Convert this enquiry to a booking to access the email editor.
                      </p>
                      <Button
                        onClick={() => {
                          // Navigate to convert page
                          window.location.href = `/admin/new-enquiries/${enquiry.id}`;
                        }}
                        className="bg-champagne-gold text-black hover:bg-champagne-gold/90"
                      >
                        Convert to Booking
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Email History */}
              {emailHistory.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Email History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {emailHistory.map((email: any) => (
                        <div
                          key={email.id}
                          className="p-3 bg-gray-700/50 rounded-lg border border-gray-600"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-white font-semibold">{email.subject}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {email.direction === "outbound" ? "Sent to" : "Received from"}{" "}
                                {email.toEmail || email.fromEmail}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400">
                                {formatDate(email.createdAt || email.receivedAt)}
                              </p>
                              {email.direction === "outbound" && (
                                <Badge className="bg-green-600/20 text-green-400 border-green-500/50 text-xs mt-1">
                                  Sent
                                </Badge>
                              )}
                            </div>
                          </div>
                          {email.textContent && (
                            <p className="text-sm text-gray-300 line-clamp-3 mt-2">
                              {email.textContent}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability" className="mt-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-champagne-gold" />
                    Talent Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">
                    Track which performers have been contacted for this date:
                  </p>
                  {enquiry.source === "new_enquiry" && (
                    <div className="p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg mb-4">
                      <p className="text-blue-300 text-sm">
                        💡 Convert this enquiry to a booking to track talent availability.
                      </p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {(enquiry.services?.includes("DJs") || !enquiry.services || enquiry.services.length === 0) && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                        <Checkbox
                          id="dj"
                          checked={talentStatus.dj || false}
                          onCheckedChange={(checked) =>
                            handleTalentStatusChange("dj", checked === true)
                          }
                          className="border-gray-600 data-[state=checked]:bg-champagne-gold data-[state=checked]:border-champagne-gold"
                        />
                          <Label
                            htmlFor="dj"
                            className="text-white font-medium cursor-pointer flex-1"
                          >
                            DJ Contacted
                          </Label>
                          {talentStatus.dj && (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                      )}

                    {(enquiry.services?.includes("Musicians") || !enquiry.services || enquiry.services.length === 0) && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                          <Checkbox
                            id="musician"
                            checked={talentStatus.musician || false}
                            onCheckedChange={(checked) =>
                              handleTalentStatusChange("musician", checked === true)
                            }
                            disabled={enquiry.source === "new_enquiry"}
                            className="border-gray-600 data-[state=checked]:bg-champagne-gold data-[state=checked]:border-champagne-gold disabled:opacity-50"
                          />
                          <Label
                            htmlFor="musician"
                            className="text-white font-medium cursor-pointer flex-1"
                          >
                            Musician Contacted
                          </Label>
                          {talentStatus.musician && (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                      )}

                    {(enquiry.services?.includes("Lighting Design") || !enquiry.services || enquiry.services.length === 0) && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                          <Checkbox
                            id="lighting"
                            checked={talentStatus.lighting || false}
                            onCheckedChange={(checked) =>
                              handleTalentStatusChange("lighting", checked === true)
                            }
                            disabled={enquiry.source === "new_enquiry"}
                            className="border-gray-600 data-[state=checked]:bg-champagne-gold data-[state=checked]:border-champagne-gold disabled:opacity-50"
                          />
                          <Label
                            htmlFor="lighting"
                            className="text-white font-medium cursor-pointer flex-1"
                          >
                            Lighting Designer Contacted
                          </Label>
                          {talentStatus.lighting && (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                      )}

                    {(enquiry.services?.includes("Venue Styling") || !enquiry.services || enquiry.services.length === 0) && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                          <Checkbox
                            id="styling"
                            checked={talentStatus.styling || false}
                            onCheckedChange={(checked) =>
                              handleTalentStatusChange("styling", checked === true)
                            }
                            disabled={enquiry.source === "new_enquiry"}
                            className="border-gray-600 data-[state=checked]:bg-champagne-gold data-[state=checked]:border-champagne-gold disabled:opacity-50"
                          />
                          <Label
                            htmlFor="styling"
                            className="text-white font-medium cursor-pointer flex-1"
                          >
                            Stylist Contacted
                          </Label>
                          {talentStatus.styling && (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                      )}

                      {/* Generic talent tracking */}
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <p className="text-sm text-gray-400 mb-3">Other Talent:</p>
                        {["Stage Manager", "Sound Engineer", "Photographer"].map((talent) => (
                          <div
                            key={talent}
                            className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600 mb-2"
                          >
                            <Checkbox
                              id={talent.toLowerCase().replace(" ", "-")}
                              checked={talentStatus[talent.toLowerCase().replace(" ", "-")] || false}
                              onCheckedChange={(checked) =>
                                handleTalentStatusChange(
                                  talent.toLowerCase().replace(" ", "-"),
                                  checked === true
                                )
                              }
                              disabled={enquiry.source === "new_enquiry"}
                              className="border-gray-600 data-[state=checked]:bg-champagne-gold data-[state=checked]:border-champagne-gold disabled:opacity-50"
                            />
                          <Label
                            htmlFor={talent.toLowerCase().replace(" ", "-")}
                            className="text-white font-medium cursor-pointer flex-1"
                          >
                            {talent} Contacted
                          </Label>
                          {talentStatus[talent.toLowerCase().replace(" ", "-")] && (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
