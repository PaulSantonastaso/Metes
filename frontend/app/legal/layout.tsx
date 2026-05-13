// app/legal/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

// Brand palette (from your homepage)
const C = {
  cream:        "#EFEAE0",
  creamWarm:    "#F4F0E8",
  bgCard:       "#FAF7F0",
  forest:       "#1F3D2E",
  forestDeep:   "#14271E",
  moss:         "#4A6B53",
  gold:         "#B89968",
  goldDeep:     "#9A7E50",
  goldSoft:     "#D9C49C",
  ink:          "#14271E",
  inkSoft:      "#4A6B53",
  muted:        "rgba(20,39,30,0.55)",
  border:       "rgba(20,39,30,0.10)",
  borderDark:   "rgba(244,240,232,0.12)",
  creamText:    "rgba(244,240,232,0.78)",
  creamMuted:   "rgba(244,240,232,0.55)",
  creamDim:     "rgba(244,240,232,0.70)",
};

const CONTENT = "mx-auto w-full max-w-[1280px] px-6 lg:px-12";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main style={{ padding: "80px 0" }}>
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}