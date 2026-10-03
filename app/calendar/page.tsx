import type { Metadata } from "next";
import { photos } from "@/data/images";
import { CalendarPageClient } from "@/components/calendar/CalendarPageClient";
import { PageIntro } from "@/components/ui/PageIntro";
import { toISODate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Every South Asian event in Seattle and the Eastside, month by month — plus the ones you and your friends are going to.",
};

export default function CalendarPage() {
  return (
    <>
      <PageIntro
        eyebrow="Calendar"
        title={
          <>
            What&apos;s on, <em>month by month</em>
          </>
        }
        description="Every event on Milan in one calendar. Switch to My events to see what you're going to, or Friends going to see where your people will be."
        images={[photos.diyasWarm, photos.eidKids, photos.holiCrowd]}
      />
      <CalendarPageClient serverToday={toISODate(new Date())} />
    </>
  );
}
