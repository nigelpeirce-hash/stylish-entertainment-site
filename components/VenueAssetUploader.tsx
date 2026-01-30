"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, CheckCircle2, FileText } from "lucide-react";
import Script from "next/script";

// Cloudinary widget types
declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (options: any, callback: (error: any, result: any) => void) => any;
    };
  }
}

const VENUES = [
  "Babington House",
  "Kin House",
  "Mells Barn",
  "Dene Farm",
  "Pennard House",
  "The Assembly Rooms",
  "Other",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR + i);

export default function VenueAssetUploader() {
  const [venue, setVenue] = useState<string>("");
  const [year, setYear] = useState<string>(String(CURRENT_YEAR));
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cloudinaryReady, setCloudinaryReady] = useState(false);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Check if Cloudinary is loaded
    if (typeof window !== "undefined" && window.cloudinary) {
      setCloudinaryReady(true);
    }
  }, []);

  const openUploadWidget = () => {
    if (!venue || venue === "Other") {
      setError("Please select a venue");
      return;
    }

    if (!year) {
      setError("Please select a year");
      return;
    }

    if (!cloudinaryReady) {
      setError("Cloudinary upload widget is not ready. Please refresh the page.");
      return;
    }

    setError(null);
    setSuccess(false);
    setUploading(true);

    // Generate filename: babington-2026.pdf
    const venueSlug = venue.toLowerCase().replace(/\s+/g, "");
    const fileName = `${venueSlug}-${year}.pdf`;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "drtwveoqo";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "unsigned";
    
    if (!cloudName) {
      setError("Cloudinary cloud name is not configured. Please check environment variables.");
      setUploading(false);
      return;
    }

    const widgetOptions = {
      cloudName: cloudName,
      uploadPreset: uploadPreset,
      folder: "brochures", // Automatically route to 'brochures' folder
      resourceType: "raw", // PDF files
      sources: ["local"], // Only allow local file uploads for PDFs
      multiple: false,
      maxFileSize: 10000000, // 10MB max (Cloudinary free plan limit; paid plans support 20MB+)
      clientAllowedFormats: ["pdf"],
      showAdvancedOptions: false,
      showPoweredBy: false,
      context: {
        venue: venue,
        year: year,
        fileName: fileName,
      },
    };

      widgetRef.current = window.cloudinary.createUploadWidget(
      widgetOptions,
      async (error: any, result: any) => {
        setUploading(false);

        if (error) {
          // Better error handling for Cloudinary errors
          let errorMessage = "Upload failed. Please try again.";
          
          if (error) {
            // Handle different error types
            if (typeof error === "string") {
              errorMessage = error;
            } else if (error?.message) {
              errorMessage = error.message;
            } else if (error?.error?.message) {
              errorMessage = error.error.message;
            } else if (error?.statusText) {
              errorMessage = error.statusText;
            } else if (typeof error === "object" && Object.keys(error).length > 0) {
              // Try to stringify the error object for debugging
              try {
                const errorStr = JSON.stringify(error);
                if (errorStr !== "{}") {
                  errorMessage = `Upload error: ${errorStr}`;
                }
              } catch (e) {
                // If stringification fails, use default message
              }
            }
          }
          
          // Check if it's a file size error
          const errorStr = typeof error === "string" ? error : JSON.stringify(error || {});
          if (errorStr.includes("exceeds maximum") || errorStr.includes("file size") || errorStr.includes("too large")) {
            errorMessage = "File size exceeds the maximum allowed limit. Please compress your PDF to under 10MB, or contact support for assistance with larger files.";
          }
          
          console.error("Upload error:", {
            error,
            errorType: typeof error,
            errorKeys: error && typeof error === "object" ? Object.keys(error) : [],
            errorMessage,
          });
          
          setError(errorMessage);
          return;
        }

        if (result.event === "success") {
          try {
            // Validate result.info exists
            if (!result.info || !result.info.secure_url) {
              throw new Error("Upload succeeded but file information is missing. Please try again.");
            }

            // Save to database via API
            const response = await fetch("/api/admin/venue-assets/upload/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                venueName: venue,
                year: year,
                pdfUrl: result.info.secure_url,
                cloudinaryPublicId: result.info.public_id || null,
                fileName: fileName,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
              throw new Error(errorData.error || errorData.details || `Server error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success) {
              throw new Error(data.error || "Failed to save to database");
            }

            setSuccess(true);
            setError(null);
            // Reset form after 3 seconds
            setTimeout(() => {
              setSuccess(false);
              setVenue("");
              setYear(String(CURRENT_YEAR));
            }, 3000);
          } catch (err: any) {
            console.error("Database sync error:", {
              error: err,
              errorMessage: err?.message,
              errorType: typeof err,
              stack: err?.stack,
            });
            
            const errorMessage = err?.message || 
                                err?.error || 
                                (typeof err === "string" ? err : "Upload succeeded but failed to save to database. Please contact support.");
            
            setError(errorMessage);
          }
        } else if (result.event === "queues-end") {
          // Widget closed without uploading
          setUploading(false);
        } else if (result.event === "abort") {
          // Upload was aborted
          setUploading(false);
          setError("Upload was cancelled.");
        } else if (result.event === "close") {
          // Widget was closed
          setUploading(false);
        }
      }
    );

    widgetRef.current.open();
  };

  return (
    <>
      {/* Load Cloudinary Upload Widget Script */}
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== "undefined" && window.cloudinary) {
            setCloudinaryReady(true);
          }
        }}
      />

      <Card className="bg-gray-800 border-champagne-gold/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-champagne-gold" />
            Upload Venue Brochure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Venue Selection */}
          <div>
            <label htmlFor="venue-select" className="block text-sm font-medium text-gray-300 mb-2">
              Select Venue *
            </label>
            <select
              id="venue-select"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold focus:border-champagne-gold"
              disabled={uploading}
            >
              <option value="">-- Choose a venue --</option>
              {VENUES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selection */}
          <div>
            <label htmlFor="year-select" className="block text-sm font-medium text-gray-300 mb-2">
              Select Year *
            </label>
            <select
              id="year-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-champagne-gold focus:border-champagne-gold"
              disabled={uploading}
            >
              {YEARS.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* File Name Preview */}
          {venue && year && venue !== "Other" && (
            <div className="p-3 bg-gray-900/50 border border-champagne-gold/20 rounded-md">
              <p className="text-xs text-gray-400 mb-1">File will be saved as:</p>
              <p className="text-sm font-mono text-champagne-gold">
                {venue.toLowerCase().replace(/\s+/g, "")}-{year}.pdf
              </p>
              <p className="text-xs text-gray-500 mt-1">Folder: brochures/</p>
            </div>
          )}

          {/* Drag & Drop Zone Visual */}
          <div
            className="border-2 border-dashed border-champagne-gold/50 rounded-lg p-8 text-center bg-gray-900/30 hover:bg-gray-900/50 transition-colors cursor-pointer"
            onClick={openUploadWidget}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-champagne-gold/70" />
            <p className="text-gray-300 mb-2 font-medium">
              Click to upload PDF brochure
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop or click to browse (PDF only, max 10MB)
            </p>
            <p className="text-xs text-gray-600 mt-1">
              💡 Tip: For files over 10MB, compress your PDF first or contact support for larger upload options
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-900/30 border border-green-500/50 rounded-md text-green-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Brochure uploaded and saved to database successfully!</span>
            </div>
          )}

          {uploading && (
            <div className="flex items-center justify-center gap-2 text-champagne-gold">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Uploading and processing...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
