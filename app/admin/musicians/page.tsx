"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, Music } from "lucide-react";
import Image from "next/image";
import { sanitizeCloudinaryUrl } from "@/lib/cloudinary-utils";
import { MusicianForm } from "./MusicianForm";
import { Toast } from "@/components/ui/toast";
import Link from "next/link";

interface Musician {
  id: string;
  name: string;
  instrument: string | null;
  imageUrl: string | null;
  bio: string | null;
  strapLine?: string | null;
  fullBio?: string | null;
  youtubeEmbed: string | null;
  isActive: boolean;
  displayOrder: number;
}

function MusicianCard({ musician, onEdit, onDelete }: { 
  musician: Musician, 
  onEdit: (m: Musician) => void, 
  onDelete: (id: string) => void 
}) {
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Card className="bg-gray-900/40 backdrop-blur-xl border-champagne-gold/30 hover:border-champagne-gold/60 transition-all duration-500 shadow-xl overflow-hidden group">
        <div className="relative h-40 w-full bg-gray-800">
          {musician.imageUrl ? (
            <Image 
              src={sanitizeCloudinaryUrl(musician.imageUrl) || musician.imageUrl} 
              alt={musician.name} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex items-center justify-center h-full"><Music className="text-champagne-gold/20 w-12 h-12" /></div>
          )}
          <div className="absolute top-2 right-2">
            {musician.isActive ? 
              <span className="bg-green-500/20 border border-green-500/50 text-green-400 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Live</span> : 
              <span className="bg-red-500/20 border border-red-500/50 text-red-400 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Hidden</span>
            }
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold text-white mb-1">{musician.name}</h3>
          <p className="text-champagne-gold text-xs font-medium mb-3 uppercase tracking-widest">
            {musician.instrument || "General Performer"}
          </p>
          <div className="flex gap-2">
            <Button onClick={() => onEdit(musician)} variant="outline" className="flex-1 border-champagne-gold/40 text-champagne-gold hover:bg-champagne-gold hover:text-black">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button onClick={() => onDelete(musician.id)} variant="ghost" className="text-gray-500 hover:text-red-400 hover:bg-red-900/20">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

type ToastState = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
} | null;

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export default function MusiciansPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [musicians, setMusicians] = useState<Musician[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [formData, setFormData] = useState({
    name: "",
    instrument: "",
    bio: "",
    strapLine: "",
    fullBio: "",
    youtubeEmbed: "",
    seoTitle: "",
    seoDescription: "",
    imageUrl: "",
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    
    if (status === "authenticated") {
      if ((session?.user as any)?.role !== "admin") {
        router.push("/client/dashboard");
        return;
      }
      fetchMusicians();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router]);

  const fetchMusicians = async () => {
    try {
      const response = await fetch("/api/admin/musicians/");
      if (response.ok) {
        const data = await response.json();
        setMusicians(data.musicians || []);
      }
    } catch (error) {
      console.error("Error fetching musicians:", error);
      showToast("Failed to load musicians", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({
      id: Date.now().toString(),
      message,
      type,
    } as ToastState);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast("Name is required", "error");
      return;
    }

    setIsSaving(true);
    try {
      const slug = generateSlug(formData.name);
      const payload = {
        ...formData,
        slug, // Auto-generate slug from name
        imageUrl: formData.imageUrl || null,
        instrument: formData.instrument || null,
        youtubeEmbed: formData.youtubeEmbed || null,
        strapLine: formData.strapLine || null,
        fullBio: formData.fullBio || null,
      };

      if (editingId) {
        // Update existing
        const response = await fetch(`/api/admin/musicians/${editingId}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          await fetchMusicians();
          resetForm();
          showToast("Musician updated successfully", "success");
        } else {
          const error = await response.json();
          showToast(error.error || "Failed to update musician", "error");
        }
      } else {
        // Create new
        const response = await fetch("/api/admin/musicians/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          await fetchMusicians();
          resetForm();
          showToast("Musician created successfully", "success");
        } else {
          const error = await response.json();
          showToast(error.error || "Failed to create musician", "error");
        }
      }
    } catch (error) {
      console.error("Error saving musician:", error);
      showToast("An error occurred while saving", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this musician?")) return;

    try {
      const response = await fetch(`/api/admin/musicians/${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchMusicians();
        showToast("Musician deleted successfully", "success");
      } else {
        showToast("Failed to delete musician", "error");
      }
    } catch (error) {
      console.error("Error deleting musician:", error);
      showToast("An error occurred while deleting", "error");
    }
  };

  const handleEdit = (musician: Musician) => {
    setFormData({
      name: musician.name,
      instrument: musician.instrument || "",
      bio: musician.bio || "",
      strapLine: musician.strapLine ?? "",
      fullBio: musician.fullBio ?? "",
      youtubeEmbed: musician.youtubeEmbed || "",
      seoTitle: (musician as any).seoTitle || "",
      seoDescription: (musician as any).seoDescription || "",
      imageUrl: musician.imageUrl || "",
      isActive: musician.isActive,
      displayOrder: musician.displayOrder,
    });
    setEditingId(musician.id);
    setIsAdding(true);
    setTimeout(() => {
      const formElement = document.getElementById("musician-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }
    }, 150);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      instrument: "",
      bio: "",
      strapLine: "",
      fullBio: "",
      youtubeEmbed: "",
      seoTitle: "",
      seoDescription: "",
      imageUrl: "",
      isActive: true,
      displayOrder: 0,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-champagne-gold" />
      </div>
    );
  }

  // Show loading spinner immediately if unauthenticated or loading
  if (status === "loading" || (status === "authenticated" && loading && (session?.user as any)?.role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
      }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-champagne-gold animate-spin" />
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  // Return null if not authenticated or not admin (router will handle redirect)
  if (!session || (session?.user as any)?.role !== "admin") {
    return null;
  }

  return (
    <div 
      className="min-h-screen text-white py-12 px-4"
      style={{
        background: 'radial-gradient(circle at center, rgb(31 41 55) 0%, rgb(17 24 39) 50%, rgb(0 0 0) 100%)'
      }}
    >
      <div className="w-full max-w-full px-4 container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">Musicians</h1>
              <p className="text-gray-200">Manage musician profiles and information</p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Musicians List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <AnimatePresence>
            {musicians.map((musician) => (
              <MusicianCard
                key={musician.id}
                musician={musician}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <MusicianForm
            editingId={editingId}
            formData={formData}
            onFormDataChange={setFormData}
            onSave={handleSave}
            onCancel={resetForm}
            isSaving={isSaving}
          />
        )}

        {!isAdding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-champagne-gold text-black hover:bg-gold-light shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Musician
            </Button>
          </motion.div>
        )}

        {musicians.length === 0 && !loading && !isAdding && (
          <div className="text-center py-12">
            <p className="text-gray-400">No musicians found. Add your first musician to get started.</p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
