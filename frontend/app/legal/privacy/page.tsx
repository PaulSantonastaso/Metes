// app/legal/privacy/page.tsx
import { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Privacy Policy | Metes",
  description: "How we collect and use your data.",
};

export default function PrivacyPage() {
  return (
    <div className={CONTENT}>
      <div style={{
        background: C.bgCard,
        borderRadius: "14px",
        padding: "48px 40px",
        border: `1px solid ${C.border}`
      }}>
        <h1 style={{
          fontFamily: "var(--font-manrope, sans-serif)",
          fontWeight: 500,
          fontSize: "clamp(28px, 4vw, 48px)",
          lineHeight: 1.06,
          letterSpacing: "-0.015em",
          color: C.forest,
          marginBottom: "24px"
        }}>
          Privacy Policy
        </h1>

        <p style={{
          fontSize: "clamp(14px, 1.2vw, 16px)",
          lineHeight: 1.6,
          color: C.inkSoft,
          marginBottom: "32px"
        }}>
          At Metes, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and disclose your information.
        </p>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px"
        }}>
          <section>
            <h2 style={{
              fontFamily: "var(--font-manrope, sans-serif)",
              fontWeight: 700,
              fontSize: "20px",
              color: C.forest,
              marginBottom: "16px"
            }}>
              1. Information We Collect
            </h2>
            <p style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: C.inkSoft
            }}>
              We collect information you provide directly, such as your name, email address, and payment details. We also collect data automatically, including IP addresses, browser type, and usage data.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: "var(--font-manrope, sans-serif)",
              fontWeight: 700,
              fontSize: "20px",
              color: C.forest,
              marginBottom: "16px"
            }}>
              2. How We Use Your Information
            </h2>
            <p style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: C.inkSoft
            }}>
              We use your information to provide, maintain, and improve our services, respond to your inquiries, and communicate with you about updates or promotions.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: "var(--font-manrope, sans-serif)",
              fontWeight: 700,
              fontSize: "20px",
              color: C.forest,
              marginBottom: "16px"
            }}>
              3. Data Security
            </h2>
            <p style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: C.inkSoft
            }}>
              We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}