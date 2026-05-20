import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowRight, ImageIcon, ListOrdered, Camera, FileText, Crop, Sparkles, X, Check } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// SEO metadata
// ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Real Estate Photo Curation & Captioning for MLS Listings | metes",
  description:
    "Metes curates your top 25 listing photos, ranks them by marketing impact, writes per-image captions for MLS and Zillow alt text, and renames them for upload. The photo workflow most agents skip.",
  keywords: [
    "real estate photo captions",
    "MLS photo alt text",
    "Zillow photo captions",
    "real estate photo order",
    "MLS photo ordering",
    "listing photo curation",
    "real estate photo naming",
    "AI photo captioning real estate",
  ],
  alternates: {
    canonical: "https://www.metes.app/photo-curation",
  },
  openGraph: {
    title: "Real Estate Photo Curation & Captioning for MLS Listings",
    description:
      "Your top 25 photos, captioned, sorted, ready to upload. The photo workflow most agents skip — done in 60 seconds.",
    url: "https://www.metes.app/photo-curation",
    siteName: "metes",
    type: "website",
    images: [
      {
        url: "https://www.metes.app/og/photo-curation.png",
        width: 1200,
        height: 630,
        alt: "metes Photo Curation & Captioning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Estate Photo Curation & Captioning for MLS Listings",
    description:
      "Your top 25 photos, captioned, sorted, ready to upload. Done in 60 seconds.",
    images: ["https://www.metes.app/og/photo-curation.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ─────────────────────────────────────────────────────────────────
// Brand palette (scoped to page, matching homepage tokens)
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

export default function PhotoCurationPage() {
  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Header />

      {/* ── HERO ── */}
      <section style={{ background: C.creamWarm, padding: "80px 0 64px", borderBottom: `1px solid ${C.border}` }}>
        <div className={CONTENT}>
          <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", border: `1px solid ${C.border}`, borderRadius: "100px", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.06em", color: C.goldDeep, marginBottom: "24px" }}>
              <ImageIcon className="h-3 w-3" strokeWidth={2} />
              PHOTO CURATION & CAPTIONING
            </div>

            <h1 style={{ ...sectionHeadline, fontSize: "clamp(32px, 5vw, 52px)", marginBottom: "20px" }}>
              Your top 25 photos, captioned, sorted, <em style={{ fontStyle: "normal", color: C.goldDeep }}>ready to upload</em>.
            </h1>

            <p style={{ ...sectionSub, fontSize: "clamp(15px, 1.3vw, 18px)", marginBottom: "32px", maxWidth: "640px", margin: "0 auto 32px" }}>
              Most agents upload IMG_3247.JPG with no caption and no alt text — and lose the SEO inside their own listing. Metes ranks your photos by marketing impact, writes per-image captions, and renames every file for clean MLS and Zillow upload.
            </p>

            <Link
              href="/"
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
              Upload your photos and try it
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SIX JOBS GRID ── */}
      <section style={{ background: C.cream, padding: "96px 0" }}>
        <div className={CONTENT}>
          <div style={{ maxWidth: "720px", marginBottom: "56px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.goldDeep, marginBottom: "16px" }}>
              <span style={{ display: "inline-block", height: "1px", width: "18px", background: C.goldDeep }} />
              What the photo workflow actually does
            </div>
            <h2 style={{ ...sectionHeadline, marginBottom: "16px" }}>
              Six jobs, one upload. <em style={{ fontStyle: "normal", color: C.goldDeep }}>Six things you don&apos;t have to do.</em>
            </h2>
            <p style={sectionSub}>
              The photo work in a listing kit takes most agents two to three hours per property. Metes does it in under a minute, then hands you the renamed files with captions ready to paste into every field that asks for one.
            </p>
          </div>

          <div className="photo-grid">
            {[
              {
                icon: ListOrdered,
                title: "Sorted and renamed for MLS upload",
                desc: "Photos ranked by marketing impact — hero shot first, weak shots discarded — then renamed with rank, room, and feature (e.g. 01_hero_front-exterior_brick-and-stone.webp).",
              },
              {
                icon: Camera,
                title: "Room identification per image",
                desc: "Every photo gets a room label (Kitchen, Primary Suite, Backyard) so social posts pull the right image and your captions land in context.",
              },
              {
                icon: Sparkles,
                title: "Feature extraction per image",
                desc: "Concrete features detected from the image itself — quartz island, soaking tub, screened-in pool, tray ceiling — used in captions and pulled into MLS copy.",
              },
              {
                icon: FileText,
                title: "Per-image captions written for you",
                desc: "One sensory, MLS-pasteable caption per photo. Use them for Zillow alt text, MLS photo descriptions, or social media when you post individual images.",
              },
              {
                icon: Crop,
                title: "Crop guidance per platform",
                desc: "Each photo selected for social media comes with aspect ratio (1.91:1 for Facebook, 4:5 for Instagram) and crop notes so you don&apos;t accidentally cut the entry off your hero shot.",
              },
              {
                icon: ImageIcon,
                title: "Curated down to the top 25",
                desc: "Upload 50, get the best 25. The system culls duplicates, near-duplicates, and weak shots so the MLS gallery only shows your strongest work.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: "12px",
                  padding: "24px 24px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  minWidth: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Icon className="h-4 w-4" style={{ color: C.goldDeep, flexShrink: 0 }} strokeWidth={2} />
                  <h3 style={{ fontFamily: "var(--font-manrope, sans-serif)", fontSize: "15px", fontWeight: 600, color: C.ink, letterSpacing: "-0.005em" }}>
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
          .photo-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }
          @media (min-width: 640px) {
            .photo-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          }
          @media (min-width: 1024px) {
            .photo-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
          }
        `}</style>
      </section>

      {/* ── ONE PHOTO, FULL BREAKDOWN ── */}
      <section style={{ background: C.creamWarm, padding: "96px 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className={CONTENT}>
          <div style={{ maxWidth: "720px", marginBottom: "56px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.goldDeep, marginBottom: "16px" }}>
              <span style={{ display: "inline-block", height: "1px", width: "18px", background: C.goldDeep }} />
              One photo, fully unpacked
            </div>
            <h2 style={{ ...sectionHeadline, marginBottom: "16px" }}>
              Here&apos;s <em style={{ fontStyle: "normal", color: C.goldDeep }}>everything you get</em> per image.
            </h2>
            <p style={sectionSub}>
              A real photo from a production listing kit, with every piece of intelligence Metes attaches to it.
            </p>
          </div>

          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "32px", maxWidth: "920px" }}>
            {/* Filename rename */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: C.muted, marginBottom: "10px" }}>
                Filename
              </div>
              <div className="rename-row">
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "13px", color: C.muted, textDecoration: "line-through", textDecorationColor: "rgba(20,39,30,0.4)" }}>
                  IMG_4738.JPG
                </div>
                <ArrowRight className="h-4 w-4" style={{ color: C.goldDeep, flexShrink: 0 }} />
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "13px", color: C.forest, fontWeight: 500 }}>
                  01_hero_front-exterior_brick-and-stone.webp
                </div>
              </div>
            </div>

            {/* Two-column meta */}
            <div className="photo-meta-row" style={{ marginBottom: "28px" }}>
              <div>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: C.muted, marginBottom: "8px" }}>
                  Room
                </div>
                <div style={{ fontSize: "14px", color: C.ink, fontWeight: 500 }}>Front Exterior</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: C.muted, marginBottom: "8px" }}>
                  Marketing rank
                </div>
                <div style={{ fontSize: "14px", color: C.ink, fontWeight: 500 }}>01 — Hero shot</div>
              </div>
            </div>

            {/* Features */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: C.muted, marginBottom: "10px" }}>
                Features detected
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {["Brick and Stone Facade", "Gabled Roofline", "Covered Entryway", "Two-Car Garage", "Landscaped Yard", "Large Windows"].map((feat) => (
                  <span
                    key={feat}
                    style={{
                      fontSize: "12px",
                      color: C.forest,
                      background: "rgba(74,107,83,0.10)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontWeight: 500,
                    }}
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: C.muted, marginBottom: "10px" }}>
                Caption (MLS / Zillow alt text)
              </div>
              <p style={{ fontSize: "14.5px", lineHeight: 1.65, color: C.ink, fontStyle: "italic", padding: "16px 18px", background: "rgba(184,153,104,0.06)", borderLeft: `3px solid ${C.gold}`, borderRadius: "0 8px 8px 0" }}>
                &ldquo;Brick and stone textures meet a gabled roofline and two-car garage, offering an immediate sense of arrival upon pulling into the driveway.&rdquo;
              </p>
            </div>

            {/* Crop guidance */}
            <div>
              <div style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "10px", letterSpacing: "0.10em", textTransform: "uppercase", color: C.muted, marginBottom: "10px" }}>
                Crop guidance (when used socially)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ fontSize: "13px", color: C.inkSoft }}>
                  <span style={{ fontWeight: 600, color: C.ink }}>Facebook (1.91:1)</span> — Keep the full front elevation centered. Avoid tight crops that cut off the roofline, entry, or driveway.
                </div>
                <div style={{ fontSize: "13px", color: C.inkSoft }}>
                  <span style={{ fontWeight: 600, color: C.ink }}>Instagram (4:5)</span> — Center on the entryway and front-facing brick. Acceptable to crop the garage edge if needed.
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .rename-row {
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
          .photo-meta-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }
          @media (min-width: 640px) {
            .rename-row { flex-direction: row; align-items: center; gap: 14px; }
            .photo-meta-row { grid-template-columns: 1fr 1fr; gap: 24px; }
          }
        `}</style>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <section style={{ background: C.cream, padding: "96px 0" }}>
        <div className={CONTENT}>
          <div style={{ maxWidth: "720px", marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.goldDeep, marginBottom: "16px" }}>
              <span style={{ display: "inline-block", height: "1px", width: "18px", background: C.goldDeep }} />
              The difference, side by side
            </div>
            <h2 style={{ ...sectionHeadline, marginBottom: "16px" }}>
              What most agents upload — <em style={{ fontStyle: "normal", color: C.goldDeep }}>and what Metes delivers</em>.
            </h2>
          </div>

          <div className="before-after-grid" style={{ maxWidth: "960px" }}>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "28px 30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <X className="h-4 w-4" style={{ color: C.warn, flexShrink: 0 }} strokeWidth={2.5} />
                <h3 style={{ fontFamily: "var(--font-manrope, sans-serif)", fontSize: "18px", fontWeight: 600, color: C.ink }}>
                  Without Metes
                </h3>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  "IMG_3201.JPG, IMG_3457.JPG, IMG_3892.JPG — no order, no context",
                  "Photo descriptions left blank or set to room name only",
                  "Zillow alt text fields empty — invisible to accessibility readers and search",
                  "Manual sort through 50 photos to find the hero shot",
                  "Social posts use whatever photo happened to be uploaded first",
                  "Two to three hours of work per listing",
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: "13.5px", lineHeight: 1.55, color: C.inkSoft, paddingLeft: "20px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: "4px", color: "rgba(201,123,92,0.5)" }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "28px 30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <Check className="h-4 w-4" style={{ color: C.pass, flexShrink: 0 }} strokeWidth={2.5} />
                <h3 style={{ fontFamily: "var(--font-manrope, sans-serif)", fontSize: "18px", fontWeight: 600, color: C.ink }}>
                  With Metes
                </h3>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  "01_hero, 02_kitchen, 03_primary — sorted by impact, named for clarity",
                  "One sensory caption per image, ready to paste",
                  "Alt text written for every photo, formatted for MLS and Zillow",
                  "Top 25 already selected from your upload pool",
                  "Hero shot ranked, social posts pull the right photo per platform",
                  "Done in 60 seconds",
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: "13.5px", lineHeight: 1.55, color: C.ink, paddingLeft: "20px", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, top: "4px", color: C.pass }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <style>{`
          .before-after-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 14px;
          }
          @media (min-width: 768px) {
            .before-after-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
          }
        `}</style>
      </section>

      {/* ── WHERE CAPTIONS GET USED ── */}
      <section style={{ background: C.forestDeep, padding: "96px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(184,153,104,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(184,153,104,0.06) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
        <div className={CONTENT} style={{ position: "relative" }}>
          <div style={{ maxWidth: "720px", marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.goldSoft, marginBottom: "16px" }}>
              <span style={{ display: "inline-block", height: "1px", width: "18px", background: C.goldSoft }} />
              One file, six places
            </div>
            <h2 style={{ ...sectionHeadline, color: C.creamWarm, marginBottom: "16px" }}>
              Where your <em style={{ fontStyle: "normal", color: C.gold }}>captions go to work</em>.
            </h2>
            <p style={{ ...sectionSub, color: C.creamText }}>
              One generation, multiple downstream uses. The captions file is the most-pasted document in your listing kit.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "780px" }}>
            {[
              { name: "MLS photo description fields", desc: "Many MLSes have a description field per photo. Most agents skip it. Metes fills it." },
              { name: "Zillow image alt text", desc: "Zillow uses alt text for accessibility and indirectly for search. Empty alt text is wasted real estate inside your own listing." },
              { name: "Compass, Redfin, Realtor.com captions", desc: "Same captions, same upload workflow. Paste once per platform." },
              { name: "Social media image-by-image posts", desc: "When you post individual photos to Instagram or Facebook, the caption is already written and platform-appropriate." },
              { name: "Email campaign photo embeds", desc: "The email kit pulls captions directly so embedded property photos have context for buyers scrolling fast." },
              { name: "Listing presentation handouts", desc: "Print the photos with their captions for an in-person meeting. Sellers see the marketing depth firsthand." },
            ].map(({ name, desc }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "16px 0", borderBottom: i < 5 ? `1px solid ${C.borderDark}` : "none" }}>
                <span style={{ fontFamily: "var(--font-jetbrains, monospace)", fontSize: "11px", color: C.goldSoft, fontWeight: 600, marginTop: "2px", flexShrink: 0, minWidth: "20px" }}>
                  0{i + 1}
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-manrope, sans-serif)", fontSize: "14.5px", fontWeight: 600, color: C.creamWarm, marginBottom: "4px" }}>
                    {name}
                  </div>
                  <div style={{ fontSize: "13px", lineHeight: 1.55, color: C.creamText }}>
                    {desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
              What agents ask about <em style={{ fontStyle: "normal", color: C.goldDeep }}>photo curation</em>.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "880px" }}>
            {[
              {
                q: "Why does MLS photo ordering matter?",
                a: "MLS photo order is the order buyers see when they pull up your listing on Zillow, Redfin, or any aggregator. The first three photos do most of the work — they're what shows up in search results, on Facebook share previews, and in email alerts. If the hero shot isn't first, you're leading with your weakest foot. Most agents sort photos by upload order, which is essentially random.",
              },
              {
                q: "Does Zillow actually use alt text in their algorithm?",
                a: "Zillow has confirmed they use photo metadata including alt text for both accessibility and ranking. Empty alt text fields are a missed signal. More importantly, accessibility is increasingly a compliance requirement — and the same captions that help Zillow help any visually impaired buyer using a screen reader.",
              },
              {
                q: "Can I edit the captions before publishing?",
                a: "Yes. Metes delivers captions as a plain text file. Every caption is meant to be a strong default, not a final-and-locked output. If the room is staged differently than expected or a feature got mislabeled, edit the line in the captions file before pasting into MLS or Zillow.",
              },
              {
                q: "What if my photos are out of order or I want to override the ranking?",
                a: "The ranking is meant to be a strong opinion you can override. The renamed filenames (01_hero, 02_kitchen, etc.) determine MLS upload order — rename them yourself if you want a different sequence. The numbering convention makes reordering as easy as renaming a few files.",
              },
              {
                q: "How does this compare to BoxBrownie or other photo services?",
                a: "BoxBrownie and similar services handle photo enhancement — sky replacement, virtual staging, color correction. They don't write captions, rank photos by marketing impact, or generate alt text. Different jobs. Metes handles the marketing intelligence layer; photo enhancement services handle the pixel layer. They're complementary, not competing.",
              },
              {
                q: "Are the captions Fair Housing compliant?",
                a: "Yes. Every caption is reviewed by the same compliance audit that runs on the MLS description, social posts, and emails. The most common photo-caption violations — projecting demographics or making assumptions about who lives in the home — are caught and revised before delivery.",
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
              Every listing kit. Every photo.
            </div>
            <h2 style={{ ...sectionHeadline, color: C.creamWarm, marginBottom: "20px" }}>
              Photo curation ships with <em style={{ fontStyle: "normal", color: C.gold }}>every $35 listing</em>.
            </h2>
            <p style={{ ...sectionSub, color: C.creamText, marginBottom: "32px", maxWidth: "600px" }}>
              No add-on, no upgrade. Upload up to 50 photos with your property notes and Metes delivers the top 25 sorted, renamed, captioned, and ready for upload alongside your MLS copy, social posts, email campaign, and neighborhood guide.
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
                href="/compliance-audit"
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