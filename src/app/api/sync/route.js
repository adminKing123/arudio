import { NextResponse } from "next/server";
import { syncDatabaseFromRemote } from "@/lib/sync";

export async function POST() {
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
