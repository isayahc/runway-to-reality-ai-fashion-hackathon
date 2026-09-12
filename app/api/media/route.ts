import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import type { MediaAsset } from "@/lib/types/pipeline";
import { readAssets, saveAsset, saveThumbnail } from "@/lib/media/storage";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const exec = promisify(execFile);

const allowed = new Set(["image/png", "image/jpeg", "image/webp", "video/mp4", "model/step", "application/step", "application/iges"]);

export async function GET() { return NextResponse.json({ assets: await readAssets() }); }

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || (!allowed.has(file.type) && !/\.(step|stp|iges|igs)$/i.test(file.name))) return NextResponse.json({ error: "Upload a PNG, JPG, WebP, MP4, or STEP file." }, { status: 400 });
  if (file.size > 50 * 1024 * 1024) return NextResponse.json({ error: "File must be 50MB or smaller." }, { status: 413 });
  const id = randomUUID();
  const name = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const kind = file.type.startsWith("video/") ? "video" : /\.(step|stp|iges|igs)$/i.test(file.name) || file.type.includes("step") || file.type.includes("iges") ? "cad" : "image";
  const asset: MediaAsset = { id, kind, name, url: `/uploads/${id}-${name}`, thumbnailUrl: kind === "video" ? `/uploads/${id}-thumbnail.svg` : undefined, mimeType: file.type, sizeBytes: file.size, createdAt: new Date().toISOString() };
  if (kind === "cad") { try { await exec(process.env.OPENSCAD_EXECUTABLE ?? "openscad", ["-o", `${process.cwd()}\\public\\uploads\\${id}.stl`, `${process.cwd()}\\public${asset.url}`], { timeout: 120000 }); asset.meshUrl = `/uploads/${id}.stl`; } catch { /* Keep the STEP upload usable as a source when no renderer is installed. */ } }
  await saveAsset(asset, Buffer.from(await file.arrayBuffer()));
  if (kind === "video") await saveThumbnail(id, Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="#20202b"/><text x="50%" y="50%" fill="#ff573f" text-anchor="middle" font-family="monospace" font-size="18">VIDEO FRAME / ${name}</text></svg>`));
  return NextResponse.json({ asset }, { status: 201 });
}
