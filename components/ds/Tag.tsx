import type { CSSProperties, ReactNode } from "react";

const tones = {
  neutral: { background: "var(--ink-100)", color: "var(--ink-500)" },
  accent: { background: "var(--accent-soft)", color: "var(--orange-600)" },
  mint: { background: "var(--mint-200)", color: "#2E8C81" },
  yellow: { background: "var(--yellow-300)", color: "var(--ink-900)" }
};

export function Tag({
  tone = "neutral",
  onRemove,
  children,
  style
}: {
  tone?: keyof typeof tones;
  onRemove?: () => void;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        font: "var(--type-sm)",
        fontWeight: 500,
        lineHeight: 1,
        padding: "8px 14px",
        borderRadius: "var(--radius-pill)",
        ...tones[tone],
        ...style
      }}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove"
          style={{ border: "none", background: "transparent", color: "inherit", cursor: "pointer", padding: 0, fontSize: 14, lineHeight: 1, opacity: 0.6 }}
        >
          ×
        </button>
      )}
    </span>
  );
}
