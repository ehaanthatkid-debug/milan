"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { MilanMark } from "@/components/brand/Logo";
import { Skeleton } from "@/components/ui/States";
import { BRAND } from "@/lib/brand";

/** A real, scannable QR code for a ticket. */
export function TicketQR({ value, className }: { value: string; className?: string }) {
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    QRCode.toString(value, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#2B1810", light: "#FFFFFF" } })
      .then((s) => alive && setSvg(s))
      .catch(() => alive && setSvg(null));
    return () => {
      alive = false;
    };
  }, [value]);

  if (!svg) return <Skeleton className={className} />;
  return <div className={`[&>svg]:size-full ${className ?? ""}`} role="img" aria-label={`QR code for ticket ${value}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function TicketStub({
  code,
  index,
  count,
  title,
  date,
  tier,
  holder,
}: {
  code: string;
  index: number;
  count: number;
  title: string;
  date: string;
  tier: string;
  holder: string;
}) {
  return (
    <div className="relative flex overflow-hidden rounded-3xl border border-sand bg-white shadow-card print:break-inside-avoid">
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-maroon">
          <MilanMark className="size-5" />
          <span className="font-display text-sm font-semibold text-ink">{BRAND.name}</span>
          <span className="ml-auto text-xs text-ink-mute">
            Ticket {index + 1} of {count}
          </span>
        </div>
        <p className="font-display mt-3 line-clamp-2 text-lg leading-snug text-ink">{title}</p>
        <p className="mt-1 text-sm text-ink-soft">{date}</p>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-4 text-xs">
          <div>
            <p className="font-semibold tracking-wider text-ink-mute uppercase">Admit</p>
            <p className="mt-0.5 truncate font-medium text-ink">{holder}</p>
          </div>
          <div>
            <p className="font-semibold tracking-wider text-ink-mute uppercase">Ticket</p>
            <p className="mt-0.5 truncate font-medium text-ink">{tier}</p>
          </div>
        </div>
      </div>
      <div className="relative flex w-36 shrink-0 flex-col items-center justify-center gap-2 border-l-2 border-dashed border-sand bg-ivory-100 p-3 sm:w-40">
        <span className="absolute -top-3 -left-3 size-6 rounded-full bg-ivory" aria-hidden="true" />
        <span className="absolute -bottom-3 -left-3 size-6 rounded-full bg-ivory" aria-hidden="true" />
        <TicketQR value={`${BRAND.name.toUpperCase()}|${code}`} className="aspect-square w-full rounded-lg" />
        <p className="font-mono text-[0.65rem] tracking-wider text-ink-soft">{code}</p>
      </div>
    </div>
  );
}
