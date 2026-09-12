import { NextResponse } from "next/server";
import { readAssets } from "@/lib/media/storage";
import { generateCad } from "@/lib/clients/gemini";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function POST(request: Request) {
  const body = await request.json() as { mediaAssetId?: string; intent?: string };
  const asset = (await readAssets()).find(item => item.id === body.mediaAssetId);
  if (!asset) return NextResponse.json({ error: "Media asset not found", stage: "cad-input" }, { status: 404 });
  try { const result = await generateCad(asset, body.intent ?? ""); const filename = `${result.id}.scad`; const root = path.join(process.cwd(), "public", "uploads"); await mkdir(root, { recursive: true }); await writeFile(path.join(root, filename), result.scad, "utf8"); return NextResponse.json({ ...result, downloadUrl: `/uploads/${filename}` }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "CAD generation failed", stage: "gemini-cad" }, { status: 502 }); }
}
