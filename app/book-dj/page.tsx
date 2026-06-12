"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "@/lib/motion";
import Link from "next/link";
import { Calendar, User, Mail, Phone, MapPin, Music } from "lucide-react";
import DJSelectionModal from "@/components/DJSelectionModal";
import UpsellSection from "@/components/UpsellSection";
import { AcceptTermsModule } from "@/components/AcceptTermsModule";

const bookingSchema = z.object({
  // Client Information
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  clientAddress: z.string().optional(),
  clientAddress2: z.string().optional(),
  clientTown: z.string().optional(),
  clientPostcode: z.string().optional(),

  // Event Details
  eventType: z.string().min(1, "Please select an event type"),
  eventDate: z.string().min(1, "Event date is required"),
  eventStartTime: z.string().optional(),
  eventEndTime: z.string().optional(),
  numberOfGuests: z.string().optional(),

  // Venue Information
  venueName: z.string().min(2, "Venue name is required"),
  venueAddress: z.string().optional(),
  venueAddress2: z.string().optional(),
  venueTown: z.string().optional(),
  venueCounty: z.string().optional(),
  venuePostcode: z.string().optional(),

  // Booking Details
  message: z.string().optional(),
  agreedFee: z.string().optional(),
  earlySetupRequired: z.boolean().optional(),
  musiciansRequired: z.boolean().optional(),
  services: z.array(z.string()).min(1, "Please select your preferred DJ"),

  // Account Creation
  createAccount: z.boolean().optional(),
  password: z.string().optional(),
}).refine((data) => {
  // If creating account, password is required
  if (data.createAccount && (!data.password || data.password.length < 8)) {
    return false;
  }
  return true;
}, {
  message: "Password must be at least 8 characters when creating an account",
  path: ["password"],
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

function BookDJPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [showDJModal, setShowDJModal] = useState(false);
  const [selectedDJ, setSelectedDJ] = useState<string | null>(null);
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [quoteArtistNames, setQuoteArtistNames] = useState<string[] | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [prefillApplied, setPrefillApplied] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      eventType: searchParams?.get("type") || "wedding",
      createAccount: false,
      earlySetupRequired: false,
      musiciansRequired: false,
    },
  });

  const createAccount = watch("createAccount");
  const password = watch("password");

  useEffect(() => {
    if (createAccount) {
      setShowAccountCreation(true);
    }
  }, [createAccount]);

  // Load quote context when arriving from quote/DJ reply email (?quote=token)
  // Prefill form with booking details so client doesn't re-enter enquiry info
  useEffect(() => {
    const quoteParam = searchParams?.get("quote");
    if (!quoteParam) return;
    let cancelled = false;
    setQuoteLoading(true);
    setQuoteError(null);
    setPrefillApplied(false);
    (async () => {
      try {
        const res = await fetch(
          `/api/book-dj/quote/?token=${encodeURIComponent(quoteParam)}`
        );
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setQuoteError(data.error || "Invalid or expired quote link.");
          setQuoteLoading(false);
          return;
        }
        setQuoteArtistNames(data.artistNames ?? []);
        const prefill = data.prefill;
        if (prefill) {
          const current = getValues();
          const merged = {
            ...current,
            name: prefill.name ?? current.name ?? "",
            email: prefill.email ?? current.email ?? "",
            phone: prefill.phone ?? current.phone ?? "",
            clientAddress: prefill.clientAddress ?? current.clientAddress ?? "",
            clientAddress2: prefill.clientAddress2 ?? current.clientAddress2 ?? "",
            clientTown: prefill.clientTown ?? current.clientTown ?? "",
            clientPostcode: prefill.clientPostcode ?? current.clientPostcode ?? "",
            eventType: prefill.eventType ?? current.eventType ?? "Wedding",
            eventDate: prefill.eventDate ?? current.eventDate ?? "",
            eventStartTime: prefill.eventStartTime ?? current.eventStartTime ?? "",
            eventEndTime: prefill.eventEndTime ?? current.eventEndTime ?? "",
            venueName: prefill.venueName ?? current.venueName ?? "",
            venueAddress: prefill.venueAddress ?? current.venueAddress ?? "",
            venueAddress2: prefill.venueAddress2 ?? current.venueAddress2 ?? "",
            venueTown: prefill.venueTown ?? current.venueTown ?? "",
            venueCounty: prefill.venueCounty ?? current.venueCounty ?? "",
            venuePostcode: prefill.venuePostcode ?? current.venuePostcode ?? "",
            numberOfGuests: prefill.numberOfGuests ?? current.numberOfGuests ?? "",
            agreedFee: prefill.agreedFee ?? current.agreedFee ?? "",
          };
          reset(merged);
          if (data.artistNames?.length > 0) {
            setValue("services", ["DJs"]);
          }
          setPrefillApplied(true);
        }
      } finally {
        if (!cancelled) setQuoteLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams, setValue, reset, getValues]);

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setError("");

    if (!selectedDJ) {
      setError("Please select your preferred DJ");
      setIsSubmitting(false);
      return;
    }

    try {
      // If creating account and not logged in, create account first
      if (data.createAccount && !session) {
        try {
          const registerResponse = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: data.name,
              email: data.email,
              password: data.password,
            }),
          });

          if (!registerResponse.ok) {
            const registerError = await registerResponse.json();
            setError(registerError.error || "Failed to create account");
            setIsSubmitting(false);
            return;
          }
        } catch (registerError) {
          setError("Failed to create account. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      // Create booking
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          clientAddress: data.clientAddress?.trim() || undefined,
          clientAddress2: data.clientAddress2?.trim() || undefined,
          clientTown: data.clientTown?.trim() || undefined,
          clientPostcode: data.clientPostcode?.trim() || undefined,
          eventType: data.eventType,
          eventDate: data.eventDate,
          eventStartTime: data.eventStartTime?.trim() || undefined,
          eventEndTime: data.eventEndTime?.trim() || undefined,
          venueName: data.venueName,
          venueAddress: data.venueAddress?.trim() || undefined,
          venueAddress2: data.venueAddress2?.trim() || undefined,
          venueTown: data.venueTown?.trim() || undefined,
          venueCounty: data.venueCounty?.trim() || undefined,
          venuePostcode: data.venuePostcode?.trim() || undefined,
          numberOfGuests: data.numberOfGuests ? parseInt(data.numberOfGuests) : null,
          services: data.musiciansRequired ? ["DJs", "Musicians"] : ["DJs"],
          message: data.message,
          agreedFee: data.agreedFee?.trim() || undefined,
          preferredDJ: selectedDJ,
          upsellItems: [
            ...(data.earlySetupRequired ? [EARLY_SETUP_UPSELL_LABEL] : []),
            ...selectedUpsells.filter((u) => u !== EARLY_SETUP_UPSELL_LABEL),
          ],
          termsAccepted,
        }),
      });

      const bookingResult = await bookingResponse.json();

      if (!bookingResponse.ok) {
        setError(bookingResult.error || "Failed to submit booking");
        setIsSubmitting(false);
      } else {
        setBookingId(bookingResult.booking?.id);
        setSuccess(true);
        
        // If account was created, redirect to login
        if (data.createAccount && !session) {
          setTimeout(() => {
            router.push(`/login/?registered=true&email=${encodeURIComponent(data.email)}`);
          }, 2000);
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
        <Card className="bg-gray-800 border-champagne-gold/30 max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-green-400 text-lg">
              Booking request submitted
            </p>
            <p className="text-gray-400 text-sm">
              We&apos;ll be in touch soon. Once your booking is confirmed, you&apos;ll be able to complete the DJ worksheet and manage your booking online.
            </p>
            {createAccount && !session ? (
              <p className="text-gray-300 text-sm">
                Redirecting to login...
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => router.push("/")}
                  className="bg-champagne-gold text-black hover:bg-gold-light"
                >
                  Return to Home
                </Button>
                {session && (
                  <Button
                    onClick={() => router.push("/client/dashboard/")}
                    variant="outline"
                    className="border-gray-700 text-white"
                  >
                    Go to Dashboard
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Music className="w-8 h-8 text-champagne-gold" />
                Book Your DJ
              </CardTitle>
              <CardDescription className="text-gray-300">
                Complete your booking details. You can create an account to manage your booking online.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 book-dj-form" data-book-dj-form>
                {quoteLoading && (
                  <div className="p-3 text-sm text-gray-400 bg-gray-900/50 border border-gray-700 rounded-md">
                    Loading your quote…
                  </div>
                )}
                {prefillApplied && !quoteLoading && (
                  <div className="p-3 text-sm text-champagne-gold bg-champagne-gold/10 border border-champagne-gold/40 rounded-md">
                    We&apos;ve filled in your details from your enquiry. You can edit any field and then choose your artist below.
                  </div>
                )}
                {quoteError && (
                  <div className="p-3 text-sm text-amber-400 bg-amber-900/20 border border-amber-800 rounded-md">
                    {quoteError}
                  </div>
                )}
                {!quoteLoading && quoteArtistNames && quoteArtistNames.length > 0 && (
                  <div className="space-y-4 border-b border-gray-700 pb-6">
                    <h3 className="text-xl font-semibold text-champagne-gold flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      Which artist from your quote would you like to book?
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Select the artist you&apos;d like to secure for your event.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {quoteArtistNames.map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setSelectedDJ(name);
                            setValue("services", ["DJs"]);
                          }}
                          className={`rounded-xl border-2 p-4 text-left transition-all flex items-center gap-3 ${
                            selectedDJ === name
                              ? "border-champagne-gold bg-champagne-gold/20"
                              : "border-gray-700 bg-gray-900/30 hover:border-champagne-gold/50"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-champagne-gold/20 flex items-center justify-center shrink-0">
                            <Music className="w-5 h-5 text-champagne-gold" />
                          </div>
                          <span className="font-medium text-white">{name}</span>
                          {selectedDJ === name && (
                            <div className="w-5 h-5 rounded-full bg-champagne-gold border-2 border-champagne-gold ml-auto shrink-0" />
                          )}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDJ("Not sure yet");
                          setValue("services", ["DJs"]);
                        }}
                        className={`rounded-xl border-2 p-4 text-left transition-all flex items-center gap-3 ${
                          selectedDJ === "Not sure yet"
                            ? "border-champagne-gold bg-champagne-gold/20"
                            : "border-gray-700 bg-gray-900/30 hover:border-champagne-gold/50"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-600/40 flex items-center justify-center shrink-0">
                          <Music className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <span className="font-medium text-white">Not sure yet</span>
                          <p className="text-xs text-gray-400">We&apos;ll help you choose</p>
                        </div>
                        {selectedDJ === "Not sure yet" && (
                          <div className="w-5 h-5 rounded-full bg-champagne-gold border-2 border-champagne-gold ml-auto shrink-0" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-md">
                    {error}
                  </div>
                )}

                {/* Client Information */}
                <div className="space-y-4 border-b border-gray-700 pb-6">
                  <h3 className="text-xl font-semibold text-champagne-gold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Your Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-200">Name *</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-offset-gray-900"
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-400">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-200">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-offset-gray-900"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-400">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-200">Client telephone number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-offset-gray-900"
                      placeholder="e.g. 07xxx xxxxxx"
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
                          className="bg-gray-900 border-gray-600 text-white mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="clientAddress2" className="text-gray-400 text-sm">Address line 2 (optional)</Label>
                        <Input
                          id="clientAddress2"
                          {...register("clientAddress2")}
                          placeholder="Flat, building, etc."
                          className="bg-gray-900 border-gray-600 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientTown" className="text-gray-400 text-sm">Town</Label>
                        <Input
                          id="clientTown"
                          {...register("clientTown")}
                          className="bg-gray-900 border-gray-600 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientPostcode" className="text-gray-400 text-sm">Postcode</Label>
                        <Input
                          id="clientPostcode"
                          {...register("clientPostcode")}
                          className="bg-gray-900 border-gray-600 text-white mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Creation Option */}
                  {!session && (
                    <div className="space-y-4 pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="createAccount"
                          {...register("createAccount")}
                          onCheckedChange={(checked) => {
                            setValue("createAccount", checked as boolean);
                            setShowAccountCreation(checked as boolean);
                          }}
                        />
                        <Label htmlFor="createAccount" className="cursor-pointer text-gray-200">
                          Create an account to manage your booking online
                        </Label>
                      </div>

                      {showAccountCreation && (
                        <div className="space-y-2 pl-6 border-l-2 border-champagne-gold/30">
                          <Label htmlFor="password" className="text-gray-200">Password *</Label>
                          <Input
                            id="password"
                            type="password"
                            {...register("password")}
                            className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-offset-gray-900"
                            placeholder="At least 8 characters"
                          />
                          {errors.password && (
                            <p className="text-sm text-red-400">{errors.password.message}</p>
                          )}
                          <p className="text-xs text-gray-400">
                            Create an account to view your booking status and complete the DJ worksheet online
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {session && (
                    <p className="text-sm text-gray-400">
                      Logged in as {session.user?.email}. Booking will be linked to your account.
                    </p>
                  )}
                </div>

                {/* Event Details */}
                <div className="space-y-4 border-b border-gray-700 pb-6">
                  <h3 className="text-xl font-semibold text-champagne-gold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Event Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventType" className="text-gray-200">Event Type *</Label>
                      <select
                        id="eventType"
                        {...register("eventType")}
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-champagne-gold focus:ring-offset-2 focus:ring-offset-gray-900"
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
                      <Label htmlFor="eventDate" className="text-gray-200">Event Date *</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        {...register("eventDate")}
                        className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-offset-gray-900 [color-scheme:dark]"
                      />
                      {errors.eventDate && (
                        <p className="text-sm text-red-400">{errors.eventDate.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventStartTime" className="text-gray-200">Event start time</Label>
                      <Input
                        id="eventStartTime"
                        {...register("eventStartTime")}
                        placeholder="e.g. 7pm"
                        className="bg-gray-900 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventEndTime" className="text-gray-200">Event end time</Label>
                      <Input
                        id="eventEndTime"
                        {...register("eventEndTime")}
                        placeholder="e.g. midnight"
                        className="bg-gray-900 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfGuests" className="text-gray-200">Number of Guests</Label>
                    <Input
                      id="numberOfGuests"
                      type="number"
                      {...register("numberOfGuests")}
                      className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-offset-gray-900"
                      placeholder="Approximate number"
                    />
                  </div>
                </div>

                {/* Venue Information */}
                <div className="space-y-4 border-b border-gray-700 pb-6">
                  <h3 className="text-xl font-semibold text-champagne-gold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Venue Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="venueName" className="text-gray-200">Venue Name *</Label>
                    <Input
                      id="venueName"
                      {...register("venueName")}
                      className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-offset-gray-900"
                      placeholder="Venue name"
                    />
                    {errors.venueName && (
                      <p className="text-sm text-red-400">{errors.venueName.message}</p>
                    )}
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
                          className="bg-gray-900 border-gray-600 text-white mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="venueAddress2" className="text-gray-400 text-sm">Address line 2 (optional)</Label>
                        <Input
                          id="venueAddress2"
                          {...register("venueAddress2")}
                          placeholder="Area, landmark"
                          className="bg-gray-900 border-gray-600 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="venueTown" className="text-gray-400 text-sm">Town</Label>
                        <Input
                          id="venueTown"
                          {...register("venueTown")}
                          className="bg-gray-900 border-gray-600 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="venueCounty" className="text-gray-400 text-sm">County (optional)</Label>
                        <Input
                          id="venueCounty"
                          {...register("venueCounty")}
                          className="bg-gray-900 border-gray-600 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="venuePostcode" className="text-gray-400 text-sm">Postcode</Label>
                        <Input
                          id="venuePostcode"
                          {...register("venuePostcode")}
                          placeholder="Postcode"
                          className="bg-gray-900 border-gray-600 text-white mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-b border-gray-700 pb-6">
                  <Label htmlFor="agreedFee" className="text-gray-200">Agreed fee</Label>
                  <Input
                    id="agreedFee"
                    {...register("agreedFee")}
                    placeholder="e.g. £1500"
                    className="bg-gray-900 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-4 border-b border-gray-700 pb-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="musiciansRequired"
                      checked={watch("musiciansRequired") ?? false}
                      onCheckedChange={(checked) => setValue("musiciansRequired", checked === true)}
                    />
                    <Label htmlFor="musiciansRequired" className="cursor-pointer text-gray-200">
                      Add musicians
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="earlySetupRequired"
                      checked={watch("earlySetupRequired") ?? false}
                      onCheckedChange={(checked) => setValue("earlySetupRequired", checked === true)}
                    />
                    <Label htmlFor="earlySetupRequired" className="cursor-pointer text-gray-200">
                      Early setup required at £120
                    </Label>
                  </div>
                </div>

                {/* Your preferred DJ – artist choice = DJ service (only when not from quote) */}
                {(!quoteArtistNames || quoteArtistNames.length === 0) && (
                  <div className="space-y-4 border-b border-gray-700 pb-6">
                    <h3 className="text-xl font-semibold text-champagne-gold flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      Your preferred DJ
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Choosing your artist confirms you&apos;re booking DJ entertainment.
                    </p>
                    {selectedDJ ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-white font-medium">
                          <span className="text-champagne-gold">{selectedDJ}</span>
                        </span>
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setShowDJModal(true)}
                          className="text-champagne-gold hover:text-gold-light p-0 h-auto"
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowDJModal(true)}
                        className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
                      >
                        Choose your DJ
                      </Button>
                    )}
                    {errors.services && (
                      <p className="text-sm text-red-400">{errors.services.message}</p>
                    )}
                  </div>
                )}
                {/* When from quote, artist choice is above; show service error here if needed */}
                {quoteArtistNames && quoteArtistNames.length > 0 && errors.services && (
                  <p className="text-sm text-red-400">{errors.services.message}</p>
                )}

                {/* Upsell – shown when they've chosen an artist (DJ service) */}
                {selectedDJ && (
                  <UpsellSection
                    selectedServices={watch("musiciansRequired") ? ["DJs", "Musicians"] : ["DJs"]}
                    selectedUpsells={selectedUpsells}
                    onUpsellChange={setSelectedUpsells}
                  />
                )}

                {/* Additional Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-200">Additional Information</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    rows={4}
                    className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-offset-gray-900"
                    placeholder="Any additional details about your event..."
                  />
                </div>

                {/* Terms & Conditions */}
                <div className="border-t border-gray-700 pt-6">
                  <AcceptTermsModule
                    accepted={termsAccepted}
                    onAcceptChange={setTermsAccepted}
                    disabled={isSubmitting}
                    variant="dark"
                    bookingSummary={{
                      venueName: watch("venueName") || undefined,
                      eventDate: watch("eventDate") || undefined,
                      talent: selectedDJ ? [{ name: typeof selectedDJ === "string" ? selectedDJ : (selectedDJ as { name?: string })?.name ?? "DJ", role: "DJ" }] : undefined,
                    }}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700">
                  <Button
                    type="submit"
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                    disabled={isSubmitting || !termsAccepted}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Booking"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/")}
                    className="border-gray-700 text-white"
                  >
                    Cancel
                  </Button>
                </div>

                {/* Login Link */}
                {!session && (
                  <p className="text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link href="/login/" className="text-champagne-gold hover:text-gold-light underline">
                      Sign in here
                    </Link>
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* DJ Selection Modal */}
        <DJSelectionModal
          open={showDJModal}
          onClose={() => setShowDJModal(false)}
          onSelect={(dj) => {
          setSelectedDJ(dj);
          setValue("services", ["DJs"]);
        }}
          selectedDJ={selectedDJ}
          quoteArtistNames={quoteArtistNames ?? undefined}
        />
      </div>
    </div>
  );
}

export default function BookDJPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <BookDJPageContent />
    </Suspense>
  );
}
