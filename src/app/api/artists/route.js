import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { paginatedResponse, parsePagination } from "@/lib/api/pagination";

export async function GET(request) {
  const { page, limit } = parsePagination(request);
  const result = await db.artist.paginate(page, limit);

  return NextResponse.json(
    paginatedResponse(
      result.items.map((artist) => artist.toJSON()),
      result,
    ),
  );
}
