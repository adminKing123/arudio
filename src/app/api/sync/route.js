import { NextResponse } from "next/server";
import { syncDatabaseFromRemote } from "@/lib/sync";

function isAuthorized(request) {
  const syncSecret = process.env.SYNC_SECRET;

  if (!syncSecret) {
    return true;
  }

  const headerSecret = request.headers.get("x-sync-secret");
  const querySecret = new URL(request.url).searchParams.get("secret");

  return headerSecret === syncSecret || querySecret === syncSecret;
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncDatabaseFromRemote();
    return NextResponse.json({
      ok: true,
      message: "Database replaced with fresh remote data.",
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown sync error.";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
