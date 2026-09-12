"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import occtimportjs from "occt-import-js";

export function CadViewport({ url, format }: { url: string; format?: "stl" | "step" }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    const scene = new THREE.Scene(); scene.background = new THREE.Color("#20202b");
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000); camera.position.set(0, 0, 140);
    const renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); root.current.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xf4f1ea, 0x171827, 2)); const key = new THREE.DirectionalLight(0xff573f, 3); key.position.set(4, 8, 10); scene.add(key);
    const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true;
    const addGeometry = (geometry: THREE.BufferGeometry) => { geometry.center(); geometry.computeVertexNormals(); const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x7358d9, metalness: 0.2, roughness: 0.45 })); const size = geometry.boundingSphere?.radius ?? 40; camera.position.set(0, size * 0.25, size * 3.2); controls.target.set(0, 0, 0); scene.add(mesh); };
    const isStep = format === "step" || /\.(step|stp|iges|igs)(?:$|\?)/i.test(url); if (isStep) fetch(url).then(response => response.arrayBuffer()).then(buffer => occtimportjs({ locateFile: () => "/occt-import-js.wasm" }).then(occt => { const result = occt.ReadStepFile(new Uint8Array(buffer), { linearUnit: "millimeter" }); if (!result.success) throw new Error("STEP import failed"); result.meshes.forEach(item => { const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.Float32BufferAttribute(item.attributes.position.array, 3)); if (item.attributes.normal) geometry.setAttribute("normal", new THREE.Float32BufferAttribute(item.attributes.normal.array, 3)); geometry.setIndex(item.index.array); addGeometry(geometry); }); })).catch(() => { if (root.current) root.current.dataset.error = "true"; }); else new STLLoader().load(url, addGeometry, undefined, () => { if (root.current) root.current.dataset.error = "true"; });
    const resize = () => { if (!root.current) return; const { width, height } = root.current.getBoundingClientRect(); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); renderer.setSize(width, height, false); }; resize(); window.addEventListener("resize", resize); let frame = 0; const animate = () => { frame = requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); }; animate();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); controls.dispose(); renderer.dispose(); root.current?.removeChild(renderer.domElement); };
  }, [url]);
  return <div className="cad-viewport" ref={root} aria-label="Generated CAD model viewport" />;
}
