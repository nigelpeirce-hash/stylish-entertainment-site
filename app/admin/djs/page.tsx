"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { DJCard } from "./DJCard";
import { DJForm } from "./DJForm";
import { Toast } from "@/components/ui/toast";

interface DJ {
  id: string;
  name: string;
  slug: string | null;
  bio: string | null;
  mixcloudUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  imageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
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

export default function DJsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [djs, setDjs] = useState<DJ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    mixcloudUrl: "",
    seoTitle: "",
    seoDescription: "",
    imageUrl: "",
    isActive: true,
    displayOrder: 0,
  });

  // Tightened session check - return loading immediately if unauthenticated
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
      // Only fetch DJs if authenticated as admin
      fetchDJs();
    }
  }, [status, session, router]);

  const fetchDJs = async () => {
    try {
      const response = await fetch("/api/admin/djs");
      if (response.ok) {
        const data = await response.json();
        setDjs(data.djs || []);
      }
    } catch (error) {
      console.error("Error fetching DJs:", error);
      showToast("Failed to load DJs", "error");
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
        mixcloudUrl: formData.mixcloudUrl || null,
      };

      if (editingId) {
        // Update existing
        const response = await fetch(`/api/admin/djs/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          await fetchDJs();
          resetForm();
          showToast("DJ updated successfully", "success");
        } else {
          const error = await response.json();
          showToast(error.error || "Failed to update DJ", "error");
        }
      } else {
        // Create new
        const response = await fetch("/api/admin/djs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          await fetchDJs();
          resetForm();
          showToast("DJ created successfully", "success");
        } else {
          const error = await response.json();
          showToast(error.error || "Failed to create DJ", "error");
        }
      }
    } catch (error) {
      console.error("Error saving DJ:", error);
      showToast("An error occurred while saving", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this DJ?")) return;

    try {
      const response = await fetch(`/api/admin/djs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchDJs();
        showToast("DJ deleted successfully", "success");
      } else {
        showToast("Failed to delete DJ", "error");
      }
    } catch (error) {
      console.error("Error deleting DJ:", error);
      showToast("An error occurred while deleting", "error");
    }
  };

  const handleEdit = (dj: DJ) => {
    setFormData({
      name: dj.name,
      bio: dj.bio || "",
      mixcloudUrl: dj.mixcloudUrl || "",
      seoTitle: dj.seoTitle || "",
      seoDescription: dj.seoDescription || "",
      imageUrl: dj.imageUrl || "",
      isActive: dj.isActive,
      displayOrder: dj.displayOrder,
    });
    setEditingId(dj.id);
    setIsAdding(true);
    setTimeout(() => {
      const formElement = document.getElementById("dj-form");
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
      bio: "",
      mixcloudUrl: "",
      seoTitle: "",
      seoDescription: "",
      imageUrl: "",
      isActive: true,
      displayOrder: 0,
    });
    setIsAdding(false);
    setEditingId(null);
  };

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
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">DJs</h1>
              <p className="text-gray-200">Manage DJ profiles and information</p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="border-champagne-gold/50 text-champagne-gold hover:bg-champagne-gold/10">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* DJs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {djs.map((dj) => (
            <DJCard key={dj.id} dj={dj} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <DJForm
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
              Create New DJ
            </Button>
          </motion.div>
        )}
      </div>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
