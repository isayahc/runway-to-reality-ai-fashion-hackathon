"use client";

import { useRef, useState } from "react";
import type { MediaAsset } from "@/lib/types/pipeline";
import { mockPrimitives } from "@/lib/clients/mock-data";

export default function Workspace() {
  const [intent, setIntent] = useState("");
  const [running, setRunning] = useState(false);
  const [asset, setAsset] = useState<MediaAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  async function upload(file: File) { setUploading(true); const form = new FormData(); form.append("file", file); const response = await fetch("/api/media", { method: "POST", body: form }); if (response.ok) setAsset((await response.json()).asset); setUploading(false); }
  function generate() { setRunning(true); window.setTimeout(() => setRunning(false), 900); }
  return <main className="shell">
    <header className="topbar"><div className="brand"><span className="mark">✦</span><span>RUNWAY<br /><b>TO REALITY</b></span></div><div className="status"><i /> LOCAL PIPELINE <span>v0.1</span></div></header>
    <section className="hero"><p className="eyebrow">AI FASHION HACKATHON / WORKSPACE 01</p><h1>Turn a <em>feeling</em><br />into something wearable.</h1><p className="lede">A creative pipeline for translating reference imagery into generative, buildable fashion primitives.</p></section>
    <section className="grid">
      <article className="panel input-panel"><div className="panel-head"><span>01 / INPUT</span><b>REFERENCE MEDIA</b></div><input ref={fileRef} className="file-input" type="file" accept="image/png,image/jpeg,image/webp,video/mp4" onChange={e => e.target.files?.[0] && upload(e.target.files[0])} /><button className="dropzone" onClick={() => fileRef.current?.click()}><div className="upload-icon">↥</div><strong>{uploading ? "Uploading..." : "Drop a look here"}</strong><span>or browse your files</span><small>PNG, JPG, WebP, MP4 up to 50MB</small></button>{asset && <div className="asset-row"><img className="thumb-image" src={asset.kind === "video" ? asset.thumbnailUrl : asset.url} alt={asset.kind === "video" ? "Video thumbnail" : asset.name} /><span><b>{asset.name}</b><small>{asset.kind.toUpperCase()} / {(asset.sizeBytes / 1024 / 1024).toFixed(1)} MB</small></span><span className="check">✓</span></div>}</article>
      <article className="panel video-panel"><div className="panel-head"><span>02 / SIGNAL</span><b>LIVE VIDEO</b></div><div className="video-box"><span className="live"><i /> LIVE</span><div className="scanline" /><span className="video-placeholder">VIDEO SESSION<br /><b>READY TO CONNECT</b></span><span className="corner tl" /><span className="corner br" /></div><p className="muted">Vonage Video API session placeholder</p></article>
      <article className="panel intent-panel"><div className="panel-head"><span>03 / DIRECTION</span><b>CREATIVE INTENT</b></div><label htmlFor="intent">What should this become?</label><textarea id="intent" value={intent} onChange={e => setIntent(e.target.value)} placeholder="e.g. Make it feel protective, but light enough for a summer night..." /><button onClick={generate}>{running ? "GENERATING..." : "GENERATE PRIMITIVES  →"}</button></article>
      <article className="panel primitives-panel"><div className="panel-head"><span>04 / TRANSLATION</span><b>WEARABLE PRIMITIVES</b><span className="count">{mockPrimitives.length} FOUND</span></div>{mockPrimitives.map(item => <div className="primitive" key={item.id}><span className="primitive-id">{item.id.slice(-2)}</span><span><b>{item.name}</b><small>{item.category.toUpperCase()} / {Math.round(item.confidence * 100)}% CONFIDENCE</small></span><span className="arrow">↗</span></div>)}</article>
      <article className="panel forma-panel"><div className="panel-head"><span>05 / MATERIALIZE</span><b>FORMA OUTPUT</b></div><div className="output-art"><span>◈</span><small>3D PREVIEW<br />AWAITING GENERATION</small></div><button className="outline">SEND TO FORMA  →</button></article>
    </section>
    <footer><span>GEMINI × VONAGE × FORMA-OSS</span><span>BUILD SOMETHING THAT MOVES</span></footer>
  </main>;
}
