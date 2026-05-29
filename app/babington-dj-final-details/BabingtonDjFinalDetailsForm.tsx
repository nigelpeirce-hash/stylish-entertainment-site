"use client";

import { motion } from "@/lib/motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const formSchema = z.object({
  happyCouple: z.string().min(2, "Please enter both names (at least 2 characters)"),
  email: z.string().email("Please enter a valid email address"),
  weddingDate: z.string().min(1, "Please choose your wedding date"),
  numberOfGuests: z.coerce
    .number({ invalid_type_error: "Please enter a number" })
    .int("Please enter a whole number")
    .min(1, "At least 1 guest")
    .max(2000, "Please contact us if your guest count is above 2000"),
  ceremonyTime: z.string().min(1, "Please enter the ceremony time"),
  firstDance: z.string().min(1, "Please enter your first dance"),
  lastSong: z.string().min(1, "Please enter your last song"),
  musicRequests: z.string().optional(),
  dislikes: z.string().optional(),
  notesToDJ: z.string().optional(),
  otherItemsBooked: z.string().optional(),
  companyWebsite: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function BabingtonDjFinalDetailsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [musicSectionError, setMusicSectionError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Babington — DJ final details | STYLISH Entertainment";
  }, []);

  useEffect(() => {
    if (submitSuccess) {
      successRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [submitSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyWebsite: "",
      musicRequests: "",
      dislikes: "",
      notesToDJ: "",
      otherItemsBooked: "",
    },
  });

  const musicRequestsRegister = register("musicRequests", {
    onChange: () => {
      if (musicSectionError) setMusicSectionError("");
    },
  });

  const onSubmit = async (data: FormData) => {
    const file = fileInputRef.current?.files?.[0];
    const hasMusicText = (data.musicRequests ?? "").trim().length > 0;
    if (!hasMusicText && !file) {
      setMusicSectionError(
        "Please type your music requests and/or attach a file (playlist, PDF, Word doc, or .txt)."
      );
      return;
    }
    setMusicSectionError("");
    setIsSubmitting(true);
    setError("");
    setSubmitSuccess(false);

    try {
      const fd = new FormData();
      fd.append("happyCouple", data.happyCouple.trim());
      fd.append("email", data.email.trim());
      fd.append("weddingDate", data.weddingDate);
      fd.append("numberOfGuests", String(data.numberOfGuests));
      fd.append("ceremonyTime", data.ceremonyTime.trim());
      fd.append("firstDance", data.firstDance.trim());
      fd.append("lastSong", data.lastSong.trim());
      fd.append("musicRequests", (data.musicRequests ?? "").trim());
      fd.append("dislikes", (data.dislikes ?? "").trim());
      fd.append("notesToDJ", (data.notesToDJ ?? "").trim());
      fd.append("otherItemsBooked", (data.otherItemsBooked ?? "").trim());
      fd.append("companyWebsite", data.companyWebsite ?? "");
      if (file) fd.append("musicAttachment", file);

      const response = await fetch("/api/public/babington-dj-final-details", {
        method: "POST",
        body: fd,
      });

      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        success?: boolean;
        messageId?: string;
      };

      if (!response.ok) {
        throw new Error(typeof result.error === "string" ? result.error : "Failed to submit your details");
      }
      if (typeof result.messageId !== "string" || !result.messageId.trim()) {
        throw new Error(
          "Your details were not delivered by email. If this keeps happening, try turning off autofill for this page or email info@stylishentertainment.co.uk."
        );
      }

      setSubmitSuccess(true);
      reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-center text-champagne-gold/90 text-xs uppercase tracking-[0.2em] mb-3 font-medium">
            Babington House
          </p>
          <Card className="bg-gray-800/90 backdrop-blur-md border-champagne-gold/25 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
            <CardHeader className="space-y-2 pb-2">
              <CardTitle className="text-2xl sm:text-3xl text-white font-serif tracking-tight text-center">
                DJ final details
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm sm:text-base text-center leading-relaxed">
                Share your day-of timings and music so we can tailor the soundtrack to you. Fields marked{" "}
                <span className="text-champagne-gold">*</span> are required.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pt-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-950/40 border border-red-500/40 rounded-lg text-red-200 text-sm mb-6 flex items-start gap-2"
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden />
                  <span>{error}</span>
                </motion.div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative space-y-5 sm:space-y-6"
                noValidate
              >
                {/* Honeypot — hidden from users */}
                <div
                  className="absolute -left-[9999px] w-px h-px overflow-hidden opacity-0 pointer-events-none"
                  aria-hidden="true"
                >
                  <Label htmlFor="companyWebsite">Company website</Label>
                  <Input
                    id="companyWebsite"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("companyWebsite")}
                  />
                </div>

                <div>
                  <Label htmlFor="happyCouple" className="text-gray-200">
                    Happy couple <span className="text-champagne-gold">*</span>
                  </Label>
                  <Input
                    id="happyCouple"
                    {...register("happyCouple")}
                    className="mt-2 bg-gray-900/60 border-champagne-gold/20 text-white focus:border-champagne-gold/50"
                    autoComplete="name"
                  />
                  {errors.happyCouple && (
                    <p className="text-sm text-red-400 mt-1.5" role="alert">
                      {errors.happyCouple.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-200">
                    E-mail <span className="text-champagne-gold">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="mt-2 bg-gray-900/60 border-champagne-gold/20 text-white focus:border-champagne-gold/50"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400 mt-1.5" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <Label htmlFor="weddingDate" className="text-gray-200">
                      Wedding date <span className="text-champagne-gold">*</span>
                    </Label>
                    <Input
                      id="weddingDate"
                      type="date"
                      {...register("weddingDate")}
                      className="mt-2 bg-gray-900/60 border-champagne-gold/20 text-white focus:border-champagne-gold/50"
                    />
                    {errors.weddingDate && (
                      <p className="text-sm text-red-400 mt-1.5" role="alert">
                        {errors.weddingDate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="numberOfGuests" className="text-gray-200">
                      Number of guests <span className="text-champagne-gold">*</span>
                    </Label>
                    <Input
                      id="numberOfGuests"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={2000}
                      {...register("numberOfGuests")}
                      className="mt-2 bg-gray-900/60 border-champagne-gold/20 text-white focus:border-champagne-gold/50"
                    />
                    {errors.numberOfGuests && (
                      <p className="text-sm text-red-400 mt-1.5" role="alert">
                        {errors.numberOfGuests.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="ceremonyTime" className="text-gray-200">
                    Ceremony time <span className="text-champagne-gold">*</span>
                  </Label>
                  <Input
                    id="ceremonyTime"
                    {...register("ceremonyTime")}
                    className="mt-2 bg-gray-900/60 border-champagne-gold/20 text-white focus:border-champagne-gold/50"
                  />
                  {errors.ceremonyTime && (
                    <p className="text-sm text-red-400 mt-1.5" role="alert">
                      {errors.ceremonyTime.message}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <Label htmlFor="firstDance" className="text-gray-200">
                      First dance <span className="text-champagne-gold">*</span>
                    </Label>
                    <Input
                      id="firstDance"
                      {...register("firstDance")}
                      className="mt-2 bg-gray-900/60 border-champagne-gold/20 text-white focus:border-champagne-gold/50"
                    />
                    {errors.firstDance && (
                      <p className="text-sm text-red-400 mt-1.5" role="alert">
                        {errors.firstDance.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastSong" className="text-gray-200">
                      Last song <span className="text-champagne-gold">*</span>
                    </Label>
                    <Input
                      id="lastSong"
                      {...register("lastSong")}
                      className="mt-2 bg-gray-900/60 border-champagne-gold/20 text-white focus:border-champagne-gold/50"
                    />
                    {errors.lastSong && (
                      <p className="text-sm text-red-400 mt-1.5" role="alert">
                        {errors.lastSong.message}
                      </p>
                    )}
                  </div>
                </div>

                <fieldset className="border border-champagne-gold/20 rounded-lg p-4 sm:p-5 space-y-4 bg-gray-900/30">
                  <legend className="text-sm font-medium text-champagne-gold px-2">Music requests</legend>
                  <p className="text-xs text-gray-400 -mt-1 mb-1">
                    Add typed requests, a file, or both (at least one is required).
                  </p>
                  <div>
                    <Label htmlFor="musicRequests" className="text-gray-200">
                      Typed requests
                    </Label>
                    <Textarea
                      id="musicRequests"
                      {...musicRequestsRegister}
                      rows={5}
                      className="mt-2 bg-gray-900/60 border-champagne-gold/20 text-white focus:border-champagne-gold/50 resize-y min-h-[120px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="musicAttachment" className="text-gray-200">
                      Attachment <span className="text-gray-500 font-normal">(optional)</span>
                    </Label>
                    <Input
                      id="musicAttachment"
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                      onChange={() => musicSectionError && setMusicSectionError("")}
                      className="mt-2 h-auto min-h-[3.5rem] py-2.5 leading-normal bg-gray-900/60 border-champagne-gold/20 text-gray-200 [color-scheme:dark] file:mr-4 file:rounded-md file:border-0 file:bg-champagne-gold file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">
                      PDF, Word (.doc, .docx), or .txt — max 10MB.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="dislikes" className="text-gray-200">
                      Dislikes
                    </Label>
                    <Textarea
                      id="dislikes"
                      {...register("dislikes")}
                      rows={4}
                      className="mt-2 bg-gray-900/60 border-champagne-gold/20 text-white focus:border-champagne-gold/50 resize-y min-h-[96px]"
                    />
                  </div>
                  {musicSectionError && (
                    <p className="text-sm text-red-400" role="alert">
                      {musicSectionError}
                    </p>
                  )}
                </fieldset>

                <div>
                  <Label htmlFor="notesToDJ" className="text-gray-200">
                    Any other notes for the DJ
                  </Label>
                  <Textarea
                    id="notesToDJ"
                    {...register("notesToDJ")}
                    rows={4}
                    className="mt-2 bg-gray-900/60 border-champagne-gold/20 text-white focus:border-champagne-gold/50 resize-y"
                  />
                </div>

                <div>
                  <Label htmlFor="otherItemsBooked" className="text-gray-200">
                    Confirm any other items booked
                  </Label>
                  <Textarea
                    id="otherItemsBooked"
                    {...register("otherItemsBooked")}
                    rows={4}
                    className="mt-2 bg-gray-900/60 border-champagne-gold/20 text-white focus:border-champagne-gold/50 resize-y"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-champagne-gold text-black hover:bg-champagne-gold/90 disabled:opacity-50 disabled:cursor-not-allowed h-12 text-base font-semibold shadow-[0_0_24px_rgba(212,175,55,0.15)]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin inline" aria-hidden />
                      Sending…
                    </>
                  ) : (
                    "Send final details"
                  )}
                </Button>
              </form>

              {submitSuccess && (
                <motion.div
                  ref={successRef}
                  id="babington-final-details-success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="p-4 sm:p-5 rounded-lg border border-champagne-gold/35 bg-champagne-gold/5 text-gray-100 mt-6 space-y-2"
                  role="status"
                  aria-live="polite"
                  tabIndex={-1}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-champagne-gold shrink-0 mt-0.5" aria-hidden />
                    <div>
                      <p className="font-semibold text-champagne-gold">Thank you — we&apos;ve received your details</p>
                      <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                        Your information has been sent to our team. If you need anything else before the big day, you
                        can reach us anytime at{" "}
                        <a
                          href="mailto:info@stylishentertainment.co.uk"
                          className="text-champagne-gold underline-offset-2 hover:underline"
                        >
                          info@stylishentertainment.co.uk
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
