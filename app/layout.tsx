import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Runway to Reality", description: "AI-powered wearable generation workspace" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
