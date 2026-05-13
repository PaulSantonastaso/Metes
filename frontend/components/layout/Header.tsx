import Link from "next/link";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

interface HeaderProps {
  /**
   * Visual variant.
   * - "light" — cream background, forest text (default, matches homepage)
   * - "dark"  — forest background, cream text (for use on dark-content pages)
   */
  variant?: "light" | "dark";

  /**
   * Whether the header sticks to the top of the viewport on scroll.
   * Defaults to true.
   */
  sticky?: boolean;
}

// ─────────────────────────────────────────────────────────────────
// Header — shared across homepage, tools, guides
// ─────────────────────────────────────────────────────────────────

export function Header({ variant = "light", sticky = true }: HeaderProps) {
  const isDark = variant === "dark";

  // ── Container classes ──
  const containerClasses = [
    "w-full border-b",
    sticky ? "sticky top-0 z-50" : "",
    isDark
      ? "border-[rgba(244,240,232,0.12)] bg-[#1F3D2E]"
      : "border-[rgba(20,39,30,0.10)] bg-[#EFEAE0]",
  ]
    .filter(Boolean)
    .join(" ");

  // ── Logo text color ──
  const logoColor = isDark ? "text-[#F4F0E8]" : "text-[#1F3D2E]";

  // ── Logo mark — outer square color ──
  const logoOuterClasses = isDark
    ? "bg-[#F4F0E8]"
    : "bg-[#1F3D2E]";

  // ── Logo mark — inner inset border color ──
  // Gold accent regardless of variant — it's the brand signature
  const logoInsetBorder = "border-[#B89968]";

  // ── Nav link color ──
  const linkColor = isDark
    ? "text-[rgba(244,240,232,0.72)] hover:text-[#F4F0E8]"
    : "text-[#4A6B53] hover:text-[#1F3D2E]";

  return (
    <header className={containerClasses}>
      <div className="mx-auto flex h-[60px] w-full max-w-[1280px] items-center justify-between px-6 lg:px-12">
        {/* ── Logo (square mark + wordmark) ── */}
        <Link
          href="/"
          aria-label="metes home"
          className={`flex items-center gap-2 font-manrope text-[17px] font-bold no-underline transition-opacity hover:opacity-90 ${logoColor}`}
        >
          {/* Logo mark — outer square with inset gold square */}
          <span
            className={`relative inline-block h-6 w-6 shrink-0 rounded-[6px] ${logoOuterClasses}`}
            aria-hidden="true"
          >
            <span
              className={`absolute inset-[6px] rounded-[2px] border-[1.5px] ${logoInsetBorder}`}
            />
          </span>
          metes
        </Link>

        {/* ── Nav links ── */}
        <nav className="flex items-center gap-6">
          <Link
            href="/#how-it-works"
            className={`text-[13px] font-medium no-underline transition-colors ${linkColor}`}
          >
            How it works
          </Link>
          <Link
            href="/#pricing"
            className={`text-[13px] font-medium no-underline transition-colors ${linkColor}`}
          >
            Pricing
          </Link>
        </nav>
      </div>
    </header>
  );
}