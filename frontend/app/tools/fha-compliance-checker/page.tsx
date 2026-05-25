import type { Metadata } from "next";
import { ComplianceCheckClient } from "./ComplianceCheckClient";

export const metadata: Metadata = {
  title: "Free Fair Housing Compliance Checker for Real Estate Agents | metes",
  description:
    "Free AI tool that scans your MLS description for Fair Housing violations in 3 seconds. Catches accidental discriminatory language before HUD does. No signup required.",
  keywords: [
    "fair housing compliance",
    "FHA compliance checker",
    "real estate listing audit",
    "MLS description checker",
    "fair housing language",
    "real estate compliance tool",
  ],
  alternates: {
    canonical: "https://www.metes.app/tools/fha-compliance-checker",
  },
  openGraph: {
    title: "Free Fair Housing Compliance Checker for Real Estate Agents",
    description:
      "Scan your MLS description for Fair Housing violations in 3 seconds. Free AI-powered audit. No signup.",
    url: "https://www.metes.app/tools/fha-compliance-checker",
    siteName: "metes",
    type: "website",
    images: [
      {
        url: "https://www.metes.app/og/fha-compliance-checker.png",
        width: 1200,
        height: 630,
        alt: "metes Fair Housing Compliance Checker — free tool for real estate agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Fair Housing Compliance Checker for Real Estate Agents",
    description:
      "Scan your MLS description for Fair Housing violations in 3 seconds. Free, no signup.",
    images: ["https://www.metes.app/og/fha-compliance-checker.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ComplianceCheckPage() {
  return <ComplianceCheckClient />;
}