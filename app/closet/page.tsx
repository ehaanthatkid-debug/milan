import type { Metadata } from "next";
import { CalendarCheck, RotateCcw, Truck } from "lucide-react";
import { photos } from "@/data/images";
import { ClosetExplorer } from "@/components/closet/ClosetExplorer";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = {
  title: "Festive Closet",
  description: "Rent or buy lehengas, sherwanis, sarees, and kids' festive wear from Eastside boutiques and neighbors.",
};

const steps = [
  { icon: CalendarCheck, title: "Pick your dates", text: "Four days, from the day before your event." },
  { icon: Truck, title: "Pick up or delivery", text: "Steamed, bagged, and ready to wear." },
  { icon: RotateCcw, title: "Return it — we clean it", text: "Deposit back within 48 hours." },
];

export default function ClosetPage() {
  return (
    <>
      <PageIntro
        eyebrow="The Festive Closet"
        title={
          <>
            Rent the look. <em>Love it again.</em>
          </>
        }
        description="Designer lehengas, sherwanis, and sarees from Eastside boutiques and neighbors' closets — for a fraction of retail, cleaned and ready for your next celebration."
        images={[photos.lehengaBridalRed, photos.sherwaniIvoryRed, photos.sareeRaniPink]}
        aside={
          <ol className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                className="flex flex-col items-start gap-2.5 rounded-2xl bg-ivory-100 p-3 ring-1 ring-sand/70 sm:flex-row sm:gap-3 sm:p-4"
              >
                <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-maroon text-ivory">
                  <Icon className="size-4" />
                  <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-saffron text-[0.6rem] font-bold text-maroon-ink">
                    {i + 1}
                  </span>
                </span>
                <span>
                  <span className="block text-[0.8rem] leading-snug font-semibold text-ink sm:text-sm">{title}</span>
                  <span className="mt-0.5 hidden text-xs leading-relaxed text-ink-mute sm:block">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        }
      />
      <ClosetExplorer />
    </>
  );
}
