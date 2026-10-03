import Image from "next/image";
import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { SERVICE_FEE_RATE } from "@/data/shared";
import type { Order, PlanId, Pricing } from "@/lib/checkout";
import { BRAND } from "@/lib/brand";
import type { Promo } from "@/lib/promo";
import { formatMoney, formatShortDate } from "@/lib/utils";

export function OrderSummary({
  order,
  pricing,
  plan,
  promo,
  children,
}: {
  order: Order;
  pricing: Pricing;
  plan: PlanId;
  promo: Promo | null;
  children?: ReactNode;
}) {
  const free = pricing.total === 0;
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

      {children && <div className="mt-4 space-y-3">{children}</div>}

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
        {!free && (
          <>
            <div className="flex justify-between gap-4 border-t border-sand/80 pt-3">
              <p className="text-ink-soft">Subtotal</p>
              <p className="text-ink">{formatMoney(pricing.subtotal)}</p>
            </div>
            {pricing.discount > 0 && promo && (
              <div className="flex justify-between gap-4 text-leaf">
                <p>
                  Promo <span className="font-mono font-semibold">{promo.code}</span>
                </p>
                <p>−{formatMoney(pricing.discount)}</p>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <p className="flex items-center gap-1.5 text-ink-soft">
                {BRAND.name} service fee ({Math.round(SERVICE_FEE_RATE * 100)}%)
                <span title="Covers secure payments, buyer protection, and refunds when plans fall through." className="text-ink-mute">
                  <Info className="size-3.5" />
                </span>
              </p>
              <p className={pricing.feeWaived ? "text-leaf" : "text-ink"}>
                {pricing.feeWaived ? "Waived" : formatMoney(pricing.serviceFee)}
              </p>
            </div>
            {pricing.deposit > 0 && (
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-ink-soft">Security deposit</p>
                  <p className="text-xs text-leaf">Refunded after you return it</p>
                </div>
                <p className="text-ink">{formatMoney(pricing.deposit)}</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 border-t border-ink/10 pt-4">
        <div className="flex items-baseline justify-between">
          <p className="font-semibold text-ink">{free ? "Total" : plan === "full" ? "Total due today" : "Total"}</p>
          <p className="font-display text-3xl text-ink">{free ? "Free" : formatMoney(pricing.total)}</p>
        </div>
        {!free && plan !== "full" && (
          <div className="mt-3 space-y-1.5 rounded-2xl bg-maroon-soft/50 p-3.5 text-sm">
            <div className="flex justify-between font-semibold text-maroon-ink">
              <span>Due today</span>
              <span>{formatMoney(pricing.dueToday)}</span>
            </div>
            {pricing.schedule.map((s) => (
              <div key={s.label} className="flex justify-between text-ink-soft">
                <span>{s.date ? `${s.label} · ${formatShortDate(s.date)}` : s.label}</span>
                <span>{formatMoney(s.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
