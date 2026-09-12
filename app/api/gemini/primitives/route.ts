import { NextResponse } from "next/server";
import { mockPrimitives } from "@/lib/clients/mock-data";
import type { PrimitiveGenerationRequest } from "@/lib/types/pipeline";

export async function POST(request: Request) {
  const body = (await request.json()) as PrimitiveGenerationRequest;
  if (!body.mediaAssetId) return NextResponse.json({ error: "mediaAssetId is required" }, { status: 400 });
  return NextResponse.json({ runId: `primitive-run-${Date.now()}`, status: "complete", intent: body.intent, model: body.model ?? "gemini-image-generation", primitives: mockPrimitives });
}
