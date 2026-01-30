import { auth } from "@/auth";
import { NextRequest } from "next/server";

/**
 * Require admin role. Uses auth() (same as /api/auth/session) for reliability
 * in production. getToken can fail on 308-redirected requests (trailing slash).
 */
export async function requireAdmin(request: NextRequest) {
  // Dev bypass for development mode
  if (process.env.NODE_ENV === "development") {
    const devBypass = request.headers.get("x-dev-bypass") === "true";
    const isLocalhost = request.headers.get("host")?.includes("localhost") || 
                        request.headers.get("host")?.includes("127.0.0.1") ||
                        request.headers.get("host")?.startsWith("192.168.") ||
                        request.headers.get("host")?.startsWith("10.");
    
    if (devBypass || isLocalhost) {
      return {
        id: "dev-admin",
        email: "dev@localhost",
        name: "Dev Admin",
        role: "admin",
      };
    }
  }

  const session = await auth();

  if (!session?.user || ((session.user as any).role as string) !== "admin") {
    return null;
  }

  return {
    id: (session.user as any).id as string,
    email: session.user.email as string,
    name: session.user.name as string,
    role: "admin" as const,
  };
}
