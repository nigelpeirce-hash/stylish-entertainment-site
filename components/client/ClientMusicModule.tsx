"use client";

import { useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Link2, Upload } from "lucide-react";

interface ClientMusicModuleProps {
  bookingId: string;
  eventType?: string | null;
  portalToken?: string | null;
  initialData?: {
    musicRequests?: string | null;
    musicDislikes?: string | null;
    musicFileUrl?: string | null;
    firstDance?: string | null;
    lastSong?: string | null;
    musicNotesToDJ?: string | null;
  };
  onSave?: () => void;
  /** Use portal styling (dark/amber) vs card styling */
  variant?: "portal" | "card";
}

export default function ClientMusicModule({
  bookingId,
  eventType = "wedding",
  portalToken,
  initialData = {},
  onSave,
  variant = "portal",
}: ClientMusicModuleProps) {
  const [musicRequests, setMusicRequests] = useState(initialData.musicRequests ?? "");
  const [musicDislikes, setMusicDislikes] = useState(initialData.musicDislikes ?? "");
  const [musicFileUrl, setMusicFileUrl] = useState(initialData.musicFileUrl ?? "");
  const [firstDance, setFirstDance] = useState(initialData.firstDance ?? "");
  const [lastSong, setLastSong] = useState(initialData.lastSong ?? "");
  const [musicNotesToDJ, setMusicNotesToDJ] = useState(initialData.musicNotesToDJ ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isWedding = (eventType || "").toLowerCase() === "wedding";
  const baseUrl = `/api/client/bookings/${bookingId}`;
  const tokenParam = portalToken ? `?token=${encodeURIComponent(portalToken)}` : "";

  const mustPlayCount = useMemo(() => (musicRequests || "").trim().split(/\r?\n/).filter(Boolean).length, [musicRequests]);
  const doNotPlayCount = useMemo(() => (musicDislikes || "").trim().split(/\r?\n/).filter(Boolean).length, [musicDislikes]);
  const total = mustPlayCount + doNotPlayCount;
  const mustPlayPct = total > 0 ? (mustPlayCount / total) * 100 : 50;

  const topSongs = useMemo(() => {
    const musts = (musicRequests || "").trim().split(/\r?\n/).filter(Boolean).slice(0, 5);
    const arr: string[] = [];
    if (firstDance?.trim()) arr.push(firstDance.trim());
    musts.forEach((s) => { if (s && !arr.includes(s)) arr.push(s); });
    if (lastSong?.trim() && !arr.includes(lastSong.trim())) arr.push(lastSong.trim());
    return arr.slice(0, 5);
  }, [musicRequests, firstDance, lastSong]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${baseUrl}/music-preferences/${tokenParam}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          musicRequests: musicRequests.trim() || null,
          musicDislikes: musicDislikes.trim() || null,
          musicFileUrl: musicFileUrl.trim() || null,
          firstDance: firstDance.trim() || null,
          lastSong: lastSong.trim() || null,
          musicNotesToDJ: musicNotesToDJ.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Failed to save");
      }
      onSave?.();
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError(null);
    setUploadingFile(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${baseUrl}/upload-music-file/${tokenParam}`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && typeof data?.url === "string") {
        setMusicFileUrl(data.url);
      } else {
        setUploadError(data?.error ?? "Upload failed");
      }
    } catch {
      setUploadError("Upload failed");
    } finally {
      setUploadingFile(false);
    }
  };

  const cardClass =
    variant === "portal"
      ? "portal-card bg-white/[0.02] backdrop-blur-md border border-white/10"
      : "bg-gray-800 border-champagne-gold/30";
  const inputClass =
    variant === "portal"
      ? "w-full px-4 py-2 bg-gray-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
      : "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500";
  const labelClass = variant === "portal" ? "text-sm text-gray-400" : "text-sm text-gray-300";
  const accentClass = variant === "portal" ? "text-amber-500" : "text-champagne-gold";

  return (
    <Card className={`${cardClass} transition-all duration-300 hover:border-amber-500/30`}>
      <CardHeader>
        <CardTitle className={`text-xl flex items-center gap-2 ${variant === "portal" ? "text-white" : "text-white"}`}>
          <Music className={`w-5 h-5 ${accentClass}`} />
          Build Your Playlist
        </CardTitle>
        <p className={labelClass}>
          Say goodbye to wedding clichés — craft your perfect soundtrack 🎶 Your artist will see these when they&apos;re assigned.
        </p>
        {total > 0 && (
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 rounded-full bg-gray-700 overflow-hidden flex">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mustPlayPct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-emerald-500/80 rounded-l-full"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - mustPlayPct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-amber-500/50 rounded-r-full"
                />
              </div>
              <span className="text-xs text-gray-400">
                {mustPlayCount} must-play · {doNotPlayCount} do-not-play
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {topSongs.length > 0 && (
          <div className="p-3 rounded-lg bg-gray-900/30 border border-white/5">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Your top picks</p>
            <ul className="space-y-1">
              {topSongs.map((song, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2 text-sm text-white"
                >
                  <span className="text-amber-500/70 font-mono text-xs w-5">{i + 1}.</span>
                  <span className="truncate">{song}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
        {isWedding && (
          <div>
            <label className={`block ${labelClass} mb-1`}>First dance</label>
            <input
              type="text"
              value={firstDance}
              onChange={(e) => setFirstDance(e.target.value)}
              placeholder="Artist – Song"
              className={inputClass}
            />
          </div>
        )}
        <div>
          <label className={`block ${labelClass} mb-1`}>Must-plays</label>
          <textarea
            value={musicRequests}
            onChange={(e) => setMusicRequests(e.target.value)}
            placeholder="Songs or styles you&apos;d like"
            rows={2}
            className={inputClass}
          />
        </div>
        <div>
          <label className={`block ${labelClass} mb-1`}>Do not play</label>
          <textarea
            value={musicDislikes}
            onChange={(e) => setMusicDislikes(e.target.value)}
            placeholder="Songs or genres to avoid"
            rows={2}
            className={inputClass}
          />
        </div>
        {isWedding && (
          <div>
            <label className={`block ${labelClass} mb-1`}>Last song</label>
            <input
              type="text"
              value={lastSong}
              onChange={(e) => setLastSong(e.target.value)}
              placeholder="Optional"
              className={inputClass}
            />
          </div>
        )}
        <div>
          <label className={`block ${labelClass} mb-1 flex items-center gap-2`}>
            <Link2 className="w-4 h-4" />
            Spotify playlist or link to PDF / Word music list
          </label>
          <input
            type="url"
            value={musicFileUrl}
            onChange={(e) => {
              setMusicFileUrl(e.target.value);
              setUploadError(null);
            }}
            placeholder="https://open.spotify.com/playlist/... or link to your PDF/Word document"
            className={inputClass}
          />
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFile}
              className={variant === "portal" ? "border-amber-500/50 text-amber-400 hover:bg-amber-500/10" : "border-champagne-gold/50 text-champagne-gold"}
            >
              <Upload className="w-4 h-4 mr-1.5" />
              {uploadingFile ? "Uploading…" : "Upload PDF or Word file"}
            </Button>
            {uploadError && (
              <span className="text-sm text-red-400">
                {uploadError}
                {uploadError.toLowerCase().includes("not configured") && " You can paste a link above instead."}
              </span>
            )}
          </div>
        </div>
        <div>
          <label className={`block ${labelClass} mb-1`}>Notes for your DJ / musician</label>
          <textarea
            value={musicNotesToDJ}
            onChange={(e) => setMusicNotesToDJ(e.target.value)}
            placeholder="Volume, vibe, announcements, etc."
            rows={2}
            className={inputClass}
          />
        </div>
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={variant === "portal" ? "bg-amber-500 hover:bg-amber-600 text-black font-semibold" : "bg-champagne-gold text-black hover:bg-gold-light"}
        >
          {isSaving ? "Saving…" : "Save preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}
