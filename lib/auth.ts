import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
            throw new Error("Please enter email and password");
          }

          console.log("Attempting to authorize user:", credentials.email);

          const user = await prisma.user.findUnique({
            where: { email: (credentials as any).email as string },
          });

          if (!user || !user.password) {
            console.log("User not found or no password:", credentials.email);
            throw new Error("No user found with this email");
          }

          console.log("User found, checking password...");

          const isPasswordValid = await bcrypt.compare(
            (credentials as any).password as string,
            user.password
          );

          if (!isPasswordValid) {
            console.log("Invalid password for user:", credentials.email);
            throw new Error("Invalid password");
          }

          console.log("Password valid, returning user:", user.id);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || "client", // Ensure role is always set
          };
        } catch (error: any) {
          console.error("Authorization error:", error);
          // Re-throw the error so NextAuth can handle it
          throw error;
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
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true, // Required for NextAuth v5
};
