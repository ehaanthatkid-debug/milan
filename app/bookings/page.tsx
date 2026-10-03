import type { Metadata } from "next";
import { RedirectTo } from "@/components/ui/RedirectTo";

export const metadata: Metadata = { title: "My bookings", robots: { index: false } };

/** Old "My bookings" links now open the Orders tab of your profile. */
export default function BookingsPage() {
  return <RedirectTo href="/profile" />;
}
