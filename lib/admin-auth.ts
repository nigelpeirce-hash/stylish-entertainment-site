import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function requireAdmin(request: NextRequest) {
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
