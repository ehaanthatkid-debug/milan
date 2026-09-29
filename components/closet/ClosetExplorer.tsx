"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownUp, MapPin, Ruler, Shirt, X } from "lucide-react";
import { useMemo, useState } from "react";
import { CLOSET_SIZES, closet, GARMENT_TYPES } from "@/data/closet";
import { CITIES } from "@/data/shared";
import { OutfitCard } from "@/components/cards/OutfitCard";
import { Button } from "@/components/ui/Button";
import { FilterChip, SegmentedControl, SelectPill } from "@/components/ui/Filters";
import { CardSkeleton, EmptyState } from "@/components/ui/States";
import { useSimulatedLoading } from "@/lib/use-simulated-loading";

type Mode = "all" | "rent" | "buy";
type Sort = "featured" | "low" | "high";

const TYPE_OPTIONS = ["All", ...GARMENT_TYPES] as const;
const SIZE_OPTIONS = [{ value: "", label: "Any size" }, ...CLOSET_SIZES.map((s) => ({ value: s, label: s }))];
const CITY_OPTIONS = [{ value: "", label: "All cities" }, ...CITIES.map((c) => ({ value: c, label: c }))];
const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "low", label: "Price: low to high" },
  { value: "high", label: "Price: high to low" },
];

export function ClosetExplorer() {
  const [mode, setMode] = useState<Mode>("all");
  const [type, setType] = useState<string>("All");
  const [size, setSize] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState<Sort>("featured");

  const results = useMemo(() => {
    const price = (o: (typeof closet)[number]) =>
      mode === "buy" ? (o.buyPrice ?? Infinity) : (o.rentPrice ?? o.buyPrice ?? Infinity);
    const list = closet.filter((o) => {
      if (mode === "rent" && !o.rentPrice) return false;
      if (mode === "buy" && !o.buyPrice) return false;
      if (type !== "All" && o.type !== type) return false;
      if (size && o.size !== size) return false;
      if (city && o.city !== city) return false;
      return true;
    });
    if (sort === "featured") return list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return list.sort((a, b) => (sort === "low" ? price(a) - price(b) : price(b) - price(a)));
  }, [mode, type, size, city, sort]);

  const loading = useSimulatedLoading([mode, type, size, city, sort].join("|"));
  const hasFilters = mode !== "all" || type !== "All" || size !== "" || city !== "";

  function clearAll() {
    setMode("all");
    setType("All");
    setSize("");
    setCity("");
  }

  return (
    <>
      <div className="sticky top-16 z-30 mt-8 border-y border-sand/70 bg-ivory/90 backdrop-blur-xl lg:top-20">
        <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SegmentedControl
              value={mode}
              onChange={setMode}
              layoutGroup="closet-mode"
              className="self-start"
              options={[
                { value: "all", label: "Rent or buy" },
                { value: "rent", label: "Rent" },
                { value: "buy", label: "Buy" },
              ]}
            />
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
              {TYPE_OPTIONS.map((t) => (
                <FilterChip key={t} active={type === t} onClick={() => setType(t)} layoutGroup="closet-type">
                  {t}
                </FilterChip>
              ))}
            </div>
          </div>
          <div className="no-scrollbar -mx-4 mt-3 flex items-center gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            <SelectPill label="Size" value={size} onChange={setSize} options={SIZE_OPTIONS} icon={<Ruler className="pointer-events-none size-4" />} />
            <SelectPill label="City" value={city} onChange={setCity} options={CITY_OPTIONS} icon={<MapPin className="pointer-events-none size-4" />} />
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
      </div>

      <section className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <p className="mb-5 text-sm text-ink-soft" aria-live="polite">
          {loading ? (
            "Checking the closet…"
          ) : (
            <>
              <span className="font-semibold text-ink">{results.length}</span> {results.length === 1 ? "outfit" : "outfits"} ready
              for your next celebration
            </>
          )}
        </p>

        {!loading && results.length === 0 ? (
          <EmptyState
            icon={<Shirt className="size-7" strokeWidth={1.6} />}
            title="Nothing in that size just yet"
            description="New pieces arrive every week. Try another size or city — or clear your filters to see the full closet."
            action={<Button onClick={clearAll}>Clear all filters</Button>}
          />
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-6 xl:gap-y-12">
            {loading
              ? Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} aspect="aspect-[3/4]" />)
              : results.map((o, i) => (
                  <motion.div
                    key={o.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.35), ease: [0.22, 1, 0.36, 1] }}
                  >
                    <OutfitCard outfit={o} />
                  </motion.div>
                ))}
          </div>
        )}
      </section>
    </>
  );
}
