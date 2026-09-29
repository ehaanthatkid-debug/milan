import Image from "next/image";
import { Info } from "lucide-react";
import { SERVICE_FEE_RATE } from "@/data/shared";
import type { Order } from "@/lib/checkout";
import { formatMoney } from "@/lib/utils";

export function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="rounded-[1.75rem] border border-sand/80 bg-white/80 p-5 shadow-card sm:p-6">
      <div className="flex gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-ivory-200 sm:size-24">
          <Image src={order.image} alt="" fill sizes="96px" className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-gold-deep uppercase">{order.eyebrow}</p>
          <p className="font-display mt-1 text-xl leading-snug text-ink">{order.title}</p>
        </div>
      </div>

      <dl className="mt-5 space-y-2 rounded-2xl bg-ivory-100 p-4 text-sm ring-1 ring-sand/60">
        {order.facts.map((f) => (
          <div key={f.label} className="flex justify-between gap-4">
            <dt className="shrink-0 text-ink-mute">{f.label}</dt>
            <dd className="text-right font-medium text-ink">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 space-y-3 text-sm">
        {order.lines.map((l) => (
          <div key={l.label} className="flex justify-between gap-4">
            <div>
              <p className="font-medium text-ink">{l.label}</p>
              {l.detail && <p className="text-xs text-ink-mute">{l.detail}</p>}
            </div>
            <p className="text-ink">{l.amount === 0 ? "Free" : formatMoney(l.amount)}</p>
          </div>
        ))}
        {order.total > 0 && (
          <>
            <div className="flex justify-between gap-4 border-t border-sand/80 pt-3">
              <p className="text-ink-soft">Subtotal</p>
              <p className="text-ink">{formatMoney(order.subtotal)}</p>
            </div>
            <div className="flex justify-between gap-4">
              <p className="flex items-center gap-1.5 text-ink-soft">
                Utsav service fee ({Math.round(SERVICE_FEE_RATE * 100)}%)
                <span title="Keeps Utsav running: secure payments, buyer protection, and 24/7 support." className="text-ink-mute">
                  <Info className="size-3.5" />
                </span>
              </p>
              <p className="text-ink">{formatMoney(order.serviceFee)}</p>
            </div>
            {order.deposit > 0 && (
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-ink-soft">Security deposit</p>
                  <p className="text-xs text-leaf">Fully refundable after return</p>
                </div>
                <p className="text-ink">{formatMoney(order.deposit)}</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-ink/10 pt-4">
        <p className="font-semibold text-ink">{order.total === 0 ? "Total" : "Total due today"}</p>
        <p className="font-display text-3xl text-ink">{order.total === 0 ? "Free" : formatMoney(order.total)}</p>
      </div>
    </div>
  );
}
