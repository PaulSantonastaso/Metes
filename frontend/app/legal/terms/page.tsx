// app/legal/terms/page.tsx
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
  title: "Terms of Service | Metes",
  description: "Terms and conditions for using Metes.",
};

export default function TermsPage() {
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
          Terms of Service
        </h1>

        <p style={{
          fontSize: "clamp(14px, 1.2vw, 16px)",
          lineHeight: 1.6,
          color: C.inkSoft,
          marginBottom: "32px"
        }}>
          Welcome to Metes. By accessing or using our services, you agree to comply with and be bound by the following terms and conditions.
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
              1. Use of Service
            </h2>
            <p style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: C.inkSoft
            }}>
              You agree to use Metes only for lawful purposes and in compliance with all applicable laws and regulations. You are responsible for all activity that occurs under your account.
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
              2. Intellectual Property
            </h2>
            <p style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: C.inkSoft
            }}>
              All content, logos, and materials on Metes are the property of Metes or its licensors. You may not reproduce, distribute, or create derivative works without explicit permission.
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
              3. Limitation of Liability
            </h2>
            <p style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: C.inkSoft
            }}>
              Metes is not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability is limited to the amount you paid for the service in the 12 months preceding the event.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}