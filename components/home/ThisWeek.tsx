"use client";

import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { events } from "@/data/events";
import { EventCard } from "@/components/cards/EventCard";
import { ButtonLink } from "@/components/ui/Button";
import { Rail } from "@/components/ui/Rail";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { daysBetween, parseLocalDate } from "@/lib/utils";
import { useToday } from "@/lib/use-today";

export function ThisWeek({ serverToday }: { serverToday: string }) {
  const today = useToday(serverToday);

  const { list, thisWeekCount } = useMemo(() => {
    const now = parseLocalDate(today);
    const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
    const upcoming = sorted.filter((e) => daysBetween(now, parseLocalDate(e.date)) >= 0);
    const count = upcoming.filter((e) => daysBetween(now, parseLocalDate(e.date)) <= 7).length;
    return { list: (upcoming.length ? upcoming : sorted).slice(0, 8), thisWeekCount: count };
  }, [today]);

  const isThisWeek = thisWeekCount >= 2;

  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
      <Reveal>
        <SectionHeading
          eyebrow={isThisWeek ? `${thisWeekCount} events in the next 7 days` : "On the calendar"}
          title={
            isThisWeek ? (
              <>
                Happening <em>this week</em>
              </>
            ) : (
              <>
                Coming up <em>next</em>
              </>
            )
          }
          action={
            <ButtonLink href="/events" variant="outline" size="sm" className="md:mr-28">
              All events <ArrowRight className="size-4" />
            </ButtonLink>
          }
        />
      </Reveal>
      <Reveal delay={0.1} className="mt-10">
        <Rail label="Upcoming events" itemClassName="w-[82vw] sm:w-[360px] lg:w-[380px]">
          {list.map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </Rail>
      </Reveal>
    </section>
  );
}
