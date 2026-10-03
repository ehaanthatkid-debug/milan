import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, HandHeart, Shirt, Store, Ticket, type LucideIcon } from "lucide-react";
import { photos } from "@/data/images";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

type Tile = {
  title: string;
  blurb: string;
  meta: string;
  href: string;
  image: string;
  alt: string;
  icon: LucideIcon;
  className: string;
  sizes: string;
};

const tiles: Tile[] = [
  {
    title: "Events",
    blurb: "Garba, Diwali, Holi, weddings, and campus nights",
    meta: "140+ this season",
    href: "/events",
    image: photos.dancersFestiveLights,
    alt: "Two dancers in bright silk costumes under festival lights",
    icon: Ticket,
    className: "col-span-2 h-64 sm:h-80 lg:col-span-2 lg:row-span-2 lg:h-auto",
    sizes: "(min-width: 1024px) 700px, 100vw",
  },
  {
    title: "Festive Closet",
    blurb: "Rent or buy lehengas, sherwanis, and sarees",
    meta: "Rent from $35",
    href: "/closet",
    image: photos.lehengaMustard,
    alt: "A woman in a mustard and maroon embroidered lehenga",
    icon: Shirt,
    className: "row-span-2 h-full min-h-[22rem] lg:row-span-2",
    sizes: "(min-width: 1024px) 340px, 50vw",
  },
  {
    title: "Vendors",
    blurb: "DJs, dhol, mehndi, catering, decor, photo",
    meta: "60 verified",
    href: "/vendors",
    image: photos.mehndiBangles,
    alt: "Bridal mehndi on hands resting on a red and gold lehenga",
    icon: Store,
    className: "h-[10.5rem] lg:h-auto",
    sizes: "(min-width: 1024px) 340px, 50vw",
  },
  {
    title: "Community",
    blurb: "Cultural orgs, temples, and student groups",
    meta: "40+ partners",
    href: "/about#community",
    image: photos.sangeetMehndiParty,
    alt: "Friends gathered for a mehndi celebration",
    icon: HandHeart,
    className: "h-[10.5rem] lg:h-auto",
    sizes: "(min-width: 1024px) 340px, 50vw",
  },
];

export function ExploreGrid() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
      <Reveal>
        <SectionHeading
          eyebrow="Explore Milan"
          title={
            <>
              Everything the season <em>asks of you</em>
            </>
          }
          description="From the first dandiya workshop to the last baraat, find the event, the outfit, and the people who make it unforgettable."
        />
      </Reveal>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:h-[620px] lg:grid-cols-4 lg:grid-rows-2 lg:gap-5">
        {tiles.map((t, i) => (
          <Reveal key={t.title} delay={i * 0.08} className={t.className}>
            <ExploreTile tile={t} large={i === 0} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ExploreTile({ tile, large }: { tile: Tile; large: boolean }) {
  const Icon = tile.icon;
  return (
    <Link
      href={tile.href}
      className="group relative flex h-full w-full overflow-hidden rounded-3xl bg-maroon-ink shadow-card transition-shadow duration-500 hover:shadow-lift lg:rounded-[2rem]"
    >
      <Image
        src={tile.image}
        alt={tile.alt}
        fill
        sizes={tile.sizes}
        className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-soft)] group-hover:scale-[1.07]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-maroon-ink/90 via-maroon-ink/25 to-transparent" />
      <span className="absolute top-3 left-3 grid size-10 place-items-center rounded-full bg-ivory/90 text-maroon backdrop-blur sm:top-4 sm:left-4 lg:size-11">
        <Icon className="size-[18px] lg:size-5" />
      </span>
      <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full border border-ivory/30 text-ivory transition-all duration-500 group-hover:rotate-45 group-hover:border-saffron group-hover:bg-saffron group-hover:text-maroon-ink sm:top-4 sm:right-4 lg:size-10">
        <ArrowUpRight className="size-4" />
      </span>
      <div className="relative mt-auto p-4 text-ivory sm:p-5 lg:p-7">
        <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-saffron uppercase sm:text-xs">{tile.meta}</p>
        <h3 className={cn("font-display mt-1 leading-tight", large ? "text-3xl sm:text-4xl lg:text-5xl" : "text-xl sm:text-2xl lg:text-3xl")}>
          {tile.title}
        </h3>
        <p className={cn("mt-1.5 text-sm text-ivory/75", large ? "max-w-sm sm:text-base" : "hidden sm:block")}>{tile.blurb}</p>
      </div>
    </Link>
  );
}
