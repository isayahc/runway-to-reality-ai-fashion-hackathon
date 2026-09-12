import type { CSSProperties, ReactNode } from "react";

/* Extends the design system component with an optional `subSize` so the page can pass a
   responsive clamp() for `size` — the DS derives the sub-line at 0.36x, which only works
   when `size` is a plain number. */
export function DisplayHeading({
  children,
  sub,
  size = 88,
  subSize,
  align = "left",
  style
}: {
  children: ReactNode;
  sub?: ReactNode;
  size?: number | string;
  subSize?: number | string;
  align?: CSSProperties["textAlign"];
  style?: CSSProperties;
}) {
  const resolvedSub = subSize ?? (typeof size === "number" ? Math.round(size * 0.36) : size);
  return (
    <div style={{ textAlign: align, ...style }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: size, lineHeight: "var(--leading-tight)", color: "var(--text-display)", letterSpacing: "var(--tracking-display)" }}>
        {children}
      </div>
      {sub && (
        <div style={{ fontFamily: "var(--font-display)", fontSize: resolvedSub, lineHeight: 1.2, color: "var(--ink-500)", marginTop: 14, fontWeight: 400 }}>
          {sub}
        </div>
      )}
    </div>
  );
}
