import type { Metadata } from "next";
import { Suspense } from "react";
import { photos } from "@/data/images";
import { CommunityView } from "@/components/community/CommunityView";
import { PageIntro } from "@/components/ui/PageIntro";
import { Skeleton } from "@/components/ui/States";
import { toISODate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Community",
  description: "See who's going, connect with people, and chat before the event.",
};

export default function CommunityPage() {
  return (
    <>
      <PageIntro
        eyebrow="Community"
        title={
          <>
            Go <em>together.</em>
          </>
        }
        description="See which friends are going, meet people with the same plans, and talk before the event — carpools, outfits, and where to meet."
        images={[photos.sangeetMehndiParty, photos.garbaSelfie, photos.sikhFriends]}
      />
      <Suspense
        fallback={
          <div className="mx-auto mt-10 max-w-[1400px] space-y-4 px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-28 rounded-[1.5rem]" />
            <Skeleton className="h-60 rounded-[1.5rem]" />
          </div>
        }
      >
        <CommunityView serverToday={toISODate(new Date())} />
      </Suspense>
    </>
  );
}
