import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Magazine-style photo layout for detail pages: one large image with up to
 * three smaller ones beside it on desktop; a swipeable strip on phones.
 */
export function PhotoMosaic({ images, alt }: { images: string[]; alt: string }) {
  const [main, ...rest] = images;
  const side = rest.slice(0, 3);

  return (
    <>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6 md:hidden">
        {images.map((src, i) => (
          <div key={src} className="relative aspect-[4/3] w-[88vw] shrink-0 snap-center overflow-hidden rounded-3xl bg-ivory-200">
            <Image src={src} alt={i === 0 ? alt : ""} fill preload={i === 0} sizes="90vw" className="object-cover" />
          </div>
        ))}
      </div>

      <div
        className={cn(
          "hidden h-[460px] gap-3 md:grid lg:h-[540px]",
          side.length === 0 ? "grid-cols-1" : side.length === 1 ? "grid-cols-[2fr_1fr]" : "grid-cols-[2fr_1fr] grid-rows-2",
          side.length === 3 && "grid-cols-[2fr_1fr_1fr]",
        )}
      >
        <div className={cn("relative overflow-hidden rounded-[1.75rem] bg-ivory-200", side.length >= 2 && "row-span-2")}>
          <Image src={main} alt={alt} fill preload sizes="(min-width: 1400px) 900px, 66vw" className="object-cover" />
        </div>
        {side.map((src, i) => (
          <div
            key={src}
            className={cn(
              "relative overflow-hidden rounded-[1.75rem] bg-ivory-200",
              side.length === 3 && i === 0 && "row-span-2",
            )}
          >
            <Image src={src} alt="" fill sizes="(min-width: 1024px) 460px, 33vw" className="object-cover" />
          </div>
        ))}
      </div>
    </>
  );
}
