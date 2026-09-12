"use client";

import type { CSSProperties } from "react";

/* The design system's Icon fetches Lucide SVGs from unpkg at runtime. In the app we
   inline the handful of glyphs the workspace actually uses, so the UI has no CDN
   dependency and nothing pops in after paint. Same visual contract: Lucide 0.470.0
   geometry, 2px stroke, rounded caps, colour inherited from the parent. */
const paths: Record<string, string[]> = {
  upload: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"],
  download: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
  "arrow-right": ["M5 12h14", "m12 5 7 7-7 7"],
  box: [
    "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
    "M3.3 7 12 12l8.7-5",
    "M12 22V12"
  ],
  check: ["M20 6 9 17l-5-5"],
  video: ["m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5", "M2 7.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"],
  camera: ["M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z", "M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"]
};

export type IconName = keyof typeof paths;

export function Icon({
  name,
  size = 18,
  color = "currentColor",
  strokeWidth = 2,
  style
}: {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      data-icon={name}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, color, flex: "none", ...style }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[name].map(d => <path key={d} d={d} />)}
      </svg>
    </span>
  );
}
