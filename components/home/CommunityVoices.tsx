import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const voices = [
  {
    quote:
      "We used to promote Navratri through six WhatsApp groups and a flyer at the temple. Utsav sold out our Meydenbauer night two weeks early.",
    name: "Hetal Shah",
    role: "Organizer, Eastside Garba Collective",
    initials: "HS",
  },
  {
    quote:
      "I rented my sister's sangeet lehenga for $140 instead of buying one for $900. It arrived steamed, fit perfectly, and I sent it back the next morning.",
    name: "Aditi Menon",
    role: "Redmond",
    initials: "AM",
  },
  {
    quote:
      "Half my bookings now come through Utsav. Families find me, see real reviews, and book a date without twenty back-and-forth texts.",
    name: "Noor Qureshi",
    role: "Henna by Noor, Kirkland",
    initials: "NQ",
  },
];

export function CommunityVoices() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
      <Reveal>
        <SectionHeading
          eyebrow="From the community"
          title={
            <>
              Made for the aunties, the organizers, <em>and everyone in between</em>
            </>
          }
        />
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-3 lg:gap-6">
        {voices.map((v, i) => (
          <Reveal key={v.name} delay={i * 0.08}>
            <figure className="flex h-full flex-col rounded-3xl border border-sand/80 bg-white/60 p-7 shadow-card lg:p-8">
              <Quote className="size-8 text-gold" strokeWidth={1.4} />
              <blockquote className="font-display mt-5 flex-1 text-[1.3rem] leading-snug text-ink">
                “{v.quote}”
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-sand/80 pt-5">
                <span className="font-display grid size-11 place-items-center rounded-full bg-maroon text-sm font-semibold text-ivory">
                  {v.initials}
                </span>
                <span>
                  <span className="block font-semibold text-ink">{v.name}</span>
                  <span className="block text-sm text-ink-mute">{v.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
