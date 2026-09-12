import { NextResponse } from "next/server";
import { readAssets } from "@/lib/media/storage";
import { generateCad } from "@/lib/clients/gemini";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);

export async function POST(request: Request) {
  const body = await request.json() as { mediaAssetId?: string; intent?: string };
  const asset = (await readAssets()).find(item => item.id === body.mediaAssetId);
  if (!asset) return NextResponse.json({ error: "Media asset not found", stage: "cad-input" }, { status: 404 });
  try { const result = await generateCad(asset, body.intent ?? ""); const filename = `${result.id}.scad`; const meshFilename = `${result.id}.stl`; const root = path.join(process.cwd(), "public", "uploads"); await mkdir(root, { recursive: true }); const sourcePath = path.join(root, filename); const meshPath = path.join(root, meshFilename); await writeFile(sourcePath, result.scad, "utf8"); let renderError: string | undefined; try { await exec(process.env.OPENSCAD_EXECUTABLE ?? "openscad", ["-o", meshPath, sourcePath], { timeout: 120000 }); } catch (error) { renderError = error instanceof Error ? "OpenSCAD renderer unavailable. Install OpenSCAD or set OPENSCAD_EXECUTABLE." : "OpenSCAD render failed."; } return NextResponse.json({ ...result, downloadUrl: `/uploads/${filename}`, meshUrl: renderError ? undefined : `/uploads/${meshFilename}`, renderError }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "CAD generation failed", stage: "gemini-cad" }, { status: 502 }); }
}
