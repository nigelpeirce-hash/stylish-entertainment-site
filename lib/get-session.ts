import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

// Helper function to get session in API routes
// For NextAuth v5 beta, we read the session token from cookies
export async function getServerSession() {
  try {
    const cookieStore = await cookies();
    
    // Get all cookies and create a cookies object
    const allCookies = cookieStore.getAll();
    const cookieObject: Record<string, string> = {};
    allCookies.forEach((cookie) => {
      cookieObject[cookie.name] = cookie.value;
    });

    // Debug: log cookie names (remove in production)
    if (process.env.NODE_ENV === "development") {
      const cookieNames = allCookies.map((c) => c.name);
      console.log("Available cookies:", cookieNames);
    }

    const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
    if (!secret) {
      console.error("NEXTAUTH_SECRET or AUTH_SECRET is not set");
      return null;
    }

    // Get the session token using next-auth/jwt
    // NextAuth v5 uses 'authjs.session-token' as the default cookie name
    const token = await getToken({
      req: {
        cookies: cookieObject,
        headers: {},
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
