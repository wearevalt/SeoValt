import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

export const STRIPE_PRICE_IDS = {
  pro_monthly:    process.env.STRIPE_PRICE_PRO_MONTHLY    ?? "",
  pro_yearly:     process.env.STRIPE_PRICE_PRO_YEARLY     ?? "",
  agency_monthly: process.env.STRIPE_PRICE_AGENCY_MONTHLY ?? "",
  agency_yearly:  process.env.STRIPE_PRICE_AGENCY_YEARLY  ?? "",
} as const;
