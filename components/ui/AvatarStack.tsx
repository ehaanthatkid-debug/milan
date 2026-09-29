import Image from "next/image";
import { photos } from "@/data/images";
import { cn, formatCount } from "@/lib/utils";

const faces = [photos.garbaTwirl, photos.holiPortrait, photos.kurtaMint, photos.sareeSeafoam];

/** A small overlapping row of attendee photos with a "N going" label. */
export function AvatarStack({
  count,
  className,
  tone = "light",
}: {
  count: number;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("flex items-center", className)}>
      {faces.map((src, i) => (
        <span
          key={src}
          className={cn(
            "relative -ml-2 size-7 overflow-hidden rounded-full border-2 first:ml-0",
            tone === "light" ? "border-maroon-ink/60" : "border-ivory",
          )}
          style={{ zIndex: faces.length - i }}
        >
          <Image src={src} alt="" fill sizes="28px" className="object-cover object-top" />
        </span>
      ))}
      <span className={cn("ml-2 text-sm", tone === "light" ? "text-ivory/80" : "text-ink-soft")}>
        {formatCount(count)} going
      </span>
    </div>
  );
}
