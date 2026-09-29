import { Reveal } from "@/components/ui/Reveal";

const stats = [
  { value: "140+", label: "events this season" },
  { value: "60", label: "verified local vendors" },
  { value: "320", label: "outfits in the closet" },
  { value: "5", label: "cities, one community" },
];

export function StatsStrip() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 lg:px-8">
      <Reveal>
        <dl className="grid grid-cols-2 divide-sand/80 rounded-3xl border border-sand/80 bg-ivory-100/60 sm:grid-cols-4 sm:divide-x">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-5 py-5 sm:px-8 sm:py-7 ${i < 2 ? "border-b border-sand/80 sm:border-b-0" : ""} ${i % 2 === 0 ? "border-r border-sand/80 sm:border-r-0" : ""}`}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="font-display block text-3xl text-maroon sm:text-4xl">{s.value}</span>
                <span className="mt-1 block text-sm text-ink-soft">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
