"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Download, Key, Rocket, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "install",   icon: Download, color: "emerald" },
  { key: "license",   icon: Key,      color: "cyan" },
  { key: "scan",      icon: CheckCircle2, color: "violet" },
  { key: "autopilot", icon: Rocket,   color: "emerald" },
];

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-hidden">
      {/* Subtle divider lines */}
      <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-border to-transparent pointer-events-none" aria-hidden />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          ref={ref}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border border-border-b text-muted bg-surface-2 mb-4">
            {t("badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text">
            {t("title")}
          </h2>
        </motion.div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {STEPS.map(({ key, icon: Icon, color }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="flex flex-col items-center text-center"
              >
                {/* Step number */}
                <div className="relative mb-5">
                  <div
                    className={cn(
                      "w-20 h-20 rounded-2xl flex items-center justify-center",
                      "border-2 transition-all duration-300",
                      color === "emerald" && "bg-emerald-dim border-emerald/30 text-emerald",
                      color === "cyan"    && "bg-cyan-dim    border-cyan/30    text-cyan",
                      color === "violet"  && "bg-violet-dim  border-violet/30  text-violet",
                    )}
                    style={{
                      boxShadow: `0 0 20px var(--${color}-dim)`,
                    }}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <span
                    className={cn(
                      "absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-black flex items-center justify-center",
                      "bg-background border-2",
                      color === "emerald" && "border-emerald text-emerald",
                      color === "cyan"    && "border-cyan    text-cyan",
                      color === "violet"  && "border-violet  text-violet",
                    )}
                  >
                    {i + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-text mb-2">
                  {t(`steps.${key}.title`)}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t(`steps.${key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
