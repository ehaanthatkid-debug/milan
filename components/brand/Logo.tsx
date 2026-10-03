import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Two overlapping rings — "milan", coming together. */
export function MilanMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <circle cx="12" cy="16" r="8.25" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="20" cy="16" r="8.25" stroke="#C89B3C" strokeWidth="3.5" />
      <path d="M16 8.785A8.25 8.25 0 0 1 16 23.215" stroke="currentColor" strokeWidth="3.5" />
    </svg>
  );
}

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      aria-label={`${BRAND.name} home`}
      className={cn("group inline-flex items-center gap-2", tone === "dark" ? "text-maroon" : "text-ivory", className)}
    >
      <MilanMark className="size-8 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:rotate-12" />
      <span className={cn("font-display text-[1.7rem] leading-none font-semibold", tone === "dark" ? "text-ink" : "text-ivory")}>
        {BRAND.name}
      </span>
    </Link>
  );
}
