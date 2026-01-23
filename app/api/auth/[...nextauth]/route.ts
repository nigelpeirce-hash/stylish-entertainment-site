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

// Wrap handlers to ensure JSON responses even on errors
const handleRequest = async (req: Request, handler: (req: Request) => Promise<Response>) => {
  try {
    return await handler(req);
  } catch (error: any) {
    // If handler throws, return JSON error instead of HTML
    console.error("NextAuth handler error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Authentication error",
        message: error?.message || "An error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const GET = async (req: Request) => {
  try {
    return await handlers.GET(req);
  } catch (error: any) {
    console.error("NextAuth GET error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Session error",
        message: error?.message || "Unable to fetch session",
      }),
      {
        status: 200, // Return 200 with error so client can handle it
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    return await handlers.POST(req);
  } catch (error: any) {
    console.error("NextAuth POST error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Authentication error",
        message: error?.message || "An error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
