"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock, Loader2, ShieldCheck, Tag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PaymentPlan, PlanId, ScheduledPayment } from "@/lib/checkout";
import { BRAND } from "@/lib/brand";
import type { Promo } from "@/lib/promo";
import { cn, formatMoney, formatShortDate } from "@/lib/utils";

/* ---------- Express checkout ---------- */

export type WalletMethod = "apple_pay" | "google_pay";

export function ExpressCheckout({
  onPay,
  busy,
  disabled,
}: {
  onPay: (m: WalletMethod) => void;
  busy: WalletMethod | null;
  disabled?: boolean;
}) {
  return (
    <div>
      <p className="mb-2.5 text-center text-sm text-ink-mute">Express checkout</p>
      <div className="grid grid-cols-2 gap-2.5">
        {(
          [
            { id: "apple_pay", label: "Apple Pay", className: "bg-black text-white hover:bg-black/85" },
            { id: "google_pay", label: "Google Pay", className: "border border-ink/15 bg-white text-ink hover:bg-ivory-100" },
          ] as const
        ).map((w) => (
          <button
            key={w.id}
            type="button"
            disabled={disabled || busy !== null}
            onClick={() => onPay(w.id)}
            className={cn(
              "flex h-12 items-center justify-center gap-2 rounded-xl text-[0.95rem] font-semibold transition-all active:scale-[0.98] disabled:opacity-60",
              w.className,
            )}
          >
            {busy === w.id ? <Loader2 className="size-4 animate-spin" /> : null}
            {busy === w.id ? "Connecting…" : w.label}
          </button>
        ))}
      </div>
      <div className="my-6 flex items-center gap-3 text-sm text-ink-mute">
        <span className="h-px flex-1 bg-sand" /> or pay with card <span className="h-px flex-1 bg-sand" />
      </div>
    </div>
  );
}

/* ---------- Promo code ---------- */

export function PromoField({
  applied,
  error,
  onApply,
  onRemove,
}: {
  applied: Promo | null;
  error?: string;
  onApply: (code: string) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  if (applied) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-leaf-soft px-3.5 py-2.5 text-sm">
        <span className="flex items-center gap-2 text-leaf">
          <Tag className="size-4" />
          <span className="font-mono font-semibold">{applied.code}</span> · {applied.label}
        </span>
        <button type="button" onClick={onRemove} aria-label="Remove promo code" className="text-leaf/70 hover:text-leaf">
          <X className="size-4" />
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-maroon hover:underline">
        <Tag className="size-4" /> Add a promo code
      </button>
    );
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) onApply(code);
        }}
        className="flex gap-2"
      >
        <input
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Promo code"
          aria-label="Promo code"
          className="h-11 flex-1 rounded-xl border border-sand-deep/70 bg-white px-3.5 font-mono text-sm tracking-wider text-ink uppercase placeholder:font-sans placeholder:tracking-normal placeholder:normal-case focus:ring-2 focus:ring-maroon/25 focus:outline-none"
        />
        <button type="submit" className="h-11 rounded-xl bg-ink px-4 text-sm font-semibold text-ivory transition-colors hover:bg-maroon-ink">
          Apply
        </button>
      </form>
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
}

/* ---------- Payment plan ---------- */

export function PlanPicker({
  plans,
  value,
  onChange,
  dueToday,
  schedule,
}: {
  plans: PaymentPlan[];
  value: PlanId;
  onChange: (p: PlanId) => void;
  dueToday: number;
  schedule: ScheduledPayment[];
}) {
  if (plans.length < 2) return null;
  return (
    <div className="space-y-2.5" role="radiogroup" aria-label="Payment plan">
      {plans.map((p) => {
        const active = p.id === value;
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(p.id)}
            className={cn(
              "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all",
              active ? "border-maroon bg-maroon-soft/50" : "border-sand bg-white/60 hover:border-maroon/30",
            )}
          >
            <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2", active ? "border-maroon" : "border-sand-deep")}>
              {active && <span className="size-2.5 rounded-full bg-maroon" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-ink">{p.title}</span>
              <span className="block text-sm text-ink-mute">{p.description}</span>
              {active && p.id !== "full" && schedule.length > 0 && (
                <span className="mt-2 block space-y-0.5 text-xs text-ink-soft">
                  <span className="block">Today: {formatMoney(dueToday)}</span>
                  {schedule.map((s) => (
                    <span key={s.label} className="block">
                      {s.date ? formatShortDate(s.date) : s.label}: {formatMoney(s.amount)}
                    </span>
                  ))}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Hold timer ---------- */

export function HoldTimer({ minutes, label, onExpire }: { minutes: number; label: string; onExpire: () => void }) {
  const [left, setLeft] = useState(minutes * 60);
  const expired = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (left === 0 && !expired.current) {
      expired.current = true;
      onExpire();
    }
  }, [left, onExpire]);

  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, "0");
  const urgent = left < 120;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm",
        urgent ? "bg-danger/10 text-danger" : "bg-saffron-soft text-gold-deep",
      )}
      role="timer"
      aria-live={urgent ? "polite" : "off"}
    >
      <Clock className="size-4" />
      <span>
        {label} for{" "}
        <span className="font-semibold tabular-nums">
          {mm}:{ss}
        </span>
      </span>
    </div>
  );
}

/* ---------- Bank verification (3-D Secure) ---------- */

export function ThreeDSModal({
  open,
  amount,
  onComplete,
  onFail,
}: {
  open: boolean;
  amount: number;
  onComplete: () => void;
  onFail: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onFail();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onFail]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="threeds-title"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-float"
          >
            <div className="flex items-center justify-between border-b border-sand bg-ivory-100 px-5 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                <ShieldCheck className="size-4 text-leaf" /> Secure verification
              </span>
              <span className="rounded-full bg-saffron-soft px-2 py-0.5 text-[0.65rem] font-bold tracking-wider text-gold-deep uppercase">
                Test mode
              </span>
            </div>
            <div className="p-6">
              <h2 id="threeds-title" className="font-display text-2xl text-ink">
                Verify it&apos;s you
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Your card issuer wants to confirm this payment of <span className="font-semibold text-ink">{formatMoney(amount)}</span>{" "}
                to {BRAND.name}. In a real checkout this is where you&apos;d approve it in your banking app.
              </p>
              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  autoFocus
                  onClick={onComplete}
                  className="h-12 w-full rounded-full bg-maroon font-semibold text-ivory transition-colors hover:bg-maroon-deep"
                >
                  Complete verification
                </button>
                <button
                  type="button"
                  onClick={onFail}
                  className="h-12 w-full rounded-full border border-sand font-medium text-ink-soft transition-colors hover:bg-ivory-100"
                >
                  Fail verification
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
