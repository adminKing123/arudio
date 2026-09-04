import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseId } from "@/lib/api/pagination";

export async function GET(_request, { params }) {
  const { id } = await params;
  const artistId = parseId(id);

  if (!artistId) {
    return NextResponse.json({ error: "Invalid artist id." }, { status: 400 });
  }

  const artist = await db.artist.get(artistId);

  if (!artist) {
    return NextResponse.json({ error: "Artist not found." }, { status: 404 });
  }

  return NextResponse.json(artist.toJSON());
}
