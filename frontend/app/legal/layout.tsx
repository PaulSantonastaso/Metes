// app/legal/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

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
      <nav style={{
        borderBottom: `1px solid ${C.border}`,
        background: C.cream,
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div className={CONTENT} style={{
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <Link href="/" style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "var(--font-manrope, sans-serif)",
            fontWeight: 700,
            fontSize: "17px",
            color: C.forest,
            textDecoration: "none"
          }}>
            <div style={{
              width: "24px",
              height: "24px",
              background: C.forest,
              borderRadius: "6px",
              position: "relative",
              flexShrink: 0
            }}>
              <div style={{
                position: "absolute",
                inset: "6px",
                border: `1.5px solid ${C.gold}`,
                borderRadius: "2px"
              }} />
            </div>
            metes
          </Link>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <Link href="/#how-it-works" style={{
              fontSize: "13px",
              fontWeight: 500,
              color: C.inkSoft,
              textDecoration: "none"
            }}>
              How it works
            </Link>
            <Link href="/#pricing" style={{
              fontSize: "13px",
              fontWeight: 500,
              color: C.inkSoft,
              textDecoration: "none"
            }}>
              Pricing
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: "80px 0" }}>
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}