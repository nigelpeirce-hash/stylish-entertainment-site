"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Music, Plus, X, Heart, Ban, Play, Trash2, Link as LinkIcon, FileText, Upload, ExternalLink } from "lucide-react";

interface MusicPlaylistManagerProps {
  bookingId: string;
  initialData?: {
    musicRequests?: string;
    musicDislikes?: string;
    firstDance?: string;
    lastSong?: string;
    musicNotesToDJ?: string;
  };
  onUpdate?: (data: any) => Promise<void>;
}

export default function MusicPlaylistManager({
  bookingId,
  initialData,
  onUpdate,
}: MusicPlaylistManagerProps) {
  const [songs, setSongs] = useState<string[]>([]);
  const [dislikedSongs, setDislikedSongs] = useState<string[]>([]);
  const [newSong, setNewSong] = useState("");
  const [newDislikedSong, setNewDislikedSong] = useState("");
  const [firstDance, setFirstDance] = useState(initialData?.firstDance || "");
  const [lastSong, setLastSong] = useState(initialData?.lastSong || "");
  const [notes, setNotes] = useState(initialData?.musicNotesToDJ || "");
  const [spotifyLinks, setSpotifyLinks] = useState<string[]>([]);
  const [newSpotifyLink, setNewSpotifyLink] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; url: string; type: string }>>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData?.musicRequests) {
      const requests = initialData.musicRequests
        .split("\n")
        .filter((s) => s.trim() !== "");
      setSongs(requests);
    }
    if (initialData?.musicDislikes) {
      const dislikes = initialData.musicDislikes
        .split("\n")
        .filter((s) => s.trim() !== "");
      setDislikedSongs(dislikes);
    }
  }, [initialData]);

  const addSong = () => {
    if (newSong.trim()) {
      setSongs([...songs, newSong.trim()]);
      setNewSong("");
    }
  };

  const removeSong = (index: number) => {
    setSongs(songs.filter((_, i) => i !== index));
  };

  const addDislikedSong = () => {
    if (newDislikedSong.trim()) {
      setDislikedSongs([...dislikedSongs, newDislikedSong.trim()]);
      setNewDislikedSong("");
    }
  };

  const removeDislikedSong = (index: number) => {
    setDislikedSongs(dislikedSongs.filter((_, i) => i !== index));
  };

  const addSpotifyLink = () => {
    if (newSpotifyLink.trim()) {
      // Validate Spotify link
      const spotifyRegex = /^(https?:\/\/)?(open\.spotify\.com|spotify\.com)/i;
      if (spotifyRegex.test(newSpotifyLink.trim())) {
        setSpotifyLinks([...spotifyLinks, newSpotifyLink.trim()]);
        setNewSpotifyLink("");
      } else {
        alert("Please enter a valid Spotify link (e.g., https://open.spotify.com/...)");
      }
    }
  };

  const removeSpotifyLink = (index: number) => {
    setSpotifyLinks(spotifyLinks.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      // For now, we'll store file info locally
      // In production, you'd upload to a storage service (S3, Cloudinary, etc.)
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.name.endsWith(".pdf") ||
          file.name.endsWith(".doc") ||
          file.name.endsWith(".docx")
      );

      if (validFiles.length !== fileArray.length) {
        alert("Only PDF and Word documents (.pdf, .doc, .docx) are allowed.");
      }

      // Create file objects with preview URLs (using FileReader for local preview)
      const newFiles = await Promise.all(
        validFiles.map((file) => {
          return new Promise<{ name: string; url: string; type: string }>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                name: file.name,
                url: reader.result as string, // Data URL for preview
                type: file.type,
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );

      setUploadedFiles([...uploadedFiles, ...newFiles]);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const data = {
        musicRequests: songs.join("\n"),
        musicDislikes: dislikedSongs.join("\n"),
        firstDance: firstDance.trim(),
        lastSong: lastSong.trim(),
        musicNotesToDJ: notes.trim(),
        spotifyLinks: spotifyLinks.join("\n"),
        uploadedFiles: JSON.stringify(uploadedFiles),
      };

      if (onUpdate) {
        await onUpdate(data);
      } else {
        // Fallback: update via API
        const response = await fetch(`/api/client/bookings/${bookingId}/music`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to save music preferences");
        }
      }
    } catch (error) {
      console.error("Error saving music preferences:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-champagne-gold/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5 text-champagne-gold" />
            Music Playlist & Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* First Dance */}
          <div className="space-y-2">
            <Label htmlFor="firstDance" className="text-white">
              First Dance Song
            </Label>
            <Input
              id="firstDance"
              value={firstDance}
              onChange={(e) => setFirstDance(e.target.value)}
              placeholder="Artist - Song Title"
              className="bg-gray-900 text-white border-gray-700"
            />
          </div>

          {/* Last Song */}
          <div className="space-y-2">
            <Label htmlFor="lastSong" className="text-white">
              Last Song of the Night
            </Label>
            <Input
              id="lastSong"
              value={lastSong}
              onChange={(e) => setLastSong(e.target.value)}
              placeholder="Artist - Song Title"
              className="bg-gray-900 text-white border-gray-700"
            />
          </div>

          {/* Song Requests */}
          <div className="space-y-3">
            <Label className="text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-champagne-gold" />
              Songs We'd Love to Hear
            </Label>
            <div className="flex gap-2">
              <Input
                value={newSong}
                onChange={(e) => setNewSong(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSong()}
                placeholder="Add a song request (Artist - Title)"
                className="bg-gray-900 text-white border-gray-700"
              />
              <Button
                onClick={addSong}
                size="sm"
                className="bg-champagne-gold text-black hover:bg-gold-light"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {songs.length > 0 && (
              <div className="space-y-2 mt-3">
                {songs.map((song, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-900 rounded border border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-champagne-gold" />
                      <span className="text-white">{song}</span>
                    </div>
                    <Button
                      onClick={() => removeSong(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Spotify Links & File Uploads */}
            <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
              {/* Spotify Links */}
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2 text-sm">
                  <LinkIcon className="w-4 h-4 text-champagne-gold" />
                  Spotify Playlist Links
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newSpotifyLink}
                    onChange={(e) => setNewSpotifyLink(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSpotifyLink()}
                    placeholder="Paste Spotify playlist or track link"
                    className="bg-gray-900 text-white border-gray-700 text-sm"
                  />
                  <Button
                    onClick={addSpotifyLink}
                    size="sm"
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {spotifyLinks.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {spotifyLinks.map((link, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-2 bg-gray-900 rounded border border-gray-700"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <LinkIcon className="w-4 h-4 text-champagne-gold flex-shrink-0" />
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white text-sm truncate hover:text-champagne-gold flex items-center gap-1"
                          >
                            <span className="truncate">{link}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </div>
                        <Button
                          onClick={() => removeSpotifyLink(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-champagne-gold" />
                  Upload Documents (PDF, Word)
                </Label>
                <div className="flex gap-2">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      multiple
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2 p-2 bg-gray-900 rounded border border-gray-700 cursor-pointer hover:border-champagne-gold/50 transition-colors">
                      <Upload className="w-4 h-4 text-champagne-gold" />
                      <span className="text-white text-sm">
                        {isUploading ? "Uploading..." : "Choose files (PDF, Word)"}
                      </span>
                    </div>
                  </label>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {uploadedFiles.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-2 bg-gray-900 rounded border border-gray-700"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-champagne-gold flex-shrink-0" />
                          <span className="text-white text-sm truncate">{file.name}</span>
                          {file.url && (
                            <a
                              href={file.url}
                              download={file.name}
                              className="text-champagne-gold hover:text-gold-light text-xs ml-2"
                            >
                              Download
                            </a>
                          )}
                        </div>
                        <Button
                          onClick={() => removeFile(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Songs to Avoid */}
          <div className="space-y-3">
            <Label className="text-white flex items-center gap-2">
              <Ban className="w-4 h-4 text-red-400" />
              Songs We'd Prefer Not to Hear
            </Label>
            <div className="flex gap-2">
              <Input
                value={newDislikedSong}
                onChange={(e) => setNewDislikedSong(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addDislikedSong()}
                placeholder="Add a song to avoid (Artist - Title)"
                className="bg-gray-900 text-white border-gray-700"
              />
              <Button
                onClick={addDislikedSong}
                size="sm"
                variant="outline"
                className="border-red-400 text-red-400 hover:bg-red-900/20"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {dislikedSongs.length > 0 && (
              <div className="space-y-2 mt-3">
                {dislikedSongs.map((song, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-900 rounded border border-red-500/30"
                  >
                    <div className="flex items-center gap-2">
                      <Ban className="w-4 h-4 text-red-400" />
                      <span className="text-white">{song}</span>
                    </div>
                    <Button
                      onClick={() => removeDislikedSong(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Notes to DJ */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">
              Additional Notes for DJ
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests, genres you love, or other music preferences..."
              rows={4}
              className="bg-gray-900 text-white border-gray-700 placeholder:text-gray-500"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-champagne-gold text-black hover:bg-gold-light"
          >
            {isSaving ? "Saving..." : "Save Music Preferences"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
