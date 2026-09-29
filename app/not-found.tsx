import Image from "next/image";
import { ArrowLeft, Ticket } from "lucide-react";
import { photos } from "@/data/images";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";

export default function NotFound() {
  return (
    <section className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pt-16">
      <div>
        <Eyebrow>Error 404</Eyebrow>
        <h1 className="font-display mt-4 text-5xl leading-[1.02] text-balance text-ink sm:text-6xl">
          This page wandered off to <em className="text-maroon">a garba night.</em>
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
          We couldn&apos;t find what you were looking for — but there&apos;s plenty happening this week.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/events" size="lg">
            <Ticket className="size-4" /> Browse events
          </ButtonLink>
          <ButtonLink href="/" variant="outline" size="lg">
            <ArrowLeft className="size-4" /> Back home
          </ButtonLink>
        </div>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift">
        <Image
          src={photos.garbaTwirl}
          alt="A dancer twirling in a colorful chaniya choli"
          fill
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-cover object-[center_30%]"
        />
      </div>
    </section>
  );
}
