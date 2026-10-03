"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, MapPin, Search, Sparkles } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { photos } from "@/data/images";
import type { EventItem } from "@/data/events";
import { CITIES } from "@/data/shared";
import { formatShortDate } from "@/lib/utils";
import { SpotlightRsvp } from "@/components/social/Rsvp";

const ease = [0.22, 1, 0.36, 1] as const;

const popular = [
  { label: "Garba this weekend", href: "/events?category=Garba" },
  { label: "Eid & Ramadan", href: "/events?category=Eid" },
  { label: "Kids' events", href: "/events?age=kids" },
  { label: "Lehenga rentals", href: "/closet" },
  { label: "Free events", href: "/events?category=Free" },
];

/** The hero slowly cross-fades between celebrations from different traditions. */
const slides = [
  { src: photos.garbaDiyasHero, alt: "Dancers gather around a garbo lit with diyas during Navratri", position: "object-[35%_center] lg:object-center", label: "Navratri · Bellevue" },
  { src: photos.lampsBazaar, alt: "Glowing lanterns at a Ramadan night market", position: "object-center", label: "Ramadan Night Market · Bellevue" },
  { src: photos.gatkaWheel, alt: "Gatka performers in blue at a Vaisakhi procession", position: "object-center", label: "Vaisakhi Mela · Kirkland" },
  { src: photos.holiCrowd, alt: "A crowd throwing colored powder at a Holi festival", position: "object-center", label: "Holi · Redmond" },
];

const headline = ["Where", "Seattle", "comes", "together", "to"];

export function Hero({ spotlight }: { spotlight: EventItem }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (city) params.set("city", city);
    router.push(`/events${params.size ? `?${params}` : ""}`);
  }

  return (
    <section className="px-3 pt-2 sm:px-6 lg:px-8">
      <div className="relative mx-auto min-h-[640px] max-w-[1400px] overflow-hidden rounded-[2rem] bg-maroon-ink lg:min-h-[700px] lg:rounded-[2.5rem]">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={slide}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.6 }, scale: { duration: 7, ease: "linear" } }}
            >
              <Image
                src={slides[slide].src}
                alt={slides[slide].alt}
                fill
                preload={slide === 0}
                quality={80}
                sizes="(min-width: 1400px) 1400px, 100vw"
                className={`object-cover ${slides[slide].position}`}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-ink via-maroon-ink/40 to-transparent" />
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3 rounded-full bg-maroon-ink/40 py-1.5 pr-2 pl-3.5 text-xs text-ivory/85 backdrop-blur-md sm:top-6 sm:right-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={slide}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="hidden sm:inline"
            >
              {slides[slide].label}
            </motion.span>
          </AnimatePresence>
          <span className="flex gap-1.5">
            {slides.map((sl, i) => (
              <button
                key={sl.label}
                type="button"
                aria-label={`Show ${sl.label}`}
                aria-current={i === slide}
                onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === slide ? "w-5 bg-saffron" : "w-1.5 bg-ivory/50 hover:bg-ivory/80"}`}
              />
            ))}
          </span>
        </div>
        <div className="absolute inset-0 hidden bg-gradient-to-r from-maroon-ink/75 via-maroon-ink/15 to-transparent lg:block" />

        <div className="relative flex min-h-[640px] flex-col justify-end px-5 pt-24 pb-7 sm:px-10 sm:pb-10 lg:min-h-[700px] lg:px-16 lg:pb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-ivory/20 bg-ivory/10 px-3.5 py-1.5 text-xs font-medium text-ivory/90 backdrop-blur-md sm:text-sm"
          >
            <Sparkles className="size-3.5 text-saffron" />
            This month: Navratri, Diwali &amp; a qawwali night<span className="hidden sm:inline"> in Kirkland</span>
          </motion.p>

          <h1 className="font-display mt-5 max-w-3xl text-[2.9rem] leading-[0.98] text-ivory sm:text-6xl lg:text-[5.4rem]">
            {headline.map((word, i) => (
              <span key={word} className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.07, ease }}
                >
                  {word}&nbsp;
                </motion.span>
              </span>
            ))}
            <span className="inline-block overflow-hidden pb-2 align-bottom">
              <motion.em
                className="inline-block pr-2 text-saffron"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + headline.length * 0.07, ease }}
              >
                celebrate.
              </motion.em>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease }}
            className="mt-5 max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg"
          >
            Eid festivals, garba nights, Vaisakhi, Diwali, and the vendors who make them happen — across Seattle and the
            Eastside. Plus a festive closet to borrow the outfit.
          </motion.p>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease }}
            role="search"
            className="mt-7 flex w-full max-w-2xl flex-col gap-2 rounded-[1.75rem] bg-ivory p-2 shadow-float sm:flex-row sm:items-center sm:rounded-full"
          >
            <label className="flex flex-1 items-center gap-3 px-4 py-2.5 sm:py-0">
              <Search className="size-5 shrink-0 text-maroon" />
              <span className="sr-only">What are you celebrating?</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search garba, Diwali, weddings…"
                className="w-full bg-transparent text-[0.98rem] text-ink placeholder:text-ink-mute focus:outline-none"
              />
            </label>
            <div className="hidden h-8 w-px bg-sand sm:block" />
            <label className="relative flex items-center gap-2 border-t border-sand px-4 py-2.5 sm:border-0 sm:py-0">
              <MapPin className="size-4 shrink-0 text-maroon" />
              <span className="sr-only">City</span>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-[0.95rem] text-ink focus:outline-none sm:w-auto"
              >
                <option value="">All cities</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 size-4 text-ink-mute sm:right-1" />
            </label>
            <button
              type="submit"
              className="h-12 rounded-full bg-maroon px-7 font-medium text-ivory transition-all hover:bg-maroon-deep active:scale-[0.97]"
            >
              Search
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            <span className="hidden self-center text-sm text-ivory/60 sm:inline">Popular:</span>
            {popular.map((p) => (
              <Link
                key={p.label}
                href={p.href}
                className="shrink-0 rounded-full border border-ivory/20 bg-ivory/5 px-3.5 py-1.5 text-sm text-ivory/85 backdrop-blur transition-colors hover:border-saffron/60 hover:text-ivory"
              >
                {p.label}
              </Link>
            ))}
          </motion.div>
        </div>

        <SpotlightCard event={spotlight} />
      </div>
    </section>
  );
}

function SpotlightCard({ event }: { event: EventItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, delay: 1.2, ease }}
      className="absolute right-10 bottom-16 hidden w-80 xl:block"
    >
      <div className="group rounded-3xl border border-ivory/15 bg-ivory/10 p-3 text-ivory shadow-float backdrop-blur-xl transition-colors hover:bg-ivory/15">
        <Link href={`/events/${event.slug}`} className="relative block aspect-[16/10] overflow-hidden rounded-2xl">
          <Image src={event.image} alt="" fill sizes="320px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute top-2.5 left-2.5 rounded-full bg-saffron px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide text-maroon-ink uppercase">
            Featured
          </span>
          <span className="absolute top-2.5 right-2.5 grid size-8 place-items-center rounded-full bg-ivory text-maroon transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight className="size-4" />
          </span>
        </Link>
        <div className="px-1.5 pt-3 pb-1">
          <p className="text-xs font-medium tracking-wide text-saffron uppercase">{formatShortDate(event.date)}</p>
          <Link href={`/events/${event.slug}`} className="font-display mt-1 block text-xl leading-snug hover:underline">
            {event.title}
          </Link>
          <div className="mt-3">
            <SpotlightRsvp event={event} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
