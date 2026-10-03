import Image from "next/image";
import { ArrowRight, RotateCcw, Sparkles, Truck } from "lucide-react";
import { photos } from "@/data/images";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";

const perks = [
  { icon: Sparkles, title: "Cleaned & steamed", text: "Every piece is professionally dry-cleaned between wears." },
  { icon: Truck, title: "Pickup or delivery", text: "Collect in Bellevue or get it delivered anywhere on the Eastside." },
  { icon: RotateCcw, title: "Free fit exchange", text: "Wrong size? Swap it within 24 hours, on us." },
];

export function ClosetBand() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
      <div className="relative overflow-hidden rounded-[2rem] bg-ivory-100 ring-1 ring-sand/70 lg:rounded-[2.5rem]">
        <div
          className="pointer-events-none absolute -right-24 -bottom-24 size-96 rounded-full bg-saffron/25 blur-3xl"
          aria-hidden="true"
        />
        <div className="grid grid-cols-1 items-center gap-12 p-6 sm:p-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:p-16">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative mx-auto aspect-[5/5.4] max-w-[520px]">
              <div className="absolute top-0 left-0 h-[82%] w-[62%] overflow-hidden rounded-[1.75rem] shadow-lift">
                <Image
                  src={photos.lehengaBridalRed}
                  alt="Bride in a red and gold embroidered lehenga"
                  fill
                  sizes="(min-width: 1024px) 320px, 60vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute top-[12%] right-0 h-[48%] w-[42%] overflow-hidden rounded-[1.5rem] shadow-lift ring-4 ring-ivory-100">
                <Image
                  src={photos.sherwaniIvoryRed}
                  alt="Ivory embroidered sherwani with a red safa"
                  fill
                  sizes="(min-width: 1024px) 220px, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute right-[6%] bottom-0 h-[40%] w-[46%] overflow-hidden rounded-[1.5rem] shadow-lift ring-4 ring-ivory-100">
                <Image
                  src={photos.sareeRaniPink}
                  alt="Rani pink Kanjeevaram silk saree"
                  fill
                  sizes="(min-width: 1024px) 240px, 45vw"
                  className="object-cover object-top"
                />
              </div>
              <PriceTag className="top-[58%] left-[-4%] sm:left-[-6%]" label="Bridal lehenga" price="Rent $180" note="4 days" />
              <PriceTag className="top-[4%] right-[-2%]" label="Sherwani" price="Rent $120" note="or buy $780" small />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="order-1 lg:order-2">
            <Eyebrow>The Festive Closet</Eyebrow>
            <h2 className="font-display mt-3 text-[2.1rem] leading-[1.05] text-ink sm:text-5xl lg:text-[3.4rem]">
              Wear the lehenga. <em className="text-maroon">Skip the price tag.</em>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
              Borrow designer lehengas, sherwanis, and sarees from local boutiques and neighbors — or sell the ones
              you&rsquo;ve worn once to someone who&rsquo;ll love them next.
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {perks.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3 xl:flex-col">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-maroon-soft text-maroon">
                    <Icon className="size-[18px]" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-mute">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/closet" size="lg">
                Browse the closet <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/about#partners" variant="outline" size="lg">
                List an outfit
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PriceTag({
  label,
  price,
  note,
  className,
  small,
}: {
  label: string;
  price: string;
  note: string;
  className: string;
  small?: boolean;
}) {
  return (
    <div
      className={`absolute rounded-2xl bg-ivory/95 px-4 py-3 shadow-float ring-1 ring-sand backdrop-blur ${small ? "hidden sm:block" : ""} ${className}`}
    >
      <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-deep uppercase">{label}</p>
      <p className="font-display text-xl leading-tight text-ink">{price}</p>
      <p className="text-xs text-ink-mute">{note}</p>
    </div>
  );
}
