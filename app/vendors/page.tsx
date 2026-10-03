import type { Metadata } from "next";
import { Suspense } from "react";
import { photos } from "@/data/images";
import { VendorsPageClient } from "@/components/vendors/VendorsPageClient";
import { PageIntro } from "@/components/ui/PageIntro";
import { CardSkeleton } from "@/components/ui/States";

export const metadata: Metadata = {
  title: "Vendors",
  description: "DJs, dhol players, mehndi artists, caterers, decorators, and photographers for South Asian celebrations in Seattle.",
};

export default function VendorsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Vendors"
        title={
          <>
            The people who make it <em>unforgettable</em>
          </>
        }
        description="Verified DJs, dhol players, mehndi artists, caterers, decorators, and photographers across Seattle and the Eastside — with real reviews and live availability."
        images={[photos.mehndiBridal, photos.dholSolo, photos.feastSpread]}
      />
      <Suspense
        fallback={
          <div className="mx-auto mt-40 grid grid-cols-1 max-w-[1400px] gap-x-6 gap-y-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {Array.from({ length: 8 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <VendorsPageClient />
      </Suspense>
    </>
  );
}
