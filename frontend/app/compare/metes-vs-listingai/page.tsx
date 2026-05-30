import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle, Minus } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Metes vs. ListingAI: Per-Listing vs. Subscription — An Honest Comparison",
  description:
    "Metes and ListingAI both generate AI real estate marketing, but they're different shapes of product. Metes is a $35 per-listing kit; ListingAI is a $14-150/month subscription suite. Here's which fits which agent.",
  keywords: [
    "metes vs listingai",
    "listingai alternative",
    "listingai vs metes",
    "real estate AI tool comparison",
    "best AI for real estate listings",
    "listingai competitor",
    "per listing vs subscription AI",
  ],
  alternates: {
    canonical: "https://www.metes.app/compare/metes-vs-listingai",
  },
  openGraph: {
    title: "Metes vs. ListingAI: An Honest Comparison",
    description:
      "Per-listing vs. subscription, side by side. Honest pricing math, feature breakdown, and which tool fits which agent profile.",
    url: "https://www.metes.app/compare/metes-vs-listingai",
    siteName: "Metes",
    type: "article",
    images: [
      {
        url: "https://www.metes.app/og/metes-vs-listingai.png",
        width: 1200,
        height: 630,
        alt: "Metes vs. ListingAI comparison",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Metes vs. ListingAI: An Honest Comparison",
    description: "Per-listing vs. subscription. Side-by-side breakdown of features, pricing, and which tool fits which agent.",
    images: ["https://www.metes.app/og/metes-vs-listingai.png"],
  },
  robots: { index: true, follow: true },
};

const SCHEMA_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Metes vs. ListingAI: Per-Listing vs. Subscription — An Honest Comparison",
      "description": "Side-by-side comparison of Metes and ListingAI covering pricing, features, Fair Housing compliance approach, and which tool fits which agent profile.",
      "url": "https://www.metes.app/compare/metes-vs-listingai",
      "datePublished": "2026-05-29",
      "dateModified": "2026-05-29",
      "author": {
        "@type": "Organization",
        "name": "Metes",
        "url": "https://www.metes.app",
      },
      "publisher": {
        "@type": "Organization",
        "name": "Metes",
        "url": "https://www.metes.app",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is ListingAI better than Metes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Neither is universally better. ListingAI has more features and better per-listing economics for high-volume agents. Metes has deeper compliance review, a four-email campaign, photo curation, and per-listing pricing that doesn't require subscription. The right answer depends on your volume and what you value.",
          },
        },
        {
          "@type": "Question",
          "name": "What's the cheapest option for a new agent?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For a new agent doing one listing every month or two, Metes at $35 per listing avoids the subscription commitment. For a new agent doing five or more listings monthly from day one, ListingAI Professional at $36/month is cheaper per unit.",
          },
        },
        {
          "@type": "Question",
          "name": "Does ListingAI include a Fair Housing audit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ListingAI generates MLS-compliant content and publishes compliance guides, but doesn't surface a dedicated independent audit pass as a feature. Metes runs every generated asset through a separate compliance review chain in addition to filtering at generation. For most listings the difference doesn't matter; for borderline language, defense-in-depth catches what single-layer filtering can miss.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I get virtual staging from Metes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Metes does photo curation (ranking, renaming, captioning) but not virtual staging. If you need to add furniture to empty rooms or remove existing furniture, use ListingAI or a dedicated virtual staging tool.",
          },
        },
        {
          "@type": "Question",
          "name": "Does Metes include AI video generation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. ListingAI offers AI-generated property videos up to six minutes; Metes doesn't. Agents who want video as part of their marketing should use ListingAI or a dedicated video tool.",
          },
        },
        {
          "@type": "Question",
          "name": "What about neighborhood content?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Metes generates a multi-section neighborhood guide for every listing from live Google Places API data — coffee shops, parks, restaurants, recreation. ListingAI references neighborhoods in descriptions but doesn't generate a standalone neighborhood guide.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I try both before deciding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. ListingAI offers a free tier with watermarked output. Metes offers three free standalone tools and per-listing pricing means no commitment required to try a full kit.",
          },
        },
        {
          "@type": "Question",
          "name": "Is one easier to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ListingAI has a longer track record (31,000+ users) and more polished UX in places. Metes is newer but the workflow is intentionally minimal: upload photos, paste notes, get a kit. Both are usable by non-technical agents.",
          },
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────
// SectionLabel — matches the pattern from existing tool pages
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
// Comparison table data
// ─────────────────────────────────────────────────────────────────

type CellState = "yes" | "no" | "partial" | "text";

interface ComparisonRow {
  label: string;
  metes: { state: CellState; value?: string };
  listingai: { state: CellState; value?: string };
}

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Pricing model", metes: { state: "text", value: "$35 per listing" }, listingai: { state: "text", value: "$14–$150/month subscription" } },
  { label: "Best for volume", metes: { state: "text", value: "1–3 listings/month" }, listingai: { state: "text", value: "5+ listings/month" } },
  { label: "MLS description", metes: { state: "yes", value: "Editorial style, 950-char cap" }, listingai: { state: "yes", value: "Three variations per listing" } },
  { label: "Social posts", metes: { state: "yes", value: "Facebook + Instagram with crop guidance" }, listingai: { state: "yes", value: "Multi-platform with story templates" } },
  { label: "Email campaign", metes: { state: "yes", value: "4-email drip series" }, listingai: { state: "no" } },
  { label: "Photo curation + captions", metes: { state: "yes", value: "Top 25 ranked, renamed, per-photo captions" }, listingai: { state: "no", value: "Virtual staging instead" } },
  { label: "Neighborhood guide", metes: { state: "yes", value: "Live Google Places data" }, listingai: { state: "no" } },
  { label: "Virtual staging", metes: { state: "no" }, listingai: { state: "yes", value: "Pro and up" } },
  { label: "AI video", metes: { state: "no" }, listingai: { state: "yes", value: "Up to 6 min, Pro and up" } },
  { label: "Agent website", metes: { state: "no" }, listingai: { state: "yes", value: "All paid plans" } },
  { label: "CMA reports", metes: { state: "no" }, listingai: { state: "yes", value: "Pro and up" } },
  { label: "Fair Housing compliance", metes: { state: "yes", value: "Two-layer audit" }, listingai: { state: "partial", value: "Filtered at generation only" } },
  { label: "Free trial", metes: { state: "yes", value: "3 free tools, no signup" }, listingai: { state: "yes", value: "Free preview (watermarked)" } },
  { label: "Subscription required", metes: { state: "no" }, listingai: { state: "yes" } },
  { label: "Total users", metes: { state: "text", value: "New (launched 2026)" }, listingai: { state: "text", value: "31,000+ across 20+ countries" } },
];

function CellIcon({ state }: { state: CellState }) {
  if (state === "yes") return <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5C8A6E]" />;
  if (state === "no") return <XCircle className="h-4 w-4 shrink-0 text-[#C97B5C]" />;
  if (state === "partial") return <Minus className="h-4 w-4 shrink-0 text-[#B89968]" />;
  return null;
}

// ─────────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────────

export default function MetesVsListingAIPage() {
  return (
    <div className="min-h-screen bg-[#EFEAE0]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_JSON_LD) }}
      />
      <Header />

      {/* ─────────────── HERO — CREAM ─────────────── */}
      <section className="border-b border-[rgba(20,39,30,0.10)] bg-[#F4F0E8]">
        <div className="mx-auto w-full max-w-[960px] px-6 py-16 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-[720px]">
            <SectionLabel>Comparison · ListingAI</SectionLabel>

            <h1 className="mb-4 font-manrope text-[clamp(28px,4.5vw,48px)] font-medium leading-[1.08] tracking-[0.005em] text-[#14271E]">
              Metes vs. ListingAI: <em className="not-italic text-[#9A7E50]">per-listing vs. subscription</em>, and which fits you.
            </h1>

            <p className="mb-6 max-w-[640px] text-[clamp(14px,1.2vw,17px)] leading-[1.6] text-[#4A6B53]">
              Both tools generate AI marketing content for real estate listings. They&apos;re built for different agents, priced for different commitment levels, and excel at different things. This page is an honest comparison — including where ListingAI is the better choice.
            </p>

            <p className="mb-8 max-w-[640px] text-[clamp(14px,1.2vw,17px)] leading-[1.6] text-[#4A6B53]">
              If you do 1–3 listings a month and don&apos;t want a subscription, Metes is probably the right answer at $35 per listing. If you do 5+ listings a month and want video, virtual staging, and a full agent website, ListingAI is probably the right answer at $14–$150 per month.
            </p>

            <p className="text-[13px] font-mono uppercase tracking-[0.08em] text-[rgba(20,39,30,0.55)]">
              Last updated: May 2026 · Based on ListingAI&apos;s public pricing page
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────── AT-A-GLANCE TABLE — EARTH ─────────────── */}
      <section className="bg-[#EFEAE0] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[960px] px-6 lg:px-8">
          <div className="mx-auto max-w-[720px]">
            <SectionLabel>At a glance</SectionLabel>
            <h2 className="mb-4 font-manrope text-[clamp(24px,3.5vw,36px)] font-medium leading-[1.1] tracking-[0.005em] text-[#14271E]">
              The honest side-by-side.
            </h2>
            <p className="mb-8 text-[clamp(14px,1.2vw,16px)] leading-[1.6] text-[#4A6B53]">
              This isn&apos;t a checklist where one tool wins on every row. They&apos;re built for different commitment levels and different needs. The honest read: ListingAI has more features; Metes goes deeper on the features it does have. The right tool depends on your volume and what you actually use.
            </p>

            <div className="overflow-hidden rounded-[14px] border border-[rgba(20,39,30,0.18)] bg-[#FAF7F0]">
              {/* Table header */}
              <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-3 border-b border-[rgba(20,39,30,0.10)] bg-[rgba(20,39,30,0.04)] px-5 py-3.5">
                <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[rgba(20,39,30,0.55)]">
                  Feature
                </div>
                <div className="font-manrope text-[13px] font-semibold text-[#14271E]">
                  Metes
                </div>
                <div className="font-manrope text-[13px] font-semibold text-[#14271E]">
                  ListingAI
                </div>
              </div>

              {/* Table rows */}
              {COMPARISON_ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[1.2fr_1fr_1fr] gap-3 px-5 py-3.5 ${
                    i < COMPARISON_ROWS.length - 1 ? "border-b border-[rgba(20,39,30,0.08)]" : ""
                  }`}
                >
                  <div className="font-manrope text-[13px] font-medium text-[#14271E]">
                    {row.label}
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <CellIcon state={row.metes.state} />
                    </div>
                    {row.metes.value && (
                      <span className="text-[12.5px] leading-[1.5] text-[#4A6B53]">
                        {row.metes.value}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <CellIcon state={row.listingai.state} />
                    </div>
                    {row.listingai.value && (
                      <span className="text-[12.5px] leading-[1.5] text-[#4A6B53]">
                        {row.listingai.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── WHEN LISTINGAI WINS — DARK FOREST ─────────────── */}
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
          <div className="mx-auto max-w-[720px]">
            <SectionLabel light>When ListingAI is the right call</SectionLabel>
            <h2 className="mb-6 font-manrope text-[clamp(24px,3.5vw,36px)] font-medium leading-[1.1] tracking-[0.005em] text-[#F4F0E8]">
              Three agent profiles where <em className="not-italic text-[#B89968]">ListingAI wins, full stop</em>.
            </h2>

            <div className="flex flex-col gap-6 text-[14.5px] leading-[1.65] text-[rgba(244,240,232,0.85)]">
              <div>
                <div className="mb-2 font-manrope text-[15px] font-semibold text-[#F4F0E8]">
                  The high-volume agent (5+ listings/month).
                </div>
                <p>
                  At the Professional plan&apos;s $36/month, ListingAI costs $7.20 per listing if you do five a month, $3.60 per listing if you do ten. Metes at $35 per listing doesn&apos;t compete on per-unit cost above that volume.
                </p>
              </div>

              <div>
                <div className="mb-2 font-manrope text-[15px] font-semibold text-[#F4F0E8]">
                  The agent who wants virtual staging and video.
                </div>
                <p>
                  ListingAI&apos;s Professional plan includes 300 virtual staging credits and 25 AI video credits monthly. Metes doesn&apos;t offer either feature. Agents listing vacant properties or wanting cinematic property tours should go with ListingAI.
                </p>
              </div>

              <div>
                <div className="mb-2 font-manrope text-[15px] font-semibold text-[#F4F0E8]">
                  The agent who needs a full agent website.
                </div>
                <p>
                  ListingAI&apos;s plans all include an agent website with custom domain support, branded controls, and lead capture. Metes is a marketing kit generator, not a CRM or website platform. Agents looking for an all-in-one digital presence should go with ListingAI.
                </p>
              </div>

              <div className="mt-2 rounded-[10px] border border-[rgba(244,240,232,0.15)] bg-[rgba(244,240,232,0.04)] px-5 py-4">
                <p className="text-[13.5px] leading-[1.6] text-[rgba(244,240,232,0.78)]">
                  If any of those describe you, stop reading and use ListingAI. They&apos;re a mature platform with 31,000+ users and they&apos;ll serve you well. If none of those describe you, the rest of this page covers where Metes is the stronger fit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── WHEN METES WINS — CREAM ─────────────── */}
      <section className="bg-[#EFEAE0] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[960px] px-6 lg:px-8">
          <div className="mx-auto max-w-[720px]">
            <SectionLabel>When Metes is the right call</SectionLabel>
            <h2 className="mb-6 font-manrope text-[clamp(24px,3.5vw,36px)] font-medium leading-[1.1] tracking-[0.005em] text-[#14271E]">
              Four agent profiles where <em className="not-italic text-[#9A7E50]">Metes is the stronger fit</em>.
            </h2>

            <div className="flex flex-col gap-6 text-[14.5px] leading-[1.65] text-[#14271E]">
              <div>
                <div className="mb-2 font-manrope text-[15px] font-semibold text-[#14271E]">
                  The low-to-mid-volume agent (1–3 listings/month).
                </div>
                <p className="text-[#4A6B53]">
                  Subscription pricing punishes infrequent users. At one listing a month, ListingAI&apos;s $14/month Essential plan is $14 per listing — close to Metes&apos; $35 once you factor in the limited features. At one listing every two months, ListingAI is $28 per listing and you&apos;re paying for months you don&apos;t use it. Per-listing pricing is more honest for agents who don&apos;t list every week.
                </p>
              </div>

              <div>
                <div className="mb-2 font-manrope text-[15px] font-semibold text-[#14271E]">
                  The agent who genuinely cares about Fair Housing compliance.
                </div>
                <p className="text-[#4A6B53]">
                  Metes runs a two-layer compliance system — Fair Housing constraints are baked into every generation prompt, then every asset gets reviewed by an independent compliance audit chain that can flag, revise, or pass. ListingAI generates compliant copy at the generation step but doesn&apos;t surface a separate audit layer. For agents in markets where Fair Housing complaints are taken seriously, defense-in-depth matters.
                </p>
              </div>

              <div>
                <div className="mb-2 font-manrope text-[15px] font-semibold text-[#14271E]">
                  The agent who wants photo curation done for them.
                </div>
                <p className="text-[#4A6B53]">
                  Metes analyzes every uploaded photo, ranks the top 25 by marketing impact, renames them with descriptive filenames, and generates per-photo captions for MLS uploads and Zillow alt text. ListingAI offers virtual staging (which alters photos) but doesn&apos;t offer curation (selecting and ordering existing photos). Different jobs.
                </p>
              </div>

              <div>
                <div className="mb-2 font-manrope text-[15px] font-semibold text-[#14271E]">
                  The agent who wants a neighborhood guide grounded in real data.
                </div>
                <p className="text-[#4A6B53]">
                  Metes fetches live nearby places from Google Places API for every listing, then writes a categorical guide of coffee shops, parks, restaurants, and recreation. ListingAI&apos;s descriptions reference neighborhoods at a higher level. For listings where location is half the sell, the difference matters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── FEATURE-BY-FEATURE — WARM CREAM ─────────────── */}
      <section className="border-t border-[rgba(20,39,30,0.10)] bg-[#F4F0E8] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[960px] px-6 lg:px-8">
          <div className="mx-auto max-w-[720px]">
            <SectionLabel>Feature-by-feature</SectionLabel>
            <h2 className="mb-8 font-manrope text-[clamp(24px,3.5vw,36px)] font-medium leading-[1.1] tracking-[0.005em] text-[#14271E]">
              The honest breakdown by <em className="not-italic text-[#9A7E50]">feature category</em>.
            </h2>

            <div className="flex flex-col gap-7">

              <div>
                <h3 className="mb-2 font-manrope text-[18px] font-semibold tracking-[-0.005em] text-[#14271E]">
                  MLS description generation
                </h3>
                <p className="text-[14px] leading-[1.65] text-[#4A6B53]">
                  Both generate MLS descriptions. Metes produces one editorial-style description tuned to 880 characters (within the 950 cap), with a movement-driven opening and specific feature language. ListingAI produces three variations per listing, giving you choice. If you want options, ListingAI wins. If you want one strong draft you can ship, Metes wins.
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-manrope text-[18px] font-semibold tracking-[-0.005em] text-[#14271E]">
                  Social media content
                </h3>
                <p className="text-[14px] leading-[1.65] text-[#4A6B53]">
                  ListingAI generates content for more platforms (Facebook, Instagram, stories, ads) and integrates with their agent website. Metes generates Facebook and Instagram captions paired with photo recommendations and crop guidance for the right aspect ratio. Metes wins on photo-text matching; ListingAI wins on breadth.
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-manrope text-[18px] font-semibold tracking-[-0.005em] text-[#14271E]">
                  Email campaigns
                </h3>
                <p className="text-[14px] leading-[1.65] text-[#4A6B53]">
                  Metes includes a four-email drip series (Just Listed, Open House, Why This Home, Just Sold) with subject lines and timing guidance. ListingAI doesn&apos;t surface a dedicated email campaign feature on their pricing pages. If email is part of your follow-up workflow, Metes covers it natively.
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-manrope text-[18px] font-semibold tracking-[-0.005em] text-[#14271E]">
                  Photo handling
                </h3>
                <p className="text-[14px] leading-[1.65] text-[#4A6B53]">
                  Different philosophies. ListingAI offers virtual staging — adding furniture to empty rooms, removing existing furniture, twilight conversion, object removal — using AI image editing. Metes offers curation — analyzing photos, ranking them by marketing impact, renaming files, and writing captions. They solve different problems. Empty room? ListingAI. Twenty real photos that need to become a marketing-ready set of 25? Metes.
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-manrope text-[18px] font-semibold tracking-[-0.005em] text-[#14271E]">
                  Neighborhood content
                </h3>
                <p className="text-[14px] leading-[1.65] text-[#4A6B53]">
                  Metes generates a multi-section neighborhood guide for every listing using live Google Places API data — categorical breakdowns of everyday essentials, outdoor recreation, dining, and wellness, plus a lifestyle paragraph for the MLS community field. ListingAI&apos;s listing descriptions reference neighborhoods but don&apos;t generate a standalone guide.
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-manrope text-[18px] font-semibold tracking-[-0.005em] text-[#14271E]">
                  Fair Housing compliance
                </h3>
                <p className="mb-3 text-[14px] leading-[1.65] text-[#4A6B53]">
                  Both tools claim to produce Fair Housing compliant copy. The mechanism differs.
                </p>
                <ul className="flex flex-col gap-2 pl-4 text-[14px] leading-[1.6] text-[#4A6B53]">
                  <li className="relative pl-3">
                    <span className="absolute left-0 text-[#B89968]">•</span>
                    ListingAI mentions &ldquo;MLS-compliant&rdquo; descriptions and publishes a virtual staging compliance guide. Their compliance approach happens at the generation layer.
                  </li>
                  <li className="relative pl-3">
                    <span className="absolute left-0 text-[#B89968]">•</span>
                    Metes runs Fair Housing constraints at the generation layer (same approach as ListingAI), then runs every asset through a separate compliance audit chain that can independently flag, revise, or pass. This is defense-in-depth.
                  </li>
                  <li className="relative pl-3">
                    <span className="absolute left-0 text-[#B89968]">•</span>
                    For most listings, both approaches produce clean output. For listings with edge cases — borderline language, hostile agent notes, or subtle demographic implications — the second layer catches what the first might miss.
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── PRICING MATH — DARK FOREST ─────────────── */}
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
          <div className="mx-auto max-w-[720px]">
            <SectionLabel light>The pricing math</SectionLabel>
            <h2 className="mb-6 font-manrope text-[clamp(24px,3.5vw,36px)] font-medium leading-[1.1] tracking-[0.005em] text-[#F4F0E8]">
              Cost at different volumes, <em className="not-italic text-[#B89968]">no fudging</em>.
            </h2>

            <p className="mb-8 text-[14.5px] leading-[1.65] text-[rgba(244,240,232,0.78)]">
              Here&apos;s what each tool costs at different volumes, with the break-even points called out.
            </p>

            <div className="flex flex-col gap-5">

              <div className="rounded-[10px] border border-[rgba(244,240,232,0.15)] bg-[rgba(244,240,232,0.03)] p-5">
                <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#D9C49C]">
                  At 1 listing / month
                </div>
                <ul className="flex flex-col gap-1.5 text-[13.5px] text-[rgba(244,240,232,0.85)]">
                  <li><strong className="text-[#F4F0E8]">Metes:</strong> $35/month total</li>
                  <li><strong className="text-[#F4F0E8]">ListingAI Essential:</strong> $14/month ($14/listing)</li>
                  <li><strong className="text-[#F4F0E8]">ListingAI Professional:</strong> $36/month ($36/listing)</li>
                </ul>
                <p className="mt-3 text-[13px] leading-[1.6] text-[rgba(244,240,232,0.65)]">
                  ListingAI Essential wins on raw cost, but you get descriptions and social only — no email campaign, no neighborhood guide, no photo curation, no compliance audit.
                </p>
              </div>

              <div className="rounded-[10px] border border-[rgba(244,240,232,0.15)] bg-[rgba(244,240,232,0.03)] p-5">
                <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#D9C49C]">
                  At 3 listings / month
                </div>
                <ul className="flex flex-col gap-1.5 text-[13.5px] text-[rgba(244,240,232,0.85)]">
                  <li><strong className="text-[#F4F0E8]">Metes:</strong> $105/month ($35/listing)</li>
                  <li><strong className="text-[#F4F0E8]">ListingAI Essential:</strong> $14/month ($4.67/listing)</li>
                  <li><strong className="text-[#F4F0E8]">ListingAI Professional:</strong> $36/month ($12/listing)</li>
                </ul>
                <p className="mt-3 text-[13px] leading-[1.6] text-[rgba(244,240,232,0.65)]">
                  ListingAI is significantly cheaper per listing. The question becomes feature value — are the Metes-specific features (compliance audit, photo curation, neighborhood guide, email campaign) worth the $70–90/month premium?
                </p>
              </div>

              <div className="rounded-[10px] border border-[rgba(244,240,232,0.15)] bg-[rgba(244,240,232,0.03)] p-5">
                <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#D9C49C]">
                  At 10 listings / month
                </div>
                <ul className="flex flex-col gap-1.5 text-[13.5px] text-[rgba(244,240,232,0.85)]">
                  <li><strong className="text-[#F4F0E8]">Metes:</strong> $350/month ($35/listing)</li>
                  <li><strong className="text-[#F4F0E8]">ListingAI Professional:</strong> $36/month ($3.60/listing)</li>
                  <li><strong className="text-[#F4F0E8]">ListingAI Expert:</strong> $150/month ($15/listing)</li>
                </ul>
                <p className="mt-3 text-[13px] leading-[1.6] text-[rgba(244,240,232,0.65)]">
                  ListingAI is the obvious winner on per-unit cost at this volume.
                </p>
              </div>

              <div className="mt-2 rounded-[10px] border border-[rgba(184,153,104,0.3)] bg-[rgba(184,153,104,0.08)] p-5">
                <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[#D9C49C]">
                  The honest read
                </div>
                <p className="text-[14px] leading-[1.65] text-[rgba(244,240,232,0.85)]">
                  If your only metric is cost per listing and you do 3+ listings monthly, ListingAI wins. If your metric is &ldquo;I want a complete kit per listing without commitment,&rdquo; Metes wins.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── THE VERDICT — CREAM ─────────────── */}
      <section className="bg-[#EFEAE0] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[960px] px-6 lg:px-8">
          <div className="mx-auto max-w-[720px]">
            <SectionLabel>The honest verdict</SectionLabel>
            <h2 className="mb-6 font-manrope text-[clamp(24px,3.5vw,36px)] font-medium leading-[1.1] tracking-[0.005em] text-[#14271E]">
              Three personas, <em className="not-italic text-[#9A7E50]">three answers</em>.
            </h2>

            <div className="flex flex-col gap-5">

              <div className="rounded-[12px] border border-[rgba(20,39,30,0.10)] bg-[#FAF7F0] p-5 sm:p-6">
                <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[#9A7E50]">
                  Persona 1
                </div>
                <h3 className="mb-2 font-manrope text-[16px] font-semibold text-[#14271E]">
                  High-volume agent doing 5+ listings monthly, wants video and virtual staging
                </h3>
                <p className="text-[14px] leading-[1.65] text-[#4A6B53]">
                  <strong className="font-semibold text-[#14271E]">→ ListingAI Professional or Expert.</strong> Per-listing cost dominates, feature breadth matters at scale.
                </p>
              </div>

              <div className="rounded-[12px] border border-[rgba(20,39,30,0.10)] bg-[#FAF7F0] p-5 sm:p-6">
                <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[#9A7E50]">
                  Persona 2
                </div>
                <h3 className="mb-2 font-manrope text-[16px] font-semibold text-[#14271E]">
                  Mid-volume agent doing 2–4 listings monthly, wants full marketing kit without subscription
                </h3>
                <p className="text-[14px] leading-[1.65] text-[#4A6B53]">
                  <strong className="font-semibold text-[#14271E]">→ Metes.</strong> The four-email campaign, neighborhood guide, photo curation, and compliance audit deliver value the ListingAI Essential plan doesn&apos;t, and the per-listing pricing is honest for irregular volume.
                </p>
              </div>

              <div className="rounded-[12px] border border-[rgba(20,39,30,0.10)] bg-[#FAF7F0] p-5 sm:p-6">
                <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[#9A7E50]">
                  Persona 3
                </div>
                <h3 className="mb-2 font-manrope text-[16px] font-semibold text-[#14271E]">
                  Low-volume agent doing 1–2 listings per quarter
                </h3>
                <p className="text-[14px] leading-[1.65] text-[#4A6B53]">
                  <strong className="font-semibold text-[#14271E]">→ Metes by default.</strong> Subscription pricing punishes infrequent use.
                </p>
              </div>

              <div className="mt-3 rounded-[12px] border border-[rgba(20,39,30,0.18)] bg-[#F4F0E8] p-5 sm:p-6">
                <p className="text-[14px] leading-[1.65] text-[#14271E]">
                  The Fair Housing compliance question cuts across all three. If you&apos;re listing in a market with active Fair Housing scrutiny, the two-layer audit is worth real money — a single Fair Housing complaint can cost thousands in legal fees and trigger HUD review. Metes&apos; defense-in-depth approach is the strongest reason for any agent to prefer it regardless of volume.
                </p>
                <p className="mt-3 text-[14px] leading-[1.65] text-[#14271E]">
                  If you want to try Metes before committing, the three free tools — the{" "}
                  <Link href="/tools/fha-compliance-checker" className="text-[#1F3D2E] underline decoration-[#B89968]">
                    Fair Housing Compliance Checker
                  </Link>
                  ,{" "}
                  <Link href="/tools/listing-description-checker" className="text-[#1F3D2E] underline decoration-[#B89968]">
                    Listing Description Checker
                  </Link>
                  , and{" "}
                  <Link href="/tools/neighborhood-guide-generator" className="text-[#1F3D2E] underline decoration-[#B89968]">
                    Neighborhood Guide Generator
                  </Link>
                  {" "}— all use the same generation logic as the paid product. Test the quality on a recent listing of yours before deciding.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── FAQ — WARM CREAM ─────────────── */}
      <section className="border-t border-[rgba(20,39,30,0.10)] bg-[#F4F0E8] py-20 sm:py-24">
        <div className="mx-auto w-full max-w-[960px] px-6 lg:px-8">
          <div className="mx-auto max-w-[720px]">
            <SectionLabel>Common questions</SectionLabel>
            <h2 className="mb-8 font-manrope text-[clamp(24px,3.5vw,36px)] font-medium leading-[1.1] tracking-[0.005em] text-[#14271E]">
              Frequently asked about <em className="not-italic text-[#9A7E50]">Metes vs. ListingAI</em>.
            </h2>

            <div className="flex flex-col gap-4">
              {[
                {
                  q: "Is ListingAI better than Metes?",
                  a: "Neither is universally better. ListingAI has more features and better per-listing economics for high-volume agents. Metes has deeper compliance review, a four-email campaign, photo curation, and per-listing pricing that doesn't require subscription. The right answer depends on your volume and what you value.",
                },
                {
                  q: "What's the cheapest option for a new agent?",
                  a: "For a new agent doing one listing every month or two, Metes at $35 per listing avoids the subscription commitment. For a new agent doing five or more listings monthly from day one, ListingAI Professional at $36/month is cheaper per unit.",
                },
                {
                  q: "Does ListingAI include a Fair Housing audit?",
                  a: (
                    <>
                      ListingAI generates MLS-compliant content and publishes compliance guides, but doesn&apos;t surface a dedicated independent audit pass as a feature. Metes runs every generated asset through a separate compliance review chain in addition to filtering at generation. For most listings the difference doesn&apos;t matter; for borderline language, defense-in-depth catches what single-layer filtering can miss. Try our{" "}
                      <Link href="/tools/fha-compliance-checker" className="text-[#1F3D2E] underline decoration-[#B89968]">
                        Fair Housing Compliance Checker
                      </Link>
                      {" "}for a sense of how the audit layer works.
                    </>
                  ),
                },
                {
                  q: "Can I get virtual staging from Metes?",
                  a: "No. Metes does photo curation (ranking, renaming, captioning) but not virtual staging. If you need to add furniture to empty rooms or remove existing furniture, use ListingAI or a dedicated virtual staging tool.",
                },
                {
                  q: "Does Metes include AI video generation?",
                  a: "No. ListingAI offers AI-generated property videos up to six minutes; Metes doesn't. Agents who want video as part of their marketing should use ListingAI or a dedicated video tool.",
                },
                {
                  q: "What about neighborhood content?",
                  a: (
                    <>
                      Metes generates a multi-section neighborhood guide for every listing from live Google Places API data — coffee shops, parks, restaurants, recreation. ListingAI references neighborhoods in descriptions but doesn&apos;t generate a standalone neighborhood guide. Try our{" "}
                      <Link href="/tools/neighborhood-guide-generator" className="text-[#1F3D2E] underline decoration-[#B89968]">
                        Neighborhood Guide Generator
                      </Link>
                      {" "}to see what the output looks like.
                    </>
                  ),
                },
                {
                  q: "Can I try both before deciding?",
                  a: "Yes. ListingAI offers a free tier with watermarked output. Metes offers three free standalone tools and per-listing pricing means no commitment required to try a full kit.",
                },
                {
                  q: "Is one easier to use?",
                  a: "ListingAI has a longer track record (31,000+ users) and more polished UX in places. Metes is newer but the workflow is intentionally minimal: upload photos, paste notes, get a kit. Both are usable by non-technical agents.",
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
        <div className="relative mx-auto w-full max-w-[960px] px-6 lg:px-8">
          <div className="mx-auto max-w-[720px] text-center">
            <h2 className="mb-4 font-manrope text-[clamp(28px,4vw,42px)] font-medium leading-[1.1] tracking-[0.005em] text-[#F4F0E8]">
              Try Metes for <em className="not-italic text-[#B89968]">free</em>.
            </h2>
            <p className="mb-8 text-[clamp(14px,1.2vw,16px)] leading-[1.65] text-[rgba(244,240,232,0.78)]">
              Three free tools live now, all using the same generation engine as the $35 kits. Or generate your first listing kit for $35 — no subscription, photos and notes only.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-[#F4F0E8] px-6 py-3 font-manrope text-[14px] font-medium text-[#14271E] no-underline hover:opacity-90"
              >
                Get started — $35
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/tools/listing-description-checker"
                className="inline-flex items-center gap-2 rounded-lg border border-[rgba(244,240,232,0.3)] px-6 py-3 font-manrope text-[14px] font-medium text-[#F4F0E8] no-underline hover:bg-[rgba(244,240,232,0.05)]"
              >
                Try a free tool first
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}