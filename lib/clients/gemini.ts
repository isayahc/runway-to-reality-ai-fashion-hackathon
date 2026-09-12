import type { MediaAsset, WearablePrimitive } from "@/lib/types/pipeline";
import { readFile } from "node:fs/promises";
import path from "node:path";

const endpoint = "https://generativelanguage.googleapis.com/v1beta/models";
const key = () => process.env.GEMINI_API_KEY;

async function sourcePart(asset: MediaAsset) {
  const bytes = await readFile(path.join(process.cwd(), "public", asset.url.replace(/^\//, "")));
  return { inline_data: { mime_type: asset.mimeType, data: bytes.toString("base64") } };
}

async function request(model: string, contents: unknown[], responseModalities?: string[]) {
  if (!key()) throw new Error("GEMINI_API_KEY is not configured on the server.");
  const response = await fetch(`${endpoint}/${model}:generateContent?key=${encodeURIComponent(key()!)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents, ...(responseModalities ? { generationConfig: { responseModalities } } : {}) }) });
  if (!response.ok) { const detail = await response.text(); throw new Error(`Gemini request failed (${response.status}): ${detail.slice(0, 500)}`); }
  return response.json() as Promise<{ candidates?: Array<{ content?: { parts?: Array<{ text?: string; inline_data?: { mime_type: string; data: string } }> } }> }>;
}

export async function understand(asset: MediaAsset, intent: string) {
  const result = await request(process.env.GEMINI_MODEL ?? "gemini-2.0-flash", [{ parts: [await sourcePart(asset), { text: `Describe this fashion reference for wearable object design. Return concise JSON with visualSummary, materials, colors, silhouette, and suggestedBodyRegions. Creative intent: ${intent}` }] }]);
  return result.candidates?.[0]?.content?.parts?.find(part => part.text)?.text ?? "No visual description returned.";
}

export async function generatePrimitives(asset: MediaAsset, intent: string, primitives: WearablePrimitive[]) {
  const result = await request(process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.0-flash-exp", [{ parts: [await sourcePart(asset), { text: `Generate a clean studio concept image of a wearable fashion primitive based on this reference. Focus on ${primitives[0]?.name ?? "a wearable module"}. Intent: ${intent}.` }] }], ["TEXT", "IMAGE"]);
  const image = result.candidates?.[0]?.content?.parts?.find(part => part.inline_data)?.inline_data;
  return image ? `data:${image.mime_type};base64,${image.data}` : undefined;
}

export interface CadGenerationResult { id: string; scad: string; dimensions: Record<string, number>; material: string; fabricationNotes: string; }

export async function generateCad(asset: MediaAsset, intent: string): Promise<CadGenerationResult> {
  const result = await request(process.env.GEMINI_CAD_MODEL ?? process.env.GEMINI_MODEL ?? "gemini-2.0-flash", [{ parts: [await sourcePart(asset), { text: `Analyze this wearable reference and return JSON only with this shape: {"scad":"...","dimensions":{"width_mm":0,"height_mm":0,"depth_mm":0},"material":"...","fabricationNotes":"..."}. Generate simple safe OpenSCAD for a wearable enclosure or fashion module. Use only primitive geometry, module, union, difference, translate, rotate, cube, cylinder, sphere, and color. No import, include, surface, file access, or arbitrary code. Intent: ${intent}` }] }]);
  const text = result.candidates?.[0]?.content?.parts?.find(part => part.text)?.text?.replace(/^```json\s*|\s*```$/g, "").trim();
  if (!text) throw new Error("Gemini returned no CAD definition.");
  const parsed = JSON.parse(text) as Omit<CadGenerationResult, "id">;
  if (!parsed.scad || parsed.scad.length > 20000 || /\b(import|include|surface|system)\s*\(/i.test(parsed.scad)) throw new Error("Gemini returned invalid or unsafe OpenSCAD output.");
  return { ...parsed, id: `cad-${Date.now()}` };
}
