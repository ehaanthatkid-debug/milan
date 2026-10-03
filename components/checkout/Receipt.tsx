import Image from "next/image";
import { SERVICE_FEE_RATE } from "@/data/shared";
import { BRAND } from "@/lib/brand";
import type { PaymentInfo, StoredOrder } from "@/lib/orders";
import { formatMoney, formatShortDate } from "@/lib/utils";

export function paymentLabel(p: PaymentInfo) {
  if (p.method === "apple_pay") return "Apple Pay";
  if (p.method === "google_pay") return "Google Pay";
  if (p.method === "card") return `${p.brand ?? "Card"} ending ${p.last4}`;
  return "No payment needed";
}

/** Itemized receipt for a completed order — used on the confirmation page and in My bookings. */
export function Receipt({ order }: { order: StoredOrder }) {
  const free = order.total === 0;
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-sand/80 bg-white/80 shadow-card print:shadow-none">
      <div className="flex gap-4 border-b border-sand/80 p-5 sm:p-6">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl sm:size-24">
          <Image src={order.image} alt="" fill sizes="96px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-gold-deep uppercase">{order.eyebrow}</p>
          <p className="font-display mt-1 text-xl leading-snug text-ink sm:text-2xl">{order.title}</p>
          <p className="mt-1 text-sm text-ink-mute">
            {BRAND.name} order {order.number} · {formatShortDate(order.createdAt.slice(0, 10))}
          </p>
        </div>
      </div>
      <dl className="grid grid-cols-1 gap-4 border-b border-sand/80 p-5 text-sm sm:grid-cols-3 sm:p-6">
        {order.facts.map((f) => (
          <div key={f.label}>
            <dt className="text-xs font-semibold tracking-wider text-ink-mute uppercase">{f.label}</dt>
            <dd className="mt-1 font-medium text-ink">{f.value}</dd>
          </div>
        ))}
      </dl>
      <div className="space-y-2.5 p-5 text-sm sm:p-6">
        {order.lines.map((l) => (
          <div key={l.label} className="flex justify-between gap-4">
            <span className="text-ink-soft">
              {l.label}
              {l.detail && <span className="text-ink-mute"> · {l.detail}</span>}
            </span>
            <span className="text-ink">{l.amount === 0 ? "Free" : formatMoney(l.amount)}</span>
          </div>
        ))}
        {order.discount > 0 && (
          <div className="flex justify-between gap-4 text-leaf">
            <span>Promo {order.promoCode}</span>
            <span>−{formatMoney(order.discount)}</span>
          </div>
        )}
        {!free && (
          <div className="flex justify-between gap-4">
            <span className="text-ink-soft">Service fee ({Math.round(SERVICE_FEE_RATE * 100)}%)</span>
            <span className={order.serviceFee === 0 ? "text-leaf" : "text-ink"}>
              {order.serviceFee === 0 ? "Waived" : formatMoney(order.serviceFee)}
            </span>
          </div>
        )}
        {order.deposit > 0 && (
          <div className="flex justify-between gap-4">
            <span className="text-ink-soft">Refundable deposit</span>
            <span className="text-ink">{formatMoney(order.deposit)}</span>
          </div>
        )}
        <div className="flex justify-between gap-4 border-t border-sand/80 pt-3 text-base font-semibold text-ink">
          <span>Total</span>
          <span>{free ? "Free" : formatMoney(order.total)}</span>
        </div>
        {!free && (
          <div className="flex justify-between gap-4 text-ink-soft">
            <span>Paid today · {paymentLabel(order.payment)}</span>
            <span>{formatMoney(order.paidToday)}</span>
          </div>
        )}
        {order.schedule.map((s) => (
          <div key={s.label} className="flex justify-between gap-4 text-ink-mute">
            <span>
              {s.label}
              {s.date ? ` · due ${formatShortDate(s.date)}` : ""}
            </span>
            <span>{formatMoney(s.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
