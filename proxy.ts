import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET ?? "dev-only-insecure-secret-change-me";
const encodedKey = new TextEncoder().encode(secretKey);

async function hasValidSession(cookie: string | undefined) {
  if (!cookie) return false;
  try {
    await jwtVerify(cookie, encodedKey, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin") && path !== "/admin/login";
  const isLoginRoute = path === "/admin/login";

  const cookie = request.cookies.get("session")?.value;
  const authenticated = await hasValidSession(cookie);

  if (isAdminRoute && !authenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginRoute && authenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
