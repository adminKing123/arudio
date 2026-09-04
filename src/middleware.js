import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/auth/session";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/sync")) {
    const syncSecret = process.env.SYNC_SECRET;

    if (!syncSecret) {
      return NextResponse.next();
    }

    const headerSecret = request.headers.get("x-sync-secret");

    if (headerSecret !== syncSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
  }

  if (pathname === "/" || pathname.startsWith("/profile")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySessionToken(token);

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/sync", "/", "/profile"],
};
