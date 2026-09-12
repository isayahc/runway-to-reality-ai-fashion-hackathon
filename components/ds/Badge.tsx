import type { CSSProperties, ReactNode } from "react";

const tones = {
  accent: { color: "var(--accent)", background: "transparent" },
  soft: { color: "var(--accent)", background: "var(--accent-soft)" },
  mint: { color: "#2E8C81", background: "var(--mint-200)" },
  neutral: { color: "var(--ink-500)", background: "var(--ink-100)" }
};

export function Badge({
  tone = "accent",
  uppercase = false,
  children,
  style
}: {
  tone?: keyof typeof tones;
  uppercase?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const bare = tones[tone].background === "transparent";
  return (
    <span
      style={{
        display: "inline-block",
        font: "var(--type-eyebrow)",
        letterSpacing: uppercase ? "var(--tracking-eyebrow)" : ".01em",
        textTransform: uppercase ? "uppercase" : "none",
        padding: bare ? 0 : "6px 14px",
        borderRadius: "var(--radius-pill)",
        ...tones[tone],
        ...style
      }}
    >
      {children}
    </span>
  );
}
