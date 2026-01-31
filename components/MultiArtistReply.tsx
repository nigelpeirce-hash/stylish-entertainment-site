"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Plus, X, Star, Music, Mic2, CheckCircle } from "lucide-react";
import Image from "next/image";
import { ResponsiveImage } from "@/components/cloudinary";
import { sanitizeCloudinaryUrl } from "@/lib/cloudinary-utils";

interface Artist {
  id: string;
  name: string;
  bio: string | null;
  imageUrl: string | null;
  instrument?: string | null; // For musicians
}

interface SelectedArtist {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  tagline: string;
  fee: string;
  recommended: boolean;
  artistType: "dj" | "musician";
}

interface MultiArtistReplyProps {
  bookingId: string;
  clientEmail: string;
  clientName: string;
  venueName: string;
  venueAddress?: string;
  eventDate: string;
  /** When set, show "Quote sent" state, grey out main CTA, and offer Resend */
  quoteSentAt?: string | null;
  onSend?: () => void;
}

export function MultiArtistReply({
  bookingId,
  clientEmail,
  clientName,
  venueName,
  venueAddress,
  eventDate,
  quoteSentAt,
  onSend,
}: MultiArtistReplyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [djs, setDjs] = useState<Artist[]>([]);
  const [musicians, setMusicians] = useState<Artist[]>([]);
  const [loadingArtists, setLoadingArtists] = useState(false);
  const [selectedArtists, setSelectedArtists] = useState<SelectedArtist[]>([]);
  const [customIntro, setCustomIntro] = useState("");
  const [emailOverride, setEmailOverride] = useState(clientEmail);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch both DJs and musicians when dialog opens
  useEffect(() => {
    if (isOpen && (djs.length === 0 || musicians.length === 0)) {
      setEmailOverride(clientEmail);
      (async () => {
        setLoadingArtists(true);
        try {
          const [djRes, musRes] = await Promise.all([
            fetch("/api/admin/djs/"),
            fetch("/api/admin/musicians/"),
          ]);
          const djData = djRes.ok ? await djRes.json() : {};
          const musData = musRes.ok ? await musRes.json() : {};
          const djList = (djData.djs || []).filter((a: Artist) => a.bio && a.imageUrl);
          const musList = (musData.musicians || []).filter((a: Artist) => a.bio && a.imageUrl);
          setDjs(djList);
          setMusicians(musList);
        } catch (err) {
          console.error("Error fetching artists:", err);
        } finally {
          setLoadingArtists(false);
        }
      })();
    }
  }, [isOpen, clientEmail, djs.length, musicians.length]);

  const addArtist = (artist: Artist, type: "dj" | "musician") => {
    if (selectedArtists.some(a => a.id === artist.id)) return;
    const tagline = (artist.bio?.split(/[.!?]/)[0]?.trim() || "").slice(0, 63);
    setSelectedArtists([
      ...selectedArtists,
      {
        id: artist.id,
        name: artist.name,
        bio: artist.bio || "",
        imageUrl: artist.imageUrl || "",
        tagline: tagline.length > 60 ? tagline + "..." : tagline,
        fee: "",
        recommended: selectedArtists.length === 0,
        artistType: type,
      },
    ]);
  };

  const removeArtist = (id: string) => {
    const updated = selectedArtists.filter(a => a.id !== id);
    // If we removed the recommended one, make the first one recommended
    if (updated.length > 0 && !updated.some(a => a.recommended)) {
      updated[0].recommended = true;
    }
    setSelectedArtists(updated);
  };

  const updateArtist = (id: string, field: keyof SelectedArtist, value: string | boolean) => {
    setSelectedArtists(selectedArtists.map(a => {
      if (a.id === id) {
        return { ...a, [field]: value };
      }
      // If setting recommended, unset others
      if (field === "recommended" && value === true) {
        return { ...a, recommended: a.id === id };
      }
      return a;
    }));
  };

  const setRecommended = (id: string) => {
    setSelectedArtists(selectedArtists.map(a => ({
      ...a,
      recommended: a.id === id,
    })));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (selectedArtists.length === 0) {
      setError("Please select at least one artist");
      return;
    }

    if (selectedArtists.some(a => !a.fee.trim())) {
      setError("Please enter a fee for all selected artists");
      return;
    }

    if (!emailOverride || !emailOverride.trim() || !emailOverride.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/admin/send-artist-quote/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          clientEmail: emailOverride.trim(),
          clientName,
          venueName,
          venueAddress,
          eventDate,
          customIntro: customIntro.trim() || null,
          options: selectedArtists.map(a => ({
            name: a.name,
            tagline: a.tagline,
            bio: a.bio,
            photoUrl: a.imageUrl,
            fee: parseFloat(String(a.fee)) || 0,
            recommended: a.recommended,
            artistType: a.artistType,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSelectedArtists([]);
        setCustomIntro("");
        setEmailOverride(clientEmail);
        setSuccess(false);
        if (onSend) onSend();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const quoteSent = !!quoteSentAt;
  const sentDateFormatted = quoteSentAt
    ? new Date(quoteSentAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setSelectedArtists([]);
        setIsOpen(open);
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        {quoteSent ? (
          <>
            <span className="inline-flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Quote sent {sentDateFormatted}
            </span>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-gray-300">
                Resend quote
              </Button>
            </DialogTrigger>
          </>
        ) : (
          <DialogTrigger asChild>
            <Button variant="outline" className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10">
              <Send className="w-4 h-4 mr-2" />
              Send Quote with Options
            </Button>
          </DialogTrigger>
        )}
      </div>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-champagne-gold/30" aria-describedby="multi-artist-quote-desc">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-champagne-gold">
            Send Quote with Multiple Options
          </DialogTitle>
          <DialogDescription id="multi-artist-quote-desc" className="text-sm text-gray-400 mt-1 sr-only">
            Add DJs and musicians to send a quote for {venueName} on {formattedDate}
          </DialogDescription>
          <p className="text-sm text-gray-400 mt-1">
            {venueName} on {formattedDate}
          </p>
        </DialogHeader>

        <form onSubmit={handleSend} className="space-y-6 mt-4">
          {/* Client Email - Editable */}
          <div>
            <Label htmlFor="client-email">Client Email Address *</Label>
            <Input
              id="client-email"
              type="email"
              value={emailOverride}
              onChange={(e) => setEmailOverride(e.target.value)}
              placeholder="client@example.com"
              className="mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              required
            />
            {emailOverride !== clientEmail && (
              <p className="text-xs text-yellow-400 mt-1">
                ⚠️ Email differs from booking record ({clientEmail})
              </p>
            )}
          </div>

          {/* Custom Introduction */}
          <div>
            <Label htmlFor="custom-intro">Introduction Message</Label>
            <Textarea
              id="custom-intro"
              value={customIntro}
              onChange={(e) => setCustomIntro(e.target.value)}
              placeholder="Thank you for getting in touch about your wedding..."
              className="mt-2 min-h-[80px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Artist Selection: DJs + Musicians */}
          <div className="space-y-6">
            {loadingArtists ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-champagne-gold" />
              </div>
            ) : (
              <>
                <div>
                  <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    Add DJs
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto p-1">
                    {djs.map((artist) => {
                      const isSelected = selectedArtists.some(a => a.id === artist.id);
                      return (
                        <button
                          key={artist.id}
                          type="button"
                          onClick={() => !isSelected && addArtist(artist, "dj")}
                          disabled={isSelected}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                            isSelected ? "border-champagne-gold/50 bg-champagne-gold/10 opacity-50" : "border-gray-700 hover:border-champagne-gold/50 hover:bg-gray-800"
                          }`}
                        >
                          {artist.imageUrl && (
                            artist.imageUrl.includes("cloudinary.com") ? (
                              <ResponsiveImage publicId={artist.imageUrl} alt={artist.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" width={40} height={40} />
                            ) : (
                              <Image src={sanitizeCloudinaryUrl(artist.imageUrl) || artist.imageUrl} alt={artist.name} width={40} height={40} className="rounded-full object-cover" onError={() => {}} />
                            )
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{artist.name}</p>
                          </div>
                          {!isSelected && <Plus className="w-4 h-4 text-gray-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                    <Mic2 className="w-4 h-4" />
                    Add Musicians / Roaming Bands
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto p-1">
                    {musicians.map((artist) => {
                      const isSelected = selectedArtists.some(a => a.id === artist.id);
                      return (
                        <button
                          key={artist.id}
                          type="button"
                          onClick={() => !isSelected && addArtist(artist, "musician")}
                          disabled={isSelected}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                            isSelected ? "border-champagne-gold/50 bg-champagne-gold/10 opacity-50" : "border-gray-700 hover:border-champagne-gold/50 hover:bg-gray-800"
                          }`}
                        >
                          {artist.imageUrl && (
                            artist.imageUrl.includes("cloudinary.com") ? (
                              <ResponsiveImage publicId={artist.imageUrl} alt={artist.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" width={40} height={40} />
                            ) : (
                              <Image src={sanitizeCloudinaryUrl(artist.imageUrl) || artist.imageUrl} alt={artist.name} width={40} height={40} className="rounded-full object-cover" onError={() => {}} />
                            )
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{artist.name}</p>
                            {artist.instrument && <p className="text-xs text-gray-400">{artist.instrument}</p>}
                          </div>
                          {!isSelected && <Plus className="w-4 h-4 text-gray-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Selected Artists */}
          {selectedArtists.length > 0 && (
            <div className="space-y-4">
              <Label className="text-base font-semibold">Selected Options ({selectedArtists.length})</Label>
              
              {selectedArtists.map((artist, index) => (
                <Card key={artist.id} className={`p-4 ${artist.recommended ? "bg-champagne-gold/10 border-champagne-gold" : "bg-gray-800/50 border-gray-700"}`}>
                  <div className="flex items-start gap-4">
                    {artist.imageUrl && (
                      artist.imageUrl.includes("cloudinary.com") ? (
                        <ResponsiveImage
                          publicId={artist.imageUrl}
                          alt={artist.name}
                          className="w-[60px] h-[60px] rounded-full object-cover flex-shrink-0"
                          width={60}
                          height={60}
                        />
                      ) : (
                        <Image
                          src={sanitizeCloudinaryUrl(artist.imageUrl) || artist.imageUrl}
                          alt={artist.name}
                          width={60}
                          height={60}
                          className="rounded-full object-cover"
                          onError={() => {
                            console.warn("Image failed to load:", artist.imageUrl);
                          }}
                        />
                      )
                    )}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-lg">{artist.name}</h4>
                          <span className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded">
                            {artist.artistType === "dj" ? "DJ" : "Musician"}
                          </span>
                          {artist.recommended && (
                            <span className="text-xs bg-champagne-gold text-black px-2 py-0.5 rounded font-semibold">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!artist.recommended && selectedArtists.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setRecommended(artist.id)}
                              className="text-gray-400 hover:text-champagne-gold"
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArtist(artist.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-gray-400">Tagline</Label>
                          <Input
                            value={artist.tagline}
                            onChange={(e) => updateArtist(artist.id, "tagline", e.target.value)}
                            placeholder="Short description..."
                            className="mt-1 bg-gray-700 border-gray-600 text-white text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-400">Fee (£) *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={typeof artist.fee === "string" ? artist.fee : String(artist.fee ?? "")}
                            onChange={(e) => updateArtist(artist.id, "fee", e.target.value)}
                            placeholder="0.00"
                            className="mt-1 bg-gray-700 border-gray-600 text-white text-sm"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-gray-400">Bio (editable)</Label>
                        <Textarea
                          value={artist.bio}
                          onChange={(e) => updateArtist(artist.id, "bio", e.target.value)}
                          className="mt-1 min-h-[60px] bg-gray-700 border-gray-600 text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-900/30 border border-green-500/50 rounded text-green-400 text-sm">
              Quote sent successfully to {emailOverride}!
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={sending || selectedArtists.length === 0}
              className="flex-1 bg-champagne-gold text-black hover:bg-gold-light"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Quote ({selectedArtists.length} option{selectedArtists.length !== 1 ? "s" : ""})
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
