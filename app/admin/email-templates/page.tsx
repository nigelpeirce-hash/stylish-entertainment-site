"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Mail,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  FileText,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText: string | null;
  category: string | null;
  isActive: boolean;
  createdAt: string;
  createdBy: { id: string; name: string; email: string } | null;
}

export default function EmailTemplates() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    bodyHtml: "",
    bodyText: "",
    category: "",
    isActive: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/client/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchTemplates();
    }
  }, [status, session]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/email-templates");
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        // Update existing
        const response = await fetch(`/api/admin/email-templates/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchTemplates();
          setEditingId(null);
          resetForm();
        } else {
          alert("Failed to update template");
        }
      } else {
        // Create new
        const response = await fetch("/api/admin/email-templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchTemplates();
          setIsAdding(false);
          resetForm();
        } else {
          const error = await response.json();
          alert(error.error || "Failed to create template");
        }
      }
    } catch (error) {
      console.error("Error saving template:", error);
      alert("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const response = await fetch(`/api/admin/email-templates/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTemplates();
      } else {
        alert("Failed to delete template");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("An error occurred");
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setFormData({
      name: template.name,
      subject: template.subject,
      bodyHtml: template.bodyHtml,
      bodyText: template.bodyText || "",
      category: template.category || "",
      isActive: template.isActive,
    });
    setEditingId(template.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      bodyHtml: "",
      bodyText: "",
      category: "",
      isActive: true,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session || (session?.user as any)?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Email Templates</h1>
              <p className="text-gray-400">Create and manage email templates for quick replies</p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="border-champagne-gold text-champagne-gold">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <Card className="bg-gray-800 border-champagne-gold/30 mb-6">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-champagne-gold">Available Variables</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <code className="bg-gray-900 px-2 py-1 rounded text-champagne-gold">{"{{djFee}}"}</code>
                <code className="bg-gray-900 px-2 py-1 rounded text-champagne-gold">{"{{eventDate}}"}</code>
                <code className="bg-gray-900 px-2 py-1 rounded text-champagne-gold">{"{{eventTimings}}"}</code>
                <code className="bg-gray-900 px-2 py-1 rounded text-champagne-gold">{"{{djName}}"}</code>
                <code className="bg-gray-900 px-2 py-1 rounded text-champagne-gold">{"{{venueName}}"}</code>
                <code className="bg-gray-900 px-2 py-1 rounded text-champagne-gold">{"{{clientName}}"}</code>
                <code className="bg-gray-900 px-2 py-1 rounded text-champagne-gold">{"{{eventType}}"}</code>
                <code className="bg-gray-900 px-2 py-1 rounded text-champagne-gold">{"{{numberOfGuests}}"}</code>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Use these variables in your templates - they'll be replaced with actual values when sending
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Existing Templates */}
        <div className="space-y-4 mb-8">
          {templates.map((template) => (
            <Card key={template.id} className="bg-gray-800 border-champagne-gold/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-champagne-gold" />
                      <h3 className="text-xl font-semibold text-white">{template.name}</h3>
                      {template.category && (
                        <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-500/30">
                          {template.category}
                        </span>
                      )}
                      {template.isActive ? (
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded border border-green-500/30">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-900/30 text-gray-400 text-xs rounded border border-gray-500/30">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      <strong>Subject:</strong> {template.subject}
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>Created: {new Date(template.createdAt).toLocaleDateString()}</p>
                      {template.createdBy && (
                        <p>By: {template.createdBy.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(template)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(template.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gray-800 border-champagne-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{editingId ? "Edit Template" : "Create New Template"}</span>
                  <Button
                    onClick={resetForm}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Template Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., DJ Inquiry Response"
                      className="bg-gray-900 text-white border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category (optional)</Label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., inquiry, confirmation"
                      className="bg-gray-900 text-white border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email Subject</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Re: Your inquiry for {{eventDate}}"
                    className="bg-gray-900 text-white border-gray-700"
                  />
                  <p className="text-xs text-gray-400">You can use variables like {"{{eventDate}}"}</p>
                </div>

                <div className="space-y-2">
                  <Label>Email Body (HTML)</Label>
                  <Textarea
                    value={formData.bodyHtml}
                    onChange={(e) => setFormData({ ...formData, bodyHtml: e.target.value })}
                    rows={15}
                    placeholder="Enter your email template HTML here. Use variables like {{djFee}}, {{eventDate}}, etc."
                    className="bg-gray-900 text-white border-gray-700 font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email Body (Plain Text - optional)</Label>
                  <Textarea
                    value={formData.bodyText}
                    onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
                    rows={8}
                    placeholder="Plain text version (auto-generated from HTML if not provided)"
                    className="bg-gray-900 text-white border-gray-700"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    className="bg-champagne-gold text-black hover:bg-gold-light"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? "Update Template" : "Create Template"}
                  </Button>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!isAdding && (
          <div className="flex gap-3">
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-champagne-gold text-black hover:bg-gold-light"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Template
            </Button>
            <Link href="/admin/email-templates/create-default">
              <Button
                variant="outline"
                className="border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Default DJ Inquiry Template
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
