"use client";

import { useState } from "react";
import type { CSSProperties, TextareaHTMLAttributes } from "react";

/* The design calls for Input shape="round" size="lg" here, but creative intent is a
   multi-line thought — so this wears the Input's exact chrome (white fill, inset keyline,
   accent focus ring) over a textarea. */
export function TextArea({
  shape = "round",
  size = "lg",
  rows = 3,
  style,
  ...rest
}: {
  shape?: "pill" | "round";
  size?: "sm" | "md" | "lg";
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focus, setFocus] = useState(false);
  const pad = size === "lg" ? "20px 26px" : size === "sm" ? "11px 18px" : "15px 22px";

  const chrome: CSSProperties = {
    display: "flex",
    background: "var(--white)",
    borderRadius: shape === "pill" ? "var(--radius-pill)" : "var(--radius-md)",
    padding: pad,
    boxShadow: focus ? "inset 0 0 0 1.5px var(--accent), 0 0 0 4px var(--focus-ring)" : "inset 0 0 0 1px var(--border-input)",
    transition: "var(--transition-base)",
    ...style
  };

  return (
    <div style={chrome}>
      <textarea
        rows={rows}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          background: "transparent",
          font: "var(--type-body)",
          color: "var(--ink-700)",
          minWidth: 0,
          resize: "vertical"
        }}
        {...rest}
      />
    </div>
  );
}
