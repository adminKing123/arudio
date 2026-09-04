import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseId } from "@/lib/api/pagination";

export async function GET(_request, { params }) {
  const { id } = await params;
  const songId = parseId(id);

  if (!songId) {
    return NextResponse.json({ error: "Invalid song id." }, { status: 400 });
  }

  const song = await db.song.getWithRelations(songId);

  if (!song) {
    return NextResponse.json({ error: "Song not found." }, { status: 404 });
  }

  return NextResponse.json(song);
}
