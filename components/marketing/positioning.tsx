"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function Positioning() {
  const t = useTranslations("positioning");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const items = t.raw("items") as Array<{ title: string; description: string }>;

  return (
    <section id="positioning" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
          ref={ref}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-full border border-border-b text-muted bg-surface-2 mb-4">
            {t("badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-3 text-lg text-muted max-w-3xl mx-auto leading-8">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-[32px] border border-border p-6 bg-surface-2 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald/30 hover:shadow-[0_24px_80px_rgba(16,185,129,0.14)]"
            >
              <div className="absolute top-6 left-6 h-12 w-12 rounded-3xl bg-emerald/10 blur-2xl" />
              <div className="relative z-10 inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-emerald/10 text-emerald mb-4">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="relative z-10 text-base font-semibold text-text mb-2">
                {item.title}
              </h3>
              <p className="relative z-10 text-sm text-muted leading-7">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
