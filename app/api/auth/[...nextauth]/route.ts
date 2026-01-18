import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Verify secret is accessible at runtime (critical for NextAuth v5)
const runtimeSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
const configSecret = authOptions.secret;

if (process.env.NODE_ENV === "development") {
  if (!runtimeSecret) {
    console.warn("⚠️  NEXTAUTH_SECRET/AUTH_SECRET not found in process.env at runtime!");
    console.warn("   authOptions.secret:", configSecret ? "Has fallback" : "Missing");
  } else {
    console.log("✓ NEXTAUTH_SECRET found in environment");
  }
  
  // Verify secret matches between config and runtime
  if (runtimeSecret && configSecret && runtimeSecret !== configSecret) {
    console.warn("⚠️  Warning: runtime secret differs from config secret!");
  }
}

// Ensure authOptions has a valid secret before initialization
if (!configSecret) {
  const errorMsg = "NextAuth secret is missing! authOptions.secret is undefined.";
  console.error("❌", errorMsg);
  if (process.env.NODE_ENV === "production") {
    throw new Error(errorMsg);
  }
}

// Initialize NextAuth handlers
// NextAuth v5 beta pattern: NextAuth() returns { handlers: { GET, POST } }
const { handlers } = NextAuth(authOptions);

// Log initialization status (handlers are always objects, just verify they exist)
if (handlers && typeof handlers.GET === 'function' && typeof handlers.POST === 'function') {
  if (process.env.NODE_ENV === "development") {
    console.log("✓ NextAuth handlers initialized successfully");
    const secretStr = typeof configSecret === 'string' ? configSecret : String(configSecret || '');
    console.log("   Config secret:", secretStr ? `Set (${secretStr.substring(0, 10)}...)` : "✗ Missing");
  }
} else {
  console.error("❌ NextAuth handlers not properly initialized!");
}

export const { GET, POST } = handlers;
