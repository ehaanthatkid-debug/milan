"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, CreditCard, FlaskConical, Lock, Wand2, X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { TEST_CARDS } from "@/lib/payments";
import { PROMOS } from "@/lib/promo";
import { cn } from "@/lib/utils";

/* ---------- Form state & validation ---------- */

export type FormFields = {
  email: string;
  name: string;
  phone: string;
  address1: string;
  address2: string;
  addrCity: string;
  addrZip: string;
  venue: string;
  startTime: string;
  notes: string;
  card: string;
  expiry: string;
  cvc: string;
  cardName: string;
  country: string;
  zip: string;
};

export type FieldKey = keyof FormFields;
export type FieldErrors = Partial<Record<FieldKey, string>>;

export const EMPTY_FIELDS: FormFields = {
  email: "",
  name: "",
  phone: "",
  address1: "",
  address2: "",
  addrCity: "",
  addrZip: "",
  venue: "",
  startTime: "",
  notes: "",
  card: "",
  expiry: "",
  cvc: "",
  cardName: "",
  country: "United States",
  zip: "",
};

export function cardBrand(card: string) {
  const d = card.replace(/\D/g, "");
  if (/^4/.test(d)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "Amex";
  if (/^6/.test(d)) return "Discover";
  return null;
}

function luhn(digits: string) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let n = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

const cardLength = (card: string) => (cardBrand(card) === "Amex" ? 15 : 16);
const cvcLength = (card: string) => (cardBrand(card) === "Amex" ? 4 : 3);

export function validate(
  f: FormFields,
  opts: { needsAddress: boolean; needsEventDetails: boolean; needsCard: boolean },
): FieldErrors {
  const e: FieldErrors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email address.";
  if (f.name.trim().length < 2) e.name = "Enter your full name.";
  if (f.phone && f.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a 10-digit phone number.";

  if (opts.needsAddress) {
    if (f.address1.trim().length < 5) e.address1 = "Enter a street address.";
    if (f.addrCity.trim().length < 2) e.addrCity = "Enter a city.";
    if (!/^\d{5}$/.test(f.addrZip)) e.addrZip = "Enter a 5-digit ZIP code.";
  }
  if (opts.needsEventDetails && f.venue.trim().length < 3) e.venue = "Tell the vendor where the event is.";

  if (opts.needsCard) {
    const digits = f.card.replace(/\D/g, "");
    if (digits.length !== cardLength(digits) || !luhn(digits)) e.card = "Your card number is invalid.";
    const [mm, yy] = f.expiry.split("/").map((s) => Number(s.trim()));
    const now = new Date();
    const expired =
      !mm || mm > 12 || !yy || 2000 + yy < now.getFullYear() || (2000 + yy === now.getFullYear() && mm < now.getMonth() + 1);
    if (expired) e.expiry = f.expiry.length < 7 ? "Your card's expiration date is incomplete." : "Your card's expiration date is in the past.";
    if (f.cvc.length !== cvcLength(digits)) e.cvc = "Your card's security code is incomplete.";
    if (f.cardName.trim().length < 2) e.cardName = "Enter the name on your card.";
    if (f.country === "United States" && !/^\d{5}$/.test(f.zip)) e.zip = "Enter a 5-digit ZIP code.";
  }
  return e;
}

export function formatCard(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 16);
  if (cardBrand(d) === "Amex") {
    return d.slice(0, 15).replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "));
  }
  return d.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiry(value: string, prev: string) {
  const d = value.replace(/\D/g, "").slice(0, 4);
  if (d.length === 0) return "";
  if (d.length === 1 && Number(d) > 1) return `0${d} / `;
  if (d.length === 2 && value.length > prev.length) return `${d} / `;
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)} / ${d.slice(2)}`;
}

export function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/* ---------- Building blocks ---------- */

const inputBase =
  "h-12 w-full bg-white px-3.5 text-[0.95rem] text-ink placeholder:text-ink-mute/70 transition-shadow focus:relative focus:z-10 focus:outline-none focus:ring-2 focus:ring-maroon/25 disabled:bg-ivory-100";

export function Field({
  label,
  error,
  children,
  aside,
  htmlFor,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  aside?: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
        {aside}
      </div>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-sm text-danger"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TextInput({
  error,
  valid,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean; valid?: boolean }) {
  return (
    <div className="relative">
      <input
        {...props}
        aria-invalid={error || undefined}
        className={cn(inputBase, "rounded-xl border pr-10", error ? "border-danger" : "border-sand-deep/70", className)}
      />
      {valid && !error && (
        <Check className="pointer-events-none absolute top-1/2 right-3.5 z-20 size-4 -translate-y-1/2 text-leaf" strokeWidth={2.5} />
      )}
    </div>
  );
}

/* ---------- Card details ---------- */

type CardKey = "card" | "expiry" | "cvc" | "cardName" | "country" | "zip";

export function CardFields({
  fields,
  errors,
  set,
  touch,
  disabled,
}: {
  fields: FormFields;
  errors: FieldErrors;
  set: (k: FieldKey, v: string) => void;
  touch: (k: FieldKey) => void;
  disabled?: boolean;
}) {
  const expiryRef = useRef<HTMLInputElement>(null);
  const cvcRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const brand = cardBrand(fields.card);
  const cardErr = errors.card || errors.expiry || errors.cvc;
  const digits = fields.card.replace(/\D/g, "");
  const cardComplete = digits.length === cardLength(digits) && luhn(digits);

  function onCard(v: string) {
    const formatted = formatCard(v);
    set("card", formatted);
    const d = formatted.replace(/\D/g, "");
    if (d.length === cardLength(d) && luhn(d)) expiryRef.current?.focus();
  }
  function onExpiry(v: string) {
    const formatted = formatExpiry(v, fields.expiry);
    set("expiry", formatted);
    if (formatted.length === 7) cvcRef.current?.focus();
  }
  function onCvc(v: string) {
    const d = v.replace(/\D/g, "").slice(0, cvcLength(fields.card));
    set("cvc", d);
    if (d.length === cvcLength(fields.card)) nameRef.current?.focus();
  }

  const blur = (k: CardKey) => () => touch(k);

  return (
    <div className="space-y-4">
      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">Card information</span>
        <div className={cn("rounded-xl border shadow-[0_1px_2px_rgb(43_24_16/0.05)]", cardErr ? "border-danger" : "border-sand-deep/70")}>
          <div className="relative">
            <input
              inputMode="numeric"
              autoComplete="off"
              aria-label="Card number"
              aria-invalid={!!errors.card || undefined}
              placeholder="1234 1234 1234 1234"
              value={fields.card}
              disabled={disabled}
              onChange={(e) => onCard(e.target.value)}
              onBlur={blur("card")}
              className={cn(inputBase, "rounded-t-xl pr-28 tracking-wide")}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 z-20 flex -translate-y-1/2 items-center gap-1">
              {cardComplete && <Check className="size-4 text-leaf" strokeWidth={2.5} />}
              {brand ? (
                <span className="rounded-md bg-ink px-2 py-1 text-[0.65rem] font-bold tracking-wider text-ivory uppercase">{brand}</span>
              ) : (
                ["Visa", "MC", "Amex"].map((b) => (
                  <span
                    key={b}
                    className="rounded-md border border-sand-deep/60 px-1.5 py-0.5 text-[0.6rem] font-bold tracking-wide text-ink-mute uppercase"
                  >
                    {b}
                  </span>
                ))
              )}
            </span>
          </div>
          <div className="grid grid-cols-2 border-t border-sand-deep/70">
            <input
              ref={expiryRef}
              inputMode="numeric"
              autoComplete="off"
              aria-label="Expiration date"
              aria-invalid={!!errors.expiry || undefined}
              placeholder="MM / YY"
              value={fields.expiry}
              disabled={disabled}
              onChange={(e) => onExpiry(e.target.value)}
              onBlur={blur("expiry")}
              className={cn(inputBase, "rounded-bl-xl border-r border-sand-deep/70")}
            />
            <div className="relative">
              <input
                ref={cvcRef}
                inputMode="numeric"
                autoComplete="off"
                aria-label="Security code"
                aria-invalid={!!errors.cvc || undefined}
                placeholder="CVC"
                value={fields.cvc}
                disabled={disabled}
                onChange={(e) => onCvc(e.target.value)}
                onBlur={blur("cvc")}
                className={cn(inputBase, "rounded-br-xl pr-10")}
              />
              <Lock className="pointer-events-none absolute top-1/2 right-3.5 z-20 size-4 -translate-y-1/2 text-ink-mute" />
            </div>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {cardErr && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1.5 text-sm text-danger"
              role="alert"
            >
              {cardErr}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <Field label="Name on card" error={errors.cardName} htmlFor="cardName">
        <input
          id="cardName"
          ref={nameRef}
          autoComplete="off"
          placeholder="Full name"
          value={fields.cardName}
          disabled={disabled}
          aria-invalid={!!errors.cardName || undefined}
          onChange={(e) => set("cardName", e.target.value)}
          onBlur={blur("cardName")}
          className={cn(inputBase, "rounded-xl border", errors.cardName ? "border-danger" : "border-sand-deep/70")}
        />
      </Field>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">Billing country or region</span>
        <div className={cn("rounded-xl border", errors.zip ? "border-danger" : "border-sand-deep/70")}>
          <select
            aria-label="Country or region"
            value={fields.country}
            disabled={disabled}
            onChange={(e) => set("country", e.target.value)}
            className={cn(inputBase, "cursor-pointer rounded-t-xl")}
          >
            {["United States", "Canada", "India", "Pakistan", "Bangladesh", "United Kingdom"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            inputMode="numeric"
            autoComplete="off"
            aria-label="ZIP code"
            aria-invalid={!!errors.zip || undefined}
            placeholder={fields.country === "United States" ? "ZIP" : "Postal code"}
            value={fields.zip}
            disabled={disabled}
            onChange={(e) => set("zip", e.target.value.slice(0, 10))}
            onBlur={blur("zip")}
            className={cn(inputBase, "rounded-b-xl border-t border-sand-deep/70")}
          />
        </div>
        <AnimatePresence initial={false}>
          {errors.zip && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1.5 text-sm text-danger"
              role="alert"
            >
              {errors.zip}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** "Card" tab label plus the demo helpers: one-click test card and the test-card reference. */
export function CardHeader({ onFillTest, onPickCard }: { onFillTest: () => void; onPickCard: (n: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex flex-wrap items-center justify-between gap-2">
      <span className="inline-flex items-center gap-2 rounded-xl border-2 border-maroon bg-maroon-soft/40 px-3.5 py-2 text-sm font-semibold text-maroon">
        <CreditCard className="size-4" /> Card
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-ink/5"
        >
          <FlaskConical className="size-4" /> Test cards
        </button>
        <button
          type="button"
          onClick={onFillTest}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-maroon transition-colors hover:bg-maroon-soft"
        >
          <Wand2 className="size-4" /> Use test card
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute top-full right-0 z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-sand bg-ivory p-4 shadow-float"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Test mode cards</p>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="text-ink-mute hover:text-ink">
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-ink-mute">Use any future expiry and any CVC. Tap a card to fill it in.</p>
            <ul className="mt-3 space-y-1.5">
              {TEST_CARDS.map((c) => (
                <li key={c.number}>
                  <button
                    type="button"
                    onClick={() => {
                      onPickCard(c.number);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-maroon-soft/60"
                  >
                    <span className="font-mono text-[0.8rem] text-ink">{c.number}</span>
                    <span className="text-xs text-ink-soft">{c.label}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-sand pt-3 text-xs text-ink-mute">
              Promo codes:{" "}
              {PROMOS.map((p, i) => (
                <span key={p.code}>
                  <span className="font-mono font-semibold text-ink">{p.code}</span> ({p.label}){i < PROMOS.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
