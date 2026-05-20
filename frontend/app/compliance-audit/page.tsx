import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// SEO metadata
// ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Compliance & Truth-in-Advertising Audit for Real Estate Listings | metes",
  description:
    "Every Metes listing kit is audited for Fair Housing compliance and truth-in-advertising standards. See exactly what we check, real catch examples, and how the two-layer review protects your license.",
  keywords: [
    "fair housing compliance real estate",
    "real estate ad compliance",
    "MLS Fair Housing audit",
    "real estate marketing compliance",
    "fair housing audit real estate",
    "truth in advertising real estate",
    "real estate listing compliance check",
  ],
  alternates: {
    canonical: "https://www.metes.app/compliance-audit",
  },
  openGraph: {
    title: "Compliance & Truth-in-Advertising Audit for Real Estate Listings",
    description:
      "Every word reviewed. Every asset audited. See exactly what Metes checks across MLS copy, social posts, emails, and more — and the real catches that protect your license.",
    url: "https://www.metes.app/compliance-audit",
    siteName: "metes",
    type: "website",
    images: [
      {
        url: "https://www.metes.app/og/compliance-audit.png",
        width: 1200,
        height: 630,
        alt: "metes Compliance & Truth-in-Advertising Audit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compliance & Truth-in-Advertising Audit for Real Estate Listings",
    description:
      "Every word reviewed. Every asset audited. The two-layer review that protects your license.",
    images: ["https://www.metes.app/og/compliance-audit.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ─────────────────────────────────────────────────────────────────
// Brand palette (scoped to this page, matching homepage tokens)
// ─────────────────────────────────────────────────────────────────

const C = {
  cream: "#EFEAE0",
  creamWarm: "#F4F0E8",
  bgCard: "#FAF7F0",
  forest: "#1F3D2E",
  forestDeep: "#14271E",
  moss: "#4A6B53",
  gold: "#B89968",
  goldDeep: "#9A7E50",
  goldSoft: "#D9C49C",
  ink: "#14271E",
  inkSoft: "#4A6B53",
  muted: "rgba(20,39,30,0.55)",
  border: "rgba(20,39,30,0.10)",
  borderDark: "rgba(244,240,232,0.12)",
  creamText: "rgba(244,240,232,0.78)",
  creamMuted: "rgba(244,240,232,0.55)",
  warn: "#C97B5C",
  pass: "#5C8A6E",
};

const CONTENT = "mx-auto w-full max-w-[1280px] px-6 lg:px-12";

// ─────────────────────────────────────────────────────────────────
// Shared section styles
// ─────────────────────────────────────────────────────────────────

const sectionHeadline = {
  fontFamily: "var(--font-manrope, sans-serif)",
  fontSize: "clamp(28px, 4vw, 44px)",
  fontWeight: 500 as const,
  lineHeight: 1.08,
  letterSpacing: "0.005em",
  color: C.ink,
};

const sectionSub = {
  fontFamily: "var(--font-manrope, sans-serif)",
  fontSize: "clamp(15px, 1.3vw, 17px)",
  lineHeight: 1.6,
  color: C.inkSoft,
};

// ─────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────

export default function ComplianceAuditPage() {
  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Header />

      {/* ── HERO ── */}
      <section style={{ background: C.creamWarm, padding: "80px 0 64px", borderBottom: `1px solid ${C.border}` }}>
        <div className={CONTENT}>
          <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", border: `1px solid ${C.border}`, borderRadius: "100px", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.06em", color: C.goldDeep, marginBottom: "24px" }}>
              <ShieldCheck className="h-3 w-3" strokeWidth={2} />
              COMPLIANCE & TRUTH-IN-ADVERTISING
            </div>

            <h1 style={{ ...sectionHeadline, fontSize: "clamp(32px, 5vw, 52px)", marginBottom: "20px" }}>
              Every word reviewed. <em style={{ fontStyle: "normal", color: C.goldDeep }}>Every asset audited.</em>
            </h1>

            <p style={{ ...sectionSub, fontSize: "clamp(15px, 1.3vw, 18px)", marginBottom: "32px", maxWidth: "640px", margin: "0 auto 32px" }}>
              A single Fair Housing violation can cost a $16,000 fine. A misleading claim can cost your license. Metes audits every asset in your listing kit against Fair Housing guidelines and truth-in-advertising standards — before you ever paste anything into the MLS.
            </p>

            <Link
              href="/tools/fha-compliance-checker"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-manrope, sans-serif)",
                fontSize: "13px",
                fontWeight: 500,
                color: C.forest,
                textDecoration: "underline",
                textDecorationColor: C.gold,
                textUnderlineOffset: "4px",
                textDecorationThickness: "1.5px",
              }}
            >
              Try the free Fair Housing checker first
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHAT GETS AUDITED — 6-category grid ── */}
      <section style={{ background: C.cream, padding: "96px 0" }}>
        <div className={CONTENT}>
          <div style={{ maxWidth: "720px", marginBottom: "56px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.goldDeep, marginBottom: "16px" }}>
              <span style={{ display: "inline-block", height: "1px", width: "18px", background: C.goldDeep }} />
              What gets audited
            </div>
            <h2 style={{ ...sectionHeadline, marginBottom: "16px" }}>
              Six asset types. <em style={{ fontStyle: "normal", color: C.goldDeep }}>One unified standard.</em>
            </h2>
            <p style={sectionSub}>
              Every output in your listing kit passes through the same compliance review — built for Fair Housing protected-class language and for truth-in-advertising principles like substantiated claims and accurate representation.
            </p>
          </div>

          <div className="audit-grid">
            {[
              {
                title: "MLS copy",
                desc: "Public remarks and listing descriptions reviewed for steering language, protected-class implications, and absolute claims like 'zero maintenance' or 'lowest taxes.'",
              },
              {
                title: "Social posts",
                desc: "Facebook, Instagram, and other platform captions checked for community-targeting language, demographic implications, and unsupported superlatives.",
              },
              {
                title: "Email campaign",
                desc: "All four emails (Just Listed, Open House, Why This Home, Just Sold) reviewed across subject lines and bodies for compliance and accuracy.",
              },
              {
                title: "Photo captions",
                desc: "Per-image captions audited for accessibility-sensitive proximity language, lifestyle assumptions, and demographic projections.",
              },
              {
                title: "Neighborhood content",
                desc: "Lifestyle paragraphs and place descriptions reviewed for steering, exclusionary terms like 'exclusive community,' and proximity language that implies mobility.",
              },
              {
                title: "Listing headlines",
                desc: "Hero headlines checked for FHA-restricted terminology and verifiable claims — what makes the cut for Zillow's What's Special and signage.",
              },
            ].map(({ title, desc }) => (
              <div
                key={title}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: "12px",
                  padding: "24px 24px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  minWidth: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle2 className="h-4 w-4" style={{ color: C.pass, flexShrink: 0 }} strokeWidth={2.5} />
                  <h3 style={{ fontFamily: "var(--font-manrope, sans-serif)", fontSize: "16px", fontWeight: 600, color: C.ink, letterSpacing: "-0.005em" }}>
                    {title}
                  </h3>
                </div>
                <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: C.inkSoft }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .audit-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }
          @media (min-width: 640px) {
            .audit-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          }
          @media (min-width: 1024px) {
            .audit-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
          }
        `}</style>
      </section>

      {/* ── REAL CATCHES — Before/After examples ── */}
      <section style={{ background: C.creamWarm, padding: "96px 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className={CONTENT}>
          <div style={{ maxWidth: "720px", marginBottom: "56px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.goldDeep, marginBottom: "16px" }}>
              <span style={{ display: "inline-block", height: "1px", width: "18px", background: C.goldDeep }} />
              Real catches from real audits
            </div>
            <h2 style={{ ...sectionHeadline, marginBottom: "16px" }}>
              Phrases the audit caught <em style={{ fontStyle: "normal", color: C.goldDeep }}>before they reached the MLS</em>.
            </h2>
            <p style={sectionSub}>
              Every example below is a real revision from a production listing kit. The originals weren&apos;t obviously wrong — that&apos;s exactly why the audit matters.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "920px" }}>
            {[
              {
                category: "Truth-in-advertising · MLS description",
                before: "New construction with a 2025 finish means zero maintenance and total Day One readiness.",
                after: "New construction with a 2025 finish means low maintenance and total Day One readiness.",
                why: "Absolute claims like 'zero maintenance' can be construed as misleading. The revision preserves the intent while staying defensible.",
              },
              {
                category: "Fair Housing · Email body",
                before: "Just a short walk to local shopping and dining.",
                after: "Just a short distance to local shopping and dining.",
                why: "Proximity language implying mobility can be interpreted as exclusionary toward buyers with mobility impairments. A frequent FHA red flag.",
              },
              {
                category: "Fair Housing · Neighborhood guide",
                before: "An exclusive club environment known for its sophisticated atmosphere.",
                after: "A sophisticated club environment known for its refined dining and amenities.",
                why: "'Exclusive' has historically been used as a proxy for steering. Even when innocent, the word triggers compliance review.",
              },
            ].map(({ category, before, after, why }, i) => (
              <div
                key={i}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: "14px",
                  padding: "24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: C.goldDeep }}>
                  {category}
                </div>

                <div className="catch-row">
                  <div className="catch-cell" style={{ background: "rgba(201,123,92,0.06)", borderColor: "rgba(201,123,92,0.20)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <AlertTriangle className="h-3.5 w-3.5" style={{ color: C.warn, flexShrink: 0 }} strokeWidth={2.5} />
                      <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: C.warn, fontWeight: 600 }}>
                        Original
                      </span>
                    </div>
                    <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: C.ink, fontStyle: "italic" }}>
                      &ldquo;{before}&rdquo;
                    </p>
                  </div>

                  <div className="catch-cell" style={{ background: "rgba(92,138,110,0.06)", borderColor: "rgba(92,138,110,0.20)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <CheckCircle2 className="h-3.5 w-3.5" style={{ color: C.pass, flexShrink: 0 }} strokeWidth={2.5} />
                      <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: C.pass, fontWeight: 600 }}>
                        Revised
                      </span>
                    </div>
                    <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: C.ink, fontStyle: "italic" }}>
                      &ldquo;{after}&rdquo;
                    </p>
                  </div>
                </div>

                <div style={{ paddingTop: "14px", borderTop: `1px solid ${C.border}`, fontSize: "13px", lineHeight: 1.6, color: C.inkSoft }}>
                  <span style={{ fontWeight: 500, color: C.ink }}>Why:</span> {why}
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .catch-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .catch-cell {
            border: 1px solid;
            border-radius: 10px;
            padding: 14px 16px;
          }
          @media (min-width: 640px) {
            .catch-row { grid-template-columns: 1fr 1fr; gap: 14px; }
          }
        `}</style>
      </section>

      {/* ── TWO-LAYER STORY — soft claims ── */}
      <section style={{ background: C.forestDeep, padding: "96px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(184,153,104,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(184,153,104,0.06) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
        <div className={CONTENT} style={{ position: "relative" }}>
          <div style={{ maxWidth: "720px", marginBottom: "56px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.goldSoft, marginBottom: "16px" }}>
              <span style={{ display: "inline-block", height: "1px", width: "18px", background: C.goldSoft }} />
              How the review works
            </div>
            <h2 style={{ ...sectionHeadline, color: C.creamWarm, marginBottom: "16px" }}>
              Two layers of review. <em style={{ fontStyle: "normal", color: C.gold }}>One workflow.</em>
            </h2>
            <p style={{ ...sectionSub, color: C.creamText }}>
              Compliance isn&apos;t a post-process for Metes. It&apos;s built into how every word gets written.
            </p>
          </div>

          <div className="layers-grid">
            <div style={{ background: "rgba(244,240,232,0.04)", border: `1px solid ${C.borderDark}`, borderRadius: "14px", padding: "32px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "10px", letterSpacing: "0.14em", color: C.goldSoft, fontWeight: 600 }}>
                  LAYER 01
                </div>
              </div>
              <h3 style={{ fontFamily: "var(--font-manrope, sans-serif)", fontSize: "22px", fontWeight: 500, color: C.creamWarm, marginBottom: "12px", letterSpacing: "-0.005em", lineHeight: 1.2 }}>
                Designed to avoid discriminatory language from the start.
              </h3>
              <p style={{ fontSize: "14px", lineHeight: 1.65, color: C.creamText }}>
                When Metes generates your MLS description, social posts, and emails, it&apos;s designed to avoid the categories of language that trigger Fair Housing violations — protected-class implications, steering terms, mobility-restrictive phrasing. The goal is copy that&apos;s already compliant when it reaches the audit.
              </p>
            </div>

            <div style={{ background: "rgba(244,240,232,0.04)", border: `1px solid ${C.borderDark}`, borderRadius: "14px", padding: "32px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "10px", letterSpacing: "0.14em", color: C.goldSoft, fontWeight: 600 }}>
                  LAYER 02
                </div>
              </div>
              <h3 style={{ fontFamily: "var(--font-manrope, sans-serif)", fontSize: "22px", fontWeight: 500, color: C.creamWarm, marginBottom: "12px", letterSpacing: "-0.005em", lineHeight: 1.2 }}>
                Independent audit on every asset before delivery.
              </h3>
              <p style={{ fontSize: "14px", lineHeight: 1.65, color: C.creamText }}>
                Every output — MLS copy, captions, posts, emails, headlines, neighborhood content — is then reviewed by an independent audit pass against Fair Housing guidelines and truth-in-advertising standards. Anything that needs revision gets caught and revised before your listing kit is delivered.
              </p>
            </div>
          </div>

          <p style={{ marginTop: "40px", fontSize: "12.5px", color: C.creamMuted, fontFamily: "var(--font-jetbrains, monospace)", letterSpacing: "0.04em", maxWidth: "720px" }}>
            Every listing kit ships with a complete audit report — per-asset notes on what was reviewed, what passed, and what was revised. You see the work.
          </p>
        </div>

        <style>{`
          .layers-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }
          @media (min-width: 768px) {
            .layers-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
          }
        `}</style>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: C.cream, padding: "96px 0" }}>
        <div className={CONTENT}>
          <div style={{ maxWidth: "720px", marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.goldDeep, marginBottom: "16px" }}>
              <span style={{ display: "inline-block", height: "1px", width: "18px", background: C.goldDeep }} />
              Common questions
            </div>
            <h2 style={{ ...sectionHeadline, marginBottom: "16px" }}>
              What agents ask about <em style={{ fontStyle: "normal", color: C.goldDeep }}>the audit</em>.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "880px" }}>
            {[
              {
                q: "What is Fair Housing in real estate advertising?",
                a: "The Fair Housing Act prohibits advertising that indicates a preference, limitation, or discrimination based on race, color, religion, sex, handicap, familial status, or national origin. In practice, this catches a lot of well-intentioned listing copy — phrases like 'family-friendly,' 'walking distance,' 'exclusive neighborhood,' or 'great for empty nesters' can all trigger violations. Fines start at $16,000 per first offense.",
              },
              {
                q: "What's the difference between Fair Housing and truth-in-advertising?",
                a: "Fair Housing focuses on protected-class language — anything that could imply discrimination or exclusion. Truth-in-advertising is broader and covers misleading claims about the property itself, like 'lowest taxes in the county' or 'zero maintenance' or 'lakefront' when the property is two streets from the water. Metes audits for both because both can cost an agent their license.",
              },
              {
                q: "Can ChatGPT write Fair Housing compliant listing copy?",
                a: "Sometimes, depending on how it's prompted. The problem isn't whether the model can produce compliant copy in theory — it's that there's no review layer to catch the times it doesn't. Most agents won't notice when ChatGPT writes 'perfect for a young family' or 'walking distance' until after the listing is published. Metes is designed to avoid those phrases at generation time and then audits every output as a second pass.",
              },
              {
                q: "Is your audit a substitute for legal review?",
                a: "No. Metes is a marketing tool, not a law firm. The audit catches the most common Fair Housing and truth-in-advertising issues in real estate listing copy and gives you a written report you can review with your broker. For high-stakes legal questions, talk to a Fair Housing attorney or your brokerage's compliance officer.",
              },
              {
                q: "What happens if the audit flags my listing copy?",
                a: "Flagged items are revised automatically and the revision ships in your listing kit. The audit report shows you the original phrase, the revised version, and the reason for the change. You're not left with a problem to solve — you're handed a compliant version with the rationale documented. Nothing in your kit ever ships with a known violation.",
              },
              {
                q: "How does the free Fair Housing Checker compare to the full audit?",
                a: "The free checker is a single-purpose tool for scanning one piece of text you paste in — most agents use it to check an existing MLS description they've already written. The full audit runs automatically on every asset Metes generates: MLS copy, social posts, all four campaign emails, photo captions, neighborhood content, and headlines. Same compliance standards, broader coverage.",
              },
            ].map(({ q, a }, i) => (
              <details
                key={i}
                style={{
                  borderRadius: "12px",
                  border: `1px solid ${C.border}`,
                  background: C.bgCard,
                  padding: "20px 24px",
                }}
              >
                <summary style={{
                  fontFamily: "var(--font-manrope, sans-serif)",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: C.ink,
                  cursor: "pointer",
                  listStyle: "none",
                  letterSpacing: "-0.005em",
                }}>
                  {q}
                </summary>
                <div style={{ marginTop: "14px", fontSize: "14px", lineHeight: 1.65, color: C.inkSoft }}>
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: C.forestDeep, padding: "96px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(184,153,104,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(184,153,104,0.06) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
        <div className={CONTENT} style={{ position: "relative" }}>
          <div style={{ maxWidth: "720px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.goldSoft, marginBottom: "16px" }}>
              <span style={{ display: "inline-block", height: "1px", width: "18px", background: C.goldSoft }} />
              Every listing kit. Every asset.
            </div>
            <h2 style={{ ...sectionHeadline, color: C.creamWarm, marginBottom: "20px" }}>
              The audit ships with <em style={{ fontStyle: "normal", color: C.gold }}>every $35 listing</em>.
            </h2>
            <p style={{ ...sectionSub, color: C.creamText, marginBottom: "32px", maxWidth: "600px" }}>
              No add-on, no upgrade. Compliance & truth-in-advertising review is standard in every Metes package — alongside MLS copy, social posts, email campaigns, sorted photos, and the neighborhood guide.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: C.gold,
                  color: C.forestDeep,
                  fontFamily: "var(--font-manrope, sans-serif)",
                  fontSize: "14px",
                  fontWeight: 500,
                  padding: "14px 28px",
                  borderRadius: "9px",
                  textDecoration: "none",
                }}
              >
                Generate your listing kit — $35
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/tools/fha-compliance-checker"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "transparent",
                  border: `1px solid ${C.borderDark}`,
                  color: C.creamWarm,
                  fontFamily: "var(--font-manrope, sans-serif)",
                  fontSize: "14px",
                  fontWeight: 500,
                  padding: "14px 28px",
                  borderRadius: "9px",
                  textDecoration: "none",
                }}
              >
                Try the free Fair Housing checker
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}