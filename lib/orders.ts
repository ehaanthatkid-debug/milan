"use client";

import { useSyncExternalStore } from "react";
import type { OrderKind, OrderLine, PlanId, ScheduledPayment } from "./checkout";

/**
 * Completed orders and the visitor's saved checkout details, kept in this
 * browser's localStorage. In production these would live in a database.
 * Only a card's brand and last four digits are ever saved — never the number.
 */

export type PaymentInfo = { method: "card" | "apple_pay" | "google_pay" | "none"; brand?: string; last4?: string };

export type StoredOrder = {
  number: string;
  createdAt: string;
  kind: OrderKind;
  slug: string;
  eyebrow: string;
  title: string;
  image: string;
  facts: { label: string; value: string }[];
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  serviceFee: number;
  deposit: number;
  total: number;
  paidToday: number;
  plan: PlanId;
  schedule: ScheduledPayment[];
  date?: string;
  blockDates: string[];
  tickets?: { tierIndex: number; tierName: string; codes: string[] };
  email: string;
  name: string;
  payment: PaymentInfo;
  calendar?: { title: string; start: string; end: string; location: string };
};

export type SavedProfile = {
  email: string;
  name: string;
  phone: string;
  card?: { brand: string; last4: string; expiry: string };
};

const ORDERS_KEY = "milan.orders.v1";
const PROFILE_KEY = "milan.profile.v1";
const CHANGE_EVENT = "milan-store-change";

function read(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private mode or blocked storage: the order still completes, it just isn't remembered.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const EMPTY: StoredOrder[] = [];
let cachedRaw: string | null = null;
let cachedOrders: StoredOrder[] = EMPTY;

function getOrdersSnapshot() {
  const raw = read(ORDERS_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedOrders = raw ? (JSON.parse(raw) as StoredOrder[]) : EMPTY;
    } catch {
      cachedOrders = EMPTY;
    }
  }
  return cachedOrders;
}

export function useOrders() {
  return useSyncExternalStore(subscribe, getOrdersSnapshot, () => EMPTY);
}

export function saveOrder(order: StoredOrder) {
  write(ORDERS_KEY, JSON.stringify([order, ...getOrdersSnapshot()]));
}

export function clearOrders() {
  write(ORDERS_KEY, JSON.stringify([]));
}

let cachedProfileRaw: string | null = null;
let cachedProfile: SavedProfile | null = null;

function getProfileSnapshot() {
  const raw = read(PROFILE_KEY);
  if (raw !== cachedProfileRaw) {
    cachedProfileRaw = raw;
    try {
      cachedProfile = raw ? (JSON.parse(raw) as SavedProfile) : null;
    } catch {
      cachedProfile = null;
    }
  }
  return cachedProfile;
}

export function useSavedProfile() {
  return useSyncExternalStore(subscribe, getProfileSnapshot, () => null);
}

export function saveProfile(profile: SavedProfile) {
  write(PROFILE_KEY, JSON.stringify(profile));
}

export function forgetProfile() {
  try {
    window.localStorage.removeItem(PROFILE_KEY);
  } catch {
    // Nothing to remove.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Dates already taken by this visitor's own rentals or bookings. */
export function blockedDates(orders: StoredOrder[], kind: "rent" | "booking", slug: string) {
  return orders.filter((o) => o.kind === kind && o.slug === slug).flatMap((o) => o.blockDates);
}

export function ticketsBought(orders: StoredOrder[], slug: string, tierIndex: number) {
  return orders
    .filter((o) => o.kind === "event" && o.slug === slug && o.tickets?.tierIndex === tierIndex)
    .reduce((n, o) => n + (o.tickets?.codes.length ?? 0), 0);
}
