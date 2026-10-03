import type { Metadata } from "next";
import { Suspense } from "react";
import { ProfileView } from "@/components/profile/ProfileView";
import { Skeleton } from "@/components/ui/States";

export const metadata: Metadata = {
  title: "Your profile",
  robots: { index: false },
};

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl space-y-4 px-4 pt-10 sm:px-6 lg:px-8">
          <Skeleton className="h-48 rounded-[2rem]" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 rounded-[1.75rem]" />
        </div>
      }
    >
      <ProfileView />
    </Suspense>
  );
}
