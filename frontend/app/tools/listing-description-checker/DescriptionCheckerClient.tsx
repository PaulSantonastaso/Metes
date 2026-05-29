"use client";

import { useState, useEffect, useRef } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import Link from "next/link";
import {
  Loader2, ArrowRight, FileText, CheckCircle2, AlertTriangle, AlertCircle,
  ChevronDown, ChevronUp, Sparkles, ShieldCheck, Wand2, Type, Ruler, Quote,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

type ToolStatus = "idle" | "loading" | "success" | "email_gate" | "error";
type CriterionState = "strong" | "needs_work" | "critical";

interface CriterionReport {
  state: CriterionState;
  summary: string;
  issues: string[];
  suggestion: string;
}

interface Diagnostic {
  opening_hook: CriterionReport;
  specific_language: CriterionReport;
  ai_tells: CriterionReport;
  sensory_lifestyle: CriterionReport;
  neighborhood_context: CriterionReport;
  length_structure: CriterionReport;
  closing: CriterionReport;
}

interface DiagnosticResult {
  diagnostic: Diagnostic;
  char_count: number;
  runs_used: number;
  email_on_file: boolean;
}

const CRITERIA_ORDER: { key: keyof Diagnostic; label: string }[] = [
  { key: "opening_hook", label: "Opening hook" },
  { key: "specific_language", label: "Specific vs. generic language" },
  { key: "ai_tells", label: "AI / ChatGPT tells" },
  { key: "sensory_lifestyle", label: "Sensory & lifestyle language" },
  { key: "neighborhood_context", label: "Neighborhood context" },
  { key: "length_structure", label: "Length & structure" },
  { key: "closing", label: "Closing" },
];

// ─────────────────────────────────────────────────────────────────
// Static content
// ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Wand2,
    title: "7-criterion diagnostic",
    desc: "Every scan evaluates hook, specific language, AI tells, sensory writing, neighborhood context, length, and closing.",
  },
  {
    icon: Sparkles,
    title: "Catches AI tells",
    desc: "Flags the modern ChatGPT patterns buyers learn to spot — 'delve,' 'tapestry,' em-dash pairs, 'whether you're X or Y.'",
  },
  {
    icon: ShieldCheck,
    title: "Fair Housing-aware",
    desc: "Identifies coded buyer-persona language and demographic implications. Pairs with our dedicated FHA checker.",
  },
  {
    icon: Type,
    title: "Cliché detection",
    desc: "'Stunning,' 'meticulously maintained,' 'must-see' — flagged with specific suggestions to replace them.",
  },
  {
    icon: Ruler,
    title: "MLS length check",
    desc: "Compares against the 800–950 character sweet spot. Catches over-cap risk before MLS rejection.",
  },
  {
    icon: Quote,
    title: "Concrete suggestions",
    desc: "Each criterion returns specific issues with the exact phrases from your description, plus actionable suggestions.",
  },
];

const SCHEMA_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Listing Description Checker",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Any",
      "url": "https://www.metes.app/tools/listing-description-checker",
      "description": "Free AI-powered tool that evaluates MLS listing descriptions against seven craft criteria: opening hook, specific vs. generic language, AI/ChatGPT tells, sensory and lifestyle language, neighborhood context, length and structure, and closing.",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "provider": {
        "@type": "Organization",
        "name": "metes",
        "url": "https://www.metes.app",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How long should an MLS description be?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The sweet spot is 800 to 950 characters. Most major MLS boards cap public remarks at 950 characters, which means descriptions that exceed that limit either get rejected or truncated mid-sentence on the public listing.",
          },
        },
        {
          "@type": "Question",
          "name": "What's the MLS character limit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It varies by board. Stellar MLS, RMLS, and many other major boards cap at 950 characters. Some boards allow 1,500. The safe target across most markets is to write to 880 characters with a 70-character buffer.",
          },
        },
        {
          "@type": "Question",
          "name": "How do I make my listing description sound less like ChatGPT?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cut words that appear in LLM training data far more often than in human writing — delve, tapestry, embark, captivating, elegant — and the phrases that have become AI signatures: 'more than just,' 'in today's market,' 'whether you're X or Y,' 'the perfect blend of.' Replace em-dash pairs with periods.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I use AI to write listing descriptions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, but plan to edit. AI-generated drafts are useful starting points but tend to lean heavily on a small set of statistically over-represented words and patterns. Run the draft through a checker, replace the flagged language with specific details, and the result will read human.",
          },
        },
        {
          "@type": "Question",
          "name": "What words should I avoid in listing descriptions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Stunning, meticulously maintained, boasts, showcases, charming, nestled, must-see, dream home, immaculate, exquisite, tranquil oasis. Also avoid 'perfect for' plus any buyer type because these phrases can trigger Fair Housing violations.",
          },
        },
        {
          "@type": "Question",
          "name": "Should I mention the neighborhood by name?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, and ideally with specific named places. 'Great location' tells the buyer nothing. Specific named places signal that the agent knows the area and that the location actually delivers what the price promises.",
          },
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────
// SectionLabel
// ─────────────────────────────────────────────────────────────────

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] ${light ? "text-[#D9C49C]" : "text-[#9A7E50]"}`}>
      <span className={`inline-block h-px w-[18px] ${light ? "bg-[#D9C49C]" : "bg-[#9A7E50]"}`} />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Client component
// ─────────────────────────────────────────────────────────────────

export function DescriptionCheckerClient() {
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<ToolStatus>("idle");
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [runsUsed, setRunsUsed] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status === "success" || status === "error" || status === "email_gate") {
      const t = setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handleScan = async (overrideEmail?: string) => {
    if (!description.trim() || status === "loading") return;
    setStatus("loading");
    setResult(null);
    setErrorMsg(null);
    setExpandedRows(new Set());

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/description-checker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          email: overrideEmail || email || null,
          cf_turnstile_response: turnstileToken,
        }),
      });

      if (res.status === 402) {
        const data = await res.json();
        setRunsUsed(data.detail?.runs_used ?? 3);
        setStatus("email_gate");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(
          data.detail === "input_too_long"
            ? "Description exceeds the 2000 character limit. Trim it down and try again."
            : "Something went wrong. Please try again in a moment."
        );
        setStatus("error");
        return;
      }

      const data: DiagnosticResult = await res.json();
      setResult(data);
      setStatus("success");
    } catch {
      setErrorMsg("Could not reach the server. Check your connection and try again.");
      setStatus("error");
    }
  };

  const toggleRow = (key: string) => {
    if (result && !result.email_on_file && result.runs_used >= 3) {
      setStatus("email_gate");
      return;
    }
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const stateIcon = (state: CriterionState) => {
    if (state === "strong") return <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5C8A6E]" />;
    if (state === "needs_work") return <AlertTriangle className="h-4 w-4 shrink-0 text-[#B89968]" />;
    return <AlertCircle className="h-4 w-4 shrink-0 text-[#C97B5C]" />;
  };

  const stateLabel = (state: CriterionState) => {
    if (state === "strong") return "Strong";
    if (state === "needs_work") return "Needs work";
    return "Critical";
  };

  const stateColor = (state: CriterionState) => {
    if (state === "strong") return "text-[#5C8A6E]";
    if (state === "needs_work") return "text-[#B89968]";
    return "text-[#C97B5C]";
  };

  const countByState = (diag: Diagnostic) => {
    const states = CRITERIA_ORDER.map((c) => diag[c.key].state);
    return {
      strong: states.filter((s) => s === "strong").length,
      needs_work: states.filter((s) => s === "needs_work").length,
      critical: states.filter((s) => s === "critical").length,
    };
  };

  return (
    <div className="min-h-screen bg-[#EFEAE0]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_JSON_LD) }}
      />
      <Header />

      {/* ─────────────── HERO + TOOL ─────────────── */}
      <section className="border-b border-[rgba(20,39,30,0.10)] bg-[#F4F0E8]">
        <div className="mx-auto w-full max-w-[960px] px-6 py-16 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[720px]">
            <SectionLabel>Free tool · Description checker</SectionLabel>

            <h1 className="mb-4 font-manrope text-[clamp(28px,4.5vw,48px)] font-medium leading-[1.08] tracking-[0.005em] text-[#14271E]">
              Catch the <em className="not-italic text-[#9A7E50]">AI tells, clichés, and weak hooks</em> in your MLS description.
            </h1>

            <p className="mb-8 max-w-[640px] text-[clamp(14px,1.2vw,17px)] leading-[1.6] text-[#4A6B53]">
              Paste your description. Get instant feedback across seven craft criteria — opening hook, specific language, AI tells, sensory writing, neighborhood context, length, and closing. Honest craft feedback, not a sales pitch.
            </p>

            {/* Input form */}
            <div className="overflow-hidden rounded-[14px] border border-[rgba(20,39,30,0.18)] bg-[#FAF7F0] shadow-[0_4px_24px_rgba(20,39,30,0.06)]">
              <div className="flex items-start gap-2.5 px-5 py-4">
                <FileText className="mt-1 h-4 w-4 shrink-0 text-[#9A7E50]" strokeWidth={2} />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste your MLS listing description here..."
                  disabled={status === "loading"}
                  maxLength={2000}
                  rows={8}
                  className="flex-1 resize-none border-0 bg-transparent font-manrope text-[15px] leading-[1.6] text-[#14271E] outline-none placeholder:text-[rgba(20,39,30,0.45)]"
                />
              </div>
              <div className="flex items-center justify-between border-t border-[rgba(20,39,30,0.10)] bg-[rgba(20,39,30,0.02)] px-4 py-3">
                <span className="font-mono text-[11px] text-[rgba(20,39,30,0.55)]">
                  {description.length} / 2000 characters
                </span>
                <button
                  onClick={() => handleScan()}
                  disabled={!description.trim() || description.length > 2000 || status === "loading" || !turnstileToken}
                  className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-manrope text-[13px] font-medium text-[#F4F0E8] transition-opacity ${
                    !description.trim() || description.length > 2000 || status === "loading" || !turnstileToken
                      ? "cursor-not-allowed bg-[#4A6B53] opacity-50"
                      : "bg-[#1F3D2E] hover:opacity-90"
                  }`}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      Check description
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="mt-3.5 font-mono text-[11px] text-[rgba(20,39,30,0.55)]">
              3 free scans · then drop your email to keep scanning · no subscription
            </p>

            <div className="mt-4 flex justify-start">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={setTurnstileToken}
                onError={() => setTurnstileToken("")}
                onExpire={() => setTurnstileToken("")}
                options={{ theme: "light", size: "normal" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── RESULT PANEL ─────────────── */}
      {status !== "idle" && status !== "loading" && (
        <section ref={resultRef} className="border-b border-[rgba(20,39,30,0.10)] bg-[#EFEAE0] py-12 sm:py-16 scroll-mt-20">
          <div className="mx-auto w-full max-w-[960px] px-6 lg:px-8">
            <div className="mx-auto max-w-[720px]">

              {/* Email gate */}
              {status === "email_gate" && (
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
                      disabled={!email.trim() || !turnstileToken}
                      className={`inline-flex items-center gap-2 rounded-lg bg-[#1F3D2E] px-5 py-2.5 font-manrope text-[13px] font-medium text-[#F4F0E8] ${
                        !email.trim() ? "cursor-not-allowed opacity-50" : "hover:opacity-90"
                      }`}
                    >
                      Continue scanning
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Error */}
              {status === "error" && (
                <div className="rounded-[14px] border border-[#C97B5C] bg-[rgba(201,123,92,0.08)] px-7 py-6">
                  <div className="mb-2 flex items-center gap-2.5">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-[#C97B5C]" />
                    <h3 className="font-manrope text-[16px] font-medium text-[#14271E]">
                      Couldn&apos;t check the description
                    </h3>
                  </div>
                  <p className="text-[14px] leading-[1.55] text-[#4A6B53]">
                    {errorMsg}
                  </p>
                </div>
              )}

              {/* Success — render diagnostic checklist */}
              {status === "success" && result && (
                <div className="rounded-[16px] border border-[rgba(20,39,30,0.18)] bg-[#FAF7F0] p-8">
                  <div className="mb-6">
                    <div className="mb-2 flex items-center gap-2.5">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#5C8A6E]" />
                      <h2 className="font-manrope text-[20px] font-medium text-[#14271E]">
                        Your description — {countByState(result.diagnostic).strong} strong, {countByState(result.diagnostic).needs_work + countByState(result.diagnostic).critical} to improve
                      </h2>
                    </div>
                    <p className="font-mono text-[11px] text-[rgba(20,39,30,0.55)]">
                      {result.char_count} characters analyzed · tap any row for details
                    </p>
                  </div>

                  <div className="divide-y divide-[rgba(20,39,30,0.10)] rounded-[10px] border border-[rgba(20,39,30,0.10)] bg-[#F4F0E8]">
                    {CRITERIA_ORDER.map((c) => {
                      const report = result.diagnostic[c.key];
                      const isExpanded = expandedRows.has(c.key);
                      return (
                        <div key={c.key}>
                          <button
                            onClick={() => toggleRow(c.key)}
                            className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[rgba(20,39,30,0.03)]"
                          >
                            <div className="flex items-center gap-3">
                              {stateIcon(report.state)}
                              <span className="font-manrope text-[14.5px] font-medium text-[#14271E]">
                                {c.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`font-mono text-[11px] uppercase tracking-[0.08em] ${stateColor(report.state)}`}>
                                {stateLabel(report.state)}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-[rgba(20,39,30,0.45)]" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-[rgba(20,39,30,0.45)]" />
                              )}
                            </div>
                          </button>
                          {isExpanded && (
                            <div className="border-t border-[rgba(20,39,30,0.10)] bg-[rgba(20,39,30,0.02)] px-5 py-4">
                              <p className="mb-3 text-[13.5px] leading-[1.6] text-[#14271E]">
                                {report.summary}
                              </p>
                              {report.issues.length > 0 && (
                                <ul className="mb-3 flex flex-col gap-1.5">
                                  {report.issues.map((issue, idx) => (
                                    <li key={idx} className="relative pl-3 text-[13px] leading-[1.55] text-[#14271E]">
                                      <span className="absolute left-0 text-[#B89968]">•</span>
                                      {issue}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <p className="text-[13px] italic leading-[1.55] text-[#4A6B53]">
                                {report.suggestion}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Inline upsell */}
                  <div className="mt-7 border-t border-[rgba(20,39,30,0.10)] pt-6">
                    <p className="mb-4 text-[13.5px] leading-[1.6] text-[#4A6B53]">
                      <strong className="font-semibold text-[#14271E]">Want descriptions like this generated for you?</strong>{" "}
                      A full Metes listing kit produces the MLS description, social posts, four-email campaign, photo curation, and compliance audit — all for $35 per listing.
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#1F3D2E] px-5 py-2.5 font-manrope text-[13px] font-medium text-[#F4F0E8] no-underline hover:opacity-90"
                    >
                      See what else Metes generates — $35
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────── FEATURE GRID — CREAM ─────────────── */}
      <section className="bg-[#EFEAE0] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-12">
          <div className="mb-12 max-w-[720px]">
            <SectionLabel>What this tool catches</SectionLabel>
            <h2 className="mb-4 font-manrope text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] tracking-[0.005em] text-[#14271E]">
              Honest craft feedback — <em className="not-italic text-[#9A7E50]">not a generic AI detector</em>.
            </h2>
            <p className="text-[clamp(15px,1.3vw,17px)] leading-[1.6] text-[#4A6B53]">
              Most AI tools tell you what they wrote. This one tells you what's wrong with what you wrote — and how to fix it.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-3 lg:gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex min-w-0 flex-col gap-3 rounded-[12px] border border-[rgba(20,39,30,0.10)] bg-[#FAF7F0] p-6"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0 text-[#9A7E50]" strokeWidth={2} />
                  <h3 className="font-manrope text-[15px] font-semibold tracking-[-0.005em] text-[#14271E]">
                    {title}
                  </h3>
                </div>
                <p className="text-[13.5px] leading-[1.6] text-[#4A6B53]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── THE SEVEN ELEMENTS — DARK FOREST ─────────────── */}
      <section className="relative overflow-hidden bg-[#14271E] py-20 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(184,153,104,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(184,153,104,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto w-full max-w-[1280px] px-6 lg:px-12">
          <div className="mb-12 max-w-[720px]">
            <SectionLabel light>Seven elements</SectionLabel>
            <h2 className="mb-4 font-manrope text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] tracking-[0.005em] text-[#F4F0E8]">
              What makes a <em className="not-italic text-[#B89968]">listing description</em> that sells.
            </h2>
            <p className="text-[clamp(15px,1.3vw,17px)] leading-[1.6] text-[rgba(244,240,232,0.78)]">
              Most MLS descriptions read like spec sheets — the same handful of adjectives appear in roughly forty percent of active listings on any given Zillow page. The descriptions that sell do something different.
            </p>
          </div>

          <div className="flex max-w-[780px] flex-col">
            {[
              { name: "Opening hook", desc: "The first sentence decides whether the buyer reads the second. Strong openings lead with sensory movement, not greetings like 'Welcome to' or 'Discover.'" },
              { name: "Specific vs. generic language", desc: "Real estate has a small set of words that have lost all meaning. Stunning. Must-see. Meticulously maintained. Specific details create vivid mental images; generic adjectives create skepticism." },
              { name: "AI and ChatGPT tells", desc: "Buyers are getting good at spotting AI-generated text. Words like 'delve' and 'tapestry,' phrases like 'whether you're X or Y,' and em-dash pairs all signal AI authorship." },
              { name: "Sensory and lifestyle language", desc: "Buyers don't buy specifications. They buy a Saturday morning. Verbs of motion and lifestyle moments attach the home to an emotional outcome." },
              { name: "Neighborhood context", desc: "Half the value of any home is its location. 'Great location' tells the buyer nothing. Specific named places do the work that generic claims can't." },
              { name: "Length and structure", desc: "Most MLS boards cap public remarks at 950 characters. The sweet spot is 800–950. Under 600 reads as undersell; over 1,000 risks rejection or truncation." },
              { name: "The close", desc: "Most descriptions end with 'Don't miss this opportunity' — filler that signals the agent ran out of things to say. A strong close reinforces the property's single best feature." },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-3.5 py-4 ${i < 6 ? "border-b border-[rgba(244,240,232,0.12)]" : ""}`}
              >
                <span className="mt-0.5 min-w-[20px] shrink-0 font-mono text-[11px] font-semibold text-[#D9C49C]">
                  0{i + 1}
                </span>
                <div>
                  <div className="mb-1 font-manrope text-[14.5px] font-semibold text-[#F4F0E8]">
                    {item.name}
                  </div>
                  <div className="text-[13px] leading-[1.55] text-[rgba(244,240,232,0.78)]">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── BEFORE / AFTER — CREAM ─────────────── */}
      <section className="bg-[#EFEAE0] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-12">
          <div className="mb-12 max-w-[720px]">
            <SectionLabel>Before & after</SectionLabel>
            <h2 className="mb-4 font-manrope text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] tracking-[0.005em] text-[#14271E]">
              Same property, <em className="not-italic text-[#9A7E50]">sharper craft</em>.
            </h2>
            <p className="text-[clamp(15px,1.3vw,17px)] leading-[1.6] text-[#4A6B53]">
              Three real description rewrites showing the difference between generic and grounded. Same facts, same property — different reader experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3 md:gap-4">
            {[
              {
                location: "Logan Square · Chicago",
                type: "Urban condo",
                before: "Welcome to this stunning 2-bedroom condo in the heart of Logan Square! This beautiful unit features gorgeous hardwood floors, a meticulously maintained kitchen with stainless steel appliances, and a spacious primary bedroom. The location is fantastic, with easy access to shopping, dining, and public transportation.",
                after: "Sunday mornings at Logan Square Farmers Market are a four-minute walk from the front door. The kitchen handles real cooking — gas range, butcher-block island, deep pantry — and opens to a living room where the original 1912 hardwood floors run wall to wall. Pequod's, Kasama, and the Blue Line are within six blocks.",
              },
              {
                location: "Ladera · San Antonio",
                type: "Suburban new build",
                before: "Discover this captivating new construction home in the desirable Ladera community. This elegant residence boasts modern finishes throughout, including quartz countertops, stainless steel appliances, and beautiful wood-look tile flooring. Whether you're a growing family or a discerning professional, this home offers the perfect blend of comfort and style.",
                after: "Morning espresso at the quartz breakfast bar before sliding open the French doors to your private covered patio. This 2025 new construction features wood-look tile flooring, a five-burner gas cooktop, and a primary suite with a deep soaking tub. New construction with a metal roof means zero surprises — just move in.",
              },
              {
                location: "Willamette Heights · Portland",
                type: "Historic home",
                before: "Nestled in the highly sought-after Willamette Heights neighborhood, this charming 1928 Spanish Colonial Revival offers a rare opportunity to own a piece of Portland history. This stunning home boasts beautiful hardwood floors, period details throughout, and breathtaking mountain views.",
                after: "Morning coffee on the cedar deck with sweeping views of Mount St. Helens and Mount Rainier. This 1928 Spanish Colonial Revival in Willamette Heights keeps its period details intact — plaster walls, arched openings, cedar-lined closets — alongside a clay tile roof redone within the last ten years.",
              },
            ].map((ex, i) => (
              <article
                key={i}
                className="flex min-w-0 flex-col rounded-[12px] border border-[rgba(20,39,30,0.10)] bg-[#FAF7F0] p-5 sm:p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className="rounded font-mono text-[10px] uppercase tracking-[0.08em]"
                    style={{
                      color: "#1F3D2E",
                      backgroundColor: "rgba(31,61,46,0.08)",
                      padding: "4px 8px",
                    }}
                  >
                    {ex.type}
                  </span>
                  <span className="font-mono text-[11px] text-[rgba(20,39,30,0.55)]">
                    {ex.location}
                  </span>
                </div>

                <h3 className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#C97B5C]">
                  Before
                </h3>
                <p className="mb-4 text-[12.5px] leading-[1.6] text-[rgba(20,39,30,0.65)]">
                  {ex.before}
                </p>

                <div className="mt-auto border-t border-[rgba(20,39,30,0.10)] pt-4">
                  <h4 className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#5C8A6E]">
                    After
                  </h4>
                  <p className="text-[12.5px] leading-[1.6] text-[#14271E]">
                    {ex.after}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── FAQ — CREAM WARM ─────────────── */}
      <section className="border-t border-[rgba(20,39,30,0.10)] bg-[#F4F0E8] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-12">
          <div className="mb-12 max-w-[720px]">
            <SectionLabel>Common questions</SectionLabel>
            <h2 className="mb-4 font-manrope text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] tracking-[0.005em] text-[#14271E]">
              What agents ask about <em className="not-italic text-[#9A7E50]">listing descriptions</em>.
            </h2>
          </div>

          <div className="flex max-w-[880px] flex-col gap-4">
            {[
              {
                q: "How long should an MLS description be?",
                a: "The sweet spot is 800 to 950 characters. Most major MLS boards cap public remarks at 950 characters, which means descriptions that exceed that limit either get rejected or truncated mid-sentence. Under 600 characters reads as undersell; the buyer assumes the property got less effort than it deserved.",
              },
              {
                q: "What's the MLS character limit?",
                a: "It varies by board. Stellar MLS, RMLS, and many other major boards cap at 950 characters. Some boards allow 1,500. A few smaller boards go higher. The safe target across most markets is to write to 880 characters with a 70-character buffer.",
              },
              {
                q: "How do I make my listing description sound less like ChatGPT?",
                a: "Cut the words that appear in LLM training data far more often than in human writing — delve, tapestry, embark, captivating, elegant — and the phrases that have become AI signatures: 'more than just,' 'in today's market,' 'whether you're X or Y,' 'the perfect blend of.' Replace em-dash pairs with periods. Use concrete details instead of adjective stacks.",
              },
              {
                q: "Can I use AI to write listing descriptions?",
                a: "Yes, but plan to edit. AI-generated drafts are useful starting points but tend to lean heavily on a small set of statistically over-represented words and patterns. Run the draft through this checker, replace the flagged language with specific details, and the result will read human even though it started as a generated draft.",
              },
              {
                q: "What words should I avoid in listing descriptions?",
                a: (
                  <>
                    Stunning, meticulously maintained, boasts, showcases, charming, nestled, must-see, dream home, immaculate, exquisite, tranquil oasis. Also avoid &ldquo;perfect for&rdquo; plus any buyer type because these phrases can trigger Fair Housing violations. Run drafts through our{" "}
                    <Link href="/tools/fha-compliance-checker" className="text-[#1F3D2E] underline decoration-[#B89968]">
                      Fair Housing Compliance Checker
                    </Link>{" "}
                    to catch these specifically.
                  </>
                ),
              },
              {
                q: "Should I mention the neighborhood by name?",
                a: (
                  <>
                    Yes, and ideally with specific named places. &ldquo;Great location&rdquo; tells the buyer nothing. Specific named places signal that the agent knows the area and that the location actually delivers what the price promises. Generate one automatically with our{" "}
                    <Link href="/tools/neighborhood-guide-generator" className="text-[#1F3D2E] underline decoration-[#B89968]">
                      Neighborhood Guide Generator
                    </Link>.
                  </>
                ),
              },
              {
                q: "Is this tool free?",
                a: "Three scans per session are completely free. After that, an email unlocks unlimited deep feedback — no subscription, no sales calls. The tool is built by metes, which generates full real estate marketing kits for paid customers, but the checker is independently useful and free to use.",
              },
              {
                q: "Does this tool save my description?",
                a: "The description text isn't stored after the scan completes. The tool tracks usage by IP address and email (after the gate) for rate limiting purposes only.",
              },
            ].map(({ q, a }, i) => (
              <details
                key={i}
                className="rounded-[12px] border border-[rgba(20,39,30,0.10)] bg-[#FAF7F0] px-6 py-5"
              >
                <summary className="cursor-pointer list-none font-manrope text-[16px] font-medium tracking-[-0.005em] text-[#14271E]">
                  {q}
                </summary>
                <div className="mt-3.5 text-[14px] leading-[1.65] text-[#4A6B53]">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}