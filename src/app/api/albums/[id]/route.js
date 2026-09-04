import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseId } from "@/lib/api/pagination";

export async function GET(_request, { params }) {
  const { id } = await params;
  const albumId = parseId(id);

  if (!albumId) {
    return NextResponse.json({ error: "Invalid album id." }, { status: 400 });
  }

  const album = await db.album.getWithRelations(albumId);

  if (!album) {
    return NextResponse.json({ error: "Album not found." }, { status: 404 });
  }

  return NextResponse.json(album);
}
