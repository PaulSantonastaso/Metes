"use client";

import { useState, useEffect, useRef } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import Link from "next/link";
import { Loader2, ArrowRight, MapPin, Copy, Check, CheckCircle2, AlertTriangle, Database, Layers, ShieldCheck, Compass, Sparkles, Quote } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

type ToolStatus = "idle" | "loading" | "success" | "email_gate" | "error";

interface NeighborhoodResult {
  address: string;
  neighborhood_guide: string;
  places: string[];
}

// ─────────────────────────────────────────────────────────────────
// Static content
// ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Database,
    title: "Live Google Places data",
    desc: "Every place mentioned is pulled at generation time using the property's address. Real, current, within a defined radius.",
  },
  {
    icon: Layers,
    title: "Multi-section dossier",
    desc: "Lifestyle summary plus categorical sections (everyday essentials, outdoor, dining, wellness) — copy the whole thing or pull what you need.",
  },
  {
    icon: ShieldCheck,
    title: "Fair Housing-aware",
    desc: "Built to avoid protected-class language and proximity terms that imply mobility. No 'walking distance,' no 'family-friendly.'",
  },
  {
    icon: Compass,
    title: "Category routing",
    desc: "Places get sorted into the right section — grocery into Everyday, bakeries into Dining, parks into Outdoor & Recreation.",
  },
  {
    icon: Quote,
    title: "MLS-ready paragraph",
    desc: "Lifestyle summary sized for MLS community fields and Zillow's What I Love About the Neighborhood section. Paste directly.",
  },
  {
    icon: Sparkles,
    title: "One generation, six uses",
    desc: "Drop the output into MLS, Zillow, Compass, Redfin, listing presentations, and relocation emails with no rewriting.",
  },
];

const USE_CASES = [
  { name: "MLS public remarks neighborhood section", desc: "The lifestyle summary fits the community or neighborhood field on most MLS boards — typically under the 500-character cap." },
  { name: "Zillow's What I Love About the Neighborhood", desc: "Sensory, lifestyle-forward, named-place content is exactly what this Zillow field is designed for. Paste the summary directly." },
  { name: "Listing presentation talking points", desc: "Categorical sections become bullet talking points for the in-person seller meeting." },
  { name: "Buyer relocation emails", desc: "When a buyer is unfamiliar with the area, the categorical breakdown answers their questions about daily life before they ask." },
  { name: "Compass, Redfin, Realtor.com community comments", desc: "Every portal has a community or neighborhood field. One generation feeds all of them." },
  { name: "Open house conversation cues", desc: "Specific named places give you something concrete to reference when a visitor asks 'what's it like to live here?'" },
];

const EXAMPLES = [
  {
    type: "Mountain town",
    typeColor: "#4A6B53",
    typeBg: "rgba(74,107,83,0.10)",
    location: "South Park Hill · Denver",
    summary: "A residential pocket where the morning starts at Stella's Coffee Haus and the afternoon ends with a walk through City Park's lakes and museums. Daily essentials stay within a few blocks, while the Denver Botanic Gardens anchor weekend plans just south of the neighborhood.",
    categoryLabel: "The everyday",
    items: ["Stella's Coffee Haus", "Park Hill Branch Library", "Tables of Park Hill"],
  },
  {
    type: "Lakefront",
    typeColor: "#9A7E50",
    typeBg: "rgba(184,153,104,0.12)",
    location: "Eastown · Grand Rapids",
    summary: "A walkable neighborhood with a tight cluster of independent restaurants, vintage shops, and the Wealthy Theatre at its heart. Residents grab breakfast at Wolfgang's, run errands at Marie Catrib's grocery, and end the night along Wealthy Street's lineup of bars and patios.",
    categoryLabel: "Dining nearby",
    items: ["Wolfgang's Restaurant", "The Winchester", "Brick Road Pizza Co"],
  },
  {
    type: "Historic district",
    typeColor: "#1F3D2E",
    typeBg: "rgba(31,61,46,0.08)",
    location: "Forsyth Park · Savannah",
    summary: "A tree-canopied address along Savannah's most-photographed park, where mornings begin with a walk under live oaks and afternoons drift into the cafés along Whitaker Street. The Starland District sits a few blocks south for dinner, while downtown squares are reachable on foot.",
    categoryLabel: "Outdoor & recreation",
    items: ["Forsyth Park", "Starland Yard", "Wright Square"],
  },
];

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

export function NeighborhoodToolClient() {
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<ToolStatus>("idle");
  const [result, setResult] = useState<NeighborhoodResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [runsUsed, setRunsUsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status === "success" || status === "error" || status === "email_gate") {
      // Small delay lets the result panel render before we scroll
      const t = setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handleGenerate = async (overrideEmail?: string) => {
    if (!address.trim() || status === "loading") return;
    setStatus("loading");
    setResult(null);
    setErrorMsg(null);
    setCopied(false);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/neighborhood-guide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: address.trim(),
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
          data.detail === "address_not_found"
            ? "We couldn't find that address. Try a more complete street address with city and state."
            : "Something went wrong. Please try again in a moment."
        );
        setStatus("error");
        return;
      }

      const data: NeighborhoodResult = await res.json();
      setResult(data);
      setStatus("success");
    } catch {
      setErrorMsg("Could not reach the server. Check your connection and try again.");
      setStatus("error");
    }
  };

  const handleCopy = async () => {
    if (!result?.neighborhood_guide) return;
    try {
      await navigator.clipboard.writeText(result.neighborhood_guide);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail
    }
  };

  return (
    <div className="min-h-screen bg-[#EFEAE0]">
      <Header />

      {/* ─────────────── HERO + TOOL ─────────────── */}
      <section className="border-b border-[rgba(20,39,30,0.10)] bg-[#F4F0E8]">
        <div className="mx-auto w-full max-w-[960px] px-6 py-16 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[720px]">
            <SectionLabel>Free tool · Neighborhood guides</SectionLabel>

            <h1 className="mb-4 font-manrope text-[clamp(28px,4.5vw,48px)] font-medium leading-[1.08] tracking-[0.005em] text-[#14271E]">
              Generate a neighborhood description for any <em className="not-italic text-[#9A7E50]">MLS listing</em>.
            </h1>

            <p className="mb-8 max-w-[640px] text-[clamp(14px,1.2vw,17px)] leading-[1.6] text-[#4A6B53]">
              Type an address. We&apos;ll build a multi-section neighborhood guide — a lifestyle summary for the MLS, plus categorical breakdowns for talking points. Powered by live Google Places data, Fair Housing-aware, free for your first three generations.
            </p>

            {/* Input form */}
            <div className="overflow-hidden rounded-[14px] border border-[rgba(20,39,30,0.18)] bg-[#FAF7F0] shadow-[0_4px_24px_rgba(20,39,30,0.06)]">
              <div className="flex items-center gap-2.5 px-5 py-4">
                <MapPin className="h-4 w-4 shrink-0 text-[#9A7E50]" strokeWidth={2} />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  placeholder="123 Main Street, Austin, TX 78704"
                  disabled={status === "loading"}
                  maxLength={200}
                  className="flex-1 border-0 bg-transparent font-manrope text-[15px] text-[#14271E] outline-none placeholder:text-[rgba(20,39,30,0.45)]"
                />
              </div>
              <div className="flex items-center justify-between border-t border-[rgba(20,39,30,0.10)] bg-[rgba(20,39,30,0.02)] px-4 py-3">
                <span className="font-mono text-[11px] text-[rgba(20,39,30,0.55)]">
                  Full street + city + state for best results
                </span>
                <button
                  onClick={() => handleGenerate()}
                  disabled={!address.trim() || status === "loading" || !turnstileToken}
                  className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-manrope text-[13px] font-medium text-[#F4F0E8] transition-opacity ${
                    !address.trim() || status === "loading"
                      ? "cursor-not-allowed bg-[#4A6B53] opacity-50"
                      : "bg-[#1F3D2E] hover:opacity-90"
                  }`}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      Generate guide
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="mt-3.5 font-mono text-[11px] text-[rgba(20,39,30,0.55)]">
              3 free generations · then drop your email to keep generating · no subscription
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
                    Free generations used
                  </p>
                  <h2 className="mb-2 font-manrope text-[22px] font-medium text-[#14271E]">
                    You&apos;ve used your {runsUsed} free generations.
                  </h2>
                  <p className="mb-6 text-[14px] leading-[1.6] text-[#4A6B53]">
                    Drop your email to keep generating — no subscription, no spam.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGenerate(email)}
                      className="min-w-[200px] flex-1 rounded-lg border border-[rgba(20,39,30,0.18)] bg-[#F4F0E8] px-3.5 py-2.5 font-manrope text-[13px] text-[#14271E] outline-none"
                    />
                    <button
                      onClick={() => handleGenerate(email)}
                      disabled={!email.trim() || !turnstileToken}
                      className={`inline-flex items-center gap-2 rounded-lg bg-[#1F3D2E] px-5 py-2.5 font-manrope text-[13px] font-medium text-[#F4F0E8] ${
                        !email.trim() ? "cursor-not-allowed opacity-50" : "hover:opacity-90"
                      }`}
                    >
                      Continue generating
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
                      Couldn&apos;t generate the guide
                    </h3>
                  </div>
                  <p className="text-[14px] leading-[1.55] text-[#4A6B53]">
                    {errorMsg}
                  </p>
                </div>
              )}

              {/* Success — render dossier */}
              {status === "success" && result && (
                <div className="rounded-[16px] border border-[rgba(20,39,30,0.18)] bg-[#FAF7F0] p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#5C8A6E]" />
                      <h2 className="font-manrope text-[20px] font-medium text-[#14271E]">
                        Your neighborhood guide
                      </h2>
                    </div>
                    <button
                      onClick={handleCopy}
                      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-[11px] transition-colors ${
                        copied
                          ? "border-[#5C8A6E] text-[#5C8A6E]"
                          : "border-[rgba(20,39,30,0.18)] text-[#4A6B53] hover:bg-[rgba(20,39,30,0.04)]"
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy guide
                        </>
                      )}
                    </button>
                  </div>

                  {/* The blob */}
                  <div className="rounded-[10px] border border-[rgba(20,39,30,0.10)] bg-[#F4F0E8] p-5 sm:p-6">
                    <pre className="whitespace-pre-wrap break-words font-manrope text-[14px] leading-[1.65] text-[#14271E]">
                      {result.neighborhood_guide}
                    </pre>
                  </div>

                  {/* Inline upsell */}
                  <div className="mt-7 border-t border-[rgba(20,39,30,0.10)] pt-6">
                    <p className="mb-4 text-[13.5px] leading-[1.6] text-[#4A6B53]">
                      <strong className="font-semibold text-[#14271E]">You&apos;ve got the neighborhood.</strong>{" "}
                      A full Metes listing kit adds the MLS description, social posts, four-email campaign, photo curation, and compliance audit — all for $35 per listing.
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
            <SectionLabel>What this tool does</SectionLabel>
            <h2 className="mb-4 font-manrope text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] tracking-[0.005em] text-[#14271E]">
              Built for MLS work — <em className="not-italic text-[#9A7E50]">not generic neighborhood prose</em>.
            </h2>
            <p className="text-[clamp(15px,1.3vw,17px)] leading-[1.6] text-[#4A6B53]">
              Generic AI writes vague descriptions about anywhere. This tool builds Fair Housing-aware content anchored in real local data.
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

      {/* ─────────────── USE CASES — DARK FOREST ─────────────── */}
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
            <SectionLabel light>One generation, six places</SectionLabel>
            <h2 className="mb-4 font-manrope text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] tracking-[0.005em] text-[#F4F0E8]">
              Where your <em className="not-italic text-[#B89968]">neighborhood guide</em> gets used.
            </h2>
            <p className="text-[clamp(15px,1.3vw,17px)] leading-[1.6] text-[rgba(244,240,232,0.78)]">
              Buyers buy neighborhoods, not just homes. The right neighborhood content goes into MLS public remarks, Zillow agent comments, listing presentations, buyer emails, and more — all from one generation.
            </p>
          </div>

          <div className="flex max-w-[780px] flex-col">
            {USE_CASES.map(({ name, desc }, i) => (
              <div
                key={i}
                className={`flex items-start gap-3.5 py-4 ${
                  i < USE_CASES.length - 1 ? "border-b border-[rgba(244,240,232,0.12)]" : ""
                }`}
              >
                <span className="mt-0.5 min-w-[20px] shrink-0 font-mono text-[11px] font-semibold text-[#D9C49C]">
                  0{i + 1}
                </span>
                <div>
                  <div className="mb-1 font-manrope text-[14.5px] font-semibold text-[#F4F0E8]">
                    {name}
                  </div>
                  <div className="text-[13px] leading-[1.55] text-[rgba(244,240,232,0.78)]">
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── EXAMPLE OUTPUTS — CREAM ─────────────── */}
      <section className="bg-[#EFEAE0] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-12">
          <div className="mb-12 max-w-[720px]">
            <SectionLabel>Sample output</SectionLabel>
            <h2 className="mb-4 font-manrope text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] tracking-[0.005em] text-[#14271E]">
              What the guide looks like across <em className="not-italic text-[#9A7E50]">three market types</em>.
            </h2>
            <p className="text-[clamp(15px,1.3vw,17px)] leading-[1.6] text-[#4A6B53]">
              Same tool, same workflow — output adapts to the neighborhood. A historic district reads different from a mountain town, and the tool surfaces what actually matters in each.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3 md:gap-4">
            {EXAMPLES.map((ex) => (
              <article
                key={ex.location}
                className="flex min-w-0 flex-col rounded-[12px] border border-[rgba(20,39,30,0.10)] bg-[#FAF7F0] p-5 sm:p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className="rounded font-mono text-[10px] uppercase tracking-[0.08em]"
                    style={{
                      color: ex.typeColor,
                      backgroundColor: ex.typeBg,
                      padding: "4px 8px",
                    }}
                  >
                    {ex.type}
                  </span>
                  <span className="font-mono text-[11px] text-[rgba(20,39,30,0.55)]">
                    {ex.location}
                  </span>
                </div>

                <h3 className="mb-2.5 font-manrope text-[14px] font-semibold tracking-[-0.005em] text-[#14271E]">
                  Neighborhood summary
                </h3>
                <p className="mb-5 text-[13px] leading-[1.6] text-[#14271E]">
                  {ex.summary}
                </p>

                <div className="mt-auto border-t border-[rgba(20,39,30,0.10)] pt-4">
                  <h4 className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[rgba(20,39,30,0.55)]">
                    {ex.categoryLabel}
                  </h4>
                  <ul className="flex flex-col gap-1.5">
                    {ex.items.map((item) => (
                      <li key={item} className="relative pl-3 text-[12.5px] text-[#14271E]">
                        <span className="absolute left-0 text-[#B89968]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
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
              What agents ask about <em className="not-italic text-[#9A7E50]">neighborhood descriptions</em>.
            </h2>
          </div>

          <div className="flex max-w-[880px] flex-col gap-4">
            {[
              {
                q: "What should an MLS neighborhood description include?",
                a: (
                  <>
                    A strong MLS neighborhood description balances lifestyle context with specific, verifiable details — named parks, grocery stores, dining, and walkable destinations. Avoid demographic language and proximity terms that imply mobility (the Fair Housing Act prohibits these — read more on our{" "}
                    <Link href="/compliance-audit" className="text-[#1F3D2E] underline decoration-[#B89968]">
                      compliance audit page
                    </Link>
                    ). Stick to descriptions of the area, not assumptions about who lives there.
                  </>
                ),
              },
              {
                q: "How long should the neighborhood section of an MLS listing be?",
                a: "Most MLS community or neighborhood fields cap at around 500 characters. Zillow research suggests a 250-word total listing description, which means the neighborhood portion should be roughly 50–80 words inside that budget. Our generator targets approximately 400 characters for the lifestyle summary to fit safely inside most MLS field limits.",
              },
              {
                q: "What goes in Zillow's \"What I Love About the Neighborhood\" field?",
                a: "The \"What I Love About the Neighborhood\" field on Zillow is meant to capture specific, sensory, lifestyle-forward observations about the area — not a list of amenities. Reference named places (parks, coffee shops, trails) and the kind of daily life the neighborhood enables. Our lifestyle summary fits this field directly with no editing required.",
              },
              {
                q: "Is using phrases like \"family-friendly\" or \"walking distance\" Fair Housing compliant?",
                a: (
                  <>
                    No. &ldquo;Family-friendly&rdquo; implies a preference based on familial status, which is a protected class under the Fair Housing Act. &ldquo;Walking distance&rdquo; can be interpreted as excluding buyers with mobility impairments. Safe alternatives include describing the property layout (&ldquo;multiple living areas&rdquo;) or using neutral proximity language (&ldquo;short distance,&rdquo; &ldquo;two blocks from&rdquo;). Our generator avoids these phrases by default. Run any draft through our{" "}
                    <Link href="/tools/fha-compliance-checker" className="text-[#1F3D2E] underline decoration-[#B89968]">
                      Fair Housing Compliance Checker
                    </Link>{" "}
                    to scan for similar issues.
                  </>
                ),
              },
              {
                q: "How is this different from asking ChatGPT to write a neighborhood description?",
                a: "Generic AI tools generate plausible-sounding neighborhood text from training data alone — which is why their output frequently invents businesses or misnames real ones. Our generator anchors every guide in live Google Places data, pulled at generation time using the property's address. The places, parks, and dining we mention are real, current, and within a defined radius of the listing.",
              },
              {
                q: "How does this work with my MLS character limits?",
                a: "The lifestyle summary is sized for direct paste into MLS community or neighborhood fields, which typically cap around 500 characters. The categorical sections (everyday essentials, outdoor recreation, dining, wellness) are formatted as reference content for use elsewhere — listing presentation talking points, buyer emails, or open house conversation cues.",
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

      {/* ─────────────── FINAL CTA — DARK FOREST ─────────────── */}
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
          <div className="max-w-[720px]">
            <SectionLabel light>You&apos;ve got the neighborhood</SectionLabel>
            <h2 className="mb-5 font-manrope text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] tracking-[0.005em] text-[#F4F0E8]">
              Here&apos;s <em className="not-italic text-[#B89968]">everything else</em> Metes builds.
            </h2>
            <p className="mb-8 max-w-[600px] text-[clamp(15px,1.3vw,17px)] leading-[1.6] text-[rgba(244,240,232,0.78)]">
              The neighborhood guide is one of seven deliverables in a Metes listing kit. The full kit adds the MLS description, social posts, four-email campaign, sorted and captioned photos, and a Fair Housing + truth-in-advertising compliance audit — all for $35 per listing. No subscription.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-[9px] bg-[#B89968] px-7 py-3.5 font-manrope text-[14px] font-medium text-[#14271E] no-underline transition-colors hover:bg-[#9A7E50] hover:text-[#F4F0E8]"
              >
                Generate the full listing kit — $35
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/compliance-audit"
                className="inline-flex items-center gap-2 rounded-[9px] border border-[rgba(244,240,232,0.3)] bg-transparent px-7 py-3.5 font-manrope text-[14px] font-medium text-[#F4F0E8] no-underline hover:border-[rgba(244,240,232,0.6)]"
              >
                See the compliance audit
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}