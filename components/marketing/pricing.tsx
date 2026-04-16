"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pricing() {
  const t = useTranslations("pricing");
  const [isYearly, setIsYearly] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const plans = [
    {
      key: "free",
      price: { monthly: 0, yearly: 0 },
      cta: t("cta_free"),
      href: "/signup",
      style: "border-border",
      featured: false,
    },
    {
      key: "pro",
      price: { monthly: 19, yearly: 182 },
      cta: t("cta_pro"),
      href: "/signup?plan=pro",
      style: "border-emerald/40",
      featured: true,
    },
    {
      key: "agency",
      price: { monthly: 49, yearly: 470 },
      cta: t("cta_agency"),
      href: "/signup?plan=agency",
      style: "border-violet/30",
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
          ref={ref}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border border-border-b text-muted bg-surface-2 mb-4">
            {t("badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted">{t("subtitle")}</p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1 rounded-xl bg-surface border border-border">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                !isYearly ? "bg-surface-2 text-text shadow-sm" : "text-muted hover:text-text"
              )}
            >
              {t("monthly")}
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all",
                isYearly ? "bg-surface-2 text-text shadow-sm" : "text-muted hover:text-text"
              )}
            >
              {t("yearly")}
              <span className="px-1.5 py-0.5 text-xs font-bold rounded bg-emerald text-background">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(({ key, price, cta, href, style, featured }, i) => {
            const features = t.raw(`plans.${key}.features`) as string[];
            const currentPrice = isYearly ? price.yearly : price.monthly;
            const perUnit = isYearly ? t("per_year") : t("per_month");

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className={cn(
                  "relative rounded-2xl p-6 border transition-all duration-300",
                  "bg-surface",
                  style,
                  featured && "border-emerald/50 shadow-[0_0_40px_#10b98120]",
                  key === "agency" && "border-grad-vi"
                )}
              >
                {featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-emerald text-background shadow-[0_0_12px_#10b98150]">
                      <Zap className="w-3 h-3" />
                      {t("popular")}
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-text">{t(`plans.${key}.name`)}</h3>
                  <p className="text-xs text-muted mt-0.5">{t(`plans.${key}.tagline`)}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-text font-mono">
                      {currentPrice === 0 ? "€0" : `€${currentPrice}`}
                    </span>
                    {currentPrice > 0 && (
                      <span className="text-sm text-muted">{perUnit}</span>
                    )}
                  </div>
                  {isYearly && currentPrice > 0 && (
                    <p className="text-xs text-muted mt-1">{t("billed_yearly")}</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6">
                  {features.map((f: string, fi: number) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={cn(
                          "w-4 h-4 mt-0.5 flex-shrink-0",
                          featured ? "text-emerald" : key === "agency" ? "text-violet" : "text-muted"
                        )}
                      />
                      <span className="text-muted">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={href}
                  className={cn(
                    "block w-full text-center py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200",
                    featured
                      ? "bg-emerald text-background hover:bg-emerald-br glow-em-sm hover:glow-em"
                      : key === "agency"
                      ? "bg-violet/20 text-violet border border-violet/30 hover:bg-violet/30"
                      : "bg-surface-2 text-text border border-border hover:border-border-b"
                  )}
                >
                  {cta}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
