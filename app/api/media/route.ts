import { NextResponse } from "next/server";
import type { MediaAsset } from "@/lib/types/pipeline";

export async function POST() {
  const asset: MediaAsset = { id: "asset-demo", kind: "image", name: "runway-reference.jpg", url: "/placeholder-reference.jpg", mimeType: "image/jpeg", createdAt: new Date().toISOString() };
  return NextResponse.json({ asset }, { status: 201 });
}
