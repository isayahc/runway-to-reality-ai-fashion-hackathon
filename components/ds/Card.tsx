"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const pads = { sm: "24px", md: "40px", lg: "64px 72px" };
const shadows = { none: "var(--inset-hairline)", sm: "var(--shadow-sm)", card: "var(--shadow-card)" };

export function Card({
  padding = "md",
  elevation = "card",
  interactive = false,
  children,
  style
}: {
  padding?: keyof typeof pads;
  elevation?: keyof typeof shadows;
  interactive?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-xl)",
        padding: pads[padding],
        boxShadow: interactive && hover ? "var(--shadow-card-hover)" : shadows[elevation],
        transform: interactive && hover ? "translateY(-3px)" : "none",
        transition: "var(--transition-base)",
        ...style
      }}
    >
      {children}
    </div>
  );
}
