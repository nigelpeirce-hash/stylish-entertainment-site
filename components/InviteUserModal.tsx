"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/radix-select";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InviteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInviteSuccess?: () => void;
}

export function InviteUserModal({
  open,
  onOpenChange,
  onInviteSuccess,
}: InviteUserModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user" | "client">("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/users/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to invite user");
      }

      setSuccess(true);
      setInviteUrl(data.inviteUrl || null);
      
      // Reset form
      setEmail("");
      setRole("user");

      // Call success callback after a delay
      setTimeout(() => {
        onInviteSuccess?.();
        onOpenChange(false);
        setSuccess(false);
        setInviteUrl(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to invite user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      setEmail("");
      setRole("user");
      setError(null);
      setSuccess(false);
      setInviteUrl(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-champagne-gold" />
            Invite New User
          </DialogTitle>
          <DialogDescription>
            Send an invitation email to a new user. They will receive a link to
            set up their account.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence>
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-6 text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Invitation Sent!
              </h3>
              <p className="text-gray-300 mb-4">
                An invitation email has been sent to <strong>{email}</strong>
              </p>
              {inviteUrl && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 mt-4">
                  <p className="text-xs text-gray-400 mb-2">Invite Link:</p>
                  <p className="text-xs text-champagne-gold break-all font-mono">
                    {inviteUrl}
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 text-white border-gray-600"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={role}
                  onValueChange={(value) =>
                    setRole(value as "admin" | "user" | "client")
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="bg-gray-800 text-white border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400">
                  {role === "admin" && "Full access to admin panel and user management"}
                  {role === "user" && "Access to admin panel with limited permissions"}
                  {role === "client" && "Client access only"}
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="bg-champagne-gold text-black hover:bg-gold-light"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
