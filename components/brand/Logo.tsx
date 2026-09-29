import Link from "next/link";
import { cn } from "@/lib/utils";

export function DiyaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="utsav-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4CD7E" />
          <stop offset="100%" stopColor="#C89B3C" />
        </linearGradient>
      </defs>
      <path d="M16 3.5c2.9 3.4 4 6.1 3.3 8.3-.5 1.7-1.8 2.8-3.3 3.1-1.5-.3-2.8-1.4-3.3-3.1-.7-2.2.4-4.9 3.3-8.3Z" fill="url(#utsav-flame)" />
      <path d="M3.5 17.5h25c-.6 5.9-5.9 10-12.5 10s-11.9-4.1-12.5-10Z" fill="currentColor" />
      <path d="M7.5 21.2c2.3 1.6 5.2 2.4 8.5 2.4s6.2-.8 8.5-2.4" stroke="#E8B15B" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.9" />
    </svg>
  );
}

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      aria-label="Utsav home"
      className={cn(
        "group inline-flex items-center gap-2",
        tone === "dark" ? "text-maroon" : "text-ivory",
        className,
      )}
    >
      <DiyaMark className="size-8 transition-transform duration-500 ease-[var(--ease-soft)] group-hover:-rotate-6" />
      <span
        className={cn(
          "font-display text-[1.7rem] leading-none font-semibold",
          tone === "dark" ? "text-ink" : "text-ivory",
        )}
      >
        Utsav
      </span>
    </Link>
  );
}
