import type { Metadata } from "next";
import { DescriptionCheckerClient } from "./DescriptionCheckerClient";

export const metadata: Metadata = {
  title: "Free Listing Description Checker — MLS Quality Analyzer",
  description:
    "Paste your MLS listing description and get instant feedback on hook strength, AI tells, clichés, length, and more. Free, no signup for first 3 scans.",
  keywords: [
    "listing description checker",
    "real estate description analyzer",
    "MLS description checker",
    "listing description tool",
    "AI listing description detector",
    "real estate description tips",
    "how to write MLS descriptions",
  ],
  alternates: {
    canonical: "https://www.metes.app/tools/listing-description-checker",
  },
  openGraph: {
    title: "Free Listing Description Checker",
    description:
      "Get instant feedback on your MLS description. Catches AI tells, real estate clichés, weak hooks, and length issues. Free.",
    url: "https://www.metes.app/tools/listing-description-checker",
    siteName: "metes",
    type: "website",
    images: [
      {
        url: "https://www.metes.app/og/listing-description-checker.png",
        width: 1200,
        height: 630,
        alt: "metes Listing Description Checker — free tool for real estate agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Listing Description Checker",
    description:
      "Paste your description. Get instant feedback on hooks, AI tells, clichés, and length. Free.",
    images: ["https://www.metes.app/og/listing-description-checker.png"],
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <DescriptionCheckerClient />;
}