import { Skeleton } from "./States";

/** Placeholder layout shown while a detail page loads. */
export function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8 lg:pt-10" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-32 rounded-full" />
      <Skeleton className="mt-6 h-5 w-40" />
      <Skeleton className="mt-4 h-14 w-full max-w-2xl" />
      <Skeleton className="mt-3 h-5 w-80" />
      <div className="mt-8 grid grid-cols-1 h-[320px] gap-3 md:h-[460px] md:grid-cols-[2fr_1fr]">
        <Skeleton className="rounded-[1.75rem]" />
        <div className="hidden gap-3 md:grid md:grid-rows-2">
          <Skeleton className="rounded-[1.75rem]" />
          <Skeleton className="rounded-[1.75rem]" />
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-3">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-96 rounded-[1.75rem]" />
      </div>
    </div>
  );
}
