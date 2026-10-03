import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { Skeleton } from "@/components/ui/States";
import { toISODate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-16 sm:px-6 lg:grid-cols-[1fr_440px] lg:px-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-60" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-96 rounded-[1.75rem]" />
        </div>
      }
    >
      <CheckoutView serverToday={toISODate(new Date())} />
    </Suspense>
  );
}
