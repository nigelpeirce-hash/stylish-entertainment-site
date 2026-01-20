"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, CheckCircle2, XCircle, AlertCircle, Copy } from "lucide-react";

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordWorkaroundContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean>(false);
  const [extractedToken, setExtractedToken] = useState<string>("");
  const [extractedEmail, setExtractedEmail] = useState<string>("");

  useEffect(() => {
    // Try to extract token and email from URL parameters
    // Handle both direct links and wrapped email tracking URLs
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for direct token and email params
    let token = urlParams.get("token");
    let email = urlParams.get("email");

    // If not found, try to extract from the full URL (for wrapped email tracking links)
    if (!token || !email) {
      const fullUrl = window.location.href;
      
      // Try to find token= and email= in the URL
      const tokenMatch = fullUrl.match(/[?&]token=([^&]+)/);
      const emailMatch = fullUrl.match(/[?&]email=([^&]+)/);
      
      if (tokenMatch) {
        token = decodeURIComponent(tokenMatch[1]);
      }
      if (emailMatch) {
        email = decodeURIComponent(emailMatch[1]);
      }
    }

    if (token && email) {
      setExtractedToken(token);
      setExtractedEmail(email);
      // Auto-validate if we found both
      validateToken(email, token);
    }
  }, [searchParams]);

  const validateToken = async (email: string, token: string) => {
    setIsValidating(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth/validate-reset-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setTokenValid(true);
        setError("");
      } else {
        setError(data.error || "Invalid or expired reset link. Please check your email for a fresh link.");
        setTokenValid(false);
      }
    } catch (error) {
      console.error("Token validation error:", error);
      setError("Failed to validate reset link. Please try again.");
      setTokenValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: extractedEmail,
      token: extractedToken,
    },
  });

  // Update form when extracted values change
  useEffect(() => {
    if (extractedEmail) setValue("email", extractedEmail);
    if (extractedToken) setValue("token", extractedToken);
  }, [extractedEmail, extractedToken, setValue]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError("");

    // Validate token first
    await validateToken(data.email, data.token);
    
    if (!tokenValid) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          token: data.token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to reset password");
        setIsLoading(false);
      } else {
        setSuccess(true);
        setIsLoading(false);
        setTimeout(() => {
          router.push("/login?passwordReset=success");
        }, 2000);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleManualValidate = () => {
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) {
      const formData = new FormData(form);
      const email = formData.get("email") as string;
      const token = formData.get("token") as string;
      
      if (email && token) {
        validateToken(email, token);
      } else {
        setError("Please enter both email and token");
      }
    }
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL copied to clipboard! You can paste it here to extract the token.");
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-gray-800 border-champagne-gold/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful</h2>
                <p className="text-gray-300 mb-6">
                  Your password has been reset successfully. Redirecting to login...
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-800 border-champagne-gold/30">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Password Reset Workaround
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              If your email link didn't work, enter your details manually below
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Instructions */}
            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium text-white mb-2">Having trouble with the email link?</p>
                  <p className="mb-2">1. Copy the full URL from your email</p>
                  <p className="mb-2">2. Paste it in your browser's address bar</p>
                  <p className="mb-2">3. The token and email should auto-fill below</p>
                  <p>4. Or manually enter them from your email</p>
                </div>
              </div>
            </div>

            {/* URL Helper */}
            <div className="mb-4 p-3 bg-gray-900/50 rounded border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-gray-400">Current URL</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={copyUrlToClipboard}
                  className="h-6 px-2 text-xs text-champagne-gold hover:text-gold-light"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-500 break-all font-mono">
                {typeof window !== "undefined" ? window.location.href.substring(0, 100) + "..." : ""}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-md">
                  {error}
                </div>
              )}

              {tokenValid && (
                <div className="p-3 text-sm text-green-400 bg-green-900/20 border border-green-800 rounded-md">
                  ✓ Token is valid! You can now set your new password.
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="bg-gray-900 border-gray-700 text-white"
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="token" className="text-white">
                  Reset Token
                </Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Paste token from email link"
                  {...register("token")}
                  className="bg-gray-900 border-gray-700 text-white font-mono text-sm"
                />
                {errors.token && (
                  <p className="text-sm text-red-400">{errors.token.message}</p>
                )}
                <p className="text-xs text-gray-400">
                  The token is the long string after "token=" in your email link
                </p>
              </div>

              {tokenValid && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...register("password")}
                        className="bg-gray-900 border-gray-700 text-white pl-10"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-400">{errors.password.message}</p>
                    )}
                    <p className="text-xs text-gray-400">Must be at least 8 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        {...register("confirmPassword")}
                        className="bg-gray-900 border-gray-700 text-white pl-10"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </>
              )}

              {!tokenValid && (
                <Button
                  type="button"
                  onClick={handleManualValidate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isValidating}
                >
                  {isValidating ? "Validating..." : "Validate Token"}
                </Button>
              )}

              {tokenValid && (
                <Button
                  type="submit"
                  className="w-full bg-champagne-gold text-black hover:bg-gold-light"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              )}
            </form>

            <div className="mt-6 space-y-2">
              <Link href="/forgot-password">
                <Button variant="outline" className="w-full border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10">
                  Request New Reset Link
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="w-full text-gray-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordWorkaroundPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <ResetPasswordWorkaroundContent />
    </Suspense>
  );
}
