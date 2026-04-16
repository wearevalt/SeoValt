import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

export function maskLicenseKey(key: string): string {
  const parts = key.split("-");
  if (parts.length < 2) return key;
  return parts
    .map((p, i) => (i > 0 && i < parts.length - 1 ? "••••" : p))
    .join("-");
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

export const PLANS = {
  free: {
    name: "Free",
    articles: 5,
    seoFixes: 10,
    pagespeedChecks: 5,
    sites: 1,
    price: { monthly: 0, yearly: 0 },
  },
  pro: {
    name: "Pro",
    articles: 50,
    seoFixes: -1, // unlimited
    pagespeedChecks: 100,
    sites: 3,
    price: { monthly: 19, yearly: 182 },
  },
  agency: {
    name: "Agency",
    articles: -1,
    seoFixes: -1,
    pagespeedChecks: -1,
    sites: 10,
    price: { monthly: 49, yearly: 470 },
  },
} as const;

export type PlanKey = keyof typeof PLANS;
