import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function requireAdmin(request: NextRequest) {
  // Dev bypass for development mode
  if (process.env.NODE_ENV === "development") {
    // Check if dev bypass is enabled via header (set by client)
    const devBypass = request.headers.get("x-dev-bypass") === "true";
    
    // Also allow localhost automatically in dev mode
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

  const token = await getToken({
    req: request as any,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });

  if (!token || (token.role as string) !== "admin") {
    return null;
  }

  return {
    id: (token.id as string) || (token.sub as string),
    email: token.email as string,
    name: token.name as string,
    role: token.role as string,
  };
}
