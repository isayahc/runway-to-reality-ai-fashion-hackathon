import { NextResponse } from "next/server";

export async function POST() { return NextResponse.json({ sessionId: "demo-session", token: "placeholder-token", status: "ready" }); }
