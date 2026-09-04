import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseId } from "@/lib/api/pagination";

export async function GET(_request, { params }) {
  const { id } = await params;
  const languageId = parseId(id);

  if (!languageId) {
    return NextResponse.json({ error: "Invalid language id." }, { status: 400 });
  }

  const language = await db.language.get(languageId);

  if (!language) {
    return NextResponse.json({ error: "Language not found." }, { status: 404 });
  }

  return NextResponse.json(language.toJSON());
}
