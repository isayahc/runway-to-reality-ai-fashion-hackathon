import { NextResponse } from "next/server";
import { mockPrimitives } from "@/lib/clients/mock-data";
import type { PrimitiveGenerationRequest } from "@/lib/types/pipeline";

export async function POST(request: Request) {
  const body = (await request.json()) as PrimitiveGenerationRequest;
  return NextResponse.json({ runId: "primitive-run-demo", status: "complete", intent: body.intent, primitives: mockPrimitives });
}
