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
  try { const result = await generateCad(asset, body.intent ?? ""); const filename = `${result.id}.scad`; const stepFilename = `${result.id}.step`; const root = path.join(process.cwd(), "public", "uploads"); await mkdir(root, { recursive: true }); const sourcePath = path.join(root, filename); const stepPath = path.join(root, stepFilename); await writeFile(sourcePath, result.scad, "utf8"); const dimensions = result.dimensions; const scriptPath = path.join(root, `${result.id}.py`); const script = `from opencad import Part\nPart(name="Gemini wearable").box(${dimensions.width_mm || 70}, ${dimensions.depth_mm || 28}, ${dimensions.height_mm || 8}, name="Wearable object").export(r"${stepPath.replace(/\\/g, "\\\\")}")\n`; await writeFile(scriptPath, script, "utf8"); let renderError: string | undefined; try { await exec(process.env.PYTHON_EXECUTABLE ?? "python", ["-m", "opencad", "run", scriptPath, "--backend", "occt"], { timeout: 120000, env: { ...process.env, PYTHONPATH: process.env.OPENCAD_PATH ?? "C:\\Users\\PC\\OpenCAD\\packages\\opencad\\src" } }); } catch { renderError = "OpenCAD OCCT renderer unavailable. Configure OPENCAD_PATH and install its OCCT backend."; } return NextResponse.json({ ...result, downloadUrl: `/uploads/${filename}`, stepUrl: renderError ? undefined : `/uploads/${stepFilename}`, meshUrl: renderError ? undefined : `/uploads/${stepFilename}`, renderError }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "CAD generation failed", stage: "gemini-cad" }, { status: 502 }); }
}
