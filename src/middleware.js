import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/session";

const PUBLIC = ["/admin/login", "/admin/signup", "/api/admin/login", "/api/admin/signup"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (PUBLIC.includes(pathname)) return NextResponse.next();

  let session = null;
  try {
    session = await verifyToken(request.cookies.get(SESSION_COOKIE)?.value);
  } catch {
    session = null; // AUTH_SECRET missing: treat as signed out
  }
  if (session) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, message: "Please sign in." }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
