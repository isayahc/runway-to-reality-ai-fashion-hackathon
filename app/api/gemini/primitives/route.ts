import { NextResponse } from "next/server";
import { mockPrimitives } from "@/lib/clients/mock-data";
import type { PrimitiveGenerationRequest } from "@/lib/types/pipeline";
import { readAssets } from "@/lib/media/storage";
import { generatePrimitives, understand } from "@/lib/clients/gemini";

export async function POST(request: Request) {
  const body = (await request.json()) as PrimitiveGenerationRequest;
  if (!body.mediaAssetId) return NextResponse.json({ error: "mediaAssetId is required" }, { status: 400 });
  const asset = (await readAssets()).find(item => item.id === body.mediaAssetId);
  if (!asset) return NextResponse.json({ error: "Media asset not found" }, { status: 404 });
  try { const analysis = await understand(asset, body.intent); const imageUrl = await generatePrimitives(asset, body.intent, mockPrimitives); return NextResponse.json({ runId: `primitive-run-${Date.now()}`, status: "complete", intent: body.intent, analysis, primitives: mockPrimitives.map(item => ({ ...item, imageUrl: imageUrl ?? item.imageUrl })) }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Gemini generation failed", stage: "gemini" }, { status: 502 }); }
}
