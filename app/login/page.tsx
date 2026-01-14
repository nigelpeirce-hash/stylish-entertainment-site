"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting to sign in:", data.email);
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log("Sign in result:", result);

      if (result?.error) {
        console.error("Sign in error:", result.error);
        // Provide user-friendly error messages
        let errorMessage = result.error;
        if (result.error === "Configuration") {
          errorMessage = "Authentication is not properly configured. Please contact support.";
        } else if (result.error === "CredentialsSignin") {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (result.error.includes("No user found")) {
          errorMessage = "No account found with this email address.";
        } else if (result.error.includes("Invalid password")) {
          errorMessage = "Invalid password. Please try again.";
        }
        setError(errorMessage);
        setIsLoading(false);
      } else if (result?.ok) {
        console.log("Sign in successful, checking role...");
        // Wait a moment for session to be set, then check role
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Get session to check role
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        const userRole = sessionData?.user?.role || (sessionData?.user as any)?.role;
        console.log("User role from session:", userRole);
        console.log("Full session data:", JSON.stringify(sessionData, null, 2));
        
        // Redirect based on role
        if (userRole === "admin") {
          console.log("Redirecting to admin dashboard");
          router.push("/admin");
        } else {
          console.log("Redirecting to client dashboard");
          router.push("/client/dashboard");
        }
        router.refresh();
      } else {
        console.error("Unexpected sign in result:", result);
        setError("An unexpected error occurred. Please try again.");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Sign in exception:", error);
      setError(error?.message || "An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

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
              Client Login
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              Sign in to access your account
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
                <Label htmlFor="email" className="text-white">
                  Email
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
              </div>

              <Button
                type="submit"
                className="w-full bg-champagne-gold text-black hover:bg-gold-light"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-champagne-gold hover:text-gold-light underline"
                >
                  Register here
                </Link>
              </p>
              <Link
                href="/forgot-password"
                className="text-sm text-champagne-gold hover:text-gold-light underline block"
              >
                Forgot password?
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
