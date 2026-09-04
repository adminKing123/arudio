import { NextResponse } from "next/server";

export function middleware(request) {
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

export const config = {
  matcher: "/api/sync",
};
