"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Eye, Download } from "lucide-react";
import Link from "next/link";
import {
  getJourneyEmail,
  type JourneyStage,
  type JourneyEmailData,
} from "@/lib/email-journey-templates";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const JOURNEY_STAGES: {
  stage: JourneyStage;
  title: string;
  description: string;
}[] = [
  {
    stage: "enquiry-autoresponder",
    title: "Enquiry Auto-Responder",
    description: "Immediate 'Thank you' with PDF brochure link",
  },
  {
    stage: "booking-confirmation",
    title: "Booking Confirmation",
    description: "Sent after deposit, includes link to Client Admin",
  },
  {
    stage: "4-week-checkin",
    title: "4-Week Check-in",
    description: "Automation to ask for final song choices/logistics",
  },
  {
    stage: "week-of-excitement",
    title: "Week-of Excitement",
    description: "A short 'We are ready for you' note",
  },
  {
    stage: "post-wedding-magic",
    title: "Post-Wedding Magic",
    description: "Sent 3 days after event, asking for feedback/testimonials",
  },
];

// Placeholder data for preview
const PLACEHOLDER_DATA: JourneyEmailData = {
  clientName: "Sarah & James",
  eventType: "Wedding",
  eventDate: "Saturday, 15 June 2025",
  venueName: "Babington House",
  clientAdminUrl: "https://stylishentertainment.co.uk/client/dashboard",
  brochureUrl: "https://stylishentertainment.co.uk/brochure.pdf",
};

export default function EmailJourneyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedStage, setSelectedStage] = useState<JourneyStage>("enquiry-autoresponder");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewSubject, setPreviewSubject] = useState<string>("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      updatePreview(selectedStage);
    }
  }, [selectedStage, status, session]);

  const updatePreview = (stage: JourneyStage) => {
    try {
      const email = getJourneyEmail(stage, PLACEHOLDER_DATA);
      setPreviewSubject(email.subject);
      setPreviewHtml(email.html);
    } catch (error) {
      console.error("Error generating email preview:", error);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Find the stage title
      const stageInfo = JOURNEY_STAGES.find((s) => s.stage === selectedStage);
      const stageTitle = stageInfo?.title || "Email Template";

      // Create a temporary container with the email content
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "600px";
      tempDiv.innerHTML = previewHtml;
      document.body.appendChild(tempDiv);

      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Remove temp element
      document.body.removeChild(tempDiv);

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add heading at the top
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text(stageTitle, 15, 20);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Subject: ${previewSubject}`, 15, 30);
      pdf.setDrawColor(212, 175, 55); // Champagne gold
      pdf.setLineWidth(0.5);
      pdf.line(15, 35, 195, 35);

      position = 45; // Start content below heading

      // Add first page
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - position;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      const fileName = `${stageTitle.replace(/\s+/g, "-")}-Email-Template.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Email Journey Manager</h1>
              <p className="text-gray-400">
                Preview and manage customer lifecycle email templates
              </p>
            </div>
            <Link href="/admin">
              <Button
                variant="outline"
                className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Journey Stages List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-champagne-gold" />
                  Journey Stages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {JOURNEY_STAGES.map((item) => (
                    <button
                      key={item.stage}
                      onClick={() => setSelectedStage(item.stage)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedStage === item.stage
                          ? "border-champagne-gold bg-champagne-gold/10"
                          : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
                      }`}
                    >
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Email Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-champagne-gold" />
                      Email Preview
                    </CardTitle>
                    <p className="text-sm text-gray-400 mt-2">
                      <strong>Subject:</strong> {previewSubject}
                    </p>
                  </div>
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isGeneratingPDF ? "Generating..." : "Download PDF"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg overflow-hidden border border-gray-700">
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full h-[800px] border-0"
                    title="Email Preview"
                  />
                </div>
                <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">
                    <strong>Preview Data:</strong>
                  </p>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>Client: {PLACEHOLDER_DATA.clientName}</li>
                    <li>Event: {PLACEHOLDER_DATA.eventType}</li>
                    <li>Date: {PLACEHOLDER_DATA.eventDate}</li>
                    <li>Venue: {PLACEHOLDER_DATA.venueName}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
