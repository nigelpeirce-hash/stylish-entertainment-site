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
import { motion } from "@/lib/motion";
import Link from "next/link";

const setupSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SetupFormData = z.infer<typeof setupSchema>;

function AuthSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [tokenValid, setTokenValid] = useState<boolean>(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (!emailParam || !tokenParam) {
      setError("Invalid invite link. Please check your email for the correct link.");
      setIsValidating(false);
      return;
    }

    setEmail(emailParam);
    // Validate token with API
    validateToken(emailParam, tokenParam);
  }, [searchParams]);

  const validateToken = async (email: string, token: string) => {
    try {
      const response = await fetch("/api/auth/validate-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setTokenValid(true);
      } else {
        setError(data.error || "Invalid or expired invite link. Please request a new invite.");
      }
    } catch (error) {
      console.error("Token validation error:", error);
      setError("Failed to validate invite link. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
  });

  const onSubmit = async (data: SetupFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const emailParam = searchParams.get("email");
      const tokenParam = searchParams.get("token");

      if (!emailParam || !tokenParam) {
        setError("Invalid invite link");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/auth/complete-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailParam,
          token: tokenParam,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to complete setup");
        setIsLoading(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login?setup=complete");
        }, 2000);
      }
    } catch (error) {
      console.error("Setup error:", error);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="bg-gray-800 border-champagne-gold/30 max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-white">Validating invite link...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="bg-gray-800 border-champagne-gold/30 max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-green-400 text-lg mb-4">
              Account setup complete! Redirecting to login...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="bg-gray-800 border-champagne-gold/30 max-w-md">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <p className="text-red-400 text-lg mb-2">Invalid Invite Link</p>
              <p className="text-gray-300 text-sm mb-4">{error}</p>
            </div>
            <Link href="/login">
              <Button className="w-full bg-champagne-gold text-black hover:bg-gold-light">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
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
              Complete Your Account Setup
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              Set a password for {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="bg-gray-900 border-gray-700 text-white"
                />
                {errors.password && (
                  <p className="text-sm text-red-400">{errors.password.message}</p>
                )}
                <p className="text-xs text-gray-400">Must be at least 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="bg-gray-900 border-gray-700 text-white"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-champagne-gold text-black hover:bg-gold-light"
                disabled={isLoading}
              >
                {isLoading ? "Setting up account..." : "Complete Setup"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-champagne-gold hover:text-gold-light underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function AuthSetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <AuthSetupContent />
    </Suspense>
  );
}
