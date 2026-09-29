"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, MapPin, Search, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { photos } from "@/data/images";
import type { EventItem } from "@/data/events";
import { CITIES } from "@/data/shared";
import { formatShortDate } from "@/lib/utils";
import { AvatarStack } from "@/components/ui/AvatarStack";

const ease = [0.22, 1, 0.36, 1] as const;

const popular = [
  { label: "Garba this weekend", href: "/events?category=Garba" },
  { label: "Lehenga rentals", href: "/closet" },
  { label: "Mehndi artists", href: "/vendors?category=Mehndi+artists" },
  { label: "Free events", href: "/events?category=Free" },
];

const headline = ["Where", "Seattle", "comes", "together", "to"];

export function Hero({ spotlight }: { spotlight: EventItem }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");

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
          <Image
            src={photos.garbaDiyasHero}
            alt="Dancers gather around a garbo lit with diyas and marigolds during Navratri"
            fill
            preload
            quality={80}
            sizes="(min-width: 1400px) 1400px, 100vw"
            className="object-cover object-[35%_center] lg:object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-ink via-maroon-ink/40 to-transparent" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-maroon-ink/75 via-maroon-ink/15 to-transparent lg:block" />

        <div className="relative flex min-h-[640px] flex-col justify-end px-5 pt-24 pb-7 sm:px-10 sm:pb-10 lg:min-h-[700px] lg:px-16 lg:pb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-ivory/20 bg-ivory/10 px-3.5 py-1.5 text-xs font-medium text-ivory/90 backdrop-blur-md sm:text-sm"
          >
            <Sparkles className="size-3.5 text-saffron" />
            Navratri begins Oct 11<span className="hidden sm:inline"> — garba nights are filling fast</span>
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
            Garba nights, Diwali melas, and wedding-season vendors across Seattle and the Eastside — plus a festive closet
            to borrow the outfit.
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
      <Link
        href={`/events/${event.slug}`}
        className="group block rounded-3xl border border-ivory/15 bg-ivory/10 p-3 text-ivory shadow-float backdrop-blur-xl transition-colors hover:bg-ivory/15"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
          <Image src={event.image} alt="" fill sizes="320px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute top-2.5 left-2.5 rounded-full bg-saffron px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide text-maroon-ink uppercase">
            Featured
          </span>
        </div>
        <div className="px-1.5 pt-3 pb-1">
          <p className="text-xs font-medium tracking-wide text-saffron uppercase">{formatShortDate(event.date)}</p>
          <p className="font-display mt-1 text-xl leading-snug">{event.title}</p>
          <div className="mt-3 flex items-center justify-between">
            <AvatarStack count={event.attending} />

            <span className="grid size-8 place-items-center rounded-full bg-ivory text-maroon transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
