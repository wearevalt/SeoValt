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
      key: "solo",
      monthlyPrice: 49,
      yearlyPrice: 39,
      cta: t("cta_solo"),
      href: "/signup?plan=solo",
      featured: false,
      accent: "cyan",
      icon: "🧑‍💻",
    },
    {
      key: "pro",
      monthlyPrice: 89,
      yearlyPrice: 69,
      cta: t("cta_pro"),
      href: "/signup?plan=pro",
      featured: true,
      accent: "emerald",
      icon: "🚀",
    },
    {
      key: "agency",
      monthlyPrice: 199,
      yearlyPrice: 159,
      cta: t("cta_agency"),
      href: "/signup?plan=agency",
      featured: false,
      accent: "violet",
      icon: "🏢",
    },
  ];

  const yearlySavings = {
    solo: (49 - 39) * 12, // 120€
    pro: (89 - 69) * 12,  // 240€
    agency: (199 - 159) * 12, // 480€
  };

  const includedFeatures = [
    { key: "audit", icon: "📈" },
    { key: "corrections", icon: "⚡" },
    { key: "technical", icon: "🛠️" },
    { key: "geo", icon: "🌐" },
  ];

  return (
    <section id="pricing" className="relative py-24 px-4 sm:px-6 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
          ref={ref}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border border-border-b text-muted bg-surface-2 mb-4">
            {t("badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Included features bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-4 sm:p-6">
            <p className="text-sm font-semibold text-muted mb-4 text-center">
              {t("included_title")}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {includedFeatures.map((feature) => (
                <div key={feature.key} className="flex items-center justify-center gap-2">
                  <span className="text-xl">{feature.icon}</span>
                  <span className="text-sm text-text font-medium">
                    {t(`included_features.${feature.key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-3 p-1.5 rounded-2xl bg-surface border border-border shadow-lg">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200",
                !isYearly
                  ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25"
                  : "text-muted hover:text-text hover:bg-surface-2"
              )}
            >
              {t("monthly")}
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200",
                isYearly
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                  : "text-muted hover:text-text hover:bg-surface-2"
              )}
            >
              {t("yearly")}
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(({ key, monthlyPrice, yearlyPrice, cta, href, featured, accent, icon }, i) => {
            const features = t.raw(`plans.${key}.features`) as string[];
            const currentPrice = isYearly ? yearlyPrice : monthlyPrice;
            const originalPrice = isYearly ? monthlyPrice : null;
            const savings = yearlySavings[key as keyof typeof yearlySavings];

            const accentStyles = {
              cyan: {
                border: featured ? "border-cyan-400/50" : "border-cyan-500/20",
                glow: "shadow-[0_0_40px_#06b6d420]",
                badge: "bg-cyan-500 text-white",
                button: "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/25",
                checkmark: "text-cyan-400",
              },
              emerald: {
                border: "border-emerald-400/50",
                glow: "shadow-[0_0_40px_#10b98150]",
                badge: "bg-emerald-500 text-white",
                button: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/25",
                checkmark: "text-emerald-400",
              },
              violet: {
                border: featured ? "border-violet-400/50" : "border-violet-500/20",
                glow: "shadow-[0_0_40px_#8b5cf620]",
                badge: "bg-violet-500 text-white",
                button: "bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-white shadow-lg shadow-violet-500/25",
                checkmark: "text-violet-400",
              },
            };

            const colors = accentStyles[accent as keyof typeof accentStyles];

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className={cn(
                  "relative rounded-3xl p-6 border transition-all duration-300 bg-surface/80 backdrop-blur-sm",
                  "hover:bg-surface hover:scale-[1.02]",
                  colors.border,
                  featured && colors.glow
                )}
              >
                {/* Popular badge */}
                {featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className={cn(
                      "flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full shadow-lg",
                      colors.badge
                    )}>
                      <Zap className="w-3 h-3" />
                      {t("popular")}
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <h3 className="flex items-center gap-3 text-xl font-black text-text tracking-tight">
                    <span className="text-2xl">{icon}</span>
                    <span>{t(`plans.${key}.name`)}</span>
                  </h3>
                  <p className="text-sm text-muted mt-1 leading-relaxed">
                    {t(`plans.${key}.tagline`)}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-border">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-text font-mono tracking-tighter">
                      €{currentPrice}
                    </span>
                    <span className="text-sm text-muted">{t(isYearly ? "per_year" : "per_month")}</span>
                  </div>

                  {isYearly && originalPrice && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-sm text-muted line-through">
                        €{originalPrice}{t("per_month")}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 text-xs font-bold rounded-full",
                        featured ? "bg-emerald-500/20 text-emerald-400" : "bg-surface-2 text-muted"
                      )}>
                        {t("billed_yearly")}
                      </span>
                    </div>
                  )}

                  {isYearly && savings > 0 && (
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Zap className="w-3 h-3" />
                        {t("save_per_year", { amount: savings })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {features.map((f: string, fi: number) => (
                    <li key={fi} className="flex items-start gap-3">
                      <Check
                        className={cn(
                          "w-4 h-4 mt-0.5 flex-shrink-0",
                          colors.checkmark
                        )}
                      />
                      <span className="text-sm text-muted leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={href}
                  className={cn(
                    "block w-full text-center py-3.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200",
                    "hover:shadow-lg hover:scale-[1.02]",
                    colors.button
                  )}
                >
                  {cta}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Trust indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted">
            ✓ 7 jours d'essai gratuit • ✓ Sans engagement • ✓ Résiliable à tout moment
          </p>
        </motion.div>
      </div>
    </section>
  );
}
