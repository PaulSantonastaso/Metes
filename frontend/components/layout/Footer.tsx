// components/layout/Footer.tsx
import Link from "next/link";

// Brand palette (from your homepage)
const C = {
  cream:        "#EFEAE0",
  creamWarm:    "#F4F0E8",
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

export default function Footer() {
  return (
    <footer style={{ background: C.forestDeep, padding: "64px 0 32px" }}>
      <div className={CONTENT}>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-[2fr_1fr_1fr_1fr]" style={{ marginBottom: "48px" }}>
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-manrope, sans-serif)",
              fontWeight: 700,
              fontSize: "17px",
              color: C.creamWarm,
              textDecoration: "none",
              marginBottom: "16px"
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
            <p style={{
              fontSize: "13px",
              lineHeight: 1.6,
              color: "rgba(244,240,232,0.65)",
              maxWidth: "280px"
            }}>
              The marketing kit for the modern listing. Built for solo agents who'd rather be showing homes than writing about them.
            </p>
          </div>
          {([["Product", ["How it works", "See an example", "Pricing"]], ["Company", ["About", "Contact"]], ["Legal", ["Terms", "Privacy", "MLS compliance"]]] as [string, string[]][]).map(([heading, links]) => (
            <div key={heading}>
              <h4 style={{
                fontFamily: "var(--font-jetbrains, monospace)",
                fontSize: "11px",
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: C.goldSoft,
                marginBottom: "16px"
              }}>
                {heading}
              </h4>
              {links.map((link) => {
                // Map legal links to /legal/ paths
                const pathMap: Record<string, string> = {
                    "Terms": "/legal/terms",
                    "Privacy": "/legal/privacy",
                    "MLS compliance": "/legal/compliance",
                    "How it works": "/#how-it-works",
                    "See an example": "/#",  
                    "Pricing": "/#pricing",
                    "About": "/about",  
                    "Contact": "/contact"
                };
                const href = pathMap[link] || "#";
                return (
                  <Link
                    key={link}
                    href={href}
                    style={{
                      display: "block",
                      color: "rgba(244,240,232,0.78)",
                      textDecoration: "none",
                      fontSize: "13px",
                      marginBottom: "10px"
                    }}
                  >
                    {link}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{
          borderTop: `1px solid ${C.borderDark}`,
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-jetbrains, monospace)",
          fontSize: "11px",
          color: "rgba(244,240,232,0.5)",
          letterSpacing: "0.04em"
        }}>
          <span>© 2026 metes</span>
          <span>metes.app</span>
        </div>
      </div>
    </footer>
  );
}