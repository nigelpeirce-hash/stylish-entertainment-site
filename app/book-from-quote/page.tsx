"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar, User, Mail, Phone, MapPin, Home, Music, Mic2, CheckCircle2 } from "lucide-react";
import { AcceptTermsModule } from "@/components/AcceptTermsModule";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Phone required (e.g. 07700 900000)"),
  clientAddress: z.string().min(3, "Address is required"),
  clientAddress2: z.string().optional(),
  clientTown: z.string().min(2, "Town is required"),
  clientCounty: z.string().optional(),
  clientPostcode: z.string().min(5, "Postcode is required"),
  eventType: z.string().min(1, "Event type required"),
  eventDate: z.string().min(1, "Date required"),
  eventStartTime: z.string().optional(),
  eventEndTime: z.string().optional(),
  venueName: z.string().min(2, "Venue required"),
  venueAddress: z.string().optional(),
  venueAddress2: z.string().optional(),
  venueTown: z.string().optional(),
  venueCounty: z.string().optional(),
  venuePostcode: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const eventTypes = ["Wedding", "Private Party", "Corporate Event", "Christmas Party", "Other"];

interface Prefill {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  clientAddress: string;
  clientAddress2: string;
  clientTown: string;
  clientCounty: string;
  clientPostcode: string;
  eventType: string;
  eventDate: string;
  eventStartTime?: string;
  eventEndTime?: string;
  venueName: string;
  venueAddress: string;
  venueAddress2?: string;
  venueTown?: string;
  venueCounty?: string;
  venuePostcode: string;
  artistType: "dj" | "musician";
  staffId: string | null;
  artistName: string | null;
  fee: number | null;
}

function BookFromQuoteContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? "";
  const [prefill, setPrefill] = useState<Prefill | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      clientAddress: "",
      clientAddress2: "",
      clientTown: "",
      clientCounty: "",
      clientPostcode: "",
      eventType: "Wedding",
      eventDate: "",
      eventStartTime: "",
      eventEndTime: "",
      venueName: "",
      venueAddress: "",
      venueAddress2: "",
      venueTown: "",
      venueCounty: "",
      venuePostcode: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setFetchError("Missing link. Use the link from your quote email.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/book-from-quote?token=${encodeURIComponent(token)}`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setFetchError(data.error || "Invalid or expired link. Please contact us or request a new quote.");
          setLoading(false);
          return;
        }
        setPrefill(data);
        setValue("name", data.name ?? "");
        setValue("email", data.email ?? "");
        setValue("phone", data.phone ?? "");
        setValue("clientAddress", data.clientAddress ?? "");
        setValue("clientAddress2", data.clientAddress2 ?? "");
        setValue("clientTown", data.clientTown ?? "");
        setValue("clientCounty", data.clientCounty ?? "");
        setValue("clientPostcode", data.clientPostcode ?? "");
        setValue("eventType", data.eventType ?? "Wedding");
        setValue("eventDate", data.eventDate ?? "");
        setValue("eventStartTime", data.eventStartTime ?? "");
        setValue("eventEndTime", data.eventEndTime ?? "");
        setValue("venueName", data.venueName ?? "");
        setValue("venueAddress", data.venueAddress ?? "");
        setValue("venueAddress2", data.venueAddress2 ?? "");
        setValue("venueTown", data.venueTown ?? "");
        setValue("venueCounty", data.venueCounty ?? "");
        setValue("venuePostcode", data.venuePostcode ?? "");
      } catch (e) {
        if (!cancelled) {
          setFetchError("Something went wrong. Please try again or contact us.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, setValue]);

  const onSubmit = async (form: FormData) => {
    if (!termsAccepted) {
      setSubmitError("You must accept the Terms & Conditions to confirm.");
      return;
    }
    setSubmitError(null);
    try {
      const res = await fetch("/api/bookings/confirm-from-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          clientAddress: form.clientAddress || undefined,
          clientAddress2: form.clientAddress2 || undefined,
          clientTown: form.clientTown || undefined,
          clientCounty: form.clientCounty || undefined,
          clientPostcode: form.clientPostcode || undefined,
          eventType: form.eventType,
          eventDate: form.eventDate,
          eventStartTime: form.eventStartTime?.trim() || undefined,
          eventEndTime: form.eventEndTime?.trim() || undefined,
          venueName: form.venueName,
          venueAddress: form.venueAddress || undefined,
          venueAddress2: form.venueAddress2?.trim() || undefined,
          venueTown: form.venueTown?.trim() || undefined,
          venueCounty: form.venueCounty?.trim() || undefined,
          venuePostcode: form.venuePostcode || undefined,
          selectedStaffId: prefill?.staffId ?? undefined,
          fee: prefill?.fee ?? undefined,
          termsAccepted: true,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading…</p>
      </div>
    );
  }

  if (fetchError || !prefill) {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-xl">
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="text-xl text-champagne-gold">Invalid or expired link</CardTitle>
              <CardDescription className="text-gray-300">
                {fetchError ?? "We couldn't load your quote details."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/contact-us/"
                className="inline-block text-champagne-gold hover:underline"
              >
                Contact us
              </Link>{" "}
              or request a new quote from your coordinator.
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardContent className="pt-6 text-center space-y-4">
              <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto" />
              <p className="text-xl text-white font-semibold">Thanks, we&apos;ve confirmed your booking.</p>
              <p className="text-gray-400 text-sm">
                We&apos;ll send you a deposit invoice shortly. Once you&apos;ve paid, we&apos;ll invite you to your booking portal to add music details and more.
              </p>
              <div>
                <Link href="/" className="text-champagne-gold hover:underline text-sm">
                  Back to home
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const isDJ = prefill.artistType === "dj";

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                {isDJ ? <Music className="w-7 h-7 text-champagne-gold" /> : <Mic2 className="w-7 h-7 text-champagne-gold" />}
                {isDJ ? "Book your DJ" : "Book your musician"}
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your details from the quote are below. You can edit anything that&apos;s wrong, then confirm.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {submitError && (
                  <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-md">
                    {submitError}
                  </div>
                )}

                <div className="space-y-4 border-b border-gray-700 pb-6">
                  <h3 className="text-lg font-semibold text-champagne-gold flex items-center gap-2">
                    <User className="w-5 h-5" /> Your details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                      {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                      {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="e.g. 07700 900000"
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                    {errors.phone && <p className="text-sm text-red-400">{errors.phone.message}</p>}
                    <p className="text-xs text-gray-400">In case we need to reach you on the day.</p>
                  </div>
                </div>

                <div className="space-y-4 border-b border-gray-700 pb-6">
                  <h3 className="text-lg font-semibold text-champagne-gold flex items-center gap-2">
                    <Home className="w-5 h-5" /> Your home address
                  </h3>
                  <p className="text-sm text-gray-400">We need your address for your booking. You can edit any pre-filled details.</p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientAddress">Address *</Label>
                      <Input
                        id="clientAddress"
                        {...register("clientAddress")}
                        placeholder="Line 1"
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                      {errors.clientAddress && <p className="text-sm text-red-400">{errors.clientAddress.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientAddress2">Address 2</Label>
                      <Input
                        id="clientAddress2"
                        {...register("clientAddress2")}
                        placeholder="Line 2"
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientTown">Town *</Label>
                        <Input
                          id="clientTown"
                          {...register("clientTown")}
                          placeholder="Town"
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                        {errors.clientTown && <p className="text-sm text-red-400">{errors.clientTown.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientPostcode">Postcode *</Label>
                        <Input
                          id="clientPostcode"
                          {...register("clientPostcode")}
                          placeholder="Postcode"
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                        {errors.clientPostcode && <p className="text-sm text-red-400">{errors.clientPostcode.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientCounty">County</Label>
                      <Input
                        id="clientCounty"
                        {...register("clientCounty")}
                        placeholder="County"
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-b border-gray-700 pb-6">
                  <h3 className="text-lg font-semibold text-champagne-gold flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> Event
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event type *</Label>
                      <select
                        id="eventType"
                        {...register("eventType")}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                      >
                        {eventTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {errors.eventType && <p className="text-sm text-red-400">{errors.eventType.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Date *</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        {...register("eventDate")}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                      {errors.eventDate && <p className="text-sm text-red-400">{errors.eventDate.message}</p>}
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
                  {prefill.artistName && (
                    <p className="text-sm text-gray-400">
                      Artist: <span className="text-champagne-gold">{prefill.artistName}</span>
                      {prefill.fee != null && (
                        <span className="ml-2">(£{prefill.fee.toLocaleString("en-GB")})</span>
                      )}
                    </p>
                  )}
                </div>

                <div className="space-y-4 border-b border-gray-700 pb-6">
                  <h3 className="text-lg font-semibold text-champagne-gold flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> Venue
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="venueName">Venue name *</Label>
                    <Input
                      id="venueName"
                      {...register("venueName")}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                    {errors.venueName && <p className="text-sm text-red-400">{errors.venueName.message}</p>}
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
                      <div>
                        <Label htmlFor="venuePostcode" className="text-gray-400 text-sm">Postcode</Label>
                        <Input
                          id="venuePostcode"
                          {...register("venuePostcode")}
                          className="bg-gray-900 border-gray-700 text-white mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <AcceptTermsModule
                    accepted={termsAccepted}
                    onAcceptChange={setTermsAccepted}
                    disabled={isSubmitting}
                    showDownloadPdf
                    quoteSummary={{
                      eventDate: watch("eventDate") || prefill.eventDate,
                      eventType: watch("eventType") || prefill.eventType,
                      venueName: watch("venueName") || prefill.venueName,
                      artistName: prefill.artistName ?? undefined,
                      clientName: watch("name") || prefill.name,
                      fee: prefill.fee != null ? `£${prefill.fee.toLocaleString("en-GB")}` : undefined,
                    }}
                    bookingSummary={{
                      venueName: watch("venueName") || prefill.venueName || undefined,
                      eventDate: watch("eventDate") || prefill.eventDate || undefined,
                      fee: prefill.fee != null ? `£${prefill.fee.toLocaleString("en-GB")}` : undefined,
                      talent: prefill.artistName ? [{ name: prefill.artistName, role: prefill.artistType === "dj" ? "DJ" : "Musician" }] : undefined,
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={!termsAccepted || isSubmitting}
                    className="w-full bg-champagne-gold text-black hover:bg-champagne-gold/90 font-semibold"
                  >
                    {isSubmitting ? "Confirming…" : "Confirm and book"}
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

export default function BookFromQuotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading…</div>}>
      <BookFromQuoteContent />
    </Suspense>
  );
}
