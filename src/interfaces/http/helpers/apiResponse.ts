/**
 * apiResponse — thin helpers for building consistent Next.js API responses.
 *
 * Layer: interfaces
 */

import { NextResponse } from "next/server";

import { DomainError } from "@/domain/errors/DomainError";
import { NoteNotFoundError } from "@/domain/errors/NoteNotFoundError";

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

export function created<T>(data: T): NextResponse {
  return NextResponse.json({ data }, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

/**
 * Serialise `data` as a pretty-printed JSON file that the browser
 * downloads as an attachment with the given filename.
 */
export function jsonDownload(data: unknown, filename: string): NextResponse {
  return new NextResponse(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof NoteNotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (error instanceof DomainError) {
    return NextResponse.json({ error: error.message }, { status: 422 });
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  console.error("[API] Unhandled error:", error);
  return NextResponse.json({ error: "Internal server error." }, { status: 500 });
}
