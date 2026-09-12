import { NextResponse } from "next/server";
import { demoCadAssets } from "@/lib/demo/catalog";

export function GET() { return NextResponse.json({ asset: demoCadAssets[0], status: "complete" }); }
