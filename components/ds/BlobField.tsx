import type { CSSProperties, ReactNode } from "react";

/* The brand's background: large soft organic shapes in peach, pale grey and mint, plus a
   dot grid. Built from blurred border-radius blobs so no artwork is redrawn. */
const tones = {
  peach: ["var(--blob-peach)", "var(--blob-cream)", "var(--blob-gray)"],
  mint: ["var(--blob-mint)", "var(--blob-cream)", "var(--blob-gray)"],
  grey: ["var(--blob-gray)", "var(--ink-100)", "var(--blob-cream)"]
};

export function BlobField({
  density = "medium",
  tone = "peach",
  dots = true,
  style,
  children
}: {
  density?: "low" | "medium" | "high";
  tone?: keyof typeof tones;
  dots?: boolean;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const [c1, c2, c3] = tones[tone];
  const n = density === "low" ? 2 : density === "high" ? 5 : 3;
  const spots = [
    { t: "-14%", l: "-16%", w: 620, h: 520, c: c1, r: "52% 48% 60% 40%/44% 56% 44% 56%" },
    { t: "6%", l: "80%", w: 520, h: 620, c: c2, r: "60% 40% 44% 56%/56% 44% 60% 40%" },
    { t: "62%", l: "-20%", w: 560, h: 560, c: c3, r: "44% 56% 52% 48%/60% 40% 56% 44%" },
    { t: "74%", l: "72%", w: 640, h: 480, c: c1, r: "56% 44% 40% 60%/48% 52% 44% 56%" },
    { t: "40%", l: "40%", w: 420, h: 400, c: c2, r: "50% 50% 44% 56%/56% 44% 52% 48%" }
  ].slice(0, n);

  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        {spots.map((s, i) => (
          <div key={i} style={{ position: "absolute", top: s.t, left: s.l, width: s.w, height: s.h, background: s.c, borderRadius: s.r, filter: "blur(26px)", opacity: 0.55 }} />
        ))}
        {dots && (
          <div style={{ position: "absolute", top: "6%", left: "4%", width: 150, height: 110, backgroundImage: "radial-gradient(var(--ink-200) 1.5px, transparent 1.5px)", backgroundSize: "13px 13px", opacity: 0.55 }} />
        )}
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
