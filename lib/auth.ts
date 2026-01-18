import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Get secret with fallback
const getSecret = () => {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    console.warn("⚠️  NEXTAUTH_SECRET/AUTH_SECRET not set. Using temporary development secret.");
    return "temporary-dev-secret-do-not-use-in-production";
  }
  return secret;
};

export const authOptions: NextAuthConfig = {
  // Removed PrismaAdapter - using JWT sessions, so we don't need database sessions
  // adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          console.log("Attempting to authorize user:", credentials.email);

          // First, check if user exists in database
          const user = await prisma.user.findUnique({
            where: { email: (credentials as any).email as string },
          });

          // Email not found - throw specific error that can be caught
          if (!user) {
            console.log("Email not recognized:", credentials.email);
            throw new Error("EMAIL_NOT_RECOGNIZED");
          }

          // User exists but has no password (edge case)
          if (!user.password) {
            console.log("User found but has no password:", credentials.email);
            throw new Error("EMAIL_NOT_RECOGNIZED");
          }

          console.log("User found, checking password...");

          const isPasswordValid = await bcrypt.compare(
            (credentials as any).password as string,
            user.password
          );

          // Email exists but password is wrong - throw specific error
          if (!isPasswordValid) {
            console.log("Invalid password for user:", credentials.email);
            throw new Error("INVALID_PASSWORD");
          }

          console.log("Password valid, returning user:", user.id);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || "client",
          };
        } catch (error: any) {
          console.error("Authorization error:", error);
          console.error("Error type:", error?.constructor?.name);
          console.error("Error message:", error?.message);
          
          // In NextAuth v5 beta, throwing errors can cause "Configuration" errors
          // Instead, log the error and return null for all cases
          // The email check in the login page will handle "email not recognized"
          if (error.message === "EMAIL_NOT_RECOGNIZED") {
            console.log("Returning null for EMAIL_NOT_RECOGNIZED");
            return null;
          }
          if (error.message === "INVALID_PASSWORD") {
            console.log("Returning null for INVALID_PASSWORD");
            return null;
          }
          
          // For other errors, also return null
          console.log("Returning null for unexpected error");
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "client";
        token.id = user.id;
        console.log("JWT callback - user role:", (user as any).role);
      }
      // Always fetch fresh role from database to ensure it's up to date
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true },
          });
          if (dbUser) {
            console.log("JWT callback - fetched role from DB:", dbUser.role);
            token.role = dbUser.role || "client";
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
      console.log("JWT callback - final token role:", token.role);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || "client";
        console.log("Session callback - role:", token.role);
      }
      return session;
    },
  },
  secret: getSecret(),
  trustHost: true, // Required for NextAuth v5
  debug: process.env.NODE_ENV === "development", // Enable debug logging in development
};
