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

const DRAFT_KEY = "stylish-party-dj-worksheet-draft-v2";

const worksheetSchema = z.object({
  clientName: z.string().min(1, "Required"),
  email: z.string().email("Please enter a valid email"),
  partyDate: z.string().min(1, "Required"),
  clientPhoneArea: z.string().optional(),
  clientPhoneNumber: z.string().optional(),
  djStartFinishTime: z.string().min(1, "Required"),
  numberOfGuests: z.string().optional(),
  finalBalance: z.string().min(1, "Required"),
  musicNotesToDJ: z.string().optional(),
  lastSong: z.string().optional(),
  musicDislikes: z.string().optional(),
  musicRequests: z.string().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  venueWhat3Words: z.string().optional(),
  venueLoadInNotes: z.string().optional(),
  venuePhone: z.string().optional(),
  djArrivalTime: z.string().optional(),
  djSetupLocation: z.string().optional(),
  soundLimiter: z.string().optional(),
  /** Honeypot — must stay empty */
  wsHp: z.string().optional(),
});

type WorksheetForm = z.infer<typeof worksheetSchema>;

const BASE_DEFAULTS: WorksheetForm = {
  clientName: "",
  email: "",
  partyDate: "",
  clientPhoneArea: "",
  clientPhoneNumber: "",
  djStartFinishTime: "",
  numberOfGuests: "",
  finalBalance: "",
  musicNotesToDJ: "",
  lastSong: "",
  musicDislikes: "",
  musicRequests: "",
  venueName: "",
  venueAddress: "",
  venueWhat3Words: "",
  venueLoadInNotes: "",
  venuePhone: "",
  djArrivalTime: "",
  djSetupLocation: "",
  soundLimiter: "",
  wsHp: "",
};

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

export default function PartyDjWorksheetClient() {
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
    document.title = "Party & Event DJ Worksheet | STYLISH Entertainment";
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
        ["clientName", data.clientName.trim()],
        ["email", data.email.trim()],
        ["partyDate", data.partyDate],
        ["clientPhoneArea", (data.clientPhoneArea ?? "").trim()],
        ["clientPhoneNumber", (data.clientPhoneNumber ?? "").trim()],
        ["djStartFinishTime", data.djStartFinishTime.trim()],
        ["numberOfGuests", (data.numberOfGuests ?? "").trim()],
        ["finalBalance", data.finalBalance.trim()],
        ["musicNotesToDJ", (data.musicNotesToDJ ?? "").trim()],
        ["lastSong", (data.lastSong ?? "").trim()],
        ["musicDislikes", (data.musicDislikes ?? "").trim()],
        ["musicRequests", (data.musicRequests ?? "").trim()],
        ["venueName", (data.venueName ?? "").trim()],
        ["venueAddress", (data.venueAddress ?? "").trim()],
        ["venueWhat3Words", (data.venueWhat3Words ?? "").trim()],
        ["venueLoadInNotes", (data.venueLoadInNotes ?? "").trim()],
        ["venuePhone", (data.venuePhone ?? "").trim()],
        ["djArrivalTime", (data.djArrivalTime ?? "").trim()],
        ["djSetupLocation", (data.djSetupLocation ?? "").trim()],
        ["soundLimiter", (data.soundLimiter ?? "").trim()],
        ["wsHp", data.wsHp ?? ""],
      ];
      entries.forEach(([k, v]) => fd.append(k, v));
      const f = fileRef.current?.files?.[0];
      if (f) fd.append("musicAttachment", f);

      const res = await fetch("/api/public/party-dj-worksheet", { method: "POST", body: fd });
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
              Party &amp; Event DJ Worksheet
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

              <FormRow label="Client Name" required>
                <div>
                  <Input className={fieldClass} {...register("clientName")} autoComplete="name" />
                  {errors.clientName && (
                    <p className="text-sm text-red-400 mt-1">{errors.clientName.message}</p>
                  )}
                </div>
              </FormRow>

              <FormRow label="E-mail" required>
                <div>
                  <Input
                    type="email"
                    className={fieldClass}
                    {...register("email")}
                    autoComplete="email"
                    placeholder="ex: myname@example.com"
                  />
                  {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
                </div>
              </FormRow>

              <FormRow label="Party Date" required>
                <div>
                  <Input type="date" className={`${fieldClass} max-w-xs`} {...register("partyDate")} />
                  {errors.partyDate && (
                    <p className="text-sm text-red-400 mt-1">{errors.partyDate.message}</p>
                  )}
                </div>
              </FormRow>

              <FormRow label="Your Phone Number">
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1 min-w-[100px] max-w-[140px]">
                    <Label className="text-xs text-gray-400 font-normal">Area Code</Label>
                    <Input className={`${fieldClass} mt-1`} {...register("clientPhoneArea")} autoComplete="tel-area-code" />
                  </div>
                  <div className="flex-[2] min-w-[140px]">
                    <Label className="text-xs text-gray-400 font-normal">Phone Number</Label>
                    <Input className={`${fieldClass} mt-1`} {...register("clientPhoneNumber")} autoComplete="tel-national" />
                  </div>
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

              <FormRow label="Notes to the DJ">
                <Textarea rows={5} className={fieldClass} {...register("musicNotesToDJ")} />
              </FormRow>

              <FormRow label="Last Song (if any)">
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

              <SectionHeader>Venue</SectionHeader>

              <FormRow label="Venue / House Name">
                <Input className={fieldClass} {...register("venueName")} />
              </FormRow>

              <FormRow label="Address">
                <Input className={fieldClass} {...register("venueAddress")} />
              </FormRow>

              <FormRow label="What3words">
                <div>
                  <Input
                    className={fieldClass}
                    {...register("venueWhat3Words")}
                    placeholder="e.g. filled.count.soap"
                    autoComplete="off"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    Optional — pinpoints the exact spot.{" "}
                    <a
                      href="https://what3words.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-champagne-gold hover:underline"
                    >
                      what3words.com
                    </a>
                  </p>
                </div>
              </FormRow>

              <FormRow label="Load-in / access notes">
                <div>
                  <Textarea
                    rows={3}
                    className={fieldClass}
                    {...register("venueLoadInNotes")}
                    placeholder="e.g. 178 steps from the car park, no vehicle access, narrow path, stairs only"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    Optional — tell us if kit has to be carried a long way, up stairs, or through awkward access.
                  </p>
                </div>
              </FormRow>

              <FormRow label="Phone">
                <Input className={fieldClass} type="tel" {...register("venuePhone")} autoComplete="tel" />
              </FormRow>

              <FormRow label="DJ arrival Time">
                <Input className={fieldClass} {...register("djArrivalTime")} />
              </FormRow>

              <FormRow label="DJ Setup location">
                <Input className={fieldClass} {...register("djSetupLocation")} />
              </FormRow>

              <FormRow label="Is there a sound limiter?">
                <Input className={fieldClass} {...register("soundLimiter")} />
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
              <h3 className="text-lg font-semibold italic text-champagne-gold/95 mb-4">Other Useful Information</h3>

              <div className="space-y-6">
                <div>
                  <p className="font-bold text-white mb-2 print:text-black">Final Payment</p>
                  <p>Final payment must be made before the start of the engagement.</p>
                </div>

                <div>
                  <p className="font-bold text-white mb-2 print:text-black">Music</p>
                  <p>
                    Please tell us your likes and dis-likes; you can upload an Excel, Word or Spotify screenshots which
                    we will forward to the DJ. You can also write a brief of your requirements. Our DJs are excellent at
                    playing to the crowd — so if you don&apos;t have any requests and trust the DJ, please tell them!
                  </p>
                </div>

                <p className="pt-2">
                  The main thing that we ask is that you enjoy yourself and have the best night of your life. Please let
                  us know how everything goes.
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
