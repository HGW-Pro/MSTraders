import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Pricing convention used across the app (see lib/store.ts, which charges
 * `sale_price ?? price`): `sale_price` is the price the customer actually
 * pays when set; `price` is the list price it is discounted from.
 *
 * Returns the effective unit price plus, if there is a real discount, the
 * list price to show struck through.
 */
export function getPricing(p: { price?: number | null; sale_price?: number | null }) {
  const list = p.price ?? null;
  const sale = p.sale_price ?? null;
  const effective = sale ?? list;
  const isDiscounted = sale !== null && list !== null && sale < list;
  return {
    effective,                       // what the customer pays; null = quote only
    compareAt: isDiscounted ? list : null, // struck-through list price, or null
    isDiscounted,
  };
}

export function formatInr(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '';
  return `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(amount)}`;
}
