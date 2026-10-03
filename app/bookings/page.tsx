import type { Metadata } from "next";
import { BookingsView } from "@/components/bookings/BookingsView";
import { toISODate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My bookings",
  robots: { index: false },
};

export default function BookingsPage() {
  return <BookingsView serverToday={toISODate(new Date())} />;
}
