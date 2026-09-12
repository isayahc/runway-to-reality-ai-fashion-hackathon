import { NextResponse } from "next/server";
import { readAssets } from "@/lib/media/storage";
import { understand } from "@/lib/clients/gemini";

export async function POST(request: Request) {
  const body = await request.json() as { mediaAssetId?: string; intent?: string };
  const asset = (await readAssets()).find(item => item.id === body.mediaAssetId);
  if (!asset) return NextResponse.json({ error: "Media asset not found" }, { status: 404 });
  try { return NextResponse.json({ analysis: await understand(asset, body.intent ?? "") }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Gemini understanding failed", stage: "gemini-understanding" }, { status: 502 }); }
}
