"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Loader2, Printer } from "lucide-react";

const DRAFT_KEY = "stylish-dj-worksheet-draft-v1";

const worksheetSchema = z.object({
  happyCouple1: z.string().min(1, "Required"),
  happyCouple2: z.string().min(1, "Required"),
  email: z.string().email("Please enter a valid email"),
  weddingDate: z.string().min(1, "Required"),
  clientPhone: z.string().optional(),
  venueName: z.string().min(1, "Required"),
  venueContact: z.string().optional(),
  venueAddress: z.string().min(1, "Required"),
  venueAddress2: z.string().optional(),
  venueTown: z.string().optional(),
  venueCounty: z.string().optional(),
  venuePostcode: z.string().min(1, "Required"),
  djSectionPhone: z.string().optional(),
  djArrivalTime: z.string().min(1, "Required"),
  djStartFinishTime: z.string().min(1, "Required"),
  djSetupLocation: z.string().optional(),
  djParking: z.string().optional(),
  soundLimiter: z.string().optional(),
  numberOfGuests: z.string().optional(),
  finalBalance: z.string().min(1, "Required"),
  musicNotesToDJ: z.string().optional(),
  musicNotesToStylish: z.string().optional(),
  firstDance: z.string().optional(),
  lastSong: z.string().optional(),
  musicDislikes: z.string().optional(),
  musicRequests: z.string().optional(),
  /** Honeypot — must stay empty (obscure name avoids autofill treating it as a URL field). */
  wsHp: z.string().optional(),
});

type WorksheetForm = z.infer<typeof worksheetSchema>;

const BASE_DEFAULTS: WorksheetForm = {
  happyCouple1: "",
  happyCouple2: "",
  email: "",
  weddingDate: "",
  clientPhone: "",
  venueName: "",
  venueContact: "",
  venueAddress: "",
  venueAddress2: "",
  venueTown: "",
  venueCounty: "",
  venuePostcode: "",
  djSectionPhone: "",
  djArrivalTime: "",
  djStartFinishTime: "",
  djSetupLocation: "",
  djParking: "",
  soundLimiter: "",
  numberOfGuests: "",
  finalBalance: "",
  musicNotesToDJ: "",
  musicNotesToStylish: "",
  firstDance: "",
  lastSong: "",
  musicDislikes: "",
  musicRequests: "",
  wsHp: "",
};

/** Dark fields: color-scheme dark lightens native date/time picker icons in WebKit */
const fieldClass =
  "bg-gray-900/60 border-champagne-gold/20 text-white focus-visible:border-champagne-gold/50 focus-visible:ring-champagne-gold/30 [color-scheme:dark]";

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8">
      <hr className="border-champagne-gold/25" />
      <h2 className="text-center text-lg sm:text-xl font-serif font-semibold text-champagne-gold py-3 tracking-tight">
        {children}
      </h2>
      <hr className="border-champagne-gold/25" />
    </div>
  );
}

function FormRow({
  label,
  required,
  children,
}: {
  label: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(160px,220px)_1fr] gap-2 md:gap-6 py-3.5 border-b border-champagne-gold/15">
      <div className="font-semibold text-gray-200 text-sm sm:text-base leading-snug pt-2">
        {label}
        {required ? <span className="text-champagne-gold"> *</span> : null}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export default function DjWorksheetClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<WorksheetForm>({
    resolver: zodResolver(worksheetSchema),
    defaultValues: BASE_DEFAULTS,
  });

  useEffect(() => {
    document.title = "DJ Worksheet | STYLISH Entertainment";
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<WorksheetForm>;
      reset({ ...BASE_DEFAULTS, ...parsed, wsHp: "" });
    } catch {
      /* ignore */
    }
  }, [reset]);

  useEffect(() => {
    if (submitSuccess) {
      successRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [submitSuccess]);

  const saveDraft = () => {
    const v = getValues();
    const { wsHp: _h, ...rest } = v;
    void _h;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
    setDraftSaved(true);
    window.setTimeout(() => setDraftSaved(false), 3500);
  };

  const onPrint = () => window.print();

  const onSubmit = async (data: WorksheetForm) => {
    setIsSubmitting(true);
    setError("");
    setSubmitSuccess(false);
    try {
      const fd = new FormData();
      const entries: [string, string][] = [
        ["happyCouple1", data.happyCouple1.trim()],
        ["happyCouple2", data.happyCouple2.trim()],
        ["email", data.email.trim()],
        ["weddingDate", data.weddingDate],
        ["clientPhone", (data.clientPhone ?? "").trim()],
        ["venueName", data.venueName.trim()],
        ["venueContact", (data.venueContact ?? "").trim()],
        ["venueAddress", data.venueAddress.trim()],
        ["venueAddress2", (data.venueAddress2 ?? "").trim()],
        ["venueTown", (data.venueTown ?? "").trim()],
        ["venueCounty", (data.venueCounty ?? "").trim()],
        ["venuePostcode", data.venuePostcode.trim()],
        ["djSectionPhone", (data.djSectionPhone ?? "").trim()],
        ["djArrivalTime", data.djArrivalTime.trim()],
        ["djStartFinishTime", data.djStartFinishTime.trim()],
        ["djSetupLocation", (data.djSetupLocation ?? "").trim()],
        ["djParking", (data.djParking ?? "").trim()],
        ["soundLimiter", data.soundLimiter === "Yes" || data.soundLimiter === "No" ? data.soundLimiter : ""],
        ["numberOfGuests", (data.numberOfGuests ?? "").trim()],
        ["finalBalance", data.finalBalance.trim()],
        ["musicNotesToDJ", (data.musicNotesToDJ ?? "").trim()],
        ["musicNotesToStylish", (data.musicNotesToStylish ?? "").trim()],
        ["firstDance", (data.firstDance ?? "").trim()],
        ["lastSong", (data.lastSong ?? "").trim()],
        ["musicDislikes", (data.musicDislikes ?? "").trim()],
        ["musicRequests", (data.musicRequests ?? "").trim()],
        ["wsHp", data.wsHp ?? ""],
      ];
      entries.forEach(([k, v]) => fd.append(k, v));
      const f = fileRef.current?.files?.[0];
      if (f) fd.append("musicAttachment", f);

      const res = await fetch("/api/public/dj-worksheet", { method: "POST", body: fd });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        success?: boolean;
        messageId?: string;
      };
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : "Submission failed");
      }
      if (typeof json.messageId !== "string" || !json.messageId.trim()) {
        throw new Error(
          "Your worksheet was not delivered by email. If you use autofill or a password manager, try again with this field left blank, or email info@stylishentertainment.co.uk."
        );
      }
      localStorage.removeItem(DRAFT_KEY);
      setSubmitSuccess(true);
      reset();
      if (fileRef.current) fileRef.current.value = "";
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 sm:py-14 px-4 print:bg-white print:text-black">
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-champagne-gold/90 text-xs uppercase tracking-[0.2em] mb-3 font-medium print:hidden">
          STYLISH Entertainment
        </p>

        <Card className="bg-gray-800/90 backdrop-blur-md border-champagne-gold/25 shadow-[0_0_40px_rgba(212,175,55,0.08)] print:border-gray-300 print:shadow-none print:bg-white">
          <CardHeader className="space-y-2 pb-2 print:text-black">
            <CardTitle className="text-2xl sm:text-3xl text-white font-serif tracking-tight text-center print:text-black">
              DJ Worksheet
            </CardTitle>
            <CardDescription className="text-gray-300 text-sm sm:text-base text-center leading-relaxed print:text-gray-700">
              Complete the required fields and submit. You can save a draft on this device or print a copy.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 sm:px-6 pt-2 print:text-black">
            {error && (
              <div
                className="mb-4 p-4 rounded-lg border border-red-500/40 bg-red-950/40 text-red-200 text-sm flex gap-2 print:hidden"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 shrink-0" aria-hidden />
                <span>{error}</span>
              </div>
            )}
            {draftSaved && (
              <p className="mb-4 text-sm text-champagne-gold/90 print:hidden" role="status">
                Draft saved on this device.
              </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="relative">
              <div
                className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
                aria-hidden
              >
                <Label htmlFor="wsHp" className="sr-only">
                  Leave blank
                </Label>
                <Input
                  id="wsHp"
                  tabIndex={-1}
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  {...register("wsHp")}
                />
              </div>

              <FormRow label="Happy Couple" required>
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1 min-w-[140px]">
                    <Input
                      className={fieldClass}
                      {...register("happyCouple1")}
                      aria-label="Happy couple first name"
                    />
                    {errors.happyCouple1 && (
                      <p className="text-sm text-red-400 mt-1">{errors.happyCouple1.message}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-[140px]">
                    <Input
                      className={fieldClass}
                      {...register("happyCouple2")}
                      aria-label="Happy couple second name"
                    />
                    {errors.happyCouple2 && (
                      <p className="text-sm text-red-400 mt-1">{errors.happyCouple2.message}</p>
                    )}
                  </div>
                </div>
              </FormRow>

              <FormRow label="E-mail" required>
                <div>
                  <Input type="email" className={fieldClass} {...register("email")} autoComplete="email" />
                  {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
                </div>
              </FormRow>

              <FormRow label="Wedding Date" required>
                <div>
                  <Input type="date" className={`${fieldClass} max-w-xs`} {...register("weddingDate")} />
                  {errors.weddingDate && (
                    <p className="text-sm text-red-400 mt-1">{errors.weddingDate.message}</p>
                  )}
                </div>
              </FormRow>

              <FormRow label="Your Phone Number">
                <Input className={fieldClass} type="tel" {...register("clientPhone")} autoComplete="tel" />
              </FormRow>

              <SectionHeader>Venue Information</SectionHeader>

              <FormRow label="Venue Name" required>
                <div>
                  <Input className={fieldClass} {...register("venueName")} />
                  {errors.venueName && <p className="text-sm text-red-400 mt-1">{errors.venueName.message}</p>}
                </div>
              </FormRow>

              <FormRow label="Venue Contact">
                <Input className={fieldClass} {...register("venueContact")} />
              </FormRow>

              <FormRow label="Venue Address" required>
                <div className="rounded-lg border border-champagne-gold/30 bg-gray-900/40 p-4 space-y-3">
                  <div>
                    <Label className="text-xs text-gray-400 font-normal">Address</Label>
                    <Input className={`${fieldClass} mt-1`} {...register("venueAddress")} />
                    {errors.venueAddress && (
                      <p className="text-sm text-red-400 mt-1">{errors.venueAddress.message}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400 font-normal">Address 2</Label>
                    <Input className={`${fieldClass} mt-1`} {...register("venueAddress2")} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-400 font-normal">Town</Label>
                      <Input className={`${fieldClass} mt-1`} {...register("venueTown")} />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-400 font-normal">County</Label>
                      <Input className={`${fieldClass} mt-1`} {...register("venueCounty")} />
                    </div>
                  </div>
                  <div className="max-w-[220px]">
                    <Label className="text-xs text-gray-400 font-normal">Post Code</Label>
                    <Input className={`${fieldClass} mt-1`} {...register("venuePostcode")} />
                    {errors.venuePostcode && (
                      <p className="text-sm text-red-400 mt-1">{errors.venuePostcode.message}</p>
                    )}
                  </div>
                </div>
              </FormRow>

              <hr className="my-8 border-champagne-gold/20" aria-hidden />

              <FormRow label="Phone Number">
                <Input className={fieldClass} type="tel" {...register("djSectionPhone")} autoComplete="tel" />
              </FormRow>

              <FormRow label="DJ Arrival Time" required>
                <div>
                  <Input type="time" className={`${fieldClass} max-w-[200px]`} {...register("djArrivalTime")} />
                  {errors.djArrivalTime && (
                    <p className="text-sm text-red-400 mt-1">{errors.djArrivalTime.message}</p>
                  )}
                </div>
              </FormRow>

              <FormRow label="DJ Start and Finish Time" required>
                <div>
                  <Input className={fieldClass} {...register("djStartFinishTime")} />
                  {errors.djStartFinishTime && (
                    <p className="text-sm text-red-400 mt-1">{errors.djStartFinishTime.message}</p>
                  )}
                </div>
              </FormRow>

              <FormRow label="DJ Setup Location">
                <Input className={fieldClass} {...register("djSetupLocation")} />
              </FormRow>

              <FormRow label="DJ Parking">
                <Input className={fieldClass} {...register("djParking")} />
              </FormRow>

              <FormRow label="Is there a sound-limiter">
                <fieldset className="space-y-2 border-0 p-0 m-0">
                  <legend className="sr-only">Sound limiter</legend>
                  <div className="flex flex-col gap-2 text-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer font-normal">
                      <input type="radio" value="Yes" className="accent-champagne-gold" {...register("soundLimiter")} />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-normal">
                      <input type="radio" value="No" className="accent-champagne-gold" {...register("soundLimiter")} />
                      No
                    </label>
                  </div>
                </fieldset>
              </FormRow>

              <FormRow label="Number of guests">
                <Input className={`${fieldClass} max-w-xs`} type="text" inputMode="numeric" {...register("numberOfGuests")} />
              </FormRow>

              <SectionHeader>Payment</SectionHeader>

              <FormRow label="Final Balance" required>
                <div>
                  <Input className={fieldClass} {...register("finalBalance")} />
                  {errors.finalBalance && (
                    <p className="text-sm text-red-400 mt-1">{errors.finalBalance.message}</p>
                  )}
                </div>
              </FormRow>

              <SectionHeader>Music Details</SectionHeader>

              <FormRow label="First Dance">
                <Input className={fieldClass} {...register("firstDance")} />
              </FormRow>

              <FormRow label="Last Song">
                <Input className={fieldClass} {...register("lastSong")} />
              </FormRow>

              <FormRow label="Dis Likes (Genres or Tracks)">
                <Textarea rows={4} className={fieldClass} {...register("musicDislikes")} />
              </FormRow>

              <FormRow label="Music Requests">
                <Textarea rows={4} className={fieldClass} {...register("musicRequests")} />
              </FormRow>

              <FormRow label="Upload an Excel or Word Doc">
                <Input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls,.doc,.docx,.pdf,.txt,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  className={`${fieldClass} h-auto min-h-[3.5rem] py-2.5 leading-normal file:mr-4 file:rounded-md file:border-0 file:bg-champagne-gold file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-gray-900`}
                />
              </FormRow>

              <FormRow label="Notes to the DJ">
                <Textarea rows={5} className={fieldClass} {...register("musicNotesToDJ")} />
              </FormRow>

              <FormRow label="Notes to STYLISH Entertainment">
                <Textarea rows={5} className={fieldClass} {...register("musicNotesToStylish")} />
              </FormRow>

              <div className="flex flex-wrap gap-3 pt-8 print:hidden">
                <Button
                  type="button"
                  variant="outline"
                  className="border-champagne-gold/40 text-champagne-gold hover:bg-champagne-gold/10 bg-transparent"
                  onClick={saveDraft}
                >
                  Save
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-champagne-gold text-black hover:bg-champagne-gold/90 min-w-[100px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin inline" aria-hidden />
                      Submitting…
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-champagne-gold/40 text-champagne-gold hover:bg-champagne-gold/10 bg-transparent"
                  onClick={onPrint}
                >
                  <Printer className="w-4 h-4 mr-2 inline text-champagne-gold" aria-hidden />
                  Print Form
                </Button>
              </div>
            </form>

            {submitSuccess && (
              <div
                ref={successRef}
                className="mt-8 p-4 sm:p-5 rounded-lg border border-champagne-gold/35 bg-champagne-gold/5 text-gray-100 print:hidden"
                role="status"
                aria-live="polite"
                tabIndex={-1}
              >
                <div className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-champagne-gold shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <p className="font-semibold text-champagne-gold">Thank you — we&apos;ve received your worksheet.</p>
                    <p className="text-sm text-gray-300 mt-2">
                      If you need anything else, contact{" "}
                      <a
                        className="text-champagne-gold underline-offset-2 hover:underline"
                        href="mailto:info@stylishentertainment.co.uk"
                      >
                        info@stylishentertainment.co.uk
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            )}

            <section className="mt-12 pt-8 border-t border-champagne-gold/20 text-sm sm:text-base leading-relaxed text-gray-300 max-w-none print:text-gray-800 print:border-gray-300">
              <h3 className="text-lg font-semibold text-champagne-gold/95 mb-4 not-italic">Other Useful Information</h3>

              <div className="space-y-6">
                <div>
                  <p className="font-bold text-white mb-2 print:text-black">Final Payment</p>
                  <p>
                    Unless otherwise agreed, please pay your chosen DJ / Musicians in cash at the start of their engagement
                    / performance. Please contact us directly if you would like to pay in advance by BACS / direct
                    payment. Our artistes do not accept cheques on the night and do not like to chase people for their
                    payment. So please ensure it is at the start of their performance.
                  </p>
                </div>

                <div>
                  <p className="font-bold text-white mb-2 print:text-black">Music</p>
                  <p>
                    Please tell us your likes and dis-likes; you can upload an Excel, Word or Spotify screenshots which
                    we will forward to the DJ. You can also write a brief of your requirements. Our DJs are excellent at
                    playing to the crowd — so if you don&apos;t have any requests and trust the DJ, please tell them!
                  </p>
                </div>

                <div>
                  <p className="font-bold text-white mb-2 print:text-black">First Dance</p>
                  <p>
                    A first dance is a great way to start the party: let the DJ warm the crowd up before you perform your
                    dance. We also advise having fun with it — your enjoyment will radiate through the crowd.
                  </p>
                </div>

                <div>
                  <p className="font-bold text-white mb-2 print:text-black">Last Song of the Evening</p>
                  <p className="mb-2">We suggest something anthemic to close the evening. Popular choices include:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Take That — Never Forget / Greatest Day</li>
                    <li>Queen — Don&apos;t Stop Me Now / Bohemian Rhapsody</li>
                    <li>Oasis — Wonderwall / Champagne Supernova</li>
                    <li>Elbow — One Day Like This</li>
                    <li>David Guetta — Titanium / When Love Takes Over</li>
                  </ul>
                </div>

                <p className="pt-2">
                  The main thing we ask is that you enjoy yourself and have the best day of your life. Please let us know
                  how everything goes.
                </p>
                <p className="font-bold text-champagne-gold">Ali &amp; Nigel</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
