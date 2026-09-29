import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "outline" | "ghost" | "light" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ease-[var(--ease-soft)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-maroon text-ivory shadow-[0_8px_20px_-10px_rgb(122_18_48/0.8)] hover:bg-maroon-deep hover:shadow-[0_12px_28px_-10px_rgb(122_18_48/0.9)]",
  gold: "bg-saffron text-maroon-ink hover:bg-gold hover:text-ivory",
  outline: "border border-ink/15 bg-transparent text-ink hover:border-maroon/40 hover:bg-maroon-soft/60 hover:text-maroon",
  ghost: "text-ink hover:bg-ink/5",
  light: "bg-ivory text-maroon-ink hover:bg-white",
  dark: "bg-ink text-ivory hover:bg-maroon-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Common & ComponentProps<"button">) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Common & ComponentProps<typeof Link>) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
