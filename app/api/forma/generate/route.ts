import { NextResponse } from "next/server";
import type { FormaGenerationRequest, FormaGenerationResult } from "@/lib/types/pipeline";

export async function POST(request: Request) {
  const body = (await request.json()) as FormaGenerationRequest;
  const result: FormaGenerationResult = { id: "forma-run-demo", status: "complete", previewUrl: "/placeholder-preview.glb", warnings: body.primitives.length ? [] : ["No primitives supplied"] };
  return NextResponse.json({ result });
}
