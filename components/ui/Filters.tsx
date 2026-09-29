"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FilterChip({
  active,
  onClick,
  children,
  layoutGroup,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  layoutGroup: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "relative inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors active:scale-[0.97]",
        active ? "border-maroon text-ivory" : "border-sand bg-white/50 text-ink-soft hover:border-maroon/30 hover:text-ink",
      )}
    >
      {active && (
        <motion.span
          layoutId={`${layoutGroup}-chip`}
          className="absolute inset-0 rounded-full bg-maroon"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

export function SelectPill({
  label,
  value,
  onChange,
  options,
  icon,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: ReactNode;
  className?: string;
}) {
  const active = value !== options[0]?.value;
  return (
    <label
      className={cn(
        "relative inline-flex h-10 shrink-0 items-center gap-2 rounded-full border pr-9 pl-4 text-sm font-medium transition-colors",
        active ? "border-maroon/40 bg-maroon-soft text-maroon" : "border-sand bg-white/50 text-ink-soft hover:border-maroon/30",
        className,
      )}
    >
      {icon}
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none whitespace-nowrap">{options.find((o) => o.value === value)?.label}</span>
      <ChevronDown className="pointer-events-none absolute right-3 size-4 opacity-70" />
    </label>
  );
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  layoutGroup,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; icon?: ReactNode }[];
  layoutGroup: string;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex shrink-0 rounded-full border border-sand bg-white/50 p-1", className)} role="radiogroup">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.label || o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors",
              active ? "text-ivory" : "text-ink-soft hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId={`${layoutGroup}-seg`}
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative inline-flex items-center gap-1.5">
              {o.icon}
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
