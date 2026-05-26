"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import UpsellSection from "@/components/UpsellSection";
import { clientDashboardPath, loginPath } from "@/lib/portal-paths";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  clientAddress: z.string().optional(),
  clientAddress2: z.string().optional(),
  clientTown: z.string().optional(),
  clientPostcode: z.string().optional(),
  eventType: z.string().min(1, "Please select an event type"),
  eventDate: z.string().min(1, "Please provide your event date"),
  eventStartTime: z.string().optional(),
  eventEndTime: z.string().optional(),
  venueName: z.string().min(2, "Venue name is required"),
  venuePostcode: z.string().optional(),
  venueAddress: z.string().optional(),
  venueAddress2: z.string().optional(),
  venueTown: z.string().optional(),
  venueCounty: z.string().optional(),
  numberOfGuests: z.string().optional(),
  services: z.array(z.string()).optional(),
  message: z.string().optional(),
  agreedFee: z.string().optional(),
  earlySetupRequired: z.boolean().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

/** Upsell label for early setup – stored in booking.upsellItems and shown in admin */
const EARLY_SETUP_UPSELL_LABEL = "Early Setup (before event) – £120";

const eventTypes = [
  "Wedding",
  "Private Party",
  "Corporate Event",
  "Christmas Party",
  "Other",
];

/** Map enquiry eventType to form option value (e.g. "wedding" -> "Wedding") */
function normalizeEventType(value: string | undefined): string {
  if (!value || !value.trim()) return "";
  const v = value.trim().toLowerCase();
  const map: Record<string, string> = {
    wedding: "Wedding",
    "private party": "Private Party",
    "corporate event": "Corporate Event",
    "christmas party": "Christmas Party",
    other: "Other",
    party: "Private Party",
    corporate: "Corporate Event",
  };
  return map[v] || value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase();
}

export default function NewBookingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const enquiryId = searchParams.get("enquiryId");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [enquiryLoaded, setEnquiryLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      services: [],
      earlySetupRequired: false,
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(loginPath());
    }
  }, [status, router]);

  // Pre-populate from initial enquiry when enquiryId is in the URL
  useEffect(() => {
    if (!enquiryId || enquiryLoaded) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/public/enquiry-for-booking?enquiryId=${encodeURIComponent(enquiryId)}`);
        if (!res.ok || cancelled) return;
        const data = await res.json();

        if (cancelled) return;
        if (data.name) setValue("name", data.name);
        if (data.email) setValue("email", data.email);
        if (data.phone) setValue("phone", data.phone);
        if (data.eventDate) setValue("eventDate", data.eventDate);
        if (data.venueName) setValue("venueName", data.venueName);
        if (data.venuePostcode) setValue("venuePostcode", data.venuePostcode ?? "");
        if (data.eventType) setValue("eventType", normalizeEventType(data.eventType));
        if (data.message) setValue("message", data.message);
        if (Array.isArray(data.services) && data.services.includes("Musicians")) {
          setValue("services", ["Musicians"]);
        }
        setEnquiryLoaded(true);
      } catch {
        if (!cancelled) setEnquiryLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enquiryId, setValue, enquiryLoaded]);

  const musiciansRequired = watch("services")?.includes("Musicians") ?? false;

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/client/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          djStartTime: data.eventStartTime || null,
          djFinishTime: data.eventEndTime || null,
          finalBalance: data.agreedFee && String(data.agreedFee).trim() ? String(data.agreedFee).trim() : null,
          services: musiciansRequired ? ["Musicians"] : [],
          preferredDJ: null,
          upsellItems: [
            ...(data.earlySetupRequired ? [EARLY_SETUP_UPSELL_LABEL] : []),
            ...selectedUpsells.filter((u) => u !== EARLY_SETUP_UPSELL_LABEL),
          ],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to submit booking");
        setIsSubmitting(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push(clientDashboardPath());
        }, 2000);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="bg-gray-800 border-champagne-gold/30 max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-green-400 text-lg mb-4">
              Booking request submitted. Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="text-2xl">Booking Request Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {enquiryId && enquiryLoaded && (
                  <div className="p-3 text-sm text-champagne-gold/90 bg-champagne-gold/10 border border-champagne-gold/30 rounded-md">
                    Details from your initial enquiry have been pre-filled. You can edit any field.
                  </div>
                )}
                {error && (
                  <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-md">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Client telephone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="e.g. 07xxx xxxxxx"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-champagne-gold/90">Client address</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="clientAddress" className="text-gray-400 text-sm">Address line 1</Label>
                      <Input
                        id="clientAddress"
                        {...register("clientAddress")}
                        placeholder="Street, house name/number"
                        className="bg-gray-900 border-gray-700 text-white mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="clientAddress2" className="text-gray-400 text-sm">Address line 2 (optional)</Label>
                      <Input
                        id="clientAddress2"
                        {...register("clientAddress2")}
                        placeholder="Flat, building, etc."
                        className="bg-gray-900 border-gray-700 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientTown" className="text-gray-400 text-sm">Town</Label>
                      <Input
                        id="clientTown"
                        {...register("clientTown")}
                        className="bg-gray-900 border-gray-700 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientPostcode" className="text-gray-400 text-sm">Postcode</Label>
                      <Input
                        id="clientPostcode"
                        {...register("clientPostcode")}
                        className="bg-gray-900 border-gray-700 text-white mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type *</Label>
                    <select
                      id="eventType"
                      {...register("eventType")}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                    >
                      <option value="">Select event type</option>
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.eventType && (
                      <p className="text-sm text-red-400">{errors.eventType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Event Date *</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      {...register("eventDate")}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                    {errors.eventDate && (
                      <p className="text-sm text-red-400">{errors.eventDate.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventStartTime">Event start time</Label>
                    <Input
                      id="eventStartTime"
                      {...register("eventStartTime")}
                      placeholder="e.g. 7pm"
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventEndTime">Event end time</Label>
                    <Input
                      id="eventEndTime"
                      {...register("eventEndTime")}
                      placeholder="e.g. midnight"
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="venueName">Venue Name *</Label>
                    <Input
                      id="venueName"
                      {...register("venueName")}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                    {errors.venueName && (
                      <p className="text-sm text-red-400">{errors.venueName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venuePostcode">Venue Postcode</Label>
                    <Input
                      id="venuePostcode"
                      {...register("venuePostcode")}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-champagne-gold/90">Venue address</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="venueAddress" className="text-gray-400 text-sm">Address line 1</Label>
                      <Input
                        id="venueAddress"
                        {...register("venueAddress")}
                        placeholder="Street, building name"
                        className="bg-gray-900 border-gray-700 text-white mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="venueAddress2" className="text-gray-400 text-sm">Address line 2 (optional)</Label>
                      <Input
                        id="venueAddress2"
                        {...register("venueAddress2")}
                        placeholder="Area, landmark"
                        className="bg-gray-900 border-gray-700 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="venueTown" className="text-gray-400 text-sm">Town</Label>
                      <Input
                        id="venueTown"
                        {...register("venueTown")}
                        className="bg-gray-900 border-gray-700 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="venueCounty" className="text-gray-400 text-sm">County (optional)</Label>
                      <Input
                        id="venueCounty"
                        {...register("venueCounty")}
                        className="bg-gray-900 border-gray-700 text-white mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfGuests">Number of Guests</Label>
                    <Input
                      id="numberOfGuests"
                      type="number"
                      {...register("numberOfGuests")}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agreedFee">Agreed fee</Label>
                    <Input
                      id="agreedFee"
                      {...register("agreedFee")}
                      placeholder="e.g. £1500"
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="musicians"
                      checked={musiciansRequired}
                      onCheckedChange={(checked) => setValue("services", checked ? ["Musicians"] : [])}
                    />
                    <Label htmlFor="musicians" className="cursor-pointer">
                      Musicians required
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="earlySetupRequired"
                      checked={watch("earlySetupRequired") ?? false}
                      onCheckedChange={(checked) => setValue("earlySetupRequired", checked === true)}
                    />
                    <Label htmlFor="earlySetupRequired" className="cursor-pointer">
                      Early setup required at £120
                    </Label>
                  </div>
                </div>

                {/* Upsell Section */}
                <UpsellSection
                  selectedServices={musiciansRequired ? ["Musicians"] : []}
                  selectedUpsells={selectedUpsells}
                  onUpsellChange={setSelectedUpsells}
                />

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Details</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    rows={5}
                    className="bg-gray-900 border-gray-700 text-white"
                    placeholder="Tell us more about your event..."
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Booking"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-gray-700 text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
