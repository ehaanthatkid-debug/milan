import type { Metadata } from "next";
import { Suspense } from "react";
import { photos } from "@/data/images";
import { EventsPageClient } from "@/components/events/EventsPageClient";
import { PageIntro } from "@/components/ui/PageIntro";
import { CardSkeleton } from "@/components/ui/States";
import { toISODate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Events",
  description: "Eid, Navratri, Diwali, Vaisakhi, Holi, music, wedding, and campus events across Seattle, Bellevue, Redmond, Sammamish, and Kirkland.",
};

export default function EventsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Events"
        title={
          <>
            Find your next <em>celebration</em>
          </>
        }
        description="Eid festivals, garba nights, Diwali melas, Vaisakhi, qawwali, Holi, and kids' workshops — South Asian events from every tradition across Seattle and the Eastside, in one calendar."
        images={[photos.garbaTwirl, photos.lampsBazaar, photos.gatkaWheel]}
      />
      <Suspense
        fallback={
          <div className="mx-auto mt-40 grid max-w-[1400px] gap-x-6 gap-y-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
            {Array.from({ length: 6 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <EventsPageClient serverToday={toISODate(new Date())} />
      </Suspense>
    </>
  );
}
