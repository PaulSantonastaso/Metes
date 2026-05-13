"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

type ScanStatus =
  | "idle"
  | "loading"
  | "passed"
  | "flagged"
  | "email_gate"
  | "error";

interface ComplianceResult {
  status: "pass" | "revised" | "flagged";
  issues_found: string[];
  compliant_text: string;
  reviewer_notes: string | null;
}

// ─────────────────────────────────────────────────────────────────
// Static content
// ─────────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    step: "STEP 01",
    title: "Paste your draft",
    body: "Drop your rough notes or current MLS description into the scanner above.",
  },
  {
    step: "STEP 02",
    title: "Instant risk analysis",
    body: "Our AI cross-references your text against established Fair Housing guidelines and known exclusionary terms.",
  },
  {
    step: "STEP 03",
    title: "Clear results",
    body: "We highlight the exact phrases that put you at risk and explain why — so you can rewrite with confidence.",
  },
];

const FHA_CATEGORIES = [
  {
    title: "Familial status & age",
    intro:
      "HUD aggressively prosecutes ads that imply a property is suited only for certain types of families or age groups.",
    items: [
      {
        num: 1,
        phrase: '"Family-friendly" or "great for families"',
        risk: "Excludes single buyers, couples without children, or retirees.",
        safe: '"Spacious layout with multiple living areas" or "multi-level home with a large fenced yard."',
      },
      {
        num: 2,
        phrase: '"Empty nesters" or "perfect for retirees"',
        risk: "Discriminates against younger buyers or families with children. Exceptions exist only for legally registered 55+ communities.",
        safe: '"Low-maintenance, single-story living."',
      },
      {
        num: 3,
        phrase: '"Bachelor pad"',
        risk: "Discriminates based on sex and familial status.",
        safe: '"Modern, open-concept condo."',
      },
      {
        num: 4,
        phrase: '"Mother-in-law suite"',
        risk: "Some MLS boards flag this as implying a specific familial arrangement.",
        safe: '"Accessory Dwelling Unit (ADU)," "guest suite," or "separate living quarters."',
      },
    ],
  },
  {
    title: "Disability & mobility",
    intro: "Describe the property, not the physical capabilities of the buyer.",
    items: [
      {
        num: 5,
        phrase: '"Walking distance to..."',
        risk: "Discriminates against individuals with mobility impairments. One of the most common accidental violations.",
        safe: '"Two blocks from..." or "a short distance to..."',
      },
      {
        num: 6,
        phrase: '"Perfect for an active lifestyle"',
        risk: "Implies the neighborhood excludes those with physical handicaps.",
        safe: '"Located near trailheads and tennis courts."',
      },
    ],
  },
  {
    title: "Race, national origin, religion",
    intro:
      "Never use language that implies a neighborhood has a specific demographic makeup.",
    items: [
      {
        num: 7,
        phrase: '"Exclusive neighborhood"',
        risk: "Historically used as a proxy for racial or economic steering.",
        safe: '"Private, gated community" or "secluded cul-de-sac."',
      },
      {
        num: 8,
        phrase: '"Safe streets" or "low-crime area"',
        risk: "Often interpreted as coded language for steering buyers toward or away from certain demographic areas.",
        safe: '"Dead-end street," "neighborhood watch program," or "fenced perimeter."',
      },
      {
        num: 9,
        phrase: '"Near the Catholic Church" or "walking distance to the synagogue"',
        risk: "Shows a preference for a specific religion.",
        safe: "Don't mention religious institutions as amenities.",
      },
      {
        num: 10,
        phrase: '"Traditional community"',
        risk: "Often flagged as implying a preference for a specific race or national origin.",
        safe: 'Describe the architecture: "Classic Colonial-style homes."',
      },
    ],
  },
  {
    title: "Sex and gender",
    intro: "Language that assumes the gender or relationship status of the buyer.",
    items: [
      {
        num: 11,
        phrase: '"His and hers closets"',
        risk: "Assumes a heterosexual couple will purchase the home.",
        safe: '"Dual walk-in closets" or "primary suite with two large closets."',
      },
      {
        num: 12,
        phrase: '"Handyman\'s dream"',
        risk: "Gender-biased language implying only men do renovations.",
        safe: '"Fixer-upper," "great investment potential," or "ready for your personal touch."',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// Reusable subcomponents
// ─────────────────────────────────────────────────────────────────

function SectionLabel({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div
      className={`mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] ${
        light ? "text-[#D9C49C]" : "text-[#9A7E50]"
      }`}
    >
      <span
        className={`inline-block h-px w-[18px] ${
          light ? "bg-[#D9C49C]" : "bg-[#9A7E50]"
        }`}
      />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────

export function ComplianceCheckClient() {
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [runsUsed, setRunsUsed] = useState(0);

  const handleScan = async (overrideEmail?: string) => {
    if (!text.trim() || scanStatus === "loading") return;
    setScanStatus("loading");
    setResult(null);
    setErrorMsg(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tools/compliance-check`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            email: overrideEmail || email || null,
          }),
        }
      );

      if (res.status === 402) {
        const data = await res.json();
        setRunsUsed(data.detail?.runs_used ?? 3);
        setScanStatus("email_gate");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(
          data.detail === "not_real_estate_content"
            ? "This doesn't look like a real estate listing. Paste an MLS description or property draft."
            : "Something went wrong. Please try again."
        );
        setScanStatus("error");
        return;
      }

      const data: ComplianceResult = await res.json();
      setResult(data);
      setScanStatus(data.status === "pass" ? "passed" : "flagged");
    } catch {
      setErrorMsg(
        "Could not reach the server. Check your connection and try again."
      );
      setScanStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#EFEAE0]">
      <Header />

      {/* ─────────────── HERO + SCANNER ─────────────── */}
      <section className="border-b border-[rgba(20,39,30,0.10)] bg-[#F4F0E8]">
        <div className="mx-auto w-full max-w-[960px] px-6 py-16 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[720px]">
            <SectionLabel>Free tool · Fair Housing compliance</SectionLabel>

            <h1 className="mb-4 font-manrope text-[clamp(28px,4.5vw,48px)] font-medium leading-[1.08] tracking-[0.005em] text-[#14271E]">
              Your listing might be a Fair Housing violation.
            </h1>

            <p className="mb-8 max-w-[600px] text-[clamp(14px,1.2vw,17px)] leading-[1.6] text-[#4A6B53]">
              Paste your draft below for an instant compliance audit. We&apos;ll flag the language that puts your license at risk — and tell you what to write instead.
            </p>

            {/* Scanner */}
            <div className="overflow-hidden rounded-[14px] border border-[rgba(20,39,30,0.18)] bg-[#FAF7F0] shadow-[0_4px_24px_rgba(20,39,30,0.06)]">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your MLS description or rough notes here..."
                disabled={scanStatus === "loading"}
                className="block w-full resize-none border-0 bg-transparent px-6 py-5 font-manrope text-[14px] leading-[1.6] text-[#14271E] outline-none placeholder:text-[rgba(20,39,30,0.45)]"
                style={{ minHeight: "160px" }}
              />
              <div className="flex items-center justify-between border-t border-[rgba(20,39,30,0.10)] bg-[rgba(20,39,30,0.02)] px-4 py-3">
                <span className="font-mono text-[11px] text-[rgba(20,39,30,0.55)]">
                  {text.length} / 2000 characters
                </span>
                <button
                  onClick={() => handleScan()}
                  disabled={
                    !text.trim() ||
                    text.length > 2000 ||
                    scanStatus === "loading"
                  }
                  className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-manrope text-[13px] font-medium text-[#F4F0E8] transition-opacity ${
                    !text.trim() ||
                    text.length > 2000 ||
                    scanStatus === "loading"
                      ? "cursor-not-allowed bg-[#4A6B53] opacity-50"
                      : "bg-[#1F3D2E] hover:opacity-90"
                  }`}
                >
                  {scanStatus === "loading" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Scanning…
                    </>
                  ) : (
                    <>
                      Scan for FHA risks
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── RESULT ─────────────── */}
      {scanStatus !== "idle" && scanStatus !== "loading" && (
        <section className="border-b border-[rgba(20,39,30,0.10)] bg-[#EFEAE0] py-12 sm:py-16">
          <div className="mx-auto w-full max-w-[960px] px-6 lg:px-8">
            <div className="mx-auto max-w-[720px]">
              {/* Email gate */}
              {scanStatus === "email_gate" && (
                <div className="rounded-[14px] border border-[rgba(20,39,30,0.18)] bg-[#FAF7F0] p-8">
                  <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9A7E50]">
                    Free scans used
                  </p>
                  <h2 className="mb-2 font-manrope text-[22px] font-medium text-[#14271E]">
                    You&apos;ve used your {runsUsed} free scans.
                  </h2>
                  <p className="mb-6 text-[14px] leading-[1.6] text-[#4A6B53]">
                    Drop your email to keep scanning — no subscription, no spam.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleScan(email)}
                      className="min-w-[200px] flex-1 rounded-lg border border-[rgba(20,39,30,0.18)] bg-[#F4F0E8] px-3.5 py-2.5 font-manrope text-[13px] text-[#14271E] outline-none"
                    />
                    <button
                      onClick={() => handleScan(email)}
                      disabled={!email.trim()}
                      className={`inline-flex items-center gap-2 rounded-lg bg-[#1F3D2E] px-5 py-2.5 font-manrope text-[13px] font-medium text-[#F4F0E8] ${
                        !email.trim()
                          ? "cursor-not-allowed opacity-50"
                          : "hover:opacity-90"
                      }`}
                    >
                      Continue scanning
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Error */}
              {scanStatus === "error" && (
                <div className="rounded-[14px] border border-[#C97B5C] bg-[rgba(201,123,92,0.08)] px-7 py-6">
                  <p className="text-[14px] font-medium text-[#C97B5C]">
                    {errorMsg}
                  </p>
                </div>
              )}

              {/* Flagged */}
              {scanStatus === "flagged" && result && (
                <div className="rounded-[14px] border border-[#C97B5C] bg-[rgba(201,123,92,0.08)] px-8 py-7">
                  <div className="mb-4 flex items-center gap-2.5">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-[#C97B5C]" />
                    <h2 className="font-manrope text-[20px] font-medium text-[#14271E]">
                      Risks detected.
                    </h2>
                  </div>

                  {result.issues_found.length > 0 && (
                    <div className="mb-5">
                      <p className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#C97B5C]">
                        Issues found
                      </p>
                      <ul className="flex flex-col gap-1.5">
                        {result.issues_found.map((issue, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[13px] leading-[1.5] text-[#14271E]"
                          >
                            <span className="shrink-0 text-[#C97B5C]">⚠</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.reviewer_notes && (
                    <p className="mb-5 text-[13px] italic leading-[1.6] text-[#4A6B53]">
                      {result.reviewer_notes}
                    </p>
                  )}

                  <div className="border-t border-[rgba(201,123,92,0.2)] pt-5">
                    <p className="mb-4 text-[14px] leading-[1.6] text-[#14271E]">
                      Don&apos;t risk a rejected listing or a complaint. For $35, metes rewrites this from scratch — fully compliant MLS copy, social posts, email sequence, and a sorted photo set.
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 rounded-[9px] bg-[#1F3D2E] px-6 py-3 font-manrope text-[13px] font-medium text-[#F4F0E8] no-underline hover:opacity-90"
                    >
                      Generate a compliant listing kit — $35
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Passed */}
              {scanStatus === "passed" && result && (
                <div className="rounded-[14px] border border-[#5C8A6E] bg-[rgba(92,138,110,0.08)] px-8 py-7">
                  <div className="mb-4 flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#5C8A6E]" />
                    <h2 className="font-manrope text-[20px] font-medium text-[#14271E]">
                      No FHA risks detected.
                    </h2>
                  </div>

                  {result.reviewer_notes && (
                    <p className="mb-5 text-[13px] italic leading-[1.6] text-[#4A6B53]">
                      {result.reviewer_notes}
                    </p>
                  )}

                  <div className="border-t border-[rgba(92,138,110,0.2)] pt-5">
                    <p className="mb-4 text-[14px] leading-[1.6] text-[#14271E]">
                      Your copy is legally safe. But is it doing the work? metes turns this draft into a full marketing kit — MLS, social, email, and sorted photos — in under 60 seconds.
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 rounded-[9px] bg-[#1F3D2E] px-6 py-3 font-manrope text-[13px] font-medium text-[#F4F0E8] no-underline hover:opacity-90"
                    >
                      Upgrade to the full kit — $35
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────── THE STAKES — DARK FOREST ─────────────── */}
      <section className="relative overflow-hidden bg-[#1F3D2E] py-20 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(184,153,104,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(184,153,104,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto w-full max-w-[960px] px-6 lg:px-8">
          <div className="max-w-[720px]">
            <SectionLabel light>The stakes</SectionLabel>
            <h2 className="mb-5 font-manrope text-[clamp(24px,3.5vw,40px)] font-medium leading-[1.15] tracking-[0.005em] text-[#F4F0E8]">
              The $16,000 mistake you didn&apos;t know you were making.
            </h2>
            <div className="space-y-4 text-[clamp(14px,1.2vw,16px)] leading-[1.7] text-[rgba(244,240,232,0.78)]">
              <p>
                &ldquo;Perfect for a young family.&rdquo; &ldquo;Walking distance to the park.&rdquo; &ldquo;Quiet, traditional neighborhood.&rdquo; They sound like good marketing. To HUD, they&apos;re Fair Housing violations.
              </p>
              <p>
                A single flagged phrase can cost you a rejected MLS listing, a suspended ad account, or a discrimination complaint that ends in fines starting at{" "}
                <strong className="font-semibold text-[#F4F0E8]">
                  $16,000 for a first offense
                </strong>
                . You don&apos;t have time to memorize the rulebook between showings.
              </p>
              <p className="text-[#F4F0E8]">
                Let metes do it for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── HOW IT WORKS — CREAM ─────────────── */}
      <section className="bg-[#EFEAE0] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[960px] px-6 lg:px-8">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mb-12 max-w-[640px] font-manrope text-[clamp(24px,3.5vw,40px)] font-medium leading-[1.15] tracking-[0.005em] text-[#14271E]">
            Three seconds to peace of mind.
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {HOW_IT_WORKS.map(({ step, title, body }) => (
              <div
                key={step}
                className="rounded-[12px] border border-[rgba(20,39,30,0.10)] bg-[#FAF7F0] p-6"
              >
                <div className="mb-3.5 font-mono text-[11px] tracking-[0.08em] text-[#9A7E50]">
                  {step}
                </div>
                <div className="mb-2 font-manrope text-[15px] font-medium text-[#14271E]">
                  {title}
                </div>
                <div className="text-[13px] leading-[1.6] text-[#4A6B53]">
                  {body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── BOTTOM CTA — DARK FOREST ─────────────── */}
      <section className="relative overflow-hidden bg-[#14271E] py-20 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(184,153,104,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(184,153,104,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto w-full max-w-[960px] px-6 lg:px-8">
          <div className="max-w-[680px]">
            <SectionLabel light>Skip the audit</SectionLabel>
            <h2 className="mb-4 font-manrope text-[clamp(26px,4vw,44px)] font-medium leading-[1.1] tracking-[0.005em] text-[#F4F0E8]">
              Or just have metes write it from scratch.
            </h2>
            <p className="mb-8 text-[clamp(14px,1.2vw,17px)] leading-[1.6] text-[rgba(244,240,232,0.78)]">
              Compliant by default. Lifestyle-forward, never utility-forward. MLS description, social launch pack, four-email sequence, and your top photos — sorted, renamed, ready to upload. $35 per listing. No subscription.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-[9px] bg-[#B89968] px-7 py-3.5 font-manrope text-[14px] font-medium text-[#14271E] no-underline transition-colors hover:bg-[#9A7E50] hover:text-[#F4F0E8]"
              >
                Generate your listing kit — $35
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-2 rounded-[9px] border border-[rgba(244,240,232,0.3)] bg-transparent px-7 py-3.5 font-manrope text-[14px] font-medium text-[#F4F0E8] hover:border-[rgba(244,240,232,0.6)]"
              >
                Scan another draft
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── FHA REFERENCE GUIDE — CREAM ─────────────── */}
      <section className="bg-[#EFEAE0] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[960px] px-6 lg:px-8">
          <div className="mx-auto max-w-[820px]">
            <SectionLabel>Reference guide</SectionLabel>
            <h2 className="mb-4 font-manrope text-[clamp(24px,3.5vw,40px)] font-medium leading-[1.15] tracking-[0.005em] text-[#14271E]">
              Twelve phrases to never use in a listing.
            </h2>
            <p className="mb-12 text-[clamp(14px,1.2vw,16px)] leading-[1.7] text-[#4A6B53]">
              HUD prohibits advertising that indicates any preference, limitation, or discrimination based on race, color, religion, sex, handicap, familial status, or national origin. Most violations are accidents. These are the most common ones.
            </p>

            <div className="flex flex-col gap-12">
              {FHA_CATEGORIES.map((category, ci) => (
                <div key={ci}>
                  <h3 className="mb-2 font-manrope text-[19px] font-medium tracking-[0.005em] text-[#14271E]">
                    {category.title}
                  </h3>
                  <p className="mb-6 text-[14px] leading-[1.6] text-[#4A6B53]">
                    {category.intro}
                  </p>
                  <div className="flex flex-col gap-3">
                    {category.items.map((item) => (
                      <div
                        key={item.num}
                        className="rounded-[12px] border border-[rgba(20,39,30,0.10)] bg-[#FAF7F0] p-5 sm:p-6"
                      >
                        <p className="mb-3 font-mono text-[12px] font-semibold text-[#14271E]">
                          {item.num}. {item.phrase}
                        </p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <div className="rounded-lg bg-[rgba(201,123,92,0.08)] px-3.5 py-3">
                            <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#C97B5C]">
                              The risk
                            </p>
                            <p className="text-[12px] leading-[1.55] text-[#14271E]">
                              {item.risk}
                            </p>
                          </div>
                          <div className="rounded-lg bg-[rgba(92,138,110,0.08)] px-3.5 py-3">
                            <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#5C8A6E]">
                              Safe alternative
                            </p>
                            <p className="text-[12px] leading-[1.55] text-[#14271E]">
                              {item.safe}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}