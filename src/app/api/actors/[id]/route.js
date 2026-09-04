import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseId } from "@/lib/api/pagination";

export async function GET(_request, { params }) {
  const { id } = await params;
  const actorId = parseId(id);

  if (!actorId) {
    return NextResponse.json({ error: "Invalid actor id." }, { status: 400 });
  }

  const actor = await db.actor.get(actorId);

  if (!actor) {
    return NextResponse.json({ error: "Actor not found." }, { status: 404 });
  }

  return NextResponse.json(actor.toJSON());
}
