import type { FormaGenerationRequest, FormaGenerationResult } from "@/lib/types/pipeline";

export interface FormaClient { generateWearable(request: FormaGenerationRequest): Promise<FormaGenerationResult>; getRun(runId: string): Promise<FormaGenerationResult>; }

class ConfiguredFormaClient implements FormaClient {
  private mode = process.env.FORMA_MODE ?? "local";
  async generateWearable(request: FormaGenerationRequest) {
    const endpoint = this.mode === "hosted" ? process.env.FORMA_HOSTED_URL : process.env.FORMA_LOCAL_URL;
    if (endpoint) { const response = await fetch(`${endpoint}/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) }); if (!response.ok) throw new Error(`Forma ${this.mode} generation failed (${response.status})`); return (await response.json()).result as FormaGenerationResult; }
    return { id: `forma-${Date.now()}`, status: "complete", previewUrl: "/placeholder-preview.glb", warnings: ["Demo mode: configure FORMA_MODE and a Forma URL for generation."] };
  }
  async getRun(runId: string) { return { id: runId, status: "complete", previewUrl: "/placeholder-preview.glb", warnings: [] }; }
}

export const formaClient: FormaClient = new ConfiguredFormaClient();
