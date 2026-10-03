"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownUp, CircleDollarSign, LayoutGrid, MapPin, Star, Store, X } from "lucide-react";
import { useMemo, useState } from "react";
import { VENDOR_CATEGORIES, vendors, type VendorCategory } from "@/data/vendors";
import { CITIES } from "@/data/shared";
import { VendorCard } from "@/components/cards/VendorCard";
import { Button } from "@/components/ui/Button";
import { SelectPill } from "@/components/ui/Filters";
import { CardSkeleton, EmptyState } from "@/components/ui/States";
import { useSimulatedLoading } from "@/lib/use-simulated-loading";
import { cn } from "@/lib/utils";
import { CATEGORY_ICONS } from "./category-icons";

type Sort = "rating" | "reviews" | "price";

const CITY_OPTIONS = [{ value: "", label: "All cities" }, ...CITIES.map((c) => ({ value: c, label: c }))];
const PRICE_OPTIONS = [
  { value: "", label: "Any budget" },
  { value: "$$", label: "$$ and under" },
  { value: "$$$", label: "$$$ and under" },
];
const RATING_OPTIONS = [
  { value: "0", label: "Any rating" },
  { value: "4.8", label: "4.8 stars & up" },
  { value: "4.9", label: "4.9 stars & up" },
];
const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: "rating", label: "Top rated" },
  { value: "reviews", label: "Most reviewed" },
  { value: "price", label: "Starting price" },
];

export function VendorsExplorer({ initialCategory }: { initialCategory?: string }) {
  const [category, setCategory] = useState<VendorCategory | "All">(
    VENDOR_CATEGORIES.includes(initialCategory as VendorCategory) ? (initialCategory as VendorCategory) : "All",
  );
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [sort, setSort] = useState<Sort>("rating");

  const results = useMemo(() => {
    const list = vendors.filter((v) => {
      if (category !== "All" && v.category !== category) return false;
      if (city && v.city !== city) return false;
      if (budget && v.priceRange.length > budget.length) return false;
      if (v.rating < Number(minRating)) return false;
      return true;
    });
    return list.sort((a, b) =>
      sort === "rating" ? b.rating - a.rating || b.reviewCount - a.reviewCount : sort === "reviews" ? b.reviewCount - a.reviewCount : a.priceRange.length - b.priceRange.length,
    );
  }, [category, city, budget, minRating, sort]);

  const loading = useSimulatedLoading([category, city, budget, minRating, sort].join("|"));
  const hasFilters = category !== "All" || city !== "" || budget !== "" || minRating !== "0";

  function clearAll() {
    setCategory("All");
    setCity("");
    setBudget("");
    setMinRating("0");
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: vendors.length };
    for (const v of vendors) c[v.category] = (c[v.category] ?? 0) + 1;
    return c;
  }, []);

  return (
    <>
      <section className="mx-auto mt-8 max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-7 lg:px-0">
          {(["All", ...VENDOR_CATEGORIES] as const).map((c) => {
            const Icon = c === "All" ? LayoutGrid : CATEGORY_ICONS[c];
            const active = category === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(c)}
                className={cn(
                  "group relative flex w-32 shrink-0 flex-col items-start gap-6 overflow-hidden rounded-3xl border p-4 text-left transition-all duration-300 active:scale-[0.98] lg:w-auto",
                  active
                    ? "border-maroon bg-maroon text-ivory shadow-[0_14px_30px_-14px_rgb(122_18_48/0.8)]"
                    : "border-sand bg-white/50 text-ink hover:-translate-y-0.5 hover:border-maroon/30 hover:bg-white",
                )}
              >
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-2xl transition-colors",
                    active ? "bg-ivory/15 text-saffron" : "bg-maroon-soft text-maroon",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block text-sm leading-tight font-semibold">{c === "All" ? "All vendors" : c}</span>
                  <span className={cn("mt-0.5 block text-xs", active ? "text-ivory/70" : "text-ink-mute")}>
                    {counts[c]} listed
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="sticky top-16 z-30 mt-6 border-y border-sand/70 bg-ivory/90 backdrop-blur-xl lg:top-20">
        <div className="no-scrollbar mx-auto flex max-w-[1400px] items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          <SelectPill label="City" value={city} onChange={setCity} options={CITY_OPTIONS} icon={<MapPin className="pointer-events-none size-4" />} />
          <SelectPill
            label="Budget"
            value={budget}
            onChange={setBudget}
            options={PRICE_OPTIONS}
            icon={<CircleDollarSign className="pointer-events-none size-4" />}
          />
          <SelectPill
            label="Rating"
            value={minRating}
            onChange={setMinRating}
            options={RATING_OPTIONS}
            icon={<Star className="pointer-events-none size-4" />}
          />
          <SelectPill
            label="Sort"
            value={sort}
            onChange={(v) => setSort(v as Sort)}
            options={SORT_OPTIONS}
            icon={<ArrowDownUp className="pointer-events-none size-4" />}
          />
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={clearAll}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-maroon hover:bg-maroon-soft"
              >
                <X className="size-4" /> Clear all
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <section className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <p className="mb-5 text-sm text-ink-soft" aria-live="polite">
          {loading ? (
            "Finding vendors…"
          ) : (
            <>
              <span className="font-semibold text-ink">{results.length}</span>{" "}
              {category === "All" ? (results.length === 1 ? "vendor" : "vendors") : category.toLowerCase()} available
              {city ? ` in ${city}` : " across Seattle & the Eastside"}
            </>
          )}
        </p>

        {!loading && results.length === 0 ? (
          <EmptyState
            icon={<Store className="size-7" strokeWidth={1.6} />}
            title="No vendors match — yet"
            description="We're onboarding new vendors every week. Widen your budget or city, or clear your filters."
            action={<Button onClick={clearAll}>Clear all filters</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-6">
            {loading
              ? Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} />)
              : results.map((v, i) => (
                  <motion.div
                    key={v.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.35), ease: [0.22, 1, 0.36, 1] }}
                  >
                    <VendorCard vendor={v} sizes="(min-width: 1280px) 320px, (min-width: 640px) 50vw, 100vw" />
                  </motion.div>
                ))}
          </div>
        )}
      </section>
    </>
  );
}
