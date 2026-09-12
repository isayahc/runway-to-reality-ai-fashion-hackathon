import { NextResponse } from "next/server";
import type { FormaGenerationRequest, FormaGenerationResult } from "@/lib/types/pipeline";
import { formaClient } from "@/lib/clients/forma";

export async function POST(request: Request) {
  const body = (await request.json()) as FormaGenerationRequest;
  if (!body.primitives?.length || !body.intent) return NextResponse.json({ error: "A primitive and creative intent are required." }, { status: 400 });
  try { return NextResponse.json({ result: await formaClient.generateWearable(body) }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Forma generation failed" }, { status: 502 }); }
}
