import { ArrowRight } from "lucide-react";
import { vendors } from "@/data/vendors";
import { VendorCard } from "@/components/cards/VendorCard";
import { ButtonLink } from "@/components/ui/Button";
import { Rail } from "@/components/ui/Rail";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FeaturedVendors() {
  const featured = vendors.filter((v) => v.featured);

  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
      <Reveal>
        <SectionHeading
          eyebrow="Featured vendors"
          title={
            <>
              The people behind <em>the magic</em>
            </>
          }
          description="Verified DJs, dhol players, mehndi artists, caterers, decorators, and photographers — reviewed by families like yours."
          action={
            <ButtonLink href="/vendors" variant="outline" size="sm" className="md:mr-28">
              All vendors <ArrowRight className="size-4" />
            </ButtonLink>
          }
        />
      </Reveal>
      <Reveal delay={0.1} className="mt-10">
        <Rail label="Featured vendors" itemClassName="w-[74vw] sm:w-[300px] lg:w-[316px]">
          {featured.map((v) => (
            <VendorCard key={v.slug} vendor={v} tall />
          ))}
        </Rail>
      </Reveal>
    </section>
  );
}
