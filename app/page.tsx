import { events } from "@/data/events";
import { Hero } from "@/components/home/Hero";
import { StatsStrip } from "@/components/home/StatsStrip";
import { ThisWeek } from "@/components/home/ThisWeek";
import { ExploreGrid } from "@/components/home/ExploreGrid";
import { ClosetBand } from "@/components/home/ClosetBand";
import { FeaturedVendors } from "@/components/home/FeaturedVendors";
import { CommunityVoices } from "@/components/home/CommunityVoices";
import { NewsletterBand } from "@/components/home/NewsletterBand";
import { toISODate } from "@/lib/utils";

export default function HomePage() {
  const spotlight = events.find((e) => e.slug === "eastside-navratri-garba-raas") ?? events[0];

  return (
    <>
      <Hero spotlight={spotlight} />
      <StatsStrip />
      <ThisWeek serverToday={toISODate(new Date())} />
      <ExploreGrid />
      <ClosetBand />
      <FeaturedVendors />
      <CommunityVoices />
      <NewsletterBand />
    </>
  );
}
