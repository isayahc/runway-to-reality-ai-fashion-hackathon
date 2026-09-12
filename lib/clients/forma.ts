import type { FormaGenerationRequest, FormaGenerationResult } from "@/lib/types/pipeline";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

export interface FormaClient { generateWearable(request: FormaGenerationRequest): Promise<FormaGenerationResult>; getRun(runId: string): Promise<FormaGenerationResult>; }

class ConfiguredFormaClient implements FormaClient {
  private mode = process.env.FORMA_MODE ?? "local";
  async generateWearable(request: FormaGenerationRequest): Promise<FormaGenerationResult> {
    const endpoint = this.mode === "hosted" ? process.env.FORMA_HOSTED_URL : process.env.FORMA_LOCAL_URL;
    if (endpoint) { const response = await fetch(`${endpoint}/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) }); if (!response.ok) throw new Error(`Forma ${this.mode} generation failed (${response.status})`); return (await response.json()).result as FormaGenerationResult; }
    const script = process.env.FORMA_CLIENT_PATH ?? "C:\\Users\\PC\\forma-oss\\.agents\\skills\\forma-hardware\\scripts\\forma.py";
    const prompt = `Create a wearable fashion object from these primitive references: ${request.primitives.map(p => `${p.name} (${p.targetBodyRegion}): ${p.description}. Fabrication: ${p.fabricationNotes}`).join("; ")}. Design intent: ${request.intent}. Return a safe prototype plan.`;
    try { const { stdout } = await run(process.env.PYTHON_EXECUTABLE ?? "python", [script, "generate", prompt], { timeout: 600000 }); const generated = JSON.parse(stdout) as { project_id?: string; project?: unknown }; return { id: generated.project_id ?? `forma-${Date.now()}`, status: "complete", warnings: [], metadata: generated.project }; }
    catch (error) { throw new Error(`Local Forma MCP is unavailable. Start Forma and verify FORMA_MCP_URL. ${error instanceof Error ? error.message : "Generation failed"}`); }
  }
  async getRun(runId: string): Promise<FormaGenerationResult> { return { id: runId, status: "complete", previewUrl: "/placeholder-preview.glb", warnings: [] }; }
}

export const formaClient: FormaClient = new ConfiguredFormaClient();
