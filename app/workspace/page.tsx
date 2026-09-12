"use client";

import { useRef, useState } from "react";
import type { MediaAsset } from "@/lib/types/pipeline";
import { CadViewport } from "@/components/CadViewport";

export default function Workspace() {
  const [asset, setAsset] = useState<MediaAsset | null>(null);
  const [intent, setIntent] = useState("");
  const [cadUrl, setCadUrl] = useState<string | null>(null);
  const [meshUrl, setMeshUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("READY");
  const input = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setStatus("UPLOADING...");
    const form = new FormData(); form.append("file", file);
    const response = await fetch("/api/media", { method: "POST", body: form });
    if (response.ok) { const result = await response.json(); setAsset(result.asset); setMeshUrl(result.asset.meshUrl ?? (result.asset.kind === "cad" ? result.asset.url : null)); setStatus(result.asset.kind === "cad" ? "STEP READY" : "READY"); } else setStatus("UPLOAD FAILED");
  }

  async function generate() {
    if (!asset || !intent) return;
    setStatus("GENERATING..."); setCadUrl(null); setMeshUrl(null);
    const response = await fetch("/api/gemini/cad", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mediaAssetId: asset.id, intent }) });
    if (response.ok) { const result = await response.json(); setCadUrl(result.downloadUrl); setMeshUrl(result.meshUrl ?? null); setStatus(result.meshUrl ? "RENDERED" : "CAD READY"); } else setStatus("GENERATION FAILED");
  }

  return <main className="simple-shell"><header className="topbar"><div className="brand"><span className="mark">✦</span><span>RUNWAY<br /><b>TO REALITY</b></span></div><span className="status"><i /> GEMINI CAD / {status}</span></header><section className="simple-hero"><p className="eyebrow">IMAGE TO CAD</p><h1>Make it <em>wearable.</em></h1><p>Upload a wearable reference, describe what you want, and get a rendered CAD model.</p></section><section className="simple-grid"><article className="simple-card"><label>01 / SOURCE</label><input ref={input} hidden type="file" accept="image/png,image/jpeg,image/webp,video/mp4,.step,.stp" onChange={e => e.target.files?.[0] && upload(e.target.files[0])} /><button className="source-drop" onClick={() => input.current?.click()}><span className="upload-icon">↥</span><b>{asset ? asset.name : "Choose an image, video, or STEP file"}</b><small>PNG, JPG, WebP, MP4, STEP</small></button>{asset && asset.kind !== "cad" && <img className="source-preview" src={asset.url} alt={asset.name} />}</article><article className="simple-card"><label>02 / CREATIVE INTENT</label><textarea value={intent} onChange={e => setIntent(e.target.value)} placeholder="Describe the wearable object you want to generate..." /><button className="generate-button" disabled={!asset || !intent || status === "GENERATING..."} onClick={generate}>{status === "GENERATING..." ? "GENERATING..." : "GENERATE CAD  →"}</button></article><article className="simple-card output-card"><label>03 / STEP VIEWPORT</label>{meshUrl ? <CadViewport url={meshUrl} /> : <div className="empty-output">{status === "GENERATING..." ? <><span className="spinner" /><small>GENERATING CAD...</small></> : <><span>◈</span><small>{status === "GENERATION FAILED" ? "CHECK GEMINI AND OPENSCAD CONFIGURATION" : "YOUR STEP RENDER WILL APPEAR HERE"}</small></>}</div>}{/* SCAD source is intentionally hidden for the demo. */}{meshUrl && <div className="downloads"><a href={meshUrl} download>DOWNLOAD STEP VIEW MESH</a></div>}</article></section></main>;
}
