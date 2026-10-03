import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { Outfit } from "@/data/closet";
import { SaveButton } from "@/components/ui/SaveButton";
import { cn, formatPrice } from "@/lib/utils";

export function OutfitCard({ outfit, className }: { outfit: Outfit; className?: string }) {
  const lowest = outfit.rentPrice ?? outfit.buyPrice ?? outfit.retailPrice;
  const savings = Math.round((1 - lowest / outfit.retailPrice) * 100);

  return (
    <Link href={`/closet/${outfit.slug}`} className={cn("group block", className)}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-ivory-200 shadow-card transition-shadow duration-500 group-hover:shadow-lift">
        <Image
          src={outfit.images[0]}
          alt={outfit.name}
          fill
          sizes="(min-width: 1280px) 320px, (min-width: 768px) 33vw, 50vw"
          className="object-cover object-top transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-ink/45 via-transparent to-transparent" />
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 sm:top-3 sm:left-3 sm:flex-row">
          {outfit.rentPrice && (
            <span className="rounded-full bg-ivory/95 px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide text-maroon uppercase shadow-sm">
              Rent
            </span>
          )}
          {outfit.buyPrice && (
            <span className="rounded-full bg-maroon/90 px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide text-ivory uppercase shadow-sm">
              Buy
            </span>
          )}
        </div>
        <SaveButton label={outfit.name} item={{ kind: "outfit", id: outfit.slug }} className="absolute top-2.5 right-2.5 size-9 sm:top-3 sm:right-3 sm:size-10" />
        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-saffron px-2.5 py-1 text-[0.7rem] font-semibold text-maroon-ink sm:bottom-3 sm:left-3">
          {savings}% off retail
        </span>
      </div>
      <div className="px-0.5 pt-3 sm:px-1 sm:pt-4">
        <p className="flex items-center justify-between gap-2 text-[0.7rem] font-semibold tracking-[0.12em] text-gold-deep uppercase">
          <span className="truncate">{outfit.type}</span>
          <span className="flex shrink-0 items-center gap-1 tracking-normal text-ink normal-case">
            <Star className="size-3.5 fill-gold text-gold" />
            {outfit.owner.rating.toFixed(1)}
          </span>
        </p>
        <h3 className="font-display mt-1 line-clamp-2 text-[1.05rem] leading-snug text-ink transition-colors group-hover:text-maroon sm:text-[1.25rem]">
          {outfit.name}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-ink-mute sm:text-sm">
          <span className="font-medium text-ink-soft">Size {outfit.size}</span>
          <span aria-hidden="true">·</span>
          <MapPin className="size-3" /> {outfit.city}
        </p>
        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-t border-sand/80 pt-2.5 text-sm">
          {outfit.rentPrice && (
            <span className="text-ink-soft">
              Rent <span className="font-semibold text-ink">{formatPrice(outfit.rentPrice)}</span>
            </span>
          )}
          {outfit.buyPrice && (
            <span className="text-ink-soft">
              Buy <span className="font-semibold text-ink">{formatPrice(outfit.buyPrice)}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
