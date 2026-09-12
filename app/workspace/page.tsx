"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaAsset } from "@/lib/types/pipeline";
import { mockPrimitives } from "@/lib/clients/mock-data";
import { Badge } from "@/components/ds/Badge";
import { BlobField } from "@/components/ds/BlobField";
import { Button } from "@/components/ds/Button";
import { Card } from "@/components/ds/Card";
import { DisplayHeading } from "@/components/ds/DisplayHeading";
import { Icon } from "@/components/ds/Icon";
import { Tag } from "@/components/ds/Tag";
import { TextArea } from "@/components/ds/TextArea";

const sampleAssets: MediaAsset[] = [
  { id: "sample-orbit-jacket", kind: "image", name: "Orbit jacket", url: "/samples/orbit-jacket.svg", mimeType: "image/svg+xml", sizeBytes: 0, width: 640, height: 800, createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "sample-signal-collar", kind: "image", name: "Signal collar", url: "/samples/signal-collar.svg", mimeType: "image/svg+xml", sizeBytes: 0, width: 640, height: 800, createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "sample-kinetic-cuff", kind: "image", name: "Kinetic cuff", url: "/samples/kinetic-cuff.svg", mimeType: "image/svg+xml", sizeBytes: 0, width: 640, height: 800, createdAt: "2026-01-01T00:00:00.000Z" }
];

/* Service tile gradients live only inside the 54px tiles — never on surfaces or text. */
const tileGradients = [
  "linear-gradient(135deg,var(--tile-4a),var(--tile-4b))",
  "linear-gradient(135deg,var(--tile-5a),var(--tile-5b))",
  "linear-gradient(135deg,var(--tile-3a),var(--tile-3b))",
  "linear-gradient(135deg,var(--tile-1a),var(--tile-1b))",
  "linear-gradient(135deg,var(--tile-6a),var(--tile-6b))"
];

const sentenceCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

function formatSize(bytes: number) {
  if (!bytes) return "Sample";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} kb`;
  return `${(bytes / 1024 / 1024).toFixed(1)} mb`;
}

export default function Workspace() {
  const [intent, setIntent] = useState("");
  const [running, setRunning] = useState(false);
  const [primitives, setPrimitives] = useState(mockPrimitives);
  const [selected, setSelected] = useState(mockPrimitives[0]);
  const [formaStatus, setFormaStatus] = useState("Awaiting input");
  const [formaBusy, setFormaBusy] = useState(false);
  const [formaResult, setFormaResult] = useState<string | null>(null);
  const [meshResult, setMeshResult] = useState<string | null>(null);
  const [asset, setAsset] = useState<MediaAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [camera, setCamera] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);

  /* Attach in an effect rather than straight after setStream — the ref is only populated
     once React has re-rendered with the stream in hand. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    if (stream) video.play().catch(() => {});
  }, [stream]);

  async function upload(file: File) { setUploading(true); const form = new FormData(); form.append("file", file); const response = await fetch("/api/media", { method: "POST", body: form }); if (response.ok) setAsset((await response.json()).asset); setUploading(false); }
  async function useSample(sample: MediaAsset) { const image = new Image(); image.src = sample.url; await image.decode(); const canvas = document.createElement("canvas"); canvas.width = sample.width ?? 640; canvas.height = sample.height ?? 800; canvas.getContext("2d")?.drawImage(image, 0, 0); canvas.toBlob(blob => blob && upload(new File([blob], `${sample.id}.png`, { type: "image/png" })), "image/png"); }
  async function joinLive() { const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); setStream(media); setLive(true); setCamera(true); }
  function leaveLive() { stream?.getTracks().forEach(track => track.stop()); setStream(null); setLive(false); }
  function toggleCamera() { const track = stream?.getVideoTracks()[0]; if (track) track.enabled = !camera; setCamera(!camera); }
  function captureFrame() { const video = videoRef.current; const canvas = canvasRef.current; if (!video || !canvas || !video.videoWidth) return; canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext("2d")?.drawImage(video, 0, 0); canvas.toBlob(blob => blob && upload(new File([blob], `live-frame-${Date.now()}.jpg`, { type: "image/jpeg" })), "image/jpeg"); }
  async function generate() { if (!asset) return; setRunning(true); const response = await fetch("/api/gemini/primitives", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mediaAssetId: asset.id, intent }) }); if (response.ok) { const next = (await response.json()).primitives; setPrimitives(next); if (next.length) setSelected(next[0]); } setRunning(false); }
  async function sendToForma() {
    if (!selected || !intent) return;
    setFormaBusy(true);
    setFormaStatus("Generating…");
    const response = await fetch("/api/forma/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ primitives: [selected], intent, target: "both" }) });
    if (response.ok) { const result = (await response.json()).result; setFormaResult(result.stepArtifact?.downloadUrl ?? null); setFormaStatus(sentenceCase(result.status)); }
    else setFormaStatus("Failed");
    setFormaBusy(false);
  }

  return (
    <BlobField tone="peach" density="high" dots style={{ minHeight: "100vh" }}>
      <main className="page">
        <div className="container">

          <header className="masthead">
            <div className="wordmark">runway to reality</div>
            <Tag tone="mint">Local pipeline v0.1</Tag>
          </header>

          <section className="hero">
            <div className="hero-lede">
              <Badge tone="accent" uppercase>Ai fashion hackathon</Badge>
              <DisplayHeading sub="is a feeling you can build ." size="clamp(52px, 8vw, 88px)" subSize="clamp(22px, 3.2vw, 34px)">wearable</DisplayHeading>
            </div>
            <p className="hero-body">A creative pipeline that turns your reference imagery into generative, buildable fashion primitives.</p>
          </section>

          <div className="cards">

            <Card padding="sm">
              <div className="card-body">
                <div className="card-head">
                  <Badge tone="soft">01</Badge>
                  <Badge tone="accent" uppercase>Reference media</Badge>
                </div>
                <input ref={fileRef} className="file-input" type="file" accept="image/png,image/jpeg,image/webp,video/mp4" onChange={e => e.target.files?.[0] && upload(e.target.files[0])} />
                <button className="dropzone" onClick={() => fileRef.current?.click()}>
                  <span className="tile" style={{ background: "linear-gradient(135deg,var(--tile-2a),var(--tile-2b))" }}>
                    <Icon name="upload" size={22} />
                  </span>
                  <span className="dropzone-title">{uploading ? "Uploading…" : "Drop a look here"}</span>
                  <span className="dropzone-sub">or browse your files — png, jpg, webp, mp4 up to 50mb</span>
                </button>
                {asset && (
                  <div className="asset-row">
                    <img className="asset-thumb" src={asset.kind === "video" ? asset.thumbnailUrl : asset.url} alt={asset.kind === "video" ? "Video thumbnail" : asset.name} />
                    <div className="primitive-copy">
                      <div className="primitive-name">{asset.name}</div>
                      <div className="primitive-meta">{asset.kind === "video" ? "Video" : "Image"} · {formatSize(asset.sizeBytes)}</div>
                    </div>
                    <Icon name="check" size={18} color="var(--accent)" />
                  </div>
                )}
                <div className="samples">
                  <span className="samples-label">Try a sample</span>
                  {sampleAssets.map(sample => <button key={sample.id} className="chip" onClick={() => useSample(sample)}>{sample.name}</button>)}
                </div>
              </div>
            </Card>

            <Card padding="sm">
              <div className="card-body">
                <div className="card-head">
                  <Badge tone="soft">02</Badge>
                  <Badge tone="accent" uppercase>Live video</Badge>
                </div>
                <div className="video-frame">
                  <video ref={videoRef} muted={muted} playsInline hidden={!live} />
                  {!live && <div className="video-placeholder">Video session<br />ready to connect</div>}
                  <div className="video-state">
                    <Tag tone={live ? "accent" : "neutral"}>{live ? "Live" : "Offline"}</Tag>
                  </div>
                </div>
                <canvas ref={canvasRef} className="capture-canvas" />
                <div className="video-controls">
                  <Button variant="primary" size="sm" onClick={live ? leaveLive : joinLive}>{live ? "Leave session" : "Join session"}</Button>
                  <Button variant="secondary" size="sm" disabled={!live} onClick={() => setMuted(!muted)}>{muted ? "Unmute" : "Mute"}</Button>
                  <Button variant="secondary" size="sm" disabled={!live} onClick={toggleCamera}>{camera ? "Camera on" : "Camera off"}</Button>
                  <Button variant="ghost" size="sm" disabled={!live} onClick={captureFrame}>Capture frame</Button>
                </div>
                <p className="card-note">Vonage session — nothing is recorded.</p>
              </div>
            </Card>

            <Card padding="sm">
              <div className="card-body" style={{ alignItems: "flex-start" }}>
                <div className="card-head">
                  <Badge tone="soft">03</Badge>
                  <Badge tone="accent" uppercase>Creative intent</Badge>
                </div>
                <div className="card-title">What should this become?</div>
                <TextArea style={{ width: "100%" }} value={intent} onChange={e => setIntent(e.target.value)} placeholder="Make it feel protective, but light enough for a summer night…" aria-label="Creative intent" />
                <Button variant="primary" size="md" onClick={generate} disabled={!asset || running} iconRight={<Icon name="arrow-right" size={13} />}>
                  {running ? "Generating…" : "Generate primitives"}
                </Button>
                <p className="card-note">{asset ? "Gemini reads your words." : "Add a reference first — Gemini reads both."}</p>
              </div>
            </Card>

            <Card padding="sm">
              <div className="card-body">
                <div className="card-head-split">
                  <div className="card-head">
                    <Badge tone="soft">04</Badge>
                    <Badge tone="accent" uppercase>Wearable primitives</Badge>
                  </div>
                  <Tag tone="mint">{primitives.length} found</Tag>
                </div>
                <div className="primitive-list">
                  {primitives.map((item, index) => (
                    <button
                      key={item.id}
                      className={`primitive-row ${selected.id === item.id ? "is-selected" : ""}`}
                      aria-pressed={selected.id === item.id}
                      onClick={() => setSelected(item)}
                    >
                      <span className="tile" style={{ background: tileGradients[index % tileGradients.length] }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="primitive-copy">
                        <span className="primitive-name">{item.name}</span>
                        <span className="primitive-meta">{item.targetBodyRegion} · {Math.round(item.confidence * 100)}% confidence</span>
                      </span>
                      <span className="primitive-arrow"><Icon name="arrow-right" size={13} /></span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            <div className="card-span">
              <Card padding="md">
                <div className="forma-layout">
                  <div className="forma-media-wrap">
                    <div className="forma-media-block" />
                    <div className="forma-media">
                      <Icon name="box" size={26} color="var(--accent)" />
                      {formaResult
                        ? <div style={{ font: "var(--type-sm)", color: "var(--ink-700)" }}>{selected.name}<br />ready to materialize</div>
                        : <div style={{ font: "var(--type-sm)", color: "var(--text-body)" }}>3d preview<br />awaiting generation</div>}
                    </div>
                  </div>
                  <div className="forma-copy">
                    <div className="card-head">
                      <Badge tone="soft">05</Badge>
                      <Badge tone="accent" uppercase>Forma output</Badge>
                    </div>
                    <h2>Make it real.</h2>
                    <p>Send a primitive to Forma and get a parametric mesh you can cut, print or sew.</p>
                    <Tag tone={formaStatus === "Failed" ? "accent" : formaResult ? "mint" : "neutral"}>{formaStatus}</Tag>
                    <Button variant="primary" size="md" onClick={sendToForma} disabled={!intent || formaBusy} iconRight={<Icon name="arrow-right" size={13} />}>
                      Send to Forma
                    </Button>
                    {formaResult && (
                      <a className="download-link" href={formaResult} download>Download step ↓</a>
                    )}
                  </div>
                </div>
              </Card>
            </div>

          </div>

          <footer className="pipeline-foot">
            <span>Gemini · Vonage · Forma-oss</span>
            <span>Build something that moves .</span>
          </footer>

        </div>
      </main>
    </BlobField>
  );
}
