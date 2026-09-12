import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { MediaAsset } from "@/lib/types/pipeline";

const uploadRoot = path.join(process.cwd(), "public", "uploads");
const indexPath = path.join(uploadRoot, "media-assets.json");

export async function readAssets(): Promise<MediaAsset[]> {
  try { return JSON.parse(await readFile(indexPath, "utf8")) as MediaAsset[]; } catch { return []; }
}

export async function saveAsset(asset: MediaAsset, bytes: Buffer) {
  await mkdir(uploadRoot, { recursive: true });
  await writeFile(path.join(uploadRoot, `${asset.id}-${asset.name}`), bytes);
  await writeFile(indexPath, JSON.stringify([asset, ...(await readAssets())], null, 2));
}

export async function saveThumbnail(id: string, bytes: Buffer) {
  await mkdir(uploadRoot, { recursive: true });
  await writeFile(path.join(uploadRoot, `${id}-thumbnail.svg`), bytes);
}
