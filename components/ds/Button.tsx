"use client";

import { useState } from "react";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

const sizes = {
  sm: { padding: "10px 22px", font: "var(--type-button)" },
  md: { padding: "14px 30px", font: "var(--type-button)" },
  lg: { padding: "17px 38px", fontSize: "15px", fontWeight: 600 }
};

type Variant = "primary" | "secondary" | "outline" | "ghost";

export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  iconLeft,
  iconRight,
  children,
  style,
  ...rest
}: {
  variant?: Variant;
  size?: keyof typeof sizes;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);

  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "var(--font-sans)",
    fontWeight: 600,
    fontSize: "13px",
    letterSpacing: ".01em",
    borderRadius: "var(--radius-pill)",
    transition: "var(--transition-base)",
    textDecoration: "none",
    opacity: disabled ? "var(--opacity-disabled)" : 1,
    transform: press && !disabled ? "scale(var(--press-scale))" : "none",
    ...sizes[size]
  };

  const variants: Record<Variant, CSSProperties> = {
    primary: {
      background: hover && !disabled ? "var(--gradient-accent-hover)" : "var(--gradient-accent)",
      color: "var(--text-on-accent)",
      boxShadow: disabled ? "none" : hover ? "var(--glow-accent-hover)" : "var(--glow-accent)"
    },
    secondary: {
      background: "var(--white)",
      color: "var(--ink-700)",
      boxShadow: hover ? "var(--shadow-sm)" : "var(--shadow-xs)"
    },
    outline: {
      background: "transparent",
      color: hover ? "var(--accent-hover)" : "var(--accent)",
      boxShadow: "inset 0 0 0 1.5px currentColor"
    },
    ghost: {
      background: hover ? "var(--accent-soft)" : "transparent",
      color: "var(--accent)",
      boxShadow: "none"
    }
  };

  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{ ...base, ...variants[variant], ...style }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
