import { cn } from "@/lib/utils";

/** A small four-petal motif used beside eyebrows and as dividers. */
export function Ornament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("shrink-0", className)} fill="currentColor">
      <path d="M12 1.5c1.2 4.3 3.2 6.3 7.5 7.5-4.3 1.2-6.3 3.2-7.5 7.5-1.2-4.3-3.2-6.3-7.5-7.5 4.3-1.2 6.3-3.2 7.5-7.5Z" transform="translate(0 3)" />
    </svg>
  );
}

export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-gold", className)} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/50" />
      <Ornament className="size-3.5" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/50" />
    </div>
  );
}
