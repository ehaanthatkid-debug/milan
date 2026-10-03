export const CITIES = ["Seattle", "Bellevue", "Redmond", "Sammamish", "Kirkland"] as const;
export type City = (typeof CITIES)[number];

/** Milan's service fee, shown as a line item at checkout. */
export const SERVICE_FEE_RATE = 0.06;
