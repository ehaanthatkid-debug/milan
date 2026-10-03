import Image from "next/image";
import type { ReactNode } from "react";
import { Eyebrow } from "./SectionHeading";

/** Editorial header used at the top of the Events, Closet, and Vendors pages. */
export function PageIntro({
  eyebrow,
  title,
  description,
  images,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  images: [string, string, string];
  aside?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8 lg:pt-10">
      <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="font-display mt-3 text-[2.6rem] leading-[1.02] text-balance text-ink sm:text-6xl lg:text-[4.2rem] [&_em]:text-maroon">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">{description}</p>
          {aside}
        </div>
        <div className="hidden h-44 items-end justify-end gap-3 lg:flex" aria-hidden="true">
          {images.map((src, i) => (
            <div
              key={src}
              className="relative overflow-hidden rounded-[1.4rem] shadow-card ring-4 ring-ivory"
              style={{
                width: [120, 150, 120][i],
                height: ["78%", "100%", "64%"][i],
                transform: `rotate(${[-4, 0, 5][i]}deg)`,
              }}
            >
              <Image src={src} alt="" fill sizes="150px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
