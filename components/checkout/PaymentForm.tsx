"use client";

import { CreditCard, Lock, Wand2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PaymentFields = {
  email: string;
  name: string;
  phone: string;
  card: string;
  expiry: string;
  cvc: string;
  cardName: string;
  country: string;
  zip: string;
};

export type FieldErrors = Partial<Record<keyof PaymentFields, string>>;

export const EMPTY_FIELDS: PaymentFields = {
  email: "",
  name: "",
  phone: "",
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

export function validate(f: PaymentFields, needsPayment: boolean): FieldErrors {
  const e: FieldErrors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email address.";
  if (f.name.trim().length < 2) e.name = "Enter your full name.";
  if (!needsPayment) return e;

  const digits = f.card.replace(/\D/g, "");
  const amex = cardBrand(digits) === "Amex";
  if (digits.length !== (amex ? 15 : 16) || !luhn(digits)) e.card = "Your card number is invalid.";

  const [mm, yy] = f.expiry.split("/").map((s) => Number(s.trim()));
  const now = new Date();
  const expired = !mm || mm > 12 || !yy || 2000 + yy < now.getFullYear() || (2000 + yy === now.getFullYear() && mm < now.getMonth() + 1);
  if (expired) e.expiry = "Your card's expiration date is invalid.";

  if (f.cvc.length !== (amex ? 4 : 3)) e.cvc = "Your card's security code is incomplete.";
  if (f.cardName.trim().length < 2) e.cardName = "Enter the name on your card.";
  if (f.country === "United States" && !/^\d{5}$/.test(f.zip)) e.zip = "Enter a 5-digit ZIP code.";
  return e;
}

export function formatCard(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 16);
  if (cardBrand(d) === "Amex") return d.slice(0, 15).replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "));
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

const inputBase =
  "h-12 w-full bg-white px-3.5 text-[0.95rem] text-ink placeholder:text-ink-mute/70 transition-shadow focus:relative focus:z-10 focus:outline-none focus:ring-2 focus:ring-maroon/25";

export function Field({
  label,
  error,
  children,
  aside,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-ink-soft">{label}</span>
        {aside}
      </div>
      {children}
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
}

export function TextInput({
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      aria-invalid={error || undefined}
      className={cn(inputBase, "rounded-xl border", error ? "border-danger" : "border-sand-deep/70", className)}
    />
  );
}

export function CardFields({
  fields,
  errors,
  set,
  onFillTest,
}: {
  fields: PaymentFields;
  errors: FieldErrors;
  set: <K extends keyof PaymentFields>(k: K, v: PaymentFields[K]) => void;
  onFillTest: () => void;
}) {
  const brand = cardBrand(fields.card);
  const cardErr = errors.card || errors.expiry || errors.cvc;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-xl border-2 border-maroon bg-maroon-soft/40 px-3.5 py-2 text-sm font-semibold text-maroon">
          <CreditCard className="size-4" /> Card
        </span>
        <button
          type="button"
          onClick={onFillTest}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-maroon transition-colors hover:bg-maroon-soft"
        >
          <Wand2 className="size-4" /> Use test card
        </button>
      </div>

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
              onChange={(e) => set("card", formatCard(e.target.value))}
              className={cn(inputBase, "rounded-t-xl pr-28 tracking-wide")}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 z-20 flex -translate-y-1/2 gap-1">
              {brand ? (
                <span className="rounded-md bg-ink px-2 py-1 text-[0.65rem] font-bold tracking-wider text-ivory uppercase">{brand}</span>
              ) : (
                ["Visa", "MC", "Amex"].map((b) => (
                  <span key={b} className="rounded-md border border-sand-deep/60 px-1.5 py-0.5 text-[0.6rem] font-bold tracking-wide text-ink-mute uppercase">
                    {b}
                  </span>
                ))
              )}
            </span>
          </div>
          <div className="grid grid-cols-2 border-t border-sand-deep/70">
            <input
              inputMode="numeric"
              autoComplete="off"
              aria-label="Expiration date"
              aria-invalid={!!errors.expiry || undefined}
              placeholder="MM / YY"
              value={fields.expiry}
              onChange={(e) => set("expiry", formatExpiry(e.target.value, fields.expiry))}
              className={cn(inputBase, "rounded-bl-xl border-r border-sand-deep/70")}
            />
            <div className="relative">
              <input
                inputMode="numeric"
                autoComplete="off"
                aria-label="Security code"
                aria-invalid={!!errors.cvc || undefined}
                placeholder="CVC"
                value={fields.cvc}
                onChange={(e) => set("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
                className={cn(inputBase, "rounded-br-xl pr-10")}
              />
              <Lock className="pointer-events-none absolute top-1/2 right-3.5 z-20 size-4 -translate-y-1/2 text-ink-mute" />
            </div>
          </div>
        </div>
        {cardErr && <p className="mt-1.5 text-sm text-danger">{cardErr}</p>}
      </div>

      <Field label="Name on card" error={errors.cardName}>
        <TextInput
          autoComplete="off"
          placeholder="Full name"
          value={fields.cardName}
          error={!!errors.cardName}
          onChange={(e) => set("cardName", e.target.value)}
        />
      </Field>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">Country or region</span>
        <div className={cn("rounded-xl border", errors.zip ? "border-danger" : "border-sand-deep/70")}>
          <select
            aria-label="Country or region"
            value={fields.country}
            onChange={(e) => set("country", e.target.value)}
            className={cn(inputBase, "cursor-pointer rounded-t-xl")}
          >
            {["United States", "Canada", "India", "United Kingdom"].map((c) => (
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
            onChange={(e) => set("zip", e.target.value.slice(0, 10))}
            className={cn(inputBase, "rounded-b-xl border-t border-sand-deep/70")}
          />
        </div>
        {errors.zip && <p className="mt-1.5 text-sm text-danger">{errors.zip}</p>}
      </div>
    </div>
  );
}
