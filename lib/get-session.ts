import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";

// Helper function to get session in API routes
// For NextAuth v5, we use the request object to get cookies and handle authOptions internally
export async function getServerSession(req?: NextRequest) {
  try {
    // Get cookies from request if provided, otherwise use next/headers
    let cookieObject: Record<string, string> = {};
    
    if (req) {
      // Extract cookies from request headers
      const cookieHeader = req.headers.get("cookie") || "";
      cookieHeader.split(";").forEach((cookie) => {
        const [name, ...rest] = cookie.trim().split("=");
        if (name) {
          cookieObject[name] = rest.join("=");
        }
      });
    } else {
      // Fallback to cookies() if no request provided (for backwards compatibility)
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      allCookies.forEach((cookie) => {
        cookieObject[cookie.name] = cookie.value;
      });
    }

    // Debug: log cookie names (remove in production)
    if (process.env.NODE_ENV === "development") {
      const cookieNames = Object.keys(cookieObject);
      console.log("Available cookies:", cookieNames);
    }

    const secret = authOptions.secret || process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
    if (!secret) {
      console.error("NEXTAUTH_SECRET or AUTH_SECRET is not set");
      return null;
    }

    // Get the session token using next-auth/jwt
    // NextAuth v5 uses 'authjs.session-token' as the default cookie name
    const token = await getToken({
      req: {
        cookies: cookieObject,
        headers: req?.headers || {},
      } as any,
      secret: secret,
      cookieName: process.env.NODE_ENV === "production" 
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
    });

    if (!token) {
      if (process.env.NODE_ENV === "development") {
        console.log("No token found in cookies");
      }
      return null;
    }

    // Return session in the format expected by the API routes
    return {
      user: {
        id: (token.id as string) || (token.sub as string),
        email: token.email as string,
        name: token.name as string,
        role: (token.role as string) || "client",
      },
      expires: token.exp ? new Date((token.exp as number) * 1000).toISOString() : undefined,
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}
