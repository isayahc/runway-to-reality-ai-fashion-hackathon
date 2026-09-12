"use client";

import { useRef, useState } from "react";
import type { MediaAsset } from "@/lib/types/pipeline";
import { mockPrimitives } from "@/lib/clients/mock-data";

const sampleAssets: MediaAsset[] = [
  { id: "sample-orbit-jacket", kind: "image", name: "Orbit jacket", url: "/samples/orbit-jacket.svg", mimeType: "image/svg+xml", sizeBytes: 0, width: 640, height: 800, createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "sample-signal-collar", kind: "image", name: "Signal collar", url: "/samples/signal-collar.svg", mimeType: "image/svg+xml", sizeBytes: 0, width: 640, height: 800, createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "sample-kinetic-cuff", kind: "image", name: "Kinetic cuff", url: "/samples/kinetic-cuff.svg", mimeType: "image/svg+xml", sizeBytes: 0, width: 640, height: 800, createdAt: "2026-01-01T00:00:00.000Z" }
];

export default function Workspace() {
  const [intent, setIntent] = useState("");
  const [running, setRunning] = useState(false);
  const [primitives, setPrimitives] = useState(mockPrimitives);
  const [selected, setSelected] = useState(mockPrimitives[0]);
  const [formaStatus, setFormaStatus] = useState("AWAITING INPUT");
  const [formaResult, setFormaResult] = useState<string | null>(null);
  const [asset, setAsset] = useState<MediaAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  async function upload(file: File) { setUploading(true); const form = new FormData(); form.append("file", file); const response = await fetch("/api/media", { method: "POST", body: form }); if (response.ok) setAsset((await response.json()).asset); setUploading(false); }
  async function useSample(sample: MediaAsset) { const image = new Image(); image.src = sample.url; await image.decode(); const canvas = document.createElement("canvas"); canvas.width = sample.width ?? 640; canvas.height = sample.height ?? 800; canvas.getContext("2d")?.drawImage(image, 0, 0); canvas.toBlob(blob => blob && upload(new File([blob], `${sample.id}.png`, { type: "image/png" })), "image/png"); }
  async function joinLive() { const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); setStream(media); setLive(true); if (videoRef.current) { videoRef.current.srcObject = media; await videoRef.current.play(); } }
  function leaveLive() { stream?.getTracks().forEach(track => track.stop()); setStream(null); setLive(false); }
  function toggleCamera() { const track = stream?.getVideoTracks()[0]; if (track) track.enabled = !camera; setCamera(!camera); }
  function captureFrame() { const video = videoRef.current; const canvas = canvasRef.current; if (!video || !canvas || !video.videoWidth) return; canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext("2d")?.drawImage(video, 0, 0); canvas.toBlob(blob => blob && upload(new File([blob], `live-frame-${Date.now()}.jpg`, { type: "image/jpeg" })), "image/jpeg"); }
  async function generate() { if (!asset) return; setRunning(true); const response = await fetch("/api/gemini/primitives", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mediaAssetId: asset.id, intent }) }); if (response.ok) setPrimitives((await response.json()).primitives); setRunning(false); }
  async function sendToForma() { if (!selected || !intent) return; setFormaStatus("GENERATING..."); const response = await fetch("/api/forma/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ primitives: [selected], intent, target: "both" }) }); if (response.ok) { const result = (await response.json()).result; setFormaResult(result.stepArtifact?.downloadUrl ?? null); setFormaStatus(result.status.toUpperCase()); } else setFormaStatus("FAILED"); }
  async function sendToCad() { if (!asset || !intent) return; setFormaStatus("GENERATING CAD..."); const response = await fetch("/api/gemini/cad", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mediaAssetId: asset.id, intent }) }); if (response.ok) { const result = await response.json(); setFormaResult(result.downloadUrl); setFormaStatus("CAD READY"); } else setFormaStatus("CAD FAILED"); }
  return <main className="shell">
    <header className="topbar"><div className="brand"><span className="mark">✦</span><span>RUNWAY<br /><b>TO REALITY</b></span></div><div className="status"><i /> LOCAL PIPELINE <span>v0.1</span></div></header>
    <section className="hero"><p className="eyebrow">AI FASHION HACKATHON / WORKSPACE 01</p><h1>Turn a <em>feeling</em><br />into something wearable.</h1><p className="lede">A creative pipeline for translating reference imagery into generative, buildable fashion primitives.</p></section>
    <section className="grid">
      <article className="panel input-panel"><div className="panel-head"><span>01 / INPUT</span><b>REFERENCE MEDIA</b></div><input ref={fileRef} className="file-input" type="file" accept="image/png,image/jpeg,image/webp,video/mp4" onChange={e => e.target.files?.[0] && upload(e.target.files[0])} /><div role="button" tabIndex={0} className="dropzone" onClick={() => fileRef.current?.click()}><div className="upload-icon">↥</div><strong>{uploading ? "Uploading..." : "Drop a look here"}</strong><span>or browse your files</span><small>PNG, JPG, WebP, MP4 up to 50MB</small></div><div className="sample-list"><small>TRY A SAMPLE</small>{sampleAssets.map(sample => <button key={sample.id} onClick={() => useSample(sample)}>{sample.name} ↗</button>)}</div>{asset && <div className="asset-row"><img className="thumb-image" src={asset.kind === "video" ? asset.thumbnailUrl : asset.url} alt={asset.kind === "video" ? "Video thumbnail" : asset.name} /><span><b>{asset.name}</b><small>{asset.kind.toUpperCase()} / {asset.sizeBytes ? `${(asset.sizeBytes / 1024 / 1024).toFixed(1)} MB` : "SAMPLE"}</small></span><span className="check">✓</span></div>}</article>
      <article className="panel video-panel"><div className="panel-head"><span>02 / SIGNAL</span><b>LIVE VIDEO</b></div><div className="video-box">{live ? <video ref={videoRef} muted={muted} playsInline /> : <span className="video-placeholder">VIDEO SESSION<br /><b>READY TO CONNECT</b></span>}<span className="live"><i /> {live ? "LIVE" : "OFFLINE"}</span><span className="corner tl" /><span className="corner br" /></div><canvas ref={canvasRef} className="capture-canvas" /><div className="video-controls"><button onClick={live ? leaveLive : joinLive}>{live ? "LEAVE" : "JOIN"}</button><button disabled={!live} onClick={() => setMuted(!muted)}>{muted ? "UNMUTE" : "MUTE"}</button><button disabled={!live} onClick={toggleCamera}>{camera ? "CAMERA ON" : "CAMERA OFF"}</button><button disabled={!live} onClick={captureFrame}>CAPTURE FRAME</button></div><p className="muted">Vonage Video API session placeholder</p></article>
      <article className="panel intent-panel"><div className="panel-head"><span>03 / DIRECTION</span><b>CREATIVE INTENT</b></div><label htmlFor="intent">What should this become?</label><textarea id="intent" value={intent} onChange={e => setIntent(e.target.value)} placeholder="e.g. Make it feel protective, but light enough for a summer night..." /><button onClick={generate}>{running ? "GENERATING..." : "GENERATE PRIMITIVES  →"}</button></article>
      <article className="panel primitives-panel"><div className="panel-head"><span>04 / TRANSLATION</span><b>WEARABLE PRIMITIVES</b><span className="count">{primitives.length} FOUND</span></div>{primitives.map(item => <button className={`primitive ${selected.id === item.id ? "selected" : ""}`} key={item.id} onClick={() => setSelected(item)}><img className="primitive-image" src={item.imageUrl} alt="" /><span className="primitive-id">{item.id.slice(-2)}</span><span><b>{item.name}</b><small>{item.targetBodyRegion.toUpperCase()} / {Math.round(item.confidence * 100)}% CONFIDENCE</small></span><span className="arrow">↗</span></button>)}</article>
      <article className="panel forma-panel"><div className="panel-head"><span>05 / MATERIALIZE</span><b>GEMINI CAD OUTPUT</b><span className="count">{formaStatus}</span></div><div className="output-art">{formaResult ? <><span>✓</span><small>CAD SOURCE READY<br />{selected.name}</small></> : <><span>◈</span><small>OPENSCAD SOURCE<br />AWAITING GENERATION</small></>}</div><button className="outline" onClick={sendToCad} disabled={!asset || !intent || formaStatus === "GENERATING CAD...">GENERATE CAD  →</button>{formaResult && <a className="download-link" href={formaResult} download>{"DOWNLOAD .SCAD  →"}</a>}</article>
    </section>
    <footer><span>GEMINI × VONAGE × FORMA-OSS</span><span>BUILD SOMETHING THAT MOVES</span></footer>
  </main>;
}
