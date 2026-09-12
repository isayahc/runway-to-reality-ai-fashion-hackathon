"use client";

import { useState } from "react";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

const sizes = { sm: 34, md: 44, lg: 54 };
type Variant = "light" | "accent" | "outline";

export function IconButton({
  variant = "light",
  size = "md",
  label,
  children,
  style,
  ...rest
}: {
  variant?: Variant;
  size?: keyof typeof sizes;
  label: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const [hover, setHover] = useState(false);
  const d = sizes[size];

  const variants: Record<Variant, CSSProperties> = {
    light: { background: "var(--white)", color: "var(--accent)", boxShadow: hover ? "var(--shadow-sm)" : "var(--shadow-xs)" },
    accent: { background: "var(--gradient-accent)", color: "var(--white)", boxShadow: hover ? "var(--glow-accent-hover)" : "var(--glow-accent)" },
    outline: { background: "transparent", color: hover ? "var(--accent)" : "var(--ink-300)", boxShadow: "inset 0 0 0 1.5px currentColor" }
  };

  return (
    <button
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: d,
        height: d,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        borderRadius: "var(--radius-pill)",
        cursor: "pointer",
        transition: "var(--transition-base)",
        ...variants[variant],
        ...style
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
