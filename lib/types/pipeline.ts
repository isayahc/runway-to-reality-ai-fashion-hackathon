export type MediaKind = "image" | "video";
export type PipelineStatus = "idle" | "queued" | "processing" | "complete" | "failed";

export interface MediaAsset { id: string; kind: MediaKind; name: string; url: string; thumbnailUrl?: string; mimeType: string; sizeBytes: number; width?: number; height?: number; durationMs?: number; createdAt: string; }
export interface CapturedFrame { id: string; assetId: string; timestampMs: number; url: string; width: number; height: number; }
export interface WearablePrimitive { id: string; name: string; category: "garment" | "accessory" | "material"; description: string; confidence: number; sourceFrameId?: string; attributes: Record<string, string>; }
export interface PrimitiveGenerationRequest { mediaAssetId: string; frameIds?: string[]; intent: string; model?: string; }
export interface FormaGenerationRequest { primitives: WearablePrimitive[]; intent: string; target: "mesh" | "preview" | "both"; }
export interface FormaGenerationResult { id: string; status: PipelineStatus; previewUrl?: string; meshUrl?: string; warnings: string[]; }
export interface PipelineRun { id: string; status: PipelineStatus; asset?: MediaAsset; frames: CapturedFrame[]; primitives: WearablePrimitive[]; forma?: FormaGenerationResult; startedAt: string; updatedAt: string; }
