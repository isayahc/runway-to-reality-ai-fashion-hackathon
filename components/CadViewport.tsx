"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function CadViewport({ url }: { url: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    const scene = new THREE.Scene(); scene.background = new THREE.Color("#20202b");
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000); camera.position.set(0, 0, 140);
    const renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); root.current.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xf4f1ea, 0x171827, 2)); const key = new THREE.DirectionalLight(0xff573f, 3); key.position.set(4, 8, 10); scene.add(key);
    const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true;
    const loader = new STLLoader(); loader.load(url, geometry => { geometry.center(); geometry.computeVertexNormals(); const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x7358d9, metalness: 0.2, roughness: 0.45 })); const size = geometry.boundingSphere?.radius ?? 40; camera.position.set(0, size * 0.25, size * 3.2); controls.target.set(0, 0, 0); scene.add(mesh); }, undefined, () => { if (root.current) root.current.dataset.error = "true"; });
    const resize = () => { if (!root.current) return; const { width, height } = root.current.getBoundingClientRect(); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); renderer.setSize(width, height, false); }; resize(); window.addEventListener("resize", resize); let frame = 0; const animate = () => { frame = requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); }; animate();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); controls.dispose(); renderer.dispose(); root.current?.removeChild(renderer.domElement); };
  }, [url]);
  return <div className="cad-viewport" ref={root} aria-label="Generated CAD model viewport" />;
}
