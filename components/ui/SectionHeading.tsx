import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Ornament } from "./Ornament";

export function Eyebrow({ children, className, tone = "dark" }: { children: ReactNode; className?: string; tone?: "dark" | "light" }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.2em] uppercase",
        tone === "dark" ? "text-gold-deep" : "text-saffron",
        className,
      )}
    >
      <Ornament className="size-3" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
  tone = "dark",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className={cn("flex flex-col gap-5 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-3xl">
        {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
        <h2
          className={cn(
            "font-display mt-3 text-[2rem] leading-[1.05] text-balance sm:text-[2.6rem] lg:text-[3.1rem]",
            tone === "dark" ? "text-ink [&_em]:text-maroon" : "text-ivory [&_em]:text-saffron",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className={cn("mt-4 max-w-xl text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-ink-soft" : "text-ivory/75")}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
