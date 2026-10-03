import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import type { Vendor } from "@/data/vendors";
import { RatingInline } from "@/components/ui/Rating";
import { SaveButton } from "@/components/ui/SaveButton";
import { cn, formatPrice } from "@/lib/utils";

export function VendorCard({
  vendor,
  className,
  sizes = "(min-width: 1024px) 320px, 75vw",
  tall = false,
}: {
  vendor: Vendor;
  className?: string;
  sizes?: string;
  tall?: boolean;
}) {
  return (
    <Link href={`/vendors/${vendor.slug}`} className={cn("group block", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl bg-ivory-200 shadow-card transition-shadow duration-500 group-hover:shadow-lift",
          tall ? "aspect-[4/5]" : "aspect-[4/3]",
        )}
      >
        <Image
          src={vendor.image}
          alt={vendor.name}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-ink/50 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 rounded-full bg-ivory/95 px-3 py-1 text-xs font-semibold text-maroon shadow-sm">
          {vendor.category}
        </span>
        <SaveButton label={vendor.name} item={{ kind: "vendor", id: vendor.slug }} className="absolute top-3 right-3" />
        <span className="absolute bottom-3 left-3 rounded-full bg-maroon-ink/45 px-3 py-1 text-xs font-medium text-ivory backdrop-blur-md">
          {vendor.priceRange} · From {formatPrice(vendor.startingPrice)}/{vendor.priceUnit}
        </span>
      </div>
      <div className="px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[1.3rem] leading-snug text-ink transition-colors group-hover:text-maroon">
            {vendor.name}
            {vendor.verified && (
              <BadgeCheck className="ml-1.5 inline size-[18px] align-[-3px] text-gold" aria-label="Verified vendor" />
            )}
          </h3>
          <RatingInline rating={vendor.rating} count={vendor.reviewCount} className="mt-1 shrink-0" />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
          <MapPin className="size-3.5 text-ink-mute" />
          {vendor.city}, WA
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-mute">{vendor.tagline}</p>
      </div>
    </Link>
  );
}
