export type Promo = {
  code: string;
  label: string;
  /** percent: value is a fraction (0.1 = 10%); amount: dollars off; fee: waives the service fee */
  kind: "percent" | "amount" | "fee";
  value: number;
  /** Minimum subtotal for the code to apply. */
  minSubtotal?: number;
};

/** Demo promo codes. Add or edit codes here. */
export const PROMOS: Promo[] = [
  { code: "MILAN10", label: "10% off", kind: "percent", value: 0.1 },
  { code: "FIRSTFEST", label: "$10 off your first order", kind: "amount", value: 10, minSubtotal: 30 },
  { code: "COMMUNITY", label: "Service fee waived", kind: "fee", value: 0 },
];

export function findPromo(code: string, subtotal: number): { promo: Promo | null; error?: string } {
  const promo = PROMOS.find((p) => p.code === code.trim().toUpperCase());
  if (!promo) return { promo: null, error: "That code isn't valid." };
  if (subtotal <= 0) return { promo: null, error: "Promo codes apply to paid orders only." };
  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return { promo: null, error: `This code needs a subtotal of $${promo.minSubtotal} or more.` };
  }
  return { promo };
}
