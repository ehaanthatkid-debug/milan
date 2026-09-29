import type { ReactNode } from "react";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} aria-hidden="true" />;
}

export function CardSkeleton({ aspect = "aspect-[4/3]" }: { aspect?: string }) {
  return (
    <div aria-hidden="true">
      <Skeleton className={cn("rounded-3xl", aspect)} />
      <div className="space-y-2.5 px-1 pt-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3.5 w-1/2" />
        <div className="flex justify-between border-t border-sand/60 pt-3">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-20" />
        </div>
      </div>
    </div>
  );
}

export function ListRowSkeleton() {
  return (
    <div className="flex gap-4 rounded-3xl border border-sand/70 bg-white/40 p-3" aria-hidden="true">
      <Skeleton className="aspect-[4/3] w-36 shrink-0 rounded-2xl sm:w-52" />
      <div className="flex-1 space-y-2.5 py-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-[2rem] border border-dashed border-sand-deep/70 bg-ivory-100/50 px-6 py-16 text-center sm:py-20">
      <div className="relative grid size-20 place-items-center">
        <span className="absolute inset-0 rotate-45 rounded-[1.4rem] border border-gold/40" />
        <span className="absolute inset-2 rounded-full bg-maroon-soft" />
        <span className="relative text-maroon">{icon ?? <SearchX className="size-7" strokeWidth={1.6} />}</span>
      </div>
      <h3 className="font-display mt-6 text-2xl text-ink sm:text-3xl">{title}</h3>
      <p className="mt-2 max-w-sm text-ink-soft">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
